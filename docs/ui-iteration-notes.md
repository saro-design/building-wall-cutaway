# UI iteration notes

The UI is still being designed. Use this file to log each design round so the reasoning survives. Add new rounds at the top.

## Round 3 — v1.2.2 (18 Oct 2026)

Sarvesh's latest edits on **UI refinements · 18 Oct** are the implementation reference, ahead of the older Prototype copies. Annotation frame: `43:200`. Marker centres were read directly after his edits. Layer numbers now run inside to outside (01 Plasterboard → 09 Cladding); the scroll reveal still runs outside to inside.

The edited **Default Close** (`41:79`) is canonical for all Close buttons. It separates “Close” (12 px) from × (18 px), uses a 6 px gap and 15/12 px horizontal padding in an 88 × 44 pill. Hover, Focus and Pressed variants were reconciled in Figma while retaining their state feedback. Do not revert to a single mixed-size text node. The scroll cue (`41:88`) likewise separates its 12 px label from a 24 px arrow with a 6 px gap; desktop instance `43:198` sits at x1236/y406 on the 1440 × 900 landing board.

Nine navy chips and revised markers follow the review board. The first two leaders use separate vertical risers; remaining lines meet the aligned material markers. Every segment stays horizontal or vertical. Labels adapt to shorter desktop screens and remain a wrapping control group on phones/near-square windows. The paper wash uses the exact Figma colour stops; a masked 40 px browser backdrop blur approximates Figma's progressive blur.

The existing public `focusX` setting centres the render like Figma. No engine source, frame assets, or timeline constants changed. Costs and destination links remain client placeholders. The removed tracks no longer contribute to the displayed cost total; percentages are calculated from the remaining nine entries.

## Round 2 — v1.2.1 (18 Oct 2026)

Requested finishing pass: responsive layout, explicit card dismissal and a right-side landing scroll cue. Figma carries the same controls for review on the separate "UI refinements · 18 Oct" page: https://www.figma.com/design/JRckNrWn8mJHfyI6Ywihqz?node-id=41-106 . Landing: 43:2; selected card: 43:200; near-square: 43:389; phone: 43:544. Reusable Close states: 41:83; scroll indicator: 41:88. The original Prototype navigation was not edited.

- Narrow framing reserves space for the measured caption/chip heights. This fixes the near-square case while preserving phone layout and the existing engine/animation.
- The card header includes a 44 px-high Close control. Clicking it or pressing Escape closes the card; keyboard focus returns to the active layer without scrolling.
- “Scroll down ↓” is a static, non-interactive cue at the lower right, fading with the hero. No looping motion is introduced.
- Placeholder prices and contact links are outside this finishing pass.

## Fixed for now (engine)

These come from the animation, so a UI redesign works around them:

- The frame is 16:9. Desktop crops it to fill the screen. Phones show it as a band across the top.
- Scroll 0–5.4 screens is the animation. 5.4–9 is free for the UI (currently the layer-naming sequence).
- Layer dot positions are fixed by the render. They are listed in `src/data/layers.js`.
- The left third of the final frame is a white interior wall. It is the natural place for labels.

## Round 1 — v1.0.0 (27 Sept 2026)

What's in: chapter captions, labels with leader lines echoing the film's own label style, right-hand column with header, layer card and cost bar.

Open questions to explore:

- Should the layers reveal one per scroll step (as now) or all at once, with the interaction doing the work?
- Is cost the right second dimension? Alternatives: fire rating, thickness, U-value contribution, supplier.
- Card position: right column (now), next to the selected label, or a bottom sheet on all sizes.
- Should selecting a layer highlight it in the render (needs a mask per layer from After Effects)?
- Type and colour: currently Barlow Condensed / Barlow / JetBrains Mono, ochre accent taken from the sheathing boards. Align with sarvesh.co.uk?
- Chapter copy is placeholder quality and should be rewritten.
