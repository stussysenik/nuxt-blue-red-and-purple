<script setup lang="ts">
import { extractIntent, intentToCssVars, type DesignIntent, type Industry } from '~/composables/useIntentMapping';

useHead({
  title: 'blue red + purple — generative world-building',
  meta: [
    { name: 'description', content: 'We build generative brand worlds for the music industry. Describe your artist. Get a complete immersive world in 48 hours.' },
  ],
});

// ── Intent engine ─────────────────────────────────────────────────────────

const PROMPTS = [
  { label: 'Music', text: 'A bold music artist page with tour dates and a merch store' },
  { label: 'Nightclub', text: 'A dark, moody nightclub with neon accents and a DJ lineup' },
  { label: 'Restaurant', text: 'A cozy Italian restaurant with warm lighting and a wine list' },
  { label: 'Hotel', text: 'A minimal boutique hotel with a booking calendar and serene vibe' },
  { label: 'Books', text: 'A vintage bookstore with curated collections and a reading nook' },
  { label: 'Label', text: 'A bright, energetic label page with multiple artists and releases' },
];

const input = ref('');
const isGenerating = ref(false);
const showResult = ref(false);

const intent = ref<DesignIntent | null>(null);
let debounceTimer: ReturnType<typeof setTimeout> | undefined;

function onInput() {
  clearTimeout(debounceTimer);
  if (!input.value.trim()) {
    intent.value = null;
    showResult.value = false;
    return;
  }
  debounceTimer = setTimeout(() => {
    intent.value = extractIntent(input.value);
    showResult.value = true;
  }, 200);
}

function tryPrompt(prompt: string) {
  input.value = prompt;
  isGenerating.value = true;
  showResult.value = false;
  setTimeout(() => {
    intent.value = extractIntent(prompt);
    showResult.value = true;
    isGenerating.value = false;
  }, 500);
}

const previewStyles = computed(() => {
  if (!intent.value) return {};
  return intentToCssVars(intent.value);
});

const previewMode = computed(() => intent.value?.mode ?? 'essential');

// Mode-specific preview styling (self-contained, doesn't rely on <html> data-mode)
const modePreviewStyles = computed(() => {
  const mode = intent.value?.mode ?? 'essential';
  const styles: Record<string, string> = {};
  switch (mode) {
    case 'brutal':
      styles['--border-w'] = '2px';
      styles['--radius'] = '0';
      styles['--shadow'] = '4px 4px 0 var(--ink)';
      break;
    case 'clay':
      styles['--border-w'] = '1px';
      styles['--radius'] = '12px';
      styles['--shadow'] = '0 4px 12px rgba(0,0,0,0.08)';
      break;
    case 'generative':
      styles['--border-w'] = '1px';
      styles['--radius'] = '0';
      styles['--shadow'] = 'none';
      break;
    case 'essential':
    default:
      styles['--border-w'] = '1px';
      styles['--radius'] = '2px';
      styles['--shadow'] = 'none';
      break;
  }
  return styles;
});

