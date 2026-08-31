import db from '~/server/db';
import { broadcastUpdate } from '~/server/utils/sync';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { key, value } = body as { key?: string; value?: string };

  if (!key || value === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'key and value are required' });
  }

  db.prepare(`
    INSERT INTO content (key, value, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()
  `).run(key, value);

  // Broadcast to connected clients for real-time sync
  broadcastUpdate({
    type: 'content_update',
    key,
    value,
    timestamp: Date.now(),
  });

  return { success: true, key, value };
});
