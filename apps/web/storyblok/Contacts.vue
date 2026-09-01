<script setup lang="ts">
import type { ContactsBlock } from '~/types/storyblok'

defineProps<{
  blok: ContactsBlock
}>()
</script>

<template>
  <section v-editable="blok" id="contacts" class="band band--last" data-section="06">
    <h2 class="band__title">Contacts</h2>
    <div class="identity">
      <a v-if="blok.email" :href="`mailto:${blok.email}`" class="identity__line">
        {{ blok.email }}
      </a>
      <a v-if="blok.phone" :href="`tel:${blok.phone.replace(/[^+\d]/g, '')}`" class="identity__line identity__line--mono font-mono">
        {{ blok.phone }}
      </a>
      <p v-if="blok.team?.length" class="identity__team font-mono">
        <span class="identity__team-key" aria-hidden="true">Team:</span>
        <span class="identity__team-names" aria-label="Team">
          <template v-for="(name, i) in blok.team" :key="i">
            <span v-if="i > 0" class="identity__sep" aria-hidden="true">/</span>
            <span>{{ name }}</span>
          </template>
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.band {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
}
.band--last { min-height: 60svh; }
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

/* Identity block */
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
  transition: color var(--dur) var(--ease), text-shadow var(--dur) var(--ease);
}
.identity__line:not(.identity__line--mono) {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
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
</style>
