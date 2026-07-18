# Tasks — catalog-preview-reveal

Gate for every section: `pnpm check` exit 0, `vitest run` green.

## 0. Prerequisite / reconcile
- [ ] 0.1 Review the preview deploy on a real device (green-icon fix, centred
      Index, brutalist CTA at 320px, acid-green contact legibility, grain).
- [ ] 0.2 Decide reveal shape A (image-forward) vs B (template-forward/rebus) —
      default to A now, B after `stage-template-storefront` §4.1 `?frame=1`.

## 1. Image-forward preview reveal → deploy checkpoint
- [ ] 1.1 Preview panel markup + styles on `works/index.astro`: a fixed/offset
      framed preview fed by the active row's `data-image`; sharp, curated focal;
      compositor-only reveal keyed off `:hover`/`:focus-visible`.
- [ ] 1.2 One active row at a time; share the active row with the `.row__dot`
      indicator and the existing ghost. No CLS; numerals stay legible.
- [ ] 1.3 Touch affordance: default preview (first row) + tap navigates, or a
      press-peek. No dead hover on touch.
- [ ] 1.4 Reduced-motion + a11y (focus reveals identically to hover); label test.
- [ ] 1.5 Gate + deploy.

## 2. Template-forward / rebus (after `?frame=1` exists)
- [ ] 2.1 Lazy per-row scaled `?frame=1` preview (iframe or prerendered card),
      `pointer-events: none`, only the active row mounted.
- [ ] 2.2 Perf: verify no jank with the compositor gate; cap concurrent mounts.
- [ ] 2.3 Gate + deploy.

## 3. Handoff items (track, not necessarily this change)
- [ ] 3.1 Promote nav checkpoint (241b8da / 0d00443 / 5715302) to production once
      device-reviewed.
- [ ] 3.2 Reconcile `stage-template-storefront/tasks.md` §2 with the numerals /
      STORE / spine / CTA already shipped, then resume the engine flagship-first.
