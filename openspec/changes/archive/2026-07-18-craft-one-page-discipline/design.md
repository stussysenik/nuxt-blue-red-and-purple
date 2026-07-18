# Design — craft-one-page-discipline

## The reframe that drives everything

"One-page" was implemented as *one screen* (`max-height:100dvh; overflow:hidden`).
The golden-era / Cargo sense is *one route, one continuous composition*. Letting
work pages scroll cleanly is not a betrayal of the concept — it is the first time
the concept is honored. Every decision below follows from this.

## Decisions

### 1. Chrome contract lives in Base.astro, solved once

Today `.chrome-back` (work pages) and `.corner-mark` both claim the top-right
corner, and pages place their own content there too — collisions are per-page
luck. The fix is a **global reservation**: Base.astro defines a chrome band
token (`--chrome-band: calc(var(--chrome-inset) * 2 + 1lh)` or equivalent) and
every page's root layout pads below it. Corner ownership is exclusive by
`chrome` variant:

| chrome    | top-left | top-center      | top-right   |
|-----------|----------|-----------------|-------------|
| `index`   | —        | Project Index   | ✳ mark      |
| `close`   | —        | Close           | ✳ mark      |
| `work`    | —        | —               | ← Index     |

Work pages must not render their own content inside the band. This is enforced
by the contract test (no page-owned absolutely-positioned content anchored to
`top` inside the band region is impractical to assert statically; instead the
test asserts the page opts into the band padding — see §5).

**Trade-off considered:** per-page manual clearance (status quo) vs. global
band. Global band costs a few px of always-reserved space on work pages but
makes collision *unrepresentable* — the strong-type instinct applied to layout.

### 2. Retire the 100dvh trap; keep the page-object framing

`max-height: 100dvh` + `overflow: hidden` → `min-height: 100svh` + natural
document flow. The drawn frames (d445's double rule, etc.) remain — a frame can
grow with its content; print pages have always done this (a tall broadsheet is
still one page). Lenis continues to provide smoothing on the document scroller;
`data-lenis-prevent` inner scrollers disappear because there are no inner
scrollers anymore.

### 3. Motion: GSAP ScrollTrigger → CSS scroll-driven animation

The scroll reveals in Base.astro (opacity/translate on `.band`) are expressible
as:

```css
@supports (animation-timeline: view()) {
  .band { animation: band-rise both; animation-timeline: view();
          animation-range: entry 0% entry 60%; }
}
```

- Compositor-driven, zero JS, and the no-support / reduced-motion fallback is
  *fully visible content* — strictly progressive enhancement (Firefox gets a
  static page, which is correct).
- GSAP then has **zero runtime call sites** (the wheel that used it is
  archived). Lenis stays: it is small, is the only remaining scroll JS, and the
  buttery feel is part of the product. Its GSAP-ticker wiring is replaced by
  Lenis's own rAF.

**GSAP dependency:** `src/components/mode-wheel.ts` (archived, imported
nowhere) still typechecks against `gsap`. Removing the dep breaks `tsc`.
Resolution: move `mode-wheel.ts` to `openspec/changes/archive/` territory is
wrong (it's code, not spec); instead exclude it from `tsconfig` OR keep the dep.
**Decision: keep `gsap` in package.json for P1** (zero bytes ship — it is only
reachable via the archived component), and note its removal as a follow-up when
the wheel is either revived (P2 dialkit, rebuilt without GSAP inertia) or
deleted. Shipping zero GSAP bytes is what the thesis requires; the lockfile
entry is inert.

### 4. Imagery pipeline (Gratisography)

- Source: gratisography.com, free license, quirky register — matches the brand.
- One photo per work (14), category-coherent, downloaded to `public/works/<slug>.jpg`
  (slot already wired via `works/*.json` → `image`), replacing the current set.
- **Curation is user-in-the-loop**: candidates are viewed (Read tool renders
  them) and approved before commit — per the standing imagery memory.
- Render: `<img>` with explicit `width`/`height` (or `aspect-ratio`),
  `object-fit: cover`, `loading="lazy"` below the fold, `decoding="async"`.
- Ghost load-in: a paper-tint skeleton behind the image; the image fades in on
  load (`@starting-style` opacity transition, no JS). This is the
  "production-feel" signal, expressed in CSS.

### 5. QC contract test = the regression gate

Extend `test/work-page-contract.test.ts` (static source assertions — the cheap
channel, no browser):

- forbids `max-height: 100dvh` and viewport-clipping `overflow: hidden` on the
  page root (the trap cannot return);
- requires the imagery slot: an `<img` bound to the work's committed photo;
- requires the chrome-band opt-in (a shared class or var reference);
- keeps the existing three assertions (chrome="work", no CaseStudy, archived
  copy block).

Plus `test/template-config.test.ts`: schema round-trips, defaults are valid,
every axis is a closed enum (illegal configs unrepresentable).

### 6. template-config schema (P1: types only)

```ts
// enumerated axes — every dial is a closed union; freeform values cannot exist
{ skin: 'essential'|'brutal'|'clay'|'generative',
  theme: 'light'|'dark',
  font:  'archivo',            // widens in P2 when pairs are added
  scale: 1 | 1.1 | 1.25,       // density steps, not a slider
  images:'placeholder'|'client',
  copy:  'lorem'|'client' }
```

Defaults = the base template. The diff from defaults is "what the customer did"
— the future order object. URL serialization, the dots UI, and pricing are P2/P3
and extend this object without rewrites.

## Risks

- **Scroll-driven animation support** (no Firefox as of early 2026): mitigated
  by `@supports` — non-supporting browsers get static, fully-visible pages.
- **Re-crafting 14 bespoke pages** is the bulk of the work; the contract test
  keeps each page honest as it lands, page by page (each commit green).
- **Gratisography curation** needs user taste approval — batched into one review
  round to keep the loop tight.
