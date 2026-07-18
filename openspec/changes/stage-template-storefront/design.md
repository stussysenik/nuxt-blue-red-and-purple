# Design — stage-template-storefront

*Revised: the storefront is a **white-label content-model engine**, not a set of
skinnable pages. Reshaped from day one around one law (below). Catalog / spine /
transitions (old §1) survive unchanged; the demo layer and depth pass are rebuilt.*

## 0. What this actually sells

The site is a **sales asset**. Sent to a named prospect, it must let them feed
their own content into a template, watch it get *solved* in front of them, and
reach the inquiry CTA in one click. We sell the **pre-solved, principled one-page
problem** — white-label — not a layout. The engine is the proof; the CTA is the
conversion; the negotiation is the goal.

## 1. The law — `view = render(paradigm)(content, layers, state)`

Separate **what** from **how** (data-oriented). Three inputs, one pure renderer:

- **content** — a generic, immutable tree (the "AST"; §2). Never hardcoded copy.
- **layers** — the orthogonal render config (§3): paradigm, composition, type,
  color, imagery, motion, choreography.
- **state** — the current visual state of a finite machine; advances via events
  over time (§4). `view` is always a pure function of it.

A template is a *parser + renderer* for the content vocabulary, driven by an
event-folded state. Nothing on screen is a fixed string.

## 2. Content model — the AST

One typed vocabulary every template can parse:

```
Document
  identity : { name · category · year · tagline }
  hero     : { headline · sub · media? }
  blocks   : Block[]
      prose   { heading? · body }
      list    { heading? · items[] · as: index|marquee|ledger|timetable }
      media   { src · caption? · focal }
      pair    { before · after }        ← smac's seam
      spread  { left · right }           ← b374's book
      quote   { text · cite? }
      meta    { rows: {k,v}[] }          ← spec sheets
```

Ships with a **lorem tree per category** (restaurant · gallery · festival …) so
every template embodies *something* out of the box. Feed a different tree → the
template re-embodies it. A template declares which block types it renders and how
its paradigm maps them to a skeleton; unknown blocks degrade, never crash.

## 3. The layer stack (orthogonal — each independently inspectable & swappable)

```
L1 paradigm      narrative · snap-sandwich · sliding-panels · full-page  (blocks → skeleton)
L2 composition   grid · rhythm · density            (token ladder only)
L3 type          the voice
L4 color         the register                       (existing theme custom props)
L5 imagery       on · B&W · none · optical focal
L6 motion        native-css (default) · gsap · motion  (compositor-only; §6)
L7 choreography  the event→state→view machine over time (§4)  ← the "how it works together"
```

A template = **one named coordinate** in this space. "III" is not a page — it is
a vector of layer choices bound to a content tree. The 14 works become 14 curated
coordinates, each a different point so the *range* of the engine is visible.

## 4. Templates are state machines — design from the visual state

Each template declares a **finite set of visual states** and **event-driven
transitions** between them. "What's shown" = `f(current state)`; "how it works
together" = the transition graph. Impossible states are unrepresentable (§2 of
the mandate). This is the time-based / event-based core: the page is a **fold
over an event stream**.

```
smac (pair)        rest ──drag──▶ dragging ──release──▶ revealed
after (timetable)  list ──focus row──▶ row-detail ──esc──▶ list
b374 (spread)      cover ──scroll──▶ spread[n] ──▶ colophon
```

Events: `scroll · pointer · key · timer · navigation`. State is atomic and
minimal; the renderer never mutates the DOM imperatively beyond applying the
next state. Cross-document view transitions (§8) are themselves state changes at
the catalog level (numeral II → III).

## 5. The inspector — the sales engine (rebuilds demo-chrome)

One island mounted by `Base.astro` on template pages. Not a skin dial — a **layer
inspector**:

- **Structure ↔ Content toggle** — peel any template to its bare skeleton (the
  pre-solved *bones*, the principled problem laid bare, no content), then snap
  back to the embodied render. Toggling this in front of a prospect *is* the
  pitch: "here's the solved problem — here's it with your idea."
- **Feed content** — swap the content tree live. Curated sample sets first
  (restaurant · gallery · festival); stretch: paste markdown → AST.
- **Layer swaps** — flip color / imagery / type / motion via one `data-*`
  attribute per axis on the root; **zero layout shift, zero FOUC** (pre-paint
  inline script, the existing theme-toggle pattern); no-imagery keeps ghost
  ground.
- **Device preview** — same-origin `<iframe src="?frame=1">` at real device
  dimensions (390×844 / 844×390), `transform: scale()` to fit; `?frame=1` hides
  spine + inspector via a pre-paint root class; dial + content state propagate
  via query string so the preview matches the dialed configuration.
- **Inquiry CTA** — always visible, fixed coordinates, one click from the moment
  the engine lands. The negotiation path, earned.

## 6. Motion identity & the 120fps gate

`native-css` is the default and ships 0 bytes of library. `gsap` / `motion` are
opt-in per template, loaded **only** on pages that declare them, deferred — "each
template ships only the motion runtime it sells." State transitions (§4) animate
via **transform/opacity/filter only** (FLIP by construction). Enforced by a
static vitest scanning built CSS + sources for animation/transition declarations
naming layout properties. One 120Hz DevTools trace on the heaviest template
before final deploy.

## 7. Legibility · optical placement · no zoom-to-read

Unchanged intent: at ≥320px all body text ≥ the readable Tachyons step; density
resolved by **layout shift, not scale** (reflow / disclosure / layout animation).
Every `media` block declares a curated focal point (`object-position`) so the
subject survives every container ratio; verified by eye at 320 / 768 / 1280.
Styling stays inside the Uno/Tachyons vocabulary.

## 8. Catalog · spine · transitions (survives from §1, unchanged)

`ordinal` per work → Roman numerals (display only; URLs keep slugs). Index and
spine sort by ordinal. Persistent nav cluster in the chrome band (prev/next wrap,
`N / XIV`, index, always-visible inquiry CTA), fixed coordinates site-wide,
ArrowLeft/Right. `@view-transition { navigation: auto }` cross-document with
`view-transition-name` on the numeral (Firefox degrades to instant nav — progressive
enhancement, zero JS stays zero JS; verify support via MDN, gate nothing on it).
Per-template document title + OG metadata from the identity label — the ad path.

## 9. Delivery — flagship-first, all-14 end-state

**End-state:** all 14 templates are `f(AST)` engines — the promise holds, every
interface breaks down any content. **Delivery order** (each checkpoint deployable):

1. Engine core: AST schema + lorem trees + render pipeline + **one template
   migrated as proof** (red → green against the contract).
2. Catalog + spine + transitions → deploy.
3. Inspector: structure↔content + layer dial (zero CLS) + feed-content → deploy.
4. Device preview → deploy.
5. **Flagship set** — 3–4 templates across *different paradigms* migrated to
   `f(AST)` + state machines → deploy. **← the prospect-ready asset.**
6. Remaining templates migrated to the engine, batched → deploy per batch.
7. Motion showcases (gsap FLIP, motion.dev layout) + nothing-dead + legibility /
   optical audits → deploy.
8. Performance gate + 120Hz trace → final deploy.

Flagship-first puts a working, converting asset in front of the prospect fast;
the all-14 end-state keeps the completionist promise. Matches the deployment
spec's checkpoint discipline.
