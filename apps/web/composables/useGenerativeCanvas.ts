import { onMounted, onUnmounted } from 'vue';

const MAX_DPR = 2;

function initCanvas(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  resize();
  window.addEventListener('resize', resize);

  return { gl, canvas, size: () => ({ width: canvas.width, height: canvas.height }) };
}

function destroyCanvas(canvas: HTMLCanvasElement) {
  canvas.remove();
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('shader allocation failed');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown error';
    gl.deleteShader(shader);
    throw new Error(`shader compile failed:\n${log}`);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertSrc: string, fragSrc: string) {
  const program = gl.createProgram();
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!program) throw new Error('program allocation failed');
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? 'unknown error';
    gl.deleteProgram(program);
    throw new Error(`program link failed:\n${log}`);
  }
  return program;
}

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const COMPOSITE_FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform float u_mix;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_energy;
uniform vec3 u_ripples[6];
uniform float u_duotone;
uniform vec3 u_shadow;
uniform vec3 u_highlight;
out vec4 fragColor;

float ign(vec2 p) {
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec3 scene(vec2 uv) {
  return mix(texture(u_texA, uv).rgb, texture(u_texB, uv).rgb, u_mix);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;

  vec2 d = (uv - u_pointer) * vec2(aspect, 1.0);
  float aura = exp(-dot(d, d) * 9.0) * u_energy;
  vec2 suv = uv - d * vec2(1.0 / aspect, 1.0) * aura * 0.05;

  float ripLight = 0.0;
  for (int i = 0; i < 6; i++) {
    vec3 r = u_ripples[i];
    if (r.z < 0.0) continue;
    vec2 q = (uv - r.xy) * vec2(aspect, 1.0);
    float dist = max(length(q), 1e-4);
    float ring = dist - r.z * 0.30;
    float amp = exp(-r.z * 1.5) * exp(-ring * ring * 90.0);
    suv += (q / dist) * sin(ring * 36.0) * amp * 0.014 * vec2(1.0 / aspect, 1.0);
    ripLight += amp;
  }

  suv += (u_pointer - 0.5) * 0.008;

  vec2 c = (uv - 0.5) * vec2(aspect, 1.0);
  vec3 col = scene(suv);

  col += aura * vec3(0.17, 0.11, 0.19) + ripLight * vec3(0.12, 0.09, 0.14);

  float cycle = floor(u_time / 9.0);
  float since = fract(u_time / 9.0) * 9.0 - (2.0 + hash(vec2(cycle, 3.7)) * 5.0);
  if (since > 0.0) {
    float strokes = 0.0;
    for (int k = 0; k < 3; k++) {
      float kf = float(k);
      float t = since - kf * (0.045 + hash(vec2(cycle, 12.0 + kf)) * 0.035);
      strokes += step(0.0, t) * exp(-max(t, 0.0) * 70.0)
               * (0.45 + 0.55 * hash(vec2(cycle, 21.0 + kf)));
    }
    float after = exp(-since * 9.0);
    vec2 fd = (uv - vec2(mix(0.2, 0.8, hash(vec2(cycle, 5.3))), 1.02)) * vec2(aspect, 1.0);
    float hot = exp(-dot(fd, fd) * 6.0);
    col += vec3(0.86, 0.82, 1.0) * (hot * strokes * 0.5 + strokes * 0.09 + hot * after * 0.07);
  }

  float star = 0.0;
  for (int s = 0; s < 2; s++) {
    float scale = s == 0 ? 60.0 : 130.0;
    vec2 g = (uv * vec2(aspect, 1.0) + float(s) * 3.1) * scale;
    vec2 id = floor(g);
    vec2 cell = fract(g) - 0.5;
    float sel = hash(id);
    float tw = 0.5 + 0.5 * sin(u_time * (0.6 + sel * 1.8) + sel * 40.0);
    star += step(0.965, sel) * smoothstep(0.28, 0.02, length(cell)) * tw * (s == 0 ? 1.0 : 0.6);
  }
  col += star * vec3(0.90, 0.87, 1.0) * 0.16;

  col.g = min(col.g, mix(col.g, min(col.r, col.b), 0.35) + 0.10);

  col = mix(col, col * col * (3.0 - 2.0 * col), 0.30);
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, 1.06);
  float breathe = 0.16 + 0.02 * sin(u_time * 0.23);
  col *= 1.0 - breathe * smoothstep(0.35, 1.25, length(c));

  if (u_duotone > 0.5) {
    float g = dot(clamp(col, 0.0, 1.0), vec3(0.2126, 0.7152, 0.0722));
    col = mix(u_shadow, u_highlight, g);
  }

  col = clamp(col, 0.06, 0.995);

  float n = ign(gl_FragCoord.xy + fract(u_time) * vec2(23.14, 17.98)) - 0.5;
  col += n * (1.5 / 255.0);

  fragColor = vec4(col, 1.0);
}
`;

function createRenderTarget(gl: WebGL2RenderingContext) {
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

function resizeTarget(gl: WebGL2RenderingContext, target: { tex: WebGLTexture; fbo: WebGLFramebuffer; width: number; height: number }, w: number, h: number) {
  if (target.width === w && target.height === h) return;
  gl.bindTexture(gl.TEXTURE_2D, target.tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  target.width = w;
  target.height = h;
}

function createPipeline(gl: WebGL2RenderingContext, sceneFrags: string[]) {
  const scenePrograms = sceneFrags.map((frag) => {
    const program = createProgram(gl, VERTEX_SHADER, frag);
    return {
      program,
      uTime: gl.getUniformLocation(program, 'u_time'),
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
      uLife: gl.getUniformLocation(program, 'u_life'),
    };
  });

  const compositeProgram = createProgram(gl, VERTEX_SHADER, COMPOSITE_FRAGMENT);
  const composite = {
    program: compositeProgram,
    uTexA: gl.getUniformLocation(compositeProgram, 'u_texA'),
    uTexB: gl.getUniformLocation(compositeProgram, 'u_texB'),
    uMix: gl.getUniformLocation(compositeProgram, 'u_mix'),
    uTime: gl.getUniformLocation(compositeProgram, 'u_time'),
    uResolution: gl.getUniformLocation(compositeProgram, 'u_resolution'),
    uPointer: gl.getUniformLocation(compositeProgram, 'u_pointer'),
    uEnergy: gl.getUniformLocation(compositeProgram, 'u_energy'),
    uRipples: gl.getUniformLocation(compositeProgram, 'u_ripples[0]'),
    uDuotone: gl.getUniformLocation(compositeProgram, 'u_duotone'),
    uShadow: gl.getUniformLocation(compositeProgram, 'u_shadow'),
    uHighlight: gl.getUniformLocation(compositeProgram, 'u_highlight'),
  };

  const targets = [createRenderTarget(gl), createRenderTarget(gl)];
  gl.bindVertexArray(gl.createVertexArray());

  function drawScene(sceneIdx: number, targetIdx: number, time: number, w: number, h: number, lifeTex: WebGLTexture | null) {
    const prog = scenePrograms[sceneIdx];
    const target = targets[targetIdx];
    if (!prog || !target) return;

    resizeTarget(gl, target, w, h);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, w, h);
    gl.useProgram(prog.program);
    gl.uniform1f(prog.uTime, time);
    gl.uniform2f(prog.uResolution, w, h);
    if (prog.uLife && lifeTex) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, lifeTex);
      gl.uniform1i(prog.uLife, 2);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function drawComposite(mix: number, time: number, w: number, h: number, pointer: { x: number; y: number; energy: number; ripples: Float32Array }, duotone: boolean, shadow: number[], highlight: number[]) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.useProgram(composite.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, targets[0].tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, targets[1].tex);
    gl.uniform1i(composite.uTexA, 0);
    gl.uniform1i(composite.uTexB, mix > 0 ? 1 : 0);
    gl.uniform1f(composite.uMix, mix);
    gl.uniform1f(composite.uTime, time);
    gl.uniform2f(composite.uResolution, w, h);
    gl.uniform2f(composite.uPointer, pointer.x, pointer.y);
    gl.uniform1f(composite.uEnergy, pointer.energy);
    gl.uniform3fv(composite.uRipples, pointer.ripples);
    gl.uniform1f(composite.uDuotone, duotone ? 1 : 0);
    if (duotone) {
      gl.uniform3f(composite.uShadow, shadow[0], shadow[1], shadow[2]);
      gl.uniform3f(composite.uHighlight, highlight[0], highlight[1], highlight[2]);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  return { drawScene, drawComposite };
}

const LIFE_FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D u_state;
uniform vec2 u_cells;
uniform float u_tick;
uniform float u_seed;
uniform vec2 u_pointer;
uniform float u_energy;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 uv = gl_FragCoord.xy / u_cells;

  if (u_seed > 0.5) {
    float a = step(0.78, hash(cell + 13.1));
    fragColor = vec4(a, a, 0.0, 1.0);
    return;
  }

  vec4 prev = texture(u_state, uv);
  int n = 0;
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) continue;
      n += int(texture(u_state, uv + vec2(dx, dy) / u_cells).r + 0.5);
    }
  }
  bool alive = prev.r > 0.5;
  float next = (alive ? (n == 2 || n == 3) : (n == 3)) ? 1.0 : 0.0;

  float pd = length((uv - u_pointer) * vec2(u_cells.x / u_cells.y, 1.0));
  if (u_energy > 0.2 && pd < 0.08 && hash(cell + u_tick * 7.31) > 0.55) next = 1.0;

  if (hash(cell + u_tick * 3.77) > 0.9995) next = 1.0;

  float trail = max(next, prev.g * 0.93);
  fragColor = vec4(next, trail, 0.0, 1.0);
}
`;

