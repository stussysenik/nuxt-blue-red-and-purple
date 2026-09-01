import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const body = await readBody(event);
  const { page_id, block_ids } = body;

  if (!page_id || !Array.isArray(block_ids)) {
    throw createError({ statusCode: 400, statusMessage: 'page_id and block_ids array required' });
  }

  const update = db.prepare('UPDATE blocks SET sort_order = ?, updated_at = unixepoch() WHERE id = ? AND page_id = ?');
  const reorder = db.transaction(() => {
    block_ids.forEach((blockId: string, index: number) => {
      update.run(index, blockId, page_id);
    });
  });
  reorder();

  db.prepare('UPDATE pages SET updated_at = unixepoch() WHERE id = ?').run(page_id);

  // Snapshot
  const blocks = db
    .prepare('SELECT id, type, content, styles, sort_order FROM blocks WHERE page_id = ? ORDER BY sort_order')
    .all(page_id);

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
    VALUES (?, ?, 'reorder', ?, ?, ?)
  `).run(generateId('rev'), page_id, snapshot, blocks.length, admin.adminId);

  return { success: true, page_id, block_count: block_ids.length };
});
