# Design: add-mode-wheel-one-pager

## Context

Rebuild spans framework migration (Vite→Astro), a new styling system, and a
state model that four capabilities share. Stack is locked in SPEC.md §2:
Astro 5 + Lit 3 islands, UnoCSS with full Tachyons vocabulary (attributify),
GSAP (+ScrollTrigger), Lenis, Astro content collections, oxlint + strict tsc.

## Goals / Non-Goals

- Goals: mode switching as pure attribute writes; styling off-system is a
  build error; existing `scenes.ts` survives untouched as `generative` mode.
- Non-Goals: routing/multi-page; second styling system; visual/E2E tests
  (user runs dedicated sessions); batch-2 works data (schema only).

## Decisions

1. **State atom + reducer.** `{ mode, theme, activeWork | null }` — one
   reducer, components dispatch intents; the only DOM write is
   `data-mode`/`data-theme` on `:root` plus overlay open/close. Mode is a
   union of four literals — impossible states unrepresentable.
   - Alternative rejected: per-component state — breaks the truth table.
2. **Mode kernels as CSS custom properties** on
   `:root[data-mode][data-theme]` (4×2 files in `src/styles/modes/`).
   Themed components consume only these variables; switching costs two
   attribute writes, no re-render, GPU-cheap.
3. **Layer truth table.** Components declare `pinned` (wordmark, wheel,
   Project Index trigger, theme toggle — always visible, may overlap grids)
   or `themed` (fully re-skinned). Resolution is a pure function, unit-tested.
4. **CSS enforcement at build.** `uno.config.ts` = single truth: Tachyons
   table (vendored/preset) + mode tokens; arbitrary values blocklisted;
   `DESIGN.md` generated from it (`design:doc` script), never hand-edited.
5. **Wheel math is pure.** Snap-to-nearest(angle, velocity) is a pure
   function unit-tested without GSAP; GSAP only drives the tween. Lenis
   feeds GSAP ScrollTrigger via its ticker.
6. **Shader preservation.** `scenes.ts` untouched; `generative` mode mounts
   the existing loop as background, other modes suspend it (same mechanism
   as background-tab suspension in `adaptive-performance`).

## Risks / Trade-offs

- Astro migration is BREAKING for the current entry point → mitigated by
  milestone 1 landing green (`check` passes) before any feature work.
- Tachyons parity in UnoCSS: preset may drift from tachyons.io docs →
  vendor the table into `uno.config.ts` so we own it.
- GSAP bundle weight is accepted by explicit owner decision (interview,
  2026-07-15); animations still restricted to transform/opacity.
