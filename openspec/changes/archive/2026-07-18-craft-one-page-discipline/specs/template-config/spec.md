# template-config — deltas

## ADDED Requirements

### Requirement: Template configuration is a typed object of closed axes

The system SHALL define a template configuration schema in which every axis is
a closed enumeration (skin, theme, font, scale step, imagery set, copy source)
with defaults equal to the base template, such that invalid configurations are
unrepresentable in the type system and a client customization is expressible as
the diff from defaults. In P1 the schema and its defaults SHALL exist as a
typed, unit-tested module; no UI reads or writes it yet.

#### Scenario: Illegal config cannot compile

- **WHEN** code constructs a config with a value outside an axis's enumeration
  (e.g. `skin: 'neon'` or `scale: 1.07`)
- **THEN** TypeScript rejects it at compile time and the schema's runtime
  validator rejects it in tests

#### Scenario: Customer decision is a diff

- **WHEN** a config differs from defaults on some axes
- **THEN** a pure helper returns exactly the changed axes (the future order
  payload), and returns an empty diff for the untouched base template
