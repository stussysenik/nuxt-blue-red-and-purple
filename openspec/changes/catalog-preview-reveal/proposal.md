# Catalogue Preview Reveal — the rebus hover-preview for the Project Index

## Why

The Project Index now identifies works by Roman numeral (I–XIV), not by name
(shipped 2026-07-18, commit 5715302). That is the right catalogue move — buyers
reference by number — but it makes the numerals **cryptic on their own**: "IX"
tells you nothing until you open it. The existing `.index__ghost` (a faint,
blurred background image that intensifies on row hover) is a start, but it is a
*mood*, not a *preview*. The prospect the site is sent to should be able to hover
a numeral and immediately **read what it is** — the way the studio's own
`stussysenik.com/works` hover preview works, or a rebus (picture-for-word) index.

This is the difference between a catalogue that *lists* and one that *sells*: the
reveal is what lets a numeral stand in for a name without losing the work.

## What Changes

- **index-catalogue** (new capability): a real hover/focus **preview reveal** on
  the Project Index. Hovering (or keyboard-focusing) a numeral row surfaces a
  legible preview of that work — either
  1. **image-forward** — the work's committed photo presented as a framed,
     near-cursor (or fixed-panel) preview at real fidelity, not just a blurred
     ground; or
  2. **template-forward (rebus)** — a live, scaled, non-interactive thumbnail of
     the actual `/works/<slug>` template, so the prospect previews the *solved
     page*, not a stock photo.

  Decide between them in design (§ below); template-forward is the stronger sell
  but heavier — image-forward is the safe first slice.
- The reveal is **compositor-only** (opacity / transform / filter), keyed off
  `:hover`/`:focus-visible`, and must not hurt numeral legibility or CLS.
- **Touch**: no hover on touch — the reveal must have a tap/press affordance or
  a sensible default (e.g. first-row preview shown, tap opens).

## Non-Goals

- No change to the catalogue numbering or the STORE labels (already shipped).
- No iframing of third-party sites; previews are our own pages/images only.

## Impact

- Code: `src/pages/works/index.astro` (reveal markup + styles + the small hover
  script it already has); possibly a shared preview island if template-forward.
- Specs: adds `index-catalogue`.
- Sits alongside — and feeds — the larger `stage-template-storefront` engine
  change (see design § Handoff); this is the catalogue-surface slice of it.