const allPreviewStyles = computed(() => {
  const p = intent.value?.palette ?? { paper: '#F7F3EC', ink: '#16130F', spot: '#6E6A61' };
  const mode = intent.value?.mode ?? 'essential';

  // Derive shade variants from the base palette
  const paper = p.paper;
  const ink = p.ink;
  const spot = p.spot;

  // Generate ink shades (ink-1, ink-2, ink-3 are progressively lighter)
  const ink1 = mixColors(ink, paper, 0.25);
  const ink2 = mixColors(ink, paper, 0.45);
  const ink3 = mixColors(ink, paper, 0.65);
  const paper1 = mixColors(paper, ink, 0.06);
  const line = mixColors(ink, paper, 0.12);

  // Mode-specific geometry
  let borderW = '1px';
  let radius = '2px';
  let shadow = 'none';
  let typeDisplay = 'clamp(3rem, 8vw, 6.5rem)';
  let wghtDisplay = '500';
  let trackingDisplay = '0';

  switch (mode) {
    case 'brutal':
      borderW = '2px';
      radius = '0';
      shadow = '4px 4px 0 ' + ink;
      wghtDisplay = '800';
      trackingDisplay = '-0.02em';
      typeDisplay = 'clamp(3rem, 9vw, 7rem)';
      break;
    case 'clay':
      borderW = '1px';
      radius = '12px';
      shadow = '0 4px 12px rgba(0,0,0,0.08)';
      wghtDisplay = '700';
      trackingDisplay = '-0.015em';
      typeDisplay = 'clamp(3rem, 9vw, 7rem)';
      break;
    case 'generative':
      borderW = '1px';
      radius = '0';
      shadow = 'none';
      wghtDisplay = '340';
      trackingDisplay = '0';
      typeDisplay = 'clamp(3rem, 8vw, 6.5rem)';
      break;
    case 'essential':
    default:
      borderW = '1px';
      radius = '2px';
      shadow = 'none';
      wghtDisplay = '500';
      trackingDisplay = '0';
      typeDisplay = 'clamp(3rem, 8vw, 6.5rem)';
      break;
  }

  return {
    // Color system
    '--paper': paper,
    '--paper-1': paper1,
    '--ink': ink,
    '--ink-1': ink1,
    '--ink-2': ink2,
    '--ink-3': ink3,
    '--line': line,
    '--spot': spot,
    // Geometry
    '--border-w': borderW,
    '--radius': radius,
    '--shadow': shadow,
    // Typography
    '--type-display': typeDisplay,
    '--wght-display': wghtDisplay,
    '--tracking-display': trackingDisplay,
  };
});

