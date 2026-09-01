<script setup lang="ts">
import type { TemplateConfigBlock } from '~/types/storyblok'
import { useMode, useTheme } from '~/composables/useTheme'

const { setMode } = useMode()
const { setTheme } = useTheme()

const props = defineProps<{
  blok: TemplateConfigBlock
}>()

// Apply template defaults only on first visit — when no localStorage
// preference exists. The no-FOUC bootstrap already resolved from
// localStorage/prefers-color-scheme before paint; this only fills the
// gap for a pristine browser.
onMounted(() => {
  if (props.blok.default_mode && !localStorage.getItem('mode')) {
    setMode(props.blok.default_mode)
  }
  if (props.blok.default_theme && !localStorage.getItem('theme')) {
    setTheme(props.blok.default_theme)
  }
})
</script>

<template>
  <!-- Non-rendering block: applies first-visit template defaults. -->
</template>
