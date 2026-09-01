<script setup lang="ts">
// CMS Bridge Page — gateway to Storyblok editing
// This page detects if you're in Storyblok preview mode and redirects
// to the visual editor, or shows a dashboard with links to Storyblok.

const storyblokUrl = 'https://app.storyblok.com/#/me/spaces/294922716989879/stories'

// Check if we're in Storyblok preview (has _storyblok query param)
const route = useRoute()
const isPreview = computed(() => !!route.query._storyblok)

// If in preview mode, redirect to home with visual editing active
if (isPreview.value) {
  await navigateTo('/')
}

// Check for editor success message
const showSuccess = computed(() => route.query.edited === 'true')
</script>

<template>
  <main class="cms">
    <div class="cms__card">
      <h1 class="cms__title font-mono ttu tracked">Content Manager</h1>

      <div v-if="showSuccess" class="cms__success">
        ✓ Changes published successfully.
      </div>

      <p class="cms__lead">
        Edit your site content in Storyblok. All changes are versioned,
        previewable, and reversible.
      </p>

      <div class="cms__actions">
        <a
          :href="storyblokUrl"
          target="_blank"
          rel="noopener"
          class="cms__btn cms__btn--primary"
        >
          Open Storyblok ↗
        </a>
        <NuxtLink to="/?visual_editing=true" class="cms__btn">
          Visual Editor
        </NuxtLink>
      </div>

      <div class="cms__steps">
        <h2 class="cms__steps-title font-mono ttu tracked">Quick Start</h2>
        <ol class="cms__list">
          <li>
            <strong>1. Open Storyblok</strong> — Click the button above to open
            your Storyblok space.
          </li>
          <li>
            <strong>2. Create a "home" story</strong> — Click "New Story", name it
            "home", set the slug to "home".
          </li>
          <li>
            <strong>3. Add blocks</strong> — Inside the home story, add blocks
            (hero, about, contacts) and fill in your content.
          </li>
          <li>
            <strong>4. Publish</strong> — Hit "Publish" and your changes go live
            instantly.
          </li>
        </ol>
      </div>

      <div class="cms__features">
        <h2 class="cms__steps-title font-mono ttu tracked">What You Get</h2>
        <ul class="cms__feature-list">
          <li>✓ Version history — every save is tracked</li>
          <li>✓ Visual editing — click and type on the live site</li>
          <li>✓ Preview before publish — see changes before they go live</li>
          <li>✓ One-click rollback — restore any previous version</li>
          <li>✓ SEO fields — edit meta titles, descriptions, OG images</li>
          <li>✓ Audit trail — who changed what, when</li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style scoped>
.cms {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: var(--chrome-band) var(--edge) 4rem;
}

.cms__card {
  max-width: 40rem;
  width: 100%;
  padding: 3rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 0.6rem;
}

.cms__title {
  font-size: var(--type-display);
  margin: 0 0 1.5rem;
  color: var(--ink);
}

.cms__lead {
  font-size: var(--type-body);
  line-height: 1.55;
  color: var(--ink-1);
  margin: 0 0 2rem;
}

.cms__success {
  background: #00A95C22;
  border: 1px solid #00A95C;
  color: #00A95C;
  padding: 0.8rem 1rem;
  border-radius: 0.4rem;
  margin-bottom: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.cms__actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.cms__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.7em 1.2em;
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  color: var(--ink);
  background: var(--paper-1);
  border: 1px solid var(--line);
  text-decoration: none;
  border-radius: 0.4rem;
  transition: transform 0.15s, box-shadow 0.15s;
}

.cms__btn--primary {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.cms__btn:hover {
  transform: scale(1.02);
}

.cms__steps {
  margin-bottom: 2rem;
}

.cms__steps-title {
  font-size: 0.85rem;
  color: var(--ink-2);
  margin: 0 0 1rem;
}

.cms__list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.8rem;
}

.cms__list li {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ink-1);
}

.cms__list strong {
  color: var(--ink);
}

.cms__feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.cms__feature-list li {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--ink-1);
}
</style>
