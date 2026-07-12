// Scene — pastel ocean. A sum of rotated directional waves (Gerstner-style
// superposition) gives a height field; its analytic-ish gradient yields a
// surface normal for Lambert diffuse + Blinn specular, so the light behaves
// like light on water. Graded into the blue/purple/red band.

float swell(vec2 p, float t) {
  float h = 0.0;
  float amp = 0.5;
  vec2 dir = normalize(vec2(0.8, 0.6));
  for (int i = 0; i < 4; i++) {
    float k = 2.2 + float(i) * 1.7;                  // wavenumber per octave
    float w = sqrt(k) * 0.42;                        // deep-water dispersion ω ∝ √k
    float phase = dot(p, dir) * k - t * w;
    h += (sin(phase) * 0.5 + 0.5) * amp;
    dir = vec2(dir.x * 0.54 - dir.y * 0.84, dir.x * 0.84 + dir.y * 0.54);
    amp *= 0.55;
  }
  return h / 1.6;
}

void main() {
  vec2 uv = sceneUv();
  float t = u_time;

  // fbm-warped domain keeps the swell from reading as parallel stripes.
  vec2 warp = vec2(fbm(uv * 0.9 + t * 0.03), fbm(uv * 0.9 - t * 0.025 + 5.2));
  vec2 p = uv + (warp - 0.5) * 0.55;
  float h = swell(p, t);

  // Normal from central differences of the height field.
  float e = 0.02;
  float hx = swell(p + vec2(e, 0.0), t) - h;
  float hy = swell(p + vec2(0.0, e), t) - h;
  vec3 nrm = normalize(vec3(-hx / e * 0.35, -hy / e * 0.35, 1.0));
  vec3 light = normalize(vec3(cos(t * 0.1) * 0.5, 0.6, 0.75));
  float diff = max(dot(nrm, light), 0.0);
  float spec = pow(max(dot(reflect(-light, nrm), vec3(0.0, 0.0, 1.0)), 0.0), 24.0);

  // Depth palette: deep blue troughs → lavender mid → pink-lit crests.
  vec3 col = mix(vec3(0.44, 0.50, 0.86), vec3(0.66, 0.55, 0.86), smoothstep(0.15, 0.7, h));
  col = mix(col, vec3(0.93, 0.66, 0.76), smoothstep(0.68, 0.95, h) * 0.8);
  col += diff * 0.10;
  col += spec * vec3(0.90, 0.85, 0.95) * 0.35;

  // Foam shimmer riding the crests.
  float foam = smoothstep(0.78, 0.95, h) * smoothstep(0.55, 0.9, vnoise(uv * 26.0 + t * 0.35));
  col = mix(col, vec3(0.98, 0.95, 1.0), foam * 0.5);

  col *= 1.0 - 0.10 * dot(uv * 0.5, uv * 0.5);
  fragColor = vec4(col, 1.0);
}
