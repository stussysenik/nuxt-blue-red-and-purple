<script setup lang="ts">
// Site settings panel — manage global settings and legacy content.

const settings = ref<Record<string, string>>({});
const content = ref<Record<string, string>>({});
const loading = ref(false);
const saving = ref(false);
const saved = ref(false);

async function loadAll() {
  loading.value = true;
  try {
    settings.value = await $fetch<Record<string, string>>('/api/settings');
    content.value = await $fetch<Record<string, string>>('/api/content');
  } finally {
    loading.value = false;
  }
}

async function saveSettings() {
  saving.value = true;
  try {
    await $fetch('/api/settings', {
      method: 'PATCH',
      body: settings.value,
    });
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 2000);
  } finally {
    saving.value = false;
  }
}

async function saveContent() {
  saving.value = true;
  try {
    for (const [key, value] of Object.entries(content.value)) {
      await $fetch('/api/content', {
        method: 'POST',
        body: { key, value },
      });
    }
    saved.value = true;
    setTimeout(() => { saved.value = false; }, 2000);
  } finally {
    saving.value = false;
  }
}

onMounted(loadAll);
</script>

<template>
  <div>
    <div class="tab-content__header">
      <h2 class="tab-content__title font-mono ttu">Settings</h2>
      <span v-if="saved" class="saved-badge font-mono">✓ Saved</span>
    </div>

    <div v-if="loading" class="loading font-mono">Loading…</div>

    <div v-else class="settings-sections">
      <!-- Site settings -->
      <section class="settings-section">
        <h3 class="settings-section__title font-mono ttu">Site Settings</h3>
        <div class="settings-grid">
          <div class="field">
            <label class="field__label font-mono">Site Title</label>
            <input v-model="settings.site_title" class="field__input" placeholder="blue red + purple" />
          </div>
          <div class="field">
            <label class="field__label font-mono">Tagline</label>
            <input v-model="settings.site_tagline" class="field__input" placeholder="One-page systems" />
          </div>
          <div class="field">
            <label class="field__label font-mono">Contact Email</label>
            <input v-model="settings.contact_email" class="field__input" placeholder="hi@blueredandpurple.world" />
          </div>
          <div class="field">
            <label class="field__label font-mono">Phone</label>
            <input v-model="settings.contact_phone" class="field__input" placeholder="(404) 422-5517" />
          </div>
          <div class="field field--wide">
            <label class="field__label font-mono">Meta Description</label>
            <textarea v-model="settings.meta_description" class="field__textarea" rows="2" />
          </div>
        </div>
        <button class="settings-save font-mono ttu" :disabled="saving" @click="saveSettings">
          {{ saving ? 'Saving…' : 'Save Settings' }}
        </button>
      </section>

      <!-- Legacy content -->
      <section class="settings-section">
        <h3 class="settings-section__title font-mono ttu">Legacy Content</h3>
        <p class="settings-section__hint font-mono">Old key-value content blocks. Migrate these to builder blocks over time.</p>
        <div class="content-list">
          <div v-for="(value, key) in content" :key="key" class="content-item">
            <div class="content-item__key font-mono">{{ key }}</div>
            <div class="content-item__value">{{ value }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.saved-badge {
  font-size: 0.7rem;
  color: #00a95c;
}
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 0.75rem;
  color: var(--ink-2);
}

.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.settings-section {
  padding: 1.2rem;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
}
.settings-section__title {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  margin: 0 0 1rem;
}
.settings-section__hint {
  font-size: 0.7rem;
  color: var(--ink-3, var(--ink-2));
  margin: 0 0 1rem;
}
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.field--wide {
  grid-column: 1 / -1;
}
.field__label {
  font-size: 0.6rem;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.field__input,
.field__textarea {
  width: 100%;
  padding: 0.4rem 0.6rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.25rem;
  color: var(--ink);
  font-size: 0.8rem;
  font-family: inherit;
}
.field__input:focus,
.field__textarea:focus {
  outline: none;
  border-color: var(--ink);
}
.field__textarea {
  resize: vertical;
}
.settings-save {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.settings-save:disabled {
  opacity: 0.4;
  cursor: default;
}
.settings-save:hover:not(:disabled) {
  opacity: 0.85;
}

/* Legacy content list */
.content-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.content-item {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 0.8rem;
  padding: 0.5rem;
  background: var(--paper-1);
  border-radius: 0.25rem;
  align-items: start;
}
.content-item__key {
  font-size: 0.65rem;
  color: var(--ink-2);
  word-break: break-all;
}
.content-item__value {
  font-size: 0.75rem;
  color: var(--ink-1);
  white-space: pre-line;
}
</style>
