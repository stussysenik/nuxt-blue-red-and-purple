// Scene — signal. Stacked oscilloscope traces: additive sine harmonics
// (audio-style synthesis) flow leftward through time; each trace renders as
// a sharp beam core inside a soft phosphor halo, and a bright pulse races
// down the wire like a spark. Engineering, wavelength, and the passing of
// time — in the pastel band.

void main() {
  vec2 uv = sceneUv();
  float t = u_time;

  vec3 col = mix(vec3(0.50, 0.53, 0.86), vec3(0.62, 0.50, 0.82), fbm(uv * 0.4 + t * 0.01));

  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float row = -0.66 + fi * 0.44;
    float x = uv.x + t * (0.12 + fi * 0.03);
    float w = sin(x * 3.1 + fi * 4.7) * 0.5
            + sin(x * 7.3 - t * 0.6 + fi * 2.3) * 0.25
            + sin(x * 13.7 + t * 0.4) * 0.12 * (0.5 + vnoise(vec2(x * 2.0, fi * 9.3)));
    w *= 0.16;
    float d = abs(uv.y - row - w);
    float core = exp(-d * d * 2600.0);
    float halo = exp(-d * d * 240.0) * 0.35;
    float phase = fract(x * 0.14 - t * 0.16 + fi * 0.37);
    float pulse = exp(-pow(phase * 7.0, 2.0)) * 1.6;
    vec3 beam = mix(vec3(0.95, 0.88, 1.0), vec3(1.0, 0.80, 0.88), fi / 3.0);
    col += beam * (core * (0.55 + pulse) + halo);
  }

  col *= 1.0 - 0.10 * dot(uv * 0.5, uv * 0.5);
  fragColor = vec4(col, 1.0);
}
