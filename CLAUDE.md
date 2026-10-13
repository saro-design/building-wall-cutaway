# Building Cutaway — build brief for Claude Code

You are rebuilding the UI of this repo to match the Figma design (V1, Oct 2026). The scroll animation engine stays. The result is a PTG-branded, single-page web experience, hosted on Cloudflare Pages and linked from Sarvesh's Webflow portfolio.

The owner is Sarvesh, a product designer who is learning Git. Explain git steps in one line each when you run them. Commit in small, well-named steps.

---

## 1. Source of truth: Figma

- **File:** https://www.figma.com/design/JRckNrWn8mJHfyI6Ywihqz (Figma account sarveshchitnis@gmail.com, connect the Figma MCP with it)
- **Design system basis:** Paperpillar "E-commerce Website UI Kit": https://www.figma.com/design/xOLQdp5kS4t7B60foQoWKz (reference only)
- Use `get_design_context` and `get_screenshot` on the nodes below. Match spacing, type and colour from the file, not from memory.

| What | Page | Node ID |
|---|---|---|
| Foundations (colours, type, spacing, effects) | Foundations | `1:2` |
| Nav Bar | Components | `4:15` |
| Button (Primary/Ghost × Default/Hover/Focus/Pressed) | Components | `4:14` |
| Chapter Caption | Components | `4:30` |
| Frost Panel | Components | `4:36` |
| Layer Label (chip: Default/Active/Dim) | Components | `5:17` |
| Layer Marker (Default/Active) | Components | `5:25` |
| Layer Card | Components | `5:26` |
| PTG Logo | Components | `2:81` |
| Cutaway Sequence (39 key frames) | Sequence | `2:80` |
| Prototype, 53 steps (frame names start `01 ·` … `53 ·`) | Prototype | `1:5` |

Key prototype steps to screenshot and match:

| Step | Node | Shows |
|---|---|---|
| 01 Hero | `6:2` | Full-screen frost, tagline |
| 03 Hero | `6:395` | Frost half faded |
| 05 Envelope | `6:767` | Frost gone, chapter 01 |
| 15 Envelope | `6:2747` | Cut open, chapter 02 |
| 30 System | `6:5842` | Push-in, chapter 03 |
| 51 Explore | `6:10000` | All 11 layer chips + leaders |
| 52 Layer selected | `6:10198` | Active chip + Layer Card |
| 53 Contact | `6:10432` | Contact section |

---

## 2. Design tokens (CSS custom properties)

Only five colours. Do not add more.

```css
:root{
  /* Primary — PTG logo */
  --navy:#1A3156;  --blue:#25A4DE;  --lime:#A2B92E;
  /* Secondary — neutrals */
  --charcoal:#16191D;  --paper:#F4F5F4;
  /* Same neutrals at opacity */
  --frost:rgb(244 245 244 / .55);   /* + backdrop-filter: blur(64px) */
  --glass:rgb(244 245 244 / .85);   /* + backdrop-filter: blur(20px) */
  --line:rgb(22 25 29 / .14);
  /* Semantic */
  --text:var(--charcoal); --text-2:var(--navy); --text-inverse:var(--paper);
  --accent:var(--lime);   --focus:var(--blue);
  /* Spacing 4-pt: 4 8 12 16 24 32 48 72 96 · Radius: 4 8 16 24 999 */
}
```

Type: **Inter** only (Google Fonts, weights 400 and 500).

| Style | Size / line-height | Tracking | Case | Use |
|---|---|---|---|---|
| Display/XL | 88 / 84% | -5% | Sentence | Hero tagline |
| Display/L | 56 / 100% | -5% | Sentence | Chapter titles, price |
| Heading/M | 32 / 110% | -3% | Sentence | Card title |
| Body/L | 18 / 150% | -1% | — | Hero + chapter body |
| Body/M | 16 / 160% | -1% | — | Card body |
| Body/S | 14 / 155% | -0.5% | — | Spec values, legal |
| Eyebrow | 12 / 150%, 500 | +8% | UPPER | Chapter markers |
| Label/M | 13 / 140%, 500 | +6% | UPPER | Layer chips |
| Label/S | 12 / 140%, 500 | +6% | UPPER | Nav, buttons, spec keys |
| Mono/S | 12, 500, `tabular-nums` | +2% | — | Layer numbers |

