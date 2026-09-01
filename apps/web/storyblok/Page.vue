<script setup lang="ts">
import type { PageBlock } from '~/types/storyblok'

defineProps<{
  blok: PageBlock
}>()
</script>

<template>
  <article v-editable="blok" class="storyblok-page">
    <DynamicBlock
      v-for="child in blok.body"
      :key="child._uid"
      :blok="child"
    />
  </article>
</template>

<style scoped>
.storyblok-page {
  min-height: 100svh;
}
</style>
