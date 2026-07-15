import { describe, it, expect } from 'vitest';
import { snapToNearest, slotsFromPx, clampPosition, MOMENTUM } from '../src/wheel';

const COUNT = 4;

describe('snapToNearest — resting (no throw)', () => {
  it('rounds to the nearest slot when velocity is zero', () => {
    expect(snapToNearest(0.4, 0, COUNT)).toBe(0);
    expect(snapToNearest(0.6, 0, COUNT)).toBe(1);
    expect(snapToNearest(2.4, 0, COUNT)).toBe(2);
    expect(snapToNearest(2.6, 0, COUNT)).toBe(3);
  });
});

describe('snapToNearest — inertia', () => {
  it('a forward throw carries past the nearest slot', () => {
    // rest = 0.1 + 10 * 0.18 = 1.9 → 2
    expect(snapToNearest(0.1, 10, COUNT)).toBe(2);
  });

  it('a backward throw carries toward lower slots', () => {
    // rest = 2.9 + (-10 * 0.18) = 1.1 → 1
    expect(snapToNearest(2.9, -10, COUNT)).toBe(1);
  });

  it('respects a custom momentum coefficient', () => {
    // rest = 1 + 5 * 0.4 = 3 → 3
    expect(snapToNearest(1, 5, COUNT, 0.4)).toBe(3);
    expect(MOMENTUM).toBeGreaterThan(0);
  });
});

describe('snapToNearest — bounded strip (no wrap)', () => {
  it('cannot overshoot past the last slot', () => {
    expect(snapToNearest(3, 50, COUNT)).toBe(3);
  });

  it('cannot undershoot past the first slot', () => {
    expect(snapToNearest(0, -50, COUNT)).toBe(0);
  });
});

describe('slotsFromPx', () => {
  it('maps one slot-width of pixels to one slot', () => {
    expect(slotsFromPx(100, 400, COUNT)).toBe(1);
    expect(slotsFromPx(-200, 400, COUNT)).toBe(-2);
  });

  it('guards against a zero-width track', () => {
    expect(slotsFromPx(100, 0, COUNT)).toBe(0);
  });
});

describe('clampPosition', () => {
  it('clamps a continuous position onto the strip', () => {
    expect(clampPosition(-1.2, COUNT)).toBe(0);
    expect(clampPosition(9, COUNT)).toBe(3);
    expect(clampPosition(1.7, COUNT)).toBe(1.7);
  });
});
