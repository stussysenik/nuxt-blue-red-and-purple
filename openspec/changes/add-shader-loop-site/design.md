# Design — Shader Loop Site

## Decision 1: No Rust/WASM
The compute-heavy work (noise fields, dithering, color) runs on the GPU as
fragment shaders regardless of host language. CPU-side work is glue only:
compile shaders, tick a clock, upload ~10 uniforms/frame, schedule
transitions. Rust/WASM would replace trivial TypeScript with a build
toolchain for zero visual gain. Revisit only if a CPU-bound simulation
(million-agent particles, physics) ever enters scope.

## Decision 2: Scene-to-texture + composite pass (not an über-shader)
Two candidate architectures for the "carousel of effects":

1. **Chosen — render scenes to textures, blend in a composite pass.**
   Each scene stays an independent small `.frag`. Transitions become their
   own creative surface (dissolves, warps — the shader-space analog of
   "GSAP effects"). Off-transition cost is one scene render + a cheap
   composite. During a transition only, two scenes render (bounded, ~1–2 s).
2. Rejected — single über-shader with all scenes mixed by a uniform.
   Simpler pipeline but compile time and GLSL branching cost grow with
   every scene, and scenes stop being independently editable.

The composite pass also owns blue-noise dithering and the final palette
grade, so every scene automatically shares the pastel blue/red/purple
identity and no scene can ship banding.

## Decision 2b: Scenes are optical-physics models, not abstract noise
Direction confirmed by the user: the feel of metallic car paint —
view-dependent color. Each scene is grounded in a real optical phenomenon,
approximated in 2D screen space with normals derived from slowly-evolving
noise fields:

1. **Thin-film interference** (soap film / clearcoat iridescence):
   color from optical path difference `2·n·d·cos θ`, mapped into the
   pastel blue/red/purple band instead of the full spectrum.
2. **Metallic flake**: sparse pseudo-random micro-facets (hash-based
   glints) over a base coat; flakes catch a moving virtual light and
   shimmer — this scene leans hardest on the blue-noise dither aesthetic.
3. **Anisotropic specular sweep** (brushed metal / silk): elongated
   highlight bands following a flow field, light source drifting slowly.

A shared `lighting.glsl` include provides the fake-normal-from-noise and
palette-mapping helpers so scenes stay small and consistent.

## Decision 3: Scene registry (data-oriented)
A scene is data: `{ id, fragSource, duration }` in a typed registry array.
The director (carousel scheduler) and renderer consume the registry; adding
a scene never touches pipeline code.

## Decision 4: Adaptive quality loop
- `requestAnimationFrame` with delta-time — never assume 60 Hz (ProMotion
  120 Hz, 144 Hz desktops). All motion is a function of elapsed seconds.
- DPR capped at 2; render-target resolution scales down (never below 0.5×)
  when the smoothed frame time exceeds budget, before frames drop.
- `prefers-reduced-motion`: time scale drops to ~5% — slow drift, not a
  freeze (a static frame kills the concept; drift respects the intent).
- `visibilitychange`: rAF loop fully stops when hidden.

## Decision 5: Overlay is DOM, not shader
Text rendered in HTML above the canvas: accessible, selectable, crawlable,
crisp at any DPR. Entrance animation via CSS only.

## Deployment shape
Static Vite build → Vercel. DNS: Spaceship API (keys already in
`.env.local`) sets A/ALIAS + CNAME per Vercel's domain instructions.
