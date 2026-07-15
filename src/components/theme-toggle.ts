import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getStore, type Theme } from '../state/store';

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
      right: max(1.4rem, env(safe-area-inset-right));
      bottom: max(1.4rem, env(safe-area-inset-bottom));
      z-index: 4;
    }
    button {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.8rem;
      font-family: var(--font-mono);
      font-weight: var(--wght-label);
      font-size: 0.72rem;
      letter-spacing: var(--tracking-label);
      text-transform: uppercase;
      color: var(--ink);
      background-color: var(--surface);
      border: var(--border-w) solid var(--ink);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: color var(--dur) var(--ease);
    }
    button:hover,
    button:focus-visible {
      color: var(--spot);
    }
    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 100%;
      border: 1px solid currentColor;
      background-color: transparent;
    }
    .dot[data-on='true'] {
      background-color: currentColor;
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
        <span class="dot" data-on=${isDark ? 'true' : 'false'}></span>
        <span>${isDark ? 'Dark' : 'Light'}</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-toggle': ThemeToggle;
  }
}
