# template-catalog — Delta

## ADDED Requirements

### Requirement: Templates are identified by Roman numerals
Every work SHALL carry a unique hand-curated `ordinal` (1–14) in its content
JSON, rendered as a Roman numeral (I–XIV) everywhere the template is named —
index rows, spine, page labels, document titles. Slug-derived names SHALL NOT
appear in any user-facing surface; URLs keep their existing slugs.

#### Scenario: Index shows numerals only
- **WHEN** the project index renders
- **THEN** each row displays its Roman numeral (e.g. "VII"), sorted by ordinal
  ascending
- **AND** no row displays a slug or name as its title

#### Scenario: Ordinals are unique and complete
- **WHEN** the content collection is validated (build or test)
- **THEN** ordinals are exactly 1..N with no duplicates or gaps, else the build
  fails

### Requirement: Each template is labeled with its sales identity
Each template SHALL declare and display a niche (target buyer), a layout
paradigm, and a motion identity, composed into one catalog label (e.g.
"VII — hospitality — GSAP FLIP").

#### Scenario: Label on template page and index
- **WHEN** a template page or its index row renders
- **THEN** the numeral + niche + motion identity label is present as real text

#### Scenario: Label reflects config, not prose
- **WHEN** a template's config axes change
- **THEN** the label changes with them — the label is derived from the typed
  config, never hand-written per page

### Requirement: Per-template share card
Each template page SHALL ship its own document title and Open Graph metadata
derived from its identity label (numeral + niche + motion identity), so a
shared link advertises that specific template to its niche rather than the
generic site card.

#### Scenario: Template link shared
- **WHEN** a template URL is shared or crawled
- **THEN** the title and OG description carry that template's numeral and
  identity label, distinct from every other template's
