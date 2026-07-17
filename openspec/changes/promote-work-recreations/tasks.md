# Tasks: promote-work-recreations

Read `design.md` first — it carries the method, the h724 worked example, and the
"what 1:1 does not mean" rules. Do not eyeball a layout; measure it.

## 1. Removal (done)

- [x] 1.1 Delete hidden works `d445`, `warm-fuzzy`, `s176`, `z922`, `roxy-bar`
      (`src/content/works/<slug>.json` + `public/works/<slug>.jpg`).
- [x] 1.2 Delete `src/pages/works/[slug].astro`; `/works/d445` no longer builds.

## 2. Provenance repair (done — read the proposal's "corrected premise")

- [x] 2.1 Restore the curated Gratisography set to `public/works/` from
      `4c94867`; move the Cargo source renders to `refs/works/` (gitignored).
- [x] 2.2 `scripts/scrape-works.ts` writes renders to `refs/works/`, drafts
      `image` as a TODO, and no longer overwrites curated imagery.
- [x] 2.3 `test/work-provenance.test.ts` — proven red against the real
      regression (byte-identity + 16:10 shape), green after repair.
- [x] 2.4 `scripts/ref-geometry.py` — measure a reference (auto-detects light/dark
      ground). `--all` → `refs/geometry.txt`.

## 3. Exemplar (done)

- [x] 3.1 `Base.astro` gains `chrome="work"`: lone `← INDEX`, no corner mark, no
      ThemeToggle, no centred pill.
- [x] 3.2 `h724.astro` converted — recreation full-page, narrative archived,
      `container-type: inline-size` on the root, clamps re-tuned from
      measurement. Verified against the reference: cap height 25→25, `Info`
      45→45, `Index` 67→67, plate aspect 1.553→1.551.

## 4. Fission — one task per work (independent, parallelizable)

Order is sell-fastest first (design.md §Sequencing). Each: measure → convert
full-page per the h724 pattern → live mechanic preserved → narrative archived to
frontmatter → kernel tokens only → `pnpm test && pnpm check` to zero.

- [x] 4.1 `smac.astro` — **before/after slider** (as-found ↔ the delivered
      redesign at `smac.blueredandpurple.world`). Both halves rebuilt in-kernel;
      no image of the client's original. Reference is full-bleed photographic —
      read it by eye. Keep `data-lenis-prevent` on inner scrollers.
      Done. The "after" half is transcribed from the delivered site's own source
      of truth (`../blue-red-and-purple/S'MAC`, Svelte 5 + UnoCSS + GSAP), not
      invented: ribbon → sticky nav → scrimmed hero, with its copy verbatim from
      that repo's `content.ts`. Its photography is ©S'MAC NYC and is deliberately
      NOT copied here — both halves share our licensed Gratisography specimen, so
      the seam isolates the design change and nothing else. Seam is a real
      `<input type=range>` (drag/touch/arrow-keys free from the platform),
      pointer-transparent except at the thumb; with no JS it never renders and
      the page rests on the delivered half. No inner scroller survives the
      promotion (the page is one 100dvh fold), so `data-lenis-prevent` is moot.
- [x] 4.2 `l384.astro` — restaurant. 8 text rows measured.
      Done. Tool merged the two columns into one band — the reported `y19→178`
      cluster is really the lede's 6 lines *plus* the index head, 7 index rows
      and `Profile`/contact. Sub-divided by eye. Biggest deltas: index row pitch
      was 42% too loose, entry top 2.5× too tight. `--type` is declared on
      `.site` and *used* on children — an element is never its own query
      container, so a `cqw` font-size on `.site` would have re-resolved against
      the viewport.
- [x] 4.3 `b421.astro` — hotel; h724's pattern transfers directly. 8 rows.
      Done. Hairlines are near-invisible to the tool (reported as 1px specks);
      read by eye as four full-width rules + three dividers. The y602 specks
      pinned the 4-column grid to x406/800/1194, proving the columns are
      contiguous — the old `column-gap` was invented. Old `padding: 2.5%` was
      ~3.3× the reference's 12px. `--work-accent` was orphaned when `CaseStudy`
      stopped grafting it; it now grafts on `.site`, and the mode-dependent
      kernel tokens that would invert to invisible on the grafted white sheet
      derive from the grafted pair.
- [x] 4.4 `skrillex.astro` — music. Dark ground (L=45), 3 rows. Also live at
      `skrillex.com` for reference.
      Done. Tool degenerated fully (one 1712px "row" + two noise specks, zero
      usable numbers): the rail's *local* backdrop is a pale wall (L≈181–186),
      not the page ground (L=45). Re-measured against a local mean. The rail
      grounds in `--ink` because the artwork *is* the ground — which makes
      Base's `← INDEX` (`color: var(--ink)`) invisible, fixed page-locally.
      `padding-block` was on the wrong axis: in `vertical-rl` it is horizontal.
- [x] 4.5 `after.astro` — music.
      Done structurally, geometry UNMEASURED — **there is no `refs/works/after.jpg`**.
      The tool fails closed and no numbers were invented; the page keeps its
      existing proportions with caps re-tuned by holding each rule's effective
      rendered ratio at the old 1000px stage. This is the one page whose numbers
      the 6.1 visual pass must actually settle rather than confirm.
- [x] 4.6 `b508.astro` — music. 3 rows.
      Done. The reported 3rd row is a merged cluster — an 8-blank-row split
      cannot cut a 195px baseline pitch. Sub-divided via the ink profile, which
      independently confirmed both blocks share one size and one leading (the
      fact the page hangs on). Font cap was 40% short, weight 47% too heavy in
      stem. Full-bleed incidentally fixes a latent drag bug: `dx = clientX -
      offsetLeft` assumed the room's left edge sat at clientX 0 — false in the
      inset stage, true now.
