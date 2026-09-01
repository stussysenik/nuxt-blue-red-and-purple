import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);
  const id = event.context.params?.id;

  const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  const blocks = db
    .prepare('SELECT * FROM blocks WHERE page_id = ? ORDER BY sort_order ASC')
    .all(id);

  // Parse JSON fields
  const parsedBlocks = blocks.map((b: any) => ({
    ...b,
    content: JSON.parse(b.content || '{}'),
    styles: JSON.parse(b.styles || '{}'),
  }));

  return { ...page, blocks: parsedBlocks };
});
