import db from '~/server/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler((event) => {
  requireAuth(event);

  const pages = db
    .prepare(
      `SELECT p.*,
        (SELECT COUNT(*) FROM blocks b WHERE b.page_id = p.id) as block_count,
        (SELECT COUNT(*) FROM revisions r WHERE r.page_id = p.id) as revision_count
       FROM pages p
       ORDER BY p.is_home DESC, p.sort_order ASC, p.title ASC`
    )
    .all();

  return pages;
});
