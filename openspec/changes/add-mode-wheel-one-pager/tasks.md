# Tasks: add-mode-wheel-one-pager

Each milestone lands green: `oxlint && tsc --noEmit && astro check` + vitest.

Method: agent-skills per milestone (build → tdd → review); verify every
web-platform API via MDN MCP as written; fff/ast-grep for search/codemods;
sequential-thinking before non-trivial steps. All design decisions are
pre-made in proposal/design/specs + works-survey.md — implementation is
execution, not decision-making.

## 1. Scaffold (BREAKING: replaces Vite entry)

- [x] 1.1 Migrate to Astro 5 static output; hand-typed, exact-pinned
      `package.json` (astro, lit, unocss, gsap, lenis, vitest only)
- [x] 1.2 `uno.config.ts` with vendored Tachyons table, attributify on,
      arbitrary values blocklisted
- [x] 1.3 `Base.astro`: metadata (preserved from current shell), no-FOUC
      theme bootstrap, Lenis init
- [x] 1.4 Import `scenes.ts` untouched; verify build green
- [x] 1.5 Static sections §00–§06 per hero comp (staggered wordmark,
      tagline, dot-marked nav rail, hairline construction grid)

## 2. Design kernel

- [x] 2.1 Four mode kernels × light/dark in `src/styles/modes/` per
      SPEC.md Design constants (paper/ink core, riso spots, Archivo +
      IBM Plex Mono self-hosted, `--type-display` per mode)
- [x] 2.2 State atom + reducer → `data-mode`/`data-theme` writes;
      `theme-toggle` island with localStorage persistence
- [x] 2.3 Layer truth-table function + unit tests (full mode × layer
      matrix); color-law unit test (every `uno.config.ts` token hue
      outside red 345–15° / blue 180–270° (cyan banned) / purple 270–345°)
- [x] 2.4 `design:doc` script generating `DESIGN.md` (Tachyons-docs-style
      tables per layer × kernel) from `uno.config.ts`; rendered at
      `/design` (noindex, the single routing exception)

## 3. Mode wheel

- [x] 3.1 Pure snap-to-nearest(angle, velocity) + unit tests
- [x] 3.2 `mode-wheel` island: drag/scroll/keyboard, GSAP inertia, dot
      states, a11y announcements, reduced-motion path
- [x] 3.3 Generative mode suspend/resume of shader loop + unit test on the
      suspension state machine; ink/paper duotone grade applied over the
      canvas (kernel-level, `scenes.ts` untouched)

## 4. Project Index

- [x] 4.0 `scrape:works` script: Cargo API (`api.cargo.site/v1/sites/{id}`
      + `/css`) + og/meta + palette extraction → staging drafts;
      re-runnable for future batches (see works-survey.md finding).
      Non-clobbering by construction (writes scripts/scraped/, flags
      collisions, TODO placeholders for human-only fields); palette
      extractor verified on chromatic CSS
- [x] 4.1 Works content collection: zod schema + smac + 17 sourced works
      from works-survey.md (all five categories); one curated
      high-fidelity stock photo per work (Gratisography, free-to-use,
      viewed + curated) downloaded to `public/works/` and committed;
      invalid-work build failure verified (unit test on the shared schema)
- [x] 4.2 `project-index` island: pinned trigger → full-screen index
      (big-type rows w/ `(N#)` superscripts, ghosted imagery behind),
      dot hover language, keyboard focus, focus trap
- [x] 4.3 `work-page` island: full-screen one-page layout per work,
      driven by collection data (hero, imagery, palette, mechanic —
      local assets only, no outbound requests), focus trap,
      `Esc` → index → site, focus return

## 5. Polish

- [ ] 5.1 Scroll reveals via ScrollTrigger on the Lenis ticker;
      reduced-motion audit across all islands
- [ ] 5.2 Regenerate and commit `DESIGN.mdx`; final `check` + `test` green
