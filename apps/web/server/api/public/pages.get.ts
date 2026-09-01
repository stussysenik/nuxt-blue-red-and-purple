import db from '~/server/db';

// Public endpoint: list all published pages (no auth required)
export default defineEventHandler(() => {
  const pages = db
    .prepare(
      `SELECT id, slug, title, description, is_home, sort_order
       FROM pages
       WHERE is_published = 1
       ORDER BY is_home DESC, sort_order ASC, title ASC`
    )
    .all();

  return pages;
});
