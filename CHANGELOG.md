# Changelog

Versions: `MAJOR.MINOR.PATCH`. MAJOR = engine or animation changes. MINOR = UI redesign or new feature. PATCH = fixes and copy.

## v1.2.0 — 12 Oct 2026

UI redesign to Figma V1 design system. PTG-branded; hosted on Cloudflare Pages.

**UI 1.2.0**
- New design system: Inter only, five colours as tokens (navy, blue, lime, charcoal, paper), display type that scales from 1280 to 2560 wide.
- Nav: two glass pills, PTG logo left; Home, Products, About us and a Contact button right.
- Hero: full-screen frost with the tagline. Opacity and blur fade together over the first screen, with no hard edge.
- Four chapter captions (01–04 / 04) that fade and rise in, drift slowly, and rise out.
- Soft left wash for legibility once the frost has gone.
- 11 layer chips in a left column, sorted so the orthogonal leader lines never cross. Figma layer markers on the render.
- Glass layer card: description, specs, placeholder cost and share of build-up, Outer / Inner. Arrow keys and Esc.
- Contact section with the frost returning over the final frame.
- Removed: "Inside the wall" title, scroll cue, progress rail, cost bar, "Skip to layers", loader.
- Accessibility: semantic landmarks, chips are `aria-pressed` buttons, live card region, blue focus ring on every control, skip link, reduced motion support.

**Content**
- Chapter copy moved into `src/data/layers.js` with the layer data. Chip labels follow Figma.

**Build and hosting**
- `build/build.py` now outputs a deployable `dist/` (page, frames, assets, `_headers` with long caching) for Cloudflare Pages.
- Frames are tracked in git so Cloudflare can build from the repo.
- GitHub Pages staging retired.

**Engine**
- Unchanged (1.0.0). Same 198 frames and timing.

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
