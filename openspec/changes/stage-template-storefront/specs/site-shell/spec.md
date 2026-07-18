# site-shell — Delta

## ADDED Requirements

### Requirement: Persistent navigation spine with fixed coordinates
Every template page SHALL render a navigation spine inside the reserved chrome
band: previous-template link, current Roman numeral with position ("III / XIV"),
next-template link, and the index mark — at identical coordinates on every
page. Prev/next SHALL wrap around at the catalog ends and SHALL be operable via
ArrowLeft/ArrowRight. All spine elements remain visible at every scroll
position.

#### Scenario: Traversal without re-aiming
- **WHEN** the user clicks "next" on template III
- **THEN** template IV loads with its "next" control at the same viewport
  coordinates, so repeated traversal needs no pointer movement

#### Scenario: Wrap-around
- **WHEN** the user activates "next" on template XIV
- **THEN** template I loads

#### Scenario: Keyboard traversal
- **WHEN** ArrowRight is pressed on a template page (with no focused
  interactive element consuming it)
- **THEN** the next template loads

### Requirement: Always-visible conversion affordance
Every template page SHALL carry one inquiry affordance ("license this
template" intent — mailto or contact anchor) in the spine, always visible at
every scroll position, at the same coordinates on every page. It is chrome:
it never overlaps page-owned content and never scrolls away.

#### Scenario: The money path is never off-screen
- **WHEN** a buyer is at any scroll depth on any template
- **THEN** the inquiry affordance is visible and one click/tap reaches a real
  contact target (no dead anchor)

### Requirement: Cross-document view transitions between pages
Navigation between site pages SHALL use native CSS cross-document view
transitions (`@view-transition`) with the spine numeral carrying a
`view-transition-name` so it morphs across template navigation. Browsers
without support SHALL get instant navigation with no polyfill, no client
router, and no added JS.

#### Scenario: Fluid template-to-template
- **WHEN** a supporting browser navigates III → IV
- **THEN** the pages crossfade and the numeral transitions as a shared element,
  with no white flash

#### Scenario: Unsupported browser degrades clean
- **WHEN** a browser without cross-document view transitions navigates
- **THEN** navigation is a normal instant load and no script or fallback
  runtime was shipped for it