Use `clamp()` so Display sizes scale between 1280 and 1920 wide. Desktop (1280–2560) is the primary target; phones get the existing narrow layout.

---

## 3. What to build

Keep `src/engine/cutaway-engine.js` (frames, scroll timeline, canvas, `window.Cutaway` API). Rewrite `src/ui/*` and update `src/data/layers.js`.

**Scroll story** (engine units u = screens, 0–9):

| u | Image | UI |
|---|---|---|
| 0 → 0.9 | Hold, f1–16 | Full-screen **frost** fades smoothly to nothing: opacity 1 → 0 **and** blur 64 → 0px together. Hero fades and rises 56px as it goes. **No partition, no hard edge.** |
| 0.3 → 9 | — | Soft left **wash** for text legibility: `linear-gradient(90deg, rgb(244 245 244/.92) 0%, rgb(244 245 244/.72) 30%, transparent 55%)`, fading in as the frost fades out |
| 0.7 → 1.9 | Cut starts | Chapter **01 / 04 · The building envelope** |
| 1.9 → 3.2 | Cut opens | Chapter **02 / 04 · Through-wall SFS** |
| 3.2 → 5.4 | Push-in | Chapter **03 / 04 · Built in layers** |
| 5.4 → 9 | Final frame | Chapter **04 / 04 · 11 layers. One system.** at top-left. 11 layer chips reveal one per step (existing `revealStart`/`revealStep`) |
| after 9 | — | Normal section: **Contact**, frost returns |

Chapter text: fade + 24px rise in, fade + 40px rise out, slow 3px drift per step while visible.

**Hero copy**
- Eyebrow: `Building envelope systems` (lime 28×3 bar before it)
- Title (Display/XL): `Manufacturing innovation.` / `Constructing excellence.`
- Body: `Fire, thermal and acoustic insulation for the building envelope. Scroll to see how the through-wall system comes together.`
- **No** "scroll to look inside" cue. **No** progress rail.

**Nav** (fixed, top 16px, side 16px): two glass pills.
- Left: PTG logo (`assets/ptg-logo.png`, about 115×48). Link to `#top`.
- Right: `Home` `Products` `About us` (Label/S, charcoal) + **Contact** primary button (scrolls to contact).

