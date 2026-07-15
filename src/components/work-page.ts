import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getStore, type Overlay } from '../state/store';
import { trapTab, focusableWithin } from './overlay-focus';

// One work-page template driven entirely by a work's collection data (SPEC:
// "Full-screen work page"). Layered over the index (never routed), it grafts the
// work's own palette accent onto the mode kernel so two works render visibly
// distinct through the same template — hero, imagery, summary, mechanic, palette.
// Local data + assets only: `source` is attribution text, never a hotlink or
// outbound link. Esc / the close control return to the index (which refocuses
// the originating row); focus is trapped while open.

interface WorkData {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly year: number;
  readonly image: string;
  readonly summary: string;
  readonly palette?: readonly string[];
  readonly mechanic?: string;
  readonly source?: string;
}

function readWorks(): Map<string, WorkData> {
  const el = document.getElementById('works-data');
  const map = new Map<string, WorkData>();
  if (!el?.textContent) return map;
  try {
    for (const w of JSON.parse(el.textContent) as WorkData[]) map.set(w.slug, w);
  } catch {
    /* malformed data — the overlay simply renders nothing */
  }
  return map;
}

@customElement('work-page')
export class WorkPage extends LitElement {
  @state() private slug = '';

  private works = new Map<string, WorkData>();
  private unsubscribe?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    this.works = readWorks();
    const store = getStore();
    const { overlay } = store.getState();
    this.slug = overlay.kind === 'work' ? overlay.slug : '';
    this.unsubscribe = store.subscribe((s) => this.onState(s.overlay));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }

  private onState(overlay: Overlay): void {
    const next = overlay.kind === 'work' ? overlay.slug : '';
    if (next === this.slug) return;
    this.slug = next;
    if (next) void this.focusIn();
  }

  private async focusIn(): Promise<void> {
    await this.updateComplete;
    focusableWithin(this.renderRoot as ShadowRoot)[0]?.focus();
  }

  private close(): void {
    getStore().dispatch({ type: 'closeWork' });
  }

  private onKeydown(event: KeyboardEvent): void {
    if (!this.slug) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    trapTab(this.renderRoot as ShadowRoot, event);
  }

  override updated(): void {
    this.toggleAttribute('data-open', this.slug !== '');
  }

  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: none;
      color: var(--ink);
      --accent: var(--work-accent, var(--spot, var(--ink)));
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
    }
    .bar {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: flex-end;
      padding: max(1.2rem, env(safe-area-inset-top)) clamp(1.2rem, 5vw, 4rem) 0.8rem;
      background: linear-gradient(var(--paper), color-mix(in srgb, var(--paper) 70%, transparent));
    }
    .close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--ink);
      font-family: var(--font-mono, monospace);
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .close:hover,
    .close:focus-visible {
      color: var(--accent);
    }
    article {
      max-width: 64rem;
      margin: 0 auto;
      padding: 1rem clamp(1.2rem, 5vw, 4rem) 6rem;
    }
    .eyebrow {
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--ink-2);
    }
    h1 {
      font-family: var(--font-display, sans-serif);
      font-weight: var(--wght-display, 700);
      font-size: clamp(2.6rem, 10vw, 7rem);
      line-height: 0.98;
      letter-spacing: var(--tracking-display, -0.02em);
      margin: 0.3rem 0 1.4rem;
      color: var(--ink);
    }
    .rule {
      height: var(--border-w, 2px);
      background-color: var(--accent);
      border: none;
      margin: 0 0 2rem;
    }
    figure {
      margin: 0 0 2.4rem;
      aspect-ratio: 16 / 9;
      background-color: var(--paper-1, var(--paper));
      overflow: hidden;
    }
    figure img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .summary {
      font-size: clamp(1.05rem, 2.4vw, 1.4rem);
      line-height: 1.5;
      color: var(--ink-1, var(--ink));
      max-width: 42rem;
      margin: 0 0 2.6rem;
    }
    .facts {
      display: grid;
      gap: 2rem;
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    }
    .facts h2 {
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--ink-2);
      margin: 0 0 0.6rem;
      padding-left: 0.9rem;
      border-left: var(--border-w, 2px) solid var(--accent);
    }
    .mechanic {
      font-size: 1.05rem;
      line-height: 1.45;
      color: var(--ink-1, var(--ink));
    }
    .swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .swatches li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      color: var(--ink-1);
    }
    .chip {
      width: 1.4rem;
      height: 1.4rem;
      border-radius: 100%;
      border: 1px solid var(--line, var(--ink-2));
      flex: none;
    }
    .source {
      margin-top: 2.6rem;
      font-family: var(--font-mono, monospace);
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      color: var(--ink-2);
    }
  `;

  override render() {
    const work = this.works.get(this.slug);
    if (!work) return html``;
    const accent = work.palette?.[0];
    return html`
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-label=${`${work.title} — work`}
        style=${accent ? `--work-accent:${accent}` : ''}
        @keydown=${this.onKeydown}
      >
        <div class="bar">
          <button type="button" class="close" @click=${this.close}>← Index</button>
        </div>
        <article>
          <p class="eyebrow">${work.category} · ${work.year}</p>
          <h1>${work.title}</h1>
          <hr class="rule" />
          <figure>
            <img src=${work.image} alt=${`${work.title} — ${work.category}`} loading="lazy" />
          </figure>
          <p class="summary">${work.summary}</p>
          <div class="facts">
            ${work.mechanic
              ? html`<section>
                  <h2>Mechanic</h2>
                  <p class="mechanic">${work.mechanic}</p>
                </section>`
              : ''}
            ${work.palette?.length
              ? html`<section>
                  <h2>Palette</h2>
                  <ul class="swatches">
                    ${work.palette.map(
                      (c) => html`<li>
                        <span class="chip" style=${`background-color:${c}`}></span>${c}
                      </li>`,
                    )}
                  </ul>
                </section>`
              : ''}
          </div>
          ${work.source ? html`<p class="source">Source — ${work.source}</p>` : ''}
        </article>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'work-page': WorkPage;
  }
}
