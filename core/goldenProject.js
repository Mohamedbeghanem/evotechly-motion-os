"use strict";

/**
 * Golden project seed — names, sizes, layer roles, idempotency.
 * Numbers only. ae/Seed Golden Project.jsx builds these comps in AE.
 * No .aep binary. Native AE only.
 */

const { SAFE } = require("./captions");
const { JOB_TABS } = require("./editorFreeKit");

const COMP_NAMES = ["00_HOME", "ERP_DEMO", "TALKING_HEAD", "REEL_9x16"];

const META_NULL = "EVO_GOLDEN_META";

const FPS = 30;
const DESKTOP = { width: 1920, height: 1080, duration: 10 };
const REEL = { width: 1080, height: 1920, duration: 15 };
const TALK = { width: 1920, height: 1080, duration: 15 };

const REQUIRED_TABS = [
  "Motion",
  "Polish",
  "Person",
  "Captions",
  "Recipes",
  "Interact",
  "Window → SaaS Demo Tools"
];

const META_COMMENT = [
  "Evotechly Motion OS golden seed (Phase 3).",
  "Required tabs: " + REQUIRED_TABS.join(", ") + ".",
  "Jobs: ERP_DEMO = SaaS shot · TALKING_HEAD = Person/Captions · REEL_9x16 = hook/captions.",
  "SaaS Demo buttons: Cursor + click, Depth reveal, Stagger reveal, Carousel setup, Glass Panel, Gradient Wipe, Proximity Hover.",
  "See docs/QUICK_START.md."
].join(" ");

const JOB_MAP = {
  saas: {
    job: "SaaS shot",
    comp: "ERP_DEMO",
    tabs: [
      "Motion (Style / Direction / Shot / Scan / Apply)",
      "Polish (Apple Ease, click squash)",
      "Interact (click / hover / drag)",
      "Recipes (ERP demo)"
    ],
    saasDemo: [
      "Cursor + click",
      "Depth reveal (selected)",
      "Stagger reveal (selected)",
      "Carousel setup (selected)",
      "Glass Panel (selected)",
      "Gradient Wipe (selected)",
      "Proximity Hover (selected)"
    ]
  },
  talkingHead: {
    job: "Talking-head",
    comp: "TALKING_HEAD",
    tabs: [
      "Person (Cutout Prep / Keylight / Light wrap / Talking-head stack)",
      "Captions (AR+EN, SRT, lower-third)",
      "Motion (Scan / Apply after names exist)",
      "Polish (ease only — Wet / Glow off)"
    ],
    saasDemo: []
  },
  reel: {
    job: "Reel / hook",
    comp: "REEL_9x16",
    tabs: [
      "Motion (Hook / Kinetic type / UI punch-in / Logo sting / Captions)",
      "Captions (hook, kinetic, AR+EN)",
      "Polish (Wet look on hooks & logo sting only)",
      "Recipes (15s hook reminders)"
    ],
    saasDemo: ["Stagger reveal (selected)", "Gradient Wipe (selected)"]
  }
};

function exactName(name) {
  return String(name == null ? "" : name);
}

function existingCompNames(list) {
  if (!list) return [];
  if (!Array.isArray(list)) return [];
  return list.map(exactName);
}

function hasComp(existing, name) {
  const want = exactName(name);
  const names = existingCompNames(existing);
  for (let i = 0; i < names.length; i++) {
    if (names[i] === want) return true;
  }
  return false;
}

function compsToCreate(existing) {
  return COMP_NAMES.filter(function (name) {
    return !hasComp(existing, name);
  });
}

function compsToSkip(existing) {
  return COMP_NAMES.filter(function (name) {
    return hasComp(existing, name);
  });
}

function desktopSpec(name, duration) {
  return {
    name: name,
    width: DESKTOP.width,
    height: DESKTOP.height,
    duration: duration == null ? DESKTOP.duration : duration,
    fps: FPS,
    pixelAspect: 1,
    frame: "wide169"
  };
}

