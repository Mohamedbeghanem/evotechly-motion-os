"use strict";

/**
 * EvotechlyNative cursor pack — extends createCursor motion, not a PNG kit.
 * Styles stay pointer / hand / ibeam from core/saasDemo.js.
 */

const { createCursor, cursorShape, normalizeCursorStyle, CURSOR, CURSOR_STYLE_NAMES } = require("../saasDemo");
const C = require("./common");

const CURSOR_IDS = [
  "EVT_CURSOR_MOVE",
  "EVT_CURSOR_CLICK",
  "EVT_CURSOR_DBLCLICK",
  "EVT_CURSOR_HOVER",
  "EVT_CURSOR_DRAG",
  "EVT_CURSOR_SWIPE",
  "EVT_CURSOR_SELECT",
  "EVT_CURSOR_RIPPLE"
];

const CURSOR_META = {
  EVT_CURSOR_MOVE: { name: "Cursor Move", group: "STANDARD", ease: "premium-smooth", bestUse: "Pointer travels start → end" },
  EVT_CURSOR_CLICK: { name: "Cursor Click", group: "FAST", ease: "snappy", bestUse: "Move + single press dip" },
  EVT_CURSOR_DBLCLICK: { name: "Cursor Double Click", group: "FAST", ease: "snappy", bestUse: "Two press dips, 6-frame gap" },
  EVT_CURSOR_HOVER: { name: "Cursor Hover", group: "MICRO", ease: "apple-smooth", bestUse: "Settle on target, 2% lift" },
  EVT_CURSOR_DRAG: { name: "Cursor Drag", group: "STANDARD", ease: "premium-smooth", bestUse: "Pressed scale while traveling" },
  EVT_CURSOR_SWIPE: { name: "Cursor Swipe", group: "FAST", ease: "fast-product", bestUse: "Short flick with quiet settle" },
  EVT_CURSOR_SELECT: { name: "Cursor Select", group: "STANDARD", ease: "premium-smooth", bestUse: "Down, drag range, up" },
  EVT_CURSOR_RIPPLE: { name: "Cursor Ripple", group: "FAST", ease: "soft-ui", bestUse: "Optional click halo — opacity + scale only" }
};

function isCursorId(id) {
  return CURSOR_IDS.indexOf(C.normalizeId(id)) !== -1;
}

function catalogRows() {
  return CURSOR_IDS.map(function (id) {
    const meta = CURSOR_META[id];
    return {
      id: id,
      name: meta.name,
      category: "Cursors",
      folder: "11_Cursors",
      group: meta.group,
      ease: meta.ease,
      bestUse: meta.bestUse,
      implemented: true,
      transitionKitPath: "core/assets/cursorPack.js",
      notes: "P1 native cursor motion. Styles pointer/hand/ibeam already owned. " + meta.bestUse + "."
    };
  });
}

function pressKeys(t0, press, dipScale) {
  const p = press == null ? CURSOR.press : press;
  const dip = C.round4((dipScale == null ? CURSOR.cursorScale : dipScale) * 100);
  return [
    { t: C.round4(t0), scale: [100, 100], phase: "down" },
    { t: C.round4(t0 + p * CURSOR.dipRatio), scale: [dip, dip], phase: "dip" },
    { t: C.round4(t0 + p), scale: [100, 100], phase: "up" }
  ];
}

