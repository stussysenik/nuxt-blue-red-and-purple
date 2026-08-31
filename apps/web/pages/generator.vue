<script setup lang="ts">
import { extractIntent, type DesignIntent, type Industry } from '~/composables/useIntentMapping';

useHead({
  title: 'Generator — *blue red + purple/',
  meta: [
    { name: 'description', content: 'Describe what you need in plain English. Our engine maps your intent to a complete design system — mode, palette, typography, layout — and generates a one-page site.' },
  ],
});

// ─────────────────────────────────────────────────────────────────────────
// Prompt chips
// ─────────────────────────────────────────────────────────────────────────

const PROMPTS = [
  { label: 'Music', text: 'A bold music artist page with tour dates and a merch store' },
  { label: 'Restaurant', text: 'A cozy Italian restaurant with warm lighting and a wine list' },
  { label: 'Hotel', text: 'A minimal boutique hotel with a booking calendar and serene vibe' },
  { label: 'Books', text: 'A vintage bookstore with curated collections and a reading nook' },
  { label: 'Nightclub', text: 'A dark, moody nightclub with neon accents and a DJ lineup' },
  { label: 'Label', text: 'A bright, energetic label page with multiple artists and releases' },
];

// ─────────────────────────────────────────────────────────────────────────
// State machine: idle → extracting → generating → preview
// ─────────────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'extracting' | 'generating' | 'preview';
const phase = ref<Phase>('idle');
const input = ref('');
const intent = ref<DesignIntent | null>(null);
const isGenerating = ref(false);

// Generation animation: files "written" one by one
interface GeneratedFile {
  path: string;
  size: string;
  status: 'writing' | 'done';
}
const generatedFiles = ref<GeneratedFile[][]>([]);
const totalSize = ref('0 MB');
const progress = ref(0);
const generationComplete = ref(false);

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

// ─────────────────────────────────────────────────────────────────────────
// Intent extraction (debounced, runs as user types)
// ─────────────────────────────────────────────────────────────────────────

function onInput() {
  clearTimeout(debounceTimer);
  if (!input.value.trim() || phase.value !== 'idle') {
    return;
  }
  debounceTimer = setTimeout(() => {
    intent.value = extractIntent(input.value);
  }, 150);
}

// ─────────────────────────────────────────────────────────────────────────
// Generation pipeline: extract intent → animate file tree → show preview
// ─────────────────────────────────────────────────────────────────────────

function runGeneration(promptText?: string) {
  if (promptText) input.value = promptText;
  if (!input.value.trim()) return;

  phase.value = 'extracting';
  isGenerating.value = true;
  generationComplete.value = false;
  generatedFiles.value = [];
  progress.value = 0;

  // Stage 1: extract intent (fake AI thinking)
  setTimeout(() => {
    intent.value = extractIntent(input.value);
    phase.value = 'generating';
    runFileAnimation();
  }, 600);
}

// Build the file tree from intent, then animate it appearing
function runFileAnimation() {
  const files = buildFileTree(intent.value!);
  const batchSize = 3;
  let batch = 0;

  const interval = setInterval(() => {
    const start = batch * batchSize;
    const end = Math.min(start + batchSize, files.length);
    if (start >= files.length) {
      clearInterval(interval);
      // Done generating
      setTimeout(() => {
        phase.value = 'preview';
        isGenerating.value = false;
        generationComplete.value = true;
        totalSize.value = '31.2 MB';
      }, 400);
      return;
    }

    const batchFiles = files.slice(start, end).map((f) => ({ ...f, status: 'done' as const }));
    generatedFiles.value = [...generatedFiles.value, batchFiles];
    progress.value = Math.round((end / files.length) * 100);
    batch++;
  }, 120);
}

// ─────────────────────────────────────────────────────────────────────────
// File tree generator — builds realistic output from intent
// ─────────────────────────────────────────────────────────────────────────

