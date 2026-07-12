#version 300 es
precision highp float;

// One Conway Game of Life generation on a toroidal grid (REPEAT-wrapped
// texture). R = alive, G = phosphor trail. Touches inject live cells; a tiny
// stochastic birth rate keeps the colony from ever settling into stillness.

uniform sampler2D u_state;
uniform vec2 u_cells;    // grid dimensions
uniform float u_tick;    // generation counter (drives per-tick randomness)
uniform float u_seed;    // >0.5: (re)seed from hash instead of stepping
uniform vec2 u_pointer;  // normalized, y-up
uniform float u_energy;  // interaction envelope 0..1
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

  // Touch breathes life into the neighborhood under the finger.
  float pd = length((uv - u_pointer) * vec2(u_cells.x / u_cells.y, 1.0));
  if (u_energy > 0.2 && pd < 0.08 && hash(cell + u_tick * 7.31) > 0.55) next = 1.0;

  // Sparse spontaneous births — the automaton never goes extinct or static.
  if (hash(cell + u_tick * 3.77) > 0.9995) next = 1.0;

  float trail = max(next, prev.g * 0.93);
  fragColor = vec4(next, trail, 0.0, 1.0);
}
