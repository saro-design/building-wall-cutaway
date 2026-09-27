# Building Wall Cutaway

A full-screen, scroll-driven cutaway of a five-storey apartment block: a web design concept for explaining a through-wall building envelope system. As you scroll, the façade peels away, the camera pushes into the wall, and the 11 layers of the through-wall SFS system are named one by one. The page ends on clickable labels that show what each layer does and what it costs.

| | |
|---|---|
| Live page (draft) | sarvesh.co.uk/building-wall-cutaway (Webflow page "Inside the Wall") |
| Current version | see `VERSION` and `CHANGELOG.md` |
| Source animation | After Effects comp, exported as `Comp 1_1.mp4` (1920×1080, 24 fps, 40 s) |
| Frames used | 1.75 s to 10.0 s of the film, every frame: 198 WebP files, about 22 MB |
| Frames on Webflow | Assets › **Building Cutaway** (198 files) |
| Frames on disk | `frames/` next to `src/` (not in git) |

## How it is split

The code is in two layers so the UI can be redesigned as often as needed without touching the animation.

```
building-wall-cutaway/
├── VERSION                  one line, e.g. 1.0.0
├── CHANGELOG.md             what changed in each version
├── README.md                this file
├── src/
│   ├── engine/
│   │   └── cutaway-engine.js   STABLE. Frames, scroll timeline, canvas, image-to-screen mapping
│   ├── ui/                     CHANGES OFTEN. Everything drawn on top of the animation
│   │   ├── ui.html             markup: chapter text, side panel, buttons
│   │   ├── ui.css              all styling; colours and fonts are tokens at the top
│   │   └── ui.js               labels, leader lines, layer card, cost bar, loader
│   └── data/
│       ├── layers.js           CONTENT. Names, copy, specs, costs, dot positions
│       └── frames.json         Webflow file names of the 198 frames
├── build/
│   └── build.py             joins src/ into the Webflow code blocks and preview pages
├── dist/                    OUTPUT. Rebuilt every time, never edit by hand
│   ├── webflow/head.html       paste into Page settings › Inside <head> tag
│   ├── webflow/footer.html     paste into Page settings › Before </body> tag
│   └── preview/
│       ├── index.html          open in a browser, frames load from Webflow
│       └── index-local.html    open in a browser, frames load from frames/
├── releases/
│   └── v1.0.0/              frozen copy of dist/ and src/ for every released version
├── prototype/
│   └── inside-the-wall-prototype.html   the original single-file prototype, kept for reference
└── docs/
    └── ui-iteration-notes.md   design decisions and open questions for the UI
```

### What each layer owns

**Engine** (`src/engine/cutaway-engine.js`). Loads the frames, turns scroll position into a frame, draws it full screen, and works out where the image sits on screen. It knows nothing about labels, copy or costs. It publishes one object, `window.Cutaway`:

| | |
|---|---|
| `Cutaway.on('frame', fn)` | called every time the picture moves. `fn(state)` gets `u` (scroll position in screens, 0–9), `view` (`s` scale, `ox`/`oy` offset), `frame`, `narrow` (phone layout) |
| `Cutaway.on('progress', fn)` | frame loading, `{loaded, total}` |
| `Cutaway.on('ready', fn)` | all frames loaded |
| `Cutaway.jumpTo(u)` | scroll to a point, e.g. `Cutaway.jumpTo(9)` for the end |
| `Cutaway.project(x, y)` | image pixel on the 1920×1080 frame to screen pixel |
| `Cutaway.config` | timing and framing values (below) |

Timing lives in the engine config. Scroll length is 9 screens: the building holds until 0.7, the cutaway opens until 3.2, the camera pushes in until 5.4, and the rest is left for the UI (layer naming starts at 5.6). Override any value without editing the engine by adding `window.CUTAWAY_CONFIG = { ... }` before it loads.

**UI** (`src/ui/`). Everything a visitor reads or clicks. It only reads `window.Cutaway` and `window.CUTAWAY_LAYERS`, so it can be replaced completely. Every class and id starts with `cw-` so Webflow's site styles don't clash with it.

**Data** (`src/data/layers.js`). One entry per layer, outside to inside. Change copy, costs, colours or dot positions here. Dot positions are pixels on the final 1920×1080 frame (the last frame in the sequence).

## Making a change

1. Edit files in `src/` only.
2. Run `python build/build.py`. It prints the size of each Webflow block; each must stay under 50,000 characters.
3. Open `dist/preview/index-local.html` in a browser to check.
4. Paste `dist/webflow/head.html` and `dist/webflow/footer.html` into the Webflow page's custom code, or ask Claude to push them.

## Releasing a version

1. Bump `VERSION`. Use `1.x.0` for a UI redesign, `1.0.x` for a fix or copy change, and `2.0.0` if the engine or animation changes.
2. Add an entry at the top of `CHANGELOG.md`.
3. Run `python build/build.py --release`. This freezes `dist/` and `src/` into `releases/v<version>/`.
4. Push to Webflow. To roll back, paste the two files from an older `releases/` folder.

## Still to do before this is public

- Replace the placeholder costs in `layers.js` with real supplier figures, or remove the cost features.
- Check the layer descriptions against the manufacturer's product literature.
- A lighter frame set for phones. Webflow already stores 500 px versions of every frame (`-p-500.webp`), which could be used there.
