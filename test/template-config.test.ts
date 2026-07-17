// template-config contract — the schema is the future order object, so its
// guarantees (closed axes, empty diff at defaults, round-trip) are pinned here.
// Compile-time closedness is guaranteed by TypeScript; these tests cover the
// runtime validator and the diff helpers.

import { describe, it, expect } from 'vitest';
import {
  AXES,
  DEFAULTS,
  isTemplateConfig,
  diffFromDefaults,
  fromDiff,
  type TemplateConfig,
} from '../src/config/template-config';

describe('template-config', () => {
  it('defaults are a valid config', () => {
    expect(isTemplateConfig(DEFAULTS)).toBe(true);
  });

  it('every axis is a non-empty closed vocabulary', () => {
    for (const values of Object.values(AXES) as readonly (readonly unknown[])[]) {
      expect(values.length).toBeGreaterThan(0);
      // no duplicates — each vocabulary is a set
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it('accepts a fully-specified legal config', () => {
    const config: TemplateConfig = {
      skin: 'brutal',
      theme: 'dark',
      font: 'archivo',
      scale: 1.25,
      images: 'client',
      copy: 'client',
    };
    expect(isTemplateConfig(config)).toBe(true);
  });

  describe('illegal configs are rejected at runtime', () => {
    it('rejects an out-of-enum skin', () => {
      expect(isTemplateConfig({ ...DEFAULTS, skin: 'neon' })).toBe(false);
    });

    it('rejects an off-step scale', () => {
      expect(isTemplateConfig({ ...DEFAULTS, scale: 1.07 })).toBe(false);
    });

    it('rejects a config missing an axis', () => {
      const { copy: _omitted, ...partial } = DEFAULTS;
      expect(isTemplateConfig(partial)).toBe(false);
    });

    it('rejects non-objects', () => {
      expect(isTemplateConfig(null)).toBe(false);
      expect(isTemplateConfig('essential')).toBe(false);
      expect(isTemplateConfig(undefined)).toBe(false);
    });
  });

  describe('diffFromDefaults', () => {
    it('is empty for the pristine base template', () => {
      expect(diffFromDefaults(DEFAULTS)).toEqual({});
    });

    it('returns exactly the changed axes', () => {
      const config: TemplateConfig = { ...DEFAULTS, skin: 'clay', theme: 'dark' };
      expect(diffFromDefaults(config)).toEqual({ skin: 'clay', theme: 'dark' });
    });

    it('round-trips through fromDiff', () => {
      const config: TemplateConfig = { ...DEFAULTS, scale: 1.1, images: 'client' };
      expect(fromDiff(diffFromDefaults(config))).toEqual(config);
    });
  });
});
