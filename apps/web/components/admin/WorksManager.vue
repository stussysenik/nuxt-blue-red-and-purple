<script setup lang="ts">
// Works/portfolio manager — CRUD for works from the CMS.

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
  source: string;
  is_real: number;
  is_hidden: number;
  sort_order: number;
}

const works = ref<Work[]>([]);
const loading = ref(false);
const editing = ref<Work | null>(null);
const showForm = ref(false);

const blankWork = (): Work => ({
  id: '',
  slug: '',
  title: '',
  category: 'music',
  year: 2024,
  image: '',
  summary: '',
  palette: [],
  mechanic: '',
  source: '',
  is_real: 0,
  is_hidden: 0,
  sort_order: 0,
});

async function loadWorks() {
  loading.value = true;
  try {
    works.value = await $fetch<Work[]>('/api/works');
  } finally {
    loading.value = false;
  }
}

function startNew() {
  editing.value = blankWork();
  showForm.value = true;
}

function startEdit(work: Work) {
  editing.value = { ...work, palette: [...work.palette] };
  showForm.value = true;
}

async function saveWork() {
  if (!editing.value) return;
  const w = editing.value;

  if (w.id) {
    await $fetch(`/api/works/${w.id}`, {
      method: 'PATCH',
      body: w,
    });
  } else {
    await $fetch('/api/works', {
      method: 'POST',
      body: w,
    });
  }

  showForm.value = false;
  editing.value = null;
  await loadWorks();
}

async function deleteWork(id: string) {
  if (!confirm('Delete this work?')) return;
  await $fetch(`/api/works/${id}`, { method: 'DELETE' });
  await loadWorks();
}

function addPaletteColor() {
  if (!editing.value) return;
  editing.value.palette.push('#000000');
}

function removePaletteColor(index: number) {
  if (!editing.value) return;
  editing.value.palette.splice(index, 1);
}

onMounted(loadWorks);
</script>

