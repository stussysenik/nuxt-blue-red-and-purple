<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedVariables: used in template
const { theme, toggle } = useTheme();
// biome-ignore lint/correctness/noUnusedVariables: used in template
const isDark = computed(() => theme.value === 'dark');
</script>

<template>
  <button
    type="button"
    :aria-pressed="isDark ? 'true' : 'false'"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    class="theme-toggle"
    @click="toggle"
  >
    <svg
      v-if="isDark"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.4A8 8 0 1 1 9.6 4 6.2 6.2 0 0 0 20 14.4z" />
    </svg>
    <svg
      v-else
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.1" />
      <path
        d="M12 2.6v2.4M12 19v2.4M4.3 4.3l1.7 1.7M18 18l1.7 1.7M2.6 12H5M19 12h2.4M4.3 19.7l1.7-1.7M18 6l1.7-1.7"
      />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  padding: 0;
  background: none;
  border: none;
  color: var(--ink);
  cursor: pointer;
  transition: color var(--dur) var(--ease);
  -webkit-tap-highlight-color: transparent;
}

.theme-toggle:focus-visible {
  color: var(--spot);
  outline: none;
}

@media (hover: hover) {
  .theme-toggle:hover {
    color: var(--spot);
  }
}

svg {
  display: block;
  width: 1.15rem;
  height: 1.15rem;
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle {
    transition: none;
  }
}
</style>
