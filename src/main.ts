import { createSurface, showFallback, type GlSurface } from './gl/context';
import { createPipeline } from './gl/pipeline';
import { createDirector } from './director';
import { SCENES } from './scenes';
import { startLoop } from './clock';

function run(surface: GlSurface): void {
  const { gl } = surface;
  const pipeline = createPipeline(gl, SCENES.map((scene) => scene.fragSource));
  const director = createDirector(SCENES.map((scene) => scene.duration));
  const sceneTimes = SCENES.map((_, i) => i * 7.3); // desynced starting phases
  let renderScale = 1;
  let bestDt = 1 / 30;
  let emaDt = 0;
  // Diagnostics hook: lets tooling observe adaptive quality in production.
  Object.defineProperty(window, '__brpScale', { get: () => renderScale });

  startLoop((elapsed, dt, rawDt) => {
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

    const { width, height } = surface.size();
    const sw = Math.round(width * renderScale);
    const sh = Math.round(height * renderScale);
    const { active, next, mix } = director.update(dt);

    const activeTime = (sceneTimes[active] ?? 0) + dt;
    sceneTimes[active] = activeTime;
    pipeline.drawScene(active, 0, activeTime, sw, sh);
    if (next !== null) {
      const nextTime = (sceneTimes[next] ?? 0) + dt;
      sceneTimes[next] = nextTime;
      pipeline.drawScene(next, 1, nextTime, sw, sh);
    }
    pipeline.drawComposite(mix, elapsed, width, height);
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
