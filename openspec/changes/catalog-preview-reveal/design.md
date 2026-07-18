# Design — catalog-preview-reveal

## The reveal — two candidate shapes

**A. Image-forward (safe first slice).** Keep the current `data-image` per row.
On hover/focus, render the work's photo in a **fixed preview panel** (e.g. a
framed rectangle offset to one side, or centred behind the numerals at higher
fidelity than the blurred ghost) — sharp, ~0.6–0.9 opacity, object-position from
a curated focal. Reuses the existing hover script (it already paints the ghost
from `data-image`). Cheapest; ships in one file.

**B. Template-forward / rebus (the stronger sell).** On hover/focus, mount a
**scaled, non-interactive live preview** of `/works/<slug>` — a same-origin
`<iframe>` (or a prerendered card) at real device width, `transform: scale()` to
a thumbnail, `pointer-events: none`, lazy per row. The prospect previews the
*solved page*, not a stock photo — which is exactly what the storefront sells.
Heavier: needs the `?frame=1` chrome-suppressed render from the engine change
(`stage-template-storefront` task 4.1) to look clean, and careful lazy-loading so
14 iframes don't all mount. **Recommend building A now, B once `?frame=1` exists.**

## Interaction / state

- Events: `pointerenter` / `focus` show; the active row also drives the existing
  ghost. One `active row` at a time (atomic).
- The `.row__dot` "you are here" mark (already shipped) is the active indicator —
  the preview and the dot share the same active row.
- **Touch**: `:hover` never fires. Options: (a) show the first row's preview by
  default and let tap navigate; (b) an explicit press-and-hold peek. Pick one.
- Reduced motion: reveal appears without the scale/blur transition.

## Constraints (inherited)

- Compositor-only animation (transform/opacity/filter) — the 120fps law.
- Colour law: no forbidden hues introduced by any preview chrome.
- No CLS: the preview is an overlay/fixed layer, never reflows the numeral list.
- Legibility: numerals stay readable over/beside the preview at all sizes.

## Handoff — what else is outstanding (for the new session)

This change is the catalogue-surface slice. The rest of the roadmap, in priority
order:

1. **Promote the nav checkpoint to production.** Commits 241b8da, 0d00443,
   5715302 are on branch `craft-one-page-discipline`, verified + preview-deployed
   (blueredandpurple-4z6znj009-senik.vercel.app). Once the user has reviewed the
   preview on a real device, `vercel --prod` (or merge → auto-deploy).
2. **Device/mobile verification pass** (the user's own browser session): confirm
   the green-icon-on-mobile fix on a real phone, the centred Index + brutalist CTA
   at 320px, the acid-green contact legibility, and grain intensity.
3. **This change** (image-forward reveal → template-forward once `?frame=1`).
4. **`stage-template-storefront`** — the full 8-section engine (AST + render
   pipeline + inspector + all-14 `f(AST)` migration + perf gate). Its §2 catalogue
   work is now partly done (numerals, STORE, spine/CTA) — reconcile its tasks.md
   with what shipped this session before resuming.
