<script setup lang="ts">
definePageMeta({ ssr: false });

useHead({
  title: 'Admin — *blue red + purple/',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

const {
  currentPage,
  blocks,
  selectedBlockId,
  selectedBlock,
  pages,
  revisions,
  isSaving,
  isDirty,
  canUndo,
  canRedo,
  loadPage,
  loadPages,
  addBlock,
  removeBlock,
  duplicateBlock,
  moveBlock,
  updateBlockContent,
  saveAll,
  restoreRevision,
  createPage,
  deletePage,
  undo,
  redo,
} = useBuilder();

// ── Auth state ─────────────────────────────────────────────────────────
const auth = ref<{ authenticated: boolean; email: string }>({
  authenticated: false,
  email: '',
});
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');
const loginLoading = ref(false);

// ── UI state ───────────────────────────────────────────────────────────
const activeTab = ref<'builder' | 'pages' | 'media' | 'works' | 'settings'>('builder');
const showBlockLibrary = ref(false);
const showHistory = ref(false);
const showPageModal = ref(false);
const draggingIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// ── Page modal ──────────────────────────────────────────────────────────
const newPageSlug = ref('');
const newPageTitle = ref('');

// ── Auth methods ──────────────────────────────────────────────────────────
async function checkSession() {
  try {
    const data = await $fetch<{ authenticated: boolean; email: string }>('/api/auth/session');
    auth.value = data;
  } catch {
    auth.value = { authenticated: false, email: '' };
  }
}

async function login() {
  loginError.value = '';
  loginLoading.value = true;
  try {
    const data = await $fetch<{ success: boolean; email: string }>('/api/auth/login', {
      method: 'POST',
      body: { email: loginEmail.value, password: loginPassword.value },
    });
    auth.value = { authenticated: true, email: data.email };
    loginPassword.value = '';
    await loadPages();
    if (pages.value.length > 0) {
      await loadPage(pages.value[0].id);
    }
  } catch (e: any) {
    loginError.value = e.data?.statusMessage || 'Login failed';
  } finally {
    loginLoading.value = false;
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' });
  auth.value = { authenticated: false, email: '' };
}

// ── Page methods ──────────────────────────────────────────────────────────
async function handleCreatePage() {
  if (!newPageSlug.value || !newPageTitle.value) return;
  const page = await createPage({
    slug: newPageSlug.value,
    title: newPageTitle.value,
  });
  newPageSlug.value = '';
  newPageTitle.value = '';
  showPageModal.value = false;
  await loadPage(page.id);
}

async function handleDeletePage(pageId: string) {
  if (!confirm('Delete this page? This cannot be undone.')) return;
  await deletePage(pageId);
  if (currentPage.value?.id === pageId && pages.value.length > 0) {
    await loadPage(pages.value[0].id);
  }
}

// ── Drag and drop ─────────────────────────────────────────────────────────
function onDragStart(index: number) {
  draggingIndex.value = index;
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault();
  dragOverIndex.value = index;
}

function onDragLeave() {
  dragOverIndex.value = null;
}

function onDrop(index: number) {
  if (draggingIndex.value !== null && draggingIndex.value !== index) {
    moveBlock(draggingIndex.value, index);
  }
  draggingIndex.value = null;
  dragOverIndex.value = null;
}

function onDragEnd() {
  draggingIndex.value = null;
  dragOverIndex.value = null;
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────
function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    e.preventDefault();
    if (e.shiftKey) redo();
    else undo();
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault();
    saveAll();
  }
  if (e.key === 'Escape') {
    selectedBlockId.value = null;
    showBlockLibrary.value = false;
    showHistory.value = false;
  }
}

// ── Init ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  await checkSession();
  if (auth.value.authenticated) {
    await loadPages();
    if (pages.value.length > 0) {
      await loadPage(pages.value[0].id);
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div>
    <!-- ── Login screen ─────────────────────────────────────────────────── -->
    <main v-if="!auth.authenticated" class="login">
      <div class="login__card">
        <div class="login__mark" aria-hidden="true">/</div>
        <h1 class="login__title font-mono ttu tracked">Admin</h1>
        <p class="login__sub">Sign in to manage your site.</p>

        <form class="login__form" @submit.prevent="login">
          <div class="login__field">
            <label for="login-email" class="login__label font-mono">Email</label>
            <input
              id="login-email"
              v-model="loginEmail"
              type="email"
              autocomplete="email"
              required
              class="login__input"
              placeholder="you@blueredandpurple.world"
            />
          </div>
          <div class="login__field">
            <label for="login-password" class="login__label font-mono">Password</label>
            <input
              id="login-password"
              v-model="loginPassword"
              type="password"
              autocomplete="current-password"
              required
              class="login__input"
              placeholder="••••••••"
            />
          </div>
          <p v-if="loginError" class="login__error font-mono">{{ loginError }}</p>
          <button type="submit" class="login__btn font-mono ttu" :disabled="loginLoading">
            {{ loginLoading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <p class="login__hint font-mono">
          First time? Set up your admin account via the API:<br />
          <code>POST /api/auth/setup</code>
        </p>
      </div>
    </main>

    <!-- ── Admin panel ──────────────────────────────────────────────────── -->
    <main v-else class="admin">
      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar__brand">
          <span class="topbar__mark">/</span>
          <span class="topbar__title font-mono ttu">BRP CMS</span>
        </div>

        <nav class="topbar__nav">
          <button
            v-for="tab in (['builder', 'pages', 'media', 'works', 'settings'] as const)"
            :key="tab"
            class="topbar__tab font-mono ttu"
            :class="{ 'topbar__tab--active': activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </nav>

        <div class="topbar__actions">
          <span v-if="isDirty" class="topbar__dirty font-mono">● Unsaved</span>
          <span class="topbar__email font-mono">{{ auth.email }}</span>
          <button class="topbar__logout font-mono ttu" @click="logout">Sign out</button>
        </div>
      </header>

      <!-- ── Builder tab ───────────────────────────────────────────────── -->
      <div v-if="activeTab === 'builder'" class="builder">
        <!-- Left sidebar: block library -->
        <aside class="builder__sidebar" :class="{ 'builder__sidebar--open': showBlockLibrary }">
          <div class="sidebar__header">
            <h2 class="sidebar__title font-mono ttu">Blocks</h2>
            <button class="sidebar__close" @click="showBlockLibrary = false">×</button>
          </div>
          <div class="sidebar__blocks">
            <button
              v-for="bt in [
                { type: 'hero', label: 'Hero', icon: '◈' },
                { type: 'text', label: 'Text', icon: '¶' },
                { type: 'image', label: 'Image', icon: '▣' },
                { type: 'works-grid', label: 'Works Grid', icon: '⊞' },
                { type: 'contact', label: 'Contact', icon: '✉' },
                { type: 'spacer', label: 'Spacer', icon: '│' },
                { type: 'divider', label: 'Divider', icon: '―' },
                { type: 'video', label: 'Video', icon: '▶' },
                { type: 'gallery', label: 'Gallery', icon: '⊟' },
                { type: 'quote', label: 'Quote', icon: '❝' },
              ]"
              :key="bt.type"
              class="block-btn"
              @click="addBlock(bt.type); showBlockLibrary = false"
            >
              <span class="block-btn__icon">{{ bt.icon }}</span>
              <span class="block-btn__label font-mono">{{ bt.label }}</span>
            </button>
          </div>
        </aside>

        <!-- Canvas area -->
        <div class="builder__canvas-wrapper">
          <!-- Canvas toolbar -->
          <div class="canvas__toolbar">
            <button class="toolbar__btn font-mono" @click="showBlockLibrary = !showBlockLibrary">
              + Add Block
            </button>
            <div class="toolbar__divider" />
            <button class="toolbar__btn font-mono" :disabled="!canUndo" @click="undo">↶ Undo</button>
            <button class="toolbar__btn font-mono" :disabled="!canRedo" @click="redo">↷ Redo</button>
            <div class="toolbar__divider" />
            <button class="toolbar__btn font-mono" @click="showHistory = !showHistory">
              🕑 History
            </button>
            <div class="toolbar__spacer" />
            <span v-if="currentPage" class="toolbar__page font-mono">
              {{ currentPage.title }} <span class="toolbar__slug">{{ currentPage.slug }}</span>
            </span>
            <button class="toolbar__save font-mono ttu" :disabled="isSaving || !isDirty" @click="saveAll">
              {{ isSaving ? 'Saving…' : 'Save' }}
            </button>
          </div>

          <!-- Canvas -->
          <div class="canvas">
            <div v-if="blocks.length === 0" class="canvas__empty">
              <p class="canvas__empty-text font-mono">No blocks yet.</p>
              <p class="canvas__empty-sub font-mono">Click "Add Block" to get started.</p>
            </div>

            <div
              v-for="(block, index) in blocks"
              v-else
              :key="block.id"
              class="block"
              :class="{
                'block--selected': selectedBlockId === block.id,
                'block--dragging': draggingIndex === index,
                'block--drag-over': dragOverIndex === index,
              }"
              draggable="true"
              @click="selectedBlockId = block.id"
              @dragstart="onDragStart(index)"
              @dragover="onDragOver($event, index)"
              @dragleave="onDragLeave"
              @drop="onDrop(index)"
              @dragend="onDragEnd"
            >
              <div class="block__handle" title="Drag to reorder">⋮⋮</div>
              <div class="block__type font-mono ttu">{{ block.type }}</div>

              <!-- Block preview -->
              <div class="block__preview">
                <template v-if="block.type === 'hero'">
                  <div class="preview-hero">
                    <p>{{ block.content.tagline || 'Hero tagline...' }}</p>
                  </div>
                </template>
                <template v-else-if="block.type === 'text'">
                  <p class="preview-text">{{ block.content.text || 'Text content...' }}</p>
                </template>
                <template v-else-if="block.type === 'image'">
                  <div class="preview-image">
                    <span v-if="block.content.url">{{ block.content.url }}</span>
                    <span v-else>No image selected</span>
                  </div>
                </template>
                <template v-else-if="block.type === 'works-grid'">
                  <div class="preview-grid">
                    <span>Works Grid ({{ block.content.columns || 3 }} cols)</span>
                  </div>
                </template>
                <template v-else-if="block.type === 'contact'">
                  <div class="preview-contact">
                    <span>{{ block.content.email || 'email@example.com' }}</span>
                  </div>
                </template>
                <template v-else-if="block.type === 'spacer'">
                  <div class="preview-spacer">Spacer ({{ block.content.height || '4rem' }})</div>
                </template>
                <template v-else-if="block.type === 'divider'">
                  <hr class="preview-divider" />
                </template>
                <template v-else-if="block.type === 'video'">
                  <div class="preview-video">Video Embed</div>
                </template>
                <template v-else-if="block.type === 'gallery'">
                  <div class="preview-gallery">Gallery ({{ (block.content.images || []).length }} images)</div>
                </template>
                <template v-else-if="block.type === 'quote'">
                  <div class="preview-quote">
                    <span>"{{ block.content.text || 'Quote text...' }}"</span>
                  </div>
                </template>
              </div>

              <!-- Block actions -->
              <div class="block__actions">
                <button class="block__action" title="Duplicate" @click.stop="duplicateBlock(block.id)">⎘</button>
                <button class="block__action block__action--danger" title="Delete" @click.stop="removeBlock(block.id)">✕</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right sidebar: block inspector -->
        <aside v-if="selectedBlock" class="builder__inspector">
          <div class="inspector__header">
            <h2 class="inspector__title font-mono ttu">{{ selectedBlock.type }}</h2>
            <button class="inspector__close" @click="selectedBlockId = null">×</button>
          </div>
          <div class="inspector__fields">
            <!-- Hero fields -->
            <template v-if="selectedBlock.type === 'hero'">
              <div class="field">
                <label class="field__label font-mono">Tagline</label>
                <input
                  :value="selectedBlock.content.tagline"
                  class="field__input"
                  @input="updateBlockContent(selectedBlock.id, { tagline: ($event.target as HTMLInputElement).value })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Layout</label>
                <select
                  :value="selectedBlock.content.layout"
                  class="field__select"
                  @change="updateBlockContent(selectedBlock.id, { layout: ($event.target as HTMLSelectElement).value })"
                >
                  <option value="centered">Centered</option>
                  <option value="left">Left aligned</option>
                  <option value="split">Split</option>
                </select>
              </div>
            </template>

            <!-- Text fields -->
            <template v-else-if="selectedBlock.type === 'text'">
              <div class="field">
                <label class="field__label font-mono">Text</label>
                <textarea
                  :value="selectedBlock.content.text"
                  class="field__textarea"
                  rows="5"
                  @input="updateBlockContent(selectedBlock.id, { text: ($event.target as HTMLTextAreaElement).value })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Alignment</label>
                <select
                  :value="selectedBlock.content.align"
                  class="field__select"
                  @change="updateBlockContent(selectedBlock.id, { align: ($event.target as HTMLSelectElement).value })"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </template>

            <!-- Image fields -->
            <template v-else-if="selectedBlock.type === 'image'">
              <div class="field">
                <label class="field__label font-mono">Image URL</label>
                <input
                  :value="selectedBlock.content.url"
                  class="field__input"
                  placeholder="/uploads/image.jpg"
                  @input="updateBlockContent(selectedBlock.id, { url: ($event.target as HTMLInputElement).value })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Alt text</label>
                <input
                  :value="selectedBlock.content.alt"
                  class="field__input"
                  @input="updateBlockContent(selectedBlock.id, { alt: ($event.target as HTMLInputElement).value })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Caption</label>
                <input
                  :value="selectedBlock.content.caption"
                  class="field__input"
                  @input="updateBlockContent(selectedBlock.id, { caption: ($event.target as HTMLInputElement).value })"
                />
              </div>
            </template>

            <!-- Works grid fields -->
            <template v-else-if="selectedBlock.type === 'works-grid'">
              <div class="field">
                <label class="field__label font-mono">Columns</label>
                <input
                  type="number"
                  :value="selectedBlock.content.columns"
                  class="field__input"
                  min="1"
                  max="6"
                  @input="updateBlockContent(selectedBlock.id, { columns: Number(($event.target as HTMLInputElement).value) })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Category</label>
                <select
                  :value="selectedBlock.content.category"
                  class="field__select"
                  @change="updateBlockContent(selectedBlock.id, { category: ($event.target as HTMLSelectElement).value })"
                >
                  <option value="all">All</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="hotel">Hotel</option>
                  <option value="music">Music</option>
                  <option value="books">Books</option>
                  <option value="vintage">Vintage</option>
                </select>
              </div>
              <div class="field">
                <label class="field__label font-mono">Show Count</label>
                <input
                  type="number"
                  :value="selectedBlock.content.show_count"
                  class="field__input"
                  min="1"
                  max="24"
                  @input="updateBlockContent(selectedBlock.id, { show_count: Number(($event.target as HTMLInputElement).value) })"
                />
              </div>
            </template>

            <!-- Contact fields -->
            <template v-else-if="selectedBlock.type === 'contact'">
              <div class="field">
                <label class="field__label font-mono">Email</label>
                <input
                  :value="selectedBlock.content.email"
                  class="field__input"
                  @input="updateBlockContent(selectedBlock.id, { email: ($event.target as HTMLInputElement).value })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Phone</label>
                <input
                  :value="selectedBlock.content.phone"
                  class="field__input"
                  @input="updateBlockContent(selectedBlock.id, { phone: ($event.target as HTMLInputElement).value })"
                />
              </div>
            </template>

            <!-- Spacer fields -->
            <template v-else-if="selectedBlock.type === 'spacer'">
              <div class="field">
                <label class="field__label font-mono">Height</label>
                <input
                  :value="selectedBlock.content.height"
                  class="field__input"
                  placeholder="4rem"
                  @input="updateBlockContent(selectedBlock.id, { height: ($event.target as HTMLInputElement).value })"
                />
              </div>
            </template>

            <!-- Video fields -->
            <template v-else-if="selectedBlock.type === 'video'">
              <div class="field">
                <label class="field__label font-mono">Video URL</label>
                <input
                  :value="selectedBlock.content.url"
                  class="field__input"
                  placeholder="https://youtube.com/watch?v=..."
                  @input="updateBlockContent(selectedBlock.id, { url: ($event.target as HTMLInputElement).value })"
                />
              </div>
            </template>

            <!-- Quote fields -->
            <template v-else-if="selectedBlock.type === 'quote'">
              <div class="field">
                <label class="field__label font-mono">Quote</label>
                <textarea
                  :value="selectedBlock.content.text"
                  class="field__textarea"
                  rows="3"
                  @input="updateBlockContent(selectedBlock.id, { text: ($event.target as HTMLTextAreaElement).value })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Author</label>
                <input
                  :value="selectedBlock.content.author"
                  class="field__input"
                  @input="updateBlockContent(selectedBlock.id, { author: ($event.target as HTMLInputElement).value })"
                />
              </div>
              <div class="field">
                <label class="field__label font-mono">Role</label>
                <input
                  :value="selectedBlock.content.role"
                  class="field__input"
                  @input="updateBlockContent(selectedBlock.id, { role: ($event.target as HTMLInputElement).value })"
                />
              </div>
            </template>
          </div>
        </aside>

        <!-- History panel (overlay) -->
        <div v-if="showHistory" class="history-panel">
          <div class="history-panel__header">
            <h2 class="history-panel__title font-mono ttu">History</h2>
            <button class="history-panel__close" @click="showHistory = false">×</button>
          </div>
          <div class="history-panel__list">
            <div
              v-for="rev in revisions"
              :key="rev.id"
              class="history-item"
              @click="restoreRevision(rev.id); showHistory = false"
            >
              <span class="history-item__action font-mono">{{ rev.action }}</span>
              <span class="history-item__meta font-mono">
                {{ rev.block_count }} blocks · {{ new Date(rev.created_at * 1000).toLocaleString() }}
              </span>
            </div>
            <p v-if="revisions.length === 0" class="history-panel__empty font-mono">No history yet.</p>
          </div>
        </div>
      </div>

      <!-- ── Pages tab ─────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'pages'" class="tab-content">
        <div class="tab-content__header">
          <h2 class="tab-content__title font-mono ttu">Pages</h2>
          <button class="tab-content__add font-mono ttu" @click="showPageModal = true">+ New Page</button>
        </div>
        <div class="pages-list">
          <div v-for="page in pages" :key="page.id" class="page-item" :class="{ 'page-item--active': currentPage?.id === page.id }">
            <div class="page-item__info" @click="loadPage(page.id); activeTab = 'builder'">
              <span class="page-item__title">{{ page.title }}</span>
              <span class="page-item__slug font-mono">{{ page.slug }}</span>
              <span class="page-item__meta font-mono">{{ page.block_count }} blocks</span>
            </div>
            <div class="page-item__actions">
              <span v-if="page.is_home" class="page-item__badge font-mono">HOME</span>
              <button class="page-item__delete" @click="handleDeletePage(page.id)">✕</button>
            </div>
          </div>
        </div>

        <!-- New page modal -->
        <div v-if="showPageModal" class="modal-overlay" @click.self="showPageModal = false">
          <div class="modal">
            <h3 class="modal__title font-mono ttu">New Page</h3>
            <div class="modal__field">
              <label class="modal__label font-mono">Title</label>
              <input v-model="newPageTitle" class="modal__input" placeholder="About Us" />
            </div>
            <div class="modal__field">
              <label class="modal__label font-mono">Slug</label>
              <input v-model="newPageSlug" class="modal__input" placeholder="/about" />
            </div>
            <div class="modal__actions">
              <button class="modal__cancel font-mono" @click="showPageModal = false">Cancel</button>
              <button class="modal__confirm font-mono ttu" @click="handleCreatePage">Create</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Media tab ─────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'media'" class="tab-content">
        <MediaManager />
      </div>

      <!-- ── Works tab ─────────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'works'" class="tab-content">
        <WorksManager />
      </div>

      <!-- ── Settings tab ──────────────────────────────────────────────── -->
      <div v-else-if="activeTab === 'settings'" class="tab-content">
        <SettingsPanel />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Login ──────────────────────────────────────────────────────────────── */
.login {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 2rem;
}
.login__card {
  width: min(100%, 28rem);
  padding: clamp(2rem, 5vw, 3rem);
  border: 1px solid var(--line);
  border-radius: 0.6rem;
  background: var(--paper);
}
.login__mark {
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 2.4rem;
  line-height: 1;
  color: var(--ink);
  margin-bottom: 0.5rem;
}
.login__title {
  font-size: var(--type-label);
  color: var(--ink-2);
  letter-spacing: 0.12em;
  margin: 0 0 0.3rem;
}
.login__sub {
  color: var(--ink-2);
  font-size: var(--type-meta);
  margin: 0 0 2rem;
}
.login__form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.login__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.login__label {
  font-size: 0.7rem;
  color: var(--ink-2);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.login__input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.35rem;
  color: var(--ink);
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.15s, background 0.15s;
}
.login__input:focus {
  outline: none;
  border-color: var(--ink);
  background: var(--paper);
}
.login__error {
  font-size: 0.75rem;
  color: #c0392b;
  margin: 0;
}
.login__btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.login__btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.login__btn:hover:not(:disabled) {
  opacity: 0.85;
}
.login__hint {
  margin: 1.5rem 0 0;
  padding-top: 1.2rem;
  border-top: 1px solid var(--line);
  font-size: 0.65rem;
  line-height: 1.6;
  color: var(--ink-3, var(--ink-2));
}
.login__hint code {
  background: var(--paper-1);
  padding: 0.1em 0.35em;
  border-radius: 0.2rem;
  font-size: 0.7rem;
}

/* ── Admin layout ───────────────────────────────────────────────────────── */
.admin {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

/* Top bar */
.topbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.6rem 1rem;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  z-index: 100;
}
.topbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.topbar__mark {
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 1.4rem;
  line-height: 1;
  color: var(--ink);
}
.topbar__title {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--ink-2);
}
.topbar__nav {
  display: flex;
  gap: 0.2rem;
  flex: 1;
}
.topbar__tab {
  padding: 0.4rem 0.8rem;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--ink-2);
  background: none;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.topbar__tab:hover {
  color: var(--ink);
  background: var(--paper-1);
}
.topbar__tab--active {
  color: var(--ink);
  background: var(--paper-1);
}
.topbar__actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}
.topbar__dirty {
  font-size: 0.65rem;
  color: #e67e22;
}
.topbar__email {
  font-size: 0.7rem;
  color: var(--ink-2);
}
.topbar__logout {
  padding: 0.3rem 0.6rem;
  font-size: 0.6rem;
  letter-spacing: 0.06em;
  color: var(--ink-2);
  background: none;
  border: 1px solid var(--line);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.topbar__logout:hover {
  color: var(--ink);
  border-color: var(--ink);
}

/* ── Builder layout ─────────────────────────────────────────────────────── */
.builder {
  flex: 1;
  display: grid;
  grid-template-columns: 0 1fr 0;
  position: relative;
}
.builder__sidebar--open ~ .builder__canvas-wrapper {
  /* sidebar is overlay on mobile */
}

/* Sidebar (block library) */
.builder__sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 16rem;
  background: var(--paper);
  border-right: 1px solid var(--line);
  z-index: 200;
  transform: translateX(-100%);
  transition: transform 0.2s ease;
  overflow-y: auto;
}
.builder__sidebar--open {
  transform: translateX(0);
}
.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--paper);
}
.sidebar__title {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  margin: 0;
}
.sidebar__close {
  font-size: 1.2rem;
  background: none;
  border: none;
  color: var(--ink-2);
  cursor: pointer;
  padding: 0.2rem 0.4rem;
}
.sidebar__blocks {
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.block-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  background: var(--paper-1);
  border: 1px solid transparent;
  border-radius: 0.35rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: left;
}
.block-btn:hover {
  border-color: var(--ink);
  background: var(--paper);
}
.block-btn__icon {
  font-size: 1rem;
  width: 1.2rem;
  text-align: center;
}
.block-btn__label {
  font-size: 0.7rem;
  color: var(--ink);
}

