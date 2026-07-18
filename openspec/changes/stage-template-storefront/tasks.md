# Tasks — stage-template-storefront

Each numbered section ends deployable (checkpoint). Gate for every section:
vitest green (grows with the engine), `pnpm check` exit 0.

## 0. Prerequisite
- [x] 0.1 Commit the pending smac ghost-load fix
- [ ] 0.2 Archive `craft-one-page-discipline` (bespoke-pages phase complete;
      its §5.1 index work is superseded by §2.2 below)

## 1. Content-model engine core → deploy checkpoint 1
- [ ] 1.1 AST types + zod schema: `identity`, `hero`, and the `Block` union
      (prose/list/media/pair/spread/quote/meta); unit tests (illegal blocks
      rejected, unknown-block degrade path)
- [ ] 1.2 Lorem trees per category (restaurant/gallery/festival …) as the default
      content each template embodies out of the box
- [ ] 1.3 Render pipeline `view = render(paradigm)(content, layers, state)`:
      block→element mapping, paradigm skeletons, pure (no imperative DOM)
- [ ] 1.4 Migrate ONE template to `f(AST)` as proof (red → green against the
      work-page contract); zero hardcoded copy remains on it
- [ ] 1.5 Gate + deploy

## 2. Catalog + spine + transitions → deploy checkpoint 2
- [ ] 2.1 Add `ordinal`, `niche`, `paradigm`, `motion` to work schema + all 14
      files (curated sales order); numeral util + uniqueness test
- [ ] 2.2 Index: sort by ordinal, rows show Roman numerals + identity label,
      drop name titles (supersedes craft §5.1); drop `data-lenis-prevent`,
      chrome-safe padding, ≥44px rows
- [ ] 2.3 Spine in Base chrome band: prev/next (wrap), "N / XIV", fixed
      coordinates, ArrowLeft/ArrowRight, always-visible inquiry CTA; label test
- [ ] 2.4 `@view-transition` cross-document + `view-transition-name` on the
      numeral; verify support via MDN; no-JS fallback confirmed
- [ ] 2.5 Per-template document title + OG metadata from identity label
- [ ] 2.6 Gate + deploy

## 3. Inspector → deploy checkpoint 3
- [ ] 3.1 Layer dial: `data-*` axes on root, pre-paint apply (theme-toggle
      pattern); color / imagery(B&W, none) / typography; zero-CLS proof + tests
- [ ] 3.2 Structure ↔ content toggle: peel any template to its bare skeleton
      (no content) and back; state test
- [ ] 3.3 Feed-content: swap the content tree live from curated sample sets;
      the template re-embodies with zero crash on any sample
- [ ] 3.4 Gate + deploy

## 4. Device preview → deploy checkpoint 4
- [ ] 4.1 `?frame=1` chrome-suppressed render (pre-paint root class)
- [ ] 4.2 Preview iframe 390×844 / 844×390, transform-scaled; dial + content
      state propagated via query string
- [ ] 4.3 Gate + deploy

## 5. Flagship migration (prospect-ready asset) → deploy checkpoint 5
- [ ] 5.1 Pick 3–4 templates spanning distinct paradigms; migrate each to
      `f(AST)` + a declared state machine (visual states + event transitions)
- [ ] 5.2 State-machine legality test: declared states reachable, no impossible
      states, every transition event-bound
- [ ] 5.3 Nothing-dead + no-zoom-to-read (320px) + optical-centering pass on the
      flagship set
- [ ] 5.4 Gate + deploy  ← ship to prospect

## 6. Remaining templates → deploy per batch
- [ ] 6.1 Migrate the rest to `f(AST)` + state machines, batched, gate green
      per batch
- [ ] 6.2 Nothing-dead + no-zoom + optical-centering audit across all 14
- [ ] 6.3 Gate + deploy per batch

## 7. Motion showcases → deploy
- [ ] 7.1 Build the GSAP FLIP showcase template and the motion.dev layout-
      animation showcase (deferred, page-only loading); labels updated
- [ ] 7.2 Gate + deploy

## 8. Performance gate → final deploy
- [ ] 8.1 Static compositor-gate test (scan sources + built CSS for layout-
      property animations); red-prove against a seeded violation, then green
- [ ] 8.2 120Hz DevTools trace on heaviest template; record result
- [ ] 8.3 Gate + final deploy
