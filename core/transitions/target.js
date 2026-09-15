"use strict";

/**
 * Target-frame zoom plan. Pure math — no AE.
 * Scale is AE percent. Position delta assumes the layer anchors at comp center
 * (fullscreen screenshot / UI plate) and we scale about that anchor.
 */

const { round4, clamp } = require("../saasDemo");

const DEFAULT_PADDING = 80;

function boundsOf(layerBounds) {
  const b = layerBounds || {};
  const l = Number(b.l != null ? b.l : b.left);
  const t = Number(b.t != null ? b.t : b.top);
  const r = Number(b.r != null ? b.r : b.right);
  const btm = Number(b.b != null ? b.b : b.bottom);
  return { l: l, t: t, r: r, b: btm };
}

function planTargetZoom(opts) {
  opts = opts || {};
  const compW = Number(opts.compW);
  const compH = Number(opts.compH);
  const padding = clamp(opts.padding == null ? DEFAULT_PADDING : opts.padding, 0, 400);
  const box = boundsOf(opts.layerBounds);
  const width = box.r - box.l;
  const height = box.b - box.t;
  const compCenter = [round4(compW / 2), round4(compH / 2)];

  const empty = {
    scale: [100, 100],
    scaleFactor: 1,
    positionDelta: [0, 0],
    targetCenter: [round4((box.l + box.r) / 2), round4((box.t + box.b) / 2)],
    compCenter: compCenter,
    framedSize: [round4(width), round4(height)],
    padding: padding,
    valid: false
  };

  if (!(compW > 0) || !(compH > 0) || !(width > 0) || !(height > 0)) {
    empty.targetCenter = [compCenter[0], compCenter[1]];
    empty.framedSize = [0, 0];
    return empty;
  }

  const availW = Math.max(1, compW - padding * 2);
  const availH = Math.max(1, compH - padding * 2);
  const scaleFactor = Math.min(availW / width, availH / height);
  const targetCenter = [round4((box.l + box.r) / 2), round4((box.t + box.b) / 2)];
  const scalePct = round4(scaleFactor * 100);
  // Scale about comp-center anchor: region center moves by (c - anchor) * S.
  // Delta brings that point back to frame center. Force +0 so tests stay signed-zero safe.
  const positionDelta = [
    round4(-(targetCenter[0] - compCenter[0]) * scaleFactor) || 0,
    round4(-(targetCenter[1] - compCenter[1]) * scaleFactor) || 0
  ];

  return {
    scale: [scalePct, scalePct],
    scaleFactor: round4(scaleFactor),
    positionDelta: positionDelta,
    targetCenter: targetCenter,
    compCenter: compCenter,
    framedSize: [round4(width * scaleFactor), round4(height * scaleFactor)],
    padding: padding,
    valid: true
  };
}

/**
 * Card → detail bounds morph. Position + independent scale — not mesh warp.
 * Outgoing travels +scale toward dest. Incoming starts at inverse scale/offset.
 */
function planBoundsMorph(opts) {
  opts = opts || {};
  const from = boundsOf(opts.fromBounds || opts.sourceBounds || opts.layerBounds);
  const to = boundsOf(opts.toBounds || opts.destBounds);
  const fromW = from.r - from.l;
  const fromH = from.b - from.t;
  const toW = to.r - to.l;
  const toH = to.b - to.t;
  const fromCenter = [round4((from.l + from.r) / 2), round4((from.t + from.b) / 2)];
  const toCenter = [round4((to.l + to.r) / 2), round4((to.t + to.b) / 2)];
  const valid = fromW > 0 && fromH > 0 && toW > 0 && toH > 0;
  const sx = valid ? round4((toW / fromW) * 100) : 100;
  const sy = valid ? round4((toH / fromH) * 100) : 100;
  const invSx = valid ? round4((fromW / toW) * 100) : 100;
  const invSy = valid ? round4((fromH / toH) * 100) : 100;
  const positionDelta = [round4(toCenter[0] - fromCenter[0]) || 0, round4(toCenter[1] - fromCenter[1]) || 0];
  return {
    fromCenter: fromCenter,
    toCenter: toCenter,
    positionDelta: positionDelta,
    scale: [sx, sy],
    inverseScale: [invSx, invSy],
    fromSize: [round4(Math.max(0, fromW)), round4(Math.max(0, fromH))],
    toSize: [round4(Math.max(0, toW)), round4(Math.max(0, toH))],
    valid: valid
  };
}

module.exports = {
  DEFAULT_PADDING,
  planTargetZoom,
  planBoundsMorph
};
