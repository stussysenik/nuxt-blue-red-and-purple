# Tasks: add-work-case-studies

## 1. Index & framing

- [x] 1.1 Group the Project Index by industry (restaurant → hotel → music →
      books → vintage), drop `(N#)` numbering, hide years everywhere.
- [x] 1.2 Reframe `smac.astro` as before/after: hero labelled "As found",
      ledger labelled "The designed solution", year removed from colophon.

## 2. Case-study kernel

- [x] 2.1 `CaseStudy.astro` shell: fixed page structure, measured stage
      (ruler ticks, size container), prose/blockquote vocabulary, palette +
      source footer.
- [x] 2.2 Exemplar `h724.astro` (live cursor-zone slideshow) as the batch
      reference implementation.

## 3. Reconstructions (12 remaining works)

- [x] 3.1 after, b374, b421, b508, b970, d429, f853, g858, l384, p673,
      skrillex — one bespoke page each, kernel tokens only, mechanic live
      where the source is live.
- [x] 3.2 Register all bespoke slugs in `[slug].astro`'s BESPOKE set.

## 4. Provenance & verification

- [x] 4.1 Scrub platform traces from public copy (`f853.json` summary +
      source; no "demo"/platform naming in any stage).
- [x] 4.2 `pnpm check` (oxlint + tsc + astro check) to zero errors; spot
      review each page for no-JS degradation, Lenis conflicts, and rogue
      values.
