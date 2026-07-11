const MAX_DPR = 2;

export interface GlSurface {
  readonly gl: WebGL2RenderingContext;
  readonly canvas: HTMLCanvasElement;
  /** Current drawing-buffer size in physical pixels. */
  size(): { width: number; height: number };
}

/** Returns null when WebGL2 is unavailable — caller must show the CSS fallback. */
export function createSurface(canvas: HTMLCanvasElement): GlSurface | null {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  };
  resize();
  window.addEventListener('resize', resize);

  return {
    gl,
    canvas,
    size: () => ({ width: canvas.width, height: canvas.height }),
  };
}

export function showFallback(): void {
  document.body.classList.add('no-webgl');
  document.getElementById('c')?.remove();
}
