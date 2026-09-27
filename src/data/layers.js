/*
 * Building Wall Cutaway — Layer content
 * Edit this file to change names, copy, specs and costs. No code changes needed.
 *  anchor  = [x, y] of the dot, in pixels on the 1920x1080 final frame
 *  labelY  = y of the label row on desktop (x is set by labelX)
 *  cost    = GBP per m2 of wall. PLACEHOLDER RATES until real figures are supplied.
 * Order = outside to inside = the order layers are revealed.
 */
window.CUTAWAY_LAYERS = {
  "labelX": 520,
  "currency": "£",
  "unit": "/m²",
  "costsArePlaceholder": true,
  "revealStart": 5.6,
  "revealStep": 0.245,
  "items": [
    {
      "name": "Fibre cement cladding",
      "label": "Cladding",
      "anchor": [
        1600,
        962
      ],
      "labelY": 962,
      "cost": 95,
      "colour": "#9d5a3c",
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
      ]
    },
    {
      "name": "Rainscreen insulation",
      "label": "Rainscreen insulation",
      "anchor": [
        1335,
        890
      ],
      "labelY": 890,
      "cost": 22,
      "colour": "#dcb57a",
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
      ]
    },
    {
      "name": "Fire barriers",
      "label": "Fire barriers",
      "anchor": [
        1182,
        819
      ],
      "labelY": 819,
      "cost": 8,
      "colour": "#e9e8e3",
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
      ]
    },
    {
      "name": "Brackets & rails",
      "label": "Bracket & rails",
      "anchor": [
        1295,
        747
      ],
      "labelY": 747,
      "cost": 30,
      "colour": "#b7bcc2",
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
      ]
    },
    {
      "name": "Breather membrane",
      "label": "Breather membrane",
      "anchor": [
        1258,
        676
      ],
      "labelY": 676,
      "cost": 5,
      "colour": "#4a4e54",
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
      ]
    },
    {
      "name": "Sheathing boards",
      "label": "Sheathing boards",
      "anchor": [
        1104,
        604
      ],
      "labelY": 604,
      "cost": 24,
      "colour": "#a9aaa8",
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
      ]
    },
    {
      "name": "Insulation",
      "label": "Insulation",
      "anchor": [
        982,
        545
      ],
      "labelY": 436,
      "cost": 12,
      "colour": "#e2c08a",
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
      ]
    },
    {
      "name": "SFS studs",
      "label": "SFS studs",
      "anchor": [
        880,
        348
      ],
      "labelY": 349,
      "cost": 34,
      "colour": "#c6cace",
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
      ]
    },
    {
      "name": "SFS head track",
      "label": "SFS head",
      "anchor": [
        1322,
        122
      ],
      "labelY": 285,
      "cost": 5,
      "colour": "#9fa5ac",
      "description": "A deflection track fixed under the slab above. It lets the slab move without pushing load down into the studs.",
      "spec": [
        [
          "Fixed to",
          "Underside of slab"
        ],
        [
          "Allows",
          "Slab deflection"
        ]
      ]
    },
    {
      "name": "SFS base track",
      "label": "SFS base",
      "anchor": [
        1273,
        45
      ],
      "labelY": 220,
      "cost": 4,
      "colour": "#8d949b",
      "description": "Track fixed to the slab that locates the foot of every stud.",
      "spec": [
        [
          "Fixed to",
          "Top of slab"
        ],
        [
          "Role",
          "Locates the studs"
        ]
      ]
    },
    {
      "name": "Plasterboard",
      "label": "Plasterboard",
      "anchor": [
        1090,
        130
      ],
      "labelY": 130,
      "cost": 18,
      "colour": "#f4f4f2",
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
      ]
    }
  ]
};
