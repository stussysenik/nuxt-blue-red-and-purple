<script setup lang="ts">
import { getWorkBySlug, getVisibleWorks } from '~/data/works';
import { toRoman } from '~/data/roman';

const route = useRoute();
const slug = route.params.slug as string;
const work = getWorkBySlug(slug);

if (!work) {
  throw createError({ statusCode: 404, statusMessage: 'Work not found' });
}

const visibleWorks = getVisibleWorks();
const allSorted = visibleWorks.flatMap((w) => w);
const numeralOf = new Map(allSorted.map((w, i) => [w.slug, toRoman(i + 1)] as const));

const title = `${work.title} — *blue red + purple/`;

useHead({
  title,
  meta: [
    { name: 'description', content: work.summary },
  ],
});

// Work-specific data
const GLYPHS = ref<string[]>([]);
const DATES = ref<[string, string][]>([]);
const RAIL = ['Contact', 'Signup', 'Merch', 'Tour', 'Music'];
const asFoundNav = [
  'Hours & Location',
  'Our Story',
  'Community Fridge',
  'Catering',
  'Gift Cards',
  'Online Orders',
  'Press',
];

const notes = [
  { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.' },
  { text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', em: true },
  { text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.' },
  { text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.' },
];

onMounted(() => {
  if (slug === 'after') {
    GLYPHS.value = [
      '01110 10001 11111 10001 10001', // A
      '11111 10000 11110 10000 10000', // F
      '11111 00100 00100 00100 00100', // T
      '11111 10000 11110 10000 11111', // E
      '11110 10001 11110 10010 10001', // R
    ].map((g) => g.replaceAll(' ', ''));
    DATES.value = [
      ['16 Mar', 'Berlin'],
      ['18 Mar', 'Prague'],
      ['21 Mar', 'Vienna'],
      ['24 Mar', 'Milan'],
      ['27 Mar', 'Paris'],
      ['29 Mar', 'London'],
    ];
  }
});

const contrastPos = ref(50);

function updateContrast(e: Event) {
  contrastPos.value = Number((e.target as HTMLInputElement).value);
}
</script>

<template>
  <div>
    <!-- AFTER -->
    <template v-if="slug === 'after'">
      <main
        class="site"
        :style="{ '--work-accent': work.palette?.[0] ?? 'var(--ink)', '--blue-2': work.palette?.[1] ?? 'var(--work-accent)' }"
      >
        <div class="site__mark" role="img" :aria-label="`${work.title} — pixel wordmark`">
          <span v-for="(glyph, gi) in GLYPHS" :key="gi" class="glyph">
            <i
              v-for="(bit, bi) in glyph.split('')"
              :key="bi"
              :data-on="bit === '1' ? '' : undefined"
            />
          </span>
        </div>

        <p class="site__tag font-mono ttu tracked">On tour</p>

        <ol class="site__index font-mono">
          <li v-for="([date, city], i) in DATES" :key="i" class="row">
            <span class="row__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="row__date">{{ date }}</span>
            <span class="row__city ttu tracked">{{ city }}</span>
            <span class="row__cta ttu">Tickets</span>
          </li>
        </ol>

        <figure class="site__poster">
          <img
            class="site__poster-img"
            :src="work.image"
            :alt="`${work.title} tour poster`"
            width="1600"
            height="1000"
            loading="lazy"
            decoding="async"
          />
          <figcaption class="site__poster-cap font-mono ttu tracked">Tour poster</figcaption>
        </figure>

        <p class="site__foot font-mono ttu tracked">Mailing list</p>
      </main>
    </template>

    <!-- S'MAC -->
    <template v-else-if="slug === 'smac'">
      <main
        class="smac"
        :style="{ '--work-accent': work.palette?.[1] ?? 'var(--ink)', '--work-amber': work.palette?.[0] ?? 'var(--ink)' }"
      >
        <div class="contrast" :style="{ '--pos': `${contrastPos}%` }" :data-js="''">
          <!-- Delivered -->
          <section class="pane pane--after" aria-label="The delivered redesign">
            <p class="made__ribbon">Concept by <b>BLUE RED + PURPLE</b></p>

            <nav class="made__nav" aria-label="Delivered navigation">
              <span class="made__mark" aria-hidden="true">
                <span class="made__markDisc"></span>{{ work.title }}
              </span>
              <span class="made__navCta">Order Pickup & Delivery</span>
            </nav>

            <header class="made__hero">
              <img class="pane__photo" :src="work.image" alt="" decoding="async" />
              <div class="made__scrim" aria-hidden="true"></div>
              <div class="made__inner">
                <span class="made__label">Est. 2006 · East Village, NYC</span>
                <h1 class="made__h1">Macaroni &amp; cheese, elevated to a meal</h1>
                <span class="made__btn">Order Pickup &amp; Delivery</span>
              </div>
            </header>

            <a class="made__live font-mono" :href="`https://${work.source}`">Live — {{ work.source }} ↗</a>
          </section>

          <!-- As found -->
          <section class="pane pane--before" :aria-label="`${work.title} as found`">
            <img class="pane__photo" :src="work.image" alt="" decoding="async" />
            <span class="found__base" aria-hidden="true"></span>

            <aside class="found__rail">
              <span class="found__mark" aria-hidden="true">{{ work.title }}</span>

              <p class="found__addr">
                197 1st Avenue<span>New York, NY 10003</span><span>212-358-7912</span>
              </p>

              <span class="found__cta">Menu</span>

              <nav class="found__nav ttu" aria-label="As-found navigation">
                <span v-for="label in asFoundNav" :key="label" aria-disabled="true">{{ label }}</span>
              </nav>

              <span class="found__signup ttu">Email signup</span>

              <ul class="found__social" aria-hidden="true">
                <li v-for="i in 7" :key="i"></li>
              </ul>

              <p class="found__vendor font-mono">As found — reconstructed in-kernel</p>
            </aside>

            <div class="found__dots" aria-hidden="true">
              <span v-for="i in 13" :key="i" :data-on="i === 12 ? '' : undefined"></span>
            </div>

            <span class="found__cue" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </section>

          <input
            class="contrast__range"
            type="range"
            min="0"
            max="100"
            step="0.1"
            value="50"
            aria-label="Reveal the site as found"
            @input="updateContrast"
          />
          <span class="contrast__seam" aria-hidden="true"></span>
        </div>
      </main>
    </template>

    <!-- D429 -->
    <template v-else-if="slug === 'd429'">
      <main class="site">
        <div class="sheet">
          <div class="sheet__grid">
            <header class="masthead">
              <p class="masthead__title ttu">{{ work.title }} Study Doc</p>
              <p class="masthead__sub ttu">{{ work.category }} · {{ work.year }}</p>
            </header>

            <aside class="margin">
              <ul class="margin__notes">
                <li v-for="(n, i) in notes" :key="i" :class="{ em: n.em }">{{ n.text }}</li>
              </ul>
              <figure class="margin__plate">
                <img
                  :src="work.image"
                  :alt="`${work.title} plate`"
                  width="536"
                  height="536"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </aside>

            <div class="body">
              <p class="body__lead">
                <em>Lorem ipsum dolor sit amet,</em> consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident, <em>sunt in culpa qui
                officia deserunt</em> mollit anim id est laborum et dolorum fuga.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                architecto beatae vitae dicta sunt explicabo, nemo enim ipsam voluptatem.
              </p>
              <p>
                <em>Neque porro quisquam est,</em> qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem, ut enim ad minima veniam quis nostrum.
              </p>
              <p>
                Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur, at
                vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.
              </p>
            </div>
          </div>
        </div>
      </main>
    </template>

    <!-- SKRILLEX -->
    <template v-else-if="slug === 'skrillex'">
      <main class="site">
        <img class="site__art" :src="work.image" alt="" decoding="async" />
        <div class="rail">
          <span class="rail__word">{{ work.title }}</span>
          <span class="rail__glyph">◇</span>
          <nav class="rail__nav">
            <span v-for="item in RAIL" :key="item" class="rail__item font-mono ttu">{{ item }}</span>
          </nav>
        </div>
      </main>
    </template>

    <!-- F853 -->
    <template v-else-if="slug === 'f853'">
      <main class="site">
        <div class="f853">
          <ol class="f853__list font-mono">
            <li v-for="i in 18" :key="i" class="f853__row">
              <span class="f853__num">{{ String(i).padStart(2, '0') }}</span>
              <span class="f853__title">Entry number {{ i }}</span>
            </li>
          </ol>
          <time class="f853__clock font-mono">{{ new Date().toLocaleTimeString() }}</time>
        </div>
        <figure class="f853__plate">
          <img :src="work.image" :alt="`${work.title} plate`" loading="lazy" decoding="async" />
        </figure>
      </main>
    </template>

    <!-- B374 -->
    <template v-else-if="slug === 'b374'">
      <main class="site">
        <div class="b374">
          <div class="b374__head font-mono ttu">{{ work.title }} / Index</div>
          <div class="b374__spreads">
            <article class="spread">
              <div class="spread__verso">
                <img :src="work.image" alt="" loading="lazy" decoding="async" />
              </div>
              <div class="spread__recto">
                <span class="spread__folio">01</span>
              </div>
            </article>
            <article class="spread">
              <div class="spread__verso"><span class="spread__folio">02</span></div>
              <div class="spread__recto">
                <img :src="work.image" alt="" loading="lazy" decoding="async" />
              </div>
            </article>
            <article class="spread">
              <div class="spread__verso">
                <img :src="work.image" alt="" loading="lazy" decoding="async" />
              </div>
              <div class="spread__recto"><span class="spread__folio">03</span></div>
            </article>
          </div>
        </div>
      </main>
    </template>

    <!-- Generic fallback for other works -->
    <template v-else>
      <main class="site site--generic">
        <div class="generic">
          <img class="generic__image" :src="work.image" :alt="work.title" loading="lazy" decoding="async" />
          <div class="generic__meta">
            <span class="generic__numeral font-mono">{{ numeralOf.get(work.slug) }}</span>
            <h1 class="generic__title">{{ work.title }}</h1>
            <p class="generic__cat font-mono ttu tracked">{{ work.category }} · {{ work.year }}</p>
            <p class="generic__summary measure">{{ work.summary }}</p>
            <p v-if="work.mechanic" class="generic__mechanic font-mono">{{ work.mechanic }}</p>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<style scoped>
/* ── AFTER ──────────────────────────────────────────────────────────────── */
.site {
  container-type: inline-size;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--paper);
  color: var(--ink);
  padding: max(7%, var(--chrome-band)) 6% 4.5%;
  overflow-x: hidden;
}

.site__mark {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5.5%;
  width: min(35.2cqw, 20rem);
  color: var(--work-accent, var(--spot, var(--ink)));
}

.glyph {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 11%;
}

.glyph i {
  aspect-ratio: 1;
}

.glyph i[data-on] {
  background-color: currentColor;
}

.site__tag {
  margin: 5.5% 0 0;
  font-size: clamp(0.7rem, 1.28cqw, 1.3rem);
  color: var(--ink-2);
}

.site__index {
  width: min(44.8cqw, 30rem);
  margin: 2.5% 0 0;
  padding: 0;
  list-style: none;
  font-size: clamp(0.8rem, 1.52cqw, 1.55rem);
}

.row {
  display: grid;
  grid-template-columns: 2em 4em 1fr auto;
  align-items: baseline;
  gap: 0.75em;
  padding: 0.55em 0;
  border-top: 1px solid var(--line, var(--ink-2));
}

.row:last-child {
  border-bottom: 1px solid var(--line, var(--ink-2));
}

.row__num {
  color: var(--ink-3, var(--ink-2));
}

.row__date {
  color: var(--ink-1, var(--ink));
}

.row__city {
  letter-spacing: 0.12em;
}

.row__cta {
  font-size: 0.82em;
  letter-spacing: 0.14em;
  color: var(--ink-2);
  transition: color var(--dur, 0.25s) var(--ease, ease);
}

.row:hover .row__cta {
  color: var(--blue-2, var(--work-accent, var(--ink)));
}

.site__poster {
  width: min(56cqw, 40rem);
  margin: 6% 0 0;
  max-width: 100%;
}

.site__poster-img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  background-color: var(--paper-1, var(--paper));
  opacity: 1;
  transition: opacity 0.6s var(--ease, ease);
}

.site__poster-cap {
  margin-top: var(--space-2);
  text-align: center;
  font-size: clamp(0.7rem, 1.28cqw, 1.3rem);
  color: var(--ink-2);
}

@starting-style {
  .site__poster-img {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    @keyframes after-poster-rise {
      from {
        opacity: 0;
        transform: translateY(2.5rem);
      }
    }
    .site__poster {
      animation: after-poster-rise both;
      animation-timeline: view();
      animation-range: entry 0% entry 50%;
    }
  }
}

.site__foot {
  margin: auto 0 0;
  font-size: clamp(0.7rem, 1.28cqw, 1.3rem);
  color: var(--ink-3, var(--ink-2));
}

@container (max-width: 40rem) {
  .site__mark {
    width: 62cqw;
  }
  .site__index {
    width: 82cqw;
  }
  .site__poster {
    width: 82cqw;
  }
  .row {
    grid-template-columns: 1.5em 3.5em 1fr;
    gap: 0.5em;
  }
  .row__cta {
    display: none;
  }
}

/* ── S'MAC ─────────────────────────────────────────────────────────────── */
.smac {
  --accent: var(--work-accent, var(--ink));
  --amber: var(--work-amber, var(--accent));
  --serif: Georgia, 'Times New Roman', serif;
  container-type: inline-size;
  position: relative;
  min-height: 100svh;
  color: var(--ink);
}

.contrast {
  position: relative;
  margin-top: var(--chrome-band);
  min-height: calc(100svh - var(--chrome-band));
  overflow-x: clip;
}

.pane {
  position: absolute;
  inset: 0;
}

.pane--before {
  clip-path: inset(0 calc(100% - var(--pos, 0%)) 0 0);
}

.pane__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: var(--paper-1, var(--paper));
  opacity: 1;
  transition: opacity 0.6s var(--ease, ease);
}

@starting-style {
  .pane__photo {
    opacity: 0;
  }
}

.found__rail {
  position: absolute;
  left: 3.1cqw;
  top: 4.6%;
  bottom: 7.4%;
  width: 14.5cqw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.65cqw 1cqw 1.4cqw;
  background-color: var(--paper-1, var(--paper));
  border-right: 0.4cqw solid var(--amber);
  text-align: center;
  z-index: 2;
  overflow-y: auto;
  overflow-x: hidden;
}

.found__mark {
  display: grid;
  place-items: center;
  width: 5.5cqw;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--amber);
  color: var(--paper);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(0.5rem, 1.15cqw, 1.5rem);
  letter-spacing: 0.01em;
}

