<script setup lang="ts">
import { getVisibleWorks } from '~/data/works';

const works = getVisibleWorks();

const MEMBERS = ['Alex Wedderburn', 'Meng Xuan Zou'];
const PHONE = '(404) 422-5517';
const PHONE_HREF = 'tel:+14044225517';
</script>

<template>
  <div>
    <!-- Generative-mode background -->
    <div class="gen-bg" aria-hidden="true">
      <canvas id="gen-canvas"></canvas>
    </div>

    <!-- Construction grid -->
    <div class="grid-rig" aria-hidden="true">
      <span class="grid-rig__v grid-rig__v--1"></span>
      <span class="grid-rig__v grid-rig__v--2"></span>
      <span class="grid-rig__v grid-rig__v--3"></span>
      <span class="grid-rig__h grid-rig__h--1"></span>
      <span class="grid-rig__h grid-rig__h--2"></span>
    </div>

    <!-- Hero -->
    <section id="hero" class="hero" data-section="00">
      <h1 class="wordmark" aria-label="blue red + purple">
        <img src="/done.svg" alt="blue red + purple" />
      </h1>
      <p class="tagline font-mono ttu tracked">
        Too much blue will never amount to any red
      </p>
    </section>

    <!-- About -->
    <section id="about" class="band" data-section="04">
      <h2 class="band__title">About us</h2>
      <p class="band__lead measure-wide lh-copy">
        We are a multi-disciplinary design communication studio that connects the
        unconnected by creating coherent and intuitive design. Every great idea
        begins with something fragile. Whether an idea is just at the beginning,
        taking shape, or ready to scale, we partner with our clients to build
        thoughtful work that feel intuitive, memorable and true to your vision.
      </p>
      <p class="band__lead measure-wide lh-copy">
        <br />Our Formula:<br />–1 → 0 <br />Discovering possibilities through
        curiosity, research, and brainstorming. <br />0 → 1 <br />Bringing ideas
        to life through thoughtful design and technology. <br />1+<br />Helping
        brands grow through continued creativity, refinement, and evolution.
      </p>

      <dl class="lineage font-mono">
        <div class="lineage__row">
          <dt>Previously</dt>
          <dd>BFA, The Cooper Union for the Advancement of Science and Art.</dd>
        </div>
        <div class="lineage__row">
          <dt>Free game</dt>
          <dd>After Virgil Abloh — the method is open-source; take it, pass it on.</dd>
        </div>
      </dl>
    </section>

    <!-- Contacts -->
    <section id="contacts" class="band band--last" data-section="06">
      <h2 class="band__title">Contacts</h2>
      <div class="identity">
        <a href="mailto:hi@blueredandpurple.world" class="identity__line">
          hi@blueredandpurple.world
        </a>
        <a :href="PHONE_HREF" class="identity__line identity__line--mono font-mono">
          {{ PHONE }}
        </a>
        <p class="identity__team font-mono">
          <span class="identity__team-key" aria-hidden="true">Team:</span>
          <span class="identity__team-names" aria-label="Team">
            <template v-for="(name, i) in MEMBERS" :key="name">
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

.dot {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 100%;
  border: 1px solid currentColor;
  background-color: transparent;
  flex: none;
  transition:
    background-color 0.25s ease,
    transform 0.25s ease;
}

.dot[data-on='true'] {
  background-color: currentColor;
}

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

.wordmark img {
  display: block;
  width: 100%;
  height: auto;
}

.tagline {
  color: var(--ink);
  font-size: var(--type-label);
}

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

.band__index {
  font-size: var(--type-label);
  color: var(--ink-2);
  letter-spacing: 0.1em;
}

.band__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  line-height: 1;
  letter-spacing: var(--tracking-display);
  text-transform: uppercase;
  font-size: var(--type-display);
  margin: 0.4rem 0 1.4rem;
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

.identity {
  margin-top: 1.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.identity__line {
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
  font-weight: var(--wght-display, 700);
}

.identity__line--mono {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

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

@media (max-width: 28rem) {
  .lineage__row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>
