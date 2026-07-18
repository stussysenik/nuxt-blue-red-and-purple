# Stage Template Storefront — a White-Label Content-Model Engine

## Why

The thesis has crystallized one step further: the site is not a portfolio, and
not even a catalog of 14 skinnable pages — it is a **white-label engine** whose
14 templates are *fully pre-solved, principled one-page problems*. It is a
**sales asset**: sent to a named prospect, it must let them **feed their own
content into a template and watch it get solved in front of them**, then reach
the inquiry CTA in one click (the negotiation path). `craft-one-page-discipline`
made every page overlap-clean and CSS-first — it passed the *impression* test.
What's missing is the *utilitarian* proof: that these are real, content-driven,
event-based systems, not fixed compositions with baked-in copy.

The gaps, restated against that bar:

1. **Templates are hardcoded, not engines.** Copy is baked in. A prospect can't
   see their own idea flow through the shell. Templates must become pure
   functions of a content tree (`view = render(paradigm)(content, layers, state)`).
2. **No product identity.** Cryptic slugs ("b374") — buyers can't reference or
   compare. They need catalog numbers: Roman numerals, no names.
3. **High UI distance + hard cuts.** No persistent spine carries you I → II → III;
   navigation is a white flash. The site that sells motion has none between pages.
4. **The buyer can't try the product.** No way to feed content, peel a template
   to its solved skeleton, re-skin it, or preview it at device size without
   devtools.
5. **"How it works together" is undefined.** Interactions are ad-hoc. Each
   template must declare a **finite state machine** — visual states + event-driven
   transitions over time (the time-based / event-based core).
6. **Mobile legibility leans on pinch-zoom in places.** Content is never
   zoomed-to-read; density is resolved by layout shift, mobile-first.
7. **120fps is asserted, not gated.** Compositor-only motion needs a mechanical
   gate.

## What Changes

- **content-model** (new): a generic, immutable content AST (identity + hero +
  typed blocks) and lorem trees per category; templates render *from* it. The
  "break down any content" promise, made structural.
- **template-depth** (delta, reshaped): every template is `f(AST)` with a
  declared **layout paradigm** and a declared **state machine** (visual states +
  event transitions); a **motion identity** (native default; gsap / motion opt-in,
  loaded only where sold); nothing-dead interactivity; no zoom-to-read; optical
  imagery placement.
- **demo-chrome** (delta, reshaped as an **inspector**): structure↔content toggle
  (peel to the solved skeleton), feed-content, layer dial (color / imagery / type
  / motion — zero CLS), device preview, and an always-visible inquiry CTA.
- **template-catalog** (new): Roman-numeral identity I–XIV from an explicit
  `ordinal`; display-only (URLs keep slugs); each template labeled with niche +
  paradigm + motion identity, shipping its own share card (per-template OG).
- **site-shell** (delta): persistent nav spine in the chrome band — numeral,
  prev/next (wrap), index, inquiry CTA — identical positions site-wide; native
  cross-document view transitions with numeral continuity.
- **adaptive-performance** (delta): 120fps compositor gate — animated properties
  restricted to transform/opacity/filter, enforced by a static test.
- **Checkpoint deploys** after each shippable slice; **flagship-first** delivery
  (engine + inspector + 3–4 templates across paradigms ship to the prospect
  fast), all-14 engine migration as the end-state.

## Non-Goals

- No checkout/licensing flow — "sellable" means positioned, tryable, advertisable.
- No URL renaming — slugs stay; numerals are presentation.
- No CMS/auth. "Feed content" is curated sample trees (paste-to-AST is a stretch).

## Impact

- Specs: adds `content-model`, `template-catalog`, `demo-chrome`; extends
  `template-depth`, `site-shell`, `adaptive-performance`.
- Code: `src/content/works-schema.ts` + `src/content/works/*.json` (ordinal,
  niche, paradigm, motion, content tree); a content-render pipeline
  (`src/lib/render/*`); `src/layouts/Base.astro` (spine, view transitions,
  inspector mount); `src/pages/works/*` (migrated to `f(AST)`); inspector island;
  `test/` (AST validation, numbering, state-machine legality, compositor gate,
  dial state).
- Prerequisite: archive `craft-one-page-discipline` (bespoke-pages phase complete;
  it is the raw material this engine systematizes).
