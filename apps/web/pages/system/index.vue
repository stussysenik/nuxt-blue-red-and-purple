<script setup lang="ts">
import { PALETTE } from '@brp/tokens';
import { getGroupedWorks, type Work } from '~/data/works';

useHead({
  title: 'System — *blue red + purple/',
  meta: [{ name: 'description', content: 'The design system: tokens, modes, kernels, and how they become client work.' }],
});

const groupedWorks = getGroupedWorks();

// ── Token reference data ─────────────────────────────────────────────────

const typeScale = [
  { name: 'display', var: '--type-display', spec: 'clamp(3rem, 8vw, 6.5rem)', usage: 'Hero titles, page headers' },
  { name: 'body', var: '--type-body', spec: '1.2rem', usage: 'Running text, summaries' },
  { name: 'meta', var: '--type-meta', spec: '0.95rem', usage: 'Captions, secondary info' },
  { name: 'label', var: '--type-label', spec: '0.82rem', usage: 'Nav, tags, mono labels' },
];

const weightScale = [
  { name: 'display', var: '--wght-display', spec: '300–700', usage: 'Mode-dependent: 300 essential → 700 brutal' },
  { name: 'body', var: '--wght-body', spec: '380', usage: 'Running text across all modes' },
  { name: 'label', var: '--wght-label', spec: '450', usage: 'Nav items, uppercase labels' },
];

const spacing = [
  { name: 'edge', var: '--edge', spec: 'clamp(1.4rem, 6vw, 8rem)', usage: 'Page horizontal inset' },
  { name: 'band', var: '--chrome-band', spec: 'dynamic', usage: 'Top chrome clearance' },
  { name: '1–6', var: '--space-1…6', spec: '0.4rem → 4rem', usage: 'Vertical rhythm increments' },
];

const modes = [
  { id: 'essential', name: 'Essential', tagline: 'Quiet. Refined. Editorial.', border: '1px', radius: '0', shadow: 'none', weight: '300', use: 'Hotels, boutiques, luxury' },
  { id: 'brutal', name: 'Brutal', tagline: 'Bold. Raw. Loud.', border: '2px', radius: '0', shadow: '4px 4px 0 var(--ink)', weight: '700', use: 'Music, nightlife, streetwear' },
  { id: 'clay', name: 'Clay', tagline: 'Warm. Tactile. Human.', border: '1px', radius: '12px', shadow: '0 8px 24px rgba(0,0,0,0.12)', weight: '400', use: 'Restaurants, wellness, craft' },
  { id: 'generative', name: 'Generative', tagline: 'Living. Reactive. Alive.', border: '1px', radius: '0', shadow: 'none', weight: '500', use: 'Music, events, campaigns' },
];

const themes = ['light', 'dark'];

// ── Case study selection ─────────────────────────────────────────────────

interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  mode: string;
  treatment: string;
  specs: { label: string; value: string }[];
}