function buildFileTree(intent: DesignIntent): GeneratedFile[] {
  const industry = intent.industry;
  const mode = intent.mode;
  const ext = mode === 'brutal' ? 'tsx' : 'vue';

  const tree: GeneratedFile[] = [
    { path: `app/pages/index.${ext}`, size: '4.2 KB', status: 'writing' },
    { path: 'app/layouts/default.vue', size: '2.1 KB', status: 'writing' },
    { path: 'app/components/Hero.vue', size: '3.8 KB', status: 'writing' },
    { path: 'app/components/Chrome.vue', size: '1.6 KB', status: 'writing' },
  ];

  // Industry-specific components
  if (industry === 'music') {
    tree.push({ path: 'app/components/TourDates.vue', size: '2.9 KB', status: 'writing' });
    tree.push({ path: 'app/components/MerchGrid.vue', size: '3.1 KB', status: 'writing' });
    tree.push({ path: 'app/components/MusicPlayer.vue', size: '4.7 KB', status: 'writing' });
    tree.push({ path: 'app/data/releases.json', size: '1.8 KB', status: 'writing' });
    tree.push({ path: 'public/art/cover.jpg', size: '8.4 MB', status: 'writing' });
    tree.push({ path: 'public/art/press-01.jpg', size: '2.1 MB', status: 'writing' });
    tree.push({ path: 'public/art/press-02.jpg', size: '1.9 MB', status: 'writing' });
  } else if (industry === 'restaurant') {
    tree.push({ path: 'app/components/Menu.vue', size: '3.4 KB', status: 'writing' });
    tree.push({ path: 'app/components/OrderFlow.vue', size: '5.2 KB', status: 'writing' });
    tree.push({ path: 'app/components/Gallery.vue', size: '2.1 KB', status: 'writing' });
    tree.push({ path: 'app/data/menu.json', size: '2.3 KB', status: 'writing' });
    tree.push({ path: 'public/art/hero.jpg', size: '6.8 MB', status: 'writing' });
    tree.push({ path: 'public/art/dish-01.jpg', size: '1.4 MB', status: 'writing' });
    tree.push({ path: 'public/art/dish-02.jpg', size: '1.2 MB', status: 'writing' });
    tree.push({ path: 'public/art/dish-03.jpg', size: '1.1 MB', status: 'writing' });
  } else if (industry === 'hotel') {
    tree.push({ path: 'app/components/BookingRail.vue', size: '3.6 KB', status: 'writing' });
    tree.push({ path: 'app/components/RoomGrid.vue', size: '2.8 KB', status: 'writing' });
    tree.push({ path: 'app/components/Amenities.vue', size: '2.2 KB', status: 'writing' });
    tree.push({ path: 'public/art/suite.jpg', size: '5.9 MB', status: 'writing' });
    tree.push({ path: 'public/art/lobby.jpg', size: '4.2 MB', status: 'writing' });
  } else if (industry === 'books') {
    tree.push({ path: 'app/components/Catalog.vue', size: '3.9 KB', status: 'writing' });
    tree.push({ path: 'app/components/ReadingMode.vue', size: '4.1 KB', status: 'writing' });
    tree.push({ path: 'app/data/titles.json', size: '3.2 KB', status: 'writing' });
    tree.push({ path: 'public/art/cover.jpg', size: '2.8 MB', status: 'writing' });
  } else {
    tree.push({ path: 'app/components/ContentGrid.vue', size: '2.4 KB', status: 'writing' });
    tree.push({ path: 'app/components/Hero.vue', size: '3.8 KB', status: 'writing' });
    tree.push({ path: 'public/art/hero.jpg', size: '4.6 MB', status: 'writing' });
  }

  // Shared assets
  tree.push({ path: 'assets/css/modes/essential.css', size: '1.0 KB', status: 'writing' });
  tree.push({ path: 'assets/css/modes/brutal.css', size: '1.1 KB', status: 'writing' });
  tree.push({ path: 'assets/css/modes/clay.css', size: '1.2 KB', status: 'writing' });
  tree.push({ path: 'assets/css/modes/generative.css', size: '1.4 KB', status: 'writing' });
  tree.push({ path: 'assets/css/base.css', size: '0.8 KB', status: 'writing' });
  tree.push({ path: 'assets/css/fonts.css', size: '0.4 KB', status: 'writing' });
  tree.push({ path: 'public/fonts/archivo-wght.woff2', size: '186 KB', status: 'writing' });
  tree.push({ path: 'public/fonts/ibm-plex-mono-400.woff2', size: '64 KB', status: 'writing' });
  tree.push({ path: 'nuxt.config.ts', size: '1.4 KB', status: 'writing' });
  tree.push({ path: 'uno.config.ts', size: '1.8 KB', status: 'writing' });
  tree.push({ path: 'package.json', size: '0.9 KB', status: 'writing' });

  return tree;
}

// ─────────────────────────────────────────────────────────────────────────
// Preview: computed styles from intent
// ─────────────────────────────────────────────────────────────────────────

