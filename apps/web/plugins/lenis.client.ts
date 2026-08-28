import Lenis from 'lenis';

export default defineNuxtPlugin(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({ smoothWheel: true });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
});
