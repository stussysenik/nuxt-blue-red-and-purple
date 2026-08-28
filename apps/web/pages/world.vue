<script setup lang="ts">
import { useGenerativeCanvas } from '~/composables/useGenerativeCanvas';

useHead({
  title: 'World-building — *blue red + purple/',
  meta: [
    { name: 'description', content: 'We build generative brand worlds for the music industry. Not websites. Worlds. A portal your fans step into.' },
  ],
});

useGenerativeCanvas();

const INQUIRY = 'mailto:hi@blueredandpurple.world';

const PROCESS = [
  {
    step: '01',
    title: 'The Brief',
    body: 'You describe the artist\'s world in one sentence. The sound, the mood, the story. That\'s the seed.',
  },
  {
    step: '02',
    title: 'The Generation',
    body: 'Our engine generates a complete immersive world. Music player, visuals, artifacts, fan interaction — all from the brief.',
  },
  {
    step: '03',
    title: 'The Campaign',
    body: 'Pre-release the world teases. Release day it blooms. Post-release it grows with tour dates, merch, and fan contributions.',
  },
  {
    step: '04',
    title: 'The Loop',
    body: 'Fans discover artifacts, share them, bring new fans in. The world markets itself. You get the data.',
  },
];

const TIERS = [
  {
    name: 'Release Campaign',
    price: '$15–50k',
    per: 'per release',
    blurb: 'A generative world for a specific album, EP, or single drop.',
    features: [
      'Pre-release teaser world',
      'Release-day full unlock',
      'Music player + video',
      'Fan artifact sharing',
      'Press kit + industry door',
    ],
  },
  {
    name: 'Artist World',
    price: '$5–15k',
    per: 'setup + $2–5k/mo',
    blurb: 'A living world that evolves with the artist\'s career.',
    features: [
      'Everything in Release Campaign',
      'Auto-integrates new music',
      'Tour date management',
      'Merch drops in-world',
      'Fan community layer',
      'Monthly analytics report',
    ],
  },
  {
    name: 'Label OS',
    price: '$20–100k',
    per: 'per year',
    blurb: 'White-label. Every artist on the roster gets a world.',
    features: [
      'Everything in Artist World',
      'Full roster deployment',
      'Label dashboard',
      'Fan acquisition cost tracking',
      'Conversion analytics',
      'Revenue attribution',
    ],
  },
];
</script>

