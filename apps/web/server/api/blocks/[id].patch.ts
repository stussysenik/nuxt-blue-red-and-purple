import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const id = event.context.params?.id;
  const body = await readBody(event);

  const block = db.prepare('SELECT * FROM blocks WHERE id = ?').get(id);
  if (!block) {
    throw createError({ statusCode: 404, statusMessage: 'Block not found' });
  }

  const current = block as any;
  const content = body.content !== undefined
    ? JSON.stringify(body.content)
    : current.content;
  const styles = body.styles !== undefined
    ? JSON.stringify(body.styles)
    : current.styles;
  const sortOrder = body.sort_order !== undefined ? body.sort_order : current.sort_order;

  db.prepare(`
    UPDATE blocks
    SET content = ?, styles = ?, sort_order = ?, updated_at = unixepoch()
    WHERE id = ?
  `).run(content, styles, sortOrder, id);

  // Update page timestamp
  db.prepare('UPDATE pages SET updated_at = unixepoch() WHERE id = ?').run(current.page_id);

  // Snapshot
  await createSnapshot(current.page_id, admin.adminId, `edit:${current.type}`);

  const updated = db.prepare('SELECT * FROM blocks WHERE id = ?').get(id);
  return {
    ...updated,
    content: JSON.parse((updated as any).content),
    styles: JSON.parse((updated as any).styles),
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
