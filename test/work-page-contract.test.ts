// Page contract — the cheap channel guarding the promote-work-recreations shape.
//
// Every work page was promoted out of the shared CaseStudy shell (now deleted)
// and IS its own full-page recreation. Three properties define that shape, and
// a future edit could silently break any of them without failing typecheck or
// lint:
//   1. <Base chrome="work"> — the work chrome (lone ← INDEX, no pill/toggle).
//   2. No `import CaseStudy` — the shell is retired; re-introducing it would
//      wrap the recreation back inside a stage and re-break the cq* container.
//   3. An "Archived case-study copy" block — the former narrative prose is not
//      lost, it is archived verbatim in each page's frontmatter comment.
//
// index.astro is the Project Index, not a work page, so it is excluded.

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
    });
  }
});
