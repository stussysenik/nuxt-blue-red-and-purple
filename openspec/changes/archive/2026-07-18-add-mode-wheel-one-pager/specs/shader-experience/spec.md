# shader-experience Spec Delta

## MODIFIED Requirements

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