const caseStudies: CaseStudy[] = [
  {
    slug: 'smac',
    title: "S'MAC",
    category: 'restaurant',
    mode: 'clay',
    treatment: 'Warm counter concept. Menu-as-index rendered as an editorial ledger. Order flow reduced to one counter.',
    specs: [
      { label: 'Mode', value: 'Clay' },
      { label: 'Palette', value: 'Amber / burnt orange / cream' },
      { label: 'Display', value: 'Serif 900, clamp(1.5rem, 5cqw, 4.25rem)' },
      { label: 'Grid', value: 'Single column, full-bleed hero' },
      { label: 'Mechanic', value: 'Before/after contrast slider' },
    ],
  },
  {
    slug: 'after',
    title: 'After',
    category: 'music',
    mode: 'brutal',
    treatment: 'Pixel display face over mono grotesk. One centered column. Dated tour list as the whole index.',
    specs: [
      { label: 'Mode', value: 'Brutal' },
      { label: 'Palette', value: 'Blue / paper' },
      { label: 'Display', value: '5×5 pixel grid, bit-rendered' },
      { label: 'Grid', value: 'Centered column, max 30rem' },
      { label: 'Mechanic', value: 'Ghost image on row hover' },
    ],
  },
  {
    slug: 'd429',
    title: 'D429',
    category: 'books',
    mode: 'essential',
    treatment: 'Two-column document grid. Marginal notes left, running text right. The page as a study document.',
    specs: [
      { label: 'Mode', value: 'Essential' },
      { label: 'Palette', value: 'Paper / ink only' },
      { label: 'Display', value: 'Archivo 300, document scale' },
      { label: 'Grid', value: '268fr / 583fr asymmetric' },
      { label: 'Mechanic', value: 'Margin-note left, body right' },
    ],
  },
  {
    slug: 'l384',
    title: 'L384',
    category: 'hotel',
    mode: 'essential',
    treatment: 'Quiet luxury. One hero, one amenity column, one CTA. Restraint as the brand.',
    specs: [
      { label: 'Mode', value: 'Essential' },
      { label: 'Palette', value: 'Warm neutrals' },
      { label: 'Display', value: 'Archivo 300, generous leading' },
      { label: 'Grid', value: 'Single column, full-bleed hero' },
      { label: 'Mechanic', value: 'One hero, one column, one CTA' },
    ],
  },
  {
    slug: 'skrillex',
    title: 'Skrillex',
    category: 'music',
    mode: 'essential',
    treatment: 'Full-bleed artwork with a single vertical mono rail. One typeface, one weight, one size, zero palette.',
    specs: [
      { label: 'Mode', value: 'Essential' },
      { label: 'Palette', value: 'Paper / ink only' },
      { label: 'Display', value: 'IBM Plex Mono, one size' },
      { label: 'Grid', value: 'Full-bleed + fixed rail' },
      { label: 'Mechanic', value: 'Vertical rail, writing-mode rl' },
    ],
  },
  {
    slug: 'f853',
    title: 'F853',
    category: 'books',
    mode: 'essential',
    treatment: 'One-type-size index flush top-left with a live clock. Line-height is the only layout system.',
    specs: [
      { label: 'Mode', value: 'Essential' },
      { label: 'Palette', value: 'Paper / ink only' },
      { label: 'Display', value: 'IBM Plex Mono, 0.85–1.1rem' },
      { label: 'Grid', value: 'Single column, flush left' },
      { label: 'Mechanic', value: 'Live clock, line-height grid' },
    ],
  },
];

// ── Active case study for detail panel ────────────────────────────────────

const activeCase = ref<CaseStudy>(caseStudies[0]);
const activeMode = ref('essential');

function setActiveMode(mode: string) {
  activeMode.value = mode;
}
</script>

