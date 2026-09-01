# blueredandpurple — Website + CMS

A design agency website powered by **Nuxt 3** (frontend) + **Sanity** (CMS).

## Architecture

```
blueredandpurple/
├── studio/          # Sanity Studio (standalone, independent deployment)
│   ├── sanity.config.ts    # Studio UI + visual editing
│   ├── schemaTypes/        # Content model (page, work, blocks)
│   └── package.json        # Sanity + React deps
│
├── apps/
│   └── web/         # Nuxt 3 frontend
│       ├── pages/
│       │   ├── index.vue        # Homepage (fetches from Sanity)
│       │   └── works/index.vue  # Works index (fetches from Sanity)
│       ├── lib/
│       │   └── content.ts       # Content adapter (future-proofing)
│       └── nuxt.config.ts      # @nuxtjs/sanity module
│
└── apps/web/scripts/
    ├── seed-home.ts     # Create home page in Sanity
    └── seed-works.ts    # Import existing works into Sanity
```

## Quick Start

### Prerequisites
- Node.js 22.12+
- pnpm 11+

### 1. Install dependencies

```bash
# Root (Nuxt app)
pnpm install

# Studio (separate)
cd studio && pnpm install
```

### 2. Environment variables

```bash
# Nuxt app (.env.local in apps/web/)
NUXT_SANITY_PROJECT_ID=lkyz5ssa
NUXT_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your-read-token

# Studio (.env.local in studio/)
SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000
SANITY_API_READ_TOKEN=your-read-token
```

### 3. Start development

```bash
# Terminal 1: Sanity Studio
cd studio && ppnpm dev
# → http://localhost:3333

# Terminal 2: Nuxt app
cd apps/web && pnpm dev
# → http://localhost:3000
```

### 4. Seed initial content

```bash
cd apps/web
SANITY_API_WRITE_TOKEN=your-write-token pnpm run sanity:seed
```

This creates a home page with default sections and imports all 18 works.

---

## Content Editing

### For non-technical editors

1. Open **Sanity Studio** at `http://localhost:3333` (or the deployed URL)
2. Log in with your Google/GitHub account (must be invited as a project member)
3. Edit the **Home** page → modify hero tagline, about text, contact info
4. Edit **Works** → add/remove works, toggle visibility, change order
5. Click **Publish** → changes appear on the live site in seconds

### Visual Editing (advanced)

With a read token configured, editors see "Edit" overlays directly on the live site:
- Click any text field → edit in-place
- Changes publish instantly via Sanity's CDN

---

## Deployment

### Nuxt app → Vercel
```bash
cd apps/web && pnpm build
# Connect to Vercel, auto-detects Nuxt 3
```

### Studio → Sanity hosting
```bash
cd studio && pnpm deploy
# → https://your-project.sanity.io
```

---

## Content Backup

Export all content to a git-tracked backup:
```bash
cd apps/web && pnpm run sanity:backup
# → server/backups.tar.gz
```

---

## Self-hosting Path

If you outgrow Sanity's free tier:

1. Export content: `pnpm run sanity:backup`
2. Implement `ContentAdapter` in `lib/content.ts` with your backend
3. Swap the adapter in `pages/index.vue` and `pages/works/index.vue`

The frontend components don't change — only the data source.

---

## Project Structure

### Content Types

| Type | Fields | Used In |
|------|--------|---------|
| `page` | title, slug, sections[] | Homepage |
| `work` | title, slug, category, year, image, summary, palette, isReal, isHidden, sortOrder | Portfolio |
| `hero` | tagline, layout | Page sections |
| `textSection` | text, align | Page sections |
| `worksGrid` | columns, category, showCount | Page sections |
| `contact` | email, phone | Page sections |

### Route Rules

| Route | Rendering | Cache |
|-------|-----------|-------|
| `/` | SSR | 60s SWR |
| `/works` | SSR | 60s SWR |
| `/works/[slug]` | SSR | 300s SWR |
| `/showcase`, `/generator`, `/design`, `/world` | Prerendered | Build-time |
