<script setup lang="ts">
import { extractIntent, intentToCssVars, type DesignIntent } from '~/composables/useIntentMapping';
import { useGenerativeCanvas } from '~/composables/useGenerativeCanvas';

useHead({
  title: 'Showcase — *blue red + purple/',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

useGenerativeCanvas();

// ── World templates ──────────────────────────────────────────────────────

interface WorldTemplate {
  id: string;
  prompt: string;
  title: string;
  strategy: string;
  tier: string;
}

const TEMPLATES: WorldTemplate[] = [
  { id: 'music-release', prompt: 'A bold music artist page with tour dates and a merch store', title: 'Artist Release World', strategy: 'Fan acquisition + merch conversion', tier: 'Release Campaign — $15–50k' },
  { id: 'music-alwayson', prompt: 'A dark, moody musician page with music player and videos', title: 'Always-On Artist World', strategy: 'Long-term fan community + streaming growth', tier: 'Artist World — $5–15k + $2–5k/mo' },
  { id: 'restaurant', prompt: 'A cozy Italian restaurant with warm lighting and a wine list', title: 'Restaurant World', strategy: 'Reservations + online ordering', tier: 'Release Campaign — $15–50k' },
  { id: 'hotel', prompt: 'A minimal boutique hotel with a booking calendar and serene vibe', title: 'Hotel World', strategy: 'Direct bookings + reduced OTA dependency', tier: 'Artist World — $5–15k + $2–5k/mo' },
  { id: 'books', prompt: 'A vintage bookstore with curated collections and a reading nook', title: 'Publisher World', strategy: 'Catalog browsing + pre-orders', tier: 'Release Campaign — $15–50k' },
  { id: 'label-os', prompt: 'A bright, energetic label page with multiple artists and releases', title: 'Label OS Dashboard', strategy: 'Roster-wide deployment + analytics', tier: 'Label OS — $20–100k/yr' },
];

const activeTemplate = ref<WorldTemplate>(TEMPLATES[0]);
const activeIntent = ref<DesignIntent | null>(null);
const isTransitioning = ref(false);

function selectTemplate(t: WorldTemplate) {
  if (t.id === activeTemplate.value.id) return;
  isTransitioning.value = true;
  setTimeout(() => {
    activeTemplate.value = t;
    activeIntent.value = extractIntent(t.prompt);
    isTransitioning.value = false;
  }, 200);
}

onMounted(() => {
  activeIntent.value = extractIntent(TEMPLATES[0].prompt);
});

const previewStyles = computed(() => {
  if (!activeIntent.value) return {};
  return intentToCssVars(activeIntent.value);
});

const previewMode = computed(() => activeIntent.value?.mode ?? 'essential');

// ── Strategy cards ────────────────────────────────────────────────────────

const STRATEGIES = [
  {
    name: 'Fan Acquisition',
    metric: '60% lower CAC',
    blurb: 'The world markets itself through shareable artifacts. Fans bring fans.',
    icon: '◉',
  },
  {
    name: 'Merch Conversion',
    metric: '3.2x conversion',
    blurb: 'In-world merch drops with scarcity mechanics. Buy before it disappears.',
    icon: '◇',
  },
  {
    name: 'Streaming Growth',
    metric: '4.5x CTR',
    blurb: 'Music plays in-world. One tap to Spotify. The world drives streams.',
    icon: '△',
  },
  {
    name: 'Data & Analytics',
    metric: 'Full funnel',
    blurb: 'Every interaction tracked. Know exactly who engaged and what they did.',
    icon: '□',
  },
  {
    name: 'Campaign Phases',
    metric: 'Always evolving',
    blurb: 'Pre-release teases. Release day blooms. Post-release grows. Never static.',
    icon: '○',
  },
  {
    label: 'White-Label',
    metric: 'Full roster',
    blurb: 'Every artist gets a world. Label dashboard shows everything in one place.',
    icon: '⬡',
  },
];

// ── Mode showcase ─────────────────────────────────────────────────────────

const MODES = [
  { id: 'essential', name: 'Essential', tagline: 'Quiet. Refined. Editorial.', use: 'Hotels, boutiques, luxury' },
  { id: 'brutal', name: 'Brutal', tagline: 'Bold. Raw. Loud.', use: 'Music, nightlife, streetwear' },
  { id: 'clay', name: 'Clay', tagline: 'Warm. Tactile. Human.', use: 'Restaurants, wellness, craft' },
  { id: 'generative', name: 'Generative', tagline: 'Living. Reactive. Alive.', use: 'Music, events, campaigns' },
];
</script>

<template>
  <div>
    <!-- Generative background -->
    <div class="gen-bg" aria-hidden="true">
      <canvas id="gen-canvas"></canvas>
    </div>

    <!-- Hero -->
    <section class="hero">
      <p class="hero__eyebrow font-mono ttu tracked">Visual proof — what the engine builds</p>
      <h1 class="hero__title">
        One engine.<br />Every world.
      </h1>
      <p class="hero__lead measure-wide">
        Same generative core. Different worlds for different strategies.
        Pick a template to see what changes — and what stays the same.
      </p>
    </section>

    <!-- Template picker -->
    <section class="templates">
      <h2 class="section__title">World templates</h2>
      <p class="section__sub">Each one is the same engine, a different brief. Click to see the transformation.</p>
      <div class="template__grid">
        <button
          v-for="t in TEMPLATES"
          :key="t.id"
          class="template__btn font-mono"
          :class="{ 'template__btn--active': t.id === activeTemplate.id }"
          @click="selectTemplate(t)"
        >
          <span class="template__btn-title">{{ t.title }}</span>
          <span class="template__btn-tier">{{ t.tier }}</span>
        </button>
      </div>
    </section>

    <!-- Live world preview -->
    <section class="preview-zone">
      <div class="preview-zone__head">
        <div>
          <h2 class="section__title">{{ activeTemplate.title }}</h2>
          <p class="section__sub">{{ activeTemplate.strategy }}</p>
        </div>
        <div v-if="activeIntent" class="readout">
          <span class="readout__item font-mono">
            <span class="readout__key">Mode</span>
            <span class="readout__val">{{ activeIntent.mode }}</span>
          </span>
          <span class="readout__item font-mono">
            <span class="readout__key">Mood</span>
            <span class="readout__val">{{ activeIntent.mood }}</span>
          </span>
          <span class="readout__item font-mono">
            <span class="readout__key">Industry</span>
            <span class="readout__val">{{ activeIntent.industry }}</span>
          </span>
          <span class="readout__item readout__item--swatches font-mono">
            <span class="readout__key">Palette</span>
            <span class="readout__swatches">
              <span class="swatch" :style="{ background: activeIntent.palette.paper }"></span>
              <span class="swatch swatch--ink" :style="{ background: activeIntent.palette.ink }"></span>
              <span class="swatch" :style="{ background: activeIntent.palette.spot }"></span>
            </span>
          </span>
        </div>
      </div>

      <!-- The actual preview -->
      <div
        class="preview-frame"
        :class="{ 'preview-frame--transitioning': isTransitioning }"
        :style="previewStyles"
        :data-mode="previewMode"
      >
        <div class="preview">
          <!-- Chrome -->
          <div class="preview__chrome">
            <span class="preview__mark">/</span>
            <nav class="preview__nav font-mono">
              <span v-for="item in ['Music', 'Tour', 'Merch', 'Videos']" :key="item" class="preview__nav-item">{{ item }}</span>
            </nav>
            <span class="preview__cta font-mono">Listen ↗</span>
          </div>

          <!-- Hero -->
          <div class="preview__hero">
            <h3 class="preview__title">LOW FREQUENCY</h3>
            <p class="preview__tagline">New EP — Out now on all platforms. Tour dates announced.</p>
            <div class="preview__actions">
              <span class="preview__action preview__action--primary font-mono">Stream now ↗</span>
              <span class="preview__action font-mono">Get tickets ↗</span>
            </div>
          </div>

          <!-- Content grid -->
          <div class="preview__grid">
            <div class="preview__card">
              <div class="preview__card-img"></div>
              <span class="preview__card-label font-mono">Track 01</span>
            </div>
            <div class="preview__card">
              <div class="preview__card-img"></div>
              <span class="preview__card-label font-mono">Track 02</span>
            </div>
            <div class="preview__card">
              <div class="preview__card-img"></div>
              <span class="preview__card-label font-mono">Track 03</span>
            </div>
            <div class="preview__card">
              <div class="preview__card-img"></div>
              <span class="preview__card-label font-mono">Track 04</span>
            </div>
          </div>

          <!-- Tour -->
          <div class="preview__tour">
            <p class="preview__tour-label font-mono ttu tracked">Tour dates</p>
            <ol class="preview__tour-list">
              <li v-for="d in [['16 Mar', 'Berlin'], ['21 Mar', 'Paris'], ['29 Mar', 'London']]" :key="d[0]" class="preview__tour-row">
                <span class="preview__tour-date font-mono">{{ d[0] }}</span>
                <span class="preview__tour-city">{{ d[1] }}</span>
                <span class="preview__tour-cta font-mono">Tickets ↗</span>
              </li>
            </ol>
          </div>

          <!-- Footer -->
          <div class="preview__footer font-mono">
            <span>© 2026</span>
            <span>Press kit ↗</span>
            <span>Booking ↗</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Strategy proofs -->
    <section class="strategies">
      <h2 class="section__title">Business strategies</h2>
      <p class="section__sub">Different goals. Same engine. Here's what we optimize for.</p>
      <div class="strategy__grid">
        <div v-for="s in STRATEGIES" :key="s.name" class="strategy__card">
          <span class="strategy__icon">{{ s.icon }}</span>
          <h3 class="strategy__name">{{ s.name }}</h3>
          <p class="strategy__metric font-mono">{{ s.metric }}</p>
          <p class="strategy__blurb">{{ s.blurb }}</p>
        </div>
      </div>
    </section>

    <!-- Mode showcase -->
    <section class="modes">
      <h2 class="section__title">Four modes, one engine</h2>
      <p class="section__sub">The design kernel changes. The architecture doesn't.</p>
      <div class="mode__grid">
        <div v-for="m in MODES" :key="m.id" class="mode__card" :data-mode="m.id">
          <h3 class="mode__name">{{ m.name }}</h3>
          <p class="mode__tagline">{{ m.tagline }}</p>
          <p class="mode__use font-mono">Best for: {{ m.use }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2 class="cta__title">Build your world</h2>
      <p class="cta__lead measure-wide">
        Every template above is the same engine running a different brief.
        Your artist. Your world. Your strategy. 48 hours.
      </p>
      <a href="mailto:hi@blueredandpurple.world" class="cta__btn font-mono ttu tracked">
        Get in touch <span aria-hidden="true">↗</span>
      </a>
    </section>
  </div>
</template>

<style scoped>
/* ── Generative background ─────────────────────────────────────────────── */
.gen-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity var(--dur) var(--ease),
    visibility var(--dur) var(--ease);
}

:root[data-mode='generative'] .gen-bg {
  opacity: 1;
  visibility: visible;
}

#gen-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.gen-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--paper);
  opacity: 0.28;
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  z-index: 1;
  min-height: 80svh;
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

/* ── Section titles ────────────────────────────────────────────────────── */
.section__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  margin: 0 0 0.5rem;
  color: var(--ink);
}

.section__sub {
  font-size: var(--type-body);
  color: var(--ink-1);
  margin: 0 0 2rem;
}

/* ── Template picker ───────────────────────────────────────────────────── */
.templates {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 8vh, 6rem) var(--edge);
  border-top: 1px solid var(--line);
}

