import db from '~/server/db';

// Public endpoint: get works for the front-end display (no auth required)
export default defineEventHandler((event) => {
  const category = event.query.category as string;

  let query = 'SELECT * FROM works WHERE is_hidden = 0';
  const params: any[] = [];

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY is_real DESC, sort_order ASC, year DESC';

  const works = db.prepare(query).all(...params);

  return works.map((w: any) => ({
    ...w,
    palette: JSON.parse(w.palette || '[]'),
  }));
});
