// The color truth — pure data, no imports, so the config, the color-law test,
// and the design-doc generator all read one source (SPEC §1).
//
// COLOR LAW: the agency *blue red + purple* never uses those hues in its chrome.
// Every hex sits in the allowed territory — yellow→orange→green (15°–180°) — or
// is a warm achromatic ink tint. The color-law vitest hue-checks each token.
export const PALETTE = {
  // Warm paper + ink achromatic core (print / early-Xerox register).
  paper: '#F7F3EC',
  'paper-1': '#EFEAE0',
  ink: '#16130F',
  'ink-1': '#3D3A34',
  'ink-2': '#6E6A61',
  'ink-3': '#A8A399',
  // Real Riso spot inks — one per kernel (essential stays achromatic).
  'riso-yellow': '#FFE800',
  'riso-orange': '#FF6C2F',
  'riso-green': '#00A95C',
} as const;

export type PaletteToken = keyof typeof PALETTE;
