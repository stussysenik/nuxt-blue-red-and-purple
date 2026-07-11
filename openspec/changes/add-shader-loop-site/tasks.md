# Tasks — add-shader-loop-site

## 1. Scaffold + first scene end-to-end
- [x] 1.1 `git init`; Vite + strict TS scaffold; oxlint + `.oxlintrc.json`;
      scripts `dev`/`build`/`lint`/`typecheck`/`check`; `.gitignore`
      covering `.env.local`; remove the stray duplicate
      `SPACESHIP_SECRET_KEY` line from `.env.local`
- [x] 1.2 WebGL2 bootstrap: fullscreen triangle, shader compile/link with
      error surfacing, resize + DPR-cap handling, CSS-gradient fallback on
      context failure
- [x] 1.3 Scene 1 fragment shader (thin-film interference / iridescent
      clearcoat in the pastel palette) rendering directly to screen;
      delta-time clock; visibility pause
- [x] 1.4 Verify: `npm run check` green; page renders animating in Chrome
      (devtools MCP screenshot + zero console errors)

## 2. Composite pass, carousel, scenes 2–3
- [x] 2.1 Render-to-texture pipeline + composite pass: scene blend uniform,
      blue-noise dithering, shared palette grade
- [x] 2.2 Scene registry + director: timed cycling, eased 1–2 s crossfade,
      scene-local time (no unbounded time uniforms)
- [x] 2.3 Scenes 2 and 3: metallic-flake glint field + anisotropic
      specular sweep (same palette, distinct optical characters)
- [x] 2.4 Verify: full carousel loop observed; no banding on gradients;
      transition renders both scenes only during the 1–2 s window

## 3. Shell + adaptive quality
- [x] 3.1 Text overlay: "blueredandpurple" wordmark (confirmed), CSS
      entrance animation, contrast check against lightest scene output
- [x] 3.2 Metadata: title, description, theme-color, favicon, OG tags
- [x] 3.3 Adaptive resolution scaling on frame-time pressure;
      `prefers-reduced-motion` slow-drift mode
- [x] 3.4 Verify: check green; reduced-motion emulation shows drift;
      CPU-throttled run steps resolution down; 120 Hz speed parity spot-check

## 4. Ship
- [x] 4.1 Deploy to Vercel (preview → verify → production)
- [x] 4.2 Add blueredandpurple.world + www to the Vercel project; set
      Spaceship DNS records via API; confirm HTTPS resolution on both hosts
- [x] 4.3 Final binary-truth pass on the live domain: screenshot, console
      clean, Lighthouse perf sanity
