# Proposal: add-work-case-studies

## Why

The works linked out of the Project Index landed on a thin generic template —
a screenshot, a summary, a palette. The portfolio's pitch ("one-page systems")
was asserted, never demonstrated. This change makes every work page carry the
proof: the source's signature layout rebuilt 1:1 in our own HTML/CSS, staged
with rulers and narrated like a case study — the reconstruction is the
deliverable, owned byte for byte, with no third-party code, assets, or
attribution on any public surface.

## What Changes

- **New capability `case-study`:** a shared `CaseStudy.astro` shell (back →
  head → lede → narrative → measured stage → notes → palette/source) so
  thirteen layout-bespoke pages read as one portfolio. The stage frames the
  slotted reconstruction with 8 px/64 px ruler ticks and declares itself the
  size container (`container-type: inline-size`) so reconstructions measure
  in `cq*` units against the stage, not the viewport.
- **New capability `work-reconstruction`:** one bespoke page per visible work
  (13 total). Each transcribes its reference's grid, spacing, and type scale
  into kernel custom properties, de-branded — client artwork becomes kernel
  specimen plates; wordmarks become structural echoes. Where the work's
  mechanic is interactive it runs live (cursor-zone slideshow, draggable shop
  chips, frosted sticky nav, scroll-turned spreads, real-time clock, shop
  overlay, line-by-line arrival); inner scrollers carry `data-lenis-prevent`.
- **MODIFIED `project-index`:** rows grouped under industry labels
  (restaurant → hotel → music → books → vintage), `(N#)` numbering removed,
  years hidden across index, case studies, and the generic template.
- **MODIFIED S'MAC page:** reframed as the live client engagement — the hero
  reconstruction labelled as-found, the ledger presented as the designed
  solution running at `smac.blueredandpurple.world`.

## Voice & Provenance Rules

- Studies speak as studies ("The signature" / "Study notes") — confident
  analysis of the layout, never an implied client relationship, no invented
  quotes. Client voice is reserved for real engagements (S'MAC).
- No public surface names the inspiration platform; `f853` summary/source
  scrubbed accordingly. Reference screenshots remain internal inputs only —
  no bespoke stage ships an image.

## Impact

- Affected: `src/components/CaseStudy.astro` (new), 12 new
  `src/pages/works/<slug>.astro`, `smac.astro`, `works/index.astro`,
  `works/[slug].astro` (BESPOKE set), `src/content/works/f853.json`.
- The generic `[slug].astro` template now serves only hidden works; it stays
  as the landing surface for future scraped drafts until each is promoted.
