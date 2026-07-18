# index-catalogue

## ADDED Requirements

### Requirement: Catalogue rows preview their work on hover and focus

The Project Index SHALL reveal a preview of a work when its numeral row is
hovered or keyboard-focused, without layout shift and without harming numeral
legibility — so a Roman numeral remains a legible identity for the work it names.

#### Scenario: Hovering a numeral reveals its preview

- **WHEN** a pointer hovers a numeral row
- **THEN** a sharp preview of that work (its committed image, or a scaled preview
  of its template) appears via compositor-only animation (opacity/transform/filter)
- **AND** the row's active-element dot is shown
- **AND** no other row's preview is shown at the same time

#### Scenario: Keyboard focus reveals the same preview

- **WHEN** a numeral row receives keyboard focus
- **THEN** the identical preview appears as on hover, so keyboard and pointer
  users get the same information

#### Scenario: Touch has no dead hover state

- **WHEN** the index is viewed on a touch device (no hover)
- **THEN** a sensible default preview is present (e.g. the first row) or a
  press-peek affordance exists
- **AND** a tap on a row navigates to that work's page

#### Scenario: The reveal never shifts the numeral list

- **WHEN** a preview appears or disappears
- **THEN** the numeral rows do not reflow (the preview is an overlay or fixed
  layer), and body text/numerals remain at their readable size
