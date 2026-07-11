// Scene — thin-film interference (iridescent clearcoat).
// Reflectance per RGB wavelength from optical path difference 2·n·d·cosθ,
// graded into the pastel blue/red/purple band.

float height(vec2 p, float t) {
  vec2 q = vec2(fbm(p + t * 0.04), fbm(p + vec2(5.2, 1.3) - t * 0.03));
  return fbm(p + 2.2 * q + vec2(t * 0.02, 0.0));
}

void main() {
  vec2 uv = sceneUv();
  float t = u_time;
  vec2 p = uv * 0.85;

  // Surface normal from the height field, softened to gentle swells.
  float e = 0.04;
  float h = height(p, t);
  float hx = height(p + vec2(e, 0.0), t);
  float hy = height(p + vec2(0.0, e), t);
  vec3 n = normalize(vec3((h - hx) / e * 0.35, (h - hy) / e * 0.35, 1.0));

  vec3 view = normalize(vec3(uv * 0.25, 1.0));
  float cosTheta = clamp(dot(n, view), 0.0, 1.0);
  float thickness = 380.0 + 220.0 * fbm(p * 0.5 - t * 0.015); // nm
  float nFilm = 1.35;
  float opd = 2.0 * nFilm * thickness * cosTheta;

  vec3 lambda = vec3(610.0, 545.0, 465.0);
  vec3 phase = 6.2831853 * opd / lambda + 3.14159265;
  vec3 refl = 0.5 + 0.5 * cos(phase);

  refl.g = mix(refl.g, min(refl.r, refl.b), 0.78);
  refl = 0.12 + 0.74 * refl;
  float coat = fbm(p * 0.4 + vec2(t * 0.01, 3.7));
  vec3 low = mix(vec3(0.50, 0.55, 0.84), vec3(0.62, 0.50, 0.76), coat);
  vec3 high = vec3(0.99, 0.90, 0.98);
  vec3 col = mix(low, high, refl);

  col *= 0.95 + 0.05 * h;
  col *= 1.0 - 0.12 * dot(uv * 0.55, uv * 0.55);
  fragColor = vec4(col, 1.0);
}
