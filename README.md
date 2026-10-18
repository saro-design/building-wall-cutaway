# Building Cutaway

A full-screen, scroll-driven cutaway of a five-storey apartment block for **Performance Technology Group (PTG)**. As you scroll, the façade is cut open, the camera pushes into the wall, and the nine layers of the through-wall SFS system are named one by one. Select any layer for what it does and what it costs.

**Live:** https://cutaway.sarvesh.co.uk

| | |
|---|---|
| Current version | see `VERSION` and `CHANGELOG.md` |
| Design | Figma, V1 design system (Oct 2026): https://www.figma.com/design/JRckNrWn8mJHfyI6Ywihqz |
| Hosting | Cloudflare Worker (static assets), deployed automatically from GitHub on every push to `main` (see `docs/hosting-cloudflare.md`) |
| Source animation | After Effects comp, 1920×1080, 24 fps |
| Frames used | 198 WebP files, about 22 MB, in `frames/` |

The page is PTG-branded with the client's agreement. Sarvesh's Webflow portfolio links to it.

## Where it lives

| URL | What |
|---|---|
| `https://cutaway.sarvesh.co.uk` | Production. Always the latest `main`. |
| `http://localhost:8765` | Your local check before merging (see Making a change). |

Only `main` is built. Cloudflare's own `*.workers.dev` address is switched off, so the custom domain is the only public URL.

## How it is split

The code is in layers so the UI can be redesigned without touching the animation.

```
building-wall-cutaway/
├── VERSION                  one line, e.g. 1.2.0
├── CHANGELOG.md             what changed in each version
├── src/
│   ├── engine/
│   │   └── cutaway-engine.js   STABLE. Frames, scroll timeline, canvas, image-to-screen mapping
│   ├── ui/                     CHANGES WITH EACH DESIGN ROUND
│   │   ├── ui.html             markup: nav, hero, card, contact
│   │   ├── ui.css              all styling; colours and type are tokens at the top
│   │   └── ui.js               frost, chapters, chips, leaders, markers, card
│   └── data/
│       ├── layers.js           CONTENT. Chapter copy, layer names, specs, costs, marker positions
│       └── frames.json         file names of the 198 frames
├── assets/                  PTG logo, layer marker art (from Figma)
├── frames/                  the 198 animation frames
├── build/
│   └── build.py             builds dist/
├── dist/                    OUTPUT. Rebuilt every time, never edit by hand (not in git)
├── prototype/               the original single-file prototype, kept for reference
└── docs/
```

### What each layer owns

**Engine** (`src/engine/cutaway-engine.js`). Loads the frames, turns scroll position into a frame, draws it full screen, and works out where the image sits on screen. It publishes `window.Cutaway`:

| | |
|---|---|
| `Cutaway.on('frame', fn)` | called every time the picture moves. `fn(state)` gets `u` (scroll position in screens, 0–9), `view`, `frame`, `narrow` (phone layout) |
| `Cutaway.on('progress', fn)` / `on('ready', fn)` | frame loading |
| `Cutaway.jumpTo(u)` | scroll to a point |
| `Cutaway.project(x, y)` | image pixel on the 1920×1080 frame to screen pixel |

Scroll length is 9 screens: the building holds until 0.7, the cutaway opens until 3.2, the camera pushes in until 5.4, and the layers are named from 5.6.

**UI** (`src/ui/`). Everything a visitor reads or clicks, built to the Figma V1 design system: Inter only, five colours (navy, blue, lime from the PTG logo; charcoal and paper). The story:

| Scroll (screens) | What you see |
|---|---|
| 0 – 0.9 | Full-screen frost over the building with the hero line. It fades away, opacity and blur together. |
| 0.7 – 1.9 | 01 / 04 · The building envelope |
| 1.9 – 3.2 | 02 / 04 · Through-wall SFS |
| 3.2 – 5.4 | 03 / 04 · Built in layers |
| 5.4 – 9 | 04 / 04 · nine layers. One system. Layer chips appear one per step. |
| after 9 | Contact, with the frost back over the final frame |

Click a chip or a marker to open the layer card. ← / → step through layers, Esc closes.

**Data** (`src/data/layers.js`). Chapter copy and one entry per layer, numbered inside to outside (01–09), revealed outside to inside. Chapter body copy and costs are **placeholders**.

## Making a change

1. Start a branch (see `docs/git-workflow.md`).
2. Edit files in `src/` only.
3. Run `python3 build/build.py` (on Windows: `python build/build.py`).
4. Check it locally: `python -m http.server 8765 -d dist`, then open http://localhost:8765. (Opening `dist/index.html` straight from the folder also works.)
5. Push the branch and open a pull request. Merging it into `main` publishes the change.

## Build

`python3 build/build.py` produces a deployable `dist/`:

- `dist/index.html`: the whole experience in one file, frames loaded from `frames/`
- `dist/frames/`, `dist/assets/`: copies
- `dist/_headers`: long cache (`max-age=31536000, immutable`) for `/frames/*` and `/assets/*`

JS is minified with `terser` if it's installed, and shipped as is if not (Cloudflare's build image doesn't need it).

Cloudflare Workers Builds settings: build command `python3 build/build.py`, deploy command `npx wrangler deploy`, branch `main`. `wrangler.jsonc` says what to deploy: `dist/` as static assets on `cutaway.sarvesh.co.uk`.

## Releasing a version

1. Bump `VERSION`. `1.x.0` for a UI redesign, `1.x.y` for a fix or copy change, `2.0.0` if the engine or animation changes.
2. Add an entry at the top of `CHANGELOG.md`.
3. Merge the pull request into `main`. The live site updates itself.
4. Tag the merge `v<version>` and publish a GitHub Release.

## Still to do

- Replace the placeholder costs and chapter copy in `layers.js` with PTG's figures.
- Swap `assets/ptg-logo.png` for the vector logo when PTG sends it (keep the file name, or update `ui.html`).
- Real links for Products, About us, the spec sheet and the team email (placeholders in `src/ui/ui.html`).
- A lighter frame set for phones (e.g. 960 px wide).

© Sarvesh Chitnis. Renders and product information belong to their owners; the PTG name and logo are used with the client's agreement.
