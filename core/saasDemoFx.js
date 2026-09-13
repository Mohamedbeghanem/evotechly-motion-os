"use strict";

/**
 * SaaS Demo Kit — Phase 2 native FX plans.
 * Numbers only. The companion JSX applies these in After Effects.
 * Native AE only. No Liquid Glass .mbr, Deep Glow, Saber, QCA, or TFM.
 */

const { easePair } = require("./polish");

const GLASS = {
  controller: "EVO_GLASS",
  name: "Glass Panel",
  opacity: 42,
  blur: 18,
  tint: [0.92, 0.95, 0.98],
  fill: [0.94, 0.96, 0.99],
  gamma: 1.08,
  effects: ["ADBE Fast Box Blur", "ADBE Tint", "ADBE Easy Levels2", "ADBE Fill"]
};

const WIPE = {
  duration: 0.55,
  softness: 12,
  hold: 0.2,
  effect: "ADBE Gradient Wipe",
  fallback: "shapeMatte",
  matte: "EVO_WIPE_MATTE",
  gradient: "EVO_WIPE_GRAD"
};

const HOVER = {
  controller: "EVO_HOVER",
  driver: "Cursor",
  radius: 140,
  scaleBoost: 6,
  opacityBoost: 18
};

function round4(n) {
  return Math.round(Number(n) * 10000) / 10000;
}

