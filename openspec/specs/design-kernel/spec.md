# design-kernel Specification

## Purpose
TBD - created by archiving change add-mode-wheel-one-pager. Update Purpose after archive.
## Requirements
### Requirement: Mode token kernels

The site SHALL define four complete design-token kernels — `essential`
(default), `brutal`, `clay`, `generative` — each as a CSS
custom-property set covering type scale/weights, color, border/line weight,
spacing, radius, shadow, and motion character, keyed on
`:root[data-mode][data-theme]`.

#### Scenario: Mode switch

- **WHEN** the active mode changes
- **THEN** the only DOM mutation is the `data-mode` attribute on `:root`
- **AND** every themed component re-skins via custom properties with no
  re-render

#### Scenario: Default load

- **WHEN** the page loads with no persisted preference
- **THEN** mode is `essential` (silent-luxury posture greets first;
  the wheel proves range) and theme follows `prefers-color-scheme`

### Requirement: Forbidden-hue color law

No kernel color token SHALL have a hue in the forbidden bands: red
345°–15°, blue 195°–270° (cyan included), purple/violet 270°–345°.
Kernels SHALL use a paper/ink achromatic core with at most one riso spot
ink from the allowed yellow–orange–green territory (`essential`:
achromatic, no spot; `brutal`: Riso Orange `#FF6C2F`; `clay`: Riso Green
`#00A95C` with Sunflower Yellow `#FFE800` highlight; `generative`:
ink/paper duotone grade over the shader). Work imagery and client
artwork are exempt.

#### Scenario: Forbidden hue introduced

- **WHEN** a kernel token with a hue inside a forbidden band is added to
  `uno.config.ts`
- **THEN** the color-law unit test fails (vitest iterates every token,
  converts to hue, asserts against the bands)

### Requirement: Preset typography

Type SHALL come from exactly two self-hosted families: Archivo variable
(wght 100–900 + width axis) for display and body, IBM Plex Mono for
labels/meta/nav rail. The scale SHALL be the vendored Tachyons `f1–f7`
steps plus one per-mode fluid `--type-display` token. No additional
font-family may be introduced.

#### Scenario: Mode changes type character, not family

- **WHEN** the active mode changes
- **THEN** only weight/width/tracking/scale tokens change; the two
  families remain the only fonts loaded

### Requirement: Single styling truth

All styling SHALL come from the Tachyons utility vocabulary served through
UnoCSS (attributify mode) plus mode-kernel custom properties, with
`uno.config.ts` as the single source of truth. Arbitrary utility values,
rogue color literals, inline `style=`, and any second styling system SHALL
fail the build.

#### Scenario: Off-system style attempted

- **WHEN** a commit introduces an arbitrary value or non-kernel color
- **THEN** the build (UnoCSS blocklist / lint gate) exits non-zero

#### Scenario: Design doc regeneration

- **WHEN** `design:doc` runs
- **THEN** `DESIGN.md` is regenerated from `uno.config.ts`; hand edits are
  never required and are overwritten

### Requirement: Layer truth table

Every component SHALL declare a layer: `pinned` (always visible across all
modes, may overlap the grid — wordmark, mode wheel, Project Index trigger,
theme toggle) or `themed` (fully re-skinned by the active mode). Layer
resolution SHALL be a pure function.

#### Scenario: Pinned element across modes

- **WHEN** any of the four modes is active
- **THEN** every pinned element remains visible and legible

#### Scenario: Truth table verified

- **WHEN** unit tests run
- **THEN** the full layer × mode matrix is asserted

### Requirement: Orthogonal light/dark theming

Light/dark SHALL be independent of mode (4 × 2 matrix). Default follows
`prefers-color-scheme`; a pinned toggle persists the choice to
`localStorage` and applies before first paint (no flash of wrong theme).

#### Scenario: Toggle persists

- **WHEN** a visitor toggles the theme and reloads
- **THEN** the chosen theme applies before first paint in the same mode

