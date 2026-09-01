<script setup lang="ts">
// Storyblok integration — using useStoryblok from @storyblok/vue
const story = await useStoryblok("home", { version: "draft" })

const body = story.value?.content?.body || []
</script>

<template>
  <div class="storyblok-demo">
    <h2 class="font-mono ttu tracked">Storyblok CMS Demo</h2>

    <div v-if="!story" class="no-content font-mono">
      <p>Loading or no story found...</p>
    </div>

    <template v-else>
      <div class="story-meta font-mono">
        <p>Story: {{ story.name }}</p>
        <p>Slug: {{ story.slug }}</p>
        <p>Blocks: {{ body.length }}</p>
      </div>

      <article class="storyblok-page">
        <DynamicBlock
          v-for="blok in body"
          :key="blok._uid"
          :blok="blok"
        />
      </article>
    </template>
  </div>
</template>

<style scoped>
.storyblok-demo {
  padding: 6rem var(--edge) 4rem;
  max-width: 80rem;
}
h2 {
  font-size: var(--type-display);
  margin-bottom: 2rem;
}
.story-meta {
  background: var(--paper-1);
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.8rem;
  line-height: 1.6;
}
.no-content {
  padding: 2rem 0;
}
</style>
