// Scene — anisotropic specular sweep. Brushed-silk highlight bands follow a
// curling flow field while a light source drifts across the surface.

void main() {
  vec2 uv = sceneUv();
  float t = u_time;
  vec2 p = uv * 1.1;

  // Flow direction field.
  float ang = fbm(p * 0.45 + t * 0.018) * 6.2831853;
  vec2 dir = vec2(cos(ang), sin(ang));

  // Brushed coordinate + drifting sweep: broad diagonal highlight bands
  // with fine brushed threading along them.
  float band = dot(uv, dir);
  float warp = fbm(p * 0.9 + 2.6) * 1.1;
  float sweep = sin(band * 1.5 - t * 0.14 + warp);
  float hi = pow(0.5 + 0.5 * sweep, 5.0);
  float threads = sin(band * 60.0 + warp * 8.0) * 0.5 + 0.5;
  float hi2 = pow(0.5 + 0.5 * sin(band * 3.4 + t * 0.1 + warp * 2.0), 10.0);

  vec3 base = mix(vec3(0.40, 0.45, 0.82), vec3(0.56, 0.42, 0.74), fbm(p * 0.6 + 3.1));
  vec3 col = mix(base, vec3(0.99, 0.82, 0.92), hi * (0.75 + 0.25 * threads));
  col = mix(col, vec3(0.86, 0.90, 1.0), hi2 * 0.5 * threads);

  col *= 1.0 - 0.12 * dot(uv * 0.5, uv * 0.5);
  fragColor = vec4(col, 1.0);
}
