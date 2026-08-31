import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';
import { broadcastUpdate } from '~/server/utils/sync';

export default defineEventHandler(async (event) => {
  requireAuth(event);
  const body = await readBody(event);
  const { key, value } = body as { key?: string; value?: string };

  if (!key || value === undefined) {
    throw createError({ statusCode: 400, statusMessage: 'key and value are required' });

  }

  const existing = db.prepare('SELECT value FROM content WHERE key = ?').get(key) as { value: string } | undefined;

  db.prepare(`
    INSERT INTO content (key, value, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()
  `).run(key, value);

  // Log activity
  db.prepare(`
    INSERT INTO activity_log (action, entity_type, entity_id, payload)
    VALUES (?, 'content', ?, ?)
  `).run(
    existing ? 'update' : 'create',
    key,
    JSON.stringify({ key, value, previous: existing?.value ?? null }),
  );

  // Broadcast to connected clients
  broadcastUpdate({
    type: 'content_update',
    key,
    value,
    timestamp: Date.now(),
  });

  return { success: true, key, value };
});
