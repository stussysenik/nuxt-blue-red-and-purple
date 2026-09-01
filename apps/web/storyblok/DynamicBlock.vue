<script setup lang="ts">
// Dynamic block renderer — resolves Storyblok block to its Vue component
// Each component receives the full blok object as a prop for v-editable support
import type { Component } from 'vue'
import type { SbComponentType } from '~/types/storyblok'
import Hero from './Hero.vue'
import About from './About.vue'
import Contacts from './Contacts.vue'
import Grid from './Grid.vue'
import Feature from './Feature.vue'
import Teaser from './Teaser.vue'
import Page from './Page.vue'
import ModeWheel from './ModeWheel.vue'
import TemplateConfig from './TemplateConfig.vue'
import ProjectIndex from './ProjectIndex.vue'

const componentMap: Record<string, Component> = {
  hero: Hero,
  about: About,
  contacts: Contacts,
  grid: Grid,
  feature: Feature,
  teaser: Teaser,
  page: Page,
  mode_wheel: ModeWheel,
  template_config: TemplateConfig,
  project_index: ProjectIndex,
}

const props = defineProps<{
  blok: SbComponentType
}>()

const resolvedComponent = computed(() => componentMap[props.blok.component] || null)
</script>

<template>
  <component
    :is="resolvedComponent"
    v-if="resolvedComponent"
    :blok="blok"
  />
  <div
    v-else
    class="missing-block font-mono"
    :data-blok-cid="blok._uid"
    :data-blok-uid="blok._uid"
  >
    Missing component: <strong>{{ blok.component }}</strong>
  </div>
</template>

<style scoped>
.missing-block {
  padding: 2rem;
  border: 2px dashed #e00;
  margin: 1rem 0;
  font-size: 0.8rem;
  color: #e00;
}
</style>
