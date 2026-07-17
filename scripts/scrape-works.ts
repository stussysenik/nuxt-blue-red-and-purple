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
// The API's `screenshot` (a render of the live third-party site) is NOT ours and
// is NOT work imagery. It lands in refs/works/ — a gitignored, build-time-only
// reference for rebuilding the work in our own kernel. It must never reach
// public/ (which ships) or a rendered surface: the schema's `image` is a
// licensed stock photo, "never a hotlink or screenshot". `source` stays
// attribution text.
//
// Usage:  pnpm scrape:works <cargoId>[:<slug>] [...]
//   e.g.  pnpm scrape:works 3347193:h724 2657644:l384
//   A `:slug` maps the draft onto an existing collection slug (the API title is
//   e.g. "~Template H724", which would otherwise slugify to "template-h724").

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { hexToHsl } from '../src/uno/hue.ts';

const here = dirname(fileURLToPath(import.meta.url));
const stageDir = resolve(here, 'scraped');
const collectionDir = resolve(here, '../src/content/works');
// Reference screenshots are third-party bytes: internal, gitignored, never shipped.
const refDir = resolve(here, '../refs/works');
const SHOT_WIDTH = 1600; // freight CDN width bucket for the reference render

interface CargoScreenshot {
  hash?: string;
  name?: string;
}

interface CargoSite {
  website_title?: string;
  css_url?: string;
  domain?: string;
  site_url?: string;
  direct_link?: string;
  screenshot?: CargoScreenshot | unknown[];
}

/** Cargo serves screenshots at freight.cargo.site/w/{width}/i/{hash}/{name}. */
function screenshotUrl(shot: CargoSite['screenshot']): string | undefined {
  if (!shot || Array.isArray(shot)) return undefined;
  const { hash, name } = shot;
  return hash && name ? `https://freight.cargo.site/w/${SHOT_WIDTH}/i/${hash}/${name}` : undefined;
}

/** Download the reference screenshot to refs/works/{slug}.jpg — internal only. */
async function downloadImage(url: string, slug: string): Promise<boolean> {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 blueredandpurple/1' } });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.byteLength < 1024) return false; // guard against error-page stubs
  mkdirSync(refDir, { recursive: true });
  writeFileSync(resolve(refDir, `${slug}.jpg`), buf);
  return true;
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

async function scrape(id: string, slugOverride?: string): Promise<void> {
  const site = await fetchJson(`https://api.cargo.site/v1/sites/${id}`);
  const title = site.website_title?.trim() || `Cargo ${id}`;
  const slug = slugOverride || slugify(title) || `cargo-${id}`;
  const css = site.css_url ? await fetchText(site.css_url) : '';
  const palette = extractPalette(css);
  const source = site.domain || site.site_url || site.direct_link;
  const shot = screenshotUrl(site.screenshot);
  const gotImage = shot ? await downloadImage(shot, slug) : false;

  const draft = {
    slug,
    title,
    category: 'TODO(restaurant|hotel|music|vintage|books)',
    year: new Date().getFullYear(),
    // A licensed stock photo, curated by hand into public/works — never the
    // scraped reference screenshot (refs/works), which must not ship.
    image: 'TODO — curate a licensed stock photo into public/works/<slug>.jpg',
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
      `  ref=${gotImage ? '✓ refs/works/' + slug + '.jpg' : shot ? '✗ download failed' : '— no screenshot'}` +
      (collides ? `  ⚠ already curated — JSON + public imagery untouched` : ''),
  );
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter(Boolean);
  if (args.length === 0) {
    console.error('Usage: pnpm scrape:works <cargoId>[:<slug>] [...]');
    process.exitCode = 1;
    return;
  }
  console.log(`Scraping ${args.length} site(s) → ${stageDir} + refs/works/`);
  for (const arg of args) {
    const [id, slugOverride] = arg.split(':');
    if (!id) continue;
    try {
      // Sequential on purpose: the Cargo API 503s under parallel load (survey
      // finding). Politeness beats speed for a re-runnable batch scraper.
      // oxlint-disable-next-line no-await-in-loop
      await scrape(id, slugOverride);
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