const allPreviewStyles = computed(() => {
  if (!intent.value) return {};
  const p = intent.value.palette;
  const mode = intent.value.mode;

  const ink1 = mixColors(p.ink, p.paper, 0.25);
  const ink2 = mixColors(p.ink, p.paper, 0.45);
  const ink3 = mixColors(p.ink, p.paper, 0.65);
  const paper1 = mixColors(p.paper, p.ink, 0.06);
  const line = mixColors(p.ink, p.paper, 0.12);

  let borderW = '1px';
  let radius = '2px';
  let shadow = 'none';
  let wght = '500';
  let tracking = '0';
  let display = 'clamp(2.4rem, 7vw, 5rem)';

  switch (mode) {
    case 'brutal':
      borderW = '2px'; radius = '0'; shadow = `4px 4px 0 ${p.ink}`; wght = '800'; tracking = '-0.02em'; display = 'clamp(2.8rem, 8vw, 6rem)';
      break;
    case 'clay':
      borderW = '1px'; radius = '12px'; shadow = '0 4px 12px rgba(0,0,0,0.08)'; wght = '700'; tracking = '-0.015em'; display = 'clamp(2.8rem, 8vw, 6rem)';
      break;
    case 'generative':
      borderW = '1px'; radius = '0'; shadow = 'none'; wght = '340'; tracking = '0'; display = 'clamp(2.4rem, 7vw, 5rem)';
      break;
    case 'essential':
      borderW = '1px'; radius = '2px'; shadow = 'none'; wght = '500'; tracking = '0'; display = 'clamp(2.4rem, 7vw, 5rem)';
      break;
  }

  return {
    '--paper': p.paper, '--paper-1': paper1, '--ink': p.ink,
    '--ink-1': ink1, '--ink-2': ink2, '--ink-3': ink3, '--line': line,
    '--spot': p.spot, '--surface': paper1, '--border-w': borderW,
    '--radius': radius, '--shadow': shadow, '--type-display': display,
    '--wght-display': wght, '--tracking-display': tracking,
  };
});

function mixColors(hex1: string, hex2: string, weight: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 * (1 - weight) + r2 * weight);
  const g = Math.round(g1 * (1 - weight) + g2 * weight);
  const b = Math.round(b1 * (1 - weight) + b2 * weight);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const previewMode = computed(() => intent.value?.mode ?? 'essential');

// ─────────────────────────────────────────────────────────────────────────
// Dynamic content per industry
// ─────────────────────────────────────────────────────────────────────────

interface Content {
  title: string; tagline: string; nav: string[]; cta: string;
  cards: { label: string; meta: string }[]; footer: string[];
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

function resetDemo() {
  phase.value = 'idle';
  input.value = '';
  intent.value = null;
  generatedFiles.value = [];
  progress.value = 0;
  generationComplete.value = false;
  isGenerating.value = false;
}
</script>

<template>
  <div>
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- HERO                                                              -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="hero">
      <p class="hero__eyebrow font-mono ttu tracked">blue red + purple</p>
      <h1 class="hero__title">
        Describe it.<br />Get a site.
      </h1>
      <p class="hero__lead measure-wide">
        Tell us what you need in plain English. Our engine maps your intent to a
        complete design system — mode, palette, typography, layout — and generates
        a one-page site. Not a template. A build. ~31 MB, ready to deploy.
      </p>
      <div class="hero__actions">
        <button class="hero__cta hero__cta--primary font-mono ttu tracked" @click="runGeneration('A bold music artist page with tour dates and a merch store')">
          Try the demo ↓
        </button>
        <NuxtLink to="/works" class="hero__cta font-mono ttu tracked">
          See our work
        </NuxtLink>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- THE GENERATOR                                                    -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section id="demo" class="demo" :class="`demo--${phase}`">
      <!-- Input zone -->
      <div class="demo__input-zone">
        <label for="gen-input" class="visually-hidden">Describe your project</label>
        <textarea
          id="gen-input"
          v-model="input"
          class="demo__textarea font-mono"
          rows="2"
          placeholder="A bold music artist page with tour dates and a merch store..."
          :disabled="phase === 'extracting' || phase === 'generating'"
          @input="onInput"
          @keydown.meta.enter="runGeneration()"
          @keydown.ctrl.enter="runGeneration()"
        />
        <div class="demo__input-foot">
          <span class="demo__hint font-mono">⌘+Enter to generate</span>
          <button
            class="demo__generate font-mono ttu tracked"
            :disabled="!input.trim() || phase === 'extracting' || phase === 'generating'"
            @click="runGeneration()"
          >
            {{ phase === 'generating' ? 'Generating…' : phase === 'extracting' ? 'Extracting…' : 'Generate' }}
          </button>
        </div>
      </div>

