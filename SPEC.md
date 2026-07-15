# SPEC — blueredandpurple: Mode-Wheel Agency One-Pager

Implementation target: Claude Opus 4.8. Read fully before writing code.
Owner: senik. Status: approved-pending-confirmation.

## 1. Objective

A design agency/consulting one-pager whose central mechanic is its own pitch:
**one fixed content structure, N interchangeable design systems**, switched live
via a wheel selector on the hero line.

```
page = mode(content)        — the wheel is the parent function
render(el, mode) = truthTable[el.layer][mode]   — mathematical, no ambiguity
```

Target users: prospective clients (restaurants, hotels, music venues, vintage
stores, book stores) evaluating the agency's one-page template expertise.
Content is lorem ipsum + placeholder works in v1; a scraped works dataset
(Cargo templates, batch 2) slots into the same schema later.

### Core concepts

1. **Modes (v1 ships all four).** Each mode is a complete design-token kernel:
   type scale/weights, color pairs, border/line weight, spacing, radius,
   shadow, motion character.
   - `essential` — minimal essentialist. Hairlines, whitespace, progressing
     text weight per line, heller.tv restraint. **Default mode** (restraint
     greets first; the wheel proves range).
   - `brutal` — neo-brutalist. Grid gaps as structural lines, `6px` solid
     borders, hard offset shadows, grotesque type, accent pop on hover.
   - `clay` — 3D playful. Soft depth, clay-textured surfaces, springy motion,
     rounded geometry.
   - `generative` — the existing canvas scenes (`src/scenes.ts`) survive as
     this mode's background layer; UI chrome goes minimal-dark over it.
2. **Layer truth table.** Every component declares a layer:
   - `pinned` — always visible, renders above/across the mode transform
     (Project Index trigger, wheel, theme toggle, wordmark). Pinned elements
     may overlap the grid — overlapping grids are a feature, not a bug.
   - `themed` — fully re-skinned by the active mode (everything else).
3. **Project Index** (refs: heller.tv/about; comps in
   `openspec/changes/add-mode-wheel-one-pager/refs/` —
   SCR-20260715-pmhp/pmjh.png).
   A pinned trigger opens a **full-screen index**: works as big centered
   type rows with superscript index numbers (`(N1)`…), title / category /
   year, blurred work imagery ghosted behind. Hover + active states use the
   dot language: **filled dot = active/hovered, outlined dot = idle**.
   Selecting a work opens its **work page**: a complete one-page layout
   (no routing — layered overlay) rendered LOCALLY from the work's data —
   hero title, imagery, summary, palette, signature mechanic expressed
   through our kernel. Never an iframe, screenshot-dump, or outbound link
   to the source site; `source` is attribution metadata only. `Esc`/close
   returns to the index; `Esc` again returns to the site.
4. **Theming.** Light/dark is **orthogonal** to modes: every mode defines a
   light and dark token pair (4 × 2 matrix). Default from
   `prefers-color-scheme`; manual toggle persists to `localStorage`.
5. **Wheel selector.** Horizontal wheel on the same line as the hero.
   Drag/scroll/keyboard (`←`/`→`) to rotate; GSAP inertia snap to the nearest
   mode. Same dot language: filled = active mode, outline = others.

### Design constants (pre-decided — implementation makes zero choices)

- **Color law (the founding joke, enforced).** The agency is named
  *blue red + purple*; its chrome NEVER uses those hues. Forbidden hue
  bands for every kernel token: red 345°–15°, blue 195°–270° (cyan reads
  as blue — banned), purple/violet 270°–345°. Allowed chromatic territory:
  yellow→orange (15°–90°), green (90°–195°).
- **Palette posture: paper + ink + one riso spot per kernel.** Core is
  print-era achromatic (warm paper white / near-black ink; greys are ink
  tints — early-Xerox/CMYK-shop register). Spot inks from real Riso
  swatches: Sunflower Yellow `#FFE800`, Riso Orange `#FF6C2F`, Riso Green
  `#00A95C`. Assignment: `essential` = achromatic, no spot ·
  `brutal` = Riso Orange · `clay` = Riso Green (Yellow as its highlight) ·
  `generative` = scenes graded to ink/paper duotone (the law extends to
  the WebGL layer).
