// Layer truth table (SPEC §1.2). Every component declares a layer; rendering is
// a pure function of (layer, mode): render(el, mode) = truthTable[layer][mode].
import type { Mode } from './store';

export type Layer = 'pinned' | 'themed';

export interface Resolution {
  /** Pinned elements are always visible; themed are too, but re-skinned. */
  readonly visible: boolean;
  /** True when the active mode re-skins the element (themed only). */
  readonly reskinned: boolean;
  /** True when the element renders over the live shader (generative mode). */
  readonly overCanvas: boolean;
}

/**
 * Resolve how an element renders. Pinned chrome (wordmark, wheel, index
 * trigger, theme toggle) stays structurally constant and always legible across
 * all four modes; themed content is fully re-skinned. In generative mode both
 * layers render above the shader canvas.
 */
export function resolveLayer(layer: Layer, mode: Mode): Resolution {
  return {
    visible: true,
    reskinned: layer === 'themed',
    overCanvas: mode === 'generative',
  };
}
