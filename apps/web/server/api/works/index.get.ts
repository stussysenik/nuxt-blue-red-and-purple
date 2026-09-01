import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);
  const category = event.query.category as string;

  let query = 'SELECT * FROM works';
  const params: any[] = [];

  if (category && category !== 'all') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY is_real DESC, sort_order ASC, year DESC';

  const works = db.prepare(query).all(...params);

  return works.map((w: any) => ({
    ...w,
    palette: JSON.parse(w.palette || '[]'),
  }));
});
