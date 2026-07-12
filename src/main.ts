import { createSurface, showFallback, type GlSurface } from './gl/context';
import { createPipeline } from './gl/pipeline';
import { createLife } from './gl/life';
import { createDirector, type DirectorState } from './director';
import { SCENES } from './scenes';
import { startLoop } from './clock';
import { createPointer, type PointerSample } from './pointer';

// Hard ceiling on export dimensions — universally safe GL texture size.
const MAX_EXPORT = 4096;

function run(surface: GlSurface): void {
  const { gl, canvas } = surface;
  const pipeline = createPipeline(gl, SCENES.map((scene) => scene.fragSource));
  const life = createLife(gl);
  const director = createDirector(SCENES.map((scene) => scene.duration));
  const pointer = createPointer(() => {
    director.skip(); // swipe advances the carousel
    if ('vibrate' in navigator) navigator.vibrate(8);
  });
  const sceneTimes = SCENES.map((_, i) => i * 7.3); // desynced starting phases
  let renderScale = 1;
  let bestDt = 1 / 30;
  let emaDt = 0;
  let elapsed = 0;
  let state: DirectorState = { active: 0, next: null, mix: 0 };
  let sample: PointerSample = pointer.sample(0);
  // Diagnostics hooks: let tooling observe adaptive quality + scene state.
  Object.defineProperty(window, '__brpScale', { get: () => renderScale });
  Object.defineProperty(window, '__brpScene', { get: () => state.active });

  // Draws the current visual moment (no time advance) — shared by the live
  // loop and the wallpaper export, which renders the same frame hi-res.
  function render(width: number, height: number, sw: number, sh: number): void {
    pipeline.drawScene(state.active, 0, sceneTimes[state.active] ?? 0, sw, sh, life.texture());
    if (state.next !== null) {
      pipeline.drawScene(state.next, 1, sceneTimes[state.next] ?? 0, sw, sh, life.texture());
    }
    pipeline.drawComposite(state.mix, elapsed, width, height, sample);
  }

  function exportWallpaper(width: number, height: number): void {
    const w = Math.min(Math.round(width), MAX_EXPORT);
    const h = Math.min(Math.round(height), MAX_EXPORT);
    const prevW = canvas.width;
    const prevH = canvas.height;
    canvas.width = w;
    canvas.height = h;
    render(w, h, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `blueredandpurple-${w}x${h}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
    canvas.width = prevW; // toBlob captures at call time; restore immediately
    canvas.height = prevH;
  }

  const saveButton = document.getElementById('save');
  const sizesMenu = document.getElementById('sizes');
  const setMenu = (open: boolean): void => {
    if (!sizesMenu || !saveButton || sizesMenu.hidden === !open) return;
    sizesMenu.hidden = !open;
    saveButton.setAttribute('aria-expanded', String(open));
    if ('vibrate' in navigator) navigator.vibrate(4); // micro-haptic state cue
  };
  saveButton?.addEventListener('click', () => setMenu(Boolean(sizesMenu?.hidden)));
  window.addEventListener('pointerdown', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('.actions')) setMenu(false);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
  sizesMenu?.addEventListener('click', (event) => {
    const spec = event.target instanceof HTMLElement ? event.target.dataset['size'] : undefined;
    if (!spec) return;
    if (spec === 'screen') {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      exportWallpaper(window.screen.width * dpr, window.screen.height * dpr);
    } else {
      const [w = 1290, h = 2796] = spec.split('x').map(Number);
      exportWallpaper(w, h);
    }
    sizesMenu.hidden = true;
    saveButton?.setAttribute('aria-expanded', 'false');
  });

  startLoop((elapsedSeconds, dt, rawDt) => {
    elapsed = elapsedSeconds;
    sample = pointer.sample(rawDt); // raw dt: interaction stays responsive under reduced motion

    // Adaptive resolution: if smoothed frame time drifts well above the best
    // observed cadence, shrink the internal render target before dropping
    // frames; recover when headroom returns.
    if (rawDt > 0.001) {
      bestDt = Math.min(bestDt, rawDt);
      emaDt = emaDt === 0 ? rawDt : emaDt * 0.9 + rawDt * 0.1;
      if (emaDt > bestDt * 1.35 && renderScale > 0.5) {
        renderScale = Math.max(0.5, renderScale - 0.05);
      } else if (emaDt < bestDt * 1.15 && renderScale < 1) {
        renderScale = Math.min(1, renderScale + 0.02);
      }
    }

    life.step(dt, sample.x, sample.y, sample.energy);
    state = director.update(dt);
    sceneTimes[state.active] = (sceneTimes[state.active] ?? 0) + dt;
    if (state.next !== null) sceneTimes[state.next] = (sceneTimes[state.next] ?? 0) + dt;

    const { width, height } = surface.size();
    render(width, height, Math.round(width * renderScale), Math.round(height * renderScale));
  });
}

const canvas = document.getElementById('c');
if (!(canvas instanceof HTMLCanvasElement)) {
  showFallback();
} else {
  canvas.addEventListener('webglcontextlost', () => showFallback());
  const surface = createSurface(canvas);
  if (surface) {
    try {
      run(surface);
    } catch (error) {
      console.error(error);
      showFallback();
    }
  } else {
    showFallback();
  }
}
