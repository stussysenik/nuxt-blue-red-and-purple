<script setup lang="ts">
// Media library manager — upload, browse, delete media files.

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text: string;
  created_at: number;
}

const media = ref<MediaItem[]>([]);
const loading = ref(false);
const uploading = ref(false);
const dragOver = ref(false);
const selectedMedia = ref<MediaItem | null>(null);

async function loadMedia() {
  loading.value = true;
  try {
    const data = await $fetch<{ items: MediaItem[] }>('/api/media', {
      query: { limit: 50 },
    });
    media.value = data.items;
  } finally {
    loading.value = false;
  }
}

async function handleUpload(files: FileList | null) {
  if (!files || files.length === 0) return;
  uploading.value = true;

  try {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      await $fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
    }
    await loadMedia();
  } catch (e: any) {
    alert(e.data?.statusMessage || 'Upload failed');
  } finally {
    uploading.value = false;
  }
}

async function handleDelete(item: MediaItem) {
  if (!confirm(`Delete "${item.original_name}"?`)) return;
  await $fetch(`/api/media/${item.id}`, { method: 'DELETE' });
  if (selectedMedia.value?.id === item.id) selectedMedia.value = null;
  await loadMedia();
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  dragOver.value = false;
  handleUpload(e.dataTransfer?.files || null);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

onMounted(loadMedia);
</script>

<template>
  <div>
    <div class="tab-content__header">
      <h2 class="tab-content__title font-mono ttu">Media Library</h2>
      <span class="media-count font-mono">{{ media.length }} files</span>
    </div>

    <!-- Upload zone -->
    <div
      class="upload-zone"
      :class="{ 'upload-zone--over': dragOver, 'upload-zone--loading': uploading }"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop="handleDrop"
    >
      <p class="upload-zone__text font-mono">
        {{ uploading ? 'Uploading…' : 'Drop files here or click to upload' }}
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        class="upload-zone__input"
        @change="handleUpload(($event.target as HTMLInputElement).files)"
      />
    </div>

    <!-- Media grid -->
    <div v-if="loading" class="media-loading font-mono">Loading…</div>
    <div v-else class="media-grid">
      <div
        v-for="item in media"
        :key="item.id"
        class="media-item"
        :class="{ 'media-item--selected': selectedMedia?.id === item.id }"
        @click="selectedMedia = item"
      >
        <img :src="item.url" :alt="item.alt_text" class="media-item__thumb" />
        <div class="media-item__info">
          <span class="media-item__name font-mono">{{ item.original_name }}</span>
          <span class="media-item__size font-mono">{{ formatSize(item.size) }}</span>
        </div>
        <button class="media-item__delete" @click.stop="handleDelete(item)">✕</button>
      </div>
    </div>

    <!-- Selected media detail -->
    <div v-if="selectedMedia" class="media-detail">
      <div class="media-detail__preview">
        <img :src="selectedMedia.url" :alt="selectedMedia.alt_text" />
      </div>
      <div class="media-detail__fields">
        <div class="field">
          <label class="field__label font-mono">URL</label>
          <input :value="selectedMedia.url" class="field__input" readonly />
        </div>
        <div class="field">
          <label class="field__label font-mono">Alt text</label>
          <input v-model="selectedMedia.alt_text" class="field__input" />
        </div>
        <div class="field">
          <label class="field__label font-mono">Dimensions</label>
          <span class="field__value font-mono">{{ selectedMedia.mime_type }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.media-count {
  font-size: 0.7rem;
  color: var(--ink-3, var(--ink-2));
}

.upload-zone {
  position: relative;
  border: 2px dashed var(--line);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: border-color 0.15s, background 0.15s;
  cursor: pointer;
}
.upload-zone--over {
  border-color: var(--ink);
  background: var(--paper-1);
}
.upload-zone--loading {
  opacity: 0.6;
}
.upload-zone__text {
  font-size: 0.75rem;
  color: var(--ink-2);
  margin: 0;
}
.upload-zone__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.media-loading {
  text-align: center;
  padding: 2rem;
  font-size: 0.75rem;
  color: var(--ink-2);
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: 0.5rem;
}
.media-item {
  position: relative;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
}
.media-item:hover {
  border-color: var(--ink-2);
}
.media-item--selected {
  border-color: var(--ink);
  box-shadow: 0 0 0 1px var(--ink);
}
.media-item__thumb {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}
.media-item__info {
  padding: 0.3rem 0.4rem;
  display: flex;
  flex-direction: column;
}
.media-item__name {
  font-size: 0.6rem;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.media-item__size {
  font-size: 0.55rem;
  color: var(--ink-3, var(--ink-2));
}
.media-item__delete {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
  width: 1.2rem;
  height: 1.2rem;
  display: grid;
  place-items: center;
  font-size: 0.6rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}
.media-item:hover .media-item__delete {
  opacity: 1;
}
.media-item__delete:hover {
  background: #c0392b;
  color: white;
  border-color: #c0392b;
}

.media-detail {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 1rem;
}
.media-detail__preview img {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
}
.media-detail__fields {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.field__label {
  font-size: 0.6rem;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.field__input {
  width: 100%;
  padding: 0.4rem 0.6rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.25rem;
  color: var(--ink);
  font-size: 0.75rem;
  font-family: inherit;
}
.field__input:focus {
  outline: none;
  border-color: var(--ink);
}
.field__value {
  font-size: 0.75rem;
  color: var(--ink-1);
}
</style>