.found__addr {
  display: flex;
  flex-direction: column;
  margin: 2cqw 0 0;
  font-size: clamp(0.55rem, 0.85cqw, 1.2rem);
  line-height: 1.5;
  color: var(--ink-1, var(--ink));
}

.found__cta {
  margin-top: 2.25cqw;
  padding: 0.35cqw 1.1cqw;
  border-radius: 2em;
  background-color: var(--amber);
  color: var(--paper);
  font-size: clamp(0.5rem, 0.68cqw, 0.95rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.found__nav {
  display: flex;
  flex-direction: column;
  gap: 0.55cqw;
  margin-top: 2.2cqw;
  font-size: clamp(0.5rem, 0.7cqw, 1rem);
  letter-spacing: 0.04em;
}

.found__nav span {
  color: var(--ink-1, var(--ink));
}

.found__signup {
  margin-top: 2.35cqw;
  padding: 0.32cqw 1.4cqw;
  border-radius: 2em;
  background-color: var(--amber);
  color: var(--paper);
  font-size: clamp(0.5rem, 0.68cqw, 0.95rem);
  letter-spacing: 0.08em;
}

.found__social {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5cqw;
  width: 8.5cqw;
  margin: 2.25cqw 0 0;
  padding: 0;
  list-style: none;
}

.found__social li {
  width: 1.2cqw;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--amber);
}

.found__vendor {
  margin-top: auto;
  font-size: clamp(0.45rem, 0.62cqw, 0.9rem);
  letter-spacing: 0.02em;
  color: var(--ink-3, var(--ink-2));
}

.found__dots {
  position: absolute;
  left: 59cqw;
  bottom: 14%;
  translate: -50% 0;
  display: flex;
  gap: 1.05cqw;
}

.found__dots span {
  width: 0.5cqw;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--amber);
  opacity: 0.55;
}

