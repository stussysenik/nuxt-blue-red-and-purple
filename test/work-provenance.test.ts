// Provenance guard — the cheap channel for the one rule that already broke once.
//
// refs/works/<slug>.jpg holds renders of the third-party source sites: internal
// build inputs for rebuilding each work in-kernel. public/works/<slug>.jpg holds
// the curated, licensed stock photo that actually ships. A WIP commit once copied
// the former over the latter, which published third-party screenshots (trademarks
// and all) at blueredandpurple.world/works/*.jpg and silently broke the schema's
// own contract ("never a hotlink or screenshot").
//
// Nothing typechecked or linted caught it — the bytes were the bug. These tests
// compare the bytes.

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicWorks = resolve(root, 'public/works');
const refWorks = resolve(root, 'refs/works');
const contentWorks = resolve(root, 'src/content/works');

const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
const jpgs = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.jpg')) : [];

const works = readdirSync(contentWorks)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(resolve(contentWorks, f), 'utf8')));

describe('work imagery provenance', () => {
  it('ships an image for every work in the collection', () => {
    for (const w of works) {
      expect(w.image, `${w.slug}.image`).toMatch(/^\/works\/[\w-]+\.jpg$/);
      expect(existsSync(resolve(root, 'public', w.image.slice(1))), `${w.image} missing`).toBe(
        true,
      );
    }
  });

  // The regression itself: a shipped image must never BE a reference screenshot.
  it('never ships a byte-identical copy of a reference screenshot', () => {
    const refs = jpgs(refWorks);
    if (refs.length === 0) return; // refs/ is gitignored; nothing to compare in CI
    const shipped = new Map(jpgs(publicWorks).map((f) => [f, sha(resolve(publicWorks, f))]));
    const leaked = refs.filter((f) => shipped.get(f) === sha(resolve(refWorks, f)));
    expect(leaked, 'reference screenshots published under public/works').toEqual([]);
  });

  // The references are 16:10 site renders (1600×1000 / 3200×2000); the curated
  // stock set is 800×525. A shipped 16:10 file is the shape of the same mistake
  // even if a byte changed, so shape is checked independently of hash.
  it('ships no image with the reference renders 16:10 shape', () => {
    for (const f of jpgs(publicWorks)) {
      const buf = readFileSync(resolve(publicWorks, f));
      const dims = jpegSize(buf);
      if (!dims) continue;
      const ratio = dims.w / dims.h;
      const looksLikeRender = Math.abs(ratio - 1.6) < 0.01 && dims.w >= 1600;
      expect(looksLikeRender, `${f} is a ${dims.w}×${dims.h} 16:10 render`).toBe(false);
    }
  });
});

/** Minimal JPEG SOF parser — dimensions without pulling an image dependency. */
function jpegSize(buf: Buffer): { w: number; h: number } | null {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1] ?? 0;
    // SOF0..SOF15, excluding DHT(c4) / JPG(c8) / DAC(cc)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}
