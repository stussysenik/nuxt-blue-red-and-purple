<script setup lang="ts">
// CMS content: fetched from local SQLite at build/SSR time.
const { data: cms } = await useAsyncData<Record<string, string>>('cms-content', () =>
  $fetch('/api/content').catch(() => ({})),
);

function c(key: string, fallback = ''): string {
  return cms.value?.[key] ?? fallback;
}

// Real-time sync: when admin pushes changes, update live
useRealtime((key: string, value: string) => {
  if (cms.value) cms.value[key] = value;
});

// Generative canvas
useGenerativeCanvas();

// The agency roster — who makes up blue red + purple right now.
const MEMBERS = ['Alex Wedderburn', 'Meng Xuan Zou'];
const PHONE = '(404) 422-5517';
const PHONE_HREF = 'tel:+14044225517';
</script>

<template>
  <div>
    <!-- ── Generative-mode background: preserved shader scenes graded to the
         kernel's ink/paper duotone. Fixed layer behind the chrome, shown only in
         generative mode; the loop suspends elsewhere. A paper veil keeps chrome
         legible over the scenes. ── -->
    <div class="gen-bg" aria-hidden="true">
      <canvas id="gen-canvas"></canvas>
    </div>

    <!-- ── Construction grid (pinned decor; pinned elements may overlap it) ── -->
    <div class="grid-rig" aria-hidden="true">
      <span class="grid-rig__v grid-rig__v--1"></span>
      <span class="grid-rig__v grid-rig__v--2"></span>
      <span class="grid-rig__v grid-rig__v--3"></span>
      <span class="grid-rig__h grid-rig__h--1"></span>
      <span class="grid-rig__h grid-rig__h--2"></span>
    </div>

    <!-- ── §00 Hero ── -->
    <section id="hero" class="hero" data-section="00">
      <h1 class="wordmark" aria-label="blue red + purple">
        <svg viewBox="0 0 461.66 152.16" xmlns="http://www.w3.org/2000/svg"><path d="m22.97 19.35 5.86 9.6 6.28-7.42 6.12 5.43-6.19 7.57 10.28 4.37-2.75 7.47-10.47-4.36-.98 11.35-7.9-.97.88-11.19-9.56 2.05-2.04-7.93 9.47-2.2-5.86-9.6 6.86-4.19z"/><path d="m356.98 50.87h-12.99v13.67h-8.89v-13.67h-12.99v-9.36h12.99v-13.76h8.89v13.76h12.99z"/><path d="m256 87.05c11.06 0 14.43 7.95 14.43 14.75 0 10.05-4.67 16.7-14.01 16.7h-3.16v18.29h-9.55v-49.75h12.3zm-2.74 21.11h2.34c5.43 0 5.22-4.05 5.22-6.15 0-1.74-.41-5.13-4.81-5.13h-2.75z"/><path d="m282.34 87.05v33.48c0 2.1-.21 7.09 3.57 7.09s3.57-4.99 3.57-7.09v-33.48h9.75v36.01c0 8.6-4.74 14.68-13.33 14.68s-13.33-6.15-13.33-14.68v-36.01h9.75z"/><path d="m322.85 115.97 6.66 20.83h-10.24l-5.98-19.02h-1.58v19.02h-9.62v-49.75h12.98c9.69 0 13.74 8.17 13.74 15.33 0 6.44-1.92 11.21-5.98 13.59zm-9.61-8.1c5.43 0 6.04-3.18 6.04-5.5 0-2.1-.62-5.5-5.63-5.5h-1.92v10.99h1.51z"/><path d="m344.5 87.05c11.06 0 14.43 7.95 14.43 14.75 0 10.05-4.67 16.7-14.01 16.7h-3.16v18.29h-9.55v-49.75h12.3zm-2.75 21.11h2.34c5.43 0 5.22-4.05 5.22-6.15 0-1.74-.41-5.13-4.81-5.13h-2.75z"/><path d="m361.05 87.05h9.96v39.27h16.76v10.49h-26.72v-49.75z"/><path d="m390.33 136.8v-49.75h26.72v10.05h-16.76v9.62h14.63v10.05h-14.63v9.91h16.76v10.12z"/><path d="m430.24 136.8h-10.92l18.44-49.75h10.92z"/><path d="m84.4 60.65c0 8.75-4.74 15.4-14.43 15.4h-12.3v-49.74h11.47c9.62 0 13.74 5.86 13.74 14.03 0 7.09-3.78 9.47-3.78 9.47s5.29 2.68 5.29 10.85zm-17.59-24.73v10.27h2.13c4.19 0 4.6-3.33 4.6-5.13s-.41-5.13-4.6-5.13h-2.13zm3.16 19.67h-3.16v10.85h3.16c3.71 0 4.81-3.33 4.81-5.42s-.69-5.42-4.81-5.42z"/><path d="m86.92 26.31h9.96v39.27h16.76v10.49h-26.72z"/><path d="m125.92 26.31v33.48c0 2.1-.21 7.09 3.57 7.09s3.57-4.99 3.57-7.09v-33.48h9.76v36.01c0 8.6-4.74 14.68-13.33 14.68s-13.33-6.15-13.33-14.68v-36.01h9.75z"/><path d="m145.72 76.06v-49.75h26.72v10.05h-16.76v9.62h14.63v10.05h-14.63v9.91h16.76v10.12z"/><path d="m226.85 55.23 6.66 20.83h-10.23l-5.98-19.02h-1.58v19.02h-9.62v-49.75h12.98c9.69 0 13.74 8.17 13.74 15.33 0 6.44-1.92 11.21-5.98 13.59zm-9.62-8.1c5.43 0 6.04-3.18 6.04-5.5 0-2.1-.62-5.5-5.63-5.5h-1.92v10.99h1.51z"/><path d="m235.79 76.06v-49.75h26.72v10.05h-16.76v9.62h14.63v10.05h-14.63v9.91h16.76v10.12z"/><path d="m265.04 26.31h12.3c9.69 0 14.43 6.58 14.43 14.03v21.77c0 7.23-4.74 14.17-14.43 13.96h-12.3zm9.41 39.91h1.99c5.77 0 5.84-4.84 5.84-6.87v-16.27c0-2.1-.07-6.94-5.84-6.94h-1.99z"/></svg>
      </h1>
      <p class="tagline font-mono ttu tracked">
        {{ c('hero_tagline', 'Too much blue will never amount to any red') }}
      </p>
    </section>

    <!-- ── §04 About ── -->
    <section id="about" class="band" data-section="04">
      <h2 class="band__title">About us</h2>
      <p class="band__lead measure-wide lh-copy">
        {{ c('about_body_1', 'We are a multi-disciplinary design communication studio that connects the unconnected by creating coherent and intuitive design. Every great idea begins with something fragile. Whether an idea is just at the beginning, taking shape, or ready to scale, we partner with our clients to build thoughtful work that feel intuitive, memorable and true to your vision.') }}
      </p>
      <p class="band__lead measure-wide lh-copy" style="white-space: pre-line">
        {{ c('about_body_2', 'Our Formula:\n–1 → 0 — Discovering possibilities through curiosity, research, and brainstorming.\n0 → 1 — Bringing ideas to life through thoughtful design and technology.\n1+ — Helping brands grow through continued creativity, refinement, and evolution.') }}
      </p>

      <!-- Lineage colophon: where the practice comes from. -->
      <dl class="lineage font-mono">
        <div class="lineage__row">
          <dt>{{ c('about_previously_label', 'Previously') }}</dt>
          <dd>{{ c('about_previously_value', 'BFA, The Cooper Union for the Advancement of Science and Art.') }}</dd>
        </div>
        <div class="lineage__row">
          <dt>{{ c('about_freegame_label', 'Free game') }}</dt>
          <dd>{{ c('about_freegame_value', 'After Virgil Abloh — the method is open-source; take it, pass it on.') }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── §06 Contacts ── -->
    <section id="contacts" class="band band--last" data-section="06">
      <h2 class="band__title">Contacts</h2>
      <div class="identity">
        <a :href="`mailto:${c('contact_email', 'hi@blueredandpurple.world')}`" class="identity__line">
          {{ c('contact_email', 'hi@blueredandpurple.world') }}
        </a>
        <a :href="PHONE_HREF" class="identity__line identity__line--mono font-mono">
          {{ PHONE }}
        </a>
        <p class="identity__team font-mono">
          <span class="identity__team-key" aria-hidden="true">Team:</span>
          <span class="identity__team-names" aria-label="Team">
            <template v-for="(name, i) in MEMBERS" :key="i">
              <span v-if="i > 0" class="identity__sep" aria-hidden="true">/</span>
              <span>{{ name }}</span>
            </template>
          </span>
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Structural styles compose only from kernel custom properties — the same
   escape hatch the Lit islands use. No rogue hex, no arbitrary utilities. */

/* Generative-mode background layer — behind content (z 1), above the body
   paper. Hidden outside generative mode; the runner suspends its loop in
   lockstep, so it costs nothing when unseen. */
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
:global(:root[data-mode='generative']) .gen-bg {
  opacity: 1;
  visibility: visible;
}
#gen-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
/* Legibility veil: softens the scenes toward paper so --ink chrome stays
   readable over the moving background without hiding it. */
.gen-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--paper);
  opacity: 0.28;
}