<template>
  <div>
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 1: DESIGN SYSTEM REFERENCE                                -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->

    <section class="system">
      <header class="system__header">
        <p class="system__eyebrow font-mono ttu tracked">Design system</p>
        <h1 class="system__title">The kernel</h1>
        <p class="system__lead measure">
          Everything below is the source of truth. Four modes, two themes,
          one palette. Every client work is a configuration of these tokens —
          nothing more, nothing less.
        </p>
      </header>

      <!-- ── Palette ─────────────────────────────────────────────────── -->

      <h2 class="sec__title font-mono ttu tracked">Palette</h2>
      <p class="sec__sub">The color law: no blue, no red, no purple in chrome. Every hex sits in yellow→orange→green (15°–180°) or is a warm achromatic ink tint.</p>

      <ul class="swatches">
        <li v-for="[name, hex] in Object.entries(PALETTE)" :key="name" class="swatch">
          <span class="swatch__chip" :style="{ backgroundColor: hex }" />
          <span class="swatch__meta font-mono">
            <strong>{{ name }}</strong>
            <span>{{ hex }}</span>
          </span>
        </li>
      </ul>

      <!-- ── Typography ──────────────────────────────────────────────── -->

      <h2 class="sec__title font-mono ttu tracked">Type scale</h2>
      <div class="table-wrap">
        <table class="token-table font-mono">
          <thead>
            <tr>
              <th>Token</th>
              <th>Variable</th>
              <th>Spec</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in typeScale" :key="t.var">
              <td>{{ t.name }}</td>
              <td><code>{{ t.var }}</code></td>
              <td>{{ t.spec }}</td>
              <td>{{ t.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="sec__title font-mono ttu tracked">Weight scale</h2>
      <div class="table-wrap">
        <table class="token-table font-mono">
          <thead>
            <tr>
              <th>Token</th>
              <th>Variable</th>
              <th>Spec</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="w in weightScale" :key="w.var">
              <td>{{ w.name }}</td>
              <td><code>{{ w.var }}</code></td>
              <td>{{ w.spec }}</td>
              <td>{{ w.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Spacing ────────────────────────────────────────────────── -->

      <h2 class="sec__title font-mono ttu tracked">Spacing</h2>
      <div class="table-wrap">
        <table class="token-table font-mono">
          <thead>
            <tr>
              <th>Token</th>
              <th>Variable</th>
              <th>Spec</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in spacing" :key="s.var">
              <td>{{ s.name }}</td>
              <td><code>{{ s.var }}</code></td>
              <td>{{ s.spec }}</td>
              <td>{{ s.usage }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── Modes ──────────────────────────────────────────────────── -->

      <h2 class="sec__title font-mono ttu tracked">Modes</h2>
      <p class="sec__sub">Four kernels. Same architecture, different personality. Each mode sets border, radius, shadow, weight, tracking, and duration.</p>

      <div class="mode-grid">
        <button
          v-for="m in modes"
          :key="m.id"
          class="mode-card"
          :class="{ 'mode-card--active': activeMode === m.id }"
          :data-mode="m.id"
          @click="setActiveMode(m.id)"
        >
          <h3 class="mode-card__name">{{ m.name }}</h3>
          <p class="mode-card__tagline">{{ m.tagline }}</p>
          <dl class="mode-card__specs">
            <div>
              <dt>Border</dt>
              <dd>{{ m.border }}</dd>
            </div>
            <div>
              <dt>Radius</dt>
              <dd>{{ m.radius }}</dd>
            </div>
            <div>
              <dt>Shadow</dt>
              <dd>{{ m.shadow }}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{{ m.weight }}</dd>
            </div>
          </dl>
          <p class="mode-card__use">Best for: {{ m.use }}</p>
        </button>
      </div>

      <!-- ── Mode × Theme kernels ────────────────────────────────────── -->

      <h2 class="sec__title font-mono ttu tracked">Kernels — mode × theme preview</h2>
      <p class="sec__sub">Each cell below renders a component kernel in one mode and theme. The component doesn't change — only the tokens do.</p>

      <div class="kernel-grid">
        <div v-for="m in modes" :key="m.id">
          <div
            v-for="theme in themes"
            :key="`${m.id}-${theme}`"
            class="kernel"
            :data-mode="m.id"
            :data-theme="theme"
          >
            <div class="kernel__card">
              <span class="kernel__spot" />
              <span class="kernel__aa">Aa</span>
              <span class="kernel__sample">The quick brown fox jumps over the lazy dog.</span>
              <span class="kernel__label font-mono ttu tracked">{{ m.name }} · {{ theme }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── How it composes ─────────────────────────────────────────── -->

      <h2 class="sec__title font-mono ttu tracked">How it composes</h2>
      <p class="sec__sub">From tokens to client work in three steps:</p>

      <ol class="compose">
        <li class="compose__step">
          <span class="compose__num font-mono">01</span>
          <h3 class="compose__name">Brief → Mode</h3>
          <p class="compose__text">The client's industry, audience, and goal map to one of four modes. A hotel gets Essential. A club night gets Brutal.</p>
        </li>
        <li class="compose__step">
          <span class="compose__num font-mono">02</span>
          <h3 class="compose__name">Mode → Tokens</h3>
          <p class="compose__text">The mode sets every CSS variable: border weight, radius, shadow, type weight, tracking, duration. No decisions at the component level.</p>
        </li>
        <li class="compose__step">
          <span class="compose__num font-mono">03</span>
          <h3 class="compose__name">Tokens + Content → World</h3>
          <p class="compose__text">Content flows into the grid defined by the tokens. The palette is the only per-client variable. Everything else is the system.</p>
        </li>
      </ol>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 2: CASE STUDIES                                           -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->

    <section class="cases">
      <header class="system__header">
        <p class="system__eyebrow font-mono ttu tracked">Case studies</p>
        <h2 class="system__title">The work</h2>
        <p class="system__lead measure">
          Each project below is the same system running a different brief.
          Click any case to see the visual specs — mode, palette, grid, and
          the one mechanic that makes it singular.
        </p>
      </header>

      <!-- ── Case study grid ─────────────────────────────────────────── -->

      <div class="case-grid">
        <button
          v-for="cs in caseStudies"
          :key="cs.slug"
          class="case-card"
          :class="{ 'case-card--active': activeCase.slug === cs.slug }"
          :data-mode="cs.mode"
          @click="activeCase = cs"
        >
          <div class="case-card__head">
            <span class="case-card__mode font-mono ttu tracked">{{ cs.mode }}</span>
            <span class="case-card__cat font-mono ttu">{{ cs.category }}</span>
          </div>
          <h3 class="case-card__title">{{ cs.title }}</h3>
          <p class="case-card__treatment">{{ cs.treatment }}</p>
          <span class="case-card__link font-mono">View specs →</span>
        </button>
      </div>

      <!-- ── Active case study detail ────────────────────────────────── -->

      <div class="case-detail" :data-mode="activeCase.mode">
        <div class="case-detail__bar">
          <div>
            <h3 class="case-detail__title">{{ activeCase.title }}</h3>
            <p class="case-detail__cat font-mono ttu">{{ activeCase.category }} · {{ activeCase.mode }} mode</p>
          </div>
          <NuxtLink :to="`/works/${activeCase.slug}`" class="case-detail__live font-mono">
            Live site ↗
          </NuxtLink>
        </div>

        <div class="case-detail__specs">
          <div v-for="spec in activeCase.specs" :key="spec.label" class="spec">
            <span class="spec__label font-mono ttu tracked">{{ spec.label }}</span>
            <span class="spec__value">{{ spec.value }}</span>
          </div>
        </div>

        <!-- Visual spec: mini rendered preview in the case study's mode -->
        <div class="case-detail__preview" :data-mode="activeCase.mode" :data-theme="'light'">
          <div class="mini-preview">
            <div class="mini-preview__chrome">
              <span class="mini-preview__mark">/</span>
              <nav class="mini-preview__nav font-mono">
                <span>Music</span>
                <span>Tour</span>
                <span>Merch</span>
              </nav>
              <span class="mini-preview__cta font-mono">Listen ↗</span>
            </div>
            <div class="mini-preview__hero">
              <h4 class="mini-preview__title">{{ activeCase.title }}</h4>
              <p class="mini-preview__tagline">{{ activeCase.treatment }}</p>
            </div>
            <div class="mini-preview__footer font-mono">
              <span>© 2026</span>
              <span>Press ↗</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- SECTION 3: ALL WORK BY CATEGORY                                   -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->

    <section class="all-work">
      <header class="system__header">
        <p class="system__eyebrow font-mono ttu tracked">Full index</p>
        <h2 class="system__title">Every project</h2>
        <p class="system__lead measure">
          The complete catalogue. Each entry is a different configuration of the system above.
        </p>
      </header>

      <div v-for="group in groupedWorks" :key="group.category" class="work-group">
        <h3 class="work-group__label font-mono ttu tracked">{{ group.category }}</h3>
        <ul class="work-group__list">
          <li v-for="w in group.items" :key="w.slug">
            <NuxtLink :to="`/works/${w.slug}`" class="work-row">
              <span class="work-row__title">{{ w.title }}</span>
              <span class="work-row__year font-mono">{{ w.year }}</span>
              <span class="work-row__arrow" aria-hidden="true">→</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- CTA                                                                -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->

    <section class="sys-cta">
      <h2 class="sys-cta__title">Your brief, this system.</h2>
      <p class="sys-cta__lead measure">
        Every project above started the same way: a conversation about audience
        and goal. The mode follows. The tokens follow. The world follows.
      </p>
      <a href="mailto:hi@blueredandpurple.world" class="sys-cta__btn font-mono ttu tracked">
        Start a project <span aria-hidden="true">↗</span>
      </a>
    </section>
  </div>
</template>

<style scoped>
/* ── Section 1: System reference ───────────────────────────────────────── */

.system {
  padding: clamp(5.5rem, 13vh, 8rem) var(--edge) clamp(4rem, 9vh, 5.5rem);
}

.system__header {
  margin-bottom: clamp(3rem, 8vh, 5rem);
}

.system__eyebrow {
  font-size: var(--type-label);
  color: var(--ink-2);
  margin: 0 0 0.8rem;
  letter-spacing: 0.12em;
}

.system__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1.03;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  color: var(--ink);
  margin: 0 0 1rem;
}

.system__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

.sec__title {
  font-size: var(--type-label);
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 3.5rem 0 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line);
}

.sec__sub {
  font-size: var(--type-meta);
  color: var(--ink-2);
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

/* ── Palette swatches ─────────────────────────────────────────────────── */

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.swatch {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.swatch__chip {
  height: 4rem;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
}

.swatch__meta {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.65rem;
  color: var(--ink-2);
}

.swatch__meta strong {
  color: var(--ink);
  font-weight: 600;
}

/* ── Token tables ─────────────────────────────────────────────────────── */

.table-wrap {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.token-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  line-height: 1.5;
}

.token-table th,
.token-table td {
  text-align: left;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
}

.token-table th {
  color: var(--ink-2);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.65rem;
}

.token-table td {
  color: var(--ink-1);
}

.token-table code {
  background: var(--paper-1);
  padding: 0.1em 0.35em;
  border-radius: 0.2rem;
  font-size: 0.72rem;
}

/* ── Mode cards ───────────────────────────────────────────────────────── */

.mode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr));
  gap: 1rem;
}

.mode-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}

.mode-card:hover {
  border-color: var(--ink-2);
}

.mode-card--active {
  border-color: var(--ink);
  box-shadow: var(--shadow);
}

.mode-card[data-mode='brutal'] {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.mode-card[data-mode='brutal'] .mode-card__name,
.mode-card[data-mode='brutal'] .mode-card__tagline,
.mode-card[data-mode='brutal'] .mode-card__use {
  color: var(--paper);
}

.mode-card[data-mode='brutal'] .mode-card__specs dt {
  color: var(--ink-3);
}

.mode-card[data-mode='brutal'] .mode-card__specs dd {
  color: var(--paper);
}

.mode-card[data-mode='clay'] {
  border-radius: 12px;
}

.mode-card[data-mode='generative'] {
  background: linear-gradient(135deg, var(--paper) 0%, color-mix(in srgb, var(--spot) 12%, var(--paper)) 100%);
}

.mode-card__name {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: 1.2rem;
  color: var(--ink);
  margin: 0;
  text-transform: uppercase;
}

.mode-card__tagline {
  font-size: 0.85rem;
  color: var(--ink-1);
  margin: 0;
}

.mode-card__specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem 1rem;
  margin: 0.5rem 0 0;
  padding-top: 0.8rem;
  border-top: 1px solid var(--line);
}

.mode-card__specs div {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.mode-card__specs dt {
  font-size: 0.6rem;
  color: var(--ink-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.mode-card__specs dd {
  font-size: 0.72rem;
  color: var(--ink-1);
  margin: 0;
}

.mode-card__use {
  font-size: 0.7rem;
  color: var(--ink-2);
  margin: 0.5rem 0 0;
}

/* ── Kernel grid ──────────────────────────────────────────────────────── */

.kernel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 11rem), 1fr));
  gap: 1rem;
}

.kernel {
  background-color: var(--paper);
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
}

.kernel__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  background-color: var(--surface);
  border: var(--border-w) solid var(--ink);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem;
}

