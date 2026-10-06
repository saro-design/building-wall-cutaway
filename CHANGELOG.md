# Changelog

Versions: `MAJOR.MINOR.PATCH`. MAJOR = engine or animation changes. MINOR = UI redesign or new feature. PATCH = fixes and copy.

## v1.1.0 — 6 Oct 2026

Standalone build. The project no longer depends on any one website.

- `build/build.py` now outputs a single `dist/index.html`. Frames load from `frames/` by default, or from any folder or server with `--frames <url>`.
- Frames renamed `frame-001.webp` to `frame-198.webp`.
- Removed website-specific build output and the portfolio card image (`marketing/`).

## v1.0.0 — 27 Sept 2026

First full version.

**Engine 1.0.0**
- 198 frames at 24 fps from 1.75 s to 10.0 s of the After Effects export, 1920×1080 WebP,
- Scroll length 9 screens: hold 0–0.7, cutaway opens 0.7–3.2, camera push 3.2–5.4.
- Time-based scroll smoothing. One sharp frame per position, no blending.
- Loads a coarse pass first (every 16th frame, then 8th, 4th, 2nd), so scrolling works before all frames arrive.
- Desktop fills the screen. Phones show the frame across the top with content below.

**UI 1.0.0**
- Three chapter captions over the animation.
- 11 layer labels drawn in one by one, outside to inside, with leader lines. Numbered dots on phones.
- Layer card with description, two spec lines, cost per m² and share of the total. Outer / Inner stepping and arrow keys.
- Build-up cost bar with a running total.
- "Skip to layers" button, progress rail, "← Sarvesh Chitnis" link home.
- Costs are placeholder rates.

**Page**
- noindex, nofollow.
- All classes and ids prefixed `cw-`, so the experience can sit inside any site without style clashes.

## Before v1.0.0

- 26 Sept 2026: single-file prototype published as a Claude artifact. 12 fps with frame blending, then 24 fps without. Kept in `prototype/`.
