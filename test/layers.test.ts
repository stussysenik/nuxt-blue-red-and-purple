import { describe, it, expect } from 'vitest';
import { resolveLayer, type Layer } from '../src/state/layers';
import { MODES } from '../src/state/store';

const LAYERS: readonly Layer[] = ['pinned', 'themed'];

describe('resolveLayer — full layer × mode matrix', () => {
  it('every layer is visible in every mode', () => {
    for (const layer of LAYERS) {
      for (const mode of MODES) {
        expect(resolveLayer(layer, mode).visible).toBe(true);
      }
    }
  });

  it('themed is re-skinned by every mode; pinned never is', () => {
    for (const mode of MODES) {
      expect(resolveLayer('themed', mode).reskinned).toBe(true);
      expect(resolveLayer('pinned', mode).reskinned).toBe(false);
    }
  });

  it('overCanvas is true exactly in generative mode, for both layers', () => {
    for (const layer of LAYERS) {
      for (const mode of MODES) {
        expect(resolveLayer(layer, mode).overCanvas).toBe(mode === 'generative');
      }
    }
  });
});
