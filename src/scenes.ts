import commonSource from './shaders/common.glsl?raw';
import thinFilmBody from './shaders/scenes/thin-film.glsl?raw';
import flakeBody from './shaders/scenes/flake.glsl?raw';
import anisoBody from './shaders/scenes/aniso.glsl?raw';
import oceanBody from './shaders/scenes/ocean.glsl?raw';
import lifeBody from './shaders/scenes/life.glsl?raw';
import signalBody from './shaders/scenes/signal.glsl?raw';

export interface Scene {
  readonly id: string;
  readonly fragSource: string;
  /** Seconds this scene holds before transitioning to the next. */
  readonly duration: number;
}

const PRELUDE = `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;
`;

const assemble = (body: string): string => PRELUDE + commonSource + body;

// Flake leads: it is the loading default. Short holds keep the loop lively —
// a new scene is always seconds away (tap/swipe skips ahead anytime).
export const SCENES: readonly Scene[] = [
  // { id: 'flake', fragSource: assemble(flakeBody), duration: 11 },
  // { id: 'ocean', fragSource: assemble(oceanBody), duration: 10 },
  // { id: 'signal', fragSource: assemble(signalBody), duration: 11 },
  { id: 'life', fragSource: assemble(lifeBody), duration: 12 },
  // { id: 'thin-film', fragSource: assemble(thinFilmBody), duration: 10 },
  // { id: 'aniso', fragSource: assemble(anisoBody), duration: 11 },
];
