#version 300 es
precision highp float;

// Composite pass: crossfades two scene textures, applies the shared brand
// grade, and dithers (interleaved gradient noise — blue-noise-like spectrum)
// so pastel gradients never band on 8-bit displays.

uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform float u_mix;
uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;

float ign(vec2 p) {
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 a = texture(u_texA, uv).rgb;
  vec3 b = texture(u_texB, uv).rgb;
  vec3 col = mix(a, b, u_mix);

  // Shared grade: hold hues in the blue↔purple↔red band, soften extremes.
  col.g = min(col.g, mix(col.g, min(col.r, col.b), 0.35) + 0.10);
  col = clamp(col, 0.06, 0.995);

  // Temporal IGN dither, ±0.75 LSB.
  float n = ign(gl_FragCoord.xy + fract(u_time) * vec2(23.14, 17.98)) - 0.5;
  col += n * (1.5 / 255.0);

  fragColor = vec4(col, 1.0);
}