<template>
  <div>
    <!-- Generative background -->
    <div class="gen-bg" aria-hidden="true">
      <canvas id="gen-canvas"></canvas>
    </div>

    <!-- Hero -->
    <section class="hero" data-section="00">
      <p class="hero__eyebrow font-mono ttu tracked">blue red + purple — world-building studio</p>
      <h1 class="hero__title">
        Not websites.<br />Worlds.
      </h1>
      <p class="hero__lead measure-wide">
        We build generative brand worlds for the music industry. A portal your fans
        step into — where music, visuals, releases, and community live as one
        immersive experience. The world markets itself. You get the data.
      </p>
      <a :href="INQUIRY" class="hero__cta font-mono ttu tracked">
        Build your world <span aria-hidden="true">↗</span>
      </a>
    </section>

    <!-- What it is -->
    <section class="band" data-section="01">
      <h2 class="band__title">What it is</h2>
      <div class="col">
        <p class="band__lead measure-wide lh-copy">
          A traditional artist site is a brochure. Links to Spotify, a photo, a bio.
          Fans leave in eight seconds.
        </p>
        <p class="band__lead measure-wide lh-copy">
          A <strong>world</strong> is different. Fans step <em>into</em> the artist's
          universe. They discover artifacts — song snippets, video clips, handwritten
          notes, voice memos. They leave their mark. They share what they found. The
          world grows the artist's reach while you sleep.
        </p>
        <p class="band__lead measure-wide lh-copy">
          Our generative engine builds these worlds from a single brief. What used to
          take a team of five and six weeks now takes a prompt and forty-eight hours.
        </p>
      </div>
    </section>

    <!-- The transformation -->
    <section class="band" data-section="02">
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

    <!-- How it works -->
    <section class="band" data-section="03">
      <h2 class="band__title">How it works</h2>
      <ol class="process">
        <li v-for="item in PROCESS" :key="item.step" class="process__item">
          <span class="process__step font-mono">{{ item.step }}</span>
          <div class="process__content">
            <h3 class="process__title">{{ item.title }}</h3>
            <p class="process__body">{{ item.body }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- Proof -->
    <section class="band" data-section="04">
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

    <!-- Tiers -->
    <section class="band" data-section="05">
      <h2 class="band__title">What we sell</h2>
      <div class="tiers">
        <div v-for="tier in TIERS" :key="tier.name" class="tier">
          <div class="tier__head">
            <h3 class="tier__name">{{ tier.name }}</h3>
            <p class="tier__price">
              <span class="tier__price-num">{{ tier.price }}</span>
              <span class="tier__price-per font-mono">{{ tier.per }}</span>
            </p>
          </div>
          <p class="tier__blurb">{{ tier.blurb }}</p>
          <ul class="tier__features">
            <li v-for="feature in tier.features" :key="feature" class="tier__feature">
              <span class="tier__check" aria-hidden="true">✓</span>
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Why us -->
    <section class="band" data-section="06">
      <h2 class="band__title">Why us</h2>
      <div class="why">
        <div class="why__item">
          <h3 class="why__label">The engine is the moat</h3>
          <p class="why__body">
            A typed IR compiler with grammar gates. Worlds are data — a brief goes
            in, a complete immersive experience comes out. No per-artist custom code.
          </p>
        </div>
        <div class="why__item">
          <h3 class="why__label">Speed is the advantage</h3>
          <p class="why__body">
            48 hours from brief to live world. A traditional agency needs a team of
            five and six weeks. We need a prompt.
          </p>
        </div>
        <div class="why__item">
          <h3 class="why__label">The world markets itself</h3>
          <p class="why__body">
            Fans discover artifacts, share them, bring new fans in. Viral loop built
            into the product. Your CAC drops every day the world is live.
          </p>
        </div>
        <div class="why__item">
          <h3 class="why__label">We come from music</h3>
          <p class="why__body">
            Our portfolio includes Skillex, tour posters, album sites, and artist
            campaigns. We speak the language. We know what moves units.
          </p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="band band--last" data-section="07">
      <h2 class="band__title">Build your world</h2>
      <p class="band__lead measure-wide">
        Whether you're a label with a roster of thirty or an artist about to drop
        your first campaign — we build worlds that move units.
      </p>
      <a :href="INQUIRY" class="final__cta font-mono ttu tracked">
        Get in touch <span aria-hidden="true">↗</span>
      </a>
      <p class="final__note font-mono">
        hi@blueredandpurple.world · (404) 422-5517
      </p>
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
  line-height: 1.05;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  margin: 0;
  color: var(--ink);
}

.hero__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin:0;
  max-width: 34em;
}

.hero__cta {
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
  line-height: 1.05;
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
  background-color: var(--paper-1);
  padding: 0.1em 0.35em;
  border-radius: 0.2rem;
}

/* ── What it is ────────────────────────────────────────────────────────── */
.col {
  display: grid;
  gap: 1.2rem;
}

/* ── Transformation ────────────────────────────────────────────────────── */
.transform {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
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
  text-align: center;
}

/* ── Process ───────────────────────────────────────────────────────────── */
.process {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1.5rem;
}

.process__item {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  align-items: start;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.process__step {
  font-size: var(--type-label);
  color: var(--ink-2);
  letter-spacing: 0.1em;
}

.process__title {
  font-size: var(--type-body);
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 0.4rem;
}

.process__body {
  font-size: var(--type-meta);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0;
}

/* ── Proof ─────────────────────────────────────────────────────────────── */
.proof {
  display: grid;
  gap: 1.5rem;
}

.proof__quote {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 2.2rem);
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
  font-size: var(--type-meta);
  color: var(--ink-1);
  margin: 0;
  line-height: 1.5;
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

/* ── Why us ────────────────────────────────────────────────────────────── */
.why {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1.5rem;
}

.why__item {
  display: grid;
  gap: 0.5rem;
  align-content: start;
}

.why__label {
  font-size: var(--type-body);
  font-weight: 600;
  color: var(--ink);
  margin: 0;
}

.why__body {
  font-size: var(--type-meta);
  line-height: 1.5;
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

/* ── Responsive ────────────────────────────────────────────────────────── */
@container (min-width: 50rem) {
  .transform {
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
  }

  .transform__arrow {
    transform: none;
  }
}

@container (max-width: 50rem) {
  .transform__arrow {
    transform: rotate(90deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__cta,
  .final__cta {
    transition: none;
  }
}
</style>
