"use strict";

/**
 * EvotechlyNative text pack — premium product text, not kinetic-glitch presets.
 * Reuses polish / textReveal animator match names. Apple / Linear restraint.
 */

const { FLOWING, COLOURED, rangeBasedOn, normalizeUnit } = require("../textReveal");
const { normalizeEase: normalizePolishEase, easeInfluences: polishEaseInfluences } = require("../textReveal");
const C = require("./common");

const TEXT_IDS = [
  "EVT_TEXT_FADE_UP",
  "EVT_TEXT_FADE_DOWN",
  "EVT_TEXT_MASK_REVEAL",
  "EVT_TEXT_WORD_REVEAL",
  "EVT_TEXT_LINE_REVEAL",
  "EVT_TEXT_CHAR_REVEAL",
  "EVT_TEXT_BLUR_IN",
  "EVT_TEXT_BLUR_OUT",
  "EVT_TEXT_SCALE_IN",
  "EVT_TEXT_SLIDE_IN",
  "EVT_TEXT_TRACKING_REVEAL",
  "EVT_TEXT_HEADLINE_REVEAL",
  "EVT_TEXT_SUBTITLE_REVEAL",
  "EVT_TEXT_KINETIC_HEADLINE",
  "EVT_TEXT_SWAP",
  "EVT_TEXT_NUMBER_COUNTER",
  "EVT_TEXT_PCT_COUNTER",
  "EVT_TEXT_METRIC_COUNTER"
];

const TEXT_META = {
  EVT_TEXT_FADE_UP: { name: "Text Fade Up", group: "FAST", ease: "apple-smooth", bestUse: "Quiet line in, 8–12 px lift" },
  EVT_TEXT_FADE_DOWN: { name: "Text Fade Down", group: "FAST", ease: "apple-smooth", bestUse: "Caption drop-in from above" },
  EVT_TEXT_MASK_REVEAL: { name: "Text Mask Reveal", group: "STANDARD", ease: "premium-smooth", bestUse: "Soft matte expand, no hard wipe" },
  EVT_TEXT_WORD_REVEAL: { name: "Word Reveal", group: "STANDARD", ease: "apple-smooth", bestUse: "Product sentence, word selector" },
  EVT_TEXT_LINE_REVEAL: { name: "Line Reveal", group: "SMOOTH", ease: "premium-smooth", bestUse: "Stacked headline, line selector" },
  EVT_TEXT_CHAR_REVEAL: { name: "Character Reveal", group: "STANDARD", ease: "apple-smooth", bestUse: "Restrained type-on, char selector" },
  EVT_TEXT_BLUR_IN: { name: "Text Blur In", group: "STANDARD", ease: "soft-ui", bestUse: "Focus pull onto a title" },
  EVT_TEXT_BLUR_OUT: { name: "Text Blur Out", group: "FAST", ease: "soft-ui", bestUse: "Title leaves into blur" },
  EVT_TEXT_SCALE_IN: { name: "Text Scale In", group: "FAST", ease: "fast-product", bestUse: "94→100 present, no pop bounce" },
  EVT_TEXT_SLIDE_IN: { name: "Text Slide In", group: "FAST", ease: "fast-product", bestUse: "Short lateral enter, 16–20 px" },
  EVT_TEXT_TRACKING_REVEAL: { name: "Tracking Reveal", group: "SMOOTH", ease: "premium-smooth", bestUse: "Tracking 28→0 with fade" },
  EVT_TEXT_HEADLINE_REVEAL: { name: "Headline Reveal", group: "SMOOTH", ease: "premium-smooth", bestUse: "Hero title: char + slight scale settle" },
  EVT_TEXT_SUBTITLE_REVEAL: { name: "Subtitle Reveal", group: "FAST", ease: "apple-smooth", bestUse: "Supporting line, word unit" },
  EVT_TEXT_KINETIC_HEADLINE: { name: "Kinetic Headline", group: "SMOOTH", ease: "premium-smooth", bestUse: "Restrained tracking + lift — not glitch" },
  EVT_TEXT_SWAP: { name: "Text Swap", group: "STANDARD", ease: "premium-smooth", bestUse: "Replace a label, outgoing up / incoming up" },
  EVT_TEXT_NUMBER_COUNTER: { name: "Number Counter", group: "SMOOTH", ease: "linear", bestUse: "KPI integer count-up" },
  EVT_TEXT_PCT_COUNTER: { name: "Percent Counter", group: "SMOOTH", ease: "linear", bestUse: "Conversion / growth %" },
  EVT_TEXT_METRIC_COUNTER: { name: "Metric Counter", group: "SMOOTH", ease: "linear", bestUse: "Prefixed SaaS metric ($12.4k)" }
};

