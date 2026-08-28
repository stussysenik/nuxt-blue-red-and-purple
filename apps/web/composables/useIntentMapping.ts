// Intent mapping: plain English → design tokens.
//
// Two-stage pipeline:
//   1. extractIntent() — NLP → structured intent (keyword-based now, CEREBRAS-ready)
//   2. mapIntentToTokens() — intent → concrete design tokens (mode, palette, type)
//
// When CEREBRAS credentials arrive, swap extractIntent() for an API call.
// The rest of the pipeline stays identical.

export type Industry = 'restaurant' | 'music' | 'hotel' | 'books' | 'vintage' | 'unknown';
export type Mood = 'warm' | 'cool' | 'dark' | 'bright' | 'minimal' | 'bold';
export type Mode = 'essential' | 'brutal' | 'clay' | 'generative';

export interface DesignIntent {
  industry: Industry;
  mood: Mood;
  mode: Mode;
  palette: {
    paper: string;
    ink: string;
    spot: string;
  };
  typography: {
    weight: 'light' | 'regular' | 'bold';
    tracking: 'tight' | 'normal' | 'wide';
  };
  features: string[];
  raw: string;
}

// ── Keyword dictionaries ──────────────────────────────────────────────────

const INDUSTRY_KEYWORDS: Record<Industry, string[]> = {
  restaurant: [
    'restaurant', 'food', 'menu', 'dining', 'cafe', 'bistro', 'eatery', 'kitchen',
    'chef', 'bar', 'grill', 'pizza', 'sushi', 'ramen', 'bakery', 'coffee',
    'brunch', 'dinner', 'lunch', 'counter', 'table', 'reservation', 'order',
    'takeout', 'delivery', 'wine', 'cocktail', 'beer', 'pasta', 'burger',
  ],
  music: [
    'music', 'band', 'artist', 'musician', 'dj', 'producer', 'singer', 'rapper',
    'tour', 'concert', 'gig', 'show', 'festival', 'album', 'ep', 'single',
    'release', 'spotify', 'soundcloud', 'beat', 'track', 'song', 'record',
    'studio', 'venue', 'stage', 'live', 'merch', 'vinyl',
  ],
  hotel: [
    'hotel', 'motel', 'inn', 'resort', 'lodging', 'suite', 'room', 'booking',
    'stay', 'vacation', 'travel', 'guest', 'checkin', 'checkout', 'amenity',
    'spa', 'pool', 'beach', 'mountain', 'luxury', 'boutique', 'hostel',
    'bnb', 'airbnb', 'reservation', 'concierge',
  ],
  books: [
    'book', 'author', 'writer', 'novel', 'fiction', 'nonfiction', 'poetry',
    'publish', 'read', 'library', 'chapter', 'page', 'essay', 'journal',
    'magazine', 'editorial', 'print', 'paperback', 'hardcover', 'ebook',
  ],
  vintage: [
    'vintage', 'retro', 'antique', 'thrift', 'archive', 'collection', 'curated',
    'heritage', 'classic', 'old', 'timeless', 'nostalgia', 'throwback',
    'collectible', 'rare', 'flea', 'market', 'shop', 'store',
  ],
  unknown: [],
};

const MOOD_KEYWORDS: Record<Mood, string[]> = {
  warm: [
    'warm', 'cozy', 'inviting', 'friendly', 'home', 'comfort', 'soft',
    'gentle', 'natural', 'organic', 'earthy', 'rustic', 'homely', 'welcoming',
    'intimate', 'tender', 'mellow', 'sunset', 'golden', 'amber',
  ],
  cool: [
    'cool', 'calm', 'serene', 'peaceful', 'clean', 'fresh', 'crisp',
    'airy', 'light', 'brezen', 'ocean', 'sky', 'water', 'ice', 'minimal',
    'quiet', 'still', 'clear', 'smooth', 'polished',
  ],
  dark: [
    'dark', 'night', 'moody', 'dramatic', 'deep', 'shadow', 'noir',
    'midnight', 'black', 'obsidian', 'charcoal', 'smoky', 'mysterious',
    'edgy', 'gothic', 'underground', 'neon', 'cyber', 'punk',
  ],
  bright: [
    'bright', 'vivid', 'colorful', 'bold', 'vibrant', 'lively', 'energetic',
    'fun', 'playful', 'pop', 'neon', 'electric', 'sunny', 'cheerful',
    'happy', 'joyful', 'festive', 'party', 'celebration', 'loud',
  ],
  minimal: [
    'minimal', 'simple', 'clean', 'bare', 'sparse', 'essential', 'pure',
    'straightforward', 'uncluttered', 'restrained', 'subtle', 'understated',
    'quiet', 'less', 'whitespace', 'negative', 'space', 'refined',
  ],
  bold: [
    'bold', 'strong', 'powerful', 'heavy', 'impact', 'striking', 'loud',
    'aggressive', 'brutal', 'raw', 'intense', 'fierce', 'confident',
    'dominant', 'commanding', 'assertive', 'daring', 'fearless',
  ],
};