.found__dots span[data-on] {
  opacity: 1;
}

.found__cue {
  position: absolute;
  left: 59cqw;
  bottom: 5.5%;
  translate: -50% 0;
  color: var(--paper);
}

.found__cue svg {
  display: block;
  width: 2.2cqw;
  height: 2.2cqw;
}

.found__base {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4.4%;
  background-color: var(--amber);
}

.pane--after {
  display: flex;
  flex-direction: column;
  background-color: var(--paper);
}

.made__ribbon {
  flex: none;
  margin: 0;
  padding: 0.55rem 1rem;
  background-color: var(--ink);
  color: var(--paper);
  text-align: center;
  font-size: 0.8125rem;
  line-height: 1.5;
  letter-spacing: 0.01em;
}

.made__ribbon b {
  color: var(--amber);
  font-weight: 600;
}

.made__nav {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem clamp(1rem, 2cqw, 2rem);
  background-color: var(--paper);
  border-bottom: 2px solid var(--ink);
}

.made__mark {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: 0.01em;
}

.made__markDisc {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background-color: var(--amber);
}

.made__navCta {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.6rem 1.1rem;
  background-color: var(--accent);
  color: var(--paper);
  font-size: 0.9375rem;
  font-weight: 600;
}

.made__hero {
  position: relative;
  flex: 1;
  min-height: 0;
  display: grid;
  place-items: center;
}

