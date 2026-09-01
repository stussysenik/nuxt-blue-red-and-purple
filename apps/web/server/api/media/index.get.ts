import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);
  const limit = Math.min(Number(event.query.limit) || 50, 100);
  const offset = Number(event.query.offset) || 0;

  const media = db
    .prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(limit, offset);

  const total = (db.prepare('SELECT COUNT(*) as n FROM media').get() as any).n;

  return { items: media, total, limit, offset };
});