.kernel__spot {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 100%;
  background-color: var(--spot);
}

.kernel__aa {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  letter-spacing: var(--tracking-display);
  font-size: 2.4rem;
  line-height: 1;
  color: var(--ink);
}

.kernel__sample {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--ink-1);
}

.kernel__label {
  font-size: 0.6rem;
  color: var(--ink-2);
  letter-spacing: 0.08em;
}

/* ── How it composes ──────────────────────────────────────────────────── */

.compose {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.compose__step {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.2rem;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  align-content: start;
}

.compose__num {
  font-size: 0.7rem;
  color: var(--spot);
  font-weight: 600;
  letter-spacing: 0.06em;
}

.compose__name {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: 1.1rem;
  color: var(--ink);
  margin: 0;
  text-transform: uppercase;
}

.compose__text {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--ink-1);
  margin: 0;
}

/* ── Section 2: Case studies ──────────────────────────────────────────── */

.cases {
  padding: clamp(3rem, 8vh, 6rem) var(--edge);
  border-top: 1px solid var(--line);
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.case-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.2rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}

.case-card:hover {
  border-color: var(--ink-2);
}

.case-card--active {
  border-color: var(--ink);
  box-shadow: var(--shadow);
}

.case-card[data-mode='brutal'] {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.case-card[data-mode='brutal'] .case-card__title,
.case-card[data-mode='brutal'] .case-card__treatment {
  color: var(--paper);
}

.case-card[data-mode='brutal'] .case-card__mode,
.case-card[data-mode='brutal'] .case-card__cat {
  color: var(--ink-3);
}

.case-card[data-mode='clay'] {
  border-radius: 12px;
}

.case-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.case-card__mode {
  font-size: 0.6rem;
  color: var(--spot);
  letter-spacing: 0.1em;
  font-weight: 600;
}

.case-card__cat {
  font-size: 0.6rem;
  color: var(--ink-3);
  letter-spacing: 0.06em;
}

.case-card__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: 1.4rem;
  color: var(--ink);
  margin: 0.3rem 0 0;
  text-transform: uppercase;
  line-height: 1.1;
}