.made__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(20, 12, 6, 0.4), rgba(20, 12, 6, 0.78));
}

.made__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  color: #fff;
}

.made__label {
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #ffe2d1;
}

.made__h1 {
  max-width: 18ch;
  margin: 0;
  font-family: var(--serif);
  font-weight: 900;
  font-size: clamp(1.5rem, 5cqw, 4.25rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
  text-wrap: balance;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
}

.made__btn {
  margin-top: 2rem;
  padding: 0.95rem 1.6rem;
  background-color: var(--accent);
  color: var(--paper);
  font-size: 0.9375rem;
  font-weight: 600;
}

.made__live {
  position: absolute;
  right: var(--chrome-inset, 1.4rem);
  bottom: var(--chrome-inset, 1.4rem);
  z-index: 3;
  font-size: var(--type-label);
  color: var(--paper);
  text-decoration: none;
  opacity: 0.75;
  transition: opacity var(--dur, 0.2s) var(--ease, ease);
}

.made__live:hover,
.made__live:focus-visible {
  opacity: 1;
}

.contrast__range,
.contrast__seam {
  display: none;
}

.contrast[data-js] .contrast__range,
.contrast[data-js] .contrast__seam {
  display: block;
}

.contrast__range {
  position: absolute;
  top: 0;
  left: -1.5rem;
  width: calc(100% + 3rem);
  height: 100%;
  margin: 0;
  appearance: none;
  background: transparent;
  pointer-events: none;
  z-index: 5;
}

.contrast__range::-webkit-slider-thumb {
  appearance: none;
  pointer-events: auto;
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: ew-resize;
}

.contrast__range::-moz-range-thumb {
  pointer-events: auto;
  width: 3rem;
  height: 3rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: ew-resize;
}

.contrast__range::-moz-range-track {
  background: transparent;
  border: none;
}

.contrast__seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pos, 0%);
  width: 2px;
  background-color: var(--paper);
  pointer-events: none;
  z-index: 4;
}

