// Suspend/resume state machine for the generative-mode shader background.
// Pure — no DOM, no GL — so the whole transition table is unit-tested. The
// loop must run iff generative mode is active AND the tab is visible; WebGL is
// initialized lazily on first entry (never paid for if the user never visits
// generative) and never torn down once running, so resume is instant.

export type SuspendPhase =
  | 'inert' // never initialized — no GL context yet (pre-first-run only)
  | 'running' // loop ticking
  | 'suspended'; // initialized but paused (rAF cancelled, context retained)

export interface SuspendState {
  readonly modeActive: boolean;
  readonly visible: boolean;
  readonly phase: SuspendPhase;
}

export type SuspendEvent =
  | { readonly type: 'mode'; readonly generative: boolean }
  | { readonly type: 'visibility'; readonly visible: boolean };

/** A tab is assumed visible until told otherwise; nothing is initialized yet. */
export const initialSuspend: SuspendState = {
  modeActive: false,
  visible: true,
  phase: 'inert',
};

/** Pure transition: run iff active+visible; stay inert until the first run. */
export function stepSuspend(state: SuspendState, event: SuspendEvent): SuspendState {
  const modeActive = event.type === 'mode' ? event.generative : state.modeActive;
  const visible = event.type === 'visibility' ? event.visible : state.visible;
  const phase: SuspendPhase =
    modeActive && visible ? 'running' : state.phase === 'inert' ? 'inert' : 'suspended';
  return { modeActive, visible, phase };
}
