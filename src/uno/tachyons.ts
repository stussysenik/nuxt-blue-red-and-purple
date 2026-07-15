import type { Preset, Rule, Preflight } from 'unocss';

// Vendored Tachyons vocabulary — we own the table (SPEC §2). Scales are data;
// rules are generated from them (DOP). Color utilities resolve to kernel CSS
// custom properties (--ink/--paper/--spot…) so a mode switch re-skins the whole
// page with two attribute writes — no per-utility hex ever ships.

/** Tachyons spacing / sizing step scale (rem). */
export const STEP: Record<string, string> = {
  '0': '0',
  '1': '.25rem',
  '2': '.5rem',
  '3': '1rem',
  '4': '2rem',
  '5': '4rem',
  '6': '8rem',
  '7': '16rem',
};

/** Type scale — Tachyons f1–f7 plus the two display steps. */
export const FONT: Record<string, string> = {
  '1': '3rem',
  '2': '2.25rem',
  '3': '1.5rem',
  '4': '1.25rem',
  '5': '1rem',
  '6': '.875rem',
  '7': '.75rem',
};

/** Semantic color tokens — every one resolves to a kernel custom property. */
export const COLOR_TOKENS = [
  'ink',
  'ink-1',
  'ink-2',
  'ink-3',
  'paper',
  'paper-1',
  'spot',
  'spot-2',
  'line',
  'transparent',
  'inherit',
] as const;

const SIDES: Record<string, readonly string[]> = {
  a: ['top', 'right', 'bottom', 'left'],
  t: ['top'],
  r: ['right'],
  b: ['bottom'],
  l: ['left'],
  v: ['top', 'bottom'],
  h: ['left', 'right'],
};

const box = (prop: 'padding' | 'margin', sides: readonly string[], value: string) =>
  Object.fromEntries(sides.map((s) => [`${prop}-${s}`, value]));

const colorValue = (t: string): string =>
  t === 'transparent' || t === 'inherit' ? t : `var(--${t})`;

