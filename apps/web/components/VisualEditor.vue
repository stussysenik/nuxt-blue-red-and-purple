<script setup lang="ts">
// Visual Editor Overlay for Storyblok
// Stack: Moveable + Selecto + Gesto + Ark UI (Accordion, Dialog, Tooltip)
// Only active in draft/preview mode

import { onMounted, onUnmounted, ref, nextTick, computed } from "vue"
import Moveable from "moveable"
import Selecto from "selecto"
import { Gesto } from "gesto"

interface Blok {
  _uid: string
  component: string
  [key: string]: any
}

defineProps<{
  body?: Blok[]
}>()

const isPreview = import.meta.dev
const containerRef = ref<HTMLElement | null>(null)
const moveableInstances = ref<any[]>([])
const selectedBlocks = ref<Set<string>>(new Set())
const activeUid = ref<string | null>(null)
const dialogOpen = ref(false)
const accordionOpen = ref<string[]>(["blocks"])

let selectoInstance: any = null

// Group blocks by type for accordion
const groupedBlocks = computed(() => {
  const groups: Record<string, Array<{ blok: any; index: number }>> = {}
  ;(body || []).forEach((blok, index) => {
    const type = blok.component
    if (!groups[type]) groups[type] = []
    groups[type].push({ blok, index })
  })
  return groups
})

// Available block types to add
const availableBlocks = [
  { name: "hero", label: "Hero" },
  { name: "about", label: "About" },
  { name: "contacts", label: "Contacts" },
  { name: "teaser", label: "Teaser" },
  { name: "grid", label: "Grid" },
  { name: "feature", label: "Feature" },
]

onMounted(async () => {
  if (!isPreview || !containerRef.value) return

  await nextTick()

  // Selecto: multi-select blocks
  selectoInstance = new Selecto({
    container: containerRef.value,
    selectableTargets: [".ve-block"],
    selectByClick: true,
    selectFromInside: true,
    toggleContinueSelect: ["shift"],
    hitRate: 0,
  })

  selectoInstance.on("selectStart", (e) => {
    if (!e.inputEvent.shiftKey) {
      selectedBlocks.value.clear()
      clearHighlights()
    }
    e.selected.forEach((el: HTMLElement) => {
      const uid = el.getAttribute("data-blok-uid")
      if (uid) {
        selectedBlocks.value.add(uid)
        highlightBlock(uid)
      }
    })
  })

  selectoInstance.on("select", (e) => {
    e.added.forEach((el: HTMLElement) => {
      const uid = el.getAttribute("data-blok-uid")
      if (uid) {
        selectedBlocks.value.add(uid)
        highlightBlock(uid)
      }
    })
    e.removed.forEach((el: HTMLElement) => {
      const uid = el.getAttribute("data-blok-uid")
      if (uid) {
        selectedBlocks.value.delete(uid)
        unhighlightBlock(uid)
      }
    })
  })

  // Moveable for each block
  const blocks = containerRef.value.querySelectorAll("[data-blok-uid]")
  blocks.forEach((el) => {
    const uid = el.getAttribute("data-blok-uid")
    if (!uid) return

    const moveable = new Moveable(document.body, {
      target: el as HTMLElement,
      draggable: true,
      resizable: true,
      rotatable: true,
      scalable: true,
      snappable: true,
      snapDirections: { top: true, left: true, bottom: true, right: true },
      elementSnapDirections: { center: true, middle: true },
      snapThreshold: 5,
      bounds: { left: 0, top: 0, right: 0, bottom: 0, position: "css" },
    })

    moveable.on("dragStart", () => {
      activeUid.value = uid
      selectedBlocks.value.clear()
      selectedBlocks.value.add(uid)
    })

    moveable.on("drag", ({ target, transform }) => {
      target.style.transform = transform
    })

    moveable.on("dragEnd", ({ target }) => {
      const rect = target.getBoundingClientRect()
      emit("blockUpdate", { uid, position: { x: rect.left, y: rect.top } })
    })

    moveable.on("resizeStart", () => {
      activeUid.value = uid
    })

    moveable.on("resize", ({ target, width, height, drag }) => {
      target.style.width = `${width}px`
      target.style.height = `${height}px`
      target.style.transform = drag.transform
    })

    moveable.on("resizeEnd", ({ target }) => {
      const rect = target.getBoundingClientRect()
      emit("blockUpdate", { uid, size: { width: rect.width, height: rect.height } })
    })

    moveable.on("rotateStart", () => {
      activeUid.value = uid
    })

    moveable.on("rotate", ({ target, transform }) => {
      target.style.transform = transform
    })

    moveableInstances.value.push({ uid, instance: moveable })
  })
})