function reelGuideLayers() {
  const w = REEL.width;
  const h = REEL.height;
  const m = SAFE.reel916;
  const topH = Math.round(h * m.top);
  const botH = Math.round(h * m.bottom);
  const sideW = Math.round(w * m.side);
  return [
    {
      name: "SAFE_TOP",
      kind: "guide",
      role: null,
      size: [w, topH],
      position: [w / 2, topH / 2]
    },
    {
      name: "SAFE_BOTTOM",
      kind: "guide",
      role: null,
      size: [w, botH],
      position: [w / 2, h - botH / 2]
    },
    {
      name: "SAFE_LEFT",
      kind: "guide",
      role: null,
      size: [sideW, h],
      position: [sideW / 2, h / 2]
    },
    {
      name: "SAFE_RIGHT",
      kind: "guide",
      role: null,
      size: [sideW, h],
      position: [w - sideW / 2, h / 2]
    },
    {
      name: "Hook",
      kind: "text",
      role: "caption",
      text: "Hook caption",
      position: [w / 2, Math.round(h * 0.42)]
    },
    {
      name: "Kinetic",
      kind: "text",
      role: "caption",
      text: "Kinetic caption",
      position: [w / 2, Math.round(h * 0.62)]
    },
    {
      name: "Caption AR",
      kind: "text",
      role: "caption",
      text: "Caption AR",
      position: [w / 2, Math.round(h * 0.72)]
    },
    {
      name: "Caption EN",
      kind: "text",
      role: "caption",
      text: "Caption EN",
      position: [w / 2, Math.round(h * 0.78)]
    },
    {
      name: "Caption",
      kind: "text",
      role: "caption",
      text: "Caption",
      position: [w / 2, Math.round(h * 0.86)]
    }
  ];
}

function erpLayers() {
  return [
    {
      name: "Nav",
      kind: "shape",
      role: "nav",
      size: [1840, 56],
      position: [960, 48],
      color: [0.12, 0.16, 0.22]
    },
    {
      name: "Sidebar",
      kind: "shape",
      role: "sidebar",
      size: [220, 920],
      position: [130, 560],
      color: [0.1, 0.13, 0.18]
    },
    {
      name: "Title",
      kind: "shape",
      role: "title",
      size: [420, 48],
      position: [560, 160],
      color: [0.22, 0.3, 0.42]
    },
    {
      name: "Subtitle",
      kind: "shape",
      role: "subtitle",
      size: [380, 28],
      position: [540, 214],
      color: [0.18, 0.24, 0.34]
    },
    {
      name: "CTA",
      kind: "shape",
      role: "cta",
      size: [168, 44],
      position: [434, 280],
      color: [0.25, 0.48, 0.95]
    },
    {
      name: "Screenshot",
      kind: "shape",
      role: "screenshot",
      size: [720, 400],
      position: [1200, 400],
      color: [0.2, 0.28, 0.4]
    },
    {
      name: "Card 1",
      kind: "shape",
      role: "card",
      size: [360, 200],
      position: [560, 820],
      color: [0.16, 0.22, 0.32]
    },
    {
      name: "Card 2",
      kind: "shape",
      role: "card",
      size: [360, 200],
      position: [960, 820],
      color: [0.16, 0.22, 0.32]
    },
    {
      name: "Card 3",
      kind: "shape",
      role: "card",
      size: [360, 200],
      position: [1360, 820],
      color: [0.16, 0.22, 0.32]
    },
    {
      name: "Cursor",
      kind: "shape",
      role: "cursor",
      size: [18, 24],
      position: [1400, 500],
      color: [1, 1, 1]
    }
  ];
}