**Layer chips** (left column, x = 72px, rows 46px apart, sorted by anchor y so leaders don't cross):
- Pill, 6/16/6/6 padding, 24px number circle (Mono/S) + label (Label/M).
- Default: glass + 1px `--line`. Active: charcoal chip, paper text, lime number. Dim (when another is selected): 80% opacity.

**Leader lines:** orthogonal: horizontal from chip end (+12px) to the anchor x, then vertical to the anchor. 1.5px charcoal at 80%, with a 2px paper halo.

**Markers** at each `anchor` (convert 1920×1080 image px → screen with `Cutaway.project`):
- 44×44 hit area; visible: 30px charcoal 1.5px outline, 26px paper ring (2.5px), 10px lime centre.
- Active: lime ring, charcoal centre, 44px lime halo at 60%.

**Layer Card** (shown when a layer is selected): fixed top-right (about 1030, 154 on a 1440 screen), 400px wide, glass + blur 20, radius 24, padding 32.
- Eyebrow `Layer 01 of 11 · outermost` → Heading/M name → Body/M description → 2 spec rows (Label/S key 90px + Body/S value) → hairline → price `£95` (Display/L) + `per m² · 42% of build-up` (Label/S) → `← Outer` / `Inner →` ghost buttons.

**Buttons:** pill, 12/24 padding, Label/S.
- Primary: charcoal bg, paper text, navy on hover.
- Ghost: 1px charcoal outline, glass on hover.
- Focus: `box-shadow: 0 0 0 2px var(--paper), 0 0 0 4px var(--blue)`. Pressed: 82% opacity.

**Contact section:**
- Title (Display/XL) `Talk to our technical team`.
- Body: `Specify the complete through-wall system, from frame and insulation to boards, membranes and cladding, with a single team.`
- Buttons: primary `Email the team` (mailto placeholder) + ghost `Download the spec sheet` (`#`).
- Legal row: small logo + `© 2026 Performance Technology Group`.

**Interaction:** click a marker or chip → select (card opens). ←/→ or Outer/Inner step layers. Esc closes. Selecting scrolls nothing.

---

## 4. Quality bar (must pass)

- WCAG AA: body text ≥ 4.5:1, large text/UI ≥ 3:1. Never put lime text on paper (2:1).
- Every interactive element: hover, `:focus-visible`, active. Logical tab order: nav → chips → card.
- `prefers-reduced-motion`: no crossfades or rises; frost is simply gone after the hero.
- Semantic HTML: `<header><nav>`, `<main>`, chips are `<button aria-pressed>`, card is `role="region" aria-live="polite"`, the canvas has an `aria-label` describing the cutaway.
- No layout shift; 60 fps scroll on a mid-range laptop; first frame visible in under 2 s on broadband.
- Looks right at 1280×720, 1440×900, 1920×1080 and 2560×1440. Phones: existing narrow layout still works.
- Compare each key step against its Figma screenshot before calling it done.

---

## 5. Repo, build and deploy

**Branching**
1. Start from `main`. Create `redesign/v1.2.0`.
2. The frames are tracked on branch `ci/staging` but not on `main`. Bring them in: `git checkout ci/staging -- frames .gitignore`.
3. Delete `.github/workflows/staging.yml` if present. Hosting moves to Cloudflare Pages; the GitHub Pages staging is retired.

**Branding:** this repo is now PTG-branded (agreed with the client). The logo is already at `assets/ptg-logo.png` (untracked; commit it). It's low-res until PTG sends an SVG; keep the file name so it can be swapped.

**Build:** update `build/build.py` so that `python3 build/build.py` produces a deployable `dist/`:
- `dist/index.html` (frames base `frames/`)
- `dist/frames/` (copy of `frames/`)
- `dist/assets/`
- `dist/_headers` with long cache for `/frames/*` and `/assets/*`: `Cache-Control: public, max-age=31536000, immutable`
- Terser is optional. Skip it gracefully if not installed (Cloudflare's build image may not have it).

**Cloudflare Pages settings** (set by Sarvesh in the dashboard):
- Framework preset: None
- Build command: `python3 build/build.py`
- Build output directory: `dist`
- Production branch: `main`
- Every other branch gets a preview URL.

**Docs:**
- Update `README.md`: PTG-branded, live URL `https://cutaway.sarvesh.co.uk`, preview URLs, Cloudflare instead of Webflow/GitHub Pages.
- Update `CHANGELOG.md` with v1.2.0 "UI redesign to Figma V1 design system".
- Update `docs/git-workflow.md`.
- Bump `VERSION` to 1.2.0.

**Finish:**
1. Push the branch.
2. Open a pull request to `main` with before/after screenshots of steps 01, 15, 51 and 52.
3. After Sarvesh merges, tag `v1.2.0` and create a GitHub Release.

---

## 6. Don't

- Don't change the engine's frame timing or the 198 frames.
- Don't add colours, fonts or a framework (no React/Vite needed; plain HTML/CSS/JS).
- Don't bring back "Inside the wall", the scroll cue or the progress rail.
- Costs and chapter body copy are placeholders. Keep them in `src/data/layers.js` / one copy file so they're easy to replace.
