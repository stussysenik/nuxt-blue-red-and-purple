import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);
  const id = event.context.params?.id;

  const revision = db
    .prepare(`
      SELECT r.*, a.email as created_by_email
      FROM revisions r
      LEFT JOIN admins a ON a.id = r.created_by
      WHERE r.id = ?
    `)
    .get(id);

  if (!revision) {
    throw createError({ statusCode: 404, statusMessage: 'Revision not found' });
  }

  const r = revision as any;
  return {
    ...r,
    snapshot: JSON.parse(r.snapshot),
  };
});
