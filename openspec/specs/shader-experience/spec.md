# shader-experience Specification

## Purpose
TBD - created by archiving change add-shader-loop-site. Update Purpose after archive.
## Requirements
### Requirement: Full-viewport continuous shader loop

The `generative` mode SHALL render the existing WebGL2 fragment-shader
visual (`src/scenes.ts`, preserved unmodified) as its full-viewport
background layer, animating continuously while the mode is active. When any
other mode is active, the shader loop SHALL be suspended (no rAF, no GPU
work) and resume seamlessly on return.

#### Scenario: Generative mode active

- **WHEN** a visitor selects the `generative` mode in a WebGL2-capable
  browser
- **THEN** the canvas fills the viewport at device resolution (DPR-aware)
- **AND** the visual is animating within the first second

#### Scenario: Other mode active

- **WHEN** any non-generative mode is active
- **THEN** the shader loop is suspended with zero per-frame CPU/GPU cost

#### Scenario: Long session

- **WHEN** the generative mode stays active for an hour
- **THEN** the visual is still animating with no accumulated drift
  artifacts (time uniforms wrap or use scene-local time)

### Requirement: Scene carousel
The experience SHALL cycle through a registry of at least 3 distinct scene
shaders — each modeling an optical-physics phenomenon (thin-film
interference, metallic-flake glint, anisotropic specular sweep) — each
running for its configured duration before transitioning to the next,
looping indefinitely.

#### Scenario: Automatic cycling
- **WHEN** a scene's duration elapses
- **THEN** a crossfade transition to the next registry scene begins
- **AND** after the final scene the carousel returns to the first

#### Scenario: Adding a scene
- **WHEN** a developer adds one fragment shader file and one registry entry
- **THEN** the new scene enters the rotation with no pipeline code changes

### Requirement: Shader-space transitions
Scene changes SHALL be rendered as GPU crossfades in a composite pass
(both scenes rendered to textures and blended), not DOM/CSS fades.

#### Scenario: During a transition
- **WHEN** a transition is in progress
- **THEN** both outgoing and incoming scenes render and blend smoothly
  over 1–2 seconds with an eased mix curve

### Requirement: Unified pastel palette and dithering
The composite pass SHALL grade all scenes into a shared pastel
blue/red/purple palette and SHALL apply blue-noise (or ordered) dithering
so gradients show no visible banding on 8-bit displays.

#### Scenario: Palette cohesion
- **WHEN** any scene renders
- **THEN** its output colors come from the shared palette definition
  (soft pastel blues, reds, purples — no colors outside that family)

#### Scenario: Banding check
- **WHEN** a slow pastel gradient is inspected on an 8-bit display
- **THEN** no contour bands are visible (dither noise replaces banding)

### Requirement: WebGL2 failure fallback
The site SHALL detect WebGL2 context failure and fall back to a static CSS
gradient in the same palette rather than a blank or broken page.

#### Scenario: Context unavailable
- **WHEN** WebGL2 context creation fails or the context is lost and not
  restored
- **THEN** a pastel blue/red/purple CSS gradient background is shown and
  the text overlay remains fully functional

