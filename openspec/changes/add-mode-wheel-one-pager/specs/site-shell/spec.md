# site-shell Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Quality gate

The project SHALL pass `oxlint` (correctness/suspicious/perf as errors),
strict `tsc --noEmit`, `astro check`, and the vitest unit suite with zero
failures before any deploy.

#### Scenario: Pre-deploy check

- **WHEN** the `check` and `test` scripts execute
- **THEN** oxlint, tsc, astro check, and vitest all exit 0