const LIFE_GRID = 144;
const LIFE_STEP = 1 / 8;

function createLifeSimulation(gl: WebGL2RenderingContext) {
  const program = createProgram(gl, VERTEX_SHADER, LIFE_FRAGMENT);
  const uState = gl.getUniformLocation(program, 'u_state');
  const uCells = gl.getUniformLocation(program, 'u_cells');
  const uTick = gl.getUniformLocation(program, 'u_tick');
  const uSeed = gl.getUniformLocation(program, 'u_seed');
  const uPointer = gl.getUniformLocation(program, 'u_pointer');
  const uEnergy = gl.getUniformLocation(program, 'u_energy');

  const createTarget = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, LIFE_GRID, LIFE_GRID, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  };

  let targetA = createTarget();
  let targetB = createTarget();
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  let accumulator = LIFE_STEP;
  let tick = 0;
  let seeded = false;

  function step(pointerX: number, pointerY: number, energy: number) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, targetB.fbo);
    gl.viewport(0, 0, LIFE_GRID, LIFE_GRID);
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, targetA.tex);
    gl.uniform1i(uState, 2);
    gl.uniform2f(uCells, LIFE_GRID, LIFE_GRID);
    gl.uniform1f(uTick, tick);
    gl.uniform1f(uSeed, seeded ? 0 : 1);
    gl.uniform2f(uPointer, pointerX, pointerY);
    gl.uniform1f(uEnergy, energy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    seeded = true;
    tick += 1;
    const tmp = targetA;
    targetA = targetB;
    targetB = tmp;
  }

  return {
    step(dt: number, px: number, py: number, energy: number) {
      accumulator = Math.min(accumulator + dt, LIFE_STEP * 4);
      while (accumulator >= LIFE_STEP) {
        accumulator -= LIFE_STEP;
        step(px, py, energy);
      }
    },
    texture: () => targetA.tex,
  };
}

