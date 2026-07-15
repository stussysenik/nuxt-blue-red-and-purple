import { defineConfig, presetAttributify } from 'unocss';
import { tachyonsPreset } from './src/uno/tachyons';

// The single design-truth file (SPEC §2). Styling is Tachyons vocabulary in
// attributify mode or kernel custom properties — nothing else compiles.
//
// COLOR LAW (the founding joke, build-enforced): the agency *blue red + purple*
// never uses blue, red, or purple in its chrome. Every hex below sits in the
// allowed territory — yellow→orange (15°–90°) or green (90°–195°) — or is a
// warm achromatic ink tint. A vitest test (M2) hue-checks every token here and
// fails the build if any lands in a forbidden band.
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

export default defineConfig({
  presets: [presetAttributify({ strict: false }), tachyonsPreset()],
  theme: {
    colors: { ...PALETTE },
  },
  // No arbitrary values, no rogue hex — off-system CSS cannot compile.
  blocklist: [/\[.+\]/, /^#[0-9a-f]{3,8}$/i],
});
