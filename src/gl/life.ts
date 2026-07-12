import { createProgram } from './program';
import vertSource from '../shaders/fullscreen.vert.glsl?raw';
import stepSource from '../shaders/life-step.frag.glsl?raw';

const CELLS = 144;
const TICK_SECONDS = 1 / 8;

/**
 * Ping-pong Game of Life simulation on a small REPEAT-wrapped RGBA8 grid.
 * `step` accumulates dt and advances whole generations at a fixed cadence;
 * `texture` exposes the current state for scene shaders.
 */
export function createLife(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, vertSource, stepSource);
  const uState = gl.getUniformLocation(program, 'u_state');
  const uCells = gl.getUniformLocation(program, 'u_cells');
  const uTick = gl.getUniformLocation(program, 'u_tick');
  const uSeed = gl.getUniformLocation(program, 'u_seed');
  const uPointer = gl.getUniformLocation(program, 'u_pointer');
  const uEnergy = gl.getUniformLocation(program, 'u_energy');

  const make = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, CELLS, CELLS, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  };
  let front = make();
  let back = make();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  let pending = TICK_SECONDS; // run the seed pass on the first frame
  let tick = 0;
  let seeded = false;

  function generation(px: number, py: number, energy: number): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, back.fbo);
    gl.viewport(0, 0, CELLS, CELLS);
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, front.tex);
    gl.uniform1i(uState, 2);
    gl.uniform2f(uCells, CELLS, CELLS);
    gl.uniform1f(uTick, tick);
    gl.uniform1f(uSeed, seeded ? 0 : 1);
    gl.uniform2f(uPointer, px, py);
    gl.uniform1f(uEnergy, energy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    seeded = true;
    tick += 1;
    const swap = front;
    front = back;
    back = swap;
  }

  return {
    step(dt: number, px: number, py: number, energy: number): void {
      pending = Math.min(pending + dt, TICK_SECONDS * 4);
      while (pending >= TICK_SECONDS) {
        pending -= TICK_SECONDS;
        generation(px, py, energy);
      }
    },
    texture: () => front.tex,
  };
}