      <!-- Prompt chips -->
      <div class="demo__prompts">
        <button
          v-for="p in PROMPTS"
          :key="p.text"
          type="button"
          class="demo__prompt font-mono"
          :disabled="phase === 'extracting' || phase === 'generating'"
          @click="runGeneration(p.text)"
        >
          <span class="demo__prompt-label">{{ p.label }}</span>
          <span class="demo__prompt-text">{{ p.text }}</span>
        </button>
      </div>

      <!-- Output area: generation animation + preview -->
      <div v-if="phase !== 'idle'" class="demo__output">
        <!-- File generation animation -->
        <transition name="fade">
          <div v-if="(phase === 'extracting' || phase === 'generating') && intent" class="demo__terminal">
            <div class="terminal__head font-mono">
              <span class="terminal__dot terminal__dot--red"></span>
              <span class="terminal__dot terminal__dot--yellow"></span>
              <span class="terminal__dot terminal__dot--green"></span>
              <span class="terminal__title">blue-red-engine — {{ phase === 'extracting' ? 'extract' : 'build' }}</span>
            </div>
            <div class="terminal__body">
              <template v-if="phase === 'extracting'">
                <p class="terminal__line"><span class="terminal__prompt">$</span> Analyzing intent…</p>
                <p class="terminal__line"><span class="terminal__prompt">›</span> Industry: <span class="terminal__val">{{ intent.industry }}</span></p>
                <p class="terminal__line"><span class="terminal__prompt">›</span> Mood: <span class="terminal__val">{{ intent.mood }}</span></p>
                <p class="terminal__line"><span class="terminal__prompt">›</span> Mode: <span class="terminal__val">{{ intent.mode }}</span></p>
                <p class="terminal__line terminal__line--dim"><span class="terminal__prompt">›</span> Mapping tokens…</p>
              </template>
              <template v-else>
                <p class="terminal__line"><span class="terminal__prompt">$</span> Writing {{ generatedFiles.flat().length }} files…</p>
                <div class="terminal__files">
                  <p v-for="(batch, bi) in generatedFiles" :key="bi" class="terminal__file-batch">
                    <span v-for="file in batch" :key="file.path" class="terminal__file">
                      <span class="terminal__file-status">✓</span>
                      <span class="terminal__file-path">{{ file.path }}</span>
                      <span class="terminal__file-size">{{ file.size }}</span>
                    </span>
                  </p>
                </div>
                <div class="terminal__progress">
                  <div class="terminal__progress-bar">
                    <div class="terminal__progress-fill" :style="{ width: `${progress}%` }"></div>
                  </div>
                  <span class="terminal__progress-pct font-mono">{{ progress }}%</span>
                </div>
              </template>
            </div>
          </div>
        </transition>

        <!-- Live preview -->
        <transition name="slide-up">
          <div v-if="phase === 'preview' && intent" class="demo__preview-wrap">
            <!-- Intent readout -->
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

            <!-- Live site preview -->
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