.case-card__treatment {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--ink-1);
  margin: 0;
}

.case-card__link {
  font-size: 0.7rem;
  color: var(--ink-2);
  margin-top: auto;
  letter-spacing: 0.04em;
  transition: color var(--dur) var(--ease);
}

.case-card:hover .case-card__link,
.case-card--active .case-card__link {
  color: var(--spot);
}

/* ── Case detail panel ────────────────────────────────────────────────── */

.case-detail {
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  overflow: hidden;
}

.case-detail__bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--line);
  background: var(--paper-1);
}

.case-detail__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(1.4rem, 3vw, 2rem);
  color: var(--ink);
  margin: 0;
  text-transform: uppercase;
  line-height: 1.1;
}

.case-detail__cat {
  font-size: 0.7rem;
  color: var(--ink-2);
  margin: 0.3rem 0 0;
  letter-spacing: 0.06em;
}

.case-detail__live {
  font-size: 0.75rem;
  color: var(--spot);
  text-decoration: none;
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: opacity var(--dur) var(--ease);
}

.case-detail__live:hover {
  opacity: 0.7;
}

.case-detail__specs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 10rem), 1fr));
  gap: 0;
}

.spec {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem 1.5rem;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.spec__label {
  font-size: 0.6rem;
  color: var(--ink-3);
  letter-spacing: 0.08em;
}

.spec__value {
  font-size: 0.85rem;
  color: var(--ink);
  line-height: 1.4;
}

/* ── Mini preview ─────────────────────────────────────────────────────── */

.case-detail__preview {
  padding: 1.5rem;
  background: var(--paper);
}

.mini-preview {
  max-width: 28rem;
  margin: 0 auto;
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  background: var(--paper);
  color: var(--ink);
  border: var(--border-w) solid var(--ink);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  container-type: inline-size;
}

.mini-preview__chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  border-bottom: var(--border-w) solid var(--ink);
}

