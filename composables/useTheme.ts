import { useState, useEffect } from 'vue';

export type Theme = 'light' | 'dark';
export type Mode = 'essential' | 'brutal' | 'clay' | 'generative';

const THEME_KEY = 'theme';
const MODE_KEY = 'mode';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialMode(): Mode {
  if (typeof window === 'undefined') return 'generative';
  const stored = localStorage.getItem(MODE_KEY);
  if (stored === 'essential' || stored === 'brutal' || stored === 'clay' || stored === 'generative') {
    return stored;
  }
  return 'generative';
}

const theme = useState<Theme>('theme', () => getInitialTheme());
const mode = useState<Mode>('mode', () => getInitialMode());

function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = t;
  }
}

function applyMode(m: Mode) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.mode = m;
  }
}

export function useTheme() {
  useEffect(() => {
    applyTheme(theme.value);
  }, []);

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, theme.value);
    applyTheme(theme.value);
  }

  function setTheme(t: Theme) {
    theme.value = t;
    localStorage.setItem(THEME_KEY, t);
    applyTheme(t);
  }

  return { theme, toggle, setTheme };
}

export function useMode() {
  useEffect(() => {
    applyMode(mode.value);
  }, []);

  function setMode(m: Mode) {
    mode.value = m;
    localStorage.setItem(MODE_KEY, m);
    applyMode(m);
  }

  return { mode, setMode };
}
