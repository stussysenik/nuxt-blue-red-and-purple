import db from '~/server/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { visible, incrementScroll } = body as {
    visible?: boolean;
    incrementScroll?: boolean;
  };

  if (visible !== undefined) {
    db.prepare(`
      UPDATE toolbar_state
      SET visible = ?,
          last_hidden_at = CASE WHEN ? = 0 THEN unixepoch() ELSE last_hidden_at END,
          updated_at = unixepoch()
      WHERE id = 1
    `).run(visible ? 1 : 0, visible ? 1 : 0);
  }

  if (incrementScroll) {
    db.prepare(`
      UPDATE toolbar_state
      SET scroll_count = scroll_count + 1,
          updated_at = unixepoch()
      WHERE id = 1
    `).run();
  }

  return { success: true };
});
