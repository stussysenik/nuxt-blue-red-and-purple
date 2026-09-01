<script setup lang="ts">
import '~/assets/css/modes/essential.css';
import '~/assets/css/modes/brutal.css';
import '~/assets/css/modes/clay.css';
import '~/assets/css/modes/generative.css';

const route = useRoute();
const pathname = computed(() => route.path.replace(/\/+$/, '') || '/');
const onHome = computed(() => pathname.value === '/');
const onIndex = computed(() => pathname.value === '/works');
const onSystem = computed(() => pathname.value === '/system');

const INQUIRY = 'mailto:hi@blueredandpurple.world';

// Archived: Generator/World/Showcase nav links. The live site ships with just
// home + Index. These are the unfinished product-direction ideas.
// const onGenerator = computed(() => pathname.value === '/generator');
// const onWorld = computed(() => pathname.value === '/world');
// const onShowcase = computed(() => pathname.value === '/showcase');

// Toolbar show/hide on scroll with SQLite persistence
const { visible: toolbarVisible, isReady: toolbarReady } = useToolbar();
</script>

<template>
  <div>
    <!-- Global pinned chrome — shows first, hides on scroll down, reappears on scroll up -->
    <header
      class="chrome"
      :class="{ 'chrome--hidden': toolbarReady && !toolbarVisible }"
    >
      <div class="chrome__bar">
        <NuxtLink to="/" class="chrome__home" aria-label="blue red + purple — home" :aria-current="onHome ? 'page' : undefined">
          /
        </NuxtLink>
        <NuxtLink to="/works" class="chrome__index font-mono" :aria-current="onIndex ? 'page' : undefined">
          Index
        </NuxtLink>
        <NuxtLink to="/system" class="chrome__index font-mono" :aria-current="onSystem ? 'page' : undefined">
          System
        </NuxtLink>
        <!-- Archived: Generator/World/Showcase nav links.
        <NuxtLink to="/generator" class="chrome__generator font-mono" :aria-current="onGenerator ? 'page' : undefined">
          Generator
        </NuxtLink>
        <NuxtLink to="/world" class="chrome__generator font-mono" :aria-current="onWorld ? 'page' : undefined">
          World
        </NuxtLink>
        <NuxtLink to="/showcase" class="chrome__generator font-mono" :aria-current="onShowcase ? 'page' : undefined">
          Showcase
        </NuxtLink>
        -->
        <div class="chrome__group">
          <NuxtLink to="/cms" class="chrome__cms font-mono">
            CMS
          </NuxtLink>
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
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
}

.chrome--hidden {
  opacity: 0;
  transform: translateY(-100%);
  pointer-events: none;
}

.chrome--hidden a,
.chrome--hidden button {
  pointer-events: none;
}

.chrome a,
.chrome button {
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
  flex-wrap: wrap;
  padding: 0.5rem 0.9rem;
  background: color-mix(in oklab, var(--paper) 82%, transparent);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid var(--line);
  border-radius: 0.6rem;
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
  font-size: var(--type-label);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.18em;
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
  padding: 0.5em 0.85em;
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: var(--type-label);
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--paper);
  background: var(--ink);
  border: var(--border-w, 2px) solid var(--ink);
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
  transform: scale(0.97);
}

.chrome__cms {
  font-size: var(--type-label);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
  text-decoration: none;
  white-space: nowrap;
  padding: 0.3em 0.6em;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  transition: background var(--dur) var(--ease), opacity var(--dur) var(--ease);
}

.chrome__cms:hover {
  background: var(--paper-1);
}

.chrome__home[aria-current='page'],
.chrome__index[aria-current='page'] {
  pointer-events: none;
  opacity: 0.45;
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
    opacity: 0.7;
  }
  .chrome__cta:hover {
    transform: scale(1.03);
  }
  .chrome__cta:hover .chrome__arrow {
    transform: translate(0.15em, -0.15em);
  }
}

@media (max-width: 40rem) {
  .chrome__index {
    letter-spacing: 0.12em;
    font-size: 0.7rem;
  }
  .chrome__index:not(:first-child) {
    margin-left: -0.3rem;
  }
  .chrome__group {
    gap: var(--space-2);
  }
  .chrome__cta {
    padding: 0.4em 0.6em;
    letter-spacing: 0.06em;
    font-size: 0.7rem;
  }
  .chrome__bar {
    gap: var(--space-1) var(--space-2);
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
