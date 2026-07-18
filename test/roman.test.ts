import { describe, it, expect } from 'vitest';
import { toRoman } from '../src/lib/roman';

describe('toRoman — the catalogue numbering', () => {
  it('maps the catalogue range I–XIV correctly', () => {
    expect([1, 4, 5, 9, 10, 14].map(toRoman)).toEqual(['I', 'IV', 'V', 'IX', 'X', 'XIV']);
  });

  it('is deterministic and one-to-one across a 14-work catalogue', () => {
    const numerals = Array.from({ length: 14 }, (_, i) => toRoman(i + 1));
    expect(new Set(numerals).size).toBe(14); // no collisions
    expect(numerals).toEqual(Array.from({ length: 14 }, (_, i) => toRoman(i + 1))); // stable
  });

  it('rejects non-positive and non-integer input', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(-3)).toThrow(RangeError);
    expect(() => toRoman(1.5)).toThrow(RangeError);
  });
});
