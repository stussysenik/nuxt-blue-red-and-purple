# Proposal: promote-work-recreations

## Why

The 13 bespoke work pages frame their reconstruction inside a case-study shell —
lede, narrative, a measured stage with rulers, study notes, palette footer. The
bar is higher and simpler: opening `/works/<slug>` should look like the reference
site itself, rebuilt 1:1 — what a visual-agentic model would output if fed the
link. Everything that is not the recreation is "other text" and leaves the DOM
(archived as comments so the build knowledge survives).

Together the 13 read as one **template catalogue**: same chrome, same method,
same rigour — thirteen different rooms built to one standard.

## What Changes

- **MODIFIED every visible work page (13):** the recreation is promoted from the
  stage slot to the full page. Mobile-first; at the reference's native width the
  page matches it 1:1 (grid, type scale, spacing, alignment). The only portfolio
  chrome is a fixed mono `← INDEX` link. Live mechanics stay live (cursor-zone
  slideshow, real-time clock, drag chips, frosted sticky nav, scroll spreads,
  shop overlay, line-by-line arrival).
- **ADDED `chrome="work"` to `Base.astro`:** renders the lone `← INDEX` link and
  withholds the centred pill, the `✳` corner mark, and the ThemeToggle. A work
  page is the artwork; the portfolio leaves one mark on it, not four.
- **S'MAC becomes a before/after contrast (user direction, supersedes the old
  scroll-reveal):** a slider between the site **as found** and the delivered
  redesign running at `smac.blueredandpurple.world`. Both halves are rebuilt
  in-kernel — the "before" is a reconstruction, never a screenshot of the client's
  original.
- **Case-study narrative archived, not shown:** each page's former lede /
  narrative / study-notes copy moves into a frontmatter comment block headed
  `Archived case-study copy`. `CaseStudy.astro` is deleted once unused.
- **REMOVED the 5 hidden works and the generic template** (done): `d445`,
  `warm-fuzzy`, `s176`, `z922`, `roxy-bar` (JSON + jpg) and `works/[slug].astro`.
  Their URLs 404. Git history preserves them.

## Provenance — corrected premise (this change's real discovery)

The original proposal assumed `public/works/<slug>.jpg` were **owned screenshots
kept as internal inputs**. Both halves were false, and the spec's own provenance
rule was already being violated in production:

- `scripts/scrape-works.ts` downloaded Cargo's render of each **live third-party
  site** (`freight.cargo.site`) straight into `public/works/`, commenting it "an
  owned local asset". It is not ours. `h724.jpg` carried a **TDK**-branded subject
  and the source's own baked-in chrome.
- `public/` ships. All 13 served at `blueredandpurple.world/works/*.jpg`.
- Two surfaces rendered them: the Project Index ghost backdrop (`index.astro`)
  and `smac.astro`'s `<img … alt="reference plate">`.
- The schema had said the right thing all along — *"Local committed stock photo
  under /works — never a hotlink or screenshot."* Commit `f7261d6` ("WIP") had
  clobbered the curated set from `4c94867` ("18 curated Gratisography photos").

**Fixed here:** the licensed Gratisography set is restored to `public/works/`
from `4c94867`; the source renders move to `refs/works/` (gitignored, never
shipped) where they serve their one legitimate purpose — the measurement input
for rebuilding each work; `scrape:works` now writes there and no longer
overwrites curated imagery. Guarded by `test/work-provenance.test.ts`, which
fails red on the exact regression (byte-identical copy **and** the 16:10 render
shape, independently).

Git history still contains the screenshots at `f7261d6`. Scrubbing history is a
separate decision, deliberately not taken here.

## Impact

- Affected: 13 `src/pages/works/<slug>.astro`, `src/layouts/Base.astro`
  (`chrome="work"`), `src/components/CaseStudy.astro` (deleted at the end),
  `scripts/scrape-works.ts`, `.gitignore`, `public/works/*.jpg` (restored).
- Added: `scripts/ref-geometry.py` (measure a reference instead of guessing),
  `test/work-provenance.test.ts`.
- Specs: new capability `work-reconstruction`.
- Verification: unit tests + `pnpm check` + `pnpm build` are the working channel.
  A single browser side-by-side pass over all 13 runs at the **end**, in a
  dedicated session — not per page.
