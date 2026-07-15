// scrape:works — seed future work batches from the Cargo API (SPEC task 4.0).
// The survey (works-survey.md) was the hand-run of this for batch-2; this script
// codifies it so batch-3 URLs are re-runnable. Runs under Node's type stripping,
// so relative imports carry explicit .ts extensions.
//
// Ground truth is api.cargo.site/v1/sites/{id} (name + css_url + domain +
// meta_tags), NEVER the empty preview SPA (survey finding). Palette is extracted
// from the site CSS, filtered to chromatic accents.
//
// NON-CLOBBERING BY CONSTRUCTION: drafts land in scripts/scraped/, never in the
// validated collection. Category / summary / mechanic need human judgment (the
// API cannot derive them), so they are written as explicit TODO placeholders for
// review before a draft is promoted into src/content/works/. Collisions with an
// already-curated work are flagged, not overwritten.
//
// Usage:  pnpm scrape:works <cargoId> [<cargoId> ...]
//   e.g.  pnpm scrape:works 3347193 2657644

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { hexToHsl } from '../src/uno/hue.ts';

const here = dirname(fileURLToPath(import.meta.url));
const stageDir = resolve(here, 'scraped');
const collectionDir = resolve(here, '../src/content/works');

interface CargoSite {
  website_title?: string;
  css_url?: string;
  domain?: string;
  site_url?: string;
  direct_link?: string;
}

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Distinct chromatic accents from a stylesheet, most-used first, capped.
 * Best-effort: Cargo's API css_url serves the base swatch ladder, so a site
 * whose accent lives in inline/preloaded state yields no palette here — the
 * draft's palette is completed during human review.
 */
function extractPalette(css: string, max = 4): string[] {
  const counts = new Map<string, number>();
  for (const match of css.matchAll(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g)) {
    const body = match[1];
    if (!body) continue;
    const full =
      body.length === 3
        ? body
            .split('')
            .map((c) => c + c)
            .join('')
        : body;
    const norm = `#${full.toLowerCase()}`;
    const { s, l } = hexToHsl(norm);
    if (s < 0.18 || l < 0.06 || l > 0.96) continue; // drop the black/white/gray ladder
    counts.set(norm, (counts.get(norm) ?? 0) + 1);
  }
  return [...counts.entries()]
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([color]) => color);
}

async function fetchJson(url: string): Promise<CargoSite> {
  const res = await fetch(url, { headers: { 'user-agent': 'blueredandpurple-scrape/1' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as CargoSite;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'user-agent': 'blueredandpurple-scrape/1' } });
  return res.ok ? res.text() : '';
}

async function scrape(id: string): Promise<void> {
  const site = await fetchJson(`https://api.cargo.site/v1/sites/${id}`);
  const title = site.website_title?.trim() || `Cargo ${id}`;
  const slug = slugify(title) || `cargo-${id}`;
  const css = site.css_url ? await fetchText(site.css_url) : '';
  const palette = extractPalette(css);
  const source = site.domain || site.site_url || site.direct_link;

  const draft = {
    slug,
    title,
    category: 'TODO(restaurant|hotel|music|vintage|books)',
    year: new Date().getFullYear(),
    image: `/works/${slug}.jpg`,
    summary: 'TODO — lorem prose pending copywriting',
    ...(palette.length ? { palette } : {}),
    mechanic: 'TODO — distill the signature mechanic from the source',
    ...(source ? { source } : {}),
    real: false,
  };

  mkdirSync(stageDir, { recursive: true });
  writeFileSync(resolve(stageDir, `${slug}.json`), JSON.stringify(draft, null, 2) + '\n');
  const collides = existsSync(resolve(collectionDir, `${slug}.json`));
  console.log(
    `  ${id} → ${slug}  palette=[${palette.join(', ') || '—'}]` +
      (collides ? `  ⚠ already curated in collection — review before promoting` : ''),
  );
}

async function main(): Promise<void> {
  const ids = process.argv.slice(2).filter(Boolean);
  if (ids.length === 0) {
    console.error('Usage: pnpm scrape:works <cargoId> [<cargoId> ...]');
    process.exitCode = 1;
    return;
  }
  console.log(`Scraping ${ids.length} site(s) → ${stageDir}`);
  for (const id of ids) {
    try {
      // Sequential on purpose: the Cargo API 503s under parallel load (survey
      // finding). Politeness beats speed for a re-runnable batch scraper.
      // oxlint-disable-next-line no-await-in-loop
      await scrape(id);
    } catch (err) {
      console.error(`  ${id} → failed: ${(err as Error).message}`);
    }
  }
  console.log(
    'Review each draft: set category to a valid enum, write summary/mechanic,\n' +
      'add a curated /works image, then move it into src/content/works/.',
  );
}

await main();
