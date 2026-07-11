# Project Context

## Purpose
blueredandpurple.world — a single-page generative-art website. The entire
experience is a continuously looping, full-viewport GPU shader in pastel
blues, reds, and purples, with a minimal HTML text overlay.

## Tech Stack
- Vite + TypeScript (strict), zero runtime dependencies
- Raw WebGL2 fragment shaders (no Three.js, no WASM)
- oxlint + `tsc --noEmit` as the quality gate
- Hosting: Vercel; registrar/DNS: Spaceship (API keys in `.env.local`)

## Project Conventions
- Essentialist diffs: smallest precise expression, no speculative abstraction
- Data-oriented: scenes are data (shader source + metadata) in a registry;
  the render loop is a pure consumer of that registry
- UI = f(state): all visual state flows through uniforms; no hidden mutable
  state inside render objects
- Binary truth: no "done" without build + typecheck + lint green and the
  page verified rendering in a real browser
