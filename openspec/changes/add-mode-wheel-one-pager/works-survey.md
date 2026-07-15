# Works Survey — one-by-one scrape results (2026-07-15)

Every batch-2 URL fetched and characterized. This is the seed truth for
`src/content/works/*.json` — real names, fonts, palettes, mechanics. ★ =
featured in §03 Selected Works.

## Scrape finding (drives the pipeline)

Cargo preview URLs are empty SPA shells (no og tags, 986 B, some 503).
Ground truth lives at **`api.cargo.site/v1/sites/{id}`** (name, fonts,
screenshot, design settings) + **`/v1/sites/{id}/css`** + the live
`*.cargo.site` subdomain (real og:title/og:image,
`window.__PRELOADED_STATE__` with full stylesheet/pages). The
`scrape:works` script MUST use the API path, never the preview URL.
Shared Cargo baseline: `--swatch-1..5` black-alpha ladder, lowercase
transform, 100ms opacity transitions, `a:active` opacity .7.

## Cargo templates (13)

| slug | name | category | layout kernel | type | palette | signature mechanic / what we take |
|---|---|---|---|---|---|---|
| cargo-3344373 | B970 | vintage | 3/3/6 asymmetric editorial stack | Marist serif + Diatype Semi-Mono captions | white + ink alpha ladder | serif display / semi-mono caption pairing |
| cargo-3342335 | P673 | books | 8× repeating 12-col ledger (3/3/5/1) | Diatype 4rem + Gravity condensed | monochrome ladder | frosted `backdrop-filter` nav over entry ledger |
| cargo-3344370 | B508 | music | freeform scatter collage | Diatype only, 15rem display | monochrome | draggable shop icons under giant single-font type |
| cargo-3347193 ★ | H724 | hotel | full-bleed slideshow + 2-col grid index | Diatype only, lowercase | zero accent, alpha swatches only | cursor-zone navigation, hard cuts, "01 / 08" counter — chrome reduced to a counter and two words |
| cargo-2657644 | L384 | restaurant | numbered 3/9 sidebar index ×19 | Monument Grotesk + Diatype | monochrome | each index entry expands to inline cursor-zone slideshow |
| cargo-2646625 | F853 | vintage | homepage = text list of 18+ links | Monument Grotesk + Diatype | white + ink | text-index-as-homepage + live `digital-clock` |
| cargo-2881242 | D429 | books | 4/8 two-column document rows | Guyot serif + Monument Grotesk | monochrome | margin-note left / running text right document grid |
| cargo-2875495 | B421 | hotel | ratio-labeled gallery grid (C1 1:1…C8 4:1) | Favorit + Monument Grotesk + Diatype variables | #0034ee + white + alpha | proposal-deck grid with A/B/C switcher, pinned chrome |
| cargo-3429594 | Z922 | vintage | faux desktop-OS: wallpaper + window overlays | Favorit Mono + Diatype | black/white | window overlays + tabular all-work index (# Name Type Year) |
| cargo-2848594 | D445 | books | single-column footnoted paper | Diatype + Diatype Mono | #161616 on #f4f4f4 | page-border frame, footnotes, image-zoom OFF reading mode |
| cargo-2686360 | B374 | books | image spreads with fold illusion | Diatype only | white + alpha | pinned crease-highlight/shadow strips → scroll reads as book spreads |
| cargo-3461855 | S176 | music | pinned finder sidebar + 6-col grid | Diatype only | #0068ed link-blue | mac-window sidebar, "about me.rtf" file-metaphor overlay, platform link rail |
| cargo-2786603 | G858 | vintage | dated journal stack over wallpaper + shop overlay | Diatype Semi-Mono + ROM Condensed | **#ffd401 yellow** accent | dated-drop journal + 12-product overlay shop |

## Live sites (4 + bar ref)

| slug | name | category | type | palette | signature / what we take |
|---|---|---|---|---|---|
| after-band ★ | After | music | PixdorTwo pixel display + Aeonik Pro/Mono | b/w + blues #226bc9/#4b7fe1 | pixel font + mono grotesk on dead-simple centered column, dated tour list-index |
| skrillex ★ | Skrillex | music | NT Bau + PCB, weight 400 only | near-monochrome; artwork carries color | one typeface / one weight / zero palette; line-by-line text reveal |
| roxy-bar ★ | Roxy Bar (Roxy Hotel NYC) | restaurant | Stanley + Austin serif + Proxima UI + Quickpen script | cream #f1f0e9 + terracotta #da7250 | editorial serif trio over warm neutrals + one terracotta accent |
| warmnfuzzy | Warm & Fuzzy | vintage | SuisseIntl, all-caps statements | yellow #f7dd47, cobalt #190bb6, red-orange #e74a27 + vivids | confetti primaries, hover-dense video grid, Lenis + custom cursor, one clean typeface |
| overstory (ref) | Overstory NYC | bar-ref | futura-pt 300–700 only | cream #f5f3e8, ink #110f10, terracotta #a05b4e | luxury via typographic restraint: policies/menu as list-index, minimal motion |

## Category coverage

restaurant 2 · hotel 2 · music 4 · vintage 5 · books 4 = **17 works, all
five categories covered.** Featured four (★): H724, after-band, skrillex,
roxy-bar.

## Consequences folded into the spec

1. Works collection seeds from THIS table (17 sourced records), not lorem
   data; lorem remains only in `summary` prose until copywriting.
2. New task 4.0: `scrape:works` script — Cargo API + og/meta + palette
   extraction → `works/*.json`; re-runnable for batch-3 URLs.
3. Kernel calibration notes: H724's zero-color discipline feeds
   `essential`; warmnfuzzy's primaries + G858's yellow feed accent thinking
   in `clay`/`brutal`; Cargo's alpha-ladder swatch system is prior art for
   our custom-property kernels.