.mini-preview__mark {
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 1rem;
  color: var(--ink);
}

.mini-preview__nav {
  display: flex;
  gap: 0.8rem;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-2);
}

.mini-preview__cta {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--spot);
}

.mini-preview__hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.6rem;
  padding: 1.5rem 1rem;
}

.mini-preview__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(1.2rem, 4cqw, 2rem);
  line-height: 1.05;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}

.mini-preview__tagline {
  font-size: clamp(0.7rem, 1cqw, 0.85rem);
  line-height: 1.5;
  color: var(--ink-1);
  max-width: 28ch;
  margin: 0;
}

.mini-preview__footer {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-top: var(--border-w) solid var(--ink);
  font-size: 0.6rem;
  color: var(--ink-3);
}

/* ── Section 3: Full index ────────────────────────────────────────────── */

.all-work {
  padding: clamp(3rem, 8vh, 6rem) var(--edge);
  border-top: 1px solid var(--line);
}

.work-group {
  margin-bottom: 2rem;
}

.work-group__label {
  font-size: var(--type-label);
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 0 0 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--line);
}

.work-group__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.work-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.5rem 0;
  text-decoration: none;
  color: var(--ink-1);
  border-bottom: 1px solid var(--line);
  transition: color var(--dur) var(--ease);
}

.work-row:hover {
  color: var(--ink);
}

.work-row__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  text-transform: uppercase;
  line-height: 1.2;
}

.work-row__year {
  font-size: 0.7rem;
  color: var(--ink-3);
  margin-left: auto;
}

.work-row__arrow {
  font-size: 0.8rem;
  color: var(--ink-3);
  opacity: 0;
  transform: translateX(-0.3rem);
  transition:
    opacity var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}

.work-row:hover .work-row__arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ── CTA ──────────────────────────────────────────────────────────────── */

.sys-cta {
  padding: clamp(4rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  display: grid;
  gap: 1.5rem;
  align-content: center;
}

.sys-cta__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  margin: 0;
  color: var(--ink);
}

.sys-cta__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

.sys-cta__btn {
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

.sys-cta__btn:hover {
  transform: translate(-2px, -2px);
}

/* ── Responsive ───────────────────────────────────────────────────────── */

@media (max-width: 40rem) {
  .case-detail__bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .spec {
    border-right: none;
  }

  .mini-preview__nav {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mode-card,
  .case-card,
  .case-card__link,
  .case-detail__live,
  .work-row,
  .work-row__arrow,
  .sys-cta__btn {
    transition: none;
  }
}
</style>
