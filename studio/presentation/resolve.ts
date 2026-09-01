import { defineLocations } from 'sanity/presentation'

export const resolve = {
  locations: {
    home: defineLocations({
      select: { title: 'tagline' },
      resolve: () => ({
        locations: [{ title: 'Home Page', href: '/' }],
      }),
    }),
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: doc?.slug ? `/${doc.slug}` : '/',
          },
          { title: 'Home', href: '/' },
        ],
      }),
    }),
    work: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `/works/${doc?.slug}`,
          },
          { title: 'Works index', href: '/works' },
        ],
      }),
    }),
  },
}
