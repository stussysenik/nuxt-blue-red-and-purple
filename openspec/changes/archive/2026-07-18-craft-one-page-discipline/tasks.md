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

- [x] 3.1 Curate 14 Gratisography candidates (category-coherent, quirky
      register); view each; **batch one user approval round** before commit.
      (User gave blanket approval for the Gratisography set — "any random
      Gratisography image is fine" — closing the approval round.)
- [x] 3.2 Optimize + commit to `public/works/<slug>.jpg` (≤200KB each,
      ~1600px). Shared ghost-load CSS: paper-tint skeleton, reserved
      aspect-ratio, fade-in on load, no JS, no layout shift. (All 14 committed
      in `public/works/`, 46–149KB each, rendering on every page — §4.3.)

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
- [x] b374 — open-book spreads; crease pinned fixed over natural scroll, photo
      is the book's plate, running head opts into the band (collision retired),
      spine progress scroll-driven (commit)
- [x] b421 — proposal deck; pinned chrome → sticky cover sheet over natural
      scroll, A/B/C swap kept, plate A1 seats the committed photo (commit)
- [x] b508 — draggable type-collage; overflow trap retired, TL display opts into
      the band, one draggable specimen chip becomes the committed photo (commit)
- [x] b970 — full-bleed still + 3/3/6 editorial band; ::before echo → committed
      photo, overflow trap retired, band opts into --chrome-band (desktop
      collision retired); single-screen by concept (commit)
- [x] d429 — document sheet; max-height clip → real scroll (runs deeper than the
      viewport honestly), foot-of-margin plate is the committed photo, masthead
      clears the band (320/375 collision retired), body → lorem (commit)
- [x] g858 — journal card over wallpaper; wallpaper → committed photo, card opts
      into the band, slide-up shop leaves layout when closed (no dead scroll) and
      covers + retires the chrome when open (Close/← Index no longer stack) (commit)
- [x] h724 — cursor-zone slideshow; plate 01 is the committed photo, nav opts
      into the band, hard-cut mechanic kept; single-screen by concept (commit)
- [x] l384 — index + cut-through plate; plate → committed photo, both top regions
      (phone index, desktop right column) opt into the band (320 collision +
      desktop bar collision retired) (commit)
- [x] p673 — frosted-nav ledger; entry 01 plate is the committed photo, column
      opens below the band and the sticky nav sticks below it (info/contact
      collision retired at rest AND scrolled), caption copy → lorem (commit)
- [x] skrillex — full-bleed art page; photo becomes the artwork, rail clears
      the band, arrival mechanic kept; single-screen by concept (commit)
- [x] smac — before/after seam (real client, copy stays real); height/overflow
      trap → min-height:100svh, whole contrast opts into the band (ribbon <b>
      collision retired), range overdraw contained via overflow-x:clip (commit)

The 8 subtasks, applied per page (checked when ALL 14 pages satisfy each — the
§4 gate is fully green only when the page tracker above is fully checked). For
each of after, b374, b421, b508, b970, d429, d445, f853, g858, h724, l384, p673,
skrillex, smac — keeping its bespoke concept:

- [x] 4.1 Retire the 100dvh trap → `min-height: 100svh`, natural scroll;
      frames grow with content.
- [x] 4.2 Chrome-band opt-in; relocate any page content out of the band
      (f853's numeral collision is the reference bug).
- [x] 4.3 Render the work's photo into the imagery slot with the ghost
      load-in.
- [x] 4.4 Typography pass: ragged-right, `text-wrap: balance` on display
      titles, spacing/margins on the token ladder only.
- [x] 4.5 Cut self-annotation; a mechanic survives only as interaction (e.g.
      d445: plate is click-to-zoom with cursor affordance — no labeled toggle).
- [x] 4.6 Body copy → lorem ipsum; real metadata (title/category/year) stays
      (smac excepted — a real client, its copy is verbatim from the shipped site).
- [x] 4.8 Elaborate the composition: ≥3 distinct movements on the token
      ladder; the signature mechanic live via interaction/scroll (CSS-first);
      at least one scroll-driven behavior beyond the shared band reveal (full-bleed
      single-screen concepts — skrillex, b970, h724, g858 — take the skrillex
      exemption, their mechanic + ghost-load + arrival standing in for scroll).
- [x] 4.7 320/375/768/1280 sweep per page: no horizontal overflow, nothing
      clipped, nothing under chrome — verified site-wide via a programmatic
      iframe overlap detector (64/64 page×breakpoint combinations clean, incl.
      the interactive states: g858 shop, h724 cut, p673 scrolled, smac dragged).

## 5. Project index + close-out

- [x] 5.1 /works: natural document scroll (dropped `data-lenis-prevent`),
      chrome-safe padding at all sizes, row tap targets ≥44px (min-height added
      for the clamped mobile numeral), ghost backdrop non-blocking. (The
      typographic-quotes clause is obsolete: the index pivoted to Roman numerals
      in 5715302 — no titles are rendered, so nothing to quote.)
- [x] 5.2 Full gate: `pnpm check` + `pnpm test` zero (0 errors / 188 passed);
      build (17 pages); `grep` dist for gsap (no library ships — only the word
      "GSAP" in removal-rationale comments) and self-annotation (absent).
- [x] 5.3 Update `openspec` specs via archive flow when deployed (85ce87b, prod
      READY). Follow-up: the `gsap` dep stays in package.json for the archived
      wheel — no runtime path imports it (dist is gsap-free); its removal rides
      the wheel's P2 fate.

Dependencies: 1 → 2 → 4; 3 can run parallel to 2; 5 last. P2 (dialkit island)
and P3 (config-as-order) are separate future changes building on 1.2's schema.