/* Hairline construction grid — the engineering register from the comp. */
.grid-rig {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.grid-rig__v,
.grid-rig__h {
  position: absolute;
  background-color: var(--line);
  opacity: 0.6;
}
.grid-rig__v {
  top: 0;
  bottom: 0;
  width: 1px;
}
.grid-rig__v--1 {
  left: var(--rig-v-1);
}
.grid-rig__v--2 {
  left: var(--rig-v-2);
}
.grid-rig__v--3 {
  left: var(--rig-v-3);
}
.grid-rig__h {
  left: 0;
  right: 0;
  height: 1px;
}
.grid-rig__h--1 {
  top: var(--rig-h-1);
}
.grid-rig__h--2 {
  top: var(--rig-h-2);
}

/* Hero. */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: grid;
  align-content: center;
  gap: 1.6rem;
  padding: 6rem var(--edge) 4rem;
}
.wordmark {
  display: block;
  width: min(78vw, 60rem);
  margin: 0;
}
.wordmark :global(svg) {
  display: block;
  width: 100%;
  height: auto;
  fill: var(--ink);
}
.tagline {
  color: var(--ink);
  font-size: var(--type-label);
}

/* Content bands. */
.band {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  /* Query container: descendants size to the band's own inline width, not the
     viewport (parent-relative type — the Dan Hollick discipline). */
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
  margin: 0 0 1.4rem;
  color: var(--ink);
}
.band__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
}
.band__lead code {
  background-color: var(--paper-1);
  padding: 0.1em 0.35em;
  border-radius: 0.2rem;
}

