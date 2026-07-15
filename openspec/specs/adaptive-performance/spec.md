# adaptive-performance Specification

## Purpose
TBD - created by archiving change add-shader-loop-site. Update Purpose after archive.
## Requirements
### Requirement: Frame-rate-independent animation
All motion SHALL be computed from elapsed time (delta-time accumulation),
so the visual plays at identical speed on 60, 120, and 144 Hz displays.

#### Scenario: High-refresh display
- **WHEN** the site runs on a 120 Hz display
- **THEN** animation speed matches a 60 Hz display exactly (smoother, not
  faster)

### Requirement: Adaptive render resolution
The renderer SHALL cap device-pixel-ratio at 2 and SHALL reduce the render
target scale (down to a floor of 0.5×) when the smoothed frame time
exceeds the display's frame budget, restoring scale when headroom returns.

#### Scenario: Underpowered device
- **WHEN** sustained frame time exceeds the refresh budget
- **THEN** internal resolution steps down until frames fit the budget
- **AND** the canvas continues to fill the viewport (upscaled)

### Requirement: Reduced-motion respect
The experience SHALL honor `prefers-reduced-motion: reduce` by slowing the
time scale to a gentle drift (≈5% speed) instead of full-speed motion.

#### Scenario: Reduced motion enabled
- **WHEN** the OS-level reduce-motion setting is active
- **THEN** the shader still renders but drifts slowly, with no fast
  movement or rapid transitions

### Requirement: Background tab suspension
The render loop SHALL stop entirely while the document is hidden and
resume without a time jump when it becomes visible.

#### Scenario: Tab switched away and back
- **WHEN** the tab is hidden for 10 minutes then refocused
- **THEN** no frames were rendered while hidden
- **AND** the visual resumes from where it left off (no 10-minute time leap)

