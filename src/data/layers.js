/* Building Cutaway — content and Figma annotation geometry.
 * Items are numbered inside to outside: 01 Plasterboard -> 09 Cladding.
 * Reveal still runs outside to inside. Costs and chapter copy remain placeholders.
 * anchor: image pixels on the 1920 x 1080 final frame, projected by Cutaway.
 * labelY / leaderBendX: positions on the 1440 x 900 Figma board, adapted by the UI.
 * Source: UI refinements / Desktop Layer details with Close (43:200), 18 Oct 2026.
 */
window.CUTAWAY_LAYERS = {
  "currency": "£",
  "unit": "per m²",
  "costsArePlaceholder": true,
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
      "body": "From cladding to plasterboard, nine layers work together for fire, thermal and acoustic performance.",
      "in": 3.2,
      "out": 5.4
    },
    {
      "eyebrow": "04 / 04",
      "title": "9 layers. One system.",
      "body": "Select a layer to see what it does and what it costs.",
      "in": 5.4,
      "out": null,
      "top": true
    }
  ],
  "items": [
    {
      "name": "Plasterboard",
      "label": "Plasterboard",
      "anchor": [
        1089.6,
        129.6
      ],
      "labelY": 340,
      "cost": 18,
      "description": "The internal lining, taped, finished and decorated. The only layer the residents ever see.",
      "spec": [
        [
          "Type",
          "Gypsum board"
        ],
        [
          "Finish",
          "Taped and painted"
        ]
      ],
      "leaderBendX": 520
    },
    {
      "name": "SFS studs",
      "label": "SFS studs",
      "anchor": [
        879.6,
        348.0
      ],
      "labelY": 392,
      "cost": 34,
      "description": "Light-gauge galvanised steel C-sections spanning slab to slab. The structural frame of the infill wall, carrying wind load back to the floors.",
      "spec": [
        [
          "Material",
          "Galvanised steel"
        ],
        [
          "Spans",
          "Floor to floor"
        ]
      ],
      "leaderBendX": 560
    },
    {
      "name": "Insulation",
      "label": "Insulation",
      "anchor": [
        981.6,
        555.6
      ],
      "labelY": 444,
      "cost": 12,
      "description": "Mineral wool fitted between the studs, adding thermal and acoustic performance inside the frame.",
      "spec": [
        [
          "Material",
          "Mineral wool"
        ],
        [
          "Position",
          "Between studs"
        ]
      ],
      "leaderBendX": null
    },
    {
      "name": "Sheathing boards",
      "label": "Sheathing boards",
      "anchor": [
        1104.0,
        618.0
      ],
      "labelY": 496,
      "cost": 24,
      "description": "Cement-based boards screwed to the outer face of the studs. They brace the frame and give the membrane and brackets something solid to fix to.",
      "spec": [
        [
          "Type",
          "Cement-based board"
        ],
        [
          "Role",
          "Bracing and substrate"
        ]
      ],
      "leaderBendX": null
    },
    {
      "name": "Breather membrane",
      "label": "Breather membrane",
      "anchor": [
        1257.6,
        680.4
      ],
      "labelY": 548,
      "cost": 5,
      "description": "A vapour-permeable, water-resistant sheet. It keeps wind-driven rain off the boards while letting moisture from inside escape.",
      "spec": [
        [
          "Role",
          "Weather line"
        ],
        [
          "Property",
          "Vapour-open"
        ]
      ],
      "leaderBendX": null
    },
    {
      "name": "Brackets & rails",
      "label": "Bracket & rails",
      "anchor": [
        1294.8,
        742.8
      ],
      "labelY": 600,
      "cost": 30,
      "description": "Aluminium brackets fixed back through to the SFS frame, carrying the vertical rails the cladding hangs on. They set the depth of the cavity.",
      "spec": [
        [
          "Material",
          "Aluminium"
        ],
        [
          "Sets",
          "Cavity depth and line"
        ]
      ],
      "leaderBendX": null
    },
    {
      "name": "Fire barriers",
      "label": "Fire barriers",
      "anchor": [
        1182.0,
        805.2
      ],
      "labelY": 652,
      "cost": 8,
      "description": "Cavity barriers at each floor line and around openings. They stop fire and smoke travelling up the gap behind the cladding.",
      "spec": [
        [
          "Type",
          "Open-state cavity barrier"
        ],
        [
          "Where",
          "Floor lines and openings"
        ]
      ],
      "leaderBendX": null
    },
    {
      "name": "Rainscreen insulation",
      "label": "Rainscreen insulation",
      "anchor": [
        1335.6,
        867.6
      ],
      "labelY": 704,
      "cost": 22,
      "description": "Mineral wool slabs fixed outside the sheathing. Wrapping the frame from the outside keeps the steel warm and cuts cold bridging at every stud.",
      "spec": [
        [
          "Material",
          "Stone mineral wool"
        ],
        [
          "Position",
          "In the ventilated cavity"
        ]
      ],
      "leaderBendX": null
    },
    {
      "name": "Fibre cement cladding",
      "label": "Cladding",
      "anchor": [
        1599.6,
        962.4
      ],
      "labelY": 756,
      "cost": 95,
      "description": "Fibre cement rainscreen panels. The finished face of the building, hung clear of the wall so any water that gets behind drains away down the cavity.",
      "spec": [
        [
          "Type",
          "Fibre cement panel"
        ],
        [
          "Fixing",
          "Clips onto vertical rails"
        ]
      ],
      "leaderBendX": null
    }
  ],
  "design": {
    "fileKey": "JRckNrWn8mJHfyI6Ywihqz",
    "annotationFrame": "43:200",
    "closeDefault": "41:79",
    "scrollIndicator": "41:88",
    "width": 1440,
    "height": 900
  }
};