.template__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 0.8rem;
}

.template__btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  padding: 1rem 1.2rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease),
    background-color var(--dur) var(--ease);
}

.template__btn:hover {
  border-color: var(--ink-2);
}

.template__btn--active {
  border-color: var(--ink);
  background: var(--paper);
}

.template__btn-title {
  font-size: 0.9rem;
  color: var(--ink);
  font-weight: 500;
}

.template__btn-tier {
  font-size: 0.7rem;
  color: var(--ink-2);
  letter-spacing: 0.02em;
}

/* ── Preview zone ──────────────────────────────────────────────────────── */
.preview-zone {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 8vh, 6rem) var(--edge);
  border-top: 1px solid var(--line);
}

.preview-zone__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.readout {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.readout__item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.readout__key {
  font-size: 0.65rem;
  color: var(--ink-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.readout__val {
  font-size: 0.8rem;
  color: var(--ink);
  font-weight: 500;
}

.readout__swatches {
  display: flex;
  gap: 0.3rem;
}

.swatch {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  border: 1px solid var(--line);
}

.swatch--ink {
  border-color: var(--ink-2);
}

/* ── Preview frame ─────────────────────────────────────────────────────── */
.preview-frame {
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  overflow: hidden;
  transition: opacity 0.2s var(--ease);
}

.preview-frame--transitioning {
  opacity: 0.5;
}

.preview {
  min-height: 70svh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
  color: var(--ink);
  container-type: inline-size;
}

.preview__chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid var(--line);
}

.preview__mark {
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 1.2rem;
  color: var(--ink);
}

.preview__nav {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-2);
}

.preview__cta {
  font-size: 0.7rem;
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
  padding: clamp(2rem, 6vh, 4rem) 1.2rem;
}

.preview__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(1.8rem, 6cqw, 4rem);
  line-height: 1.05;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}

