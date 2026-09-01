<script setup lang="ts">
import type { TemplateConfigBlock } from '~/types/storyblok'
import type { Mode, Theme } from '@brp/types'
import { useMode, useTheme } from '~/composables/useTheme'

const { setMode } = useMode()
const { setTheme } = useTheme()

const { blok } = defineProps<{ blok: TemplateConfigBlock }>()

// Apply template defaults only on first visit — when no localStorage
// preference exists. The no-FOUC bootstrap already resolved from
// localStorage/prefers-color-scheme before paint; this only fills the
// gap for a pristine browser.
onMounted(() => {
  if (blok.default_mode && !localStorage.getItem('mode')) {
    setMode(blok.default_mode as Mode)
  }
  if (blok.default_theme && !localStorage.getItem('theme')) {
    setTheme(blok.default_theme as Theme)
  }
})
</script>

<template>
  <!-- Non-rendering block: applies first-visit template defaults. -->
</template>
