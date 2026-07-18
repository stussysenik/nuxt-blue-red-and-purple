# site-shell — deltas

## ADDED Requirements

### Requirement: Global chrome band with exclusive corner ownership

The layout SHALL reserve a top chrome band on every page, sized from the shared
`--chrome-inset` token, and each pinned chrome element SHALL own its corner/slot
exclusively per chrome variant (`index`: centered pill + ✳ top-right; `close`:
centered Close + ✳ top-right; `work`: ← Index top-right only). Page-owned
content SHALL NOT render inside the chrome band.

#### Scenario: Work page numeral no longer collides with ← Index

- **WHEN** a work page (e.g. f853) renders content that previously sat in the
  top-right corner
- **THEN** that content sits below the chrome band and the `← INDEX` mark is
  legible in isolation at every viewport width down to 320px

#### Scenario: Band respects safe areas

- **WHEN** the site renders on a device with a top safe-area inset (notch)
- **THEN** the chrome band offsets by `max(var(--chrome-inset),
  env(safe-area-inset-top))` and page content clears it

### Requirement: Scroll reveals are CSS scroll-driven, zero JS

Scroll-entrance motion for content bands SHALL be implemented with CSS
scroll-driven animation (`animation-timeline: view()`) behind an `@supports`
guard, with GSAP/ScrollTrigger removed from every runtime code path. The
no-support and reduced-motion states SHALL render all content fully visible.

#### Scenario: Supporting browser gets compositor reveals

- **WHEN** a browser supporting `animation-timeline: view()` scrolls a content
  band into the viewport
- **THEN** the band rises/fades via CSS animation with no JS scroll listener
  and no GSAP bytes shipped on the page

#### Scenario: Non-supporting browser degrades to static

- **WHEN** the site renders in a browser without scroll-driven animation
  support, or with `prefers-reduced-motion: reduce`
- **THEN** every band is fully visible with no entrance animation and no
  content is ever hidden by a pre-animation state

### Requirement: Smooth scroll survives without GSAP

Lenis SHALL drive document smooth-scrolling via its own requestAnimationFrame
loop (no GSAP ticker), and SHALL fall back to native scroll under
`prefers-reduced-motion: reduce`.

#### Scenario: Wheel scroll is smoothed

- **WHEN** a pointer-wheel user scrolls the home page with motion allowed
- **THEN** Lenis smooths the scroll with its own rAF loop and no `gsap` import
  resolves at runtime
