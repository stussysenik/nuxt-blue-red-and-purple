// One atom, one reducer (SPEC §4). Mode is a union of four literals, so
// impossible states are unrepresentable. `reduce` is pure — the truth table is
// unit-tested without any DOM. The store wires reduce → commit → subscribers;
// the only DOM mutation is two attributes on <html> plus overlay body state.

export type Mode = 'essential' | 'brutal' | 'clay' | 'generative';
export type Theme = 'light' | 'dark';

export interface AppState {
  readonly mode: Mode;
  readonly theme: Theme;
  readonly activeWork: string | null;
}

export type Intent =
  | { readonly type: 'setMode'; readonly mode: Mode }
  | { readonly type: 'cycleMode'; readonly dir: 1 | -1 }
  | { readonly type: 'setTheme'; readonly theme: Theme }
  | { readonly type: 'toggleTheme' }
  | { readonly type: 'openWork'; readonly slug: string }
  | { readonly type: 'closeWork' };

/** Wheel order — cycling wraps. `essential` leads (restraint greets first). */
export const MODES: readonly Mode[] = ['essential', 'brutal', 'clay', 'generative'];

const wrapIndex = (i: number, dir: number, len: number): number =>
  (i + dir + len) % len;

/** Pure state transition — the whole mode/theme/overlay truth table. */
export function reduce(state: AppState, intent: Intent): AppState {
  switch (intent.type) {
    case 'setMode':
      return state.mode === intent.mode ? state : { ...state, mode: intent.mode };
    case 'cycleMode': {
      const next = MODES[wrapIndex(MODES.indexOf(state.mode), intent.dir, MODES.length)];
      return next === undefined || next === state.mode ? state : { ...state, mode: next };
    }
    case 'setTheme':
      return state.theme === intent.theme ? state : { ...state, theme: intent.theme };
    case 'toggleTheme':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'openWork':
      return state.activeWork === intent.slug ? state : { ...state, activeWork: intent.slug };
    case 'closeWork':
      return state.activeWork === null ? state : { ...state, activeWork: null };
  }
}

export type Listener = (state: AppState) => void;

export interface Store {
  getState(): AppState;
  dispatch(intent: Intent): void;
  subscribe(listener: Listener): () => void;
}

const THEME_KEY = 'theme';

/** Read the truth already resolved by the no-FOUC bootstrap on <html>. */
function readInitialState(): AppState {
  const root = document.documentElement;
  const mode = (root.dataset.mode as Mode | undefined) ?? 'essential';
  const theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  return { mode, theme, activeWork: null };
}

/** Effectful projection of state onto the DOM (SPEC: two attribute writes). */
function commit(state: AppState): void {
  const root = document.documentElement;
  root.dataset.mode = state.mode;
  root.dataset.theme = state.theme;
  root.dataset.overlay = state.activeWork === null ? 'closed' : 'open';
  try {
    localStorage.setItem(THEME_KEY, state.theme);
  } catch {
    /* private mode / storage disabled — theme still applies for the session */
  }
}

export function createStore(initial: AppState): Store {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    getState: () => state,
    dispatch(intent) {
      const next = reduce(state, intent);
      if (next === state) return;
      state = next;
      commit(state);
      for (const l of listeners) l(state);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

let singleton: Store | undefined;

/** Shared store for all islands on the page (client-only). */
export function getStore(): Store {
  singleton ??= createStore(readInitialState());
  return singleton;
}