- [x] 4.7 `b374.astro` — books. **Tool degenerates** (ground L=187, full-bleed) —
      read the jpg by eye.
      Done by eye; the tool found the photo, not the layout (its detected
      "ground" L=187 IS the verso photograph). Decisive find: the crease falloff
      is identical to two decimals on every row sampled, proving it is a
      synthetic gradient in the source, not photographed paper — and `.crease`
      was 256px against a measured 32px, ~8× out. **Could not** establish the
      verso-side falloff (the photo brightens near the gutter, returning
      negative alphas); mirrored the recto per the source's evident symmetry.
      b374 is the one exception to the top-right chrome rationale — its source
      nav is top-right and collides, so `← INDEX` moved to the bottom-right
      page-locally.
- [x] 4.8 `d429.astro` — books. 3 rows; already declares its own container.
      Done. The container claim verified TRUE and for the right reason: every
      `cqw` sat on a descendant, never on `.site` itself. Consequence is the
      inverse of the usual — no `rem` caps existed to be too small, but no
      legibility floor either (body copy would be 4.8px on a 375px phone), so
      floors were added rather than caps re-tuned. **Open call: the reference
      sheet is `#FCDA43` bright yellow and is kept de-branded to `--paper-1`** —
      the client's colour with no palette entry to legitimise it. This is the
      set's single biggest deliberate visual delta.
- [x] 4.9 `p673.astro` — books. 4 rows.
      Done. Tool read the y70 hairline as ink: there are THREE rules
      (y32/y70/y250), not two — the nav is a bordered band, and missing that
      mis-sets the whole vertical stack. Its `capH` is a band height
      (cap-top→descender), not cap height; isolating a descenderless word gave
      the true 17px. Headline was set at two-thirds scale (7.5rem cap vs a
      wanted 166px). `container-type: inline-size` applies style + inline-size
      containment only — no scroll container — so the sticky nav survives; never
      set `overflow` on `.site` or it becomes the nav's scroll container.
- [x] 4.10 `b970.astro` — vintage. **Tool degenerates** (ground L=127) — by eye.
      Done by eye. The 3/3/6 grid is real: ink starts x29/x417/x808 solve to a
      12-track grid at 129.8px pitch, needing an 18.6px (1.2%) gutter (the old
      1.5% put columns 2px off). One type size serves the whole band (C/D/B caps
      all y34→46 = 13px), and `.band__essay` was silently overridden by a
      `lh-copy` utility (1.5) that fought the measured 1.267 leading. Two real
      bugs surfaced: the artwork IS the ground here, so Base's `← Index` was
      `--ink` on `--ink` (invisible in **every** mode) sitting exactly where the
      essay column ends — re-inked to `--paper` and moved to the opposite corner;
      and the focus ring used `--spot` (always defined, so its `--paper` fallback
      never fired) → ink ring on ink. **Not** re-grafted: b970.json has no palette.
- [x] 4.11 `f853.astro` — vintage. 6 rows; live real-time clock must stay live.
      Done. Tool merges the bands and its "capH" is a cap-top→descender band, so
      the grid was re-derived from a raw ink profile: 14 lines on a 75.4px pitch,
      true cap 57px read off the descenderless "C.V." line. **Clock stays live**
      — a real `new Date()` on `setInterval(1000)`, tabular-nums so seconds don't
      jitter; the list is in flow so the room's paper runs past the fold and
      100dvh cuts the last line in half exactly as the reference is cropped.
- [x] 4.12 `g858.astro` — vintage. Dark ground (L=81), 3 rows.
      Done by eye — the tool locks onto the dark forest photo (L=81) and cannot
      isolate the yellow card. Read the card at left x24 (1.5cqw) / top y16 /
      width 486px (30.4cqw); wordmark cap ~86px = 125px type (9.2× the ~13.6px
      mono entry face, itself read from the longest copy line's ~8px advance).
      Real palette here (yellow/near-black) grafts as `--g-yellow`/`--g-black`,
      so no `--work-accent` orphan and the resting page is theme-robust: card and
      dock are fixed hexes, the wall (`--paper-1`) and `← INDEX` (`--ink`) invert
      together. Unlike skrillex the room does not force `--ink` as ground, so no
      chrome fix was needed. The hidden shop overlay grounds in the fixed
      `--g-black` while its plates/label use mode tokens (`--paper-1`/`--paper`) —
      a latent low-contrast case in a persisted dark theme; left as-is
      (invented, not in the reference) and flagged for the 6.1 pass.

## 5. Retire the shell & verify

- [ ] 5.1 Delete `src/components/CaseStudy.astro` once no page imports it
      (`grep -l CaseStudy src/pages/works/*.astro` → empty).
- [ ] 5.2 Add a page-contract test: every `src/pages/works/<slug>.astro` uses
      `chrome="work"`, imports no `CaseStudy`, and carries an
      "Archived case-study copy" block. (Write it once 4.x is done, so it lands
      green.)
- [ ] 5.3 `pnpm test` + `pnpm check` to zero; `pnpm build` green; no case-study
      prose in any `dist/works/*/index.html`; Project Index rows all navigate.
- [ ] 5.4 Home page hardcodes "Researched works — 17" while the collection holds
      13 (`src/pages/index.astro` also has an unused `works` binding). Decide:
      make dynamic or update.

## 6. Visual pass — one dedicated session, at the end

- [ ] 6.1 With all 13 converted, run the chrome-devtools side-by-side once across
      the set: each page at its reference's native width, then 375px. Fix visible
      deltas. **Not per-page during 4.x** — measurement is the working channel;
      the browser is the final confirmation only.
