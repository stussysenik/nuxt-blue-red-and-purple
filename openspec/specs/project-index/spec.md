# project-index Specification

## Purpose
TBD - created by archiving change add-mode-wheel-one-pager. Update Purpose after archive.
## Requirements
### Requirement: Project Index

A pinned "Project Index" trigger SHALL open a full-screen index of works
(refs `refs/SCR-20260715-pmhp.png`, `refs/SCR-20260715-pmjh.png` in this
change): big centered type rows with
superscript index numbers (`(N1)`…) carrying title / category / year,
blurred work imagery ghosted behind the list. Rows SHALL use the dot
language: outlined dot when idle, filled dot on hover/focus/active. Rows
SHALL be keyboard focusable; the index SHALL trap focus and close on
`Esc` / explicit close control.

#### Scenario: Hover state

- **WHEN** the cursor or focus moves over a row
- **THEN** its dot fills and the row shows the active treatment of the
  current mode kernel

#### Scenario: Pinned across modes

- **WHEN** any mode is active
- **THEN** the Project Index trigger remains visible (pinned layer)

### Requirement: Full-screen work page

Selecting a work SHALL open that work as a complete one-page layout
(no routing — a layered full-screen surface): hero title, imagery,
summary, palette, and its signature mechanic expressed through the mode
kernel — one `work-page` template driven entirely by the work's
collection data. The page SHALL be rendered and served locally; it SHALL
NOT iframe, hotlink, or link out to the source site (`source` is
attribution metadata only). It SHALL trap focus, close on `Esc` and on
an explicit close control, returning to the index with focus on the
originating row; `Esc` from the index returns to the site.

#### Scenario: Open and close

- **WHEN** a visitor activates an index row
- **THEN** the work page fills the viewport as a one-page layout built
  from local data and assets only (zero third-party requests)
- **WHEN** `Esc` is pressed
- **THEN** the work page closes and focus returns to the index row

#### Scenario: Data-driven expression

- **WHEN** two works with different `palette`/`mechanic` values open
- **THEN** both render through the same `work-page` template with
  visibly distinct expression, without any per-work bespoke component

### Requirement: Works content collection

Works SHALL live in an Astro content collection validated by schema:
`{ slug, title, category: restaurant|hotel|music|vintage|books, year,
image, summary, palette?, mechanic?, source?, real? }`. Version 1 SHALL seed 18
works: `smac` (smac.blueredandpurple.world, `real: true`, featured
FIRST) plus the 17 surveyed works from `works-survey.md` with their
scraped names, palettes, and mechanics; lorem appears only in `summary`
prose. Each work's `image` SHALL be a high-fidelity stock photograph
(curated Unsplash, category-coherent), downloaded into `public/works/`
and committed — never hotlinked, never a screenshot of the source site.
Imagery is exempt from the color law; the `essential` kernel MAY apply a
duotone filter token. The schema SHALL accept future scraped batches
without change.

#### Scenario: Invalid work rejected

- **WHEN** a work file violates the schema (e.g. unknown category)
- **THEN** the build fails with a validation error

### Requirement: Index is mobile-clean and chrome-safe

The /works index SHALL scroll naturally when its groups outgrow any viewport,
SHALL keep every row fully visible and tappable at 320px width and up, and
SHALL clear the chrome band (Close above, theme toggle below) at all sizes —
onepagelove/iA-Writer restraint: generous whitespace, centered measure, no
clipped or crowded rows.

#### Scenario: Full list reachable on a phone

- **WHEN** the index renders at 375×667 with more rows than fit the viewport
- **THEN** the document scrolls to every row, the first group label clears the
  Close anchor, and no row overlaps the theme toggle

### Requirement: Template titles render in quotes

Every template row in the /works index SHALL render its title wrapped in
typographic quotes (e.g. “D445”), marking each entry as a named template
artifact rather than a client brand. The live client service (`real: true`,
smac) SHALL render unquoted — it is a real deployment, not a template.

#### Scenario: Templates are visibly templates

- **WHEN** the index lists the works
- **THEN** every study title appears as “Title” with real typographic quotes
  (never straight quotes), and smac's title appears without quotes

#### Scenario: Ghost backdrop never blocks reading

- **WHEN** a row is hovered or focused and its blurred image ghost paints
- **THEN** row text retains legible contrast and the ghost never intercepts
  pointer events

