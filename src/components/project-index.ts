import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getStore, type Overlay } from '../state/store';
import { trapTab, focusableWithin } from './overlay-focus';

// The Project Index (SPEC: project-index). A pinned trigger opens a full-screen
// index of works — big centered type rows with (N#) superscripts over ghosted,
// blurred work imagery. The store's overlay FSM is the single source of truth:
// this island shows while the overlay is open (index or a work layered above it),
// traps focus only when it is the top surface (kind === 'index'), and returns
// focus to the originating row when a work closes / to the trigger when it does.
// Works arrive as build-time JSON (islands cannot import Astro collections).

interface IndexWork {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly year: number;
  readonly image: string;
}

function readWorks(): IndexWork[] {
  const el = document.getElementById('works-data');
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as IndexWork[];
  } catch {
    return [];
  }
}

@customElement('project-index')
export class ProjectIndex extends LitElement {
  @state() private kind: Overlay['kind'] = 'none';
  @state() private active = ''; // slug under cursor/focus — drives the ghost backdrop

  private works: IndexWork[] = [];
  private unsubscribe?: () => void;
  private prevKind: Overlay['kind'] = 'none';
  private trigger: HTMLElement | null = null;
  private returnSlug = ''; // row to refocus when a work closes back to the index

  override connectedCallback(): void {
    super.connectedCallback();
    this.works = readWorks();
    this.active = this.works[0]?.slug ?? '';
    const store = getStore();
    this.kind = store.getState().overlay.kind;
    this.prevKind = this.kind;
    this.trigger = document.getElementById('project-index-trigger');
    this.trigger?.setAttribute('aria-expanded', 'false');
    this.trigger?.addEventListener('click', this.onTriggerClick);
    this.unsubscribe = store.subscribe((s) => this.onState(s.overlay));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
    this.trigger?.removeEventListener('click', this.onTriggerClick);
  }

  private readonly onTriggerClick = (): void => {
    getStore().dispatch({ type: 'openIndex' });
  };

  /** React to overlay transitions: manage focus as the surface opens/closes. */
  private onState(overlay: Overlay): void {
    const prev = this.prevKind;
    this.kind = overlay.kind;
    this.prevKind = overlay.kind;
    this.trigger?.setAttribute('aria-expanded', String(overlay.kind !== 'none'));
    if (overlay.kind === 'index') {
      // Opened from the site → focus into the index; returned from a work →
      // refocus that work's row (the WAI focus-return contract).
      void this.focusEntry(prev === 'work' ? this.returnSlug : '');
    } else if (overlay.kind === 'none') {
      this.trigger?.focus(); // closed to the site → focus returns to the trigger
    }
  }

  private async focusEntry(slug: string): Promise<void> {
    await this.updateComplete;
    const row = slug
      ? this.renderRoot.querySelector<HTMLElement>(`.row[data-slug="${slug}"]`)
      : null;
    (row ?? focusableWithin(this.renderRoot as ShadowRoot)[0])?.focus();
  }