function applyCursorPlan(opts) {
  opts = opts || {};
  const id = C.normalizeId(opts.id);
  if (!isCursorId(id)) {
    return C.wrapPlan("cursor-asset", id, C.resolveTiming(opts, "STANDARD"), {
      category: "Cursor",
      implemented: false,
      description: id + " is not a P1 cursor asset.",
      layers: []
    });
  }

  const meta = CURSOR_META[id];
  const timing = C.resolveTiming(opts, meta.group, opts.ease || meta.ease);
  const style = normalizeCursorStyle(opts.style);
  const shape = cursorShape(style);
  const startPos = Array.isArray(opts.startPos) ? [Number(opts.startPos[0]) || 0, Number(opts.startPos[1]) || 0] : [120, 140];
  const endPos = Array.isArray(opts.endPos) ? [Number(opts.endPos[0]) || 0, Number(opts.endPos[1]) || 0] : [420, 280];
  const duration = timing.durationSec;
  const midT = C.round4(duration * 0.5);
  const press = CURSOR.press;
  const name = C.layerName(opts.layer, CURSOR.name);
  const targetName = opts.targetLayer != null ? C.layerName(opts.targetLayer, "Target") : null;

  const base = createCursor({
    startPos: startPos,
    endPos: endPos,
    duration: duration,
    clickAt: opts.clickAt == null ? duration : opts.clickAt,
    style: style,
    targetLayer: targetName
  });

  let positionKeys = [
    { t: 0, frame: 0, pos: startPos.slice(), phase: "start" },
    { t: duration, frame: timing.frames, pos: endPos.slice(), phase: "done" }
  ];
  let scaleKeys = [
    { t: 0, frame: 0, scale: [100, 100], phase: "start" },
    { t: duration, frame: timing.frames, scale: [100, 100], phase: "done" }
  ];
  let click = null;
  let ripple = null;

  if (id === "EVT_CURSOR_MOVE") {
    click = null;
    base.cursor.click = null;
    base.target = null;
  }

  if (id === "EVT_CURSOR_CLICK") {
    const clickAt = C.round4(opts.clickAt == null ? duration * 0.72 : opts.clickAt);
    click = { t: clickAt, press: press, scaleKeys: pressKeys(clickAt, press, CURSOR.cursorScale) };
    scaleKeys = click.scaleKeys;
  }

  if (id === "EVT_CURSOR_DBLCLICK") {
    const first = C.round4(opts.clickAt == null ? duration * 0.55 : opts.clickAt);
    const gap = C.round4(6 / timing.fps);
    const second = C.round4(first + press + gap);
    click = {
      t: first,
      press: press,
      count: 2,
      gap: gap,
      scaleKeys: pressKeys(first, press, CURSOR.cursorScale).concat(pressKeys(second, press, CURSOR.cursorScale))
    };
    scaleKeys = click.scaleKeys;
  }

  if (id === "EVT_CURSOR_HOVER") {
    positionKeys = [
      { t: 0, frame: 0, pos: startPos.slice(), phase: "start" },
      { t: C.round4(duration * 0.7), frame: Math.round(timing.frames * 0.7), pos: endPos.slice(), phase: "arrive" },
      { t: duration, frame: timing.frames, pos: endPos.slice(), phase: "done" }
    ];
    scaleKeys = [
      { t: 0, scale: [100, 100], phase: "start" },
      { t: C.round4(duration * 0.7), scale: [100, 100], phase: "arrive" },
      { t: duration, scale: [102, 102], phase: "done" }
    ];
    click = null;
  }

  if (id === "EVT_CURSOR_DRAG") {
    const down = C.round4(duration * 0.12);
    const up = C.round4(duration * 0.88);
    const dip = C.round4(CURSOR.cursorScale * 100);
    positionKeys = [
      { t: 0, frame: 0, pos: startPos.slice(), phase: "start" },
      { t: down, frame: Math.round(timing.frames * 0.12), pos: startPos.slice(), phase: "down" },
      { t: up, frame: Math.round(timing.frames * 0.88), pos: endPos.slice(), phase: "up" },
      { t: duration, frame: timing.frames, pos: endPos.slice(), phase: "done" }
    ];
    scaleKeys = [
      { t: 0, scale: [100, 100], phase: "start" },
      { t: down, scale: [dip, dip], phase: "pressed" },
      { t: up, scale: [dip, dip], phase: "pressed" },
      { t: duration, scale: [100, 100], phase: "done" }
    ];
    click = { t: down, press: C.round4(up - down), mode: "drag", scaleKeys: scaleKeys };
  }

  if (id === "EVT_CURSOR_SWIPE") {
    const overshoot = [
      endPos[0] + (endPos[0] - startPos[0]) * 0.06,
      endPos[1] + (endPos[1] - startPos[1]) * 0.06
    ];
    positionKeys = [
      { t: 0, frame: 0, pos: startPos.slice(), phase: "start" },
      { t: midT, frame: timing.phases.mid, pos: [C.round4(overshoot[0]), C.round4(overshoot[1])], phase: "flick" },
      { t: duration, frame: timing.frames, pos: endPos.slice(), phase: "done" }
    ];
    scaleKeys = [
      { t: 0, scale: [100, 100], phase: "start" },
      { t: midT, scale: [96, 96], phase: "flick" },
      { t: duration, scale: [100, 100], phase: "done" }
    ];
    click = null;
  }

  if (id === "EVT_CURSOR_SELECT") {
    const down = C.round4(duration * 0.1);
    const up = C.round4(duration * 0.9);
    const dip = C.round4(CURSOR.cursorScale * 100);
    positionKeys = [
      { t: 0, frame: 0, pos: startPos.slice(), phase: "start" },
      { t: down, frame: Math.round(timing.frames * 0.1), pos: startPos.slice(), phase: "down" },
      { t: up, frame: Math.round(timing.frames * 0.9), pos: endPos.slice(), phase: "up" },
      { t: duration, frame: timing.frames, pos: endPos.slice(), phase: "done" }
    ];
    scaleKeys = pressKeys(down, press, CURSOR.cursorScale).concat([
      { t: C.round4(down + press), scale: [dip, dip], phase: "selecting" },
      { t: up, scale: [dip, dip], phase: "up" },
      { t: duration, scale: [100, 100], phase: "done" }
    ]);
    click = { t: down, press: C.round4(up - down), mode: "select", scaleKeys: scaleKeys };
  }

  if (id === "EVT_CURSOR_RIPPLE") {
    ripple = {
      name: "EVO_CURSOR_RIPPLE",
      type: "ellipse",
      parent: name,
      origin: endPos.slice(),
      scaleKeys: [
        { t: 0, scale: [20, 20], phase: "start" },
        { t: duration, scale: [140, 140], phase: "done" }
      ],
      opacityKeys: [
        { t: 0, opacity: 36, phase: "start" },
        { t: duration, opacity: 0, phase: "done" }
      ],
      note: "Halo only. No bounce. Optional companion to CLICK."
    };
    positionKeys = [{ t: 0, frame: 0, pos: endPos.slice(), phase: "hold" }, { t: duration, frame: timing.frames, pos: endPos.slice(), phase: "done" }];
    scaleKeys = [
      { t: 0, scale: [100, 100], phase: "start" },
      { t: C.round4(press * CURSOR.dipRatio), scale: [C.round4(CURSOR.cursorScale * 100), C.round4(CURSOR.cursorScale * 100)], phase: "dip" },
      { t: press, scale: [100, 100], phase: "up" }
    ];
    click = { t: 0, press: press, scaleKeys: scaleKeys };
  }

  const layer = {
    name: name,
    role: "cursor",
    style: style,
    shape: shape,
    rest: startPos.slice(),
    set: {
      position: positionKeys.map(function (k) {
        return { t: k.t, frame: k.frame, value: k.pos.slice(), phase: k.phase };
      }),
      scale: scaleKeys.map(function (k) {
        return { t: k.t, value: k.scale.slice(), phase: k.phase };
      })
    }
  };

  return C.wrapPlan("cursor-asset", id, timing, {
    category: "Cursor",
    name: meta.name,
    bestUse: meta.bestUse,
    description: "Apply " + id + " · " + timing.frames + "f @" + timing.fps + "fps · " + style,
    styleName: style,
    styles: CURSOR_STYLE_NAMES.slice(),
    cursor: {
      name: name,
      type: CURSOR.type,
      style: style,
      shape: shape,
      startPos: startPos,
      endPos: endPos,
      duration: duration,
      positionKeys: positionKeys,
      scaleKeys: scaleKeys,
      click: click
    },
    ripple: ripple,
    target: targetName ? { name: targetName } : null,
    layers: [layer],
    createCursor: id === "EVT_CURSOR_CLICK" ? base : null
  });
}

module.exports = {
  CURSOR_IDS,
  CURSOR_META,
  isCursorId,
  catalogRows,
  applyCursorPlan,
  pressKeys
};
