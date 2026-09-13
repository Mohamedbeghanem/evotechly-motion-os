"use strict";

/**
 * Editor Free Kit — companion reminders only.
 * Official vendor sites. Never bundled, never required, never redistributed.
 */

const POLICY =
  "Companions are optional. They are not required to run Motion OS. Evotechly does not redistribute binaries, scripts, or presets from these vendors.";

const INSTALL_ORDER = [
  {
    id: "uiAnimatorPro",
    name: "UI Animator Pro",
    url: "https://whatstudio.gumroad.com/",
    job: "saas",
    note: "Optional UI stagger/presets. Motion OS staggerReveal covers the same job natively."
  },
  {
    id: "pinRig",
    name: "PinRig",
    url: "https://whatstudio.gumroad.com/",
    job: "saas",
    note: "Optional logo pins. Motion OS Lockup / Logo lockup shot is the native path."
  },
  {
    id: "aejuiceFree",
    name: "AEJuice (free)",
    url: "https://aejuice.com",
    job: "reel",
    note: "Optional pack browser. Do not vendor packs into this repo."
  },
  {
    id: "motionBroFree",
    name: "Motion Bro (free)",
    url: "https://motionbro.com",
    job: "reel",
    note: "Optional extension host for some free packs."
  },
  {
    id: "animationComposerFree",
    name: "Animation Composer (free)",
    url: "https://www.mrhorse.com/animation-composer/",
    job: "reel",
    note: "Optional preset browser. Hooks only; off talking-head."
  },
  {
    id: "crateLightWrap",
    name: "Crate Light Wrap",
    url: "https://www.productioncrate.com/plugins/crates-light-wrap",
    job: "talkingHead",
    note: "Optional wrap. Person tab Light wrap is the native recipe."
  },
  {
    id: "meowCaptions",
    name: "Meow Captions",
    url: "https://sinopskyd.itch.io/meow-captions",
    job: "reel",
    note: "Optional caption coloring. Captions tab + SRT remain native."
  },
  {
    id: "presetify",
    name: "Presetify",
    url: "https://kuldeepmp4.gumroad.com/l/Presetify",
    job: "reel",
    note: "Optional text presets. Type / Captions tabs stay first."
  },
  {
    id: "vignetteTyperLite",
    name: "Vignette Typer Lite",
    url: "https://vignettestudio.gumroad.com/l/vignette-typer-lite",
    job: "reel",
    note: "Optional type-on. Polish Typewriter is the native path."
  },
  {
    id: "repeater",
    name: "Repeater",
    url: "https://aaeplugins.com/plugins/repeater/",
    job: "saas",
    note: "Optional. Shape layers already have a native Repeater."
  },
  {
    id: "paulPack",
    name: "PaulPack",
    url: "https://paulplane.gumroad.com/l/paulpackv1",
    job: "saas",
    note: "Optional UI ornaments. Not required for product demos."
  },
  {
    id: "liquidGlassPersonal",
    name: "Liquid Glass (personal)",
    url: "https://bentomotion.gumroad.com/l/glass-ae",
    job: "saas",
    note: "Optional personal-use glass pack only (often needs Motion Bro). Not redistributed. Native glassPanel in SaaS Demo Tools is the product path."
  }
];

const GOLDEN_SEED = {
  script: "ae/Seed Golden Project.jsx",
  comps: ["00_HOME", "ERP_DEMO", "TALKING_HEAD", "REEL_9x16"],
  meta: "EVO_GOLDEN_META",
  docs: "docs/QUICK_START.md"
};

const JOB_TABS = {
  saas: [
    "Window → SaaS Demo Tools (cursor, depth, stagger, carousel, glass, wipe, proximity)",
    "Motion (Style / Direction / Shot / Scan / Apply)",
    "Polish (ease, Add Cursor, squash)",
    "Interact (click / hover / drag when the v0.32 panel is installed)",
    "Recipes (ERP demo)"
  ],
  talkingHead: [
    "Person (Cutout Prep / Keylight / Light wrap / Talking-head stack)",
    "Captions (AR+EN, SRT, lower-third)",
    "Motion (Scan / Apply after names exist)",
    "Polish only for ease — Wet / glow off"
  ],
  reel: [
    "Motion (Hook / Kinetic type / UI punch-in / Logo sting / Captions)",
    "Captions (hook, kinetic, AR+EN)",
    "Polish (Wet look on hooks & logo sting only)",
    "Recipes (15s hook reminders)"
  ]
};

function companionIds() {
  return INSTALL_ORDER.map(function (c) {
    return c.id;
  });
}

function companionsForJob(job) {
  return INSTALL_ORDER.filter(function (c) {
    return c.job === job;
  });
}

function tabsForJob(job) {
  return JOB_TABS[job] || JOB_TABS.saas;
}

module.exports = {
  POLICY,
  INSTALL_ORDER,
  JOB_TABS,
  GOLDEN_SEED,
  companionIds,
  companionsForJob,
  tabsForJob
};