const SCENE_CROSSFADE_DURATION = 1.8;

function createDirector(durations: number[]) {
  let current = 0;
  let next: number | null = null;
  let elapsed = 0;

  return {
    update(dt: number) {
      elapsed += dt;
      const dur = durations[current] ?? 20;
      if (next === null && elapsed >= dur) {
        next = (current + 1) % durations.length;
        elapsed = dur;
      }
      let mix = 0;
      if (next !== null) {
        const t = Math.min((elapsed - dur) / SCENE_CROSSFADE_DURATION, 1);
        mix = t * t * t * (t * (t * 6 - 15) + 10);
        if (t >= 1) {
          current = next;
          next = null;
          elapsed = 0;
          mix = 0;
        }
      }
      return { active: current, next, mix };
    },
    skip() {
      if (next === null) {
        next = (current + 1) % durations.length;
        elapsed = Math.max(elapsed, durations[current] ?? 20);
      }
    },
  };
}

const NOISE_PREAMBLE = `// Shared noise + palette helpers, prepended to every scene shader.

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * vnoise(p);
    p = p * 2.03 + 11.7;
    amp *= 0.5;
  }
  return v;
}

vec2 sceneUv() {
  return (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
}
`;

const SCENE_PREFIX = `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;
`;

function makeSceneShader(fragBody: string) {
  return SCENE_PREFIX + NOISE_PREAMBLE + fragBody;
}