// Helper: mix two hex colors
function mixColors(hex1: string, hex2: string, weight: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ── Dynamic content per industry ─────────────────────────────────────────

interface Content {
  title: string;
  tagline: string;
  nav: string[];
  cta: string;
  cards: { label: string; meta: string }[];
  footer: string[];
}

function getContent(industry: Industry): Content {
  const map: Record<Industry, Content> = {
    music: {
      title: 'LOW FREQUENCY',
      tagline: 'New EP — Out now on all platforms. Tour dates announced. Merch drop this Friday.',
      nav: ['Music', 'Tour', 'Merch', 'Videos'],
      cta: 'Stream now ↗',
      cards: [
        { label: 'Side A — Control', meta: '3:42' },
        { label: 'Side B — Fade Out', meta: '4:18' },
        { label: 'Side C — Hold', meta: '2:55' },
        { label: 'Side D — Release', meta: '5:01' },
      ],
      footer: ['Press kit ↗', 'Booking ↗', 'Subscribe ↗'],
    },
    restaurant: {
      title: 'Pasta · Vino · Terra',
      tagline: 'A neighborhood kitchen serving handmade pasta and natural wine since 2019. Counter seating. No reservations needed.',
      nav: ['Menu', 'Wine', 'Hours', 'Order'],
      cta: 'Order pickup ↗',
      cards: [
        { label: 'Bucatini Amatriciana', meta: '$18' },
        { label: 'Cacio e Pepe', meta: '$16' },
        { label: 'Burrata', meta: '$14' },
        { label: 'Tiramisu', meta: '$12' },
      ],
      footer: ['124 MacDougal St', 'Open 5–11pm', '@pastavino.terra'],
    },
    hotel: {
      title: 'The Quiet Stay',
      tagline: 'Twelve rooms. One courtyard. Zero distractions. Check-in from 3pm, checkout by 11am.',
      nav: ['Suites', 'Dining', 'Wellness', 'Book'],
      cta: 'Book now ↗',
      cards: [
        { label: 'Courtyard Room', meta: '$280/night' },
        { label: 'Garden Suite', meta: '$420/night' },
        { label: 'The Penthouse', meta: '$680/night' },
        { label: 'Library Room', meta: '$320/night' },
      ],
      footer: ['47 Elm Lane', 'Concierge ↗', 'Gift cards ↗'],
    },
    books: {
      title: 'Between the Lines',
      tagline: 'A publishing house for voices that don\'t fit the algorithm. New releases every quarter.',
      nav: ['New', 'Backlist', 'Authors', 'Submit'],
      cta: 'Browse catalog ↗',
      cards: [
        { label: 'The Quiet Year', meta: 'M. Okonkwo' },
        { label: 'Field Notes', meta: 'R. Vasquez' },
        { label: 'Still Water', meta: 'L. Tanaka' },
        { label: 'Common Ground', meta: 'A. Mensah' },
      ],
      footer: ['Submissions open', 'Newsletter ↗', 'Wholesale ↗'],
    },
    vintage: {
      title: 'Found & Kept',
      tagline: 'Curated vintage furniture, clothing, and oddities from the 1960s–1990s. New drops every Tuesday.',
      nav: ['New Arrivals', 'Furniture', 'Clothing', 'Journal'],
      cta: 'Shop now ↗',
      cards: [
        { label: 'Eames Era Lounge Chair', meta: '$1,200' },
        { label: '70s Bohemian Maxi Dress', meta: '$180' },
        { label: 'Brutalist Concrete Vase', meta: '$95' },
        { label: '80s Memphis Shelf', meta: '$340' },
      ],
      footer: ['181 Grand St', 'Drops Tuesdays', '@foundandkept'],
    },
    unknown: {
      title: 'Your Project',
      tagline: 'Describe what you need and we\'ll map it to a complete design system.',
      nav: ['About', 'Work', 'Services', 'Contact'],
      cta: 'Get in touch ↗',
      cards: [
        { label: 'Service One', meta: 'Detail' },
        { label: 'Service Two', meta: 'Detail' },
        { label: 'Service Three', meta: 'Detail' },
        { label: 'Service Four', meta: 'Detail' },
      ],
      footer: ['hi@blueredandpurple.world', '(404) 422-5517', '© 2026'],
    },
  };
  return map[industry] ?? map.unknown;
}

const content = computed(() => getContent(intent.value?.industry ?? 'unknown'));

// ── Scroll to demo ────────────────────────────────────────────────────────

function scrollToDemo() {
  const el = document.getElementById('demo');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <div>
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- HERO — the big idea                                               -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="hero">
      <p class="hero__eyebrow font-mono ttu tracked">blue red + purple</p>
      <h1 class="hero__title">
        Not websites.<br />Worlds.
      </h1>
      <p class="hero__lead measure-wide">
        We build generative brand worlds for the music industry. You describe
        your artist's universe. Our engine generates a complete immersive
        experience — music, visuals, tour dates, merch, fan interaction — in
        48 hours. The world markets itself. You get the data.
      </p>
      <div class="hero__actions">
        <button class="hero__cta hero__cta--primary font-mono ttu tracked" @click="scrollToDemo">
          Try the demo ↓
        </button>
        <a href="mailto:hi@blueredandpurple.world" class="hero__cta font-mono ttu tracked">
          Get in touch ↗
        </a>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- WHAT IT IS                                                         -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band">
      <h2 class="band__title">What it is</h2>
      <div class="col">
        <p class="band__lead measure-wide lh-copy">
          A traditional artist site is a brochure. Links to Spotify, a photo, a bio.
          Fans leave in eight seconds. A <strong>world</strong> is different. Fans
          step <em>into</em> the artist's universe. They discover artifacts — song
          snippets, video clips, handwritten notes, voice memos. They leave their
          mark. They share what they found.
        </p>
        <p class="band__lead measure-wide lh-copy">
          Our generative engine builds these worlds from a single brief. What used to
          take a team of five and six weeks now takes a prompt and forty-eight hours.
          The engine is the margin. The world is the marketing.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- DEMO — the intent engine                                          -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section id="demo" class="demo">
      <h2 class="band__title">See it work</h2>
      <p class="band__lead measure-wide">
        Type a brief or pick a prompt. The engine maps your intent to a complete
        design system — mode, palette, typography, layout — in real time.
      </p>

      <!-- Input -->
      <div class="demo__input-zone">
        <label for="gen-input" class="visually-hidden">Describe your project</label>
        <textarea
          id="gen-input"
          v-model="input"
          class="demo__textarea font-mono"
          :class="{ 'demo__textarea--active': isGenerating }"
          rows="2"
          placeholder="A bold music artist page with tour dates and a merch store..."
          @input="onInput"
          @keydown.meta.enter="tryPrompt(input)"
        />
        <div class="demo__input-foot">
          <span class="demo__hint font-mono">⌘+Enter to generate · or pick a prompt</span>
          <span v-if="isGenerating" class="demo__working font-mono">Generating…</span>
        </div>
      </div>

      <!-- Quick prompts -->
      <div class="demo__prompts">
        <button
          v-for="p in PROMPTS"
          :key="p.text"
          type="button"
          class="demo__prompt font-mono"
          @click="tryPrompt(p.text)"
        >
          <span class="demo__prompt-label">{{ p.label }}</span>
          <span class="demo__prompt-text">{{ p.text }}</span>
        </button>
      </div>

      <!-- Intent readout + Live preview -->
      <transition name="slide-up">
        <div v-if="intent && showResult" class="demo__result">
          <!-- Readout -->
          <div class="demo__readout">
            <div class="readout__grid">
              <div class="readout__item">
                <span class="readout__key font-mono">Industry</span>
                <span class="readout__val font-mono ttu">{{ intent.industry }}</span>
              </div>
              <div class="readout__item">
                <span class="readout__key font-mono">Mood</span>
                <span class="readout__val font-mono ttu">{{ intent.mood }}</span>
              </div>
              <div class="readout__item">
                <span class="readout__key font-mono">Mode</span>
                <span class="readout__val font-mono ttu">{{ intent.mode }}</span>
              </div>
              <div class="readout__item">
                <span class="readout__key font-mono">Type</span>
                <span class="readout__val font-mono ttu">{{ intent.typography.weight }} · {{ intent.typography.tracking }}</span>
              </div>
              <div class="readout__item readout__item--full">
                <span class="readout__key font-mono">Palette</span>
                <span class="readout__swatches">
                  <span class="swatch" :style="{ background: intent.palette.paper }"></span>
                  <span class="swatch swatch--ink" :style="{ background: intent.palette.ink }"></span>
                  <span class="swatch" :style="{ background: intent.palette.spot }"></span>
                </span>
              </div>
              <div v-if="intent.features.length" class="readout__item readout__item--full">
                <span class="readout__key font-mono">Features</span>
                <span class="readout__features">
                  <span v-for="f in intent.features" :key="f" class="feature-chip font-mono">{{ f }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Live preview -->
          <div class="demo__preview" :style="allPreviewStyles">
            <div class="preview" :data-mode="previewMode">
              <div class="preview__chrome">
                <span class="preview__mark">/</span>
                <nav class="preview__nav font-mono">
                  <span v-for="item in content.nav" :key="item" class="preview__nav-item">{{ item }}</span>
                </nav>
                <span class="preview__cta font-mono">{{ content.cta }}</span>
              </div>

              <div class="preview__hero">
                <h3 class="preview__title">{{ content.title }}</h3>
                <p class="preview__tagline">{{ content.tagline }}</p>
              </div>

              <div class="preview__grid">
                <div v-for="(card, i) in content.cards" :key="i" class="preview__card">
                  <div class="preview__card-img"></div>
                  <div class="preview__card-info">
                    <span class="preview__card-label font-mono">{{ card.label }}</span>
                    <span class="preview__card-meta font-mono">{{ card.meta }}</span>
                  </div>
                </div>
              </div>

              <div class="preview__footer font-mono">
                <span v-for="item in content.footer" :key="item">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Empty state -->
      <transition name="fade">
        <div v-if="!showResult" class="demo__empty">
          <p class="demo__empty-text font-mono">
            Type a prompt or pick one above to see the engine work.
          </p>
        </div>
      </transition>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- THE TRANSFORMATION                                                -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band">
      <h2 class="band__title">The transformation</h2>
      <div class="transform">
        <div class="transform__before">
          <p class="transform__label font-mono ttu tracked">Before — the brochure</p>
          <ul class="transform__list">
            <li>Static page, zero immersion</li>
            <li>Fans leave in 8 seconds</li>
            <li>$15–50k, 6+ weeks, team of 5</li>
            <li>Campaign ends → traffic dies</li>
            <li>No data on who engaged</li>
          </ul>
        </div>
        <div class="transform__arrow" aria-hidden="true">→</div>
        <div class="transform__after">
          <p class="transform__label font-mono ttu tracked">After — the world</p>
          <ul class="transform__list">
            <li>Immersive portal, full sensory</li>
            <li>Fans stay 4+ minutes, discover, share</li>
            <li>$15–50k, 48 hours, one prompt</li>
            <li>World grows after campaign ends</li>
            <li>Full analytics on every interaction</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- WHAT YOU GET                                                       -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band">
      <h2 class="band__title">What you get</h2>
      <div class="gets">
        <div class="get">
          <span class="get__num font-mono">01</span>
          <h3 class="get__title">A live world</h3>
          <p class="get__body">
            A URL. Like <code>artist.world</code> or <code>brp.world/toure-xali</code>.
            Deployed, hosted, works on every device. Share it everywhere — social bios,
            ads, press emails, QR codes on posters.
          </p>
        </div>
        <div class="get">
          <span class="get__num font-mono">02</span>
          <h3 class="get__title">A content dashboard</h3>
          <p class="get__body">
            Upload music, videos, photos. Toggle campaign phases. Add tour dates and
            merch drops. No developers needed. Your team logs in, makes changes, the
            world updates.
          </p>
        </div>
        <div class="get">
          <span class="get__num font-mono">03</span>
          <h3 class="get__title">Analytics</h3>
          <p class="get__body">
            Who entered. How long they stayed. Which artifacts they discovered. How
            many shared. Streaming click-throughs. Merch conversions. Full funnel, every
            interaction tracked.
          </p>
        </div>
        <div class="get">
          <span class="get__num font-mono">04</span>
          <h3 class="get__title">Campaign mechanics</h3>
          <p class="get__body">
            Email capture. Share-to-unlock. Fan wall. Press kit download. Pre-release
            teases. Release day blooms. Post-release grows. Built into the world.
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- TIERS                                                              -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band">
      <h2 class="band__title">What we sell</h2>
      <div class="tiers">
        <div class="tier">
          <div class="tier__head">
            <h3 class="tier__name">Release Campaign</h3>
            <p class="tier__price">
              <span class="tier__price-num">$15–50k</span>
              <span class="tier__price-per font-mono">per release</span>
            </p>
          </div>
          <p class="tier__blurb">A generative world for a specific album, EP, or single drop.</p>
          <ul class="tier__features">
            <li><span class="tier__check">✓</span> Pre-release teaser world</li>
            <li><span class="tier__check">✓</span> Release-day full unlock</li>
            <li><span class="tier__check">✓</span> Music player + video</li>
            <li><span class="tier__check">✓</span> Fan artifact sharing</li>
            <li><span class="tier__check">✓</span> Press kit + industry door</li>
          </ul>
        </div>
        <div class="tier tier--featured">
          <div class="tier__head">
            <h3 class="tier__name">Artist World</h3>
            <p class="tier__price">
              <span class="tier__price-num">$5–15k</span>
              <span class="tier__price-per font-mono">setup + $2–5k/mo</span>
            </p>
          </div>
          <p class="tier__blurb">A living world that evolves with the artist's career.</p>
          <ul class="tier__features">
            <li><span class="tier__check">✓</span> Everything in Release Campaign</li>
            <li><span class="tier__check">✓</span> Auto-integrates new music</li>
            <li><span class="tier__check">✓</span> Tour date management</li>
            <li><span class="tier__check">✓</span> Merch drops in-world</li>
            <li><span class="tier__check">✓</span> Fan community layer</li>
            <li><span class="tier__check">✓</span> Monthly analytics report</li>
          </ul>
        </div>
        <div class="tier">
          <div class="tier__head">
            <h3 class="tier__name">Label OS</h3>
            <p class="tier__price">
              <span class="tier__price-num">$20–100k</span>
              <span class="tier__price-per font-mono">per year</span>
            </p>
          </div>
          <p class="tier__blurb">White-label. Every artist on the roster gets a world.</p>
          <ul class="tier__features">
            <li><span class="tier__check">✓</span> Everything in Artist World</li>
            <li><span class="tier__check">✓</span> Full roster deployment</li>
            <li><span class="tier__check">✓</span> Label dashboard</li>
            <li><span class="tier__check">✓</span> Fan acquisition cost tracking</li>
            <li><span class="tier__check">✓</span> Conversion analytics</li>
            <li><span class="tier__check">✓</span> Revenue attribution</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- PROOF                                                              -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band">
      <h2 class="band__title">Proof</h2>
      <div class="proof">
        <p class="proof__quote">
          “They didn't build me a website. They built me a world my fans actually
          want to live in. The campaign marketed itself — my team just watched the
          data roll in.”
        </p>
        <p class="proof__attr font-mono">
          — Toure Xali, artist & spokesperson
        </p>
        <p class="proof__note measure">
          We're building Toure Xali's generative world right now. The process, the
          engine, the results — it's all going to be public. Follow along.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- FINAL CTA                                                          -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band band--last">
      <h2 class="band__title">Build your world</h2>
      <p class="band__lead measure-wide">
        Whether you're a label with a roster of thirty or an artist about to drop
        your first campaign — we build worlds that move units.
      </p>
      <a href="mailto:hi@blueredandpurple.world" class="final__cta font-mono ttu tracked">
        Get in touch <span aria-hidden="true">↗</span>
      </a>
      <p class="final__note font-mono">
        hi@blueredandpurple.world · (404) 422-5517
      </p>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: grid;
  align-content: center;
  gap: 1.8rem;
  padding: 6rem var(--edge) 4rem;
  color: var(--ink);
}

.hero__eyebrow {
  font-size: var(--type-label);
  color: var(--ink-2);
  margin: 0;
}

.hero__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1.03;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  margin: 0;
  color: var(--ink);
}

.hero__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.9rem 1.6rem;
  font-size: var(--type-label);
  letter-spacing: 0.12em;
  color: var(--ink);
  border: var(--border-w, 2px) solid var(--ink);
  text-decoration: none;
  transition: transform var(--dur) var(--ease);
}

