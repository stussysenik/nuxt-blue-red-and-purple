// Pure wheel snap math (SPEC §5) — no GSAP, no DOM. The mode line is a bounded
// row of `count` slots; a drag or scroll release coasts by its velocity and
// settles on the nearest slot. GSAP animates the motion; this module decides the
// landing, so the decision is unit-tested without a browser.

/** Slot-units a release coasts per unit of velocity (effective glide seconds). */
export const MOMENTUM = 0.18;

const clamp = (n: number, lo: number, hi: number): number =>
  n < lo ? lo : n > hi ? hi : n;

/**
 * Project an inertial release and snap to the nearest slot. `position` and
 * `velocity` are in slot units (velocity: slots per second). Bounded strip: the
 * result never leaves `[0, count - 1]`.
 */
export function snapToNearest(
  position: number,
  velocity: number,
  count: number,
  momentum: number = MOMENTUM,
): number {
  const rest = position + velocity * momentum;
  return clamp(Math.round(rest), 0, count - 1);
}

/** Convert a pixel delta to slot units given the rendered track width. */
export function slotsFromPx(px: number, trackWidth: number, count: number): number {
  return trackWidth <= 0 ? 0 : (px / trackWidth) * count;
}

/** Clamp a continuous position onto the bounded strip. */
export function clampPosition(position: number, count: number): number {
  return clamp(position, 0, count - 1);
}
