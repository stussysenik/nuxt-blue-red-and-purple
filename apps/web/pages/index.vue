<script setup lang="ts">
// Homepage: fetches from Storyblok and renders blocks with native visual editing.
// In Storyblok preview mode, editors see "Edit" overlays directly on the live site.
// Each block component receives the full blok object for v-editable support.

const story = await useStoryblok('home', {
  version: import.meta.dev ? 'draft' : 'published',
})

// SEO from Storyblok content — read once from fetched story
useHead({
  title: story.value?.content?.seo?.meta_title || 'blue red + purple',
  meta: [
    { name: 'description', content: story.value?.content?.seo?.meta_description || 'A design agency with one specialization: one-page systems.' },
    { property: 'og:title', content: story.value?.content?.seo?.meta_title || 'blue red + purple' },
    { property: 'og:description', content: story.value?.content?.seo?.meta_description || 'A design agency with one specialization: one-page systems.' },
    { property: 'og:image', content: story.value?.content?.seo?.og_image?.filename || 'https://blueredandpurple.world/og.jpg' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://blueredandpurple.world/' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

useGenerativeCanvas()
</script>

<template>
  <div>
    <!-- Generative background — fixed canvas behind all content, shown only in generative mode -->
    <div class="gen-bg" aria-hidden="true">
      <canvas id="gen-canvas"></canvas>
    </div>

    <!-- Construction grid (pinned decor) -->
    <div class="grid-rig" aria-hidden="true">
      <span class="grid-rig__v grid-rig__v--1"></span>
      <span class="grid-rig__v grid-rig__v--2"></span>
      <span class="grid-rig__v grid-rig__v--3"></span>
      <span class="grid-rig__h grid-rig__h--1"></span>
      <span class="grid-rig__h grid-rig__h--2"></span>
    </div>

    <!-- Storyblok blocks render here with native visual editing -->
    <article class="storyblok-page">
      <DynamicBlock
        v-for="blok in story?.content?.body"
        :key="blok._uid"
        :blok="blok"
      />
    </article>

    <!-- Empty state: no home story yet -->
    <template v-if="!story?.content?.body?.length">
      <section class="hero" data-section="00">
        <h1 class="wordmark" aria-label="blue red + purple">
          <svg viewBox="0 0 461.66 152.16" xmlns="http://www.w3.org/2000/svg"><path d="m22.97 19.35 5.86 9.6 6.28-7.42 6.12 5.43-6.19 7.57 10.28 4.37-2.75 7.47-10.47-4.36-.98 11.35-7.9-.97.88-11.19-9.56 2.05-2.04-7.93 9.47-2.2-5.86-9.6 6.86-4.19z"/><path d="m356.98 50.87h-12.99v13.67h-8.89v-13.67h-12.99v-9.36h12.99v-13.76h8.89v13.76h12.99z"/><path d="m256 87.05c11.06 0 14.43 7.95 14.43 14.75 0 10.05-4.67 16.7-14.01 16.7h-3.16v18.29h-9.55v-49.75h12.3zm-2.74 21.11h2.34c5.43 0 5.22-4.05 5.22-6.15 0-1.74-.41-5.13-4.81-5.13h-2.75z"/><path d="m282.34 87.05v33.48c0 2.1-.21 7.09 3.57 7.09s3.57-4.99 3.57-7.09v-33.48h9.75v36.01c0 8.6-4.74 14.68-13.33 14.68s-13.33-6.15-13.33-14.68v-36.01h9.75z"/><path d="m322.85 115.97 6.66 20.83h-10.24l-5.98-19.02h-1.58v19.02h-9.62v-49.75h12.98c9.69 0 13.74 8.17 13.74 15.33 0 6.44-1.92 11.21-5.98 13.59zm-9.61-8.1c5.43 0 6.04-3.18 6.04-5.5 0-2.1-.62-5.5-5.63-5.5h-1.92v10.99h1.51z"/><path d="m344.5 87.05c11.06 0 14.43 7.95 14.43 14.75 0 10.05-4.67 16.7-14.01 16.7h-3.16v18.29h-9.55v-49.75h12.3zm-2.75 21.11h2.34c5.43 0 5.22-4.05 5.22-6.15 0-1.74-.41-5.13-4.81-5.13h-2.75z"/><path d="m361.05 87.05h9.96v39.27h16.76v10.49h-26.72v-49.75z"/><path d="m390.33 136.8v-49.75h26.72v10.05h-16.76v9.62h14.63v10.05h-14.63v9.91h16.76v10.12z"/><path d="m430.24 136.8h-10.92l18.44-49.75h10.92z"/><path d="m84.4 60.65c0 8.75-4.74 15.4-14.43 15.4h-12.3v-49.74h11.47c9.62 0 13.74 5.86 13.74 14.03 0 7.09-3.78 9.47-3.78 9.47s5.29 2.68 5.29 10.85zm-17.59-24.73v10.27h2.13c4.19 0 4.6-3.33 4.6-5.13s-.41-5.13-4.6-5.13h-2.13zm3.16 19.67h-3.16v10.85h3.16c3.71 0 4.81-3.33 4.81-5.42s-.69-5.42-4.81-5.42z"/><path d="m86.92 26.31h9.96v39.27h16.76v10.49h-26.72z"/><path d="m125.92 26.31v33.48c0 2.1-.21 7.09 3.57 7.09s3.57-4.99 3.57-7.09v-33.48h9.76v36.01c0 8.6-4.74 14.68-13.33 14.68s-13.33-6.15-13.33-14.68v-36.01h9.75z"/><path d="m145.72 76.06v-49.75h26.72v10.05h-16.76v9.62h14.63v10.05h-14.63v9.91h16.76v10.12z"/><path d="m226.85 55.23 6.66 20.83h-10.23l-5.98-19.02h-1.58v19.02h-9.62v-49.75h12.98c9.69 0 13.74 8.17 13.74 15.33 0 6.44-1.92 11.21-5.98 13.59zm-9.62-8.1c5.43 0 6.04-3.18 6.04-5.5 0-2.1-.62-5.5-5.63-5.5h-1.92v10.99h1.51z"/><path d="m235.79 76.06v-49.75h26.72v10.05h-16.76v9.62h14.63v10.05h-14.63v9.91h16.76v10.12z"/><path d="m265.04 26.31h12.3c9.69 0 14.43 6.58 14.43 14.03v21.77c0 7.23-4.74 14.17-14.43 13.96h-12.3zm9.41 39.91h1.99c5.77 0 5.84-4.84 5.84-6.87v-16.27c0-2.1-.07-6.94-5.84-6.94h-1.99z"/></svg>
        </h1>
        <p class="tagline font-mono ttu tracked">Too much blue will never amount to any red</p>
      </section>
      <section class="band band--hint">
        <p class="font-mono">
          No home page found in Storyblok.
          <br />
          Create a "home" story in <a href="https://app.storyblok.com" target="_blank" rel="noopener">Storyblok ↗</a> to get started.
          <br />
          Or <NuxtLink to="/cms">open the CMS bridge →</NuxtLink>
        </p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.gen-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity var(--dur) var(--ease), visibility var(--dur) var(--ease);
}
:global(:root[data-mode='generative']) .gen-bg {
  opacity: 1;
  visibility: visible;
}
#gen-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.gen-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--paper);
  opacity: 0.28;
}

.grid-rig {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.grid-rig__v,
.grid-rig__h {
  position: absolute;
  background-color: var(--line);
  opacity: 0.6;
}
.grid-rig__v {
  top: 0;
  bottom: 0;
  width: 1px;
}
.grid-rig__v--1 { left: var(--rig-v-1); }
.grid-rig__v--2 { left: var(--rig-v-2); }
.grid-rig__v--3 { left: var(--rig-v-3); }
.grid-rig__h {
  left: 0;
  right: 0;
  height: 1px;
}
.grid-rig__h--1 { top: var(--rig-h-1); }
.grid-rig__h--2 { top: var(--rig-h-2); }

.storyblok-page {
  min-height: 100svh;
}

.hero {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: grid;
  align-content: center;
  gap: 1.6rem;
  padding: 6rem var(--edge) 4rem;
}
.wordmark {
  display: block;
  width: min(78vw, 60rem);
  margin: 0;
}
.wordmark :global(svg) {
  display: block;
  width: 100%;
  height: auto;
  fill: var(--ink);
}
.tagline {
  color: var(--ink);
  font-size: var(--type-label);
}

.band {
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 12vh, 9rem) var(--edge);
  border-top: 1px solid var(--line);
}
.band--hint {
  opacity: 0.6;
}
.band--hint a {
  color: var(--ink);
  text-decoration: underline;
}
</style>