.hero__cta--primary {
  background: var(--ink);
  color: var(--paper);
}

.hero__cta:hover {
  transform: translate(-2px, -2px);
}

/* ── Bands ─────────────────────────────────────────────────────────────── */
.band {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  container-type: inline-size;
}

.band--last {
  min-height: 60svh;
}

.band__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  line-height: 1;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  font-size: var(--type-display);
  margin: 0 0 2rem;
  color: var(--ink);
}

.band__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

.band__lead + .band__lead {
  margin-top: 1.2rem;
}

.band__lead code {
  font-family: var(--font-mono);
  background-color: var(--paper-1);
  padding: 0.1em 0.35em;
  border-radius: 0.2rem;
}

/* ── What it is ────────────────────────────────────────────────────────── */
.col {
  display: grid;
  gap: 1.2rem;
}

/* ── Demo ──────────────────────────────────────────────────────────────── */
.demo {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  scroll-margin-top: var(--chrome-band);
}

.demo__input-zone {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo__textarea {
  width: 100%;
  padding: 1rem 1.2rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  transition:
    border-color var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}

.demo__textarea::placeholder {
  color: var(--ink-3);
}

.demo__textarea:focus {
  outline: none;
  border-color: var(--ink);
  background: var(--paper);
}

.demo__textarea--active {
  animation: pulse 0.5s var(--ease);
}

@keyframes pulse {
  0%, 100% { border-color: var(--line); }
  50% { border-color: var(--spot); }
}

.demo__input-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo__hint,
.demo__working {
  font-size: 0.72rem;
  color: var(--ink-3);
  letter-spacing: 0.02em;
}

.demo__working {
  color: var(--spot);
}

.demo__prompts {
  margin-top: 0.8rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.demo__prompt {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  padding: 0.5rem 0.8rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 2rem;
  color: var(--ink-2);
  font-size: 0.72rem;
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
  transition:
    color var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}

.demo__prompt:hover {
  color: var(--ink);
  border-color: var(--ink);
  background: var(--paper);
}

.demo__prompt-label {
  font-weight: 600;
  color: var(--ink);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.demo__prompt-text {
  color: var(--ink-2);
  font-size: 0.68rem;
}

.demo__prompt:focus-visible {
  outline: var(--border-w) solid var(--ink);
  outline-offset: 2px;
}

/* ── Demo result ───────────────────────────────────────────────────────── */
.demo__result {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}

.demo__readout {
  padding: 1.2rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
}

.readout__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 1rem;
}

.readout__item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.readout__item--full {
  grid-column: 1 / -1;
}

.readout__key {
  font-size: 0.65rem;
  color: var(--ink-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.readout__val {
  font-size: 0.85rem;
  color: var(--ink);
  font-weight: 500;
}

.readout__swatches {
  display: flex;
  gap: 0.4rem;
}

.swatch {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  border: 1px solid var(--line);
}

.swatch--ink {
  border-color: var(--ink-2);
}

.readout__features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.feature-chip {
  padding: 0.25rem 0.6rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 2rem;
  font-size: 0.68rem;
  color: var(--ink-1);
  letter-spacing: 0.02em;
}

/* ── Preview ───────────────────────────────────────────────────────────── */
.demo__preview {
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  overflow: hidden;
  container-type: inline-size;
  background: var(--paper);
  color: var(--ink);
}

.preview {
  min-height: 50svh;
  display: flex;
  flex-direction: column;
}

/* Mode-specific preview styling (self-contained) */
.preview[data-mode='brutal'] {
  --border-w: 2px;
  --radius: 0;
  --shadow: 4px 4px 0 var(--ink);
}

.preview[data-mode='clay'] {
  --border-w: 1px;
  --radius: 12px;
  --shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.preview[data-mode='generative'] {
  --border-w: 1px;
  --radius: 0;
  --shadow: none;
}

.preview[data-mode='essential'] {
  --border-w: 1px;
  --radius: 2px;
  --shadow: none;
}

.preview__chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.2rem;
  border-bottom: var(--border-w, 1px) solid var(--line);
}

.preview__mark {
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 1.3rem;
  color: var(--ink);
}

.preview__nav {
  display: flex;
  gap: 1.2rem;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-2);
}

.preview__cta {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--spot);
}

.preview__hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  padding: clamp(2rem, 5vh, 4rem) 1.2rem;
}

.preview__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(1.6rem, 5cqw, 4rem);
  line-height: 1.05;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}

