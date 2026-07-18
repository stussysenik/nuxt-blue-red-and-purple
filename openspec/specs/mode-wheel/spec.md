# mode-wheel Specification

## Purpose
TBD - created by archiving change add-mode-wheel-one-pager. Update Purpose after archive.
## Requirements
### Requirement: Hero-line wheel selector

The hero SHALL include a horizontal wheel selector on the same line as the
hero text, listing the four modes. It SHALL respond to drag, wheel/scroll,
and keyboard (`←`/`→`), with GSAP inertia snapping to the nearest mode.
Snap-to-nearest(angle, velocity) SHALL be a pure, unit-tested function.

#### Scenario: Drag with inertia

- **WHEN** a visitor drags the wheel and releases with velocity
- **THEN** the wheel decelerates and snaps to the nearest mode, which
  becomes active

#### Scenario: Keyboard selection

- **WHEN** the wheel has focus and `→` is pressed
- **THEN** the next mode becomes active and the change is announced to
  assistive technology

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion` is set
- **THEN** inertia is disabled and mode changes apply as opacity-level
  transitions only

### Requirement: Active-state dot language

The wheel SHALL indicate state with the dot language: filled dot for the
active mode, outlined dot for inactive modes; hover previews with the
filled treatment.

#### Scenario: State legibility

- **WHEN** any mode is active in any theme
- **THEN** exactly one filled dot is shown and the remaining dots are
  outlined, meeting contrast requirements in the active kernel