.contrast__seam::after {
  content: '⇄';
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--amber);
  color: var(--paper);
  font-size: 1.15rem;
}

.contrast__range:focus-visible ~ .contrast__seam::after {
  outline: var(--border-w, 2px) solid var(--paper);
  outline-offset: 3px;
}

@container (max-width: 40rem) {
  .found__rail {
    left: 4cqw;
    width: 46cqw;
    padding: 4cqw 3cqw;
  }
  .found__mark {
    width: 18cqw;
    font-size: 3.6cqw;
  }
  .found__addr {
    margin-top: 5cqw;
    font-size: 2.8cqw;
  }
  .found__cta,
  .found__signup {
    margin-top: 5cqw;
    padding: 1.4cqw 4cqw;
    font-size: 2.4cqw;
  }
  .found__nav {
    gap: 1.6cqw;
    margin-top: 5cqw;
    font-size: 2.4cqw;
  }
  .found__social {
    width: 28cqw;
    gap: 1.6cqw;
    margin-top: 5cqw;
  }
  .found__social li {
    width: 4cqw;
  }
  .found__vendor {
    font-size: 2.2cqw;
  }
  .found__dots,
  .found__cue {
    left: 50cqw;
  }
  .found__dots span {
    width: 1.4cqw;
  }
  .found__cue svg {
    width: 6cqw;
    height: 6cqw;
  }
  .made__h1 {
    font-size: clamp(1.5rem, 7cqw, 2.4rem);
  }
  .made__navCta {
    font-size: 0.8rem;
    padding: 0.5rem 0.7rem;
  }
  .made__mark {
    font-size: 1.1rem;
  }
}