.preview__tagline {
  font-size: clamp(0.8rem, 1.2cqw, 1.05rem);
  line-height: 1.5;
  color: var(--ink-1);
  max-width: 36ch;
  margin: 0;
}

.preview__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--border-w, 1px);
  border-top: var(--border-w, 1px) solid var(--line);
  background: var(--line);
}

.preview__card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.8rem;
  background: var(--paper);
}

.preview__card-img {
  aspect-ratio: 4 / 3;
  background: var(--paper-1);
  border-radius: var(--radius, 2px);
}

.preview__card-info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.preview__card-label {
  font-size: 0.78rem;
  color: var(--ink);
  font-weight: 500;
}

.preview__card-meta {
  font-size: 0.72rem;
  color: var(--ink-2);
}

.preview__footer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  border-top: var(--border-w, 1px) solid var(--line);
  font-size: 0.68rem;
  color: var(--ink-3);
  margin-top: auto;
}

/* ── Empty state ───────────────────────────────────────────────────────── */
.demo__empty {
  margin-top: 2rem;
  display: grid;
  place-items: center;
  min-height: 30svh;
  border: 1px dashed var(--line);
  border-radius: 0.3rem;
}

.demo__empty-text {
  font-size: 0.85rem;
  color: var(--ink-3);
  text-align: center;
  max-width: 24ch;
  margin: 0;
  line-height: 1.5;
}

