const MAX_RIPPLES = 6;
const RIPPLE_LIFE = 3; // seconds until a ring has fully damped out

export interface PointerSample {
  /** Smoothed pointer, normalized, y-up. */
  readonly x: number;
  readonly y: number;
  /** Interaction envelope 0..1 — swells with movement, breathes back out. */
  readonly energy: number;
  /** Flat [x, y, age] triples for the ripple uniform array; age < 0 = inactive. */
  readonly ripples: Float32Array;
}

const norm = (e: PointerEvent) => ({
  nx: e.clientX / window.innerWidth,
  ny: 1 - e.clientY / window.innerHeight,
});

/**
 * Unified pointer/touch input: a critically-damped trailing position, a
 * velocity-fed energy envelope, a pool of water-ripple emitters, and swipe
 * detection (one callback per gesture). All state advances on `sample(dt)`
 * with raw dt so interaction stays responsive under reduced motion.
 */
export function createPointer(onSwipe: () => void) {
  let tx = 0.5, ty = 0.55, x = tx, y = ty;
  let heat = 0;
  let energy = 0;
  let down = false, swiped = false, downX = 0, downY = 0, downAt = 0;
  const ripples = new Float32Array(MAX_RIPPLES * 3).fill(-1);
  let nextRipple = 0;

  window.addEventListener('pointerdown', (e) => {
    const { nx, ny } = norm(e);
    tx = nx; ty = ny; x = nx; y = ny; // new gesture: bloom where the finger lands
    heat = Math.max(heat, 0.7);
    const base = nextRipple * 3;
    ripples[base] = nx;
    ripples[base + 1] = ny;
    ripples[base + 2] = 0;
    nextRipple = (nextRipple + 1) % MAX_RIPPLES;
    down = true; swiped = false;
    downX = e.clientX; downY = e.clientY; downAt = performance.now();
  });

  window.addEventListener('pointermove', (e) => {
    const { nx, ny } = norm(e);
    heat = Math.min(1.2, heat + Math.hypot(nx - tx, ny - ty) * 3);
    tx = nx; ty = ny;
    if (down && !swiped && performance.now() - downAt < 500) {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 70) {
        swiped = true;
        onSwipe();
      }
    }
  });

  window.addEventListener('pointerup', () => { down = false; });
  window.addEventListener('pointercancel', () => { down = false; });

  return {
    sample(dt: number): PointerSample {
      const ease = 1 - Math.exp(-dt * 5);
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      heat = Math.min(heat, 1.2) * Math.exp(-dt * 1.1);
      energy += (Math.min(heat, 1) - energy) * (1 - Math.exp(-dt * 8));
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const age = ripples[i * 3 + 2] ?? -1;
        if (age >= 0) ripples[i * 3 + 2] = age + dt > RIPPLE_LIFE ? -1 : age + dt;
      }
      return { x, y, energy, ripples };
    },
  };
}
