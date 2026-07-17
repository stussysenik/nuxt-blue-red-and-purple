// Template configuration — the client-customizer ("dialkit") schema.
//
// Every axis is a *closed enumeration*: a config with a value outside its axis
// is unrepresentable in the type system (compile-time) and rejected by the
// runtime validator (test-time). A client's customization is the diff from
// DEFAULTS — the future order payload. P1 is schema only: nothing reads or
// writes this yet. P2 (dialkit island) and P3 (config-as-order) extend it
// without rewrites.

// Axis vocabularies — single source of truth for both the union types and the
// runtime validator. `as const` keeps them literal so the types stay closed.
export const AXES = {
  skin: ['essential', 'brutal', 'clay', 'generative'],
  theme: ['light', 'dark'],
  font: ['archivo'], // widens in P2 when type pairs are added
  scale: [1, 1.1, 1.25], // density steps, not a free slider
  images: ['placeholder', 'client'],
  copy: ['lorem', 'client'],
} as const;

type Axes = typeof AXES;
type AxisName = keyof Axes;

// TemplateConfig: one value per axis, each drawn from its closed vocabulary.
export type TemplateConfig = { [K in AxisName]: Axes[K][number] };

// Defaults = the base template. A pristine order diffs to nothing.
export const DEFAULTS: TemplateConfig = {
  skin: 'essential',
  theme: 'light',
  font: 'archivo',
  scale: 1,
  images: 'placeholder',
  copy: 'lorem',
};

const AXIS_NAMES = Object.keys(AXES) as AxisName[];

// A partial config: the shape of a diff / an in-progress customization.
export type TemplateConfigDiff = Partial<TemplateConfig>;

// Runtime validator — proves an unknown value is a legal, complete config.
// Mirrors the compile-time guarantee for values that arrive untyped (URL,
// stored order, test input).
export function isTemplateConfig(value: unknown): value is TemplateConfig {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return AXIS_NAMES.every((axis) =>
    (AXES[axis] as readonly unknown[]).includes(record[axis]),
  );
}

// Diff from defaults — exactly the axes the client changed (the order payload).
// A pristine config returns `{}`.
export function diffFromDefaults(config: TemplateConfig): TemplateConfigDiff {
  const diff: TemplateConfigDiff = {};
  for (const axis of AXIS_NAMES) {
    if (config[axis] !== DEFAULTS[axis]) {
      // Per-axis assignment keeps the value on its own axis's union.
      (diff[axis] as TemplateConfig[typeof axis]) = config[axis];
    }
  }
  return diff;
}

// Apply a diff onto defaults — the inverse of diffFromDefaults.
export function fromDiff(diff: TemplateConfigDiff): TemplateConfig {
  return { ...DEFAULTS, ...diff };
}