function clamp(n, lo, hi) {
  const x = Number(n);
  if (x !== x) return lo;
  if (x < lo) return lo;
  if (x > hi) return hi;
  return x;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function layerName(layer, index) {
  if (layer == null) return "layer-" + index;
  if (typeof layer === "string") return layer;
  return layer.name || layer.layer || layer.id || ("layer-" + index);
}

function normalizeLayers(list) {
  if (!list) return [];
  if (!Array.isArray(list)) return [];
  return list.map(function (layer, i) {
    if (layer == null) return { name: "layer-" + i };
    if (typeof layer === "string") return { name: layer };
    const copy = {};
    Object.keys(layer).forEach(function (k) {
      copy[k] = layer[k];
    });
    copy.name = layerName(layer, i);
    return copy;
  });
}

function normalizeEase(kind) {
  if (kind === "soft" || kind === "linear") return kind;
  return "apple";
}

function easeInfluences(kind) {
  const ease = normalizeEase(kind);
  if (ease === "linear") return { influenceIn: 16, influenceOut: 16 };
  return easePair(ease);
}

function resolveGlassLayers(opts) {
  if (opts.layers || opts.selected) {
    return normalizeLayers(opts.layers || opts.selected);
  }
  if (opts.layer != null) return normalizeLayers([opts.layer]);
  return [{ name: GLASS.name }];
}

function glassOpacityExpression() {
  return [
    'var ctrl = thisComp.layer("' + GLASS.controller + '");',
    'ctrl.effect("Opacity")("Slider");'
  ].join("\n");
}

function glassBlurExpression() {
  return [
    'var ctrl = thisComp.layer("' + GLASS.controller + '");',
    'ctrl.effect("Blur")("Slider");'
  ].join("\n");
}

function glassPanel(opts) {
  opts = opts || {};
  const layers = resolveGlassLayers(opts);
  const opacity = round4(clamp(opts.opacity == null ? GLASS.opacity : opts.opacity, 0, 100));
  const blur = round4(clamp(opts.blur == null ? GLASS.blur : opts.blur, 0, 80));

  const items = layers.map(function (layer, i) {
    return {
      name: layer.name,
      index: i,
      opacity: opacity,
      blur: blur,
      fill: { color: GLASS.fill.slice(), opacity: opacity },
      tint: { mapWhiteTo: GLASS.tint.slice() },
      levels: { gamma: GLASS.gamma }
    };
  });

  return {
    kind: "glassPanel",
    note: "Native Fast Box Blur + Fill/Tint/Levels. Liquid Glass pack is not required.",
    controller: {
      name: GLASS.controller,
      sliders: [
        { name: "Opacity", value: opacity, min: 0, max: 100 },
        { name: "Blur", value: blur, min: 0, max: 80 }
      ]
    },
    effects: GLASS.effects.slice(),
    fallbackBlur: "ADBE Gaussian Blur 2",
    expression: {
      opacity: glassOpacityExpression(),
      blur: glassBlurExpression()
    },
    layer: items[0],
    layers: items
  };
}

function wipeMode(direction) {
  const d = String(direction == null ? "left" : direction).toLowerCase();
  if (d === "out") return { mode: "out", side: "left" };
  if (d === "both") return { mode: "both", side: "left" };
  if (d === "in") return { mode: "in", side: "left" };
  if (d === "right" || d === "up" || d === "down") return { mode: "in", side: d };
  return { mode: "in", side: "left" };
}

function normalizeWipeDirection(direction) {
  const parsed = wipeMode(direction);
  if (parsed.mode === "out" || parsed.mode === "both") return parsed.mode;
  return parsed.side;
}

function wipeInvert(side) {
  return side === "right" || side === "down";
}

function wipeRamp(side) {
  if (side === "up") return { start: [0.5, 0], end: [0.5, 1] };
  if (side === "down") return { start: [0.5, 1], end: [0.5, 0] };
  if (side === "right") return { start: [1, 0.5], end: [0, 0.5] };
  return { start: [0, 0.5], end: [1, 0.5] };
}

function wipeMatteFrom(side) {
  if (side === "up") return { scale: [100, 0], anchor: "top" };
  if (side === "down") return { scale: [100, 0], anchor: "bottom" };
  if (side === "right") return { scale: [0, 100], anchor: "right" };
  return { scale: [0, 100], anchor: "left" };
}

function wipeCompletionAt(t, duration, direction) {
  const parsed = wipeMode(direction);
  const dur = clamp(duration == null ? WIPE.duration : duration, 0.05, 30);
  const x = Number(t);
  if (parsed.mode === "both") {
    const mid = dur;
    const out0 = mid + WIPE.hold;
    const out1 = out0 + dur;
    if (x <= 0) return 100;
    if (x >= out1) return 100;
    if (x < mid) return round4(lerp(100, 0, clamp(x / mid, 0, 1)));
    if (x <= out0) return 0;
    return round4(lerp(0, 100, clamp((x - out0) / dur, 0, 1)));
  }
  const u = clamp(x / dur, 0, 1);
  if (parsed.mode === "out") return round4(lerp(0, 100, u));
  return round4(lerp(100, 0, u));
}

function wipeCompletionKeys(duration, direction) {
  const parsed = wipeMode(direction);
  const dur = round4(clamp(duration, 0.05, 30));
  if (parsed.mode === "out") {
    return [
      { t: 0, completion: 0 },
      { t: dur, completion: 100 }
    ];
  }
  if (parsed.mode === "both") {
    const out0 = round4(dur + WIPE.hold);
    const out1 = round4(out0 + dur);
    return [
      { t: 0, completion: 100 },
      { t: dur, completion: 0 },
      { t: out0, completion: 0 },
      { t: out1, completion: 100 }
    ];
  }
  return [
    { t: 0, completion: 100 },
    { t: dur, completion: 0 }
  ];
}

function gradientWipeReveal(opts) {
  opts = opts || {};
  const layers = opts.layers || opts.selected
    ? normalizeLayers(opts.layers || opts.selected)
    : normalizeLayers([opts.layer == null ? "layer-0" : opts.layer]);
  const duration = round4(clamp(opts.duration == null ? WIPE.duration : opts.duration, 0.05, 30));
  const parsed = wipeMode(opts.direction);
  const ease = normalizeEase(opts.ease);
  const softness = round4(clamp(opts.softness == null ? WIPE.softness : opts.softness, 0, 100));
  const keys = wipeCompletionKeys(duration, opts.direction);
  const side = parsed.side;

  const items = layers.map(function (layer, i) {
    return {
      name: layer.name,
      index: i,
      duration: duration,
      direction: normalizeWipeDirection(opts.direction),
      mode: parsed.mode,
      side: side,
      invert: wipeInvert(side),
      softness: softness,
      completionKeys: keys,
      from: { completion: keys[0].completion },
      to: { completion: keys[keys.length - 1].completion },
      ease: ease
    };
  });

  return {
    kind: "gradientWipeReveal",
    note: "Native Gradient Wipe, or a shape matte + Fast Box Blur soft edge. No Saber / QCA.",
    duration: duration,
    direction: normalizeWipeDirection(opts.direction),
    mode: parsed.mode,
    side: side,
    ease: ease,
    easeInfluences: easeInfluences(ease),
    effect: WIPE.effect,
    fallback: WIPE.fallback,
    gradient: {
      name: WIPE.gradient,
      kind: "ADBE Ramp",
      ramp: wipeRamp(side)
    },
    matte: {
      name: WIPE.matte,
      kind: "shape",
      from: wipeMatteFrom(side),
      to: { scale: [100, 100] },
      softness: softness
    },
    layer: items[0],
    layers: items
  };
}

function proximityFactor(distance, radius) {
  const r = clamp(radius, 0.001, 10000);
  return round4(clamp(1 - Number(distance) / r, 0, 1));
}

function hoverScaleAt(distance, radius, scaleBoost, restScale) {
  const rest = restScale == null ? 100 : restScale;
  const boost = Number(scaleBoost);
  return round4(rest + boost * proximityFactor(distance, radius));
}

function hoverOpacityAt(distance, radius, opacityBoost, restOpacity) {
  const rest = restOpacity == null ? 100 : restOpacity;
  const boost = Number(opacityBoost);
  return round4(clamp(rest + boost * proximityFactor(distance, radius), 0, 100));
}

function hoverScaleExpression() {
  return [
    'var drvName = "' + HOVER.driver + '";',
    'var ctrl = thisComp.layer("' + HOVER.controller + '");',
    "var d;",
    "try { d = thisComp.layer(drvName); } catch (e) { d = ctrl; }",
    'var radius = ctrl.effect("Radius")("Slider");',
    'var boost = ctrl.effect("Scale Boost")("Slider");',
    "var q = d.toComp(d.anchorPoint);",
    "var p = toComp(anchorPoint);",
    "var dist = length(p, q);",
    "var t = clamp(1 - dist / Math.max(radius, 0.001), 0, 1);",
    "var s = value[0] + boost * t;",
    "[s, s];"
  ].join("\n");
}

function hoverOpacityExpression() {
  return [
    'var drvName = "' + HOVER.driver + '";',
    'var ctrl = thisComp.layer("' + HOVER.controller + '");',
    "var d;",
    "try { d = thisComp.layer(drvName); } catch (e) { d = ctrl; }",
    'var radius = ctrl.effect("Radius")("Slider");',
    'var boost = ctrl.effect("Opacity Boost")("Slider");',
    "var q = d.toComp(d.anchorPoint);",
    "var p = toComp(anchorPoint);",
    "var dist = length(p, q);",
    "var t = clamp(1 - dist / Math.max(radius, 0.001), 0, 1);",
    "clamp(value + boost * t, 0, 100);"
  ].join("\n");
}

function proximityHover(opts) {
  opts = opts || {};
  const layers = normalizeLayers(opts.layers || opts.selected || []);
  const radius = round4(clamp(opts.radius == null ? HOVER.radius : opts.radius, 1, 10000));
  const scaleBoost = round4(clamp(opts.scaleBoost == null ? HOVER.scaleBoost : opts.scaleBoost, 0, 80));
  const opacityBoost = round4(clamp(opts.opacityBoost == null ? HOVER.opacityBoost : opts.opacityBoost, 0, 100));
  const driver = opts.driver == null ? HOVER.driver : String(opts.driver);
  const scaleExpr = hoverScaleExpression().replace('var drvName = "' + HOVER.driver + '";', 'var drvName = "' + driver + '";');
  const opacityExpr = hoverOpacityExpression().replace('var drvName = "' + HOVER.driver + '";', 'var drvName = "' + driver + '";');

  return {
    kind: "proximityHover",
    note: "Pairs with Phase 1 Cursor (shape pointer). EVO_HOVER is the fallback driver if Cursor is missing.",
    driver: driver,
    controller: {
      name: HOVER.controller,
      sliders: [
        { name: "Radius", value: radius, min: 1, max: 10000 },
        { name: "Scale Boost", value: scaleBoost, min: 0, max: 80 },
        { name: "Opacity Boost", value: opacityBoost, min: 0, max: 100 }
      ]
    },
    radius: radius,
    scaleBoost: scaleBoost,
    opacityBoost: opacityBoost,
    expression: {
      scale: scaleExpr,
      opacity: opacityExpr
    },
    layers: layers.map(function (layer, i) {
      return {
        name: layer.name,
        index: i,
        scaleAtCenter: hoverScaleAt(0, radius, scaleBoost, 100),
        scaleAtEdge: hoverScaleAt(radius, radius, scaleBoost, 100),
        opacityAtCenter: hoverOpacityAt(0, radius, opacityBoost, 100 - opacityBoost)
      };
    })
  };
}

module.exports = {
  GLASS,
  WIPE,
  HOVER,
  round4,
  clamp,
  normalizeEase,
  easeInfluences,
  glassPanel,
  wipeMode,
  normalizeWipeDirection,
  wipeCompletionAt,
  wipeCompletionKeys,
  gradientWipeReveal,
  proximityFactor,
  hoverScaleAt,
  hoverOpacityAt,
  proximityHover
};
