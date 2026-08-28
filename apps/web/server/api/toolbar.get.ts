import db from '~/server/db';

export default defineEventHandler(() => {
  const state = db.prepare('SELECT * FROM toolbar_state WHERE id = 1').get() as {
    visible: number;
    last_hidden_at: number | null;
    scroll_count: number;
    updated_at: number;
  };

  const flags = db.prepare('SELECT key, value FROM feature_flags').all() as {
    key: string;
    value: number;
  }[];

  const featureFlags = flags.reduce(
    (acc, f) => {
      acc[f.key] = f.value === 1;
      return acc;
    },
    {} as Record<string, boolean>
  );

  return {
    visible: state.visible === 1,
    lastHiddenAt: state.last_hidden_at,
    scrollCount: state.scroll_count,
    featureFlags,
  };
});
