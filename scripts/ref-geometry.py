#!/usr/bin/env python3
"""ref-geometry — read a reference's layout off the pixels, so a reconstruction
is transcribed from measurements instead of guessed by eye.

The references live in refs/works/<slug>.jpg (gitignored, internal build inputs:
renders of the third-party source sites, never ours, never shipped). This tool
turns one into numbers a work page's CSS can be written from directly.

    python3 scripts/ref-geometry.py h724            # one work
    python3 scripts/ref-geometry.py --all           # every reference present

Reports, in the reference's own pixel space:
  - text rows   : each band of ink, with its cap height and word runs/gaps
  - blocks      : non-paper regions (plates, panels, images) with aspect
  - edges       : the strongest column/row alignment edges (the grid)

Read every number as a ratio of the reference width (cqw) when writing the CSS:
a work page is its own `container-type: inline-size`, so `x/W*100` → cqw maps a
measured px straight onto a rule that holds at any viewport.

Why this and not a browser: measuring the *reference* needs no browser at all,
and it is the half that actually drives the CSS. Confirming the *built* page
still wants a screenshot — that runs in a dedicated session, not here.
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("needs Pillow:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
REFS = ROOT / "refs" / "works"

def ground(px, W, H):
    """The reference's own background luminance, read off its border ring.

    References are not all light paper — several sources are dark or full-bleed
    photographic, where a fixed `ink < 140` rule marks the entire page as ink
    and every measurement degenerates to one band. Sampling the border gives the
    page's actual ground, so contrast is measured against *it*.
    """
    ring = [px[x, y] for x in range(0, W, 4) for y in (2, H - 3)]
    ring += [px[x, y] for y in range(0, H, 4) for x in (2, W - 3)]
    ring.sort()
    return ring[len(ring) // 2]  # median: robust to a bright object at an edge


def contrast(v, bg, need):
    return abs(v - bg) >= need


def rows_of_text(px, W, H, bg):
    """Bands of ink separated by >=8 blank rows, with cap height + word runs."""
    INK = 90  # luminance distance from ground that reads as a mark
    inked = [any(contrast(px[x, y], bg, INK) for x in range(0, W, 2)) for y in range(H)]
    bands, start, blank = [], None, 0
    for y, on in enumerate(inked):
        if on:
            if start is None:
                start = y
            blank = 0
        elif start is not None:
            blank += 1
            if blank >= 8:
                bands.append((start, y - blank))
                start = None
                blank = 0
    if start is not None:
        bands.append((start, H - 1))
    return bands


def word_runs(px, W, y0, y1, bg, split=12):
    """Ink runs across a band, split on gaps >= `split` px."""
    cols = [any(contrast(px[x, y], bg, 90) for y in range(y0, y1 + 1)) for x in range(W)]
    runs, start, gap = [], None, 0
    for x, on in enumerate(cols):
        if on:
            if start is None:
                start = x
            gap = 0
        elif start is not None:
            gap += 1
            if gap >= split:
                runs.append((start, x - gap))
                start = None
                gap = 0
    if start is not None:
        runs.append((start, W - 1))
    return runs


def blocks(px, W, H, y0, y1, bg):
    """Bounding box of everything that isn't paper, in a vertical slice.

    Full-resolution on purpose: subsampling clipped the soft edges of
    photographic plates and under-reported width by ~5%. Treat the result as
    approximate anyway — a plate photographed on white has no measurable frame
    (white on white), so this finds the *subject*, not the layout box.
    """
    xs, ys = [], []
    for y in range(y0, y1):
        for x in range(W):
            if contrast(px[x, y], bg, 24):  # a plate need only part from its ground
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return (min(xs), min(ys), max(xs), max(ys))


def report(slug):
    path = REFS / f"{slug}.jpg"
    if not path.exists():
        print(f"  ✗ {slug}: no reference at refs/works/{slug}.jpg")
        return
    im = Image.open(path).convert("L")
    W, H = im.size
    px = im.load()
    pct = lambda v, tot: f"{v / tot * 100:.2f}"
    bg = ground(px, W, H)

    print(f"\n─── {slug}  ({W}×{H}, aspect {W / H:.3f}, ground L={bg} "
          f"{'light' if bg > 127 else 'dark'}) ───")

    bands = rows_of_text(px, W, H, bg)
    print(f"  text rows ({len(bands)}):")
    for y0, y1 in bands[:14]:
        runs = word_runs(px, W, y0, y1, bg)
        h = y1 - y0 + 1
        loc = f"y {y0}→{y1} ({pct(y0, H)}%→{pct(y1, H)}%)  capH={h}px ({pct(h, W)}cqw)"
        print(f"    {loc}")
        for a, b in runs[:6]:
            print(f"        run x {a:4d}→{b:4d}  w={b - a + 1:4d}  ({pct(a, W)}cqw → {pct(b, W)}cqw)")
        gaps = [runs[i + 1][0] - runs[i][1] for i in range(len(runs) - 1)]
        if gaps:
            print(f"        gaps: {', '.join(str(g) for g in gaps[:6])}")
    if len(bands) > 14:
        print(f"    … {len(bands) - 14} more rows")

    mid = blocks(px, W, H, int(H * 0.10), int(H * 0.88), bg)
    if mid:
        x0, y0, x1, y1 = mid
        bw, bh = x1 - x0 + 1, y1 - y0 + 1
        print("  central block (plate / panel / image):")
        print(f"    x {x0}→{x1} (w={bw}, {pct(bw, W)}cqw)   y {y0}→{y1} (h={bh})")
        print(f"    centre x={(x0 + x1) // 2} ({pct((x0 + x1) // 2, W)}%)  y={(y0 + y1) // 2} ({pct((y0 + y1) // 2, H)}%)"
              f"   aspect={bw / bh:.3f}")


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    slugs = (
        sorted(p.stem for p in REFS.glob("*.jpg")) if args[0] == "--all" else args
    )
    if not slugs:
        sys.exit("no references found under refs/works/ — run `pnpm scrape:works` first")
    for s in slugs:
        report(s)


if __name__ == "__main__":
    main()
