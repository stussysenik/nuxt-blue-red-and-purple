import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);
  const pageId = event.query.page_id as string;
  const limit = Math.min(Number(event.query.limit) || 50, 100);

  if (!pageId) {
    throw createError({ statusCode: 400, statusMessage: 'page_id query param required' });
  }

  const revisions = db
    .prepare(`
      SELECT r.*, a.email as created_by_email
      FROM revisions r
      LEFT JOIN admins a ON a.id = r.created_by
      WHERE r.page_id = ?
      ORDER BY r.created_at DESC
      LIMIT ?
    `)
    .all(pageId, limit);

  return revisions.map((r: any) => ({
    ...r,
    snapshot: JSON.parse(r.snapshot),
  }));
});
