import { describe, it, expect } from 'vitest';
import { reduce, MODES, type AppState } from '../src/state/store';

const base: AppState = { mode: 'essential', theme: 'light', overlay: { kind: 'none' } };

describe('reduce — mode', () => {
  it('setMode sets each of the four modes', () => {
    for (const mode of MODES) {
      expect(reduce(base, { type: 'setMode', mode }).mode).toBe(mode);
    }
  });

  it('setMode to the current mode is a no-op (same reference)', () => {
    expect(reduce(base, { type: 'setMode', mode: 'essential' })).toBe(base);
  });

  it('cycleMode +1 walks the wheel order and wraps', () => {
    let s = base;
    const seen = [s.mode];
    for (let i = 0; i < MODES.length; i++) {
      s = reduce(s, { type: 'cycleMode', dir: 1 });
      seen.push(s.mode);
    }
    expect(seen).toEqual(['essential', 'brutal', 'clay', 'generative', 'essential']);
  });

  it('cycleMode -1 walks backward and wraps', () => {
    const s = reduce(base, { type: 'cycleMode', dir: -1 });
    expect(s.mode).toBe('generative');
  });
});

describe('reduce — theme', () => {
  it('toggleTheme flips both directions', () => {
    const dark = reduce(base, { type: 'toggleTheme' });
    expect(dark.theme).toBe('dark');
    expect(reduce(dark, { type: 'toggleTheme' }).theme).toBe('light');
  });

  it('setTheme is a no-op when unchanged', () => {
    expect(reduce(base, { type: 'setTheme', theme: 'light' })).toBe(base);
  });

  it('mode and theme are orthogonal', () => {
    const s = reduce({ ...base, mode: 'brutal' }, { type: 'toggleTheme' });
    expect(s).toEqual({ mode: 'brutal', theme: 'dark', overlay: { kind: 'none' } });
  });
});

describe('reduce — overlay FSM', () => {
  it('descends site → index → work, one step per intent', () => {
    const index = reduce(base, { type: 'openIndex' });
    expect(index.overlay).toEqual({ kind: 'index' });
    const work = reduce(index, { type: 'openWork', slug: 'smac' });
    expect(work.overlay).toEqual({ kind: 'work', slug: 'smac' });
  });

  it('ascends work → index → site, one step per intent', () => {
    const work: AppState = { ...base, overlay: { kind: 'work', slug: 'smac' } };
    const index = reduce(work, { type: 'closeWork' });
    expect(index.overlay).toEqual({ kind: 'index' });
    const site = reduce(index, { type: 'closeIndex' });
    expect(site.overlay).toEqual({ kind: 'none' });
  });

  it('closeWork from the index (or site) is a no-op — close descends one level only', () => {
    const index: AppState = { ...base, overlay: { kind: 'index' } };
    expect(reduce(index, { type: 'closeWork' })).toBe(index);
    expect(reduce(base, { type: 'closeWork' })).toBe(base);
  });

  it('closeIndex from a work is a no-op — the work must be closed first', () => {
    const work: AppState = { ...base, overlay: { kind: 'work', slug: 'smac' } };
    expect(reduce(work, { type: 'closeIndex' })).toBe(work);
  });

  it('switching works stays at the work level and swaps the slug', () => {
    const a: AppState = { ...base, overlay: { kind: 'work', slug: 'smac' } };
    const b = reduce(a, { type: 'openWork', slug: 'h724' });
    expect(b.overlay).toEqual({ kind: 'work', slug: 'h724' });
    expect(reduce(a, { type: 'openWork', slug: 'smac' })).toBe(a);
  });

  it('opening a work never disturbs mode or theme', () => {
    const s = reduce({ ...base, mode: 'clay', theme: 'dark' }, { type: 'openWork', slug: 'x' });
    expect(s.mode).toBe('clay');
    expect(s.theme).toBe('dark');
  });
});