/* ── §06 Identity block ───────────────────────────────────────────────────
   Email + phone are matched-size sibling rows — one shared reach, two lines
   of the same voice — with the roster woven beneath as the "Team:" byline.
   At rest the block is quiet ink; on hover a line becomes *reflexive*: it
   takes the brand's acid green (#00FF00, hue 120 — inside the yellow→green
   territory, so colour-law legal) and a hard ink offset, the risograph
   mis-registration / comic-panel look shared with the Get-in-touch button. */
.identity {
  margin-top: 1.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
.identity__line {
  /* The shared contact size — email and phone read as equal siblings. Sized
     in container units (cqi = 1% of the band's inline width), not vw: type
     tracks the parent column, never the raw viewport. */
  font-size: clamp(1.5rem, 5cqi, 2.6rem);
  line-height: 1.05;
  color: var(--ink);
  text-decoration: none;
  text-shadow: 0 0 0 transparent;
  transition:
    color var(--dur) var(--ease),
    text-shadow var(--dur) var(--ease);
}
.identity__line:not(.identity__line--mono) {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
}
/* The phone rides the mono register (a dialable string, not display prose).
   Tabular figures keep the digits on an even rhythm and a hair of negative
   tracking pulls the numerals into one number rather than spaced glyphs, so
   it reads as a phone line the eye can group — sibling in size to the email. */
.identity__line--mono {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
/* The reflexive state — the paper-comic reveal. Keyboard focus earns it too. */
@media (hover: hover) {
  .identity__line:hover {
    color: #00ff00;
    text-shadow: 4px 4px 0 var(--ink);
  }
}
.identity__line:focus-visible {
  color: #00ff00;
  text-shadow: 4px 4px 0 var(--ink);
  outline: none;
}
@media (prefers-reduced-motion: reduce) {
  .identity__line {
    transition: none;
  }
}

/* The byline — who makes up blue red + purple right now. Extends by adding a
   name to MEMBERS; a keyed "Team:" label anchors it under the reach without
   competing with the two contact lines. */
.identity__team {
  margin: 0.9rem 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.7rem;
  font-size: var(--type-label);
  letter-spacing: var(--tracking-label, 0.08em);
  text-transform: uppercase;
  color: var(--ink-2);
}
.identity__team-key {
  color: var(--ink-1);
  font-weight: 600;
}
.identity__team-names {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.7rem;
}
.identity__sep {
  color: var(--ink-3, var(--ink-2));
  opacity: 0.6;
}

/* Lineage colophon (§04). Label column + hanging value, the CV/credit
   register. Distinct from .ledger (numeric, space-between) — this is a
   two-column label→prose grid that stacks on the narrowest viewports. */
.lineage {
  display: grid;
  gap: 0.9rem;
  max-width: 34rem;
  margin-top: 2.4rem;
}
.lineage__row {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding-top: 0.7rem;
  border-top: 1px solid var(--line);
}
.lineage__row dt {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
  color: var(--ink-2);
}
.lineage__row dd {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--ink-1);
}
/* Below ~28rem the label column would starve the value; stack them. */
@media (max-width: 28rem) {
  .lineage__row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>