function talkingHeadLayers() {
  return [
    {
      name: "BG",
      kind: "solid",
      role: null,
      size: [DESKTOP.width, DESKTOP.height],
      position: [DESKTOP.width / 2, DESKTOP.height / 2],
      color: [0.08, 0.09, 0.1]
    },
    {
      name: "Product UI / L3",
      kind: "shape",
      role: "dashboard",
      size: [640, 360],
      position: [1480, 780],
      color: [0.18, 0.24, 0.34]
    },
    {
      name: "STACK_NOTE",
      kind: "text",
      role: null,
      text: "Mid-stack: Captions. Person tab → Talking-head stack. Replace VIDEO_PLACEHOLDER.",
      position: [960, 980]
    },
    {
      name: "Caption EN",
      kind: "text",
      role: "caption",
      text: "Caption EN",
      position: [960, 900]
    },
    {
      name: "Caption AR",
      kind: "text",
      role: "caption",
      text: "Caption AR",
      position: [960, 850]
    },
    {
      name: "Caption",
      kind: "text",
      role: "caption",
      text: "Caption",
      position: [960, 800]
    },
    {
      name: "CUTOUT",
      kind: "shape",
      role: null,
      size: [420, 640],
      position: [960, 460],
      color: [0.14, 0.42, 0.28]
    },
    {
      name: "VIDEO_PLACEHOLDER",
      kind: "solid",
      role: null,
      size: [960, 540],
      position: [960, 420],
      color: [0.18, 0.2, 0.24]
    }
  ];
}

function homeLayers() {
  return [
    {
      name: "Title",
      kind: "text",
      role: "title",
      text: "Evotechly Motion OS — Golden Project",
      position: [960, 160]
    },
    {
      name: "Note",
      kind: "text",
      role: null,
      text: "ERP_DEMO · TALKING_HEAD · REEL_9x16 — see docs/QUICK_START.md",
      position: [960, 230]
    },
    {
      name: "ERP_DEMO",
      kind: "precomp",
      role: null,
      position: [480, 640]
    },
    {
      name: "TALKING_HEAD",
      kind: "precomp",
      role: null,
      position: [960, 640]
    },
    {
      name: "REEL_9x16",
      kind: "precomp",
      role: null,
      position: [1500, 640]
    },
    {
      name: META_NULL,
      kind: "null",
      role: null,
      shy: true,
      guide: true,
      comment: META_COMMENT,
      position: [80, 80]
    }
  ];
}

function specFor(name) {
  if (name === "REEL_9x16") {
    return {
      name: "REEL_9x16",
      width: REEL.width,
      height: REEL.height,
      duration: REEL.duration,
      fps: FPS,
      pixelAspect: 1,
      frame: "reel916",
      layers: reelGuideLayers()
    };
  }
  if (name === "ERP_DEMO") {
    const spec = desktopSpec("ERP_DEMO", DESKTOP.duration);
    spec.layers = erpLayers();
    return spec;
  }
  if (name === "TALKING_HEAD") {
    const spec = desktopSpec("TALKING_HEAD", TALK.duration);
    spec.layers = talkingHeadLayers();
    return spec;
  }
  const spec = desktopSpec("00_HOME", DESKTOP.duration);
  spec.layers = homeLayers();
  spec.meta = META_NULL;
  return spec;
}

function layerNamesFor(name) {
  return specFor(name).layers.map(function (layer) {
    return layer.name;
  });
}

function planGoldenProject(existingNames) {
  const existing = existingCompNames(existingNames);
  const created = compsToCreate(existing);
  const skipped = compsToSkip(existing);
  return {
    kind: "goldenProject",
    created: created.slice(),
    skipped: skipped.slice(),
    comps: created.map(specFor),
    meta: META_NULL,
    requiredTabs: REQUIRED_TABS.slice(),
    jobMap: JOB_MAP
  };
}

function jobFor(job) {
  return JOB_MAP[job] || JOB_MAP.saas;
}

module.exports = {
  COMP_NAMES,
  META_NULL,
  META_COMMENT,
  REQUIRED_TABS,
  FPS,
  DESKTOP,
  REEL,
  TALK,
  JOB_MAP,
  JOB_TABS,
  exactName,
  existingCompNames,
  hasComp,
  compsToCreate,
  compsToSkip,
  specFor,
  layerNamesFor,
  planGoldenProject,
  jobFor,
  erpLayers,
  talkingHeadLayers,
  reelGuideLayers,
  homeLayers
};
