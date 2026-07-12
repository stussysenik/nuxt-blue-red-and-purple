const TRANSITION_SECONDS = 1.8;

export interface DirectorState {
  /** Scene rendered into texture A. */
  readonly active: number;
  /** Scene rendered into texture B during a transition, else null. */
  readonly next: number | null;
  /** Eased blend factor A→B, 0 outside transitions. */
  readonly mix: number;
}

/**
 * Carousel scheduler: hold each scene for its duration, crossfade to the
 * next, loop forever. Pure function of accumulated dt — no wall clock.
 */
export function createDirector(durations: readonly number[]) {
  let active = 0;
  let next: number | null = null;
  let held = 0;

  return {
    update(dt: number): DirectorState {
      held += dt;
      const duration = durations[active] ?? 20;
      if (next === null && held >= duration) {
        next = (active + 1) % durations.length;
        held = duration;
      }
      let mix = 0;
      if (next !== null) {
        const progress = Math.min((held - duration) / TRANSITION_SECONDS, 1);
        mix = progress * progress * (3 - 2 * progress);
        if (progress >= 1) {
          active = next;
          next = null;
          held = 0;
          mix = 0;
        }
      }
      return { active, next, mix };
    },
    /** User-initiated advance: start the crossfade to the next scene now. */
    skip(): void {
      if (next !== null) return;
      next = (active + 1) % durations.length;
      held = Math.max(held, durations[active] ?? 20);
    },
  };
}
