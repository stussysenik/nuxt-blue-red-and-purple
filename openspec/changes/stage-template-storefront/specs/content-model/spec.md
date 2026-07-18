# content-model — Delta

## ADDED Requirements

### Requirement: Generic content AST
The system SHALL define a single generic, immutable content vocabulary that every
template renders from — an `identity` record, an optional `hero`, and an ordered
list of typed `Block`s from a closed set (`prose`, `list`, `media`, `pair`,
`spread`, `quote`, `meta`). The schema SHALL be validated (zod) at build and be
unit-testable. No template SHALL contain hardcoded editorial copy; all content
SHALL flow from a content tree.

#### Scenario: Illegal block rejected
- **WHEN** a content tree contains a block whose type is outside the closed set
  or whose fields violate the schema
- **THEN** validation fails with an error naming the offending block

#### Scenario: Unknown block degrades, never crashes
- **WHEN** a template receives a block type it does not render
- **THEN** the block is skipped gracefully and the page still renders

### Requirement: Default lorem trees embody every template
Each template SHALL ship with a default content tree (placeholder / lorem
language, per category) so it embodies real structure out of the box, and SHALL
re-render correctly when supplied a different tree of the same vocabulary.

#### Scenario: Same shell, different idea
- **WHEN** a template is given a different valid content tree
- **THEN** it renders that tree's content through its own paradigm with no code
  change and no crash

### Requirement: Render is a pure function of content, layers, and state
Template output SHALL be defined by `view = render(paradigm)(content, layers,
state)` — a pure function. The renderer SHALL NOT mutate the DOM imperatively
beyond applying the current state; visual output SHALL always be reconstructible
from `(content, layers, state)`.

#### Scenario: Deterministic render
- **WHEN** the same `(content, layers, state)` is rendered twice
- **THEN** the output is identical
