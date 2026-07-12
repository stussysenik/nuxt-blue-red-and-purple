// Scene — cellular garden. A real Game of Life colony (toroidal grid,
// stepped at a fixed cadence on a ping-pong texture) rendered as soft
// biolume: live cells glow near-white, phosphor trails linger violet over a
// calm pastel base. Touch seeds new life directly into the simulation.

uniform sampler2D u_life;

void main() {
  vec2 uv = sceneUv();
  float t = u_time;

  // Calm base wash, same family as the other scenes.
  float m = fbm(uv * 0.3 + t * 0.012);
  vec3 col = mix(vec3(0.50, 0.54, 0.87), vec3(0.66, 0.50, 0.80), m);

  // Square cells on any screen: aspect-corrected, toroidally wrapped lookup
  // with a slow drift and a whisper of domain warp so the grid feels organic.
  vec2 lifeUv = uv * 0.15 + 0.5 + t * vec2(0.004, 0.002);
  lifeUv += (vec2(fbm(uv * 1.1 + t * 0.02), fbm(uv * 1.1 - t * 0.02 + 3.7)) - 0.5) * 0.012;
  vec2 s = texture(u_life, lifeUv).rg;

  // Trails tint violet; living cells bloom pink-white with a gentle pulse.
  col = mix(col, vec3(0.72, 0.58, 0.92), smoothstep(0.05, 0.8, s.g) * 0.45);
  float core = smoothstep(0.30, 0.85, s.r) * (0.80 + 0.20 * sin(t * 1.7));
  col = mix(col, vec3(0.99, 0.90, 0.96), core * 0.75);

  col += (vnoise(gl_FragCoord.xy * 0.45) - 0.5) * 0.03;
  col *= 1.0 - 0.10 * dot(uv * 0.5, uv * 0.5);
  fragColor = vec4(col, 1.0);
}
