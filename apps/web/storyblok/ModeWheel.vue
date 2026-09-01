<script setup lang="ts">
import type { ModeWheelBlock } from '~/types/storyblok'
import { useMode } from '~/composables/useTheme'

const { mode, setMode } = useMode()

const props = defineProps<{
  blok: ModeWheelBlock
}>()

// Modes come from Storyblok — editable names, order, and which are active.
// Falls back to the four canonical modes if the block is empty.
const modes = computed(() => {
  if (props.blok.modes?.length) {
    return props.blok.modes.filter((m) => m.enabled !== false).map((m) => ({
      id: m.mode_id,
      name: m.name,
    }))
  }
  return [
    { id: 'essential', name: 'Essential' },
    { id: 'brutal', name: 'Brutal' },
    { id: 'clay', name: 'Clay' },
    { id: 'generative', name: 'Generative' },
  ]
})

const activeIndex = computed(() => modes.value.findIndex((m) => m.id === mode.value))

function selectMode(id: string) {
  setMode(id as 'essential' | 'brutal' | 'clay' | 'generative')
}

function onKeydown(event: KeyboardEvent, index: number) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    const next = modes.value[(index + 1) % modes.value.length]
    if (next) selectMode(next.id)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    const prev = modes.value[(index - 1 + modes.value.length) % modes.value.length]
    if (prev) selectMode(prev.id)
  } else if (event.key === 'Home') {
    event.preventDefault()
    selectMode(modes.value[0]?.id ?? 'essential')
  } else if (event.key === 'End') {
    event.preventDefault()
    selectMode(modes.value[modes.value.length - 1]?.id ?? 'generative')
  }
}
</script>

<template>
  <div v-editable="blok" class="mode-wheel" role="radiogroup" aria-label="Design mode">
    <button
      v-for="(m, i) in modes"
      :key="m.id"
      type="button"
      class="mode-wheel__slot"
      role="radio"
      :aria-checked="m.id === mode ? 'true' : 'false'"
      :tabindex="m.id === mode ? 0 : -1"
      @click="selectMode(m.id)"
      @keydown="onKeydown($event, i)"
    >
      <span class="mode-wheel__dot" :data-on="m.id === mode ? 'true' : 'false'" />
      <span class="mode-wheel__label">{{ m.name }}</span>
    </button>
    <span
      class="mode-wheel__marker"
      :style="{ transform: `translateX(${activeIndex * 100}%)`, width: `${100 / modes.length}%` }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.mode-wheel {
  position: relative;
  display: flex;
  align-items: center;
  width: min(100%, 30rem);
  padding-bottom: 0.7rem;
  color: var(--ink);
  user-select: none;
}

.mode-wheel__slot {
  flex: 1 1 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.3rem 0.2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-weight: var(--wght-label, 450);
  font-size: 0.72rem;
  letter-spacing: var(--tracking-label, 0.28em);
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.mode-wheel__slot[aria-checked='true'],
.mode-wheel__slot:hover,
.mode-wheel__slot:focus-visible {
  color: var(--ink);
}

.mode-wheel__slot:focus-visible {
  outline: 1px solid var(--ink);
  outline-offset: 3px;
}

.mode-wheel__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 100%;
  border: 1px solid currentColor;
  background-color: transparent;
  flex: none;
  transition: background-color 0.25s ease;
}

.mode-wheel__slot[aria-checked='true'] .mode-wheel__dot,
.mode-wheel__slot:hover .mode-wheel__dot,
.mode-wheel__slot:focus-visible .mode-wheel__dot {
  background-color: currentColor;
}

.mode-wheel__label {
  white-space: nowrap;
}

.mode-wheel__marker {
  position: absolute;
  left: 0;
  bottom: 0;
  height: var(--border-w, 2px);
  background-color: var(--spot, var(--ink));
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  .mode-wheel__marker {
    transition: none;
  }
  .mode-wheel__slot {
    transition: none;
  }
}
</style>
