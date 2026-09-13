"use strict";

/**
 * SaaS Demo Kit — Evotechly-owned timing and plans (Phase 1 + Phase 2 re-exports).
 * Numbers only. The companion JSX applies these in After Effects.
 * Native AE only. No Deep Glow, no PNG cursor, no vendor code.
 * Phase 2 (glass / wipe / proximity) lives in ./saasDemoFx.js.
 */

const { EASE, easePair } = require("./polish");
const { normalizeDirection } = require("./direction");
const FX = require("./saasDemoFx");

const CURSOR = {
  name: "Cursor",
  type: "shape",
  shape: {
    kind: "pointer",
    size: [18, 24],
    color: [1, 1, 1],
    vertices: [
      [0, 0],
      [0, 24],
      [7, 18],
      [11, 28],
      [14, 26],
      [10, 17],
      [20, 17]
    ]
  },
  duration: 0.55,
  press: 0.12,
  dipRatio: 0.45,
  cursorScale: 0.88,
  targetScale: 0.94
};

const DEPTH = {
  controller: "EVO_DEPTH",
  focus: 50,
  strength: 0.24,
  glowRadius: 24,
  maxGlow: 0.45,
  effects: ["ADBE Fast Box Blur", "ADBE Glo2"]
};

const STAGGER = {
  offsetFrames: 3,
  duration: 0.42,
  travel: 16,
  fps: 30,
  hold: 0.2,
  ease: "apple"
};

const CAROUSEL = {
  controller: "EVO_CAROUSEL",
  axis: "x",
  gap: 1920
};

const COMPANIONS_POLICY =
  "Optional. Not required. Never redistributed by Evotechly Motion OS.";

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

function lerp2(a, b, t) {
  const u = clamp(t, 0, 1);
  return [round4(lerp(a[0], b[0], u)), round4(lerp(a[1], b[1], u))];
}

function framesToSeconds(frames, fps) {
  const f = Number(fps) || STAGGER.fps;
  return round4(Number(frames) / f);
}

