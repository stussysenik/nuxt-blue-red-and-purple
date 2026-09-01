import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { generateId } from '~/server/utils/id';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const body = await readBody(event);
  const { slug, title, category = 'music', year = 2024, image = '', summary = '', palette = [], mechanic = '', source = '', is_real = 0, is_hidden = 0 } = body;

  if (!slug || !title) {
    throw createError({ statusCode: 400, statusMessage: 'slug and title required' });
  }

  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  const existing = db.prepare('SELECT id FROM works WHERE slug = ?').get(cleanSlug);
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'A work with this slug already exists' });
  }

  const id = generateId('work');
  const maxSort = (db.prepare('SELECT MAX(sort_order) as m FROM works').get() as any)?.m ?? -1;

  db.prepare(`
    INSERT INTO works (id, slug, title, category, year, image, summary, palette, mechanic, source, is_real, is_hidden, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, cleanSlug, title, category, year, image, summary, JSON.stringify(palette), mechanic, source, is_real ? 1 : 0, is_hidden ? 1 : 0, maxSort + 1);

  db.prepare(`
    INSERT INTO activity_log (action, entity_type, entity_id, payload, created_by)
    VALUES ('create', 'work', ?, ?, ?)
  `).run(id, JSON.stringify({ slug: cleanSlug, title }), admin.adminId);

  return { id, slug: cleanSlug, title };
});