const SCENE_LIFE = `uniform sampler2D u_life;

void main() {
  vec2 uv = sceneUv();
  float t = u_time;

  float m = fbm(uv * 0.3 + t * 0.012);
  vec3 col = mix(vec3(0.50, 0.54, 0.87), vec3(0.66, 0.50, 0.80), m);

  vec2 lifeUv = uv * 0.15 + 0.5 + t * vec2(0.004, 0.002);
  lifeUv += (vec2(fbm(uv * 1.1 + t * 0.02), fbm(uv * 1.1 - t * 0.02 + 3.7)) - 0.5) * 0.012;
  vec2 s = texture(u_life, lifeUv).rg;

  col = mix(col, vec3(0.72, 0.58, 0.92), smoothstep(0.05, 0.8, s.g) * 0.45);
  float core = smoothstep(0.30, 0.85, s.r) * (0.80 + 0.20 * sin(t * 1.7));
  col = mix(col, vec3(0.99, 0.90, 0.96), core * 0.75);

  col += (vnoise(gl_FragCoord.xy * 0.45) - 0.5) * 0.03;
  col *= 1.0 - 0.10 * dot(uv * 0.5, uv * 0.5);
  fragColor = vec4(col, 1.0);
}
`;

const SCENES = [
  { id: 'life', fragSource: makeSceneShader(SCENE_LIFE), duration: 12 },
];

const STATE = { modeActive: false, visible: true, phase: 'inert' as 'inert' | 'running' | 'suspended' };

function transition(state: typeof STATE, event: { type: string; generative?: boolean; visible?: boolean }) {
  const modeActive = event.type === 'mode' ? event.generative! : state.modeActive;
  const visible = event.type === 'visibility' ? event.visible! : state.visible;
  const phase = modeActive && visible ? 'running' : state.phase === 'inert' ? 'inert' : 'suspended';
  return { modeActive, visible, phase };
}

const pointer = { x: 0.5, y: 0.5, energy: 0, ripples: new Float32Array(18).fill(-1) };

const SEED_STEPS = 28;
const SEED_INTERVAL = 8;

