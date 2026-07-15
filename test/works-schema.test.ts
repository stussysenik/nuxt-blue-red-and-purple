import { describe, it, expect } from 'vitest';
import { workSchema, CATEGORIES } from '../src/content/works-schema';

const valid = {
  slug: 'smac',
  title: "S'MAC",
  category: 'restaurant',
  year: 2026,
  image: '/works/smac.jpg',
  summary: 'Lorem ipsum.',
};

describe('workSchema', () => {
  it('accepts a minimal valid work (optionals absent)', () => {
    expect(workSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts every declared category', () => {
    for (const category of CATEGORIES) {
      expect(workSchema.safeParse({ ...valid, category }).success).toBe(true);
    }
  });

  it('rejects an unknown category (build fails)', () => {
    expect(workSchema.safeParse({ ...valid, category: 'gallery' }).success).toBe(false);
  });

  it('rejects a missing required field', () => {
    const { title: _title, ...noTitle } = valid;
    expect(workSchema.safeParse(noTitle).success).toBe(false);
  });

  it('rejects a non-integer year', () => {
    expect(workSchema.safeParse({ ...valid, year: 2026.5 }).success).toBe(false);
  });

  it('carries optional palette/mechanic/source/real through when present', () => {
    const parsed = workSchema.parse({
      ...valid,
      palette: ['#e8a13a', '#f4ede0'],
      mechanic: 'counter-and-two-words chrome',
      source: 'smac.blueredandpurple.world',
      real: true,
    });
    expect(parsed.palette).toEqual(['#e8a13a', '#f4ede0']);
    expect(parsed.real).toBe(true);
  });
});
