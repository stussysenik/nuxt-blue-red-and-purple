import { defineConfig, presetAttributify } from 'unocss';
import { tachyonsPreset } from './src/uno/tachyons';
import { PALETTE } from './src/uno/palette';

// The single design-truth file (SPEC §2). Styling is Tachyons vocabulary in
// attributify mode or kernel custom properties — nothing else compiles. The
// color-law palette lives in ./src/uno/palette.ts so the config, the color-law
// test, and the design-doc generator all read one source.
export { PALETTE };

export default defineConfig({
  presets: [presetAttributify({ strict: false }), tachyonsPreset()],
  theme: {
    colors: { ...PALETTE },
  },
  // No arbitrary values, no rogue hex — off-system CSS cannot compile.
  blocklist: [/\[.+\]/, /^#[0-9a-f]{3,8}$/i],
});
