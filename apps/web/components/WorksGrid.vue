<script setup lang="ts">
// Works grid for the public site — fetches works from the CMS.

const props = defineProps<{
  columns?: number;
  category?: string;
  count?: number;
}>();

interface Work {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  image: string;
  summary: string;
  palette: string[];
  mechanic: string;
  is_real: number;
}

const works = ref<Work[]>([]);

async function loadWorks() {
  const query: Record<string, string> = {};
  if (props.category && props.category !== 'all') {
    query.category = props.category;
  }

  works.value = await $fetch<Work[]>('/api/public/works', { query });
}

onMounted(loadWorks);
</script>

<template>
  <div class="works-grid" :style="{ '--cols': props.columns || 3 }">
    <NuxtLink
      v-for="work in works.slice(0, props.count || 6)"
      :key="work.id"
      :to="`/works/${work.slug}`"
      class="works-grid__item"
    >
      <div class="works-grid__image">
        <img v-if="work.image" :src="work.image" :alt="work.title" />
        <div v-else class="works-grid__placeholder">{{ work.title }}</div>
      </div>
      <div class="works-grid__info">
        <span class="works-grid__title">{{ work.title }}</span>
        <span class="works-grid__meta font-mono">{{ work.category }} · {{ work.year }}</span>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.works-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), 1fr);
  gap: 1rem;
}
.works-grid__item {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.15s;
}
.works-grid__item:hover {
  opacity: 0.85;
}
.works-grid__image {
  aspect-ratio: 4 / 3;
  border-radius: 0.3rem;
  overflow: hidden;
  background: var(--paper-1);
  margin-bottom: 0.5rem;
}
.works-grid__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.works-grid__placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  color: var(--ink-2);
  padding: 1rem;
  text-align: center;
}
.works-grid__info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.works-grid__title {
  font-size: 0.85rem;
  color: var(--ink);
}
.works-grid__meta {
  font-size: 0.65rem;
  color: var(--ink-2);
}

@media (max-width: 40rem) {
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
