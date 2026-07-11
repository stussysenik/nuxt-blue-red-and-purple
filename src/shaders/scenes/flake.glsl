// Scene — metallic flake. Sparse micro-facets over a pastel base coat catch
// a slowly orbiting light and glint, like metallic car paint in the sun.

void main() {
  vec2 uv = sceneUv();
  float t = u_time;
  vec2 p = uv * 1.0;

  // Base coat: broad, calm color fields (large-cell blend, no fine ribbons)
  // so the flake glints carry the scene.
  float m1 = fbm(p * 0.28 + t * 0.015);
  float m2 = fbm(p * 0.35 - t * 0.011 + 7.3);
  vec3 col = mix(vec3(0.52, 0.56, 0.88), vec3(0.68, 0.50, 0.80), m1);
  col = mix(col, vec3(0.94, 0.64, 0.74), smoothstep(0.45, 0.8, m2));

  // Flakes at two scales: each cell is a micro-facet with a random normal;
  // it glints hard when aligned with the drifting light.
  vec3 light = normalize(vec3(cos(t * 0.24) * 0.7, sin(t * 0.19) * 0.7, 0.75));
  float glint = 0.0;
  for (int s = 0; s < 2; s++) {
    float scale = s == 0 ? 55.0 : 105.0;
    vec2 g = uv * scale + float(s) * 37.0;
    vec2 id = floor(g);
    vec2 cell = fract(g) - 0.5;
    vec3 fn = normalize(vec3(hash(id) - 0.5, hash(id + 31.7) - 0.5, 0.6));
    float facing = max(dot(fn, light), 0.0);
    float sparkle = pow(facing, 16.0);
    sparkle *= step(0.82, hash(id + 11.3)); // sparse reflective flakes
    sparkle *= smoothstep(0.42, 0.1, length(cell)); // round glint core
    glint += sparkle * (s == 0 ? 1.2 : 0.7);
  }
  col = mix(col, vec3(1.0, 0.96, 1.0), clamp(glint, 0.0, 1.0) * 0.8);

  // Fine metallic grain keeps the surface dithered and organic.
  col += (vnoise(gl_FragCoord.xy * 0.45) - 0.5) * 0.035;
  col *= 1.0 - 0.10 * dot(uv * 0.55, uv * 0.55);
  fragColor = vec4(col, 1.0);
}
