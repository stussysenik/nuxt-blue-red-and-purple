import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const id = event.context.params?.id;

  const work = db.prepare('SELECT * FROM works WHERE id = ?').get(id);
  if (!work) {
    throw createError({ statusCode: 404, statusMessage: 'Work not found' });
  }

  db.prepare('DELETE FROM works WHERE id = ?').run(id);

  return { success: true, id };
});