.preview__tagline {
  font-size: clamp(0.8rem, 1.2cqw, 1rem);
  line-height: 1.5;
  color: var(--ink-1);
  max-width: 30ch;
  margin: 0;
}

.preview__actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.8rem;
}

.preview__action {
  padding: 0.6rem 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid var(--line);
  color: var(--ink);
}

.preview__action--primary {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.preview__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  border-top: 1px solid var(--line);
}

.preview__card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.8rem;
}

.preview__card-img {
  aspect-ratio: 1;
  background: var(--paper-1);
  border-radius: 0.2rem;
}

.preview__card-label {
  font-size: 0.65rem;
  color: var(--ink-2);
}

.preview__tour {
  border-top: 1px solid var(--line);
  padding: 1.2rem;
}

.preview__tour-label {
  font-size: 0.7rem;
  color: var(--ink-2);
  letter-spacing: 0.08em;
  margin: 0 0 0.8rem;
}

.preview__tour-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.preview__tour-row {
  display: grid;
  grid-template-columns: 5rem 1fr auto;
  align-items: baseline;
  gap: 1rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--line);
  font-size: 0.85rem;
}

.preview__tour-date {
  color: var(--ink-2);
}

.preview__tour-city {
  color: var(--ink);
}

.preview__tour-cta {
  font-size: 0.7rem;
  color: var(--spot);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.preview__footer {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1.2rem;
  border-top: 1px solid var(--line);
  font-size: 0.65rem;
  color: var(--ink-3);
  margin-top: auto;
}

/* ── Strategies ────────────────────────────────────────────────────────── */
.strategies {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 8vh, 6rem) var(--edge);
  border-top: 1px solid var(--line);
}

