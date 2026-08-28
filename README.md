# blue red + purple

A design agency with one specialization: one-page systems. One fixed content
structure, four interchangeable design systems — switched live.

## Monorepo structure

```
.
├── apps/
│   └── web/          # Nuxt 3 site (the agency site + work index)
├── packages/
│   ├── tokens/       # @brp/tokens — palette, color law, design constants
│   ├── types/        # @brp/types — shared TypeScript types (Work, Theme, Mode)
│   └── unocss-preset/ # @brp/unocss-preset — vendored Tachyons vocabulary
├── package.json      # workspace root (scripts delegate to filters)
└── pnpm-workspace.yaml
```

## Packages

| Package | Exports | Purpose |
|---------|---------|---------|
| `@brp/tokens` | `PALETTE`, `PaletteToken` | Single source of truth for the color law. No blue/red/purple in chrome. |
| `@brp/types` | `Work`, `Theme`, `Mode` | Shared domain types consumed by the app and future packages. |
| `@brp/unocss-preset` | `tachyonsPreset`, `STEP`, `FONT`, `COLOR_TOKENS` | Vendored Tachyons ruleset. Data-driven, resolves to CSS custom properties. |

## Development

```bash
pnpm dev          # starts @brp/web on localhost:3000
pnpm build        # production build of @brp/web
pnpm typecheck    # runs typecheck in every package
pnpm lint         # biome check across the workspace
```

## Branching model

- `main` is the release branch. It only ever receives merges from `develop` (or hotfixes). Never commit directly.
- `develop` is the integration branch. Feature branches merge here.
- All work happens on feature branches: `feature/<short-description>`.
- Commit early, commit often. Small focused commits over big-bang merges.
- Use conventional commit prefixes (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).

```bash
# Start a new feature
git checkout develop
git pull
git checkout -b feature/my-thing

# Done? Merge back
git checkout develop
git merge feature/my-thing
```

## Architecture decisions

- **Design tokens are code, not config.** `@brp/tokens` exports TypeScript, so the
  UnoCSS config, the design-doc generator, and any future app all read one source.
- **The Tachyons vocabulary is vendored.** We own the table. Rules are generated
  from data scales (DOP) — no per-utility hex ever ships; everything resolves to
  `--ink`, `--paper`, `--spot` custom properties.
- **Mode kernels are CSS-only.** Switching design system = two attribute writes
  (`data-mode`, `data-theme`). No JS re-render, no class toggling on individual
  elements.
- **Work data is static.** The works index is a typed data file, not a CMS query.
  Roman numerals are computed, not stored.

---

## Product direction

> **BRP builds generative brand worlds for the music industry.**
> Not websites. Worlds. A portal you step into, not a page you scroll.

### The thesis

World-building is at the core of what we do. A website should be an extension of
a brand's world. We build custom digital experiences that immerse audiences deeper
into a brand — creating identity through visuals and story.

For the music industry specifically: we bring together music, visuals, releases,
videos, tour dates, and everything surrounding an artist's project in one place
that feels like stepping into their universe.

### The business model

**B2B. We sell to record labels.**

Labels care about three things: artist discovery, marketing/customer acquisition,
and content production. Our generative engine hits the latter two.

| Tier | What it is | Price |
|------|-----------|-------|
| Release Campaign World | Generative world for a specific album/EP/single drop. Pre-release teaser → release day unlock → post-release growth. | $15–50k/release |
| Artist World (Always-On) | Living world that evolves with the artist's career. New music auto-integrates, tour dates update, fan community grows. | $5–15k setup + $2–5k/mo |
| Label OS (Roster-Wide) | White-label. Every artist on the roster gets a world. Label dashboard shows fan acquisition cost, conversion, engagement depth. | $20–100k/yr |

### The unfair advantage

A traditional label spends $15–50k and 6+ weeks on an artist's web presence (team
of 5+). Our generative engine does it in 48 hours for a fraction of the cost.

The engine IS the margin. The world IS the marketing. The world markets itself
through shareable artifacts and viral fan loops.

### The pitch to labels

> "We build generative fan worlds that cut your customer acquisition cost by 60%.
> You spend $50k on a marketing campaign. We build a world for $15k that acquires
> fans at 1/3 the cost and keeps growing after the campaign ends."

---

## Build progress

### 2026-08-27 — Direction locked, demo scoped

**Decision:** Build the Toure Xali generative world as the proof-of-concept demo.
This is the artifact that sells the vision. Ship by 2026-08-28.

**What the demo is:**
- An immersive WebGL environment (reusing the existing generative canvas shader engine)
- Artist's brand colors drive the generative visuals
- Music player integrated
- Discoverable "artifacts" — song clips, video, photos, notes, voice memos
- Fan interaction — leave a message, sign the wall, unlock content
- Share mechanic — each visitor gets a unique artifact to share on social
- Campaign phases — pre-release (mysterious) → release day (blooms) → post-release (grows)
- Industry door — press kit, booking, streaming links

**Architecture:**
```
world/
  world.config.ts        # Artist brief → world configuration
  components/
    WorldCanvas.vue      # Generative WebGL background (reuses shader engine)
    WorldArtifacts.vue   # Discoverable content nodes
    WorldFan.vue         # Fan interaction layer
    WorldMusic.vue       # Music player
    WorldCampaign.vue    # Campaign phase controller
  pages/
    world.vue            # The world entry point
```

**Clean architecture principles:**
- World is data. A brief goes in, a world configuration comes out.
- Components render the configuration. No per-artist custom code.
- The shader engine is reused — palette and mood parameters change, engine stays.
- Systematic, not hacky. Every artist gets the same engine, different world.

**Next steps after demo:**
1. Research Toure Xali — sound, aesthetic, campaign goals
2. Build the world config from his brief
3. Implement the world page + components
4. Deploy live
5. Film the walkthrough → post on X/LinkedIn → tag labels and A&Rs
6. Outbound to 50 labels + 100 A&Rs

---

## Website updates (pending)

Changes to the BRP agency site that support the new direction:

- [ ] **About Us** — New world-building copy (see product direction above)
- [ ] **Nav** — Change "Get in touch" to "Contact" (top-right)
- [ ] **Roman numerals** — Use Mono45 backslash character in works index
- [ ] **Remove** bottom contacts section (link to top-right Contact instead)
- [ ] **Keep** "Previously: BFA Cooper Union" and "Free game" lineage

---

## Related repos

| Repo | Role |
|------|------|
| `valoric` | Generative engine mothership — typed IR kernel, multi-target emit, grammar gates |
| `one-page-love-solidstart` | Consumer harness — prompt → full HTML site (Loop) |
| `valoric-flutter` | Flutter emit target + builder UI + AI generator |
| `valoric-typescript` | TS/React IR→render engine |
| `valoric-solidstart` | SolidStart web seam |
| `valoric-svelte` | Svelte 5 web seam |
| `stussysenik-onlook` | Local-first visual editing |

All repos share one thesis: **generative brand systems for the music industry,
sold B2B to record labels.**
