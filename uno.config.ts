import { defineConfig, presetAttributify } from 'unocss';
import { tachyonsPreset } from './presets/tachyons';
import { PALETTE } from './data/palette';

export { PALETTE };

export default defineConfig({
  presets: [presetAttributify({ strict: false }), tachyonsPreset()],
  theme: {
    colors: { ...PALETTE },
  },
  blocklist: [/\[.+\]/, /^#[0-9a-f]{3,8}$/i],
});
