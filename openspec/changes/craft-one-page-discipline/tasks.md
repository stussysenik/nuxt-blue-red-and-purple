# Tasks — craft-one-page-discipline

Each task lands green (`pnpm check` + `pnpm test`) before the next; the
contract test grows first so pages are re-crafted against a failing gate
(red → green).

## 1. Gates first (red)

- [x] 1.1 Extend `test/work-page-contract.test.ts`: forbid `max-height: 100dvh`
      and root-level viewport `overflow: hidden`; require an `<img` bound to
      the work's committed photo; require the chrome-band opt-in; forbid
      `text-align: justify`; forbid self-annotation strings (case-insensitive
      `zoom · off|on`, `zoom disabled`) in rendered markup. Run: expect
      failures across all 13 work pages (the red state).
- [x] 1.2 Add `src/config/template-config.ts` (closed-axis types, defaults,
      `diffFromDefaults`) + `test/template-config.test.ts` (illegal values
      rejected, default diff is empty). Green immediately — schema only.

## 2. Global shell (unblocks every page)

- [x] 2.1 `Base.astro` + `base.css`: define the chrome band token; pad page
      roots below it; give `chrome="work"`'s `← Index` exclusive top-right
      ownership; safe-area maxing stays.
- [x] 2.2 Replace GSAP ScrollTrigger reveals with CSS
      `animation-timeline: view()` behind `@supports` (+ reduced-motion =
      static, fully visible). Lenis moves to its own rAF loop; no `gsap`
      import remains in any runtime path (dep stays for the archived wheel —
      see design.md).
- [x] 2.3 Verify home page: bands reveal via CSS, scroll smooth, zero GSAP in
      the built output (`grep -r gsap dist/` empty).

## 3. Imagery pipeline (parallel with §2)

- [ ] 3.1 Curate 14 Gratisography candidates (category-coherent, quirky
      register); view each; **batch one user approval round** before commit.
- [ ] 3.2 Optimize + commit to `public/works/<slug>.jpg` (≤200KB each,
      ~1600px). Shared ghost-load CSS: paper-tint skeleton, reserved
      aspect-ratio, fade-in on load, no JS, no layout shift.

## 4. Re-craft the 14 work pages (the bulk; one commit each, gate green per page)

**Per-page progress** (each session picks up here; one page = one green commit,
all 8 subtasks below applied at once). A page is checked only when it passes the
full contract + `pnpm check` + build. (The count is 14, not 13 — `after` is a
work page the contract enforces; design.md's risk note already says "14 bespoke
pages". The original §4 list dropped it.)

- [x] d445 — reading page; lens plate, reading-progress rule (commit)
- [x] f853 — index/CV; clock anchored to --chrome-band (collision fixed),
      index resolves into a past-the-fold plate (commit)
- [x] after — tour marquee/timetable; pixel wordmark stays data, poster plate
      supplies the imagery slot (commit)
- [ ] b374
- [ ] b421
- [ ] b508
- [ ] b970
- [ ] d429
- [ ] g858
- [ ] h724
- [ ] l384
- [ ] p673
- [ ] skrillex
- [ ] smac — already renders its photo; still needs trap/overflow retire + band

The 8 subtasks, applied per page (checked when ALL 14 pages satisfy each — the
§4 gate is fully green only when the page tracker above is fully checked). For
each of after, b374, b421, b508, b970, d429, d445, f853, g858, h724, l384, p673,
skrillex, smac — keeping its bespoke concept:

- [ ] 4.1 Retire the 100dvh trap → `min-height: 100svh`, natural scroll;
      frames grow with content.
- [ ] 4.2 Chrome-band opt-in; relocate any page content out of the band
      (f853's numeral collision is the reference bug).
- [ ] 4.3 Render the work's photo into the imagery slot with the ghost
      load-in.
- [ ] 4.4 Typography pass: ragged-right, `text-wrap: balance` on display
      titles, spacing/margins on the token ladder only.
- [ ] 4.5 Cut self-annotation; a mechanic survives only as interaction (e.g.
      d445: plate is click-to-zoom with cursor affordance — no labeled toggle).
- [ ] 4.6 Body copy → lorem ipsum; real metadata (title/category/year) stays.
- [ ] 4.8 Elaborate the composition: ≥3 distinct movements on the token
      ladder; the signature mechanic live via interaction/scroll (CSS-first);
      at least one scroll-driven behavior beyond the shared band reveal.
- [ ] 4.7 320/375/768/1280 sweep per page: no horizontal overflow, nothing
      clipped, nothing under chrome.

## 5. Project index + close-out

- [ ] 5.1 /works: natural document scroll (drop `data-lenis-prevent` +
      inner-scroll assumptions), chrome-safe padding at all sizes, row tap
      targets ≥44px, ghost backdrop non-blocking; template titles wrapped in
      typographic quotes (“Title”), smac unquoted (real client, not template).
- [ ] 5.2 Full gate: `pnpm check` + `pnpm test` zero; build; `grep` dist for
      gsap (must be absent) and for self-annotation strings (must be absent).
- [ ] 5.3 Update `openspec` specs via archive flow when deployed; note GSAP
      dep removal as follow-up tied to the wheel's P2 fate.

Dependencies: 1 → 2 → 4; 3 can run parallel to 2; 5 last. P2 (dialkit island)
and P3 (config-as-order) are separate future changes building on 1.2's schema.
