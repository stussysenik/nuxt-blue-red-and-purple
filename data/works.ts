export interface Work {
  slug: string;
  title: string;
  category: 'restaurant' | 'hotel' | 'music' | 'vintage' | 'books';
  year: number;
  image: string;
  summary: string;
  palette?: string[];
  mechanic?: string;
  source?: string;
  real?: boolean;
  hidden?: boolean;
}

export const works: Work[] = [
  {
    slug: 'smac',
    title: "S'MAC",
    category: 'restaurant',
    year: 2026,
    image: '/works/smac.jpg',
    summary:
      'A warm counter concept where the menu reads as an editorial index and every order collapses to a single flow.',
    palette: ['#e8a13a', '#c8541f', '#f4ede0'],
    mechanic:
      'Menu-as-index: the mac-and-cheese board rendered as a warm editorial ledger, order flow reduced to one counter.',
    source: 'smac.blueredandpurple.world',
    real: true,
  },
  {
    slug: 'after',
    title: 'After',
    category: 'music',
    year: 2025,
    image: '/works/after.jpg',
    summary:
      'A pixel display face and a mono grotesk hold a dead-simple centered column together.',
    palette: ['#226bc9', '#4b7fe1'],
    mechanic:
      'Pixel display over mono grotesk on one centered column; a dated tour list as the whole index.',
  },
  {
    slug: 'b374',
    title: 'B374',
    category: 'music',
    year: 2025,
    image: '/works/b374.jpg',
    summary:
      'An open book spread with a crease pinned at the viewport center — verso against recto in continuous scroll.',
    mechanic:
      'Open-book spreads with a pinned center crease; full-bleed plates on the verso, portrait plates on the recto.',
  },
  {
    slug: 'd429',
    title: 'D429',
    category: 'books',
    year: 2023,
    image: '/works/d429.jpg',
    summary:
      'A two-column document grid runs marginal notes on the left against continuous text on the right.',
    mechanic: 'Margin-note left, running text right — a two-column document grid.',
  },
  {
    slug: 'f853',
    title: 'F853',
    category: 'books',
    year: 2024,
    image: '/works/f853.jpg',
    summary:
      'A single-column index of text links flush top-left beside a live digital clock — the homepage IS the index.',
    mechanic:
      'One-type-size index flush top-left with a live clock; line-height is the only layout system.',
  },
  {
    slug: 'skrillex',
    title: 'Skrillex',
    category: 'music',
    year: 2024,
    image: '/works/skrillex.jpg',
    summary:
      'A full-bleed artwork with one vertical rail of mono type climbing the left edge — wordmark, glyph, nav.',
    mechanic:
      'Full-bleed artwork with a single vertical mono rail; one typeface, one weight, one size, zero palette.',
  },
  {
    slug: 'b421',
    title: 'B421',
    category: 'music',
    year: 2024,
    image: '/works/b421.jpg',
    summary:
      'A brutalist event grid with heavy borders and a monospace date column — the timetable as the identity.',
    mechanic:
      'Brutalist event grid: heavy borders, mono date column, the timetable is the identity.',
  },
  {
    slug: 'b508',
    title: 'B508',
    category: 'music',
    year: 2023,
    image: '/works/b508.jpg',
    summary:
      'A neon-on-dark club poster distilled to type and a single glowing accent — the gig as the grid.',
    mechanic:
      'Neon-on-dark club poster: distilled to type and one glowing accent, the gig is the grid.',
  },
  {
    slug: 'b970',
    title: 'B970',
    category: 'vintage',
    year: 2024,
    image: '/works/b970.jpg',
    summary:
      'A serif display and semi-mono captions share an asymmetric editorial stack.',
    mechanic:
      'Serif display paired with semi-mono captions across a 3/3/6 asymmetric editorial stack.',
  },
  {
    slug: 'g858',
    title: 'G858',
    category: 'vintage',
    year: 2024,
    image: '/works/g858.jpg',
    summary:
      'A dated journal stacks over a wallpaper while a twelve-product shop slides up as an overlay.',
    palette: ['#ffd401', '#111111'],
    mechanic:
      'A dated-drop journal over wallpaper with a twelve-product overlay shop; one yellow accent.',
  },
  {
    slug: 'h724',
    title: 'H724',
    category: 'vintage',
    year: 2023,
    image: '/works/h724.jpg',
    summary:
      'A gallery wall of uniform frames with a centered caption — the archive as a grid, the label as the voice.',
    mechanic:
      'Uniform gallery frames with centered captions; the archive is the grid, the label is the voice.',
  },
  {
    slug: 'l384',
    title: 'L384',
    category: 'hotel',
    year: 2024,
    image: '/works/l384.jpg',
    summary:
      'A quiet luxury hotel page — one hero, one column of amenities, a single CTA. Restraint as the brand.',
    mechanic:
      'Quiet luxury: one hero, one amenity column, one CTA — restraint is the brand.',
  },
  {
    slug: 'p673',
    title: 'P673',
    category: 'hotel',
    year: 2023,
    image: '/works/p673.jpg',
    summary:
      'A booking-first layout with a sticky reservation rail — the room, the rate, the date, done.',
    mechanic:
      'Booking-first with a sticky reservation rail: room, rate, date — the conversation is the booking.',
  },
  {
    slug: 'd445',
    title: 'D445',
    category: 'books',
    year: 2024,
    image: '/works/d445.jpg',
    summary:
      'A reading-mode page — one serif column, generous margins, a progress bar. The book is the interface.',
    mechanic:
      'Reading-mode: one serif column, generous margins, a progress bar — the book is the interface.',
  },
];

export function getVisibleWorks(): Work[] {
  return works
    .filter((w) => !w.hidden)
    .sort(
      (a, b) =>
        Number(b.real ?? false) - Number(a.real ?? false) ||
        b.year - a.year ||
        a.title.localeCompare(b.title),
    );
}

export function getWorkBySlug(slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

export const CATEGORY_ORDER = ['restaurant', 'hotel', 'music', 'books', 'vintage'];

export function getGroupedWorks(): { category: string; items: Work[] }[] {
  const visible = getVisibleWorks();
  const rank = (c: string) => (CATEGORY_ORDER.includes(c) ? CATEGORY_ORDER.indexOf(c) : CATEGORY_ORDER.length);
  return [...new Set(visible.map((w) => w.category))]
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    .map((category) => ({
      category,
      items: visible.filter((w) => w.category === category),
    }));
}
