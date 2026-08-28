import db from '~/server/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { path } = body as { path?: string };

  if (path) {
    db.prepare('INSERT INTO page_views (path) VALUES (?)').run(path);
  }

  return { success: true };
});
