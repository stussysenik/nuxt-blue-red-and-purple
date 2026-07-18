# template-depth — Delta

## ADDED Requirements

### Requirement: Template is a function of the content model
Each template SHALL render from the content AST (`content-model`) — `view =
render(paradigm)(content, layers, state)` — with no hardcoded editorial copy.
Supplying a different valid content tree SHALL re-embody the template through its
own paradigm with no code change.

#### Scenario: No baked copy
- **WHEN** a migrated template renders
- **THEN** all its editorial content derives from a content tree, and swapping
  the tree changes what is shown

### Requirement: Declared state machine — visual states and event transitions
Each template SHALL declare a finite set of visual states and the event-driven
transitions between them (events drawn from scroll / pointer / key / timer /
navigation). What is shown SHALL be a pure function of the current state; every
transition SHALL be bound to an event; no impossible or unreachable state SHALL
be declared. This is the time-based / event-based behavior of the template.

#### Scenario: State drives the view
- **WHEN** an event fires that the template's machine binds to a transition
- **THEN** the template advances to the target state and the view updates purely
  from that state

#### Scenario: No impossible states
- **WHEN** a template's declared machine is validated
- **THEN** every declared state is reachable and every transition is event-bound

### Requirement: Declared layout paradigm per template
Each template SHALL declare one layout paradigm from a closed set —
`vertical-narrative`, `snap-sandwich`, `sliding-panels`, `full-page` — as a typed
config axis, and its composition SHALL structurally follow the declared paradigm
with proper grid alignment and snap discipline.

#### Scenario: Paradigm is real, not a tag
- **WHEN** a template declares `snap-sandwich`
- **THEN** its sections are full-height scroll-snap targets with disciplined snap
  stops, and the paradigm appears in the template's label

### Requirement: Declared motion identity, runtime loaded only where sold
Each template SHALL declare a motion identity — `native-css` (default), `gsap`,
or `motion` — and a motion library SHALL be loaded only on pages that declare it,
deferred. At least one template SHALL showcase `gsap` and at least one `motion`,
each with a layout-shift/FLIP concept animated via transforms.

#### Scenario: Native pages ship no motion runtime
- **WHEN** a `native-css` template page loads
- **THEN** zero bytes of GSAP or motion.dev are requested

#### Scenario: Showcase page sells its runtime
- **WHEN** a `gsap` template page loads
- **THEN** GSAP loads deferred on that page only and drives a visible layout-shift
  animation composed of transform/opacity frames

### Requirement: Nothing dead — every affordance responds
On every template, each interactive-styled element SHALL respond — navigate to
real content, transform visible content, or give immediate feedback. Href targets
SHALL resolve to content — no dead `#` anchors. The three currently static
templates (after, d429, p673) SHALL each gain at least one content-revealing
click/scroll mechanic consistent with their editorial character.

#### Scenario: No dead affordances audit
- **WHEN** any template is audited interactively
- **THEN** every visually interactive element produces navigation, content change,
  or feedback, and no anchor points at "#"

### Requirement: Optical imagery placement
Every `media` block SHALL declare a curated focal point (object-position) and sit
optically balanced in its slot — centered on the perceived subject — so the focal
subject survives every container ratio the layout produces, verified by eye at
320 / 768 / 1280.

#### Scenario: Focal subject never clipped
- **WHEN** any template's imagery renders at 320px, 768px, and 1280px widths
- **THEN** each photo's focal subject is visible and optically centered, with no
  default-crop decapitation or edge-pinned subject

### Requirement: No zoom-to-read legibility
At viewport widths ≥320px, all body text SHALL render at or above the readable
Tachyons step (16px equivalent) without user zoom; density SHALL be resolved
mobile-first by layout shift (reflow, disclosure, layout animation) rather than
scaling content down. Styling stays within the existing Uno/Tachyons vocabulary.

#### Scenario: Phone legibility
- **WHEN** any template renders at 320–430px width
- **THEN** no body text is below the readable step and no horizontal pan or
  pinch-zoom is required to read any content
