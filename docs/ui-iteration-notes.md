# UI iteration notes

The UI is still being designed. Use this file to log each design round so the reasoning survives. Add new rounds at the top.

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
