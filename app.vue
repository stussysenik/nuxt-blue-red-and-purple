<script setup lang="ts">
// Mode + theme are set inline in nuxt.config head script (before paint).
// Import all mode kernels so they're bundled.
import '~/assets/css/modes/essential.css';
import '~/assets/css/modes/brutal.css';
import '~/assets/css/modes/clay.css';
import '~/assets/css/modes/generative.css';
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