const UNITS = { CHAR: "char", WORD: "word", LINE: "line" };

function isTextId(id) {
  return TEXT_IDS.indexOf(C.normalizeId(id)) !== -1;
}

function catalogRows() {
  return TEXT_IDS.map(function (id) {
    const meta = TEXT_META[id];
    return {
      id: id,
      name: meta.name,
      category: "Text-Animations",
      folder: "02_Text-Animations",
      group: meta.group,
      ease: meta.ease,
      bestUse: meta.bestUse,
      implemented: true,
      transitionKitPath: "core/assets/textAnimations.js",
      notes: "P1 native. " + meta.bestUse + ". Apply: Evotechly Transitions → Text."
    };
  });
}

function animatorBlock(opts) {
  const unit = normalizeUnit(opts.unit);
  const direction = opts.direction || "in";
  const duration = opts.duration;
  const hold = opts.hold == null ? 0 : opts.hold;
  let endKeys;
  if (direction === "out") {
    endKeys = [
      { t: 0, end: 0 },
      { t: duration, end: 100 }
    ];
  } else {
    endKeys = [
      { t: 0, end: 100 },
      { t: duration, end: 0 }
    ];
  }
  const properties = (opts.properties || []).map(function (p) {
    return Object.assign({}, p);
  });
  return {
    name: opts.name || "EVO_TEXT",
    matchName: FLOWING.matchName,
    shape: FLOWING.shape,
    shapeValue: FLOWING.shapeValue,
    unit: unit,
    basedOn: rangeBasedOn(unit),
    selector: {
      basedOn: unit,
      basedOnValue: rangeBasedOn(unit),
      endKeys: endKeys,
      hold: hold
    },
    properties: properties
  };
}

function layerFromPoses(name, role, rest, keys) {
  return C.restRelativeOps(name, role, keys, rest);
}

function counterSteps(from, to, frames, fps, formatFn) {
  const steps = 5;
  const keys = [];
  let i;
  for (i = 0; i <= steps; i++) {
    const u = i / steps;
    const frame = Math.round(frames * u);
    const n = C.round4(from + (to - from) * u);
    keys.push({
      t: C.secondsFromFrames(frame, fps),
      frame: frame,
      number: n,
      value: formatFn(n),
      phase: i === 0 ? "start" : i === steps ? "done" : "count"
    });
  }
  return keys;
}

function formatNumber(n) {
  return String(Math.round(n));
}

function formatPct(n) {
  return Math.round(n) + "%";
}

function formatMetric(n, prefix, suffix, decimals) {
  const d = decimals == null ? 1 : decimals;
  const factor = Math.pow(10, d);
  const rounded = Math.round(n * factor) / factor;
  const body = d === 0 ? String(Math.round(rounded)) : rounded.toFixed(d);
  return String(prefix || "") + body + String(suffix || "");
}

