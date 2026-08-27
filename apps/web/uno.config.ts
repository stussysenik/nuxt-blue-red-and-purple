import { defineConfig, presetAttributify } from 'unocss';
import { tachyonsPreset } from '@brp/unocss-preset';
import { PALETTE } from '@brp/tokens';

export { PALETTE };

export default defineConfig({
  presets: [presetAttributify({ strict: false }), tachyonsPreset()],
  theme: {
    colors: { ...PALETTE },
  },
  blocklist: [/\[.+\]/, /^#[0-9a-f]{3,8}$/i],
});