.strategy__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
}

.strategy__card {
  display: grid;
  gap: 0.4rem;
  padding: 1.2rem;
  border: 1px solid var(--line);
  align-content: start;
}

.strategy__icon {
  font-size: 1.4rem;
  color: var(--spot);
}

.strategy__name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
}

.strategy__metric {
  font-size: 0.75rem;
  color: var(--spot);
  font-weight: 600;
  margin: 0;
}

.strategy__blurb {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--ink-1);
  margin: 0;
}

/* ── Modes ──────────────────────────────────────────────────────────────── */
.modes {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 8vh, 6rem) var(--edge);
  border-top: 1px solid var(--line);
}

.mode__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
  gap: 1rem;
}

.mode__card {
  padding: 1.2rem;
  border: 1px solid var(--line);
  background: var(--paper);
}

.mode__card[data-mode='brutal'] {
  background: var(--ink);
  color: var(--paper);
}

.mode__card[data-mode='brutal'] .mode__name,
.mode__card[data-mode='brutal'] .mode__tagline,
.mode__card[data-mode='brutal'] .mode__use {
  color: var(--paper);
}

.mode__card[data-mode='generative'] {
  background: linear-gradient(135deg, var(--paper) 0%, color-mix(in srgb, var(--spot) 15%, var(--paper)) 100%);
}

.mode__name {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: 1.3rem;
  color: var(--ink);
  margin: 0 0 0.3rem;
  text-transform: uppercase;
}

.mode__tagline {
  font-size: 0.9rem;
  color: var(--ink-1);
  margin: 0 0 0.8rem;
}

.mode__use {
  font-size: 0.7rem;
  color: var(--ink-2);
  margin: 0;
}

/* ── CTA ───────────────────────────────────────────────────────────────── */
.cta {
  position: relative;
  z-index: 1;
  padding: clamp(4rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  display: grid;
  gap: 1.5rem;
  align-content: center;
}

.cta__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  margin: 0;
  color: var(--ink);
}

.cta__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

.cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  width: fit-content;
  padding: 0.9rem 1.6rem;
  font-size: var(--type-label);
  letter-spacing: 0.12em;
  color: var(--paper);
  background-color: var(--ink);
  text-decoration: none;
  transition: transform var(--dur) var(--ease);
}

.cta__btn:hover {
  transform: translate(-2px, -2px);
}

/* ── Responsive ────────────────────────────────────────────────────────── */
@container (min-width: 50rem) {
  .preview__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 40rem) {
  .preview-zone__head {
    flex-direction: column;
    align-items: flex-start;
  }

  .preview__nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta__btn {
    transition: none;
  }
}
</style>