            <!-- Result bar -->
            <div class="demo__result-bar font-mono">
              <span class="demo__result-size">{{ totalSize }} generated</span>
              <span class="demo__result-files">{{ generatedFiles.flat().length }} files written</span>
              <button class="demo__reset" @click="resetDemo">Try another</button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Empty state -->
      <transition name="fade">
        <div v-if="phase === 'idle'" class="demo__empty">
          <p class="demo__empty-text font-mono">
            Type a brief or pick a prompt above. The engine extracts intent,
            maps it to a design system, and generates a complete one-page site.
          </p>
        </div>
      </transition>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- HOW IT WORKS                                                      -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band">
      <h2 class="band__title">How it works</h2>
      <div class="steps">
        <div class="step">
          <span class="step__num font-mono">01</span>
          <h3 class="step__title">You describe it</h3>
          <p class="step__body">
            In your own words. "A cozy Italian restaurant with warm lighting and
            a wine list." No design skills needed. No forms to fill out.
          </p>
        </div>
        <div class="step">
          <span class="step__num font-mono">02</span>
          <h3 class="step__title">Intent extraction</h3>
          <p class="step__body">
            The engine reads your brief and extracts structured intent — industry,
            mood, features. Industry maps the content architecture. Mood maps the
            design tokens.
          </p>
        </div>
        <div class="step">
          <span class="step__num font-mono">03</span>
          <h3 class="step__title">System mapping</h3>
          <p class="step__body">
            Intent resolves to a complete design system: mode (essential, brutal,
            clay, or generative), palette (paper + ink + one spot), type weight
            and tracking, layout geometry.
          </p>
        </div>
        <div class="step">
          <span class="step__num font-mono">04</span>
          <h3 class="step__title">Generation</h3>
          <p class="step__body">
            A one-page site materializes — components, imagery slots, content
            structure, the full kernel. ~31 MB, ready to preview and deploy.
            Not a template. A build.
          </p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- PHILOSOPHY                                                        -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band">
      <h2 class="band__title">The philosophy</h2>
      <div class="col">
        <p class="band__lead measure-wide lh-copy">
          One fixed content structure, four interchangeable design systems. The
          wheel is the parent function: <code class="font-mono">page = mode(content)</code>.
          Consistency is enforced at build — off-system CSS cannot compile.
        </p>
        <p class="band__lead measure-wide lh-copy">
          We don't do templates. Templates start generic and end up looking like
          every other site. We start with <em>your</em> intent and generate
          something specific to what you described. The design system does the
          heavy lifting. Your words do the differentiating.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- WORKS CTA                                                         -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <section class="band band--last">
      <h2 class="band__title">See it in the wild</h2>
      <p class="band__lead measure-wide">
        Eighteen studies across five verticals — restaurants, music, hotels,
        books, vintage. Each one built in our own kernel. Each one a proof of
        concept for what the generator can produce.
      </p>
      <NuxtLink to="/works" class="works-cta font-mono ttu tracked">
        Project index <span aria-hidden="true">→</span>
      </NuxtLink>
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
  background: none;
  cursor: pointer;
}

.hero__cta--primary {
  background: var(--ink);
  color: var(--paper);
}

.hero__cta:hover {
  transform: translate(-2px, -2px);
}

/* ── Generator ─────────────────────────────────────────────────────────── */
.demo {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  scroll-margin-top: var(--chrome-band);
}

.demo__input-zone {
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
  transition: border-color var(--dur) var(--ease);
}

.demo__textarea::placeholder { color: var(--ink-3); }
.demo__textarea:focus {
  outline: none;
  border-color: var(--ink);
  background: var(--paper);
}
.demo__textarea:disabled { opacity: 0.5; }

.demo__input-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo__hint { font-size: 0.72rem; color: var(--ink-3); }

.demo__generate {
  padding: 0.5rem 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
  transition: opacity var(--dur) var(--ease);
}

.demo__generate:disabled { opacity: 0.4; cursor: default; }

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
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.demo__prompt:hover { color: var(--ink); border-color: var(--ink); }
.demo__prompt:disabled { opacity: 0.4; cursor: default; }
.demo__prompt-label { font-weight: 600; color: var(--ink); font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.06em; }
.demo__prompt-text { color: var(--ink-2); font-size: 0.68rem; }

/* ── Output area ───────────────────────────────────────────────────────── */
.demo__output {
  margin-top: 2rem;
  display: grid;
  gap: 1.5rem;
}

/* Terminal */
.demo__terminal {
  background: #0e0c0a;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  overflow: hidden;
}

.terminal__head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem;
  background: #1a1714;
  border-bottom: 1px solid #2a2620;
}

