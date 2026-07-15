# deployment Specification

## Purpose
TBD - created by archiving change add-shader-loop-site. Update Purpose after archive.
## Requirements
### Requirement: Vercel production hosting
The site SHALL be deployed as a static Vite build to Vercel production,
served over HTTPS.

#### Scenario: Production deploy
- **WHEN** the deploy command runs from a green `npm run check` state
- **THEN** the build output is live on the Vercel production URL over
  HTTPS with immutable-cached assets

### Requirement: Custom domain via Spaceship DNS
blueredandpurple.world SHALL resolve to the Vercel deployment, with DNS
records managed at Spaceship (registrar unchanged).

#### Scenario: Domain resolution
- **WHEN** a visitor opens https://blueredandpurple.world (and the www
  subdomain)
- **THEN** the shader site loads over valid HTTPS from Vercel

#### Scenario: Credential hygiene
- **WHEN** DNS is configured via the Spaceship API
- **THEN** credentials are read from `.env.local` only, the stray
  duplicate `SPACESHIP_SECRET_KEY` line is removed, and `.env.local` is
  git-ignored

