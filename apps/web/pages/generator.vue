<script setup lang="ts">
import { extractIntent, intentToCssVars, type DesignIntent } from '~/composables/useIntentMapping';

useHead({
  title: 'Generator — *blue red + purple/',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

const PROMPTS = [
  'A cozy Italian restaurant with warm lighting and a wine list',
  'A dark, moody nightclub with neon accents and a DJ lineup',
  'A minimal boutique hotel with a booking calendar and serene vibe',
  'A bold music artist page with tour dates and a merch store',
  'A vintage bookstore with curated collections and a reading nook',
  'A bright, playful ramen shop with online ordering and a photo gallery',
];

const input = ref('');
const isGenerating = ref(false);
const showResult = ref(false);

// Debounced intent
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
  }, 300);
}

function tryPrompt(prompt: string) {
  input.value = prompt;
  isGenerating.value = true;
  showResult.value = false;

  // Simulate a brief generation delay for effect
  setTimeout(() => {
    intent.value = extractIntent(prompt);
    showResult.value = true;
    isGenerating.value = false;
  }, 600);
}

const previewStyles = computed(() => {
  if (!intent.value) return {};
  return intentToCssVars(intent.value);
});

const previewMode = computed(() => intent.value?.mode ?? 'essential');

// Sample data for the live preview
const previewContent = computed(() => {
  const ind = intent.value?.industry ?? 'restaurant';
  const map: Record<string, { title: string; tagline: string; items: string[]; cta: string }> = {
    restaurant: {
      title: 'Pasta · Vino · Terra',
      tagline: 'A neighborhood kitchen serving handmade pasta and natural wine since 2019.',
      items: ['Today\'s Menu', 'Wine List', 'Reserve a Table', 'Private Events'],
      cta: 'Order for pickup',
    },
    music: {
      title: 'LOW FREQUENCY',
      tagline: 'New EP — Out now on all platforms. Tour dates announced.',
      items: ['Stream', 'Tour', 'Merch', 'Videos'],
      cta: 'Get tickets',
    },
    hotel: {
      title: 'The Quiet Stay',
      tagline: 'Twelve rooms. One courtyard. Zero distractions.',
      items: ['Suites', 'Dining', 'Wellness', 'Contact'],
      cta: 'Book now',
    },
    books: {
      title: 'Between the Lines',
      tagline: 'A publishing house for voices that don\'t fit the algorithm.',
      items: ['New Releases', 'Backlist', 'Authors', 'Submit'],
      cta: 'Browse catalog',
    },
    vintage: {
      title: 'Found & Kept',
      tagline: 'Curated vintage furniture, clothing, and oddities from the 1960s–1990s.',
      items: ['New Arrivals', 'Furniture', 'Clothing', 'Journal'],
      cta: 'Shop now',
    },
    unknown: {
      title: 'Your Project',
      tagline: 'Describe what you need and we\'ll map it to a design system.',
      items: ['About', 'Work', 'Services', 'Contact'],
      cta: 'Get in touch',
    },
  };
  return map[ind] ?? map.unknown;
});
</script>

<template>
  <main class="gen">
    <!-- Header -->
    <section class="gen__intro">
      <h1 class="gen__h1">Describe it.<br />We'll design it.</h1>
      <p class="gen__lead measure">
        Tell us what you're building in plain English. Our system maps your
        intent to a complete design — mode, palette, typography, and layout —
        in real time. No templates. No subscriptions. Just one page that works.
      </p>
    </section>

    <!-- Input -->
    <section class="gen__input-zone">
      <label for="gen-input" class="visually-hidden">Describe your project</label>
      <textarea
        id="gen-input"
        v-model="input"
        class="gen__textarea font-mono"
        :class="{ 'gen__textarea--active': isGenerating }"
        rows="2"
        placeholder="A cozy Italian restaurant with warm lighting and a wine list..."
        @input="onInput"
        @keydown.meta.enter="tryPrompt(input)"
      />
      <div class="gen__input-foot">
        <span class="gen__hint font-mono">⌘+Enter to generate · or pick a prompt below</span>
        <span v-if="isGenerating" class="gen__working font-mono">Generating…</span>
      </div>
    </section>

    <!-- Quick prompts -->
    <section class="gen__prompts">
      <button
        v-for="prompt in PROMPTS"
        :key="prompt"
        type="button"
        class="gen__prompt font-mono"
        @click="tryPrompt(prompt)"
      >
        {{ prompt }}
      </button>
    </section>

    <!-- Intent readout -->
    <transition name="fade">
      <section v-if="intent && showResult" class="gen__readout">
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
              <span class="swatch" :style="{ background: intent.palette.paper }" title="paper">Paper</span>
              <span class="swatch swatch--ink" :style="{ background: intent.palette.ink }" title="ink">Ink</span>
              <span class="swatch" :style="{ background: intent.palette.spot }" title="spot">Spot</span>
            </span>
          </div>
          <div v-if="intent.features.length" class="readout__item readout__item--full">
            <span class="readout__key font-mono">Features</span>
            <span class="readout__features">
              <span v-for="f in intent.features" :key="f" class="feature-chip font-mono">{{ f }}</span>
            </span>
          </div>
        </div>
      </section>
    </transition>

    <!-- Live preview -->
    <transition name="slide-up">
      <section v-if="intent && showResult" class="gen__preview" :style="previewStyles" :data-mode="previewMode">
        <div class="preview">
          <div class="preview__chrome">
            <span class="preview__mark">/</span>
            <nav class="preview__nav font-mono">
              <span v-for="item in previewContent.items" :key="item" class="preview__nav-item">{{ item }}</span>
            </nav>
          </div>

          <div class="preview__hero">
            <h2 class="preview__title">{{ previewContent.title }}</h2>
            <p class="preview__tagline">{{ previewContent.tagline }}</p>
            <span class="preview__cta font-mono">{{ previewContent.cta }} ↗</span>
          </div>

          <div class="preview__grid">
            <div v-for="i in 4" :key="i" class="preview__card">
              <div class="preview__card-img"></div>
              <span class="preview__card-label font-mono">Item {{ i }}</span>
            </div>
          </div>

          <div class="preview__footer font-mono">
            <span>© 2025</span>
            <span>hi@blueredandpurple.world</span>
          </div>
        </div>
      </section>
    </transition>
  </main>