/* ── D429 ──────────────────────────────────────────────────────────────── */
.site .sheet {
  padding: 2.69cqw 2.69cqw 0;
  background-color: var(--paper-1, var(--paper));
  border: 1px solid var(--line, var(--ink-2));
  border-bottom: none;
}

.sheet__grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'masthead'
    'margin'
    'body';
  column-gap: 3.62%;
  align-items: start;
}

.masthead {
  grid-area: masthead;
  margin-bottom: 9.77cqw;
}

.masthead__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: clamp(1.4rem, 3.28cqw, 4.1rem);
  line-height: 1.1;
  letter-spacing: var(--tracking-display, -0.02em);
  text-wrap: balance;
}

.masthead__sub {
  margin: 0.64cqw 0 0;
  font-size: clamp(0.85rem, 1.73cqw, 2.16rem);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.02em;
  color: var(--ink-1, var(--ink));
}

.margin {
  grid-area: margin;
}

.margin__notes {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: clamp(0.75rem, 1cqw, 1.25rem);
  line-height: 1.2;
  color: var(--ink-1, var(--ink));
}

.margin__notes li {
  padding-left: 1.9em;
  text-indent: -1.9em;
}

.margin__notes li.em {
  font-style: italic;
}

.margin__plate {
  margin: 3.08cqw 0 0;
  aspect-ratio: 1;
  background-color: var(--paper-2, var(--paper-1, var(--paper)));
  border: 1px solid var(--line, var(--ink-2));
}

