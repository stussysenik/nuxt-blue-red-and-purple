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
