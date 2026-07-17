// Page contract — the cheap channel guarding the craft-one-page-discipline shape.
//
// Every work page IS its own full-page recreation. The contract grows here so
// pages are re-crafted against a failing gate (red -> green), and the trap
// patterns cannot return. index.astro is the Project Index, not a work page.
//
// Inherited from promote-work-recreations (retired shell, chrome variant):
//   1. <Base chrome="work"> — work chrome (lone ← INDEX, no pill/toggle).
//   2. No `import CaseStudy` — the shell is retired; re-introducing it would
//      wrap the recreation back inside a stage and re-break the cq* container.
//   3. An "Archived case-study copy" block — former narrative is archived in
//      frontmatter, not lost.
//
// New for craft-one-page-discipline (P1 foundation):
//   4. No max-height: 100dvh — the viewport trap cannot return.
//   5. No root-level overflow: hidden — content is never clipped.
//   6. Requires an <img bound to the work's committed photo.
//   7. No text-align: justify — justified text creates rivers.
//   8. No self-annotation strings — the template never narrates its own
//      mechanics (zoom labels, specimen annotations).

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const worksPages = resolve(root, 'src/pages/works');

const pages = readdirSync(worksPages)
  .filter((f) => f.endsWith('.astro') && f !== 'index.astro')
  .map((f) => ({ file: f, src: readFileSync(resolve(worksPages, f), 'utf8') }));

describe('work page contract', () => {
  it('has work pages to check', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  for (const { file, src } of pages) {
    describe(file, () => {
      it('renders <Base chrome="work">', () => {
        expect(src).toContain('chrome="work"');
      });

      it('does not import the retired CaseStudy shell', () => {
        expect(src).not.toMatch(/import\s+CaseStudy/);
      });

      it('archives its former case-study copy in frontmatter', () => {
        expect(src).toContain('Archived case-study copy');
      });

      it('forbids max-height: 100dvh (the viewport trap)', () => {
        expect(src).not.toMatch(/max-height\s*:\s*100dvh/i);
      });

      it('forbids root-level overflow hidden/clip (no viewport clipping)', () => {
        expect(src).not.toMatch(/overflow\s*:\s*hidden/i);
        expect(src).not.toMatch(/overflow\s*:\s*clip/i);
      });

      it('requires an <img element (imagery slot)', () => {
        expect(src).toMatch(/<img/i);
      });

      it('opts into the chrome band (top clearance below the pinned marks)', () => {
        expect(src).toMatch(/chrome-safe|--chrome-band/);
      });

      it('forbids text-align: justify (justified text creates rivers)', () => {
        expect(src).not.toMatch(/text-align\s*:\s*justify/i);
      });

      it('forbids self-annotation strings (zoom · off|on, zoom disabled)', () => {
        expect(src).not.toMatch(/zoom\s*·\s*off/i);
        expect(src).not.toMatch(/zoom\s+disabled/i);
      });
    });
  }
});