<template>
  <div>
    <div class="tab-content__header">
      <h2 class="tab-content__title font-mono ttu">Works</h2>
      <button class="tab-content__add font-mono ttu" @click="startNew">+ New Work</button>
    </div>

    <div v-if="loading" class="loading font-mono">Loading…</div>

    <!-- Works list -->
    <div v-else class="works-list">
      <div v-for="work in works" :key="work.id" class="work-item">
        <div class="work-item__image">
          <img v-if="work.image" :src="work.image" :alt="work.title" />
          <div v-else class="work-item__no-image">No image</div>
        </div>
        <div class="work-item__info">
          <span class="work-item__title">{{ work.title }}</span>
          <span class="work-item__meta font-mono">{{ work.category }} · {{ work.year }}</span>
          <span v-if="work.is_real" class="work-item__badge font-mono">REAL</span>
          <span v-if="work.is_hidden" class="work-item__badge work-item__badge--hidden font-mono">HIDDEN</span>
        </div>
        <div class="work-item__actions">
          <button class="work-item__edit" @click="startEdit(work)">Edit</button>
          <button class="work-item__delete" @click="deleteWork(work.id)">✕</button>
        </div>
      </div>
    </div>

    <!-- Edit form modal -->
    <div v-if="showForm && editing" class="modal-overlay" @click.self="showForm = false">
      <div class="modal modal--wide">
        <h3 class="modal__title font-mono ttu">{{ editing.id ? 'Edit Work' : 'New Work' }}</h3>

        <div class="form-grid">
          <div class="field">
            <label class="field__label font-mono">Title</label>
            <input v-model="editing.title" class="field__input" />
          </div>
          <div class="field">
            <label class="field__label font-mono">Slug</label>
            <input v-model="editing.slug" class="field__input" />
          </div>
          <div class="field">
            <label class="field__label font-mono">Category</label>
            <select v-model="editing.category" class="field__select">
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hotel</option>
              <option value="music">Music</option>
              <option value="books">Books</option>
              <option value="vintage">Vintage</option>
            </select>
          </div>
          <div class="field">
            <label class="field__label font-mono">Year</label>
            <input v-model.number="editing.year" type="number" class="field__input" />
          </div>
          <div class="field field--wide">
            <label class="field__label font-mono">Image URL</label>
            <input v-model="editing.image" class="field__input" placeholder="/works/example.jpg" />
          </div>
          <div class="field field--wide">
            <label class="field__label font-mono">Summary</label>
            <textarea v-model="editing.summary" class="field__textarea" rows="3" />
          </div>
          <div class="field field--wide">
            <label class="field__label font-mono">Mechanic</label>
            <input v-model="editing.mechanic" class="field__input" />
          </div>
          <div class="field field--wide">
            <label class="field__label font-mono">Source (attribution)</label>
            <input v-model="editing.source" class="field__input" />
          </div>
          <div class="field field--wide">
            <label class="field__label font-mono">Palette</label>
            <div class="palette-editor">
              <div v-for="(color, i) in editing.palette" :key="i" class="palette-item">
                <input type="color" v-model="editing.palette[i]" class="palette-item__color" />
                <button class="palette-item__remove" @click="removePaletteColor(i)">✕</button>
              </div>
              <button class="palette-add" @click="addPaletteColor">+</button>
            </div>
          </div>
          <div class="field field--checkbox">
            <label class="checkbox-label">
              <input v-model.number="editing.is_real" type="checkbox" :true-value="1" :false-value="0" />
              <span class="font-mono">Real project</span>
            </label>
          </div>
          <div class="field field--checkbox">
            <label class="checkbox-label">
              <input v-model.number="editing.is_hidden" type="checkbox" :true-value="1" :false-value="0" />
              <span class="font-mono">Hidden</span>
            </label>
          </div>
        </div>

        <div class="modal__actions">
          <button class="modal__cancel font-mono" @click="showForm = false">Cancel</button>
          <button class="modal__confirm font-mono ttu" @click="saveWork">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 0.75rem;
  color: var(--ink-2);
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.work-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  background: var(--paper);
}
.work-item__image {
  width: 3rem;
  height: 3rem;
  border-radius: 0.25rem;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--paper-1);
}
.work-item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.work-item__no-image {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 0.55rem;
  color: var(--ink-3, var(--ink-2));
}
.work-item__info {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.8rem;
}
.work-item__title {
  font-size: 0.85rem;
  color: var(--ink);
}
.work-item__meta {
  font-size: 0.65rem;
  color: var(--ink-2);
}
.work-item__badge {
  font-size: 0.5rem;
  letter-spacing: 0.08em;
  padding: 0.1rem 0.3rem;
  background: var(--paper-1);
  border-radius: 0.15rem;
  color: var(--ink-2);
}
.work-item__badge--hidden {
  background: #e67e22;
  color: white;
}
.work-item__actions {
  display: flex;
  gap: 0.3rem;
}
.work-item__edit {
  padding: 0.3rem 0.6rem;
  font-size: 0.65rem;
  color: var(--ink);
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.2rem;
  cursor: pointer;
}
.work-item__edit:hover {
  border-color: var(--ink);
}
.work-item__delete {
  width: 1.4rem;
  height: 1.4rem;
  display: grid;
  place-items: center;
  font-size: 0.65rem;
  background: none;
  border: 1px solid var(--line);
  border-radius: 0.2rem;
  cursor: pointer;
  color: var(--ink-2);
}
.work-item__delete:hover {
  background: #c0392b;
  color: white;
  border-color: #c0392b;
}

/* Modal */
.modal--wide {
  width: min(90vw, 36rem);
  max-height: 85vh;
  overflow-y: auto;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.field--wide {
  grid-column: 1 / -1;
}
.field--checkbox {
  flex-direction: row;
  align-items: center;
}
.field__label {
  font-size: 0.6rem;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.field__input,
.field__select,
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
.field__select:focus,
.field__textarea:focus {
  outline: none;
  border-color: var(--ink);
}
.field__textarea {
  resize: vertical;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}
.checkbox-label input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--ink);
}

/* Palette editor */
.palette-editor {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  align-items: center;
}
.palette-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.palette-item__color {
  width: 1.8rem;
  height: 1.8rem;
  border: 1px solid var(--line);
  border-radius: 0.2rem;
  cursor: pointer;
  padding: 0;
}
.palette-item__remove {
  width: 1rem;
  height: 1rem;
  font-size: 0.55rem;
  background: none;
  border: 1px solid var(--line);
  border-radius: 50%;
  cursor: pointer;
  color: var(--ink-2);
}
.palette-add {
  width: 1.8rem;
  height: 1.8rem;
  display: grid;
  place-items: center;
  font-size: 1rem;
  background: var(--paper-1);
  border: 1px dashed var(--line);
  border-radius: 0.2rem;
  cursor: pointer;
  color: var(--ink-2);
}
.palette-add:hover {
  border-color: var(--ink);
  color: var(--ink);
}
</style>
