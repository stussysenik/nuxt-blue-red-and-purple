import { LitElement, html, css, svg } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getStore, type Theme } from '../state/store';

// Bare glyphs — no chrome, no fill; stroke follows currentColor (--ink). The
// icon shows the *current* theme; the label describes the *action*.
const sunIcon = svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.1" /><path d="M12 2.6v2.4M12 19v2.4M4.3 4.3l1.7 1.7M18 18l1.7 1.7M2.6 12H5M19 12h2.4M4.3 19.7l1.7-1.7M18 6l1.7-1.7" /></svg>`;
const moonIcon = svg`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.4A8 8 0 1 1 9.6 4 6.2 6.2 0 0 0 20 14.4z" /></svg>`;

// Pinned island (SPEC layer table): always visible, re-skins with the kernel
// via inherited custom properties, persists through the store's commit. Browser
// APIs are touched only in lifecycle/handlers so SSR renders cleanly.
@customElement('theme-toggle')
export class ThemeToggle extends LitElement {
  @state() private theme: Theme = 'light';
  private unsubscribe?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    const store = getStore();
    this.theme = store.getState().theme;
    this.unsubscribe = store.subscribe((s) => {
      this.theme = s.theme;
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private toggle(): void {
    getStore().dispatch({ type: 'toggleTheme' });
  }

  static override styles = css`
    :host {
      position: fixed;
      right: max(var(--chrome-inset, 1.4rem), env(safe-area-inset-right));
      bottom: max(var(--chrome-inset, 1.4rem), env(safe-area-inset-bottom));
      z-index: 4;
    }
    /* Minimal: a single icon, no border/radius/shadow/surface — just the glyph. */
    button {
      display: inline-flex;
      padding: 0;
      background: none;
      border: none;
      color: var(--ink);
      cursor: pointer;
      transition: color var(--dur) var(--ease);
      -webkit-tap-highlight-color: transparent;
    }
    button:hover,
    button:focus-visible {
      color: var(--spot);
      outline: none;
    }
    svg {
      display: block;
      width: 1.15rem;
      height: 1.15rem;
    }
    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;

  override render() {
    const isDark = this.theme === 'dark';
    return html`
      <button
        type="button"
        aria-pressed=${isDark ? 'true' : 'false'}
        aria-label=${isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        @click=${this.toggle}
      >
        ${isDark ? moonIcon : sunIcon}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-toggle': ThemeToggle;
  }
}
