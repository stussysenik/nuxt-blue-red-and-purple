import db from '~/server/db';

export default defineNitroPlugin(() => {
  // Database is initialized on import via server/db.ts
  // This plugin verifies the connection is working
  try {
    const row = db.prepare('SELECT COUNT(*) as count FROM toolbar_state').get() as { count: number } | undefined;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB] SQLite ready — toolbar_state rows: ${row?.count ?? 0}`);
    }
  } catch (err) {
    console.error('[DB] Failed to verify database:', err);
  }
});
