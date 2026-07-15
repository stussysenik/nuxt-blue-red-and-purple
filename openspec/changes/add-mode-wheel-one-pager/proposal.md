# Proposal: add-mode-wheel-one-pager

## Why

The site is currently a shader demo. The business is a design agency selling
one-page template expertise. The rebuild makes the pitch literal:
**one fixed content structure, four interchangeable design systems**
(`page = mode(content)`), switched live by a wheel selector — proving the
agency's capability in the product itself. Full context: `SPEC.md` at repo
root.

## What Changes

- **New capability `design-kernel`:** four mode token kernels
  (`brutal` default / `essential` / `clay` / `generative`) × light/dark, as
  CSS custom-property sets; Tachyons-vocabulary-via-UnoCSS as the single
  build-enforced styling truth; pinned-vs-themed layer truth table;
  generated `DESIGN.md`.
- **New capability `mode-wheel`:** hero-line wheel selector with GSAP
  inertia snap, filled/outline dot states, keyboard support.
- **New capability `project-index`:** pinned Project Index trigger, works
  index with dot hover language, full-screen work overlay (no routing),
  works content collection (schema ready for the batch-2 scraped dataset).
- **MODIFIED `site-shell`:** migrates the shell to Astro 5 + Lit islands +
  Lenis smooth scroll; quality gate extended with `astro check` + vitest.
- **MODIFIED `shader-experience`:** the shader loop is scoped to the
  `generative` mode background instead of the whole site; suspended when
  other modes are active. `src/scenes.ts` is preserved, not rewritten.
- **BREAKING:** vanilla Vite entry (`index.html` bootstrapping the canvas
  directly) is replaced by the Astro one-pager.

## Brand posture (governing intent)

Pentagram-neutral, silent-luxury credibility instrument with ONE
specialization: one-page systems. The site must back up in-person NYC
pitches (e.g. S'MAC) to established clients — evidence over decoration.
Therefore: `essential` is the default mode (restraint greets first); the
wheel proves range; chrome stays neutral so any brand can see themselves
in it; works carry the expression. Reference posture: stussysenik.com,
Reed Art Department. Tagline (verbatim, §01):
"TOO MUCH BLUE WILL NEVER AMOUNT TO ANY RED".

Quantified claim the site makes checkable: 1 live client service
(smac.blueredandpurple.world) · 17 researched works across 5 verticals ·
4 complete design systems on one DOM · 24 assured visual states ·
consistency enforced at build (off-system CSS cannot compile).

Scraped works remain attributed studies (source kept per record); their
extracted mechanics are rebuilt in our kernel — study honestly, express
originally. No remixed lookalikes.

**Color law (founding joke, build-enforced):** the agency named
*blue red + purple* never uses blue, red, or purple in its chrome.
Paper + ink achromatic core (print / early-Xerox register) with one riso
spot ink per kernel from the allowed yellow–orange–green territory;
`essential` stays achromatic; `generative` scenes grade to ink/paper
duotone. Work imagery/artwork is exempt. Full constants: SPEC.md §1
"Design constants" — hue bands, riso hexes, Archivo + IBM Plex Mono type
pairing, imagery policy. A unit test over `uno.config.ts` tokens makes
the law unbreakable.

## Impact

- Affected specs: `design-kernel` (new), `mode-wheel` (new),
  `project-index` (new), `site-shell`, `shader-experience`.
- Affected code: `index.html`, `src/` (restructured per SPEC.md §3),
  `package.json` (Astro, Lit, UnoCSS, GSAP, Lenis, vitest — exact-pinned),
  new `uno.config.ts`, `astro.config.mjs`, `src/content/`.
- Unaffected: `adaptive-performance`, `deployment` specs remain in force
  (DPR/reduced-motion/tab-suspension now apply to the generative mode;
  Vercel + Spaceship DNS constraints unchanged — preserve `smac` A record).
