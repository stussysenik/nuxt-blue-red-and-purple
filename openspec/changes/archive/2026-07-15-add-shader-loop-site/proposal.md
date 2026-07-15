# Add Shader Loop Site

## Why
The domain blueredandpurple.world is bought and parked with nothing on it.
The site's whole identity is a continuously looping, computationally
generated visual: a carousel of organic pastel blue/red/purple shader
scenes, easy on the eyes, tuned to the viewer's display, with a small text
overlay. Nothing exists yet — this change ships the first production
version end to end.

## What Changes
- Scaffold the project: Vite + strict TypeScript, oxlint, zero runtime deps.
- Build a WebGL2 render pipeline: fullscreen triangle, scene shaders
  rendered to textures, a composite pass that blends scenes, applies
  blue-noise dithering (kills pastel banding, provides the organic/dithered
  aesthetic), and grades everything into one shared pastel palette.
- Ship 3 scene shaders at launch, each modeling an optical-physics
  phenomenon from the metallic-car-paint family — thin-film interference
  (iridescence), metallic-flake sparkle, anisotropic specular sweep —
  cycling on a timed carousel with shader-space crossfade transitions.
  Adding a scene later = one new `.frag` file + a registry entry.
- Aesthetic north star: pglang.com — minimal, symbolic, nothing on the
  page but the visual and one unchanging text element.
- Adaptive quality: delta-time frame pacing (60/120/144 Hz correct), DPR
  cap, resolution scaling under load, `prefers-reduced-motion` slow-drift
  mode, pause when the tab is hidden.
- Minimal HTML text overlay (wordmark) above the canvas — real DOM text,
  accessible and selectable.
- Deploy to Vercel; point Spaceship DNS for blueredandpurple.world at it.

## Non-Goals
- No Rust/WASM: all heavy computation is GPU-side GLSL; the CPU glue is
  ~200 lines of TS. WASM adds a toolchain for zero visual gain.
- No GSAP or other runtime libraries: uniform easing is ~20 lines; text
  intro animation is CSS.
- No routing, CMS, analytics, or additional pages.

## Open Questions
- None. Overlay copy confirmed: the company wordmark "blueredandpurple"
  (single unchanging text element; final branding TBD later).

## Impact
- Affected specs (all new): `shader-experience`, `adaptive-performance`,
  `site-shell`, `deployment`
- Affected code: entire repo (greenfield). `.env.local` gains
  `DOMAIN=blueredandpurple.world`; its stray duplicate
  `SPACESHIP_SECRET_KEY` line gets removed.
