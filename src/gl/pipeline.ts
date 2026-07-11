import { createProgram } from './program';
import vertSource from '../shaders/fullscreen.vert.glsl?raw';
import compositeSource from '../shaders/composite.frag.glsl?raw';

interface SceneProgram {
  readonly program: WebGLProgram;
  readonly uTime: WebGLUniformLocation | null;
  readonly uResolution: WebGLUniformLocation | null;
}

interface Target {
  readonly fbo: WebGLFramebuffer;
  readonly tex: WebGLTexture;
  width: number;
  height: number;
}

function createTarget(gl: WebGL2RenderingContext): Target {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fbo, tex, width: 0, height: 0 };
}

function sizeTarget(gl: WebGL2RenderingContext, target: Target, width: number, height: number): void {
  if (target.width === width && target.height === height) return;
  gl.bindTexture(gl.TEXTURE_2D, target.tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  target.width = width;
  target.height = height;
}

/**
 * Scene-to-texture pipeline with a composite pass (crossfade + grade +
 * dither). `renderScale` shrinks the internal scene resolution for adaptive
 * quality; the composite always outputs at full canvas resolution.
 */
export function createPipeline(gl: WebGL2RenderingContext, sceneSources: readonly string[]) {
  const scenes: SceneProgram[] = sceneSources.map((fragSource) => {
    const program = createProgram(gl, vertSource, fragSource);
    return {
      program,
      uTime: gl.getUniformLocation(program, 'u_time'),
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
    };
  });

  const compositeProgram = createProgram(gl, vertSource, compositeSource);
  const composite = {
    program: compositeProgram,
    uTexA: gl.getUniformLocation(compositeProgram, 'u_texA'),
    uTexB: gl.getUniformLocation(compositeProgram, 'u_texB'),
    uMix: gl.getUniformLocation(compositeProgram, 'u_mix'),
    uTime: gl.getUniformLocation(compositeProgram, 'u_time'),
    uResolution: gl.getUniformLocation(compositeProgram, 'u_resolution'),
  };

  const targets = [createTarget(gl), createTarget(gl)] as const;
  gl.bindVertexArray(gl.createVertexArray());

  function drawScene(index: number, targetIndex: 0 | 1, time: number, width: number, height: number): void {
    const scene = scenes[index];
    const target = targets[targetIndex];
    if (!scene || !target) return;
    sizeTarget(gl, target, width, height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, width, height);
    gl.useProgram(scene.program);
    gl.uniform1f(scene.uTime, time);
    gl.uniform2f(scene.uResolution, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function drawComposite(mix: number, time: number, width: number, height: number): void {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.useProgram(composite.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, targets[0].tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, targets[1].tex);
    gl.uniform1i(composite.uTexA, 0);
    gl.uniform1i(composite.uTexB, mix > 0 ? 1 : 0);
    gl.uniform1f(composite.uMix, mix);
    gl.uniform1f(composite.uTime, time);
    gl.uniform2f(composite.uResolution, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  return { drawScene, drawComposite };
}
