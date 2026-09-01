import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);

  const upsert = db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()
  `);

  const updates = Object.entries(body).filter(([key]) => typeof key === 'string');
  for (const [key, value] of updates) {
    upsert.run(key, typeof value === 'string' ? value : JSON.stringify(value));
  }

  return { success: true, updated: updates.length };
});
