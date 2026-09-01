import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const admin = requireAuth(event);
  const id = event.context.params?.id;
  const body = await readBody(event);

  const work = db.prepare('SELECT * FROM works WHERE id = ?').get(id);
  if (!work) {
    throw createError({ statusCode: 404, statusMessage: 'Work not found' });
  }

  const w = work as any;
  const fields: string[] = [];
  const values: any[] = [];

  const textFields = ['title', 'category', 'year', 'image', 'summary', 'mechanic', 'source', 'slug'];
  for (const f of textFields) {
    if (body[f] !== undefined) {
      fields.push(`${f} = ?`);
      values.push(body[f]);
    }
  }

  if (body.palette !== undefined) {
    fields.push('palette = ?');
    values.push(JSON.stringify(body.palette));
  }
  if (body.is_real !== undefined) {
    fields.push('is_real = ?');
    values.push(body.is_real ? 1 : 0);
  }
  if (body.is_hidden !== undefined) {
    fields.push('is_hidden = ?');
    values.push(body.is_hidden ? 1 : 0);
  }
  if (body.sort_order !== undefined) {
    fields.push('sort_order = ?');
    values.push(body.sort_order);
  }

  if (fields.length === 0) return { success: true, message: 'No changes' };

  fields.push('updated_at = unixepoch()');
  values.push(id);

  db.prepare(`UPDATE works SET ${fields.join(', ')} WHERE id = ?`).run(...values);

  db.prepare(`
    INSERT INTO activity_log (action, entity_type, entity_id, payload, created_by)
    VALUES ('update', 'work', ?, ?, ?)
  `).run(id, JSON.stringify(body), admin.adminId);

  const updated = db.prepare('SELECT * FROM works WHERE id = ?').get(id);
  return { ...updated, palette: JSON.parse((updated as any).palette || '[]') };
});
