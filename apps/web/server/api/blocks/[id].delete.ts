import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const id = event.context.params?.id;

  const block = db.prepare('SELECT * FROM blocks WHERE id = ?').get(id);
  if (!block) {
    throw createError({ statusCode: 404, statusMessage: 'Block not found' });
  }

  const pageId = (block as any).page_id;
  const sortOrder = (block as any).sort_order;

  db.prepare('DELETE FROM blocks WHERE id = ?').run(id);

  // Reorder remaining blocks
  db.prepare('UPDATE blocks SET sort_order = sort_order - 1 WHERE page_id = ? AND sort_order > ?').run(pageId, sortOrder);

  db.prepare('UPDATE pages SET updated_at = unixepoch() WHERE id = ?').run(pageId);

  // Snapshot
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
    VALUES (?, ?, 'delete', ?, ?, ?)
  `).run(generateId('rev'), pageId, snapshot, blocks.length, admin.adminId);

  return { success: true, id };
});