- **Exemption:** work imagery and client artwork carry their own color
  (survey precedent: Skrillex — "artwork carries color"). The law governs
  chrome/kernel tokens only.
- **Type (two families total, self-hosted woff2).** Archivo variable
  (wght 100–900 + width axis: hairline weights for `essential`, expanded
  display for `brutal`) + IBM Plex Mono (labels, meta, nav rail — the
  print/engineering register). Scale = the vendored Tachyons `f1–f7`
  steps plus one per-mode fluid `--type-display` token for the hero.
- **Enforcement:** a vitest unit test iterates every color token in
  `uno.config.ts` and fails if any hue falls in a forbidden band — the
  color law cannot regress silently.

## 2. Tech stack (locked — do not substitute)

| Concern     | Choice | Rationale |
|-------------|--------|-----------|
| Framework   | **Astro 5** (static output) | zero-JS default, template generation for batch 2 |
| Components  | **Lit 3** (islands) | interactive parts only: wheel, index, overlay, toggle |
| CSS         | **UnoCSS + full Tachyons vocabulary** (tachyons preset, vendor/port it — we own the table), **attributify on**, `presets` limited to that + our theme tokens | one build-enforced truth |
| Scroll      | **Lenis** (lenis.dev) | page-level smooth scroll; wired into GSAP ScrollTrigger ticker |
| Animation   | **GSAP** (+ ScrollTrigger) | wheel inertia, overlay choreography, scroll reveals |
| Content     | Astro content collections, `src/content/works/*.json` | scraped batch-2 data drops in |
| Lint/types  | oxlint + `tsc --noEmit` strict | existing `check` script stands |

Package hygiene: hand-typed `package.json`, exact-pinned deps, no transitive
tooling beyond the table above. If a need appears that the table doesn't
cover, stop and ask — do not add a dependency unilaterally.

### CSS enforcement (the hard-coded philosophy)

- All styling via Tachyons-vocabulary utilities in attributify mode, or Lit
  component styles composed **only from CSS custom properties defined by the
  mode kernels**. No arbitrary values (`blocklist`/no `presetAttributify`
  arbitrary variants), no rogue hex codes, no inline `style=`.
- `uno.config.ts` is the single design-truth file. The design-doc table
  (`DESIGN.md`) is **generated from it** (small script, `pnpm design:doc`),
  never hand-edited.
- Mode kernels = CSS custom-property sets on `:root[data-mode][data-theme]`.
  Mode/theme switching is exactly two attribute writes — GPU-cheap,
  deterministic, no re-render.

## 3. Project structure

```
/
├── SPEC.md                  this file
├── DESIGN.md                generated token table — do not hand-edit
├── uno.config.ts            single design truth (Tachyons table + mode tokens)
├── astro.config.mjs         astro + lit + unocss integrations
├── src/
│   ├── pages/index.astro    the one-pager (only page)
│   ├── layouts/Base.astro   head, theme bootstrap (no-FOUC inline script), Lenis init
│   ├── styles/modes/        brutal.css essential.css clay.css generative.css
│   │                        (custom-property kernels, light+dark pairs each)
│   ├── components/          Lit islands:
│   │   ├── mode-wheel.ts    hero-line wheel selector (GSAP inertia)
│   │   ├── project-index.ts pinned trigger + index list (dot states)
│   │   ├── work-overlay.ts  full-screen work detail overlay
│   │   └── theme-toggle.ts  light/dark, persisted
│   ├── scenes.ts            existing canvas scenes → generative mode bg
│   └── content/
│       ├── config.ts        zod schema for works
│       └── works/*.json     lorem works v1; scraped Cargo data later
└── public/
```

### Works schema (design for batch 2 now)

```ts
{ slug: string, title: string, category: 'restaurant'|'hotel'|'music'|
  'vintage'|'books', year: number, image: string, summary: string,
  palette?: string[], mechanic?: string /* signature move, drives the
  work page's expression */, source?: string /* attribution only — never
  rendered as an outbound link */, real?: boolean }
```

Seed v1 with 18 works: `smac` (`real: true`, featured first) + the 17
surveyed works from `works-survey.md` — real names/palettes/mechanics,
lorem only in `summary`. Each work gets one high-fidelity stock photograph
(curated Unsplash, category-coherent), downloaded to `public/works/` and
committed — no hotlinking. Imagery is exempt from the color law;
`essential` MAY render it duotone via a kernel filter token.