const FEATURE_KEYWORDS: Record<string, string[]> = {
  'online ordering': ['order', 'online', 'delivery', 'takeout', 'pickup'],
  'menu display': ['menu', 'food', 'dish', 'dishes', 'items'],
  'reservation system': ['reservation', 'booking', 'table', 'reserve'],
  'tour dates': ['tour', 'dates', 'gigs', 'shows', 'concerts', 'live'],
  'music player': ['music', 'listen', 'play', 'stream', 'spotify', 'soundcloud'],
  'merch store': ['merch', 'store', 'shop', 'buy', 'sell', 'tee', 'shirt'],
  'photo gallery': ['gallery', 'photos', 'images', 'pictures', 'lookbook'],
  'contact form': ['contact', 'email', 'reach', 'inquiry', 'message'],
  'about page': ['about', 'story', 'history', 'bio', 'who'],
  'newsletter signup': ['newsletter', 'signup', 'subscribe', 'mailing', 'list'],
  'social links': ['instagram', 'twitter', 'social', 'follow', 'link'],
  'booking calendar': ['calendar', 'availability', 'schedule', 'dates'],
};

// ── Palette presets by mood ───────────────────────────────────────────────

const MOOD_PALETTES: Record<Mood, DesignIntent['palette']> = {
  warm: { paper: '#F7EEDD', ink: '#2A1F15', spot: '#D4882A' },
  cool: { paper: '#EDF2F4', ink: '#1A2332', spot: '#4A90D9' },
  dark: { paper: '#0E0C0A', ink: '#F0EAE0', spot: '#FF6C2F' },
  bright: { paper: '#FFFDF7', ink: '#16130F', spot: '#FF3D5A' },
  minimal: { paper: '#F7F3EC', ink: '#16130F', spot: '#6E6A61' },
  bold: { paper: '#16130F', ink: '#F7F3EC', spot: '#FFE800' },
};

// ── Mode selection: mood + industry → kernel ──────────────────────────────

function selectMode(mood: Mood, industry: Industry): Mode {
  if (mood === 'bold' || mood === 'dark') return 'brutal';
  if (mood === 'bright' || industry === 'music') return 'generative';
  if (mood === 'minimal' || industry === 'hotel') return 'essential';
  if (mood === 'warm' || industry === 'restaurant') return 'clay';
  return 'essential';
}

// ── Typography: mood → weight + tracking ──────────────────────────────────

function selectTypography(mood: Mood): DesignIntent['typography'] {
  switch (mood) {
    case 'minimal':
    case 'cool':
      return { weight: 'light', tracking: 'wide' };
    case 'bold':
    case 'dark':
      return { weight: 'bold', tracking: 'tight' };
    case 'bright':
      return { weight: 'bold', tracking: 'normal' };
    case 'warm':
      return { weight: 'regular', tracking: 'normal' };
    default:
      return { weight: 'regular', tracking: 'normal' };
  }
}

// ── Scoring: count keyword matches ────────────────────────────────────────

function scoreCategory<T extends string>(
  input: string,
  keywords: Record<T, string[]>,
): { top: T; score: number } {
  const words = input.toLowerCase().split(/\W+/).filter(Boolean);
  let top: T = 'unknown' as T;
  let maxScore = 0;

  for (const [category, terms] of Object.entries(keywords) as [T, string[]][]) {
    let score = 0;
    for (const word of words) {
      for (const term of terms) {
        if (word === term) score += 2;
        else if (word.includes(term) || term.includes(word)) score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      top = category;
    }
  }

  return { top, score: maxScore };
}

// ── Feature extraction ────────────────────────────────────────────────────

function extractFeatures(input: string): string[] {
  const words = new Set(input.toLowerCase().split(/\W+/).filter(Boolean));
  const features: string[] = [];

  for (const [feature, terms] of Object.entries(FEATURE_KEYWORDS)) {
    for (const term of terms) {
      if (words.has(term)) {
        features.push(feature);
        break;
      }
    }
  }

  return features;
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Extract structured design intent from plain English.
 * Keyword-based for now. Swap this body for a CEREBRAS call when ready.
 */
export function extractIntent(input: string): DesignIntent {
  const clean = input.trim();

  const industry = scoreCategory(clean, INDUSTRY_KEYWORDS).top;
  const mood = scoreCategory(clean, MOOD_KEYWORDS).top;
  const features = extractFeatures(clean);

  const mode = selectMode(mood, industry);
  const palette = MOOD_PALETTES[mood];
  const typography = selectTypography(mood);

  return {
    industry,
    mood,
    mode,
    palette,
    typography,
    features,
    raw: clean,
  };
}

/**
 * Map a design intent to CSS custom properties for live preview.
 */
export function intentToCssVars(intent: DesignIntent): Record<string, string> {
  return {
    '--paper': intent.palette.paper,
    '--ink': intent.palette.ink,
    '--spot': intent.palette.spot,
    '--wght-display': intent.typography.weight === 'light' ? '300' : intent.typography.weight === 'bold' ? '800' : '500',
    '--tracking-display': intent.typography.tracking === 'tight' ? '-0.02em' : intent.typography.tracking === 'wide' ? '0.08em' : '0',
  };
}
