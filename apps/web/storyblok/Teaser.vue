<script setup lang="ts">
import type { TeaserBlock } from '~/types/storyblok'

defineProps<{
  blok: TeaserBlock
}>()
</script>

<template>
  <section v-editable="blok" v-if="blok.headline" class="storyblok-teaser">
    <h1 class="font-mono ttu tracked">{{ blok.headline }}</h1>
  </section>
</template>

<style scoped>
.storyblok-teaser {
  padding: 6rem var(--edge) 4rem;
  min-height: 60svh;
  display: grid;
  align-content: center;
}
h1 {
  font-size: var(--type-display);
  max-width: 20ch;
}
</style>
