import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { getStore, MODES, type Mode } from '../state/store';
import { snapToNearest, slotsFromPx, clampPosition } from '../wheel';

// Pinned hero-line island (SPEC §5): the wheel is the parent function
// `page = mode(content)`. A bounded row of four mode slots; drag / scroll /
// arrow keys rotate it and GSAP inertia snaps to the nearest mode. Dot language:
// filled = active mode, outline = others. The store is the single source of
// truth — this island dispatches `setMode` and renders from the committed state.
// GSAP loads only in the browser (dynamic import in `firstUpdated`) so SSR — the
// declarative-shadow-DOM fallback row — never touches `window`.

type Gsap = typeof import('gsap').gsap;

@customElement('mode-wheel')
export class ModeWheel extends LitElement {
  @state() private active: Mode = 'essential';
  @query('.track') private track!: HTMLElement;

  private unsubscribe?: () => void;
  private gsap?: Gsap;
  private readonly motion = { pos: 0 };
  private reduced = false; // resolved client-side in connectedCallback (SSR-safe)

  // Pointer-drag bookkeeping.
  private dragging = false;
  private pointerId = -1;
  private trackWidth = 0;
  private startPos = 0;
  private startX = 0;
  private lastX = 0;
  private lastT = 0;
  private velocity = 0; // slots per second

  override connectedCallback(): void {
    super.connectedCallback();
    const store = getStore();
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.active = store.getState().mode;
    this.motion.pos = MODES.indexOf(this.active);
    this.unsubscribe = store.subscribe((s) => {
      this.active = s.mode;
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe?.();
    this.gsap?.killTweensOf(this.motion);
  }

  override firstUpdated(): void {
    this.applyPosition();
    if (this.reduced) return;
    void (async () => {
      const [core, plugin] = await Promise.all([
        import('gsap'),
        import('gsap/InertiaPlugin'),
      ]);
      const gsap = core.gsap ?? core.default;
      gsap.registerPlugin(plugin.InertiaPlugin);
      this.gsap = gsap;
    })();
  }

  /** Project the continuous marker position onto the CSS custom property. */
  private applyPosition(): void {
    this.style.setProperty('--pos', String(this.motion.pos));
  }

  /** Dispatch a mode change and glide the marker to its slot (with optional throw). */
  private goTo(index: number, velocity = 0): void {
    const next = MODES[index];
    if (next) getStore().dispatch({ type: 'setMode', mode: next });
    this.settle(index, velocity);
  }

  /** Animate the marker to a slot: GSAP inertia when thrown, eased otherwise. */
  private settle(index: number, velocity: number): void {
    if (this.reduced || !this.gsap) {
      this.motion.pos = index;
      this.applyPosition();
      return;
    }
    this.gsap.killTweensOf(this.motion);
    const onUpdate = (): void => this.applyPosition();
    if (velocity !== 0) {
      this.gsap.to(this.motion, {
        inertia: { pos: { velocity, end: index } },
        onUpdate,
      });
    } else {
      this.gsap.to(this.motion, { pos: index, duration: 0.5, ease: 'power3.out', onUpdate });
    }
  }

  private step(dir: 1 | -1): void {
    const cur = MODES.indexOf(this.active);
    this.goTo((cur + dir + MODES.length) % MODES.length);
  }

  /** Move focus to the checked radio — the WAI-ARIA radiogroup pattern. */
  private async focusActive(): Promise<void> {
    await this.updateComplete;
    this.renderRoot.querySelector<HTMLElement>('.slot[aria-checked="true"]')?.focus();
  }

  private onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.step(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.step(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(MODES.length - 1);
        break;
      default:
        return;
    }
    void this.focusActive();
  }

  private onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.gsap?.killTweensOf(this.motion);
    this.dragging = true;
    this.pointerId = event.pointerId;
    this.trackWidth = this.track.getBoundingClientRect().width;
    this.startPos = this.motion.pos;
    this.startX = event.clientX;
    this.lastX = event.clientX;
    this.lastT = event.timeStamp;
    this.velocity = 0;
    this.track.setPointerCapture(event.pointerId);
  }

  private onPointerMove(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) return;
    const drag = slotsFromPx(this.startX - event.clientX, this.trackWidth, MODES.length);
    this.motion.pos = clampPosition(this.startPos + drag, MODES.length);
    this.applyPosition();
    const dt = event.timeStamp - this.lastT;
    if (dt > 0) {
      const vSlots = slotsFromPx(this.lastX - event.clientX, this.trackWidth, MODES.length);
      this.velocity = (vSlots / dt) * 1000; // slots per second
    }
    this.lastX = event.clientX;
    this.lastT = event.timeStamp;
  }

  private onPointerUp(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.pointerId) return;
    this.dragging = false;
    this.track.releasePointerCapture(event.pointerId);
    const index = snapToNearest(this.motion.pos, this.velocity, MODES.length);
    this.goTo(index, this.reduced ? 0 : this.velocity);
  }

  private onWheel(event: WheelEvent): void {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (delta === 0) return;
    event.preventDefault();
    this.step(delta > 0 ? 1 : -1);
  }

  static override styles = css`
    :host {
      display: block;
      color: var(--ink);
      touch-action: pan-y;
      user-select: none;
    }
    .track {
      position: relative;
      display: flex;
      align-items: center;
      width: min(100%, 30rem);
      cursor: grab;
      padding-bottom: 0.7rem;
      touch-action: pan-y;
    }
    .track:active {
      cursor: grabbing;
    }
    .slot {
      flex: 1 1 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.3rem 0.2rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--ink-2);
      font-family: var(--font-mono);
      font-weight: var(--wght-label);
      font-size: 0.72rem;
      letter-spacing: var(--tracking-label);
      text-transform: uppercase;
      transition: color 0.3s ease;
    }
    .slot[aria-checked='true'],
    .slot:hover,
    .slot:focus-visible {
      color: var(--ink);
    }
    .slot:focus-visible {
      outline: 1px solid var(--ink);
      outline-offset: 3px;
    }
    .dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 100%;
      border: 1px solid currentColor;
      background-color: transparent;
      flex: none;
      transition: background-color 0.25s ease;
    }
    .slot[aria-checked='true'] .dot,
    .slot:hover .dot,
    .slot:focus-visible .dot {
      background-color: currentColor;
    }
    /* The marker underline glides between slots — GSAP drives --pos. */
    .marker {
      position: absolute;
      left: 0;
      bottom: 0;
      width: calc(100% / 4);
      height: var(--border-w, 2px);
      background-color: var(--spot, var(--ink));
      transform: translateX(calc(var(--pos, 0) * 100%));
    }
    @media (prefers-reduced-motion: reduce) {
      .marker {
        transition: transform 0.2s ease;
      }
      .slot {
        transition: none;
      }
    }
  `;

  override render() {
    return html`
      <div
        class="track"
        role="radiogroup"
        aria-label="Design mode"
        @keydown=${this.onKeydown}
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.onPointerUp}
        @wheel=${this.onWheel}
      >
        ${MODES.map((mode) => {
          const on = mode === this.active;
          return html`
            <button
              type="button"
              class="slot"
              role="radio"
              aria-checked=${on ? 'true' : 'false'}
              tabindex=${on ? '0' : '-1'}
              @click=${() => this.goTo(MODES.indexOf(mode))}
            >
              <span class="dot" data-on=${on ? 'true' : 'false'}></span>
              <span>${mode}</span>
            </button>
          `;
        })}
        <span class="marker" aria-hidden="true"></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mode-wheel': ModeWheel;
  }
}
