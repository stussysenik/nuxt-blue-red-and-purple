<script setup lang="ts">
import type { TemplateConfigBlock } from '~/types/storyblok'

defineProps<{
  blok: TemplateConfigBlock
}>()
</script>

<template>
  <!-- TemplateConfig is a non-rendering data block: it carries the
       client-customizer ("dialkit") payload for the page. The visual
       editor reads it to drive the live mode/theme/scale switches; it
       produces no DOM of its own. -->
  <div v-editable="blok" class="template-config" hidden aria-hidden="true">
    {{ blok }}
  </div>
</template>