.terminal__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}
.terminal__dot--red { background: #ff5f56; }
.terminal__dot--yellow { background: #ffbd2e; }
.terminal__dot--green { background: #27c93f; }

.terminal__title {
  margin-left: 0.5rem;
  font-size: 0.68rem;
  color: #6e6a61;
  letter-spacing: 0.02em;
}

.terminal__body {
  padding: 0.8rem;
  max-height: 28rem;
  overflow-y: auto;
  font-size: 0.72rem;
  line-height: 1.7;
}

.terminal__line {
  margin: 0;
  color: #a8a399;
}

.terminal__prompt { color: #6e6a61; margin-right: 0.5em; }
.terminal__val { color: #ffe800; }
.terminal__line--dim { opacity: 0.5; }

.terminal__files {
  margin-top: 0.3rem;
}

.terminal__file-batch {
  margin: 0;
}

.terminal__file {
  display: grid;
  grid-template-columns: 1.2rem 1fr auto;
  gap: 0.5rem;
  align-items: center;
}

.terminal__file-status { color: #27c93f; }
.terminal__file-path { color: #f0eae0; }
.terminal__file-size { color: #6e6a61; font-size: 0.65rem; }

.terminal__progress {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.6rem;
}

.terminal__progress-bar {
  flex: 1;
  height: 3px;
  background: #2a2620;
  border-radius: 2px;
  overflow: hidden;
}

.terminal__progress-fill {
  height: 100%;
  background: #ffe800;
  transition: width 0.15s ease;
}

.terminal__progress-pct {
  font-size: 0.65rem;
  color: #6e6a61;
  min-width: 2.5rem;
  text-align: right;
}

/* ── Readout ───────────────────────────────────────────────────────────── */
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

.readout__item { display: flex; flex-direction: column; gap: 0.2rem; }
.readout__item--full { grid-column: 1 / -1; }
.readout__key { font-size: 0.65rem; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; }
.readout__val { font-size: 0.85rem; color: var(--ink); font-weight: 500; }

.readout__swatches { display: flex; gap: 0.4rem; }
.swatch {
  width: 1.6rem; height: 1.6rem; border-radius: 50%; border: 1px solid var(--line);
}
.swatch--ink { border-color: var(--ink-2); }

.readout__features { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.feature-chip {
  padding: 0.25rem 0.6rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 2rem;
  font-size: 0.68rem;
  color: var(--ink-1);
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

.preview__card-label { font-size: 0.78rem; color: var(--ink); font-weight: 500; }
.preview__card-meta { font-size: 0.72rem; color: var(--ink-2); }

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

/* ── Result bar ────────────────────────────────────────────────────────── */
.demo__result-bar {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  font-size: 0.72rem;
  color: var(--ink-2);
}

.demo__result-size { color: var(--ink); font-weight: 500; }

.demo__reset {
  margin-left: auto;
  padding: 0.3rem 0.7rem;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: var(--ink);
  background: none;
  border: 1px solid var(--line);
  border-radius: 2rem;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease);
}

.demo__reset:hover { border-color: var(--ink); }

/* ── Empty state ───────────────────────────────────────────────────────── */
.demo__empty {
  margin-top: 2rem;
  display: grid;
  place-items: center;
  min-height: 20svh;
  border: 1px dashed var(--line);
  border-radius: 0.3rem;
}

.demo__empty-text {
  font-size: 0.85rem;
  color: var(--ink-3);
  text-align: center;
  max-width: 30ch;
  margin: 0;
  line-height: 1.5;
}

/* ── Bands ─────────────────────────────────────────────────────────────── */
.band {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  container-type: inline-size;
}

.band--last { min-height: 40svh; }

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

.band__lead + .band__lead { margin-top: 1.2rem; }
.band__lead code { font-family: var(--font-mono); background-color: var(--paper-1); padding: 0.1em 0.35em; border-radius: 0.2rem; }

/* ── Steps ─────────────────────────────────────────────────────────────── */
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1.5rem;
}

.step {
  display: grid;
  gap: 0.5rem;
  align-content: start;
  padding: 1.5rem;
  border: 1px solid var(--line);
}

.step__num { font-size: var(--type-label); color: var(--ink-2); letter-spacing: 0.1em; }
.step__title { font-size: var(--type-body); font-weight: 600; color: var(--ink); margin: 0; }
.step__body { font-size: var(--type-meta); line-height: 1.55; color: var(--ink-1); margin: 0; }

/* ── Philosophy ────────────────────────────────────────────────────────── */
.col { display: grid; gap: 1.2rem; }

/* ── Works CTA ─────────────────────────────────────────────────────────── */
.works-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 2rem;
  padding: 0.9rem 1.6rem;
  font-size: var(--type-label);
  letter-spacing: 0.12em;
  color: var(--paper);
  background: var(--ink);
  text-decoration: none;
  transition: transform var(--dur) var(--ease);
}

.works-cta:hover { transform: translate(-2px, -2px); }

/* ── Transitions ───────────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s var(--ease); }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: opacity 0.4s var(--ease), transform 0.4s var(--ease); }
.slide-up-leave-active { transition: opacity 0.25s var(--ease); }
.slide-up-enter-from { opacity: 0; transform: translateY(1.2rem); }
.slide-up-leave-to { opacity: 0; }

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
  .preview__grid { grid-template-columns: repeat(4, 1fr); }
}

@container (max-width: 30rem) {
  .preview__nav { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .terminal__progress-fill,
  .final__cta { transition: none; }
}
</style>