  private open(slug: string): void {
    this.returnSlug = slug;
    getStore().dispatch({ type: 'openWork', slug });
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.kind !== 'index') return; // a work is on top — it owns the keyboard
    if (event.key === 'Escape') {
      event.preventDefault();
      getStore().dispatch({ type: 'closeIndex' });
      return;
    }
    trapTab(this.renderRoot as ShadowRoot, event);
  }

  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: none;
      color: var(--ink);
    }
    :host([data-open]) {
      display: block;
    }
    .sheet {
      position: absolute;
      inset: 0;
      background-color: var(--paper);
      overflow-y: auto;
      overscroll-behavior: contain;
      display: grid;
      grid-template-rows: auto 1fr;
    }
    /* Ghost backdrop — the active work's image, blurred and faint (SPEC). */
    .ghost {
      position: fixed;
      inset: 0;
      background-position: center;
      background-size: cover;
      /* Kernels tune the ghost via tokens (essential leans to grayscale duotone);
         custom properties inherit through the shadow boundary, selectors do not. */
      filter: blur(56px) saturate(var(--ghost-saturate, 1.1))
        grayscale(var(--ghost-grayscale, 0));
      opacity: var(--ghost-opacity, 0.22);
      transform: scale(1.15);
      transition: opacity 0.5s var(--ease, ease);
      pointer-events: none;
    }
    .close {
      justify-self: center;
      margin-top: max(1.4rem, env(safe-area-inset-top));
      padding: 0.4rem 0.8rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--ink);
      font-family: var(--font-display, sans-serif);
      font-size: 1.05rem;
      z-index: 1;
    }
    .close:hover,
    .close:focus-visible {
      color: var(--spot, var(--ink));
    }
    .list {
      align-self: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.1rem;
      padding: 2rem 1rem 4rem;
      list-style: none;
      margin: 0;
      z-index: 1;
    }
    .row {
      position: relative;
      display: inline-flex;
      align-items: baseline;
      gap: 0.5rem;
      padding: 0.1rem 0.6rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--ink-2, var(--ink));
      font-family: var(--font-display, sans-serif);
      font-weight: var(--wght-display, 700);
      font-size: clamp(1.8rem, 5.5vw, 4rem);
      line-height: 1.08;
      letter-spacing: var(--tracking-display, -0.01em);
      text-transform: none;
      transition: color 0.25s var(--ease, ease);
    }
    .row:hover,
    .row:focus-visible,
    .row[data-active] {
      color: var(--ink);
    }
    .row:focus-visible {
      outline: var(--border-w, 2px) solid var(--spot, var(--ink));
      outline-offset: 4px;
    }
    .num {
      font-family: var(--font-mono, monospace);
      font-size: 0.42em;
      font-weight: 400;
      color: var(--ink-2);
      align-self: flex-start; /* superscript: pinned to the cap-top of the title */
    }
    .dot {
      width: 0.42em;
      height: 0.42em;
      border-radius: 100%;
      border: 1px solid currentColor;
      background: transparent;
      align-self: center;
      flex: none;
      transition: background-color 0.2s var(--ease, ease);
    }
    .row:hover .dot,
    .row:focus-visible .dot,
    .row[data-active] .dot {
      background-color: currentColor;
    }
    /* category · year — out of flow so the idle title stays centered like the
       comp; revealed to the right of the active row on hover/focus. */
    .meta {
      position: absolute;
      left: calc(100% + 0.4rem);
      top: 50%;
      transform: translateY(-50%);
      white-space: nowrap;
      font-family: var(--font-mono, monospace);
      font-size: 0.24em;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-2);
      opacity: 0;
      transition: opacity 0.2s var(--ease, ease);
    }
    .row:hover .meta,
    .row:focus-visible .meta {
      opacity: 1;
    }
    @media (prefers-reduced-motion: reduce) {
      .ghost,
      .row,
      .dot,
      .meta {
        transition: none;
      }
    }
  `;

  override updated(): void {
    // Reflect open state to the host attribute so :host([data-open]) shows it.
    this.toggleAttribute('data-open', this.kind !== 'none');
  }

  override render() {
    const ghost = this.works.find((w) => w.slug === this.active);
    return html`
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Project index"
        aria-hidden=${this.kind === 'work' ? 'true' : 'false'}
        @keydown=${this.onKeydown}
      >
        <span
          class="ghost"
          aria-hidden="true"
          style=${ghost ? `background-image:url("${ghost.image}")` : ''}
        ></span>
        <button type="button" class="close" @click=${() => getStore().dispatch({ type: 'closeIndex' })}>
          Close
        </button>
        <ul class="list">
          ${this.works.map(
            (w, i) => html`
              <li>
                <button
                  type="button"
                  class="row"
                  data-slug=${w.slug}
                  ?data-active=${w.slug === this.active}
                  @click=${() => this.open(w.slug)}
                  @pointerenter=${() => (this.active = w.slug)}
                  @focus=${() => (this.active = w.slug)}
                >
                  <span class="dot" aria-hidden="true"></span>
                  <span class="num" aria-hidden="true">(N${i + 1})</span>
                  <span>${w.title}</span>
                  <span class="meta">${w.category} · ${w.year}</span>
                </button>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-index': ProjectIndex;
  }
}
