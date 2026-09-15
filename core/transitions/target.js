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

module.exports = {
  DEFAULT_PADDING,
  planTargetZoom
};
