# Design: promote-work-recreations

## The method — measure the reference, don't eyeball it

The exemplar (`h724`) proved the eye is the wrong instrument. Judged by eye the
first conversion looked right; measured, its type was **1.73× too small** and its
nav gap **71% too wide**. Every number below came from pixels, not taste.

```bash
python3 scripts/ref-geometry.py h724     # one work
python3 scripts/ref-geometry.py --all    # every reference  (→ refs/geometry.txt)
```

Per work, the loop:

1. **Measure.** `ref-geometry.py` reports, in the reference's own pixel space:
   text rows (with cap height + word runs + gaps), the central block, and the
   detected ground. It auto-detects light vs dark grounds.
2. **Convert px → `cqw`.** The page root is its own `container-type: inline-size`,
   so `x / W * 100` → `cqw` maps a measured pixel onto a rule that holds at any
   viewport. The tool prints the `cqw` for you.
3. **Build mobile-first**, widening with `@container` queries until the reference
   width is reached. The reference defines desktop truth; mobile is the same
   design adapting, never a second design.
4. **Verify cheap.** `pnpm test` + `pnpm check` to zero. No browser.

### What "1:1" does and does not mean

- **Match:** cap height (the perceived type size), alignment edges, x/y of every
  element, block aspect + centre, wrap points, the fold.
- **Do NOT match:** glyph widths of de-branded text — `H724 Studio, Inc.` is
  legitimately wider than `Test Studio, Inc.` (measured: 225px vs 200px). Our
  kernel's typeface is not the source's; matching *width* would mean mis-sizing
  the *type*. Match height, accept the width delta.
- **Cannot match:** a plate photographed on white has no measurable frame (white
  on white). `ref-geometry` finds the *subject*, not the layout box. Centre it per
  the source's evident intent rather than chasing a photo's incidental
  composition (h724's subject bbox sits 57px right of centre — that is the
  cassette's angle, not the layout).

### Known tool limits (honest — verified, not assumed)

`ref-geometry` is a good instrument on sparse, high-contrast references and a
blunt one elsewhere. Where it is blunt, `Read` the jpg and transcribe by eye —
the tool is an aid, not an authority.

- **Collapses to one band:** `b374` (ground L=187), `b970` (L=127), `smac`
  (L=155) — full-bleed photographic pages with no text-on-ground structure.
- **Merges adjacent bands** on denser layouts (`l384`, `f853`, `b508`): the
  8-blank-row split is too coarse when rows sit close, so a reported "row" can be
  several. Read the reported y-ranges as clusters and sub-divide by eye.
- **Light-on-dark type:** `skrillex`'s rail is light type (peak L≈235) over a
  dark photo. The adaptive ground handles the page (L=45), but a *local* ground
  under a photo is not modelled — measure such rails against their own backdrop.
- The 9 non-degenerate references still give trustworthy cap heights and x-runs,
  which is where the 1.73× sizing error on h724 was caught.

## Page anatomy after promotion

- The recreation markup (today's stage-slot content) becomes the direct child of
  `Base` — full-bleed, edge-to-edge, `min-height: 100dvh`.
- `<Base chrome="work">` — one fixed mono `← INDEX` link, top-right (the corner
  slot reserved for chrome sitewide, and clear of the source navs, which are
  top-left in nearly every reference). No corner mark, no ThemeToggle, no pill.
- The page root declares `container-type: inline-size`. **This is load-bearing:**
  the stage used to be the query container, so any `cq*` unit silently
  re-resolved against the viewport when the stage was removed.
- **Re-tune every `rem` clamp cap.** Caps were sized for the ~1000px stage and
  are systematically too small on a 1600px page. This is the single biggest
  source of delta — h724's nav was capped at `1.05rem` where the reference wanted
  `~29px`.
- The work's accent still grafts via `--work-accent`; artwork carries colour,
  chrome does not.

## Worked exemplar — h724 (reference 1600×1000, ground L=255)

| element | reference | rule written |
|---|---|---|
| nav ink | x17→376, y20→44, capH 25 | `inset: 1.5% auto auto 1%; font-size: clamp(.8rem, 1.8cqw, 1.9rem)` |
| wordmark→links gap | 34px | `gap: .95em` |
| Info↔Index gap | 16px | single `&ensp;` |
| counter | x758→840, capH 21, 61px off bottom | `inset: auto 0 6%; font-size: clamp(.7rem, 1.45cqw, 1.5rem)` |
| plate | 1075×692, aspect 1.553, centre y 501 | `width: 67cqw; aspect-ratio: 1.55; top: 50%` |

Achieved: cap height 25→**25**, `Info` 45→**45**, `Index` 67→**67**, gap 34→**33**,
counter capH 21→**20**, plate aspect 1.553→**1.551**, centre y 501→**499**.

## Archival convention ("so we know how to build it")

Each page's former narrative/lede/notes prose moves verbatim into that page's
frontmatter comment block, headed
`Archived case-study copy (removed from DOM <date>):`. `CaseStudy.astro` and
`works/[slug].astro` are deleted once nothing imports them; git history is the
durable archive. No dead exports, no commented-out markup beyond that block.

## S'MAC — the before/after contrast (user direction)

`smac` is the only real client and the strongest sales asset, so it does more
than the others: a **slider** contrasting the site **as found** against the
delivered redesign at `smac.blueredandpurple.world`. Both halves are rebuilt
in-kernel — the "before" stays a reconstruction (the client's original is not
ours to screenshot), and the "after" is our own delivered design, which we own
outright. `smac.astro` already contains both halves (the as-found hero rail and
the menu-as-index ledger); this reframes them as a contrast rather than a scroll
reveal. Keep `data-lenis-prevent` on any inner scroller; the slider must work on
touch, keyboard, and with no JS (default to the "after").

## Sequencing — sell-fastest first

The catalogue exists to sell templates, so land the highest-value rooms first:

1. `smac` — restaurant, live client, before/after proof.
2. `l384` — restaurant (highest-volume small-business buyer).
3. `b421` — hotel; h724's pattern transfers directly, so it is cheap.
4. `skrillex` — music; the recognisable, flashy demo.
5. `after`, `b508` — music.
6. `b374`, `d429`, `p673` (books); `b970`, `f853`, `g858` (vintage) — the tail.

`h724` is the exemplar and is done. The remaining 12 are independent and freely
parallelizable once the pattern is read.
