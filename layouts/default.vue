<script setup lang="ts">
import '~/assets/css/modes/essential.css';
import '~/assets/css/modes/brutal.css';
import '~/assets/css/modes/clay.css';
import '~/assets/css/modes/generative.css';

const route = useRoute();
const pathname = computed(() => route.path.replace(/\/+$/, '') || '/');
const onHome = computed(() => pathname.value === '/');
const onIndex = computed(() => pathname.value === '/works');

const INQUIRY = 'mailto:hi@blueredandpurple.world';
</script>

<template>
  <div>
    <!-- Global pinned chrome -->
    <header class="chrome">
      <div class="chrome__bar">
        <NuxtLink to="/" class="chrome__home" aria-label="blue red + purple — home" :aria-current="onHome ? 'page' : undefined">
          /
        </NuxtLink>
        <NuxtLink to="/works" class="chrome__index font-mono" :aria-current="onIndex ? 'page' : undefined">
          Index
        </NuxtLink>
        <div class="chrome__group">
          <a :href="INQUIRY" class="chrome__cta">
            Get in touch<span class="chrome__arrow" aria-hidden="true">↗</span>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Film grain -->
    <div class="grain" aria-hidden="true"></div>

    <slot />
  </div>
</template>

<style>
.chrome {
  position: fixed;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  color: var(--ink);
}

.chrome a,
.chrome theme-toggle {
  pointer-events: auto;
}

.chrome__bar {
  position: absolute;
  top: max(var(--chrome-inset), env(safe-area-inset-top));
  left: max(var(--chrome-inset), env(safe-area-inset-left));
  right: max(var(--chrome-inset), env(safe-area-inset-right));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.chrome__group {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.chrome__home {
  position: relative;
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 1.6rem;
  line-height: 1;
  color: var(--ink);
  text-decoration: none;
  transition: opacity var(--dur) var(--ease);
}

.chrome__index {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--type-label);
  line-height: 1;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
  text-decoration: none;
  white-space: nowrap;
  transition: opacity var(--dur) var(--ease);
}

.chrome__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.42em 0.72em;
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--type-label);
  line-height: 1;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--paper);
  border: var(--border-w, 2px) solid var(--ink);
  box-shadow: 3px 3px 0 var(--ink);
  text-decoration: none;
  white-space: nowrap;
  transition:
    transform var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}

.chrome__arrow {
  transition: transform var(--dur) var(--ease);
}

.chrome__cta:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 var(--ink);
}

.chrome__home[aria-current='page'],
.chrome__index[aria-current='page'] {
  pointer-events: none;
}

.chrome__home:focus-visible,
.chrome__index:focus-visible,
.chrome__cta:focus-visible {
  outline: var(--border-w, 2px) solid var(--ink);
  outline-offset: 3px;
}

@media (hover: hover) {
  .chrome__home:hover,
  .chrome__index:hover {
    opacity: 0.6;
  }
  .chrome__cta:hover {
    transform: translate(-1px, -1px);
    box-shadow: 5px 5px 0 var(--ink);
  }
  .chrome__cta:hover .chrome__arrow {
    transform: translate(0.15em, -0.15em);
  }
}

@media (max-width: 30rem) {
  .chrome__index {
    position: relative;
    inset: auto;
    transform: none;
    letter-spacing: 0.12em;
  }
  .chrome__group {
    gap: var(--space-2);
  }
  .chrome__cta {
    padding: 0.4em 0.6em;
    letter-spacing: 0.06em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chrome__cta,
  .chrome__arrow {
    transition: none;
  }
}

.grain {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}
</style>
