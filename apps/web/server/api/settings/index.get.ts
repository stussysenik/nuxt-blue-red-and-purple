import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);

  const rows = db.prepare('SELECT key, value FROM settings ORDER BY key').all() as {
    key: string;
    value: string;
  }[];

  return rows.reduce(
    (acc, row) => {
      acc[row.key] = row.value;
      return acc;
    },
    {} as Record<string, string>,
  );
});
