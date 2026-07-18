# demo-chrome — Delta

## ADDED Requirements

### Requirement: Layer inspector with structure↔content view
Every template page SHALL mount an inspector that can peel the template to its
bare structural skeleton (no content, the solved bones) and snap back to the
embodied render, and that exposes each render layer as an independent control.
Layer axes — color (default / inverted), imagery (on / B&W / none), typography
(template face / alternate) — SHALL be one `data-*` attribute each on the root
driving CSS custom properties. Switching any axis SHALL cause zero layout shift
and zero flash of unstyled/mis-themed content; with imagery "none", slots keep
their reserved ground. Inspector state applies before first paint on load.

#### Scenario: Peel to the solved skeleton
- **WHEN** the structure view is toggled on
- **THEN** the template renders its bare skeleton with content removed, and
  toggling back restores the embodied render with zero layout shift

#### Scenario: B&W mode
- **WHEN** the imagery axis is set to B&W
- **THEN** all template imagery renders grayscale via CSS filter, with layout,
  interactivity, and motion unchanged

#### Scenario: No-imagery preserves composition
- **WHEN** the imagery axis is set to none
- **THEN** slots hide photos but keep dimensions and ghost ground; CLS from the
  switch is 0

#### Scenario: Inspector is chrome, not content
- **WHEN** any template page renders
- **THEN** the inspector occupies the same reserved chrome position on every page
  and never overlaps page-owned content

### Requirement: Feed content — try the engine live
The inspector SHALL let the viewer swap the active content tree from a set of
curated sample trees, and the template SHALL re-embody the new tree live with no
crash on any provided sample.

#### Scenario: Prospect feeds a different idea
- **WHEN** the viewer selects a different sample content tree
- **THEN** the same template renders that tree through its paradigm without
  reloading and without error

### Requirement: Built-in device preview
Every template page SHALL offer a device-preview mode rendering the same page in
a real same-origin iframe at phone portrait and landscape dimensions, scaled to
fit via transform. The framed document SHALL hide spine and inspector (frame
query parameter) and SHALL reflect the current dial and content state. Real
viewport semantics (container queries, svh) apply inside the frame.

#### Scenario: Phone preview without devtools
- **WHEN** the viewer activates device preview (portrait)
- **THEN** the template renders in a 390×844 viewport iframe, scaled to fit,
  showing its true mobile layout

#### Scenario: Dialed, content-matched preview
- **WHEN** the dial is set to B&W with a chosen sample tree and preview opens
- **THEN** the framed template renders in B&W with that same content tree

### Requirement: Always-visible inquiry CTA
Every template page SHALL present an inquiry call-to-action at fixed chrome
coordinates, visible without scrolling or opening a menu, on every page — the
negotiation path from the moment the engine lands.

#### Scenario: One click to inquire
- **WHEN** any template page is viewed at any scroll position
- **THEN** the inquiry CTA is visible and actionable in one click
