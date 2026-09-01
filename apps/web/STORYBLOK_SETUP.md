# Storyblok Visual Editor Setup

Your Nuxt app is fully wired to Storyblok with native visual editing. Here's how to get editing.

## 1. Open Storyblok

Go to: https://app.storyblok.com/#/me/spaces/294922716989879/stories

## 2. Create Components

In Storyblok, go to **Settings → Components** and create these:

### `page` (Content type)
| Field | Type | Notes |
|-------|------|-------|
| `body` | Blocks | Allow: hero, about, contacts, grid, feature, teaser, mode_wheel, template_config, project_index |
| `seo` | Group | Field group |
| `seo.meta_title` | Text | |
| `seo.meta_description` | Textarea | |
| `seo.og_image` | Asset | Images only |

### `hero` (Block)
| Field | Type |
|-------|------|
| `tagline` | Text |

### `about` (Block)
| Field | Type | Notes |
|-------|------|-------|
| `description` | Textarea | |
| `formula` | Blocks | Allow: formulaStep |
| `lineage` | Blocks | Allow: lineageEntry |

### `formulaStep` (Block, nested in about)
| Field | Type |
|-------|------|
| `step` | Text |
| `description` | Text |

### `lineageEntry` (Block, nested in about)
| Field | Type |
|-------|------|
| `label` | Text |
| `value` | Text |

### `contacts` (Block)
| Field | Type |
|-------|------|
| `email` | Text |
| `phone` | Text |
| `team` | Text (comma-separated) |

### `grid` (Block)
| Field | Type | Notes |
|-------|------|-------|
| `columns` | Blocks | Allow: feature |

### `feature` (Block)
| Field | Type |
|-------|------|
| `name` | Text |

### `teaser` (Block)
| Field | Type |
|-------|------|
| `headline` | Text |

### `mode_wheel` (Block) — Template/Mode Management
| Field | Type | Notes |
|-------|------|-------|
| `modes` | Blocks | Allow: modeEntry |

### `modeEntry` (Block, nested in mode_wheel) — Individual Mode Config
| Field | Type | Notes |
|-------|------|-------|
| `mode_id` | Select | Options: essential, brutal, clay, generative |
| `name` | Text | Display name (editable — rename "Essential" to anything) |
| `enabled` | Boolean | false = hidden from the wheel |

### `template_config` (Block) — Global Template Settings
| Field | Type | Notes |
|-------|------|-------|
| `default_mode` | Select | Options: essential, brutal, clay, generative |
| `default_theme` | Select | Options: light, dark |
| `scale` | Select | Options: 1, 1.1, 1.25 |

### `project_index` (Block) — Works Catalogue
| Field | Type |
|-------|------|
| `title` | Text |

## 3. Create the Home Story

1. Click **New Story**
2. Name: `home`
3. Slug: `home`
4. Content type: `page`
5. Add blocks to `body` in this order:
   - **Template Config** → set default mode/theme
   - **Hero** → set tagline
   - **Mode Wheel** → configure modes (names, visibility)
   - **About** → set description, formula, lineage
   - **Project Index** → set title (works auto-populate)
   - **Contacts** → set email, phone, team
6. Fill in **SEO** group
7. Click **Publish**

## 4. Visual Editing (Live Preview)

Once published, you can edit in two ways:

### A. Inline Editing (Visual Editor)
1. Open the story in Storyblok
2. Click the **Preview** button (eye icon)
3. You'll see your live site with blue outlines around editable blocks
4. Click any text → edit inline → changes appear instantly
5. Click **Save** → then **Publish**

### B. Storyblok Editor
1. Open the story in Storyblok
2. Edit fields in the right panel
3. Click **Save** → **Publish**

## What You Get

| Feature | Status |
|---------|--------|
| Version history (every save tracked) | ✅ |
| Visual inline editing | ✅ |
| Preview before publish | ✅ |
| One-click rollback | ✅ |
| SEO fields (meta title, description, OG image) | ✅ |
| Audit trail (who/when) | ✅ |
| Releases (schedule changes) | ✅ |
| Draft/Review/Published workflow | ✅ |
| **Mode/template management** (rename, show/hide) | ✅ |
| **Template config** (default mode, theme, scale) | ✅ |
| **Project index** (works catalogue) | ✅ |

## Template Management

### Editing Mode Names
1. Open the home story
2. Find the **Mode Wheel** block
3. Each **Mode Entry** has a `name` field — edit it to rename the mode
4. Publish → changes appear instantly on the site

### Hiding/Showing Modes
1. Open the home story
2. Find the **Mode Wheel** block
3. Toggle the `enabled` checkbox on each **Mode Entry**
4. Disabled modes are hidden from the wheel but preserved in config
5. Publish → only enabled modes appear

### Setting Default Mode/Theme
1. Open the home story
2. Find the **Template Config** block
3. Set `default_mode` and `default_theme`
4. These apply on first visit (before localStorage kicks in)

## Adding New Components

1. Create the component file in `~/storyblok/` (e.g. `NewBlock.vue`)
2. Add the prop interface to `~/types/storyblok.ts`
3. Register it in `~/storyblok/DynamicBlock.vue`
4. Create the matching component in Storyblok (Settings → Components)
5. Done — it appears in the block selector automatically

## Routes

| Route | Source |
|-------|--------|
| `/` | Storyblok "home" story |
| `/cms` | CMS dashboard (links to Storyblok) |
| `/works` | Sanity (existing) |
| `/works/[slug]` | Sanity (existing) |
| `/system` | Design system reference |
