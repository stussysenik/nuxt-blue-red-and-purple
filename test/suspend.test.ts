import { describe, it, expect } from 'vitest';
import { stepSuspend, initialSuspend, type SuspendState } from '../src/gl/suspend';

const enter = { type: 'mode', generative: true } as const;
const leave = { type: 'mode', generative: false } as const;
const show = { type: 'visibility', visible: true } as const;
const hide = { type: 'visibility', visible: false } as const;

// Fold a sequence of events from the initial state.
const run = (...events: Parameters<typeof stepSuspend>[1][]): SuspendState =>
  events.reduce(stepSuspend, initialSuspend);

describe('stepSuspend — lazy init (stays inert)', () => {
  it('starts inert and never initializes until generative + visible', () => {
    expect(initialSuspend.phase).toBe('inert');
    expect(run(leave).phase).toBe('inert');
    expect(run(hide).phase).toBe('inert');
  });

  it('does not initialize when entering generative on a hidden tab', () => {
    expect(run(hide, enter).phase).toBe('inert');
  });
});

describe('stepSuspend — run condition (active AND visible)', () => {
  it('runs only when generative mode is active and the tab is visible', () => {
    expect(run(enter).phase).toBe('running');
    expect(run(hide, enter, show).phase).toBe('running');
  });
});

describe('stepSuspend — suspend, never tear down', () => {
  it('suspends when the tab hides mid-run and resumes on show', () => {
    expect(run(enter, hide).phase).toBe('suspended');
    expect(run(enter, hide, show).phase).toBe('running');
  });

  it('suspends when leaving generative mode and resumes on re-entry', () => {
    expect(run(enter, leave).phase).toBe('suspended');
    expect(run(enter, leave, enter).phase).toBe('running');
  });

  it('once initialized, an inactive+hidden state suspends rather than reverting to inert', () => {
    expect(run(enter, leave, hide).phase).toBe('suspended');
  });

  it('stays suspended when re-entering generative while hidden', () => {
    expect(run(enter, hide, leave, enter).phase).toBe('suspended');
  });
});

describe('stepSuspend — tracks both inputs regardless of event kind', () => {
  it('carries the untouched dimension through each event', () => {
    const s = run(enter, hide);
    expect(s).toEqual({ modeActive: true, visible: false, phase: 'suspended' });
  });
});