onUnmounted(() => {
  moveableInstances.value.forEach(({ instance }) => instance.destroy())
  selectoInstance?.destroy()
})

function highlightBlock(uid: string) {
  containerRef.value?.querySelector(`[data-blok-uid="${uid}"]`)?.classList.add("ve-block--selected")
}

function unhighlightBlock(uid: string) {
  containerRef.value?.querySelector(`[data-blok-uid="${uid}"]`)?.classList.remove("ve-block--selected")
}

function clearHighlights() {
  containerRef.value?.querySelectorAll(".ve-block--selected").forEach((el) => {
    el.classList.remove("ve-block--selected")
  })
}

function selectBlock(uid: string) {
  selectedBlocks.value.clear()
  clearHighlights()
  selectedBlocks.value.add(uid)
  highlightBlock(uid)
  activeUid.value = uid
}

function deleteBlock(uid: string) {
  emit("delete", uid)
  selectedBlocks.value.delete(uid)
}

function moveBlockUp(index: number) {
  if (index <= 0) return
  emit("reorder", { from: index, to: index - 1 })
}

function moveBlockDown(index: number) {
  if (index >= (body?.length || 0) - 1) return
  emit("reorder", { from: index, to: index + 1 })
}

function addBlock(component: string) {
  emit("add", component)
  dialogOpen.value = false
}

const selectedCount = computed(() => selectedBlocks.value.size)

const emit = defineEmits<{
  delete: [uid: string]
  reorder: [payload: { from: number; to: number }]
  blockUpdate: [payload: { uid: string; position?: any; size?: any; transform?: string }]
  add: [component: string]
}>()
</script>

<template>
  <div v-if="isPreview" class="visual-editor">
    <!-- Sidebar with Ark UI Accordion -->
    <aside class="ve-sidebar">
      <div class="ve-sidebar__header">
        <h3 class="ve-sidebar__title font-mono ttu tracked">Editor</h3>
        <button class="ve-add-btn font-mono" @click="dialogOpen = true">+ Add</button>
      </div>

      <!-- Block groups by type -->
      <div v-for="(blocks, type) in groupedBlocks" :key="type" class="ve-group">
        <button
          class="ve-group__toggle font-mono"
          @click="accordionOpen.includes(type) ? accordionOpen = accordionOpen.filter(t => t !== type) : accordionOpen.push(type)"
        >
          <span class="ve-group__icon">{{ accordionOpen.includes(type) ? "▾" : "▸" }}</span>
          <span class="ve-group__name">{{ type }}</span>
          <span class="ve-group__count">{{ blocks.length }}</span>
        </button>
        <ul v-show="accordionOpen.includes(type)" class="ve-tree">
          <li
            v-for="{ blok, index } in blocks"
            :key="blok._uid"
            class="ve-tree__item"
            :class="{ 've-tree__item--active': selectedBlocks.has(blok._uid) }"
            @click="selectBlock(blok._uid)"
          >
            <span class="ve-tree__name font-mono">{{ blok.component }} {{ index + 1 }}</span>
            <span class="ve-tree__actions">
              <button class="ve-tree__btn" @click.stop="moveBlockUp(index)" title="Up">↑</button>
              <button class="ve-tree__btn" @click.stop="moveBlockDown(index)" title="Down">↓</button>
              <button class="ve-tree__btn ve-tree__btn--danger" @click.stop="deleteBlock(blok._uid)" title="Delete">×</button>
            </span>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Editable canvas -->
    <div ref="containerRef" class="ve-canvas">
      <div
        v-for="(blok, index) in body"
        :key="blok._uid"
        :data-blok-uid="blok._uid"
        :data-blok-component="blok.component"
        class="ve-block"
        :class="{ 've-block--selected': selectedBlocks.has(blok._uid) }"
        @click="selectBlock(blok._uid)"
      >
        <div class="ve-block__label font-mono">{{ blok.component }}</div>
        <DynamicBlock :blok="blok" />
      </div>
    </div>

    <!-- Add Block Dialog -->
    <Teleport to="body">
      <div v-if="dialogOpen" class="ve-dialog-overlay" @click.self="dialogOpen = false">
        <div class="ve-dialog">
          <h3 class="ve-dialog__title font-mono ttu tracked">Add Block</h3>
          <div class="ve-dialog__grid">
            <button
              v-for="block in availableBlocks"
              :key="block.name"
              class="ve-dialog__option font-mono"
              @click="addBlock(block.name)"
            >
              {{ block.label }}
            </button>
          </div>
          <button class="ve-dialog__close font-mono" @click="dialogOpen = false">Cancel</button>
        </div>
      </div>
    </Teleport>
  </div>

  <!-- Production: just render blocks -->
  <div v-else class="ve-canvas">
    <DynamicBlock
      v-for="blok in body"
      :key="blok._uid"
      :blok="blok"
    />
  </div>
