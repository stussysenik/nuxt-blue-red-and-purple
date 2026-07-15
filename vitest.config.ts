import { defineConfig } from 'vitest/config';

// Unit is the primary, cheap channel (SPEC §5): reducer truth table, layer
// resolution, wheel snap math, works schema, and the color-law hue guard.
// Real suites arrive in Milestone 2; passWithNoTests keeps M1 green.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
    passWithNoTests: true,
  },
});
