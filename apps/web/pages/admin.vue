<script setup lang="ts">
import { Field } from '@ark-ui/vue';

useHead({
  title: 'Admin — *blue red + purple/',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

// ── Auth state ────────────────────────────────────────────────────────────
const auth = ref<{ authenticated: boolean; email: string }>({
  authenticated: false,
  email: '',
});
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');
const loginLoading = ref(false);

// ── Content state ─────────────────────────────────────────────────────────
const content = ref<Record<string, string>>({});
const saving = ref<Record<string, boolean>>({});
const saved = ref<Record<string, boolean>>({});
const loading = ref(true);
const error = ref<string | null>(null);
const activeSection = ref<string>('hero');

// ── Real-time sync ────────────────────────────────────────────────────────
const { connected } = useRealtime((key: string, value: string) => {
  if (content.value[key] !== value) {
    content.value[key] = value;
    flashSaved(key);
  }
});

function flashSaved(key: string) {
  saved.value[key] = true;
  setTimeout(() => { saved.value[key] = false; }, 2000);
}

// ── Sections for the visual builder ───────────────────────────────────────
const sections = [
  {
    id: 'hero',
    title: 'Hero',
    icon: '◈',
    fields: [{ key: 'hero_tagline', label: 'Tagline', type: 'text' }],
  },
  {
    id: 'about',
    title: 'About',
    icon: '◉',
    fields: [
      { key: 'about_body_1', label: 'Paragraph 1', type: 'textarea' },
      { key: 'about_body_2', label: 'Paragraph 2 (Formula)', type: 'textarea' },
    ],
  },
  {
    id: 'lineage',
    title: 'Lineage',
    icon: '◆',
    fields: [
      { key: 'about_previously_label', label: 'Previously label', type: 'text' },
      { key: 'about_previously_value', label: 'Previously value', type: 'text' },
      { key: 'about_freegame_label', label: 'Free game label', type: 'text' },
      { key: 'about_freegame_value', label: 'Free game value', type: 'text' },
    ],
  },
  {
    id: 'contacts',
    title: 'Contacts',
    icon: '◎',
    fields: [{ key: 'contact_email', label: 'Email', type: 'text' }],
  },
];

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
    await loadContent();
  } catch (e: any) {
    loginError.value = e.data?.statusMessage || 'Login failed';
  } finally {
    loginLoading.value = false;
  }
}

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' });
  auth.value = { authenticated: false, email: '' };
  content.value = {};
}

// ── Content methods ───────────────────────────────────────────────────────
async function loadContent() {
  try {
    content.value = await $fetch<Record<string, string>>('/api/content');
  } catch (e) {
    error.value = 'Failed to load content.';
  } finally {
    loading.value = false;
  }
}

async function save(key: string) {
  saving.value[key] = true;
  saved.value[key] = false;
  try {
    await $fetch('/api/content', {
      method: 'POST',
      body: { key, value: content.value[key] },
    });
    flashSaved(key);
  } catch {
    error.value = `Failed to save "${key}"`;
  } finally {
    saving.value[key] = false;
  }
}

async function saveAll() {
  const keys = sections.flatMap((s) => s.fields.map((f) => f.key));
  for (const key of keys) {
    if (content.value[key] !== undefined) {
      await save(key);
    }
  }
}

// ── Init ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  await checkSession();
  if (auth.value.authenticated) {
    await loadContent();
  }
});
</script>