function transformRecipe(id) {
  const recipes = {
    EVT_TEXT_FADE_UP: {
      poses: function (ph) {
        return [
          { frame: ph.start, x: 0, y: 10, sx: 100, opacity: 0, blur: 0, phase: "start" },
          { frame: ph.mid, x: 0, y: 2, sx: 100, opacity: 82, blur: 0, phase: "mid" },
          { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
        ];
      }
    },
    EVT_TEXT_FADE_DOWN: {
      poses: function (ph) {
        return [
          { frame: ph.start, x: 0, y: -10, sx: 100, opacity: 0, blur: 0, phase: "start" },
          { frame: ph.mid, x: 0, y: -2, sx: 100, opacity: 82, blur: 0, phase: "mid" },
          { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
        ];
      }
    },
    EVT_TEXT_BLUR_IN: {
      poses: function (ph) {
        return [
          { frame: ph.start, x: 0, y: 4, sx: 100.6, opacity: 0, blur: 10, phase: "start" },
          { frame: ph.mid, x: 0, y: 1, sx: 100.2, opacity: 78, blur: 3, phase: "mid" },
          { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
        ];
      }
    },
    EVT_TEXT_BLUR_OUT: {
      poses: function (ph) {
        return [
          { frame: ph.start, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "start" },
          { frame: ph.mid, x: 0, y: -2, sx: 99.4, opacity: 42, blur: 5, phase: "mid" },
          { frame: ph.end, x: 0, y: -6, sx: 98.5, opacity: 0, blur: 10, phase: "done" }
        ];
      }
    },
    EVT_TEXT_SCALE_IN: {
      poses: function (ph) {
        return [
          { frame: ph.start, x: 0, y: 0, sx: 94, opacity: 0, blur: 0, phase: "start" },
          { frame: ph.mid, x: 0, y: 0, sx: 100.6, opacity: 88, blur: 0, phase: "mid" },
          { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
        ];
      }
    },
    EVT_TEXT_SLIDE_IN: {
      poses: function (ph) {
        return [
          { frame: ph.start, x: 18, y: 0, sx: 100, opacity: 0, blur: 0, phase: "start" },
          { frame: ph.mid, x: 3, y: 0, sx: 100, opacity: 86, blur: 0, phase: "mid" },
          { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
        ];
      }
    },
    EVT_TEXT_MASK_REVEAL: {
      poses: function (ph) {
        return [
          { frame: ph.start, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "start" },
          { frame: ph.mid, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "mid" },
          { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
        ];
      }
    }
  };
  return recipes[id] || null;
}

function applyTextPlan(opts) {
  opts = opts || {};
  const id = C.normalizeId(opts.id);
  if (!isTextId(id)) {
    return C.wrapPlan("text-asset", id, C.resolveTiming(opts, "STANDARD"), {
      category: "Text",
      implemented: false,
      description: id + " is not a P1 text asset.",
      layers: []
    });
  }

  const meta = TEXT_META[id];
  const timing = C.resolveTiming(opts, meta.group, meta.ease);
  const name = C.layerName(opts.layer || opts.outgoing, "Title");
  const rest = C.layerRest(opts.layer || opts.outgoing);
  const incomingName = C.layerName(opts.incoming, "Incoming");
  const incomingRest = C.layerRest(opts.incoming);
  const ph = timing.phases;
  const duration = timing.durationSec;

  const plan = C.wrapPlan("text-asset", id, timing, {
    category: "Text",
    name: meta.name,
    bestUse: meta.bestUse,
    description: "Apply " + id + " · " + timing.frames + "f @" + timing.fps + "fps · " + timing.ease,
    layer: name,
    animator: null,
    mask: null,
    sourceText: null,
    layers: []
  });

  const recipe = transformRecipe(id);
  if (recipe) {
    const keys = C.poseKeys(timing.fps, recipe.poses(ph));
    const layer = layerFromPoses(name, "text", rest, keys);
    plan.layers = [layer];
    plan.outgoing = layer;
  }

  if (id === "EVT_TEXT_MASK_REVEAL") {
    plan.mask = {
      type: "roundedRect",
      feather: 8,
      expansion: [
        { t: 0, frame: ph.start, value: -72, phase: "start" },
        { t: C.secondsFromFrames(ph.mid, timing.fps), frame: ph.mid, value: -18, phase: "mid" },
        { t: duration, frame: ph.end, value: 0, phase: "done" }
      ],
      note: "Native mask expansion. Soft edge, no wipe bar."
    };
  }

  if (id === "EVT_TEXT_CHAR_REVEAL" || id === "EVT_TEXT_WORD_REVEAL" || id === "EVT_TEXT_LINE_REVEAL") {
    const unit = id === "EVT_TEXT_WORD_REVEAL" ? UNITS.WORD : id === "EVT_TEXT_LINE_REVEAL" ? UNITS.LINE : UNITS.CHAR;
    const travel = id === "EVT_TEXT_LINE_REVEAL" ? 10 : 8;
    plan.animator = animatorBlock({
      name: "EVO_TEXT",
      unit: unit,
      duration: duration,
      properties: [
        { matchName: FLOWING.opacity, value: 0 },
        { matchName: FLOWING.position, fallback: FLOWING.positionFallback, value: [0, travel, 0] }
      ]
    });
    const keys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "start" },
      { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
    ]);
    plan.layers = [layerFromPoses(name, "text", rest, keys)];
    plan.outgoing = plan.layers[0];
  }

  if (id === "EVT_TEXT_TRACKING_REVEAL") {
    plan.animator = animatorBlock({
      name: "EVO_TRACK",
      unit: UNITS.CHAR,
      duration: duration,
      properties: [
        { matchName: FLOWING.opacity, value: 0 },
        { matchName: "ADBE Text Tracking Amount", value: 28 }
      ]
    });
    const keys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 2, sx: 100, opacity: 100, blur: 0, tracking: 28, phase: "start" },
      { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, tracking: 0, phase: "done" }
    ]);
    plan.layers = [layerFromPoses(name, "text", rest, keys)];
    plan.outgoing = plan.layers[0];
  }

  if (id === "EVT_TEXT_HEADLINE_REVEAL") {
    plan.animator = animatorBlock({
      name: "EVO_HEADLINE",
      unit: UNITS.CHAR,
      duration: duration,
      properties: [
        { matchName: FLOWING.opacity, value: 0 },
        { matchName: FLOWING.position, fallback: FLOWING.positionFallback, value: [0, 8, 0] }
      ]
    });
    const keys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 0, sx: 102, opacity: 100, blur: 0, phase: "start" },
      { frame: ph.settle, x: 0, y: 0, sx: 100.4, opacity: 100, blur: 0, phase: "settle" },
      { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
    ]);
    plan.layers = [layerFromPoses(name, "text", rest, keys)];
    plan.outgoing = plan.layers[0];
  }

  if (id === "EVT_TEXT_SUBTITLE_REVEAL") {
    plan.animator = animatorBlock({
      name: "EVO_SUBTITLE",
      unit: UNITS.WORD,
      duration: duration,
      properties: [
        { matchName: FLOWING.opacity, value: 0 },
        { matchName: FLOWING.position, fallback: FLOWING.positionFallback, value: [0, 6, 0] }
      ]
    });
    const keys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 4, sx: 100, opacity: 0, blur: 0, phase: "start" },
      { frame: ph.mid, x: 0, y: 1, sx: 100, opacity: 80, blur: 0, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
    ]);
    plan.layers = [layerFromPoses(name, "text", rest, keys)];
    plan.outgoing = plan.layers[0];
  }

  if (id === "EVT_TEXT_KINETIC_HEADLINE") {
    plan.animator = animatorBlock({
      name: "EVO_KINETIC",
      unit: UNITS.CHAR,
      duration: duration,
      properties: [
        { matchName: FLOWING.opacity, value: 0 },
        { matchName: FLOWING.position, fallback: FLOWING.positionFallback, value: [0, 8, 0] },
        { matchName: "ADBE Text Tracking Amount", value: 18 }
      ]
    });
    const keys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 6, sx: 101.2, opacity: 100, blur: 1, tracking: 18, phase: "start" },
      { frame: ph.mid, x: 0, y: 1, sx: 100.4, opacity: 100, blur: 0, tracking: 6, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, tracking: 0, phase: "done" }
    ]);
    plan.layers = [layerFromPoses(name, "text", rest, keys)];
    plan.outgoing = plan.layers[0];
    plan.note = "Restrained kinetic: tracking + 8 px lift. Not glitch / RGB / bounce.";
  }

  if (id === "EVT_TEXT_SWAP") {
    const outKeys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "start" },
      { frame: ph.mid, x: 0, y: -6, sx: 99.2, opacity: 40, blur: 2, phase: "mid" },
      { frame: ph.end, x: 0, y: -12, sx: 98, opacity: 0, blur: 4, phase: "done" }
    ]);
    const inKeys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 10, sx: 100.6, opacity: 0, blur: 4, phase: "start" },
      { frame: ph.mid, x: 0, y: 2, sx: 100.2, opacity: 72, blur: 1, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
    ]);
    plan.outgoing = layerFromPoses(name, "outgoing", rest, outKeys);
    plan.incoming = layerFromPoses(incomingName, "incoming", incomingRest, inKeys);
    plan.layers = [plan.outgoing, plan.incoming];
  }

  if (id === "EVT_TEXT_NUMBER_COUNTER" || id === "EVT_TEXT_PCT_COUNTER" || id === "EVT_TEXT_METRIC_COUNTER") {
    const from = opts.from == null ? 0 : Number(opts.from);
    const to = opts.to == null ? (id === "EVT_TEXT_PCT_COUNTER" ? 48 : id === "EVT_TEXT_METRIC_COUNTER" ? 12.4 : 124) : Number(opts.to);
    const prefix = opts.prefix == null ? (id === "EVT_TEXT_METRIC_COUNTER" ? "$" : "") : String(opts.prefix);
    const suffix = opts.suffix == null ? (id === "EVT_TEXT_METRIC_COUNTER" ? "k" : "") : String(opts.suffix);
    const decimals = opts.decimals == null ? (id === "EVT_TEXT_METRIC_COUNTER" ? 1 : 0) : Number(opts.decimals);
    let formatFn;
    if (id === "EVT_TEXT_PCT_COUNTER") formatFn = formatPct;
    else if (id === "EVT_TEXT_METRIC_COUNTER") {
      formatFn = function (n) {
        return formatMetric(n, prefix, suffix, decimals);
      };
    } else formatFn = formatNumber;
    const keys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 4, sx: 100, opacity: 0, blur: 0, phase: "start" },
      { frame: ph.mid, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, opacity: 100, blur: 0, phase: "done" }
    ]);
    plan.sourceText = {
      from: from,
      to: to,
      prefix: prefix,
      suffix: suffix,
      decimals: decimals,
      keys: counterSteps(from, to, timing.frames, timing.fps, formatFn),
      matchName: COLOURED.fill ? "ADBE Text Document" : "ADBE Text Document",
      note: "Source-text keys. Linear count. No bounce."
    };
    plan.layers = [layerFromPoses(name, "text", rest, keys)];
    plan.outgoing = plan.layers[0];
    plan.ease = "linear";
    plan.easeInfluences = { influenceIn: 16, influenceOut: 16 };
  }

  if (plan.animator) {
    plan.animatorEase = polishEaseInfluences(normalizePolishEase(timing.ease === "linear" ? "linear" : timing.ease === "soft-ui" ? "soft" : "apple"));
  }

  return plan;
}

module.exports = {
  TEXT_IDS,
  TEXT_META,
  UNITS,
  isTextId,
  catalogRows,
  applyTextPlan,
  animatorBlock,
  counterSteps,
  formatNumber,
  formatPct,
  formatMetric
};