/* Canvas */
.builder__canvas-wrapper {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.canvas__toolbar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--line);
  background: var(--paper);
  position: sticky;
  top: 2.4rem;
  z-index: 50;
}
.toolbar__btn {
  padding: 0.35rem 0.7rem;
  font-size: 0.65rem;
  letter-spacing: 0.04em;
  color: var(--ink);
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.toolbar__btn:hover:not(:disabled) {
  background: var(--paper);
  border-color: var(--ink);
}
.toolbar__btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.toolbar__divider {
  width: 1px;
  height: 1.2rem;
  background: var(--line);
  margin: 0 0.2rem;
}
.toolbar__spacer {
  flex: 1;
}
.toolbar__page {
  font-size: 0.7rem;
  color: var(--ink-2);
}
.toolbar__slug {
  color: var(--ink-3, var(--ink-2));
}
.toolbar__save {
  padding: 0.4rem 1rem;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.toolbar__save:disabled {
  opacity: 0.4;
  cursor: default;
}
.toolbar__save:hover:not(:disabled) {
  opacity: 0.85;
}

/* Canvas area */
.canvas {
  flex: 1;
  padding: 1.5rem;
  max-width: 48rem;
  margin: 0 auto;
  width: 100%;
}
.canvas__empty {
  text-align: center;
  padding: 4rem 2rem;
  border: 2px dashed var(--line);
  border-radius: 0.5rem;
}
.canvas__empty-text {
  font-size: 0.9rem;
  color: var(--ink-2);
  margin: 0;
}
.canvas__empty-sub {
  font-size: 0.75rem;
  color: var(--ink-3, var(--ink-2));
  margin: 0.5rem 0 0;
}

/* Block items */
.block {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  background: var(--paper);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.block:hover {
  border-color: var(--ink-2);
}
.block--selected {
  border-color: var(--ink);
  box-shadow: 0 0 0 1px var(--ink);
}
.block--dragging {
  opacity: 0.5;
}
.block--drag-over {
  border-color: var(--ink);
  border-style: dashed;
}
.block__handle {
  font-size: 0.8rem;
  color: var(--ink-3, var(--ink-2));
  cursor: grab;
  padding: 0.2rem;
  user-select: none;
}
.block__handle:active {
  cursor: grabbing;
}
.block__type {
  position: absolute;
  top: 0.3rem;
  right: 0.5rem;
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  color: var(--ink-3, var(--ink-2));
}
.block__preview {
  flex: 1;
  min-width: 0;
  padding: 0.3rem 0;
}
.block__actions {
  display: flex;
  gap: 0.2rem;
  opacity: 0;
  transition: opacity 0.15s;
}
.block:hover .block__actions {
  opacity: 1;
}
.block__action {
  width: 1.4rem;
  height: 1.4rem;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.2rem;
  cursor: pointer;
  transition: background 0.15s;
}
.block__action:hover {
  background: var(--paper);
}
.block__action--danger:hover {
  background: #c0392b;
  color: white;
  border-color: #c0392b;
}

/* Block previews */
.preview-hero p {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
}
.preview-text {
  font-size: 0.85rem;
  color: var(--ink-1);
  margin: 0;
  line-height: 1.5;
}
.preview-image,
.preview-grid,
.preview-contact,
.preview-spacer,
.preview-video,
.preview-gallery,
.preview-quote {
  font-size: 0.75rem;
  color: var(--ink-2);
  padding: 0.5rem;
  background: var(--paper-1);
  border-radius: 0.25rem;
}
.preview-divider {
  border: none;
  border-top: 1px solid var(--line);
  margin: 0.5rem 0;
}

/* Inspector */
.builder__inspector {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 18rem;
  background: var(--paper);
  border-left: 1px solid var(--line);
  z-index: 200;
  overflow-y: auto;
}
.inspector__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--paper);
}
.inspector__title {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  margin: 0;
}
.inspector__close {
  font-size: 1.2rem;
  background: none;
  border: none;
  color: var(--ink-2);
  cursor: pointer;
}
.inspector__fields {
  padding: 1rem;
}

/* Inspector fields */
.field {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.field__label {
  font-size: 0.6rem;
  color: var(--ink-2);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.field__input,
.field__select,
.field__textarea {
  width: 100%;
  padding: 0.5rem 0.7rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  color: var(--ink);
  font-size: 0.8rem;
  font-family: inherit;
  transition: border-color 0.15s;
}
.field__input:focus,
.field__select:focus,
.field__textarea:focus {
  outline: none;
  border-color: var(--ink);
}
.field__textarea {
  resize: vertical;
  min-height: 4rem;
}

/* History panel */
.history-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90vw, 28rem);
  max-height: 70vh;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  z-index: 300;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}
.history-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--paper);
}
.history-panel__title {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  margin: 0;
}
.history-panel__close {
  font-size: 1.2rem;
  background: none;
  border: none;
  color: var(--ink-2);
  cursor: pointer;
}
.history-panel__list {
  padding: 0.5rem;
}
.history-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background 0.15s;
}
.history-item:hover {
  background: var(--paper-1);
}
.history-item__action {
  font-size: 0.7rem;
  color: var(--ink);
}
.history-item__meta {
  font-size: 0.6rem;
  color: var(--ink-3, var(--ink-2));
}
.history-panel__empty {
  text-align: center;
  padding: 2rem;
  font-size: 0.75rem;
  color: var(--ink-2);
}

