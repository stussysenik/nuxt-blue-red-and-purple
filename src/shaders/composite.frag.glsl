#version 300 es
precision highp float;

// Composite pass: crossfades two scene textures, layers interaction optics
// (touch aura + water ripples), applies a cinematic grade (chromatic
// aberration, filmic S-curve, vignette, rare heat-lightning pulses), and
// dithers (interleaved gradient noise) so pastel gradients never band.

uniform sampler2D u_texA;
uniform sampler2D u_texB;
uniform float u_mix;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;  // smoothed pointer, normalized, y-up
uniform float u_energy;  // interaction envelope 0..1
uniform vec3 u_ripples[6];  // touch ripples: xy origin (normalized, y-up), z age in s (<0 inactive)
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

  // Touch aura: gaussian falloff around the pointer drives a gentle
  // refraction pull, so interaction reads as a bloom of light, not a cursor.
  vec2 d = (uv - u_pointer) * vec2(aspect, 1.0);
  float aura = exp(-dot(d, d) * 9.0) * u_energy;
  vec2 suv = uv - d * vec2(1.0 / aspect, 1.0) * aura * 0.05;

  // Water ripples: damped expanding rings from touches refract the scene
  // like a disturbed surface, catching a soft crest light as they travel.
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

  // Lens: chromatic aberration growing quadratically toward the edges.
  vec2 c = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 caOff = c * dot(c, c) * 0.006;
  vec3 col = vec3(scene(suv + caOff).r, scene(suv).g, scene(suv - caOff).b);

  // Pastel lavender-pink lift under the aura and along ripple crests.
  col += aura * vec3(0.17, 0.11, 0.19) + ripLight * vec3(0.12, 0.09, 0.14);

  // Heat lightning: a rare soft double-pulse glow blooming near the top —
  // dramatic, never strobing (slow decay, small amplitude).
  float cycle = floor(u_time / 19.0);
  float since = fract(u_time / 19.0) * 19.0 - (4.0 + hash(vec2(cycle, 3.7)) * 12.0);
  if (since > 0.0) {  // exp() must never see a negative `since` — it overflows to inf/NaN
    float pulse = exp(-since * 7.0)
                + 0.6 * exp(-max(since - 0.28, 0.0) * 9.0) * step(0.28, since);
    vec2 fd = (uv - vec2(mix(0.2, 0.8, hash(vec2(cycle, 5.3))), 1.05)) * vec2(aspect, 1.0);
    col += vec3(0.86, 0.80, 1.0) * exp(-dot(fd, fd) * 2.2)
         * pulse * (0.35 + 0.65 * hash(vec2(cycle, 9.1))) * 0.22;
  }

  // Star glitter: a fixed sky of sparse points at two scales, each twinkling
  // on its own phase — texture that reads across every scene.
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

  // Shared grade: hold hues in the blue↔purple↔red band, soften extremes.
  col.g = min(col.g, mix(col.g, min(col.r, col.b), 0.35) + 0.10);

  // Cinematic finish: filmic S-curve, saturation lift, breathing vignette.
  col = mix(col, col * col * (3.0 - 2.0 * col), 0.30);
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, 1.12);
  float breathe = 0.16 + 0.02 * sin(u_time * 0.23);
  col *= 1.0 - breathe * smoothstep(0.35, 1.25, length(c));

  col = clamp(col, 0.06, 0.995);

  // Temporal IGN dither, ±0.75 LSB.
  float n = ign(gl_FragCoord.xy + fract(u_time) * vec2(23.14, 17.98)) - 0.5;
  col += n * (1.5 / 255.0);

  fragColor = vec4(col, 1.0);
}
