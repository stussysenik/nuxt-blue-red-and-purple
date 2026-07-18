# Craft One-Page Discipline — P1 Foundation

## Why

The product thesis crystallized: the agency sells **one-page compositions executed
with CSS-layer discipline** — responsiveness, spacing, margins, modern native CSS
(view transitions, scroll-driven animation), near-zero JS. The current build
contradicts that thesis in ways a junior/senior QC pass fails on sight:

1. **The 100dvh trap.** Work pages froze "one-page" to mean *one literal viewport*
   (`max-height: 100dvh; overflow: hidden`). On phones the composition is taller
   than the screen, so content clips with no way to reach it (f853's list runs
   past the fold; scrolling "doesn't work at all"). One-page means **one route,
   one continuous composition — not one screen.**
2. **Chrome collision.** The pinned `← INDEX` mark shares the top-right corner
   with page-owned content (f853's `2138` numeral renders as `← 2 1 N3D8E X8`).
   The chrome contract is per-page luck, not a global guarantee.
3. **Empty imagery slots.** Image spots render as abstract bordered boxes; the
   design reads unfinished rather than disciplined. Imagery source is
   Gratisography (free, quirky), curated by viewing before commit.
4. **Copy noise.** Essay-style hand-written copy on work pages competes with the
   design; the client should read the *design system*, not the prose. Work pages
   go lorem; the home page's real About/Contact copy stays.
5. **Motion contradicts the pitch.** Scroll reveals run through GSAP ScrollTrigger
   (JS, main-thread) while the site claims CSS-first. Native
   `animation-timeline: view()` does the same work on the compositor with zero JS.

## What Changes

- **site-shell** — global chrome contract: every page reserves a top chrome band;
  pinned marks own exclusive corners; page content can never collide with chrome.
  Scroll reveals move from GSAP ScrollTrigger to CSS scroll-driven animation
  (progressive enhancement, reduced-motion honored); GSAP leaves the runtime.
- **work-reconstruction** — each work page keeps its bespoke one-page *concept*
  but becomes a continuous scrollable composition (retire `max-height:100dvh` +
  `overflow:hidden`); its imagery slot renders the work's committed Gratisography
  photo with a skeleton/ghost load-in; body copy becomes lorem ipsum; the
  responsive QC contract test extends to enforce the new shape.
- **project-index** — /works index cleans up to onepagelove/iA-Writer restraint:
  correct mobile scroll and padding, no clipped rows, chrome-safe insets.
- **template-config** *(new)* — the client-customizer ("dialkit") config schema is
  **designed and typed now** (skin/theme/font/scale/images/copy as enumerated
  axes, defaults = the base template), but nothing writes it in P1. P2 (dialkit
  island) and P3 (config-as-order) extend this schema without rewrites.

## Non-Goals (P1)

- No dialkit UI, no ordering flow (P2/P3 — schema only).
- No new runtime dependencies; no ReScript. Type discipline = TS strict (logic)
  + UnoCSS blocklist / Tachyons closed vocabulary / color-law test (design).
- No redesign of the bespoke concepts themselves — d445 stays a reading page,
  f853 stays an index/CV; only their execution is re-crafted.
- Home page copy (About/Contacts) untouched.

## Impact

- Affected specs: `site-shell` (modified), `work-reconstruction` (modified),
  `project-index` (modified), `template-config` (added).
- Affected code: `src/layouts/Base.astro` (chrome + motion), all
  `src/pages/works/*.astro`, `src/styles/base.css`, `public/works/*.jpg`
  (replaced with curated Gratisography set), `test/work-page-contract.test.ts`
  (extended), `src/config/` (new schema module), `package.json` (GSAP removal
  once the archived wheel's typecheck dependency is resolved — see design.md).
