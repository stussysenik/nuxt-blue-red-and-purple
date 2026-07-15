// Color-law math (SPEC §1). Pure hex→HSL so the color-law test can iterate
// every palette token and assert its hue sits outside the forbidden bands.

export interface Hsl {
  /** Hue in degrees [0, 360). */
  readonly h: number;
  /** Saturation [0, 1]. */
  readonly s: number;
  /** Lightness [0, 1]. */
  readonly l: number;
}

/** Parse #RGB / #RRGGBB / #RRGGBBAA into HSL. Throws on malformed input. */
export function hexToHsl(hex: string): Hsl {
  const clean = hex.trim().replace(/^#/, '');
  const full =
    clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(full)) {
    throw new Error(`Not a hex color: ${hex}`);
  }
  const r = Number.parseInt(full.slice(0, 2), 16) / 255;
  const g = Number.parseInt(full.slice(2, 4), 16) / 255;
  const b = Number.parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

/**
 * Forbidden hue bands: red 345°–15°, blue/cyan 180°–270°, purple 270°–345°.
 * The blue band is pulled down to 180° because the SPEC bans cyan explicitly
 * ("cyan reads as blue — banned"); allowed territory is therefore 15°–180°
 * (yellow→orange→green), which still clears our riso green (~153°) with margin.
 */
export function isForbiddenHue(h: number): boolean {
  return h < 15 || h >= 180;
}

/**
 * A token is color-law compliant if it is near-achromatic (a paper/ink tint)
 * or its hue lands in the allowed yellow→orange→green territory (15°–180°).
 */
export function isColorLawCompliant(hex: string, achromaticFloor = 0.1): boolean {
  const { h, s } = hexToHsl(hex);
  if (s < achromaticFloor) return true;
  return !isForbiddenHue(h);
}