/* ── Tab content ────────────────────────────────────────────────────────── */
.tab-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 48rem;
  margin: 0 auto;
  width: 100%;
}
.tab-content__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.tab-content__title {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  margin: 0;
}
.tab-content__add {
  padding: 0.4rem 0.8rem;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
}
.tab-content__add:hover {
  opacity: 0.85;
}

/* Pages list */
.pages-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.page-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  background: var(--paper);
  transition: border-color 0.15s;
}
.page-item:hover {
  border-color: var(--ink-2);
}
.page-item--active {
  border-color: var(--ink);
}
.page-item__info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  flex: 1;
}
.page-item__title {
  font-size: 0.85rem;
  color: var(--ink);
}
.page-item__slug {
  font-size: 0.7rem;
  color: var(--ink-3, var(--ink-2));
}
.page-item__meta {
  font-size: 0.65rem;
  color: var(--ink-3, var(--ink-2));
}
.page-item__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.page-item__badge {
  font-size: 0.55rem;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.4rem;
  background: var(--paper-1);
  border-radius: 0.2rem;
  color: var(--ink-2);
}
.page-item__delete {
  width: 1.4rem;
  height: 1.4rem;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  background: none;
  border: 1px solid var(--line);
  border-radius: 0.2rem;
  cursor: pointer;
  color: var(--ink-2);
  transition: all 0.15s;
}
.page-item__delete:hover {
  background: #c0392b;
  color: white;
  border-color: #c0392b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 400;
}
.modal {
  width: min(90vw, 24rem);
  padding: 1.5rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 0.5rem;
}
.modal__title {
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  margin: 0 0 1.2rem;
}
.modal__field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.modal__label {
  font-size: 0.6rem;
  color: var(--ink-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.modal__input {
  width: 100%;
  padding: 0.5rem 0.7rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  color: var(--ink);
  font-size: 0.85rem;
  font-family: inherit;
}
.modal__input:focus {
  outline: none;
  border-color: var(--ink);
}
.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.2rem;
}
.modal__cancel {
  padding: 0.4rem 0.8rem;
  font-size: 0.7rem;
  color: var(--ink-2);
  background: none;
  border: 1px solid var(--line);
  cursor: pointer;
}
.modal__confirm {
  padding: 0.4rem 0.8rem;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
}

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 48rem) {
  .topbar {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .topbar__nav {
    order: 3;
    width: 100%;
    overflow-x: auto;
  }
  .builder {
    grid-template-columns: 1fr;
  }
  .canvas {
    padding: 1rem;
  }
}
</style>
