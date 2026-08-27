<script setup lang="ts">
import { PALETTE } from '~/data/palette';

const MODES = ['essential', 'brutal', 'clay', 'generative'] as const;
const THEMES = ['light', 'dark'] as const;

const swatchVars = Object.fromEntries(
  Object.entries(PALETTE).map(([name, hex]) => [`c-${name}`, hex]),
);

useHead({
  title: 'DESIGN — blue red + purple',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>

<template>
  <main class="doc">
    <h1 class="doc__h1">Design tokens</h1>
    <p class="doc__lead font-mono">
      Live reference. Prose tables: <code>DESIGN.md</code> (run
      <code>pnpm design:doc</code>).
    </p>

    <h2 class="doc__h2 font-mono">Palette — color law verified</h2>
    <ul class="swatches list ma0 pa0">
      <li v-for="[name, hex] in Object.entries(PALETTE)" :key="name" class="swatch">
        <span :class="`swatch__chip swatch__chip--${name}`" :style="{ backgroundColor: hex }" />
        <span class="swatch__meta font-mono f7">
          <strong>{{ name }}</strong>
          <span>{{ hex }}</span>
        </span>
      </li>
    </ul>

    <h2 class="doc__h2 font-mono">Kernels — one component, four modes × light/dark</h2>
    <div class="chips">
      <div v-for="mode in MODES" :key="mode">
        <div
          v-for="theme in THEMES"
          :key="`${mode}-${theme}`"
          class="chip"
          :data-mode="mode"
          :data-theme="theme"
        >
          <div class="chip__card">
            <span class="chip__spot" />
            <span class="chip__aa">Aa</span>
            <span class="chip__label font-mono f7 ttu tracked">
              {{ mode }} · {{ theme }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.doc {
  max-width: 60rem;
  margin: 0 auto;
  padding: clamp(2rem, 6vw, 5rem);
}

.doc__h1 {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: var(--type-display);
  line-height: 1;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0 0 1rem;
}

.doc__lead {
  color: var(--ink-2);
  margin: 0 0 2.5rem;
}

.doc__h2 {
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  margin: 3rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line);
}

code {
  font-family: var(--font-mono);
  background-color: var(--paper-1);
  padding: 0.1em 0.35em;
  border-radius: 0.2rem;
}

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  gap: 1rem;
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
  color: var(--ink-2);
}

.swatch__meta strong {
  color: var(--ink);
  font-weight: 600;
}

.chips {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 1rem;
}

.chip {
  background-color: var(--paper);
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
}

.chip__card {
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

.chip__spot {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 100%;
  background-color: var(--spot);
}

.chip__aa {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  letter-spacing: var(--tracking-display);
  font-size: 2.4rem;
  line-height: 1;
  color: var(--ink);
}

.chip__label {
  color: var(--ink-2);
}
</style>