const rules: Rule[] = [
  // ── Spacing: pa/pt/pr/pb/pl/pv/ph 0–7, ma/… 0–7, negative na/nt/nr/nb/nl ──
  [/^p([atrblvh])([0-7])$/, ([, d, n]) => box('padding', SIDES[d!]!, STEP[n!]!)],
  [/^m([atrblvh])([0-7])$/, ([, d, n]) => box('margin', SIDES[d!]!, STEP[n!]!)],
  [/^n([atrbl])([1-7])$/, ([, d, n]) => box('margin', SIDES[d!]!, `-${STEP[n!]!}`)],

  // ── Type scale ──
  [/^f([1-7])$/, ([, n]) => ({ 'font-size': FONT[n!]! })],
  ['f-headline', { 'font-size': '6rem' }],
  ['f-subheadline', { 'font-size': '5rem' }],

  // ── Measure (line length) ──
  ['measure', { 'max-width': '30em' }],
  ['measure-wide', { 'max-width': '34em' }],
  ['measure-narrow', { 'max-width': '20em' }],

  // ── Line height ──
  ['lh-solid', { 'line-height': '1' }],
  ['lh-title', { 'line-height': '1.25' }],
  ['lh-copy', { 'line-height': '1.5' }],

  // ── Letter spacing (tracking) ──
  ['tracked', { 'letter-spacing': '.1em' }],
  ['tracked-tight', { 'letter-spacing': '-.05em' }],
  ['tracked-mega', { 'letter-spacing': '.25em' }],
  ['tracked-none', { 'letter-spacing': 'normal' }],

  // ── Font family (kernel-driven) ──
  ['font-mono', { 'font-family': 'var(--font-mono)' }],
  ['font-display', { 'font-family': 'var(--font-display)' }],

  // ── Weight ──
  [/^fw([1-9])$/, ([, n]) => ({ 'font-weight': `${Number(n) * 100}` })],
  ['normal', { 'font-weight': '400' }],
  ['b', { 'font-weight': '700' }],
  ['i', { 'font-style': 'italic' }],
  ['fs-normal', { 'font-style': 'normal' }],

  // ── Transform / align ──
  ['ttu', { 'text-transform': 'uppercase' }],
  ['ttl', { 'text-transform': 'lowercase' }],
  ['ttc', { 'text-transform': 'capitalize' }],
  ['ttn', { 'text-transform': 'none' }],
  ['tl', { 'text-align': 'left' }],
  ['tr', { 'text-align': 'right' }],
  ['tc', { 'text-align': 'center' }],
  ['tj', { 'text-align': 'justify' }],

  // ── Display ──
  ['dn', { display: 'none' }],
  ['db', { display: 'block' }],
  ['di', { display: 'inline' }],
  ['dib', { display: 'inline-block' }],
  ['flex', { display: 'flex' }],
  ['inline-flex', { display: 'inline-flex' }],
  ['grid', { display: 'grid' }],

  // ── Flex ──
  ['flex-row', { 'flex-direction': 'row' }],
  ['flex-column', { 'flex-direction': 'column' }],
  ['flex-wrap', { 'flex-wrap': 'wrap' }],
  ['flex-nowrap', { 'flex-wrap': 'nowrap' }],
  ['flex-auto', { flex: '1 1 auto', 'min-width': '0', 'min-height': '0' }],
  ['flex-none', { flex: 'none' }],
  ['items-start', { 'align-items': 'flex-start' }],
  ['items-center', { 'align-items': 'center' }],
  ['items-end', { 'align-items': 'flex-end' }],
  ['items-baseline', { 'align-items': 'baseline' }],
  ['justify-start', { 'justify-content': 'flex-start' }],
  ['justify-center', { 'justify-content': 'center' }],
  ['justify-end', { 'justify-content': 'flex-end' }],
  ['justify-between', { 'justify-content': 'space-between' }],
  ['self-start', { 'align-self': 'flex-start' }],
  ['self-center', { 'align-self': 'center' }],
  ['self-end', { 'align-self': 'flex-end' }],
  [/^g([0-7])$/, ([, n]) => ({ gap: STEP[n!]! })],

  // ── Position ──
  ['static', { position: 'static' }],
  ['relative', { position: 'relative' }],
  ['absolute', { position: 'absolute' }],
  ['fixed', { position: 'fixed' }],
  ['sticky', { position: 'sticky' }],
  ['absolute--fill', { top: '0', right: '0', bottom: '0', left: '0' }],
  [/^top-([0-2])$/, ([, n]) => ({ top: STEP[n!]! })],
  [/^right-([0-2])$/, ([, n]) => ({ right: STEP[n!]! })],
  [/^bottom-([0-2])$/, ([, n]) => ({ bottom: STEP[n!]! })],
  [/^left-([0-2])$/, ([, n]) => ({ left: STEP[n!]! })],

  // ── Width / height ──
  [/^w([1-5])$/, ([, n]) => ({ width: STEP[String(Number(n) + 2)]! })],
  [/^h([1-5])$/, ([, n]) => ({ height: STEP[String(Number(n) + 2)]! })],
  [/^w-(10|20|25|30|33|34|40|50|60|70|75|80|90|100)$/, ([, n]) => ({ width: `${n}%` })],
  ['w-third', { width: 'calc(100% / 3)' }],
  ['w-two-thirds', { width: 'calc(100% / 1.5)' }],
  ['w-auto', { width: 'auto' }],
  ['vw-100', { width: '100vw' }],
  ['vh-100', { height: '100vh' }],
  ['min-vh-100', { 'min-height': '100vh' }],
  ['h-100', { height: '100%' }],
  [/^mw([1-9])$/, ([, n]) => ({ 'max-width': `${n}rem` })],
  ['mw-100', { 'max-width': '100%' }],
  ['mw-none', { 'max-width': 'none' }],

  // ── Borders (Tachyons: ba/bt/br/bb/bl = style solid; bw controls width) ──
  ['ba', { 'border-style': 'solid', 'border-width': '1px' }],
  ['bt', { 'border-top-style': 'solid', 'border-top-width': '1px' }],
  ['bb', { 'border-bottom-style': 'solid', 'border-bottom-width': '1px' }],
  ['bl', { 'border-left-style': 'solid', 'border-left-width': '1px' }],
  ['br--', { 'border-right-style': 'solid', 'border-right-width': '1px' }],
  ['bn', { 'border-style': 'none', 'border-width': '0' }],
  [/^bw([0-7])$/, ([, n]) => ({ 'border-width': n === '0' ? '0' : STEP[n!]! })],

  // ── Radius (Tachyons br0–br4, pill, 100) ──
  ['br0', { 'border-radius': '0' }],
  ['br1', { 'border-radius': '.125rem' }],
  ['br2', { 'border-radius': '.25rem' }],
  ['br3', { 'border-radius': '.5rem' }],
  ['br4', { 'border-radius': '1rem' }],
  ['br-pill', { 'border-radius': '9999px' }],
  ['br-100', { 'border-radius': '100%' }],

  // ── Opacity ──
  [/^o-(0|10|20|25|30|40|50|60|70|80|90|100)$/, ([, n]) => ({ opacity: `${Number(n) / 100}` })],

  // ── Object / background sizing ──
  ['cover', { 'background-size': 'cover' }],
  ['contain', { 'background-size': 'contain' }],
  ['bg-center', { 'background-position': 'center center', 'background-repeat': 'no-repeat' }],

  // ── Misc ──
  ['overflow-hidden', { overflow: 'hidden' }],
  ['overflow-x-hidden', { 'overflow-x': 'hidden' }],
  ['pointer', { cursor: 'pointer' }],
  ['pre', { 'white-space': 'pre' }],
  ['nowrap', { 'white-space': 'nowrap' }],
  ['list', { 'list-style-type': 'none' }],

  // ── Color: text / background / border, each → kernel custom property ──
  ...COLOR_TOKENS.map(
    (t): Rule => [t, { color: colorValue(t) }],
  ),
  ...COLOR_TOKENS.map(
    (t): Rule => [`bg-${t}`, { 'background-color': colorValue(t) }],
  ),
  ...COLOR_TOKENS.map(
    (t): Rule => [`b--${t}`, { 'border-color': colorValue(t) }],
  ),
];

// Compact reset in the Tachyons register: predictable box model, no default
// margins, media elements block, inherited typography.
const preflight: Preflight = {
  getCSS: () => `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body,h1,h2,h3,h4,h5,h6,p,figure,blockquote,dl,dd{margin:0}
ul[class],ol[class]{list-style:none;margin:0;padding:0}
img,svg,video,canvas{display:block;max-width:100%}
button,input,select,textarea{font:inherit;color:inherit}
a{color:inherit;text-decoration:none}
:where(h1,h2,h3,h4,h5,h6){font-size:inherit;font-weight:inherit}
`,
};

export const tachyonsPreset = (): Preset => ({
  name: 'tachyons-vendored',
  rules,
  preflights: [preflight],
});