function normPos(pos, fallback) {
  if (Array.isArray(pos) && pos.length >= 2) {
    return [round4(Number(pos[0]) || 0), round4(Number(pos[1]) || 0)];
  }
  return fallback.slice();
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

function normalizeAxis(axis) {
  return String(axis || "x").toLowerCase() === "y" ? "y" : "x";
}

function cursorPosAt(startPos, endPos, t, duration) {
  const start = normPos(startPos, [0, 0]);
  const end = normPos(endPos, [0, 0]);
  const dur = clamp(duration, 0.05, 30);
  const u = clamp(Number(t) / dur, 0, 1);
  return lerp2(start, end, u);
}

function clickScaleAt(t, clickAt, press, restScale, dipScale) {
  const p = clamp(press, 0.02, 2);
  const t0 = Number(clickAt) || 0;
  const dipT = t0 + p * CURSOR.dipRatio;
  const t1 = t0 + p;
  const rest = restScale == null ? 100 : restScale;
  const dip = (dipScale == null ? CURSOR.cursorScale : dipScale) * 100;
  const x = Number(t);
  if (x <= t0 || x >= t1) return round4(rest);
  if (x <= dipT) {
    const u = (x - t0) / (dipT - t0);
    return round4(lerp(rest, dip, u));
  }
  const u = (x - dipT) / (t1 - dipT);
  return round4(lerp(dip, rest, u));
}

function scaleKeys(clickAt, press, dipScale) {
  const t0 = round4(clickAt);
  const p = press;
  const dip = round4(dipScale * 100);
  return [
    { t: t0, scale: [100, 100] },
    { t: round4(t0 + p * CURSOR.dipRatio), scale: [dip, dip] },
    { t: round4(t0 + p), scale: [100, 100] }
  ];
}

function createCursor(opts) {
  opts = opts || {};
  const startPos = normPos(opts.startPos, [100, 100]);
  const endPos = normPos(opts.endPos, [400, 300]);
  const duration = round4(clamp(opts.duration == null ? CURSOR.duration : opts.duration, 0.05, 30));
  const clickAt = round4(clamp(opts.clickAt == null ? duration : opts.clickAt, 0, duration));
  const press = CURSOR.press;
  const targetName = opts.targetLayer != null ? layerName(opts.targetLayer, 0) : null;

  const plan = {
    kind: "cursor",
    cursor: {
      name: CURSOR.name,
      type: CURSOR.type,
      shape: CURSOR.shape,
      startPos: startPos,
      endPos: endPos,
      duration: duration,
      positionKeys: [
        { t: 0, pos: startPos },
        { t: duration, pos: endPos }
      ],
      click: {
        t: clickAt,
        press: press,
        scaleKeys: scaleKeys(clickAt, press, CURSOR.cursorScale)
      }
    },
    target: null
  };

  if (targetName) {
    plan.target = {
      name: targetName,
      click: {
        t: clickAt,
        press: press,
        scaleKeys: scaleKeys(clickAt, press, CURSOR.targetScale)
      }
    };
  }

  return plan;
}

function defaultDepth(index, count) {
  if (count <= 1) return DEPTH.focus;
  return round4((index / (count - 1)) * 100);
}

function depthBlur(depth, focus, strength) {
  return round4(Math.abs(Number(depth) - Number(focus)) * Number(strength));
}

function glowForBlur(blur) {
  if (!(blur > 0)) return null;
  return {
    radius: DEPTH.glowRadius,
    intensity: round4(Math.min(DEPTH.maxGlow, blur * 0.02))
  };
}

function depthBlurExpression() {
  return [
    'var ctrl = thisComp.layer("' + DEPTH.controller + '");',
    'var focus = ctrl.effect("Focus")("Slider");',
    'var strength = ctrl.effect("Strength")("Slider");',
    'var depth = effect("Depth")("Slider");',
    "Math.abs(depth - focus) * strength;"
  ].join("\n");
}

function depthReveal(opts) {
  opts = opts || {};
  const layers = normalizeLayers(opts.layers || opts.selected || []);
  const focus = round4(clamp(opts.focus == null ? DEPTH.focus : opts.focus, 0, 100));
  const strength = round4(clamp(opts.strength == null ? DEPTH.strength : opts.strength, 0, 2));

  return {
    kind: "depthReveal",
    note: "Native Fast Box Blur + Glow. Deep Glow is not required.",
    controller: {
      name: DEPTH.controller,
      sliders: [
        { name: "Focus", value: focus, min: 0, max: 100 },
        { name: "Strength", value: strength, min: 0, max: 2 }
      ]
    },
    effects: DEPTH.effects.slice(),
    expression: depthBlurExpression(),
    layers: layers.map(function (layer, i) {
      const depth = round4(
        clamp(layer.depth == null ? defaultDepth(i, layers.length) : layer.depth, 0, 100)
      );
      const blur = depthBlur(depth, focus, strength);
      return {
        name: layer.name,
        index: i,
        depth: depth,
        blur: blur,
        glow: glowForBlur(blur)
      };
    })
  };
}

function staggerDelay(index, offsetFrames, fps) {
  return framesToSeconds((Number(index) || 0) * (Number(offsetFrames) || 0), fps);
}

function staggerPose(direction, phase) {
  const dir = normalizeDirection(direction);
  const travel = STAGGER.travel;
  const enter = { opacity: 0, x: 0, y: travel, scale: [100, 100] };
  const rest = { opacity: 100, x: 0, y: 0, scale: [100, 100] };
  const leave = { opacity: 0, x: 0, y: travel, scale: [100, 100] };
  if (dir === "out") {
    if (phase === "from") return rest;
    return leave;
  }
  if (phase === "from") return enter;
  if (phase === "outFrom") return rest;
  if (phase === "outTo") return leave;
  return rest;
}

function staggerReveal(opts) {
  opts = opts || {};
  const layers = normalizeLayers(opts.layers || opts.selected || []);
  const direction = normalizeDirection(opts.direction);
  const offsetFrames = Math.round(clamp(opts.offsetFrames == null ? STAGGER.offsetFrames : opts.offsetFrames, 0, 120));
  const fps = clamp(opts.fps == null ? STAGGER.fps : opts.fps, 1, 120);
  const ease = normalizeEase(opts.ease);
  const duration = STAGGER.duration;
  const offsetSec = framesToSeconds(offsetFrames, fps);

  return {
    kind: "staggerReveal",
    direction: direction,
    offsetFrames: offsetFrames,
    offsetSec: offsetSec,
    ease: ease,
    easeInfluences: easePair(ease),
    fps: fps,
    duration: duration,
    layers: layers.map(function (layer, i) {
      const delay = staggerDelay(i, offsetFrames, fps);
      const item = {
        name: layer.name,
        index: i,
        delay: delay,
        delayFrames: i * offsetFrames,
        duration: duration,
        from: staggerPose(direction, "from"),
        to: staggerPose(direction, "to"),
        ease: ease
      };
      if (direction === "both") {
        item.out = {
          delay: round4(delay + duration + STAGGER.hold),
          duration: duration,
          from: staggerPose("both", "outFrom"),
          to: staggerPose("both", "outTo")
        };
      }
      return item;
    })
  };
}

function carouselOffset(slideIndex, index, gap) {
  return round4((Number(slideIndex) - Number(index)) * Number(gap));
}

function carouselPosition(axis, rest, offset) {
  const r = normPos(rest, [0, 0]);
  if (normalizeAxis(axis) === "y") return [r[0], round4(r[1] + offset)];
  return [round4(r[0] + offset), r[1]];
}

function carouselExpression(axis, slideIndex, rest) {
  const r = normPos(rest, [0, 0]);
  const ax = normalizeAxis(axis);
  const xLine = ax === "y"
    ? "[" + r[0] + ", " + r[1] + " + (i - idx) * gap];"
    : "[" + r[0] + " + (i - idx) * gap, " + r[1] + "];";
  return [
    'var c = thisComp.layer("' + CAROUSEL.controller + '");',
    'var idx = c.effect("Index")("Slider");',
    'var gap = c.effect("Gap")("Slider");',
    "var i = " + slideIndex + ";",
    xLine
  ].join("\n");
}

function carouselSetup(opts) {
  opts = opts || {};
  const layers = normalizeLayers(opts.layers || opts.selected || []);
  const axis = normalizeAxis(opts.axis);
  const gap = round4(clamp(opts.gap == null ? CAROUSEL.gap : opts.gap, 1, 10000));
  const maxIndex = Math.max(0, layers.length - 1);
  const index = round4(clamp(opts.index == null ? 0 : opts.index, 0, maxIndex));

  return {
    kind: "carousel",
    axis: axis,
    controller: {
      name: CAROUSEL.controller,
      sliders: [
        { name: "Index", value: index, min: 0, max: maxIndex },
        { name: "Gap", value: gap, min: 1, max: 10000 }
      ]
    },
    slides: layers.map(function (layer, i) {
      const rest = normPos(layer.rest || layer.position, [0, 0]);
      const offset = carouselOffset(i, index, gap);
      return {
        name: layer.name,
        index: i,
        rest: rest,
        offset: offset,
        position: carouselPosition(axis, rest, offset),
        expression: carouselExpression(axis, i, rest)
      };
    })
  };
}

module.exports = {
  CURSOR,
  DEPTH,
  STAGGER,
  CAROUSEL,
  GLASS: FX.GLASS,
  WIPE: FX.WIPE,
  HOVER: FX.HOVER,
  EASE,
  COMPANIONS_POLICY,
  round4,
  clamp,
  lerp,
  lerp2,
  framesToSeconds,
  normalizeEase,
  normalizeAxis,
  cursorPosAt,
  clickScaleAt,
  createCursor,
  defaultDepth,
  depthBlur,
  depthReveal,
  staggerDelay,
  staggerPose,
  staggerReveal,
  carouselOffset,
  carouselPosition,
  carouselSetup,
  easeInfluences: FX.easeInfluences,
  glassPanel: FX.glassPanel,
  wipeMode: FX.wipeMode,
  normalizeWipeDirection: FX.normalizeWipeDirection,
  wipeCompletionAt: FX.wipeCompletionAt,
  wipeCompletionKeys: FX.wipeCompletionKeys,
  gradientWipeReveal: FX.gradientWipeReveal,
  proximityFactor: FX.proximityFactor,
  hoverScaleAt: FX.hoverScaleAt,
  hoverOpacityAt: FX.hoverOpacityAt,
  proximityHover: FX.proximityHover
};
