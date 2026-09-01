import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const id = event.context.params?.id;

  const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  if ((page as any).is_home) {
    throw createError({ statusCode: 400, statusMessage: 'Cannot delete the homepage' });
  }

  // Cascading delete: blocks and revisions deleted via FK or manually
  db.prepare('DELETE FROM blocks WHERE page_id = ?').run(id);
  db.prepare('DELETE FROM revisions WHERE page_id = ?').run(id);
  db.prepare('DELETE FROM pages WHERE id = ?').run(id);

  return { success: true, id };
});