export function useGenerativeCanvas() {
  let ctx: { gl: WebGL2RenderingContext; canvas: HTMLCanvasElement; size: () => { width: number; height: number } } | null = null;
  let pipeline: ReturnType<typeof createPipeline> | null = null;
  let life: ReturnType<typeof createLifeSimulation> | null = null;
  let director: ReturnType<typeof createDirector> | null = null;
  let sceneTimes: number[] = [];
  let rafId = 0;
  let lastTime = 0;
  let elapsed = 0;
  let state = { ...STATE };
  let duotone = { shadow: [0, 0, 0], highlight: [1, 1, 1] };
  let seeded = false;
  let reducedMotion = false;

  function getColor(varName: string, canvas: HTMLCanvasElement): number[] {
    canvas.style.color = `var(${varName})`;
    const color = getComputedStyle(canvas).color.match(/\d+/g);
    canvas.style.color = '';
    if (!color || color.length < 3) return [0, 0, 0];
    return [Number(color[0]) / 255, Number(color[1]) / 255, Number(color[2]) / 255];
  }

  function getDuotone() {
    return {
      shadow: getColor('--duotone-shadow', ctx!.canvas),
      highlight: getColor('--duotone-highlight', ctx!.canvas),
    };
  }

  function init(canvas: HTMLCanvasElement) {
    reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    canvas.addEventListener('webglcontextlost', () => destroyCanvas(canvas));

    const mode = document.documentElement.dataset.mode;
    const theme = document.documentElement.dataset.theme;
    state = { ...STATE, modeActive: mode === 'generative', phase: mode === 'generative' ? 'running' : 'inert' };

    if (state.modeActive) {
      start(canvas);
    }
  }

  function start(canvas: HTMLCanvasElement) {
    if (ctx) return true;
    if (reducedMotion) {
      renderStatic(canvas);
      return true;
    }

    const result = initCanvas(canvas);
    if (!result) {
      destroyCanvas(canvas);
      return false;
    }

    ctx = result;
    pipeline = createPipeline(result.gl, SCENES.map((s) => s.fragSource));
    life = createLifeSimulation(result.gl);
    director = createDirector(SCENES.map((s) => s.duration));
    sceneTimes = SCENES.map((_, i) => i * 7.3);
    duotone = getDuotone();

    rafId = requestAnimationFrame(tick);
    return true;
  }

  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function tick(now: number) {
    if (!ctx || !pipeline || !life || !director) return;

    const dt = lastTime === 0 ? 0 : Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    elapsed += dt;

    life.step(dt, pointer.x, pointer.y, pointer.energy);
    const d = director.update(dt);
    sceneTimes[d.active] = (sceneTimes[d.active] ?? 0) + dt;
    if (d.next !== null) {
      sceneTimes[d.next] = (sceneTimes[d.next] ?? 0) + dt;
    }

    const { width, height } = ctx.size();
    pipeline.drawScene(d.active, 0, sceneTimes[d.active] ?? 0, width, height, life.texture());
    if (d.next !== null) {
      pipeline.drawScene(d.next, 1, sceneTimes[d.next] ?? 0, width, height, life.texture());
    }
    pipeline.drawComposite(d.mix, elapsed, width, height, pointer, true, duotone.shadow, duotone.highlight);

    rafId = requestAnimationFrame(tick);
  }

  function renderStatic(canvas: HTMLCanvasElement) {
    const result = initCanvas(canvas);
    if (!result) return;
    ctx = result;
    pipeline = createPipeline(result.gl, SCENES.map((s) => s.fragSource));
    life = createLifeSimulation(result.gl);
    director = createDirector(SCENES.map((s) => s.duration));
    sceneTimes = SCENES.map(() => 0);
    duotone = getDuotone();

    if (life) {
      for (let i = 0; i < SEED_STEPS; i++) {
        life.step(1 / 8, pointer.x, pointer.y, pointer.energy);
      }
      seeded = true;
    }

    const { width, height } = result.size();
    const d = director!;
    pipeline!.drawScene(d.active, 0, SEED_INTERVAL, width, height, life!.texture());
    pipeline!.drawComposite(0, SEED_INTERVAL, width, height, pointer, true, duotone.shadow, duotone.highlight);
  }

  function handleModeChange(mode: string) {
    const wasActive = state.modeActive;
    const nowActive = mode === 'generative';
    if (nowActive === wasActive) return;

    state.modeActive = nowActive;
    if (nowActive) {
      const canvas = document.getElementById('gen-canvas') as HTMLCanvasElement;
      if (canvas) {
        start(canvas);
      }
    } else {
      stop();
    }
  }

  function handleThemeChange() {
    if (!ctx || !state.modeActive) return;
    duotone = getDuotone();
    if (reducedMotion) {
      const canvas = document.getElementById('gen-canvas') as HTMLCanvasElement;
      if (canvas) renderStatic(canvas);
    }
  }

  onMounted(() => {
    const canvas = document.getElementById('gen-canvas') as HTMLCanvasElement;
    if (canvas) {
      init(canvas);
    }

    // Watch for mode changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-mode') {
          handleModeChange(document.documentElement.dataset.mode || 'generative');
        }
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          handleThemeChange();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
      } else if (state.modeActive) {
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
      }
    });
  });

  onUnmounted(() => {
    stop();
  });
}
