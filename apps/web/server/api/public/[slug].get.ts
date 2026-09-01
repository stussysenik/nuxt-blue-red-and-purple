import db from '~/server/db';

// Public endpoint: get a single page with its blocks by slug (no auth required)
export default defineEventHandler((event) => {
  const slug = event.context.params?.slug || 'index';

  // Resolve slug to page — 'index' or '/' maps to the homepage
  const pageSlug = (slug === 'index' || slug === '/') ? '/' : (slug.startsWith('/') ? slug : `/${slug}`);

  const page = db
    .prepare('SELECT * FROM pages WHERE slug = ? AND is_published = 1')
    .get(pageSlug);

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  const blocks = db
    .prepare('SELECT * FROM blocks WHERE page_id = ? ORDER BY sort_order ASC')
    .all((page as any).id);

  const parsedBlocks = blocks.map((b: any) => ({
    ...b,
    content: JSON.parse(b.content || '{}'),
    styles: JSON.parse(b.styles || '{}'),
  }));

  return { ...page, blocks: parsedBlocks };
});
