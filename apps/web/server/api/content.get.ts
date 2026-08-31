import db from '~/server/db';

export default defineEventHandler(() => {
  const rows = db.prepare('SELECT key, value FROM content ORDER BY key').all() as {
    key: string;
    value: string;
  }[];

  return rows.reduce(
    (acc, row) => {
      acc[row.key] = row.value;
      return acc;
    },
    {} as Record<string, string>
  );
});
