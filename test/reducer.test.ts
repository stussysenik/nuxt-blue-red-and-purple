import { describe, it, expect } from 'vitest';
import { reduce, MODES, type AppState } from '../src/state/store';

const base: AppState = { mode: 'essential', theme: 'light' };

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
    expect(s).toEqual({ mode: 'brutal', theme: 'dark' });
  });
});
