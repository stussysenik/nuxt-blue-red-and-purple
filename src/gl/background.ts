import { createSurface, showFallback, type GlSurface } from './context';
import { createPipeline } from './pipeline';
import { createLife } from './life';
import { createDirector, type DirectorState } from '../director';
import { SCENES } from '../scenes';
import { stepSuspend, initialSuspend, type SuspendState, type SuspendEvent } from './suspend';
import { getStore } from '../state/store';

// Generative-mode background: the preserved shader scenes (src/scenes.ts,
// untouched) rendered as a fixed layer behind the chrome, graded to the
// kernel's ink/paper duotone so the colour law extends to the WebGL layer.
// A thin, controllable sibling of the standalone wallpaper app (main.ts) —
// no export/menu/swipe chrome, just an ambient loop the suspend FSM gates:
// it ticks only while generative mode is active AND the tab is visible.

type Rgb = readonly [number, number, number];

// The background is ambient — no touch optics. A single neutral pointer sample
// (centred, zero energy, all ripples inactive) satisfies the composite pass.
const NEUTRAL_POINTER = {
  x: 0.5,
  y: 0.5,
  energy: 0,
  ripples: new Float32Array(18).fill(-1), // 6 × vec3; z < 0 = inactive
} as const;

// Reduced-motion still frame: generations to mature the Game-of-Life before the
// single draw (≈ the density the animated loop settles into), and the fixed
// scene/composite phase to sample. Warmed in one synchronous burst so no
// intermediate frame is ever presented — the reduced-motion contract holds.
const STILL_GENERATIONS = 28;
const STILL_TIME = 8;

interface Runtime {
  readonly surface: GlSurface;
  readonly pipeline: ReturnType<typeof createPipeline>;
  readonly life: ReturnType<typeof createLife>;
  readonly director: ReturnType<typeof createDirector>;
  readonly sceneTimes: number[];
}