<template>
  <div>
    <!-- ── Login screen ─────────────────────────────────────────────────── -->
    <main v-if="!auth.authenticated" class="login">
      <div class="login__card">
        <div class="login__mark" aria-hidden="true">/</div>
        <h1 class="login__title font-mono ttu tracked">Admin</h1>
        <p class="login__sub">Sign in to manage site content.</p>

        <form class="login__form" @submit.prevent="login">
          <Field.Root class="login__field">
            <Field.Label class="login__label font-mono">Email</Field.Label>
            <Field.Input
              v-model="loginEmail"
              type="email"
              autocomplete="email"
              required
              class="login__input"
              placeholder="you@blueredandpurple.world"
            />
          </Field.Root>

          <Field.Root class="login__field">
            <Field.Label class="login__label font-mono">Password</Field.Label>
            <Field.Input
              v-model="loginPassword"
              type="password"
              autocomplete="current-password"
              required
              class="login__input"
              placeholder="••••••••"
            />
          </Field.Root>

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

    <!-- ── Visual builder (authenticated) ───────────────────────────────── -->
    <main v-else class="builder">
      <!-- Builder header -->
      <header class="builder__head">
        <div class="builder__brand">
          <span class="builder__mark" aria-hidden="true">/</span>
          <div>
            <h1 class="builder__title font-mono ttu tracked">Content</h1>
            <p class="builder__sub">
              Edit text blocks. Changes persist in local SQLite and sync in real-time.
            </p>
          </div>
        </div>
        <div class="builder__actions">
          <span class="builder__status font-mono" :class="{ 'builder__status--live': connected }">
            <span class="builder__dot" :data-on="connected ? 'true' : 'false'" />
            {{ connected ? 'Live' : 'Connecting…' }}
          </span>
          <span class="builder__email font-mono">{{ auth.email }}</span>
          <button class="builder__logout font-mono ttu" @click="logout">Sign out</button>
        </div>
      </header>

      <div class="builder__body">
        <!-- Section nav -->
        <nav class="builder__nav" aria-label="Content sections">
          <button
            v-for="section in sections"
            :key="section.id"
            class="builder__nav-item font-mono ttu"
            :class="{ 'builder__nav-item--active': activeSection === section.id }"
            :aria-current="activeSection === section.id ? 'true' : undefined"
            @click="activeSection = section.id"
          >
            <span class="builder__nav-icon" aria-hidden="true">{{ section.icon }}</span>
            {{ section.title }}
          </button>
        </nav>

        <!-- Editor panels -->
        <div class="builder__editor">
          <p v-if="error" class="builder__error" role="alert">{{ error }}</p>
          <p v-if="loading" class="builder__loading font-mono">Loading…</p>

          <template v-for="section in sections" :key="section.id">
            <div v-show="activeSection === section.id" class="panel" role="group" :aria-label="`${section.title} fields`">
              <h2 class="panel__title font-mono ttu tracked">
                <span class="panel__icon" aria-hidden="true">{{ section.icon }}</span>
                {{ section.title }}
              </h2>

              <div v-for="field in section.fields" :key="field.key">
                <!-- Textarea fields -->
                <Field.Root v-if="field.type === 'textarea'" class="panel__field">
                  <Field.Label class="panel__label font-mono">{{ field.key }}</Field.Label>
                  <Field.Textarea
                    v-model="content[field.key]"
                    class="panel__input panel__input--multiline"
                    rows="5"
                    :id="field.key"
                  />
                  <div class="panel__field-foot">
                    <span v-if="saved[field.key]" class="panel__saved font-mono">✓ Saved</span>
                    <button class="panel__save font-mono ttu" :disabled="saving[field.key]" @click="save(field.key)">
                      {{ saving[field.key] ? 'Saving…' : 'Save' }}
                    </button>
                  </div>
                </Field.Root>

                <!-- Text input fields -->
                <Field.Root v-else class="panel__field">
                  <Field.Label class="panel__label font-mono">{{ field.key }}</Field.Label>
                  <Field.Input
                    v-model="content[field.key]"
                    type="text"
                    class="panel__input"
                    :id="field.key"
                  />
                  <div class="panel__field-foot">
                    <span v-if="saved[field.key]" class="panel__saved font-mono">✓ Saved</span>
                    <button class="panel__save font-mono ttu" :disabled="saving[field.key]" @click="save(field.key)">
                      {{ saving[field.key] ? 'Saving…' : 'Save' }}
                    </button>
                  </div>
                </Field.Root>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Footer -->
      <footer class="builder__foot font-mono">
        <NuxtLink to="/">← Back to site</NuxtLink>
        <button class="builder__save-all font-mono ttu" @click="saveAll">Save all sections</button>
      </footer>
    </main>
  </div>
</template>

