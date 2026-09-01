import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const body = await readBody(event);
  const { page_id, type, content = {}, styles = {} } = body;

  if (!page_id || !type) {
    throw createError({ statusCode: 400, statusMessage: 'page_id and type required' });
  }

  const page = db.prepare('SELECT id FROM pages WHERE id = ?').get(page_id);
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  // Get next sort order
  const maxSort = (db.prepare('SELECT MAX(sort_order) as m FROM blocks WHERE page_id = ?').get(page_id) as any)?.m ?? -1;

  const id = generateId('blk');
  db.prepare(`
    INSERT INTO blocks (id, page_id, type, content, styles, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, page_id, type, JSON.stringify(content), JSON.stringify(styles), maxSort + 1);

  // Update page timestamp
  db.prepare('UPDATE pages SET updated_at = unixepoch() WHERE id = ?').run(page_id);

  // Create revision snapshot
  await createSnapshot(page_id, admin.adminId, `add:${type}`);

  const block = db.prepare('SELECT * FROM blocks WHERE id = ?').get(id);
  return {
    ...block,
    content: JSON.parse((block as any).content),
    styles: JSON.parse((block as any).styles),
  };
});

async function createSnapshot(pageId: string, adminId: number, action: string) {
  const blocks = db
    .prepare('SELECT id, type, content, styles, sort_order FROM blocks WHERE page_id = ? ORDER BY sort_order')
    .all(pageId);

  const snapshot = JSON.stringify({
    blocks: blocks.map((b: any) => ({
      id: b.id,
      type: b.type,
      content: JSON.parse(b.content),
      styles: JSON.parse(b.styles),
      sort_order: b.sort_order,
    })),
  });

  db.prepare(`
    INSERT INTO revisions (id, page_id, action, snapshot, block_count, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(generateId('rev'), pageId, action, snapshot, blocks.length, adminId);
}