export function mountGenerativeBackground(canvas: HTMLCanvasElement): void {
  // Reduced motion keeps the WebGL layer but never animates it: instead of
  // dropping the generative identity entirely (leaving reduce-motion devices on
  // a flat kernel while everyone else got the shader), we draw ONE static,
  // matured frame — same duotone backdrop on every device, zero motion. One
  // source of truth for the look; the loop below is the only thing gated off.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  canvas.addEventListener('webglcontextlost', () => showFallback(canvas));

  const store = getStore();
  let runtime: Runtime | null = null;
  let dead = false; // WebGL2 unavailable / context lost — stop trying
  let fsm: SuspendState = initialSuspend;
  let grade: { shadow: Rgb; highlight: Rgb } = { shadow: [0, 0, 0], highlight: [1, 1, 1] };
  let rafId = 0;
  let last = 0;
  let elapsed = 0;
  let state: DirectorState = { active: 0, next: null, mix: 0 };

  // Resolve a kernel colour token (e.g. --duotone-shadow → var(--paper)) to
  // concrete rgb by borrowing the canvas as a probe: `color` is always computed
  // to rgb(), sidestepping the var()-resolution ambiguity of custom properties.
  function probeColor(prop: string): Rgb {
    canvas.style.color = `var(${prop})`;
    const parts = getComputedStyle(canvas).color.match(/\d+/g);
    canvas.style.color = '';
    if (!parts || parts.length < 3) return [0, 0, 0];
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
  }

  const readGrade = (): { shadow: Rgb; highlight: Rgb } => ({
    shadow: probeColor('--duotone-shadow'),
    highlight: probeColor('--duotone-highlight'),
  });

  function ensureRuntime(): boolean {
    if (runtime) return true;
    if (dead) return false;
    const surface = createSurface(canvas);
    if (!surface) {
      dead = true;
      showFallback(canvas);
      return false;
    }
    runtime = {
      surface,
      pipeline: createPipeline(surface.gl, SCENES.map((scene) => scene.fragSource)),
      life: createLife(surface.gl),
      director: createDirector(SCENES.map((scene) => scene.duration)),
      sceneTimes: SCENES.map((_, i) => i * 7.3), // desynced starting phases
    };
    return true;
  }

  function frame(now: number): void {
    if (!runtime) return;
    const dt = last === 0 ? 0 : Math.min((now - last) / 1000, 0.1);
    last = now;
    elapsed += dt;
    runtime.life.step(dt, NEUTRAL_POINTER.x, NEUTRAL_POINTER.y, NEUTRAL_POINTER.energy);
    state = runtime.director.update(dt);
    runtime.sceneTimes[state.active] = (runtime.sceneTimes[state.active] ?? 0) + dt;
    if (state.next !== null) {
      runtime.sceneTimes[state.next] = (runtime.sceneTimes[state.next] ?? 0) + dt;
    }
    const { width, height } = runtime.surface.size();
    runtime.pipeline.drawScene(state.active, 0, runtime.sceneTimes[state.active] ?? 0, width, height, runtime.life.texture());
    if (state.next !== null) {
      runtime.pipeline.drawScene(state.next, 1, runtime.sceneTimes[state.next] ?? 0, width, height, runtime.life.texture());
    }
    runtime.pipeline.drawComposite(state.mix, elapsed, width, height, NEUTRAL_POINTER, grade);
    rafId = requestAnimationFrame(frame);
  }

  // Reduced-motion path: mature the sim off-screen once, then paint a single
  // still. No rAF loop is ever started, so this is a frozen image, not animation.
  let warmed = false;
  function renderStill(): void {
    if (!runtime) return;
    if (!warmed) {
      for (let i = 0; i < STILL_GENERATIONS; i++) {
        runtime.life.step(1 / 8, NEUTRAL_POINTER.x, NEUTRAL_POINTER.y, NEUTRAL_POINTER.energy);
      }
      warmed = true;
    }
    const { width, height } = runtime.surface.size();
    runtime.pipeline.drawScene(state.active, 0, STILL_TIME, width, height, runtime.life.texture());
    runtime.pipeline.drawComposite(state.mix, STILL_TIME, width, height, NEUTRAL_POINTER, grade);
  }

  const start = (): void => {
    if (reducedMotion) {
      renderStill(); // single static frame instead of the animation loop
      return;
    }
    if (rafId) return;
    last = 0;
    rafId = requestAnimationFrame(frame);
  };
  const stop = (): void => {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  function dispatch(event: SuspendEvent): void {
    const prev = fsm.phase;
    fsm = stepSuspend(fsm, event);
    if (fsm.phase === prev) return;
    if (fsm.phase === 'running') {
      if (!ensureRuntime()) return;
      grade = readGrade();
      start();
    } else {
      stop();
    }
  }

  let lastGenerative = store.getState().mode === 'generative';
  let lastTheme = store.getState().theme;
  store.subscribe((s) => {
    const generative = s.mode === 'generative';
    if (generative !== lastGenerative) {
      lastGenerative = generative;
      dispatch({ type: 'mode', generative });
    }
    if (s.theme !== lastTheme) {
      lastTheme = s.theme;
      // A live theme flip swaps the duotone endpoints. The running loop picks
      // this up on its next frame; the static frame must be repainted by hand.
      if (runtime && fsm.phase === 'running') {
        grade = readGrade();
        if (reducedMotion) renderStill();
      }
    }
  });

  document.addEventListener('visibilitychange', () => {
    dispatch({ type: 'visibility', visible: !document.hidden });
  });

  // The static frame doesn't self-repaint, so redraw it after an orientation /
  // viewport change (deferred a frame so the surface's own resize runs first).
  window.addEventListener('resize', () => {
    if (reducedMotion && runtime && fsm.phase === 'running') requestAnimationFrame(renderStill);
  });

  // Reconcile against the state already committed by the no-FOUC bootstrap.
  dispatch({ type: 'mode', generative: lastGenerative });
}