</template>

<style scoped>
.gen {
  position: relative;
  z-index: 1;
  max-width: 60rem;
  margin: 0 auto;
  padding: clamp(5.5rem, 13vh, 8rem) var(--edge) clamp(4rem, 9vh, 5.5rem);
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
}

/* ── Intro ───────────────────────────────────────────────────────────── */

.gen__intro {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.gen__h1 {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}

.gen__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

/* ── Input ───────────────────────────────────────────────────────────── */

.gen__input-zone {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.gen__textarea {
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

.gen__textarea::placeholder {
  color: var(--ink-3);
}

.gen__textarea:focus {
  outline: none;
  border-color: var(--ink);
  background: var(--paper);
}

.gen__textarea--active {
  animation: pulse 0.6s var(--ease);
}

@keyframes pulse {
  0%, 100% { border-color: var(--line); }
  50% { border-color: var(--spot); }
}

.gen__input-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gen__hint,
.gen__working {
  font-size: 0.72rem;
  color: var(--ink-3);
  letter-spacing: 0.02em;
}

.gen__working {
  color: var(--spot);
}

/* ── Prompts ─────────────────────────────────────────────────────────── */

.gen__prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.gen__prompt {
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

.gen__prompt:hover {
  color: var(--ink);
  border-color: var(--ink);
  background: var(--paper);
}

.gen__prompt:focus-visible {
  outline: var(--border-w) solid var(--ink);
  outline-offset: 2px;
}

/* ── Readout ─────────────────────────────────────────────────────────── */

.readout__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1rem;
  padding: 1.4rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
}

.readout__item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.readout__item--full {
  grid-column: 1 / -1;
}

.readout__key {
  font-size: 0.68rem;
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
  gap: 0.5rem;
}

.swatch {
  padding: 0.3rem 0.7rem;
  border-radius: 2rem;
  font-size: 0.68rem;
  font-family: var(--font-mono);
  color: var(--ink-2);
  border: 1px solid var(--line);
}

.swatch--ink {
  color: var(--paper);
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

/* ── Live Preview ────────────────────────────────────────────────────── */

.gen__preview {
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  overflow: hidden;
  container-type: inline-size;
}

.preview {
  min-height: 60svh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
  color: var(--ink);
}

.preview__chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.4rem;
  border-bottom: 1px solid var(--line);
}

.preview__mark {
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 1.4rem;
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

.preview__nav-item {
  cursor: default;
}

.preview__hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  padding: clamp(3rem, 8vh, 6rem) 1.4rem;
}

.preview__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(2.5rem, 7cqw, 5rem);
  line-height: 1;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}

.preview__tagline {
  font-size: clamp(0.9rem, 1.5cqw, 1.15rem);
  line-height: 1.5;
  color: var(--ink-1);
  max-width: 30ch;
  margin: 0;
}

.preview__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin-top: 1rem;
  padding: 0.7rem 1.2rem;
  background: var(--ink);
  color: var(--paper);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 2rem;
}

.preview__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border-top: 1px solid var(--line);
}

.preview__card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.preview__card-img {
  aspect-ratio: 4 / 3;
  background: var(--paper-1);
  border-radius: 0.2rem;
}

.preview__card-label {
  font-size: 0.68rem;
  color: var(--ink-2);
}

.preview__footer {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1.4rem;
  border-top: 1px solid var(--line);
  font-size: 0.68rem;
  color: var(--ink-3);
}

/* ── Transitions ─────────────────────────────────────────────────────── */

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
  transform: translateY(1.5rem);
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

@container (max-width: 40rem) {
  .preview__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .preview__nav {
    display: none;
  }
}
</style>
