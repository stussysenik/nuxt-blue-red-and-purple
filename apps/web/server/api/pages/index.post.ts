import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const body = await readBody(event);
  const { slug, title, description = '', is_home = 0 } = body;

  if (!slug || !title) {
    throw createError({ statusCode: 400, statusMessage: 'slug and title required' });
  }

  // Ensure slug starts with / and is unique
  const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const existing = db.prepare('SELECT id FROM pages WHERE slug = ?').get(cleanSlug);
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'A page with this slug already exists' });
  }

  // If setting as home, unset any existing home
  if (is_home) {
    db.prepare('UPDATE pages SET is_home = 0 WHERE is_home = 1').run();
  }

  const id = generateId('page');
  const maxSort = (db.prepare('SELECT MAX(sort_order) as m FROM pages').get() as any)?.m ?? -1;

  db.prepare(`
    INSERT INTO pages (id, slug, title, description, is_home, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, cleanSlug, title, description, is_home ? 1 : 0, maxSort + 1);

  // Create initial revision snapshot
  const snapshot = JSON.stringify({ blocks: [], meta: { title, slug: cleanSlug } });
  db.prepare(`
    INSERT INTO revisions (id, page_id, action, snapshot, block_count, created_by)
    VALUES (?, ?, 'create', ?, 0, ?)
  `).run(generateId('rev'), id, snapshot, admin.adminId);

  db.prepare(`
    INSERT INTO activity_log (action, entity_type, entity_id, payload)
    VALUES ('create', 'page', ?, ?)
  `).run(id, JSON.stringify({ slug: cleanSlug, title }));

  return { id, slug: cleanSlug, title };
});