<style scoped>
/* ── Login ──────────────────────────────────────────────────────────────── */
.login {
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: var(--edge);
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
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
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
  transition: opacity var(--dur) var(--ease);
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

/* ── Builder ────────────────────────────────────────────────────────────── */
.builder {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.builder__head {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1rem var(--edge);
  background: color-mix(in oklab, var(--paper) 92%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.builder__brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.builder__mark {
  font-family: var(--font-display);
  font-weight: var(--wght-display, 700);
  font-size: 1.8rem;
  line-height: 1;
  color: var(--ink);
}

.builder__title {
  font-size: var(--type-label);
  color: var(--ink-2);
  letter-spacing: 0.12em;
  margin: 0;
}

.builder__sub {
  color: var(--ink-3, var(--ink-2));
  font-size: 0.75rem;
  margin: 0;
}

.builder__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.builder__status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  color: var(--ink-3, var(--ink-2));
  letter-spacing: 0.04em;
}

.builder__status--live {
  color: #00a95c;
}

.builder__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: var(--ink-3, var(--ink-2));
}

.builder__dot[data-on='true'] {
  background: #00a95c;
}

.builder__email {
  font-size: 0.7rem;
  color: var(--ink-2);
}

.builder__logout {
  padding: 0.35rem 0.7rem;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--ink-2);
  background: none;
  border: 1px solid var(--line);
  cursor: pointer;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.builder__logout:hover {
  color: var(--ink);
  border-color: var(--ink);
}

/* ── Builder body ───────────────────────────────────────────────────────── */
.builder__body {
  flex: 1;
  display: grid;
  grid-template-columns: 14rem 1fr;
  gap: 0;
}

.builder__nav {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 1.5rem 1rem;
  border-right: 1px solid var(--line);
}

.builder__nav-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--ink-2);
  background: none;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  text-align: left;
  transition: color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.builder__nav-item:hover {
  color: var(--ink);
  background: var(--paper-1);
}

.builder__nav-item--active {
  color: var(--ink);
  background: var(--paper-1);
}

.builder__nav-icon {
  font-size: 0.9rem;
  opacity: 0.7;
}

/* ── Editor panel ──────────────────────────────────────────────────────── */
.builder__editor {
  padding: 1.5rem;
  max-width: 40rem;
}

.panel__title {
  font-size: var(--type-label);
  color: var(--ink-2);
  letter-spacing: 0.1em;
  margin: 0 0 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--line);
}

.panel__icon {
  margin-right: 0.4rem;
  opacity: 0.6;
}

.panel__field {
  margin-bottom: 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.panel__label {
  font-size: 0.65rem;
  color: var(--ink-2);
  letter-spacing: 0.04em;
  word-break: break-all;
  text-transform: uppercase;
}

.panel__input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  background: var(--paper-1);
  border: 1px solid var(--line);
  border-radius: 0.35rem;
  color: var(--ink);
  font-size: 0.9rem;
  line-height: 1.5;
  font-family: inherit;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.panel__input:focus {
  outline: none;
  border-color: var(--ink);
  background: var(--paper);
}

.panel__input--multiline {
  resize: vertical;
  min-height: 6rem;
  line-height: 1.6;
}

.panel__field-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.panel__saved {
  font-size: 0.7rem;
  color: #00a95c;
}

.panel__save {
  padding: 0.4rem 1rem;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
  transition: opacity var(--dur) var(--ease);
}

.panel__save:disabled {
  opacity: 0.5;
  cursor: default;
}

.panel__save:hover:not(:disabled) {
  opacity: 0.85;
}

/* ── Builder footer ─────────────────────────────────────────────────────── */
.builder__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem var(--edge);
  border-top: 1px solid var(--line);
}

.builder__foot a {
  color: var(--ink-2);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color var(--dur) var(--ease);
}

.builder__foot a:hover {
  color: var(--ink);
}

.builder__save-all {
  padding: 0.5rem 1.2rem;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--paper);
  background: var(--ink);
  border: none;
  cursor: pointer;
  transition: opacity var(--dur) var(--ease);
}

.builder__save-all:hover {
  opacity: 0.85;
}

/* ── States ─────────────────────────────────────────────────────────────── */
.builder__error {
  color: #c0392b;
  font-size: var(--type-meta);
  margin-bottom: 1.5rem;
}

.builder__loading {
  color: var(--ink-2);
}

/* ── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 40rem) {
  .builder__body {
    grid-template-columns: 1fr;
  }
  .builder__nav {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid var(--line);
    padding: 1rem;
  }
  .builder__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
