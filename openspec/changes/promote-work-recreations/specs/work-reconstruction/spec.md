# work-reconstruction

## ADDED Requirements

### Requirement: The work page IS the recreation

Visiting `/works/<slug>` for any visible work SHALL render the reference site's
signature layout as the entire page — full-bleed, edge-to-edge, with no
case-study prose, stage frame, rulers, palette footer, or source line in the DOM.
The only portfolio chrome SHALL be a single fixed mono `← INDEX` link; the
centred index pill, the corner mark, and the theme toggle SHALL be withheld.

#### Scenario: Opening a work page

- **WHEN** a visitor opens `/works/f853`
- **THEN** the page shows the recreated layout itself (the text-index column
  beside a live clock), filling the viewport as the source does
- **AND** the only non-recreation element visible is the fixed `← INDEX` link

### Requirement: 1:1 fidelity, mobile-first to desktop

Each recreation SHALL be built mobile-first and SHALL match its reference
(`refs/works/<slug>.jpg`) at the reference's native width on **cap height,
alignment edges, element position, and block aspect/centre**, transcribed from
measurement rather than judged by eye.

Glyph-width equality SHALL NOT be a target: de-branded titles and the kernel's
own typeface legitimately differ in width from the source. Where a reference's
subject is photographic, its layout box is unmeasurable and the recreation SHALL
follow the source's evident intent.

#### Scenario: Transcribing a reference

- **WHEN** a work page's layout rules are written
- **THEN** they derive from `scripts/ref-geometry.py <slug>` output, expressed in
  `cqw` against the page's own `container-type: inline-size`

#### Scenario: Desktop side-by-side

- **WHEN** the built page is screenshotted at the reference's native width and
  placed beside it
- **THEN** cap heights, column positions, margins, and wrap points visibly match

#### Scenario: Phone width

- **WHEN** the page is viewed at 375 px
- **THEN** the source layout adapts naturally (no horizontal scroll, no
  collapsed/overlapping text), as the mobile-first build of the same design

### Requirement: Ownership and provenance

Reference renders of third-party source sites SHALL live only in `refs/`
(gitignored) as build-time inputs, and SHALL NEVER be committed under `public/`,
shipped in `dist/`, or rendered on any surface. Imagery served from
`public/works/` SHALL be the curated licensed stock set. Every recreation SHALL
ship only owned bytes: de-branded structural echoes in place of client
titles/wordmarks, no third-party code, assets, or platform names on any public
surface. Live mechanics in the source SHALL run live in the recreation.

#### Scenario: A reference is published by mistake

- **WHEN** a reference screenshot is copied into `public/works/`
- **THEN** `test/work-provenance.test.ts` fails — on byte-identity with the
  `refs/` original **and** independently on the 16:10 render shape

#### Scenario: Scraping a new work

- **WHEN** `pnpm scrape:works <id>:<slug>` runs
- **THEN** the source render lands in `refs/works/<slug>.jpg`, the draft's
  `image` is a TODO for hand-curated licensed art, and imagery for an
  already-curated work is left untouched

#### Scenario: Live mechanic

- **WHEN** the source's signature behaviour is interactive (e.g. F853's
  real-time clock, H724's cursor-zone slideshow)
- **THEN** the recreation implements it working, in our own code

### Requirement: S'MAC shows the before/after contrast

`/works/smac` SHALL present the client engagement as a contrast between the site
**as found** and the delivered redesign running at `smac.blueredandpurple.world`,
via a slider. Both halves SHALL be rebuilt in-kernel; the "before" SHALL NOT be
an image of the client's original site.

#### Scenario: Dragging the contrast

- **WHEN** a visitor drags the slider
- **THEN** the as-found reconstruction and the delivered redesign are revealed
  against each other in place

#### Scenario: No JS

- **WHEN** the page loads without JavaScript
- **THEN** the delivered redesign is shown and remains readable

### Requirement: Archived case-study copy

The former case-study narrative for each work SHALL be preserved verbatim as a
frontmatter comment block in that work's page file, and SHALL NOT be rendered.

#### Scenario: Reading the archive

- **WHEN** a developer opens `src/pages/works/h724.astro`
- **THEN** the removed lede/narrative/notes copy is readable in a comment headed
  "Archived case-study copy"
- **AND** none of it appears in the built HTML

### Requirement: Only shown works exist as pages

The works collection and routes SHALL contain exactly the visible works. Hidden
works and the generic work template SHALL be deleted (git history is the
archive), so their URLs return 404.

#### Scenario: Hidden work URL

- **WHEN** a visitor requests `/works/d445` (or `warm-fuzzy`, `s176`, `z922`,
  `roxy-bar`)
- **THEN** the site returns 404 — no generic-template page is built

#### Scenario: Index coverage

- **WHEN** the Project Index at `/works` renders
- **THEN** it lists exactly the 13 visible works, and every row navigates to a
  bespoke recreation page