.margin__plate img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transition: opacity 0.6s var(--ease, ease);
}

@starting-style {
  .margin__plate img {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .margin__plate img {
    transition: none;
  }
}

.body {
  grid-area: body;
  font-size: clamp(0.95rem, 1.275cqw, 1.6rem);
  line-height: 1.3;
  max-width: 65ch;
}

.body p {
  margin: 0;
}

.body__lead {
  margin-bottom: 1lh;
}

.body__lead ~ p {
  text-indent: 1.65em;
}

@container (min-width: 48rem) {
  .sheet__grid {
    grid-template-columns: 268fr 583fr;
    grid-template-areas:
      '.      masthead'
      'margin body';
  }
  .masthead {
    margin-bottom: 9.77cqw;
  }
}

/* ── SKRILLEX ──────────────────────────────────────────────────────────── */
.site {
  display: grid;
  grid-template-columns: 60.56cqw;
  justify-content: center;
  padding-top: max(2.69cqw, var(--chrome-band));
  min-height: 100svh;
  background-color: var(--paper);
  color: var(--ink);
}

.site--generic {
  grid-template-columns: 60.56cqw;
}

.site__art {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.rail {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: var(--ink);
  max-width: calc(100vw - 2rem);
}

.rail__word {
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.05em;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

.rail__glyph {
  font-size: 1.5rem;
  color: var(--spot);
}

.rail__nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.rail__item {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* ── F853 ──────────────────────────────────────────────────────────────── */
.f853 {
  position: relative;
  min-height: 100svh;
  padding: max(7%, var(--chrome-band)) 4% 4.5%;
}

.f853__list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: clamp(0.85rem, 1.6cqw, 1.1rem);
  line-height: 1.8;
}

.f853__row {
  display: flex;
  gap: 1.5rem;
}

.f853__num {
  color: var(--ink-3, var(--ink-2));
  font-variant-numeric: tabular-nums;
  min-width: 2em;
}

.f853__title {
  color: var(--ink);
}

.f853__clock {
  position: fixed;
  top: max(7%, var(--chrome-band));
  right: 4%;
  font-size: clamp(1rem, 2.5cqw, 2.5rem);
  color: var(--ink);
  font-variant-numeric: tabular-nums;
  z-index: 1;
}

.f853__plate {
  position: fixed;
  bottom: 4%;
  left: 4%;
  right: 4%;
  margin: 0;
  z-index: 0;
}

.f853__plate img {
  width: 100%;
  max-height: 40vh;
  object-fit: cover;
}

/* ── B374 ──────────────────────────────────────────────────────────────── */
.b374 {
  min-height: 100svh;
  padding-top: var(--chrome-band);
}

.b374__head {
  text-align: center;
  font-size: var(--type-label);
  color: var(--ink-2);
  padding: 1rem;
  border-bottom: 1px solid var(--line);
}

.b374__spreads {
  display: flex;
  flex-direction: column;
}

.spread {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
  border-bottom: 1px solid var(--line);
}

.spread__verso,
.spread__recto {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spread__verso img,
.spread__recto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spread__folio {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(3rem, 10vw, 10rem);
  color: var(--ink);
  line-height: 1;
}

/* ── Generic work fallback ─────────────────────────────────────────────── */
.generic {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100svh;
  gap: 1.5rem;
  padding: max(7%, var(--chrome-band)) var(--edge) 4rem;
}

.generic__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.generic__meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.generic__numeral {
  font-size: var(--type-label);
  color: var(--ink-2);
  letter-spacing: 0.1em;
}

.generic__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1.05;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0;
}

.generic__cat {
  font-size: var(--type-label);
  color: var(--ink-2);
}

.generic__summary {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  max-width: 30em;
}

.generic__mechanic {
  font-size: 0.85rem;
  color: var(--ink-2);
  line-height: 1.5;
}

@media (min-width: 48rem) {
  .generic {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}
</style>
