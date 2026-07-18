# project-index — deltas

## ADDED Requirements

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
