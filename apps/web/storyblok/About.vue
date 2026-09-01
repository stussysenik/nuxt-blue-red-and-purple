<script setup lang="ts">
import type { AboutBlock } from '~/types/storyblok'

defineProps<{
  blok: AboutBlock
}>()
</script>

<template>
  <section v-editable="blok" id="about" class="band" data-section="04">
    <h2 class="band__title">About us</h2>
    <p class="band__lead measure-wide lh-copy">
      {{ blok.description }}
    </p>

    <!-- Formula -->
    <p v-if="blok.formula?.length" class="band__lead measure-wide lh-copy">
      <br>Our Formula:<br>
      <template v-for="f in blok.formula" :key="f._uid">
        {{ f.step }}<br> {{ f.description }}<br>
      </template>
    </p>

    <!-- Lineage colophon -->
    <dl v-if="blok.lineage?.length" class="lineage font-mono">
      <div v-for="entry in blok.lineage" :key="entry._uid" class="lineage__row">
        <dt>{{ entry.label }}</dt>
        <dd>{{ entry.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.band {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
  container-type: inline-size;
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

/* Lineage colophon */
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
