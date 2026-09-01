import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const body = await readBody(event);
  const { revision_id } = body;

  if (!revision_id) {
    throw createError({ statusCode: 400, statusMessage: 'revision_id required' });
  }

  const revision = db.prepare('SELECT * FROM revisions WHERE id = ?').get(revision_id);
  if (!revision) {
    throw createError({ statusCode: 404, statusMessage: 'Revision not found' });
  }

  const rev = revision as any;
  const snapshot = JSON.parse(rev.snapshot);
  const pageId = rev.page_id;

  // Restore: delete current blocks, recreate from snapshot
  const restore = db.transaction(() => {
    // Delete all current blocks for this page
    db.prepare('DELETE FROM blocks WHERE page_id = ?').run(pageId);

    // Recreate blocks from snapshot
    if (snapshot.blocks) {
      const insert = db.prepare(`
        INSERT INTO blocks (id, page_id, type, content, styles, sort_order)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      for (const block of snapshot.blocks) {
        insert.run(
          block.id || generateId('blk'),
          pageId,
          block.type,
          JSON.stringify(block.content || {}),
          JSON.stringify(block.styles || {}),
          block.sort_order || 0,
        );
      }
    }

    // Create a new revision marking this as a restore
    const newBlocks = db
      .prepare('SELECT id, type, content, styles, sort_order FROM blocks WHERE page_id = ? ORDER BY sort_order')
      .all(pageId);

    const newSnapshot = JSON.stringify({
      blocks: newBlocks.map((b: any) => ({
        id: b.id,
        type: b.type,
        content: JSON.parse(b.content),
        styles: JSON.parse(b.styles),
        sort_order: b.sort_order,
      })),
    });

    db.prepare(`
      INSERT INTO revisions (id, page_id, action, snapshot, block_count, created_by)
      VALUES (?, ?, 'restore', ?, ?, ?)
    `).run(generateId('rev'), pageId, newSnapshot, newBlocks.length, admin.adminId);
  });

  restore();
  db.prepare('UPDATE pages SET updated_at = unixepoch() WHERE id = ?').run(pageId);

  // Return restored page
  const blocks = db.prepare('SELECT * FROM blocks WHERE page_id = ? ORDER BY sort_order ASC').all(pageId);
  return {
    success: true,
    page_id: pageId,
    blocks: blocks.map((b: any) => ({
      ...b,
      content: JSON.parse(b.content),
      styles: JSON.parse(b.styles),
    })),
  };
});
