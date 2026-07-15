import { describe, it, expect } from 'vitest';
import { hexToHsl, isForbiddenHue, isColorLawCompliant } from '../src/uno/hue';
import { PALETTE } from '../uno.config';

describe('color law — the guard itself is real', () => {
  it('rejects blue, red, purple, and cyan', () => {
    expect(isColorLawCompliant('#0000FF')).toBe(false); // blue
    expect(isColorLawCompliant('#FF0000')).toBe(false); // red
    expect(isColorLawCompliant('#8B00FF')).toBe(false); // violet
    expect(isColorLawCompliant('#00FFFF')).toBe(false); // cyan reads as blue
    expect(isColorLawCompliant('#8b8ad8')).toBe(false); // the old purple bg
  });

  it('accepts yellow, orange, green, and warm neutrals', () => {
    expect(isColorLawCompliant('#FFE800')).toBe(true); // sunflower yellow
    expect(isColorLawCompliant('#FF6C2F')).toBe(true); // riso orange
    expect(isColorLawCompliant('#00A95C')).toBe(true); // riso green
    expect(isColorLawCompliant('#16130F')).toBe(true); // warm ink (achromatic)
  });

  it('hexToHsl and band math agree on boundaries', () => {
    expect(Math.round(hexToHsl('#00FFFF').h)).toBe(180); // cyan hue
    expect(isForbiddenHue(180)).toBe(true); // cyan band is forbidden
    expect(isForbiddenHue(60)).toBe(false); // yellow allowed
    expect(isForbiddenHue(150)).toBe(false); // green allowed
  });
});

describe('color law — every uno.config.ts palette token complies', () => {
  for (const [name, hex] of Object.entries(PALETTE)) {
    it(`${name} (${hex}) is outside every forbidden band`, () => {
      expect(isColorLawCompliant(hex)).toBe(true);
    });
  }
});
