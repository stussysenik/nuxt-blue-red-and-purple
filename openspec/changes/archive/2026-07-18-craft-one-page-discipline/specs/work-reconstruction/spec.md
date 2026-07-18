# work-reconstruction — deltas

## ADDED Requirements

### Requirement: A work page is one continuous scrollable composition

Every work page SHALL render as a single continuous composition on one route:
root layout uses `min-height` (never `max-height: 100dvh`), the document
scroller scrolls naturally on every viewport, and no content is clipped by
`overflow: hidden` on the page root. Bespoke framing devices (drawn borders,
folio lines) SHALL be retained and grow with their content.

#### Scenario: Tall composition scrolls on a phone

- **WHEN** a work page's composition exceeds the viewport height at 375px width
- **THEN** the user scrolls the document to reach all content, with no
  horizontal overflow and nothing clipped

#### Scenario: The trap cannot return

- **WHEN** the work-page contract test runs
- **THEN** it fails any work page whose source reapplies `max-height: 100dvh`
  or root-level `overflow: hidden` viewport clipping

### Requirement: Imagery slot renders the committed photo with ghost load-in

Each work page's imagery slot SHALL render the work's committed Gratisography
photograph (`/works/<slug>.jpg`) as an `<img>` with reserved aspect ratio,
`object-fit: cover`, lazy loading below the fold, and a CSS-only skeleton/ghost
state that resolves to the photo on load. Imagery remains exempt from the color
law; chrome tokens remain bound by it.

#### Scenario: Image loads over a ghost

- **WHEN** a work page loads on a slow connection
- **THEN** the slot shows a paper-tint skeleton at the final aspect ratio (no
  layout shift), and the photo fades in via CSS when loaded

#### Scenario: Every slot is filled

- **WHEN** the work-page contract test runs
- **THEN** it fails any work page whose source lacks an `<img` element bound to
  the work's image

### Requirement: A composition where something happens

A work page SHALL be an elaborated one-page composition, not a single static
column: at minimum three distinct movements (e.g. hero, imagery/specimen
passage, detail/closing) each with its own layout treatment on the shared
token ladder, and the work's signature mechanic SHALL be live and discoverable
through interaction or scroll (CSS-first; JS only where CSS cannot express it).
Scrolling the page SHALL visibly progress the composition (scroll-driven
entrances, position/treatment shifts), so the template demonstrates how it
functions in production rather than presenting a frozen card.

#### Scenario: Scroll tells the story

- **WHEN** a visitor scrolls a work page top to bottom with motion allowed
- **THEN** they pass through at least three visually distinct movements and at
  least one scroll-driven or interactive behavior fires (beyond the shared
  band-entrance reveal)

#### Scenario: The mechanic is alive

- **WHEN** a visitor reaches the work's signature-mechanic element
- **THEN** interacting with it (click/hover/scroll per its nature) produces
  its behavior without any label narrating what it does

### Requirement: Trained-eye typographic discipline, no self-annotation

Work pages SHALL read as clean interface templates, not annotated art pieces:
running text sets ragged-right (`text-align: left`; full justification is
banned — browser H&J produces rivers), display titles balance their line breaks
(`text-wrap: balance`), and the page SHALL NOT render self-referential
meta-labels that describe its own mechanics (e.g. "specimen · zoom disabled",
"ZOOM · OFF" chrome). A mechanic either expresses itself through interaction or
is cut; captions label content, never the template's behavior.

#### Scenario: The column reads set, not stretched

- **WHEN** a work page's reading column renders at any width
- **THEN** text is ragged-right with even word spacing (no justification
  rivers) and the display title never leaves a one-word orphan line

#### Scenario: The template does not narrate itself

- **WHEN** a designer reviews any work page
- **THEN** no visible copy or control describes the page's own mechanism; only
  functional, client-meaningful UI remains

### Requirement: Work-page copy is lorem ipsum

Work-page body copy SHALL be lorem ipsum so the design system reads as the
content; work metadata (title, category, year, mechanic labels) SHALL remain
real. The home page's About/Contacts copy SHALL remain untouched.

#### Scenario: Client reads the design, not the prose

- **WHEN** a prospective client opens any work page
- **THEN** running text is lorem ipsum while titles, folio marks, and labels
  carry the work's real metadata
