/**
 * Delta-time clock driving a rAF loop. Fully stops while the tab is hidden
 * and resumes without a time jump. Motion speed is refresh-rate independent.
 * Under `prefers-reduced-motion` the scaled dt slows to a gentle drift.
 */
export function startLoop(
  render: (elapsedSeconds: number, dt: number, rawDt: number) => void,
): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed = 0;
  let last: number | null = null;
  let rafId = 0;

  const frame = (now: number): void => {
    const rawDt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
    last = now;
    const dt = rawDt * (reduced.matches ? 0.05 : 1);
    elapsed += dt;
    render(elapsed, dt, rawDt);
    rafId = requestAnimationFrame(frame);
  };

  const start = (): void => {
    last = null;
    rafId = requestAnimationFrame(frame);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      start();
    }
  });
  start();
}
