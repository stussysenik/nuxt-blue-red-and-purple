import db from '~/server/db';

export default defineEventHandler(() => {
  const flags = db.prepare('SELECT key, value FROM feature_flags').all() as {
    key: string;
    value: number;
  }[];

  return flags.reduce(
    (acc, f) => {
      acc[f.key] = f.value === 1;
      return acc;
    },
    {} as Record<string, boolean>
  );
});