/* ── Transformation ────────────────────────────────────────────────────── */
.transform {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: start;
}

.transform__before,
.transform__after {
  padding: 1.5rem;
  border: 1px solid var(--line);
}

.transform__after {
  background-color: var(--paper-1);
  border-color: var(--ink);
}

.transform__label {
  font-size: var(--type-label);
  color: var(--ink-2);
  margin: 0 0 1rem;
  letter-spacing: 0.08em;
}

.transform__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.6rem;
  font-size: var(--type-body);
  color: var(--ink-1);
}

.transform__arrow {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  color: var(--ink-2);
  align-self: center;
}

/* ── What you get ──────────────────────────────────────────────────────── */
.gets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1.5rem;
}

.get {
  display: grid;
  gap: 0.5rem;
  align-content: start;
  padding: 1.5rem;
  border: 1px solid var(--line);
}

.get__num {
  font-size: var(--type-label);
  color: var(--ink-2);
  letter-spacing: 0.1em;
}

.get__title {
  font-size: var(--type-body);
  font-weight: 600;
  color: var(--ink);
  margin: 0;
}

.get__body {
  font-size: var(--type-meta);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

.get__body code {
  font-family: var(--font-mono);
  background-color: var(--paper-1);
  padding: 0.1em 0.35em;
  border-radius: 0.2rem;
}

/* ── Tiers ─────────────────────────────────────────────────────────────── */
.tiers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1.5rem;
}

