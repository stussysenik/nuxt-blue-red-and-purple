# adaptive-performance — Delta

## ADDED Requirements

### Requirement: 120fps compositor-only animation gate
All site-wide animations and transitions SHALL target only compositor-friendly
properties — `transform`, `opacity`, `filter` — never layout properties
(width, height, top/left, margin, padding, font-size, inset). This law covers
GSAP/motion.dev showcase templates and view transitions equally. A static test
SHALL scan page sources and built CSS for animation/transition declarations
targeting layout properties and fail on any hit. Layout-shift showcase
concepts SHALL achieve their effect via FLIP/transform composition.

#### Scenario: Gate catches a layout animation
- **WHEN** a transition on `height` is introduced in any page or stylesheet
- **THEN** the gate test fails naming the file and property

#### Scenario: Heaviest page holds frame budget
- **WHEN** the heaviest template is traced on a 120Hz display during its
  primary motion
- **THEN** no long frames are attributable to style/layout work from
  animation (verified once per release via DevTools trace)
