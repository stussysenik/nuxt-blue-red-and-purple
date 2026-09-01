<script setup lang="ts">
import type { FeatureBlock } from '~/types/storyblok'

defineProps<{
  blok: FeatureBlock
}>()
</script>

<template>
  <div v-editable="blok" v-if="blok.name" class="storyblok-feature">
    <h3 class="font-mono ttu tracked">{{ blok.name }}</h3>
  </div>
</template>

<style scoped>
.storyblok-feature {
  padding: 1.5rem;
  border: 1px solid var(--line);
}
h3 {
  font-size: var(--type-label);
}
</style>
