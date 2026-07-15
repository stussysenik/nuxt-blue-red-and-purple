import { defineConfig } from 'astro/config';
import lit from '@astrojs/lit';
import unocss from '@unocss/astro';

// Static one-pager. Lit powers the interactive islands (wheel, index,
// overlay, theme toggle); UnoCSS is the single build-enforced styling truth
// (uno.config.ts). No Tailwind reset — our own preflight lives in the config.
export default defineConfig({
  site: 'https://blueredandpurple.world',
  output: 'static',
  integrations: [
    unocss({ injectReset: false }),
    lit(),
  ],
});
