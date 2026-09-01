<script setup lang="ts">
// Works index: fetches works from Sanity, grouped by category.
// Falls back to empty array if Sanity is not configured (build-time safety).

const query = groq`*[_type == "work" && isHidden != true] | order(sortOrder asc, year desc){
  _id, slug, title, category, year, image, palette, isReal, mechanic, summary
}`

const { data: works } = await useSanityQuery<
  Array<{
    _id: string
    slug: { current: string }
    title: string
    category: string
    year: number
    image: any
    palette: string[]
    isReal: boolean
    mechanic: string
    summary: string
  }>
>(query)

// Group by category (matching existing site behavior)
const CATEGORY_ORDER = ['restaurant', 'hotel', 'music', 'books', 'vintage']

const groupedWorks = computed(() => {
  if (!works.value) return []
  const visible = works.value.filter((w) => !w.isHidden)
  return [...new Set(visible.map((w) => w.category))]
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.includes(a) ? CATEGORY_ORDER.indexOf(a) : 99
      const bi = CATEGORY_ORDER.includes(b) ? CATEGORY_ORDER.indexOf(b) : 99
      return ai - bi || a.localeCompare(b)
    })
    .map((category) => ({
      category,
      items: visible.filter((w) => w.category === category),
    }))
})

const hoveredImage = ref<string | null>(null)

// Build image URL from Sanity asset reference
function getImageUrl(image: any): string | null {
  if (!image?.asset?._ref) return null
  // Sanity image ref format: image-<assetId>-<dimensions>-<format>
  const ref = image.asset._ref
  const [, assetId, dimensions, format] = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/) || []
  if (!assetId) return null
  const projectId = useSanityConfig().projectId
  return `https://cdn.sanity.io/images/${projectId}/production/${assetId}-${dimensions}.${format}`
}

function paintImage(image: any) {
  hoveredImage.value = getImageUrl(image)
}

useHead({ title: 'Project index — *blue red + purple/' })
</script>

<template>
  <main class="index">
    <span
      class="index__ghost"
      :style="{ backgroundImage: hoveredImage ? `url('${hoveredImage}')` : '' }"
      aria-hidden="true"
    />

    <h1 class="visually-hidden">Project index</h1>

    <section v-for="group in groupedWorks" :key="group.category" class="group">
      <h2 class="group__label font-mono ttu tracked">{{ group.category }} store</h2>
      <ul class="index__list">
        <li v-for="w in group.items" :key="w._id">
          <NuxtLink
            class="row"
            :to="`/works/${w.slug.current}`"
            @pointerenter="paintImage(w.image)"
            @focus="paintImage(w.image)"
          >
            <span class="row__dot" aria-hidden="true" />
            <span class="row__title">{{ w.title }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.index {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: grid;
  align-content: start;
  row-gap: clamp(2.4rem, 6vh, 4rem);
  color: var(--ink);
  padding: clamp(5.5rem, 13vh, 8rem) var(--edge) clamp(4rem, 9vh, 5.5rem);
}

.group__label {
  text-align: center;
  font-size: var(--type-label);
  font-weight: 500;
  color: var(--ink-2);
  margin: 0 0 0.7rem;
}

.index__ghost {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-position: center;
  background-size: cover;
  filter: blur(56px) saturate(1.1);
  opacity: 0.22;
  transform: scale(1.15);
  transition: opacity 0.5s var(--ease);
  pointer-events: none;
}

.index__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.row {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.1rem 0.6rem;
  text-decoration: none;
  color: var(--ink-2);
  transition: color 0.25s var(--ease);
}

.row:hover,
.row:focus-visible {
  color: var(--ink);
  outline: none;
}

.row__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background-color: currentColor;
  flex: none;
  opacity: 0;
  transform: scale(0.3);
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}

.row:hover .row__dot,
.row:focus-visible .row__dot {
  opacity: 1;
  transform: scale(1);
}

.row__title {
  font-family: var(--font-display);
  font-weight: var(--wght-display);
  font-size: clamp(1.5rem, 5vw, 4rem);
  line-height: 1.1;
  letter-spacing: var(--tracking-display);
  color: inherit;
}

.index:has(.row:hover) .index__ghost,
.index:has(.row:focus-visible) .index__ghost {
  opacity: 0.34;
  filter: blur(40px) saturate(1.18);
  transform: scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
  .index__ghost,
  .row,
  .row__dot {
    transition: none;
  }
}
</style>
