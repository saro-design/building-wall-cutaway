/*
 * Building Cutaway — content
 * Edit this file to change copy, specs and costs. No code changes needed.
 *  chapters  scroll story captions. in/out = scroll position in screens (0–9); out:null = stays to the end.
 *            top:true = shown top-left (chapter 04), otherwise lower-left.
 *  items     the 11 layers, outside to inside = the order they are revealed.
 *    label   chip text
 *    anchor  [x, y] of the marker, in pixels on the 1920x1080 final frame
 *    labelY  y of the chip row on the final frame. Leaders run across at labelY, then up/down to the anchor.
 *  labelX    x where every chip ends (right-aligned), on the final frame
 *    cost    GBP per m2 of wall. PLACEHOLDER RATES until real figures are supplied.
 *  revealStart / revealStep  when the chips appear: one per step, from revealStart (screens).
 * Chapter body copy and costs are PLACEHOLDERS.
 */
window.CUTAWAY_LAYERS = {
  "currency": "£",
  "unit": "per m²",
  "costsArePlaceholder": true,
  "labelX": 520,
  "revealStart": 5.6,
  "revealStep": 0.245,
  "chapters": [
    {
      "eyebrow": "01 / 04",
      "title": "The building envelope",
      "body": "Peel back the facade of a five-storey apartment block and see what keeps it warm, dry and safe.",
      "in": 0.7,
      "out": 1.9
    },
    {
      "eyebrow": "02 / 04",
      "title": "Through-wall SFS",
      "body": "Light-gauge steel studs span slab to slab, carrying the whole envelope outside the structure.",
      "in": 1.9,
      "out": 3.2
    },
    {
      "eyebrow": "03 / 04",
      "title": "Built in layers",
      "body": "From cladding to plasterboard, eleven layers work together for fire, thermal and acoustic performance.",
      "in": 3.2,
      "out": 5.4
    },
    {
      "eyebrow": "04 / 04",
      "title": "11 layers. One system.",
      "body": "Select a layer to see what it does and what it costs.",
      "in": 5.4,
      "out": 7.2,
      "top": true
    }
  ],
  "items": [
    {
      "name": "Fibre cement cladding",
      "label": "Cladding",
      "anchor": [1600, 962],
      "labelY": 962,
      "cost": 95,
      "description": "Fibre cement rainscreen panels. The finished face of the building, hung clear of the wall so any water that gets behind drains away down the cavity.",
      "spec": [
        ["Type", "Fibre cement panel"],
        ["Fixing", "Clips onto vertical rails"]
      ]
    },
    {
      "name": "Rainscreen insulation",
      "label": "Rainscreen insulation",
      "anchor": [1335, 890],
      "labelY": 890,
      "cost": 22,
      "description": "Mineral wool slabs fixed outside the sheathing. Wrapping the frame from the outside keeps the steel warm and cuts cold bridging at every stud.",
      "spec": [
        ["Material", "Stone mineral wool"],
        ["Position", "In the ventilated cavity"]
      ]
    },
    {
      "name": "Fire barriers",
      "label": "Fire barriers",
      "anchor": [1182, 819],
      "labelY": 819,
      "cost": 8,
      "description": "Cavity barriers at each floor line and around openings. They stop fire and smoke travelling up the gap behind the cladding.",
      "spec": [
        ["Type", "Open-state cavity barrier"],
        ["Where", "Floor lines and openings"]
      ]
    },
    {
      "name": "Brackets & rails",
      "label": "Bracket & rails",
      "anchor": [1295, 747],
      "labelY": 747,
      "cost": 30,
      "description": "Aluminium brackets fixed back through to the SFS frame, carrying the vertical rails the cladding hangs on. They set the depth of the cavity.",
      "spec": [
        ["Material", "Aluminium"],
        ["Sets", "Cavity depth and line"]
      ]
    },
    {
      "name": "Breather membrane",
      "label": "Breather membrane",
      "anchor": [1258, 676],
      "labelY": 676,
      "cost": 5,
      "description": "A vapour-permeable, water-resistant sheet. It keeps wind-driven rain off the boards while letting moisture from inside escape.",
      "spec": [
        ["Role", "Weather line"],
        ["Property", "Vapour-open"]
      ]
    },
    {
      "name": "Sheathing boards",
      "label": "Sheathing boards",
      "anchor": [1104, 604],
      "labelY": 604,
      "cost": 24,
      "description": "Cement-based boards screwed to the outer face of the studs. They brace the frame and give the membrane and brackets something solid to fix to.",
      "spec": [
        ["Type", "Cement-based board"],
        ["Role", "Bracing and substrate"]
      ]
    },
    {
      "name": "Insulation",
      "label": "Insulation",
      "anchor": [982, 545],
      "labelY": 436,
      "cost": 12,
      "description": "Mineral wool fitted between the studs, adding thermal and acoustic performance inside the frame.",
      "spec": [
        ["Material", "Mineral wool"],
        ["Position", "Between studs"]
      ]
    },
    {
      "name": "SFS studs",
      "label": "SFS studs",
      "anchor": [880, 348],
      "labelY": 349,
      "cost": 34,
      "description": "Light-gauge galvanised steel C-sections spanning slab to slab. The structural frame of the infill wall, carrying wind load back to the floors.",
      "spec": [
        ["Material", "Galvanised steel"],
        ["Spans", "Floor to floor"]
      ]
    },
    {
      "name": "SFS head track",
      "label": "SFS head track",
      "anchor": [1322, 122],
      "labelY": 285,
      "cost": 5,
      "description": "A deflection track fixed under the slab above. It lets the slab move without pushing load down into the studs.",
      "spec": [
        ["Fixed to", "Underside of slab"],
        ["Allows", "Slab deflection"]
      ]
    },
    {
      "name": "SFS base track",
      "label": "SFS base track",
      "anchor": [1273, 45],
      "labelY": 220,
      "cost": 4,
      "description": "Track fixed to the slab that locates the foot of every stud.",
      "spec": [
        ["Fixed to", "Top of slab"],
        ["Role", "Locates the studs"]
      ]
    },
    {
      "name": "Plasterboard",
      "label": "Plasterboard",
      "anchor": [1090, 130],
      "labelY": 130,
      "cost": 18,
      "description": "The internal lining, taped, finished and decorated. The only layer the residents ever see.",
      "spec": [
        ["Type", "Gypsum board"],
        ["Finish", "Taped and painted"]
      ]
    }
  ]
};
