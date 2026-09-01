<script setup lang="ts">
// Renders a single builder block for the public site.
// No auth required — this is the live output of the CMS.

defineProps<{
  block: {
    id: string;
    type: string;
    content: Record<string, any>;
    styles: Record<string, any>;
  };
}>();
</script>

<template>
  <div class="block-render" :data-block-type="block.type">
    <!-- Hero -->
    <template v-if="block.type === 'hero'">
      <section class="block-hero">
        <h2 class="block-hero__tagline">{{ block.content.tagline }}</h2>
      </section>
    </template>

    <!-- Text -->
    <template v-else-if="block.type === 'text'">
      <section class="block-text" :style="{ textAlign: block.content.align || 'left' }">
        <p class="block-text__content">{{ block.content.text }}</p>
      </section>
    </template>

    <!-- Image -->
    <template v-else-if="block.type === 'image'">
      <section class="block-image">
        <img
          v-if="block.content.url"
          :src="block.content.url"
          :alt="block.content.alt || ''"
          class="block-image__img"
          :style="{ objectFit: block.content.fit || 'cover' }"
        />
        <p v-if="block.content.caption" class="block-image__caption font-mono">
          {{ block.content.caption }}
        </p>
      </section>
    </template>

    <!-- Works Grid -->
    <template v-else-if="block.type === 'works-grid'">
      <section class="block-works">
        <WorksGrid
          :columns="block.content.columns || 3"
          :category="block.content.category || 'all'"
          :count="block.content.show_count || 6"
        />
      </section>
    </template>

    <!-- Contact -->
    <template v-else-if="block.type === 'contact'">
      <section class="block-contact">
        <a v-if="block.content.email" :href="`mailto:${block.content.email}`" class="block-contact__email">
          {{ block.content.email }}
        </a>
        <a v-if="block.content.phone" :href="`tel:${block.content.phone}`" class="block-contact__phone font-mono">
          {{ block.content.phone }}
        </a>
      </section>
    </template>

    <!-- Spacer -->
    <template v-else-if="block.type === 'spacer'">
      <div class="block-spacer" :style="{ height: block.content.height || '4rem' }"></div>
    </template>

    <!-- Divider -->
    <template v-else-if="block.type === 'divider'">
      <hr class="block-divider" />
    </template>

    <!-- Video -->
    <template v-else-if="block.type === 'video'">
      <section class="block-video">
        <div class="block-video__wrapper" :style="{ aspectRatio: block.content.aspect_ratio || '16/9' }">
          <iframe
            v-if="block.content.url"
            :src="getEmbedUrl(block.content.url)"
            frameborder="0"
            allowfullscreen
            class="block-video__iframe"
          ></iframe>
        </div>
      </section>
    </template>

    <!-- Gallery -->
    <template v-else-if="block.type === 'gallery'">
      <section class="block-gallery" :style="{ '--columns': block.content.columns || 3 }">
        <div
          v-for="(img, i) in (block.content.images || [])"
          :key="i"
          class="block-gallery__item"
        >
          <img :src="img.url" :alt="img.alt || ''" class="block-gallery__img" />
        </div>
      </section>
    </template>

    <!-- Quote -->
    <template v-else-if="block.type === 'quote'">
      <blockquote class="block-quote">
        <p class="block-quote__text">{{ block.content.text }}</p>
        <footer v-if="block.content.author" class="block-quote__footer">
          <span class="block-quote__author">{{ block.content.author }}</span>
          <span v-if="block.content.role" class="block-quote__role font-mono">{{ block.content.role }}</span>
        </footer>
      </blockquote>
    </template>
  </div>
</template>

<script lang="ts">
// Extract embed URL from YouTube/Vimeo links
function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}
</script>

<style scoped>
.block-render {
  position: relative;
  z-index: 1;
}

.block-hero {
  padding: 4rem 0;
  text-align: center;
}
.block-hero__tagline {
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 600;
  color: var(--ink);
  margin: 0;
  line-height: 1.2;
}

.block-text {
  padding: 1rem 0;
}
.block-text__content {
  font-size: var(--type-body);
  line-height: 1.6;
  color: var(--ink-1);
  margin: 0;
  max-width: 40rem;
}

.block-image {
  padding: 1rem 0;
}
.block-image__img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0.3rem;
}
.block-image__caption {
  font-size: 0.7rem;
  color: var(--ink-2);
  margin-top: 0.5rem;
  text-align: center;
}

.block-works {
  padding: 2rem 0;
}

.block-contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 2rem 0;
}
.block-contact__email,
.block-contact__phone {
  font-size: 1.2rem;
  color: var(--ink);
  text-decoration: none;
  transition: color 0.15s;
}
.block-contact__email:hover,
.block-contact__phone:hover {
  color: var(--ink-2);
}

.block-spacer {
  display: block;
}

.block-divider {
  border: none;
  border-top: 1px solid var(--line);
  margin: 1rem 0;
}

.block-video {
  padding: 1rem 0;
}
.block-video__wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.3rem;
}
.block-video__iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.block-gallery {
  display: grid;
  grid-template-columns: repeat(var(--columns, 3), 1fr);
  gap: 0.5rem;
  padding: 1rem 0;
}
.block-gallery__item {
  overflow: hidden;
  border-radius: 0.25rem;
}
.block-gallery__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.block-quote {
  padding: 2rem 1rem;
  margin: 1rem 0;
  border-left: 2px solid var(--ink);
}
.block-quote__text {
  font-size: 1.2rem;
  font-style: italic;
  color: var(--ink);
  margin: 0 0 0.8rem;
  line-height: 1.5;
}
.block-quote__footer {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.block-quote__author {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ink-1);
}
.block-quote__role {
  font-size: 0.7rem;
  color: var(--ink-2);
}
</style>