</template>

<style scoped>
.visual-editor {
  display: flex;
  min-height: 100svh;
}

/* Sidebar */
.ve-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 16rem;
  background: var(--paper);
  border-right: 1px solid var(--line);
  z-index: 100;
  overflow-y: auto;
  padding: 1rem;
}
.ve-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line);
}
.ve-sidebar__title {
  font-size: 0.75rem;
  margin: 0;
}
.ve-add-btn {
  background: var(--ink);
  color: var(--paper);
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: opacity 0.15s;
}
.ve-add-btn:hover {
  opacity: 0.8;
}

/* Group */
.ve-group {
  margin-bottom: 0.5rem;
}
.ve-group__toggle {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  background: none;
  border: none;
  padding: 0.4rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  font-size: 0.7rem;
}
.ve-group__toggle:hover {
  background: var(--paper-1);
}
.ve-group__icon {
  font-size: 0.6rem;
  width: 0.6rem;
  text-align: center;
}
.ve-group__name {
  flex: 1;
  text-transform: capitalize;
}
.ve-group__count {
  background: var(--line);
  padding: 0.05rem 0.35rem;
  border-radius: 8px;
  font-size: 0.6rem;
}

/* Tree */
.ve-tree {
  list-style: none;
  margin: 0;
  padding: 0 0 0 1rem;
}
.ve-tree__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.ve-tree__item:hover {
  background: var(--paper-1);
}
.ve-tree__item--active {
  background: var(--line);
  outline: 1px solid rgba(0, 128, 255, 0.6);
}
.ve-tree__name {
  font-size: 0.65rem;
  text-transform: capitalize;
}
.ve-tree__actions {
  display: flex;
  gap: 0.1rem;
}
.ve-tree__btn {
  background: none;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.05rem 0.2rem;
  border-radius: 2px;
  line-height: 1;
}
.ve-tree__btn:hover {
  background: var(--line);
}
.ve-tree__btn--danger {
  color: #e00;
  font-size: 0.9rem;
  line-height: 0.7;
}
.ve-tree__btn--danger:hover {
  color: #f00;
}

/* Canvas */
.ve-canvas {
  flex: 1;
  margin-left: 16rem;
  position: relative;
}

/* Block */
.ve-block {
  position: relative;
  outline: 2px solid transparent;
  outline-offset: -2px;
  transition: outline-color 0.15s;
}
.ve-block:hover {
  outline-color: rgba(0, 128, 255, 0.4);
}
.ve-block--selected {
  outline-color: rgba(0, 128, 255, 0.8);
}
.ve-block__label {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 128, 255, 0.9);
  color: #fff;
  font-size: 0.6rem;
  padding: 0.15rem 0.4rem;
  border-radius: 0 0 0 4px;
  z-index: 10;
  pointer-events: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Dialog */
.ve-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.ve-dialog {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 1.5rem;
  min-width: 20rem;
  max-width: 90vw;
}
.ve-dialog__title {
  font-size: 0.8rem;
  margin: 0 0 1rem;
}
.ve-dialog__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.ve-dialog__option {
  background: var(--paper-1);
  border: 1px solid var(--line);
  padding: 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.7rem;
  text-transform: capitalize;
  transition: background 0.15s;
}
.ve-dialog__option:hover {
  background: var(--line);
}
.ve-dialog__close {
  background: none;
  border: 1px solid var(--line);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.7rem;
}
.ve-dialog__close:hover {
  background: var(--paper-1);
}
</style>