.tier {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--line);
}

.tier--featured {
  border-color: var(--ink);
  background: var(--paper-1);
}

.tier__head {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.tier__name {
  font-size: var(--type-body);
  font-weight: 600;
  color: var(--ink);
  margin: 0;
}

.tier__price {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin: 0;
}

.tier__price-num {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: 1.6rem;
  color: var(--ink);
}

.tier__price-per {
  font-size: var(--type-label);
  color: var(--ink-2);
}

.tier__blurb {
  font-size: var(--type-body);
  color: var(--ink-1);
  margin: 0;
}

.tier__features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.tier__feature {
  display: flex;
  gap: 0.5rem;
  font-size: var(--type-meta);
  color: var(--ink-1);
}

.tier__check {
  color: var(--ink);
  font-weight: 600;
}

/* ── Proof ─────────────────────────────────────────────────────────────── */
.proof {
  display: grid;
  gap: 1.5rem;
}

.proof__quote {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3.5vw, 2.2rem);
  line-height: 1.3;
  color: var(--ink);
  margin: 0;
  max-width: 28ch;
}

.proof__attr {
  font-size: var(--type-label);
  color: var(--ink-2);
  margin: 0;
}

.proof__note {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

/* ── Final CTA ─────────────────────────────────────────────────────────── */
.final__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 2rem;
  padding: 0.9rem 1.6rem;
  font-size: var(--type-label);
  letter-spacing: 0.12em;
  color: var(--paper);
  background-color: var(--ink);
  text-decoration: none;
  transition: transform var(--dur) var(--ease);
}

.final__cta:hover {
  transform: translate(-2px, -2px);
}

.final__note {
  margin-top: 1.5rem;
  font-size: var(--type-label);
  color: var(--ink-2);
}

/* ── Transitions ───────────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s var(--ease);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
}

.slide-up-leave-active {
  transition: opacity 0.25s var(--ease);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(1.2rem);
}

.slide-up-leave-to {
  opacity: 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@container (min-width: 50rem) {
  .preview__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@container (max-width: 30rem) {
  .preview__nav {
    display: none;
  }
}

@media (max-width: 40rem) {
  .transform {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .transform__arrow {
    text-align: center;
    transform: rotate(90deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo__textarea--active,
  .final__cta {
    transition: none;
  }
}
</style>
