<script setup lang="ts">
import type { GridBlock } from '~/types/storyblok'

defineProps<{
  blok: GridBlock
}>()
</script>

<template>
  <section v-editable="blok" v-if="blok.columns?.length" class="storyblok-grid">
    <div class="storyblok-grid__inner">
      <DynamicBlock
        v-for="col in blok.columns"
        :key="col._uid"
        :blok="col"
      />
    </div>
  </section>
</template>

<style scoped>
.storyblok-grid {
  padding: 4rem var(--edge);
  border-top: 1px solid var(--line);
}
.storyblok-grid__inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.5rem;
}
</style>
