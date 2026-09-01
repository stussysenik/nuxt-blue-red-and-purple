/**
 * Seed script: populate Sanity with the existing works from data/works.ts
 *
 * Usage:
 *   cd apps/web
 *   SANITY_API_WRITE_TOKEN=your-write-token node --import tsx scripts/seed-works.ts
 *
 * Or add to package.json:
 *   "sanity:seed": "node --import tsx scripts/seed-works.ts"
 * (with SANITY_API_WRITE_TOKEN in .env.local)
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NUXT_SANITY_PROJECT_ID || 'lkyz5ssa',
  dataset: process.env.NUXT_SANITY_DATASET || 'production',
  apiVersion: '2026-05-15',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_API_WRITE_TOKEN) {
  console.error('Missing SANITY_API_WRITE_TOKEN — generate one at https://manage.sanity.io with Write access')
  process.exit(1)
}

// Existing works data (from apps/web/data/works.ts)
const works = [
  { slug: 'smac', title: "S'MAC", category: 'restaurant', year: 2026, summary: 'A warm counter concept where the menu reads as an editorial index and every order collapses to a single flow.', palette: ['#e8a13a', '#c8541f', '#f4ede0'], mechanic: 'Menu-as-index: the mac-and-cheese board rendered as a warm editorial ledger, order flow reduced to one counter.', source: 'smac.blueredandpurple.world', isReal: true },
  { slug: 'olive-thyme', title: 'Olive & Thyme', category: 'restaurant', year: 2026, summary: 'A neighborhood bistro with a daily-changing chalkboard menu and a warm, editorial feel.', palette: ['#5a7d3f', '#e8d5b7', '#2d2a26'], mechanic: 'Chalkboard-as-menu: daily specials rendered as a hand-lettered grid, reservation CTA pinned bottom-right.', source: 'olivethyme.blueredandpurple.world', isReal: true, isHidden: true },
  { slug: 'midnight-noodle', title: 'Midnight Noodle', category: 'restaurant', year: 2025, summary: 'A late-night ramen counter — neon-on-dark, one menu column, order flow reduced to three taps.', palette: ['#ff3d5a', '#1a1a1a', '#f5f0e8'], mechanic: 'Neon-on-dark single column: one menu, three-tap order, the counter is the whole page.', isHidden: true },
  { slug: 'veranda', title: 'Veranda', category: 'restaurant', year: 2025, summary: 'A rooftop bar with a panoramic hero, a cocktail list as a type specimen, and a booking rail.', palette: ['#d4a853', '#1e3a5f', '#f0ece2'], mechanic: 'Panoramic hero with a cocktail-type specimen overlay; booking rail slides up from the bottom.', isHidden: true },
  { slug: 'after', title: 'After', category: 'music', year: 2025, summary: 'A pixel display face and a mono grotesk hold a dead-simple centered column together.', palette: ['#226bc9', '#4b7fe1'], mechanic: 'Pixel display over mono grotesk on one centered column; a dated tour list as the whole index.' },
  { slug: 'b374', title: 'B374', category: 'music', year: 2025, summary: 'An open book spread with a crease pinned at the viewport center — verso against recto in continuous scroll.', mechanic: 'Open-book spreads with a pinned center crease; full-bleed plates on the verso, portrait plates on the recto.' },
  { slug: 'd429', title: 'D429', category: 'books', year: 2023, summary: 'A two-column document grid runs marginal notes on the left against continuous text on the right.', mechanic: 'Margin-note left, running text right — a two-column document grid.' },
  { slug: 'f853', title: 'F853', category: 'books', year: 2024, summary: 'A single-column index of text links flush top-left beside a live digital clock — the homepage IS the index.', mechanic: 'One-type-size index flush top-left with a live clock; line-height is the only layout system.' },
  { slug: 'skrillex', title: 'Skrillex', category: 'music', year: 2024, summary: "A full-bleed artwork with one vertical rail of mono type climbing the left edge — wordmark, glyph, nav.", mechanic: 'Full-bleed artwork with a single vertical mono rail; one typeface, one weight, one size, zero palette.' },
  { slug: 'b421', title: 'B421', category: 'music', year: 2024, summary: 'A brutalist event grid with heavy borders and a monospace date column — the timetable as the identity.', mechanic: 'Brutalist event grid: heavy borders, mono date column, the timetable is the identity.' },
  { slug: 'b508', title: 'B508', category: 'music', year: 2023, summary: 'A neon-on-dark club poster distilled to type and a single glowing accent — the gig as the grid.', mechanic: 'Neon-on-dark club poster: distilled to type and one glowing accent, the gig is the grid.' },
  { slug: 'b970', title: 'B970', category: 'vintage', year: 2024, summary: 'A serif display and semi-mono captions share an asymmetric editorial stack.', mechanic: 'Serif display paired with semi-mono captions across a 3/3/6 asymmetric editorial stack.' },
  { slug: 'echo-chamber', title: 'Echo Chamber', category: 'music', year: 2025, summary: "A recording studio's booking page — one hero, one calendar, one rate card. The session is the sell.", palette: ['#2b2b2b', '#c4a882', '#f5f0e8'], mechanic: 'One hero, one calendar, one rate card — the booking flow is the whole site.', isHidden: true },
  { slug: 'g858', title: 'G858', category: 'vintage', year: 2024, summary: 'A dated journal stacks over a wallpaper while a twelve-product shop slides up as an overlay.', palette: ['#ffd401', '#111111'], mechanic: 'A dated-drop journal over wallpaper with a twelve-product overlay shop; one yellow accent.' },
  { slug: 'h724', title: 'H724', category: 'vintage', year: 2023, summary: 'A gallery wall of uniform frames with a centered caption — the archive as a grid, the label as the voice.', mechanic: 'Uniform gallery frames with centered captions; the archive is the grid, the label is the voice.' },
  { slug: 'l384', title: 'L384', category: 'hotel', year: 2024, summary: 'A quiet luxury hotel page — one hero, one column of amenities, a single CTA. Restraint as the brand.', mechanic: 'Quiet luxury: one hero, one amenity column, one CTA — restraint is the brand.' },
  { slug: 'p673', title: 'P673', category: 'hotel', year: 2023, summary: 'A booking-first layout with a sticky reservation rail — the room, the rate, the date, done.', mechanic: 'Booking-first with a sticky reservation rail: room, rate, date — the conversation is the booking.' },
  { slug: 'd445', title: 'D445', category: 'books', year: 2024, summary: 'A reading-mode page — one serif column, generous margins, a progress bar. The book is the interface.', mechanic: 'Reading-mode: one serif column, generous margins, a progress bar — the book is the interface.' },
]

async function seed() {
  console.log(`Seeding ${works.length} works into ${client.config().projectId}/${client.config().dataset}...`)

  // Check for existing works to avoid duplicates
  const existing = await client.fetch(`count(*[_type == "work"])`)
  if (existing > 0) {
    console.log(`⚠ ${existing} works already exist. Skipping seed (delete existing works first to re-seed).`)
    process.exit(0)
  }

  const transaction = client.transaction()

  for (let i = 0; i < works.length; i++) {
    const w = works[i]
    const doc = {
      _type: 'work',
      title: w.title,
      slug: { _type: 'slug', current: w.slug },
      category: w.category,
      year: w.year,
      summary: w.summary,
      mechanic: w.mechanic,
      palette: w.palette || [],
      source: w.source || '',
      isReal: w.isReal || false,
      isHidden: w.isHidden || false,
      sortOrder: i,
    }
    transaction.create(doc)
    console.log(`  + ${w.title} (${w.category} ${w.year})`)
  }

  await transaction.commit()
  console.log(`\nDone! Seeded ${works.length} works.`)
  console.log('Note: Images are not included in seed — add them manually in Sanity Studio.')
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
