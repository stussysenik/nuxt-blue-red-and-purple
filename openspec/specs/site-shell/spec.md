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
The project SHALL pass `oxlint` (correctness/suspicious/perf as errors)
and strict `tsc --noEmit` with zero diagnostics before any deploy.

#### Scenario: Pre-deploy check
- **WHEN** `npm run check` executes
- **THEN** oxlint and tsc both exit 0