## 4. Code style

- Global mandate applies (`/Users/s3nik/CLAUDE.md`): DOP, immutability,
  `UI = f(state)`, surgical diffs, no drive-by refactors.
- App state is one atom: `{ mode, theme, activeWork | null }`. Components
  dispatch intents; a single reducer writes `data-*` attributes on `:root`.
  Impossible states are unrepresentable (mode is a union of four literals).
- Lit components stay dumb: render from attributes/properties, emit events.
  GSAP timelines live in isolated modules, not inside render logic.
- Animations: transforms + opacity only (GPU-bound). Honor
  `prefers-reduced-motion` — reduce to opacity fades, disable wheel inertia,
  Lenis falls back to native scroll.
- TypeScript strict; no `any`, no compiler bypasses.

## 5. Testing strategy

- **Unit (vitest):** the cheap, primary channel.
  - Reducer: mode/theme/overlay transitions — full truth table asserted.
  - Layer logic: pinned vs themed resolution per mode.
  - Wheel math: snap-to-nearest given angle/velocity (pure function, no GSAP).
  - Works schema: collection validates; category union exhaustive.
- **Static:** `oxlint && tsc --noEmit && astro check` must be zero before
  handoff. UnoCSS blocklist violations fail the build.
- **Visual/E2E:** none in this spec — user runs dedicated sessions.

## 6. Commands

```
pnpm dev          astro dev
pnpm build        astro build
pnpm preview      astro preview
pnpm test         vitest run
pnpm check        oxlint && tsc --noEmit && astro check
pnpm design:doc   regenerate DESIGN.md from uno.config.ts
```

## 7. Boundaries

**Always:** verify web-platform APIs against MDN MCP while writing; keep every
work-item reachable by keyboard (index rows focusable, overlay traps focus,
`Esc` closes); build mobile-first; keep `main` deployable.

**Ask first:** any new dependency; deleting `src/scenes.ts` code paths;
altering the works schema; touching DNS/deploy config (Spaceship PUT replaces
ALL records — preserve `smac` A record).

**Never:** Tailwind/StyleX/styled-components or any second styling system;
arbitrary utility values; hand-edits to `DESIGN.md`; routing/multi-page (the
one-pager is the product); blur-based shadows in `brutal` mode (offsets only).

## 8. References (inspiration, not runtime deps)

- Project Index: https://www.heller.tv/about · wordmark ref: SCR-20260715-pmhp.png
- All SCR-*.png comps are vendored in
  `openspec/changes/add-mode-wheel-one-pager/refs/` (hero comp = qunr,
  index trigger = pmhp, full-screen index = pmjh)
- Batch 1 (aesthetic/motion refs): awwwards — twomuch, brutalism collection,
  hawraf, apelido-apelido, project-list hover effects (Jacob Sutton),
  hover + background-pattern animation, full-screen menu, google-images portfolio
- Philosophy: tachyons.io/docs (the kernel), brutalistwebsites.com,
  neubrutalism.com, experiencelab.publicisgroupe.jp, makingsoftware.com
  (how-to-make-a-font), overstory-nyc.com (bar ref)
- Batch 2 (future works data): cargo.site template list + after.band,
  skrillex.com, roxy bar, warmnfuzzy.tv — arrives as `works/*.json`

## 9. Milestones (implement in order, each lands green)

1. **Scaffold:** Astro + Lit + UnoCSS(Tachyons) + Lenis + GSAP wiring;
   `check` green; existing scenes.ts imported untouched.
2. **Mode kernels:** four CSS custom-property sets × light/dark; state atom +
   reducer + theme-toggle; truth-table unit tests green.
3. **Wheel:** hero line + mode-wheel island, GSAP inertia snap, dot states,
   keyboard support; snap math unit-tested.
4. **Project Index + overlay:** pinned trigger, index rows with dot hover
   language, full-screen overlay, focus trap; lorem works collection.
5. **Polish:** scroll reveals (ScrollTrigger via Lenis ticker), reduced-motion
   audit, `design:doc` generator, DESIGN.md committed.
