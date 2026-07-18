# site-shell Specification

## Purpose
TBD - created by archiving change add-shader-loop-site. Update Purpose after archive.
## Requirements
### Requirement: Text overlay
The site SHALL display the wordmark "blueredandpurple" as a single
unchanging DOM text element layered above the canvas, legible against all
scenes, selectable, and exposed to assistive technology.

#### Scenario: Overlay rendering
- **WHEN** the page loads
- **THEN** the wordmark text is visible above the shader with sufficient
  contrast on every scene (verified against the lightest palette output)
- **AND** it is real text in the DOM (not canvas-drawn), announced by
  screen readers

### Requirement: Document metadata
The page SHALL ship a proper `<title>`, description, theme-color, favicon,
and Open Graph tags reflecting the blue/red/purple identity.

#### Scenario: Link shared
- **WHEN** the URL is shared or crawled
- **THEN** title, description, and OG image/color metadata are present

### Requirement: Quality gate

The project SHALL pass `oxlint` (correctness/suspicious/perf as errors),
strict `tsc --noEmit`, `astro check`, and the vitest unit suite with zero
failures before any deploy.

#### Scenario: Pre-deploy check

- **WHEN** the `check` and `test` scripts execute
- **THEN** oxlint, tsc, astro check, and vitest all exit 0

### Requirement: Astro one-pager shell

The site SHALL be a single Astro 5 page (`src/pages/index.astro`, static
output) with interactivity delivered only as Lit 3 islands (mode wheel,
project index, work overlay, theme toggle). No client-side routing.

#### Scenario: Zero-JS baseline

- **WHEN** the page is built
- **THEN** only the declared islands ship JavaScript; all other content is
  static HTML

### Requirement: Smooth scroll

Page scrolling SHALL run through Lenis, wired into GSAP ScrollTrigger via
its ticker. When `prefers-reduced-motion` is set, Lenis SHALL be disabled
in favor of native scrolling.

#### Scenario: Reduced motion fallback

- **WHEN** `prefers-reduced-motion` is set
- **THEN** native scroll is used and scroll-driven reveals degrade to
  static visibility

### Requirement: One-pager content sections

The page SHALL render, per the hero comp
(`refs/SCR-20260715-qunr.png` in this change):
§00 wordmark + monogram glyph; §01 hero — staggered `*BLUE RED +
PURPLE/` wordmark, tagline `TOO MUCH BLUE WILL NEVER AMOUNT TO ANY RED`,
left nav rail (`WORKS / PHILOSOPHY / ABOUT US / CONTACTS`) with the dot
marker on the active item, and the mode wheel on the hero line;
§02 manifesto/philosophy with progressing text weight per line;
§03 selected works (featured ★ works, big pictures); §04 clientele —
five categories with the one-page specialization pitch; §05 Project
Index; §06 contact/colophon. In `essential` mode the exposed
construction/ruler grid lines of the comp SHALL be visible as hairline
design elements.

#### Scenario: Hero fidelity

- **WHEN** the page loads in `essential` mode
- **THEN** the staggered wordmark, tagline, dot-marked nav rail, and
  hairline construction grid render per the comp

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

