<script setup lang="ts">
import { getGroupedWorks } from '~/data/works';
import { toRoman } from '~/data/roman';

useHead({
  title: 'Project index — *blue red + purple/',
});

const groups = getGroupedWorks();
const allWorks = groups.flatMap((g) => g.items);
const numeralOf = new Map(allWorks.map((w, i) => [w.slug, toRoman(i + 1)] as const));

const hoveredImage = ref<string | null>(allWorks[0]?.image ?? null);

function paintImage(url: string | null) {
  hoveredImage.value = url;
}

// Archived: vertical descriptions (tagline + blurb per category). The live
// site uses plain "{category} store" labels. These were generator-direction
// copy. Restore by uncommenting VERTICAL_DESCRIPTIONS and the blurb elements.
// const VERTICAL_DESCRIPTIONS: Record<string, { tagline: string; blurb: string }> = {
//   restaurant: { tagline: 'Menus, counters, and one-page ordering', blurb: '...' },
//   music: { tagline: 'Tour dates, releases, and artist worlds', blurb: '...' },
//   hotel: { tagline: 'Booking-first, restraint as the brand', blurb: '...' },
//   books: { tagline: 'Reading-mode, the book is the interface', blurb: '...' },
//   vintage: { tagline: 'Editorial stacks and dated drops', blurb: '...' },
// };
</script>

<template>
  <main class="index">
    <span class="index__ghost" :style="{ backgroundImage: hoveredImage ? `url('${hoveredImage}')` : '' }" aria-hidden="true"></span>

    <h1 class="visually-hidden">Project index</h1>

    <section v-for="group in groups" :key="group.category" class="group">
      <h2 class="group__label font-mono ttu tracked">{{ group.category }} store</h2>
      <ul class="index__list">
        <li v-for="w in group.items" :key="w.slug">
          <NuxtLink
            class="row"
            :to="`/works/${w.slug}`"
            @pointerenter="paintImage(w.image)"
            @focus="paintImage(w.image)"
          >
            <span class="row__dot" aria-hidden="true" />
            <span class="row__title">{{ numeralOf.get(w.slug) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- ── Archived: Generator CTA (unfinished generator-direction content) ──
    <section class="gen-cta">
      <h2 class="gen-cta__h2">Or describe what you need</h2>
      <p class="gen-cta__blurb measure">
        Tell us about your project in plain English. Our generator maps your
        intent to a complete design system — mode, palette, typography — in
        real time. No templates. No subscriptions.
      </p>
      <NuxtLink to="/generator" class="gen-cta__link">
        Try the generator<span class="gen-cta__arrow" aria-hidden="true">↗</span>
      </NuxtLink>
    </section>
    -->
  </main>
</template>

<style scoped>
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

.index {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: grid;
  align-content: start;
  row-gap: clamp(2.4rem, 6vh, 4rem);
  color: var(--ink);
  padding: clamp(5.5rem, 13vh, 8rem) var(--edge) clamp(4rem, 9vh, 5.5rem);
}

.group__label {
  text-align: center;
  font-size: var(--type-label);
  font-weight: 500;
  color: var(--ink-2);
  margin: 0 0 0.7rem;
}

.index__ghost {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-position: center;
  background-size: cover;
  filter: blur(56px) saturate(1.1);
  opacity: 0.22;
  transform: scale(1.15);
  transition: opacity 0.5s var(--ease);
  pointer-events: none;
}

.index__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.1rem 0.6rem;
  text-decoration: none;
  color: var(--ink-2);
  transition: color 0.25s var(--ease);
}

.row:hover,
.row:focus-visible {
  color: var(--ink);
  outline: none;
}

.row__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background-color: currentColor;
  flex: none;
  opacity: 0;
  transform: scale(0.3);
  transition:
    opacity 0.25s var(--ease),
    transform 0.25s var(--ease);
}

.row:hover .row__dot,
.row:focus-visible .row__dot {
  opacity: 1;
  transform: scale(1);
}

.row__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(1.5rem, 5vw, 4rem);
  line-height: 1.1;
  letter-spacing: var(--tracking-display);
  color: inherit;
  font-variant-numeric: tabular-nums;
}

.index:has(.row:hover) .index__ghost,
.index:has(.row:focus-visible) .index__ghost {
  opacity: 0.34;
  filter: blur(40px) saturate(1.18);
  transform: scale(1.08);
}

/* ── Archived: Generator CTA styles ───────────────────────────────────
   The gen-cta section is archived in the template above. These styles are
   kept for restore-on-uncomment but could be removed if the section stays
   hidden long-term.
.gen-cta { ... }
.gen-cta__h2 { ... }
.gen-cta__blurb { ... }
.gen-cta__link { ... }
.gen-cta__link:hover { ... }
.gen-cta__arrow { ... }
.gen-cta__link:hover .gen-cta__arrow { ... }
── */

@media (prefers-reduced-motion: reduce) {
  .index__ghost,
  .row,
  .row__dot {
    transition: none;
  }
}
</style>
