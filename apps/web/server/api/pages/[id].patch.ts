import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const id = event.context.params?.id;
  const body = await readBody(event);

  const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(id);
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (body.title !== undefined) { fields.push('title = ?'); values.push(body.title); }
  if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }
  if (body.is_published !== undefined) { fields.push('is_published = ?'); values.push(body.is_published ? 1 : 0); }
  if (body.sort_order !== undefined) { fields.push('sort_order = ?'); values.push(body.sort_order); }

  if (body.slug !== undefined) {
    const cleanSlug = body.slug.startsWith('/') ? body.slug : `/${body.slug}`;
    const conflict = db.prepare('SELECT id FROM pages WHERE slug = ? AND id != ?').get(cleanSlug, id);
    if (conflict) {
      throw createError({ statusCode: 409, statusMessage: 'Slug already in use' });
    }
    fields.push('slug = ?');
    values.push(cleanSlug);
  }

  if (body.is_home) {
    db.prepare('UPDATE pages SET is_home = 0 WHERE is_home = 1 AND id != ?').run(id);
    fields.push('is_home = 1');
  }

  if (fields.length === 0) {
    return { success: true, message: 'No changes' };
  }

  fields.push('updated_at = unixepoch()');
  values.push(id);

  db.prepare(`UPDATE pages SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  db.prepare(`
    INSERT INTO activity_log (action, entity_type, entity_id, payload, created_by)
    VALUES ('update', 'page', ?, ?, ?)
  `).run(id, JSON.stringify(body), admin.adminId);

  return { success: true, id };
});
