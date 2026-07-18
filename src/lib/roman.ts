// Roman numerals for the catalogue. The works are identified by numeral (I–XIV
// today, extendable), not by their cryptic slugs — the buyer references and
// compares by catalogue number. Pure and deterministic: the same n always yields
// the same numeral, so the numbering is stable across every surface.

const NUMERALS: readonly (readonly [number, string])[] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError(`Roman numerals are defined for positive integers; got ${n}`);
  }
  let remaining = n;
  let out = '';
  for (const [value, symbol] of NUMERALS) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }
  return out;
}
