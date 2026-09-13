"use strict";

/**
 * Caption Style — P1c keyword color + in/out presets.
 * Deterministic animator / range plans. The companion JSX applies them in AE.
 * Native text animators only. Not Meow. Not Presetify. No ElevenLabs.
 */

const { easePair } = require("./polish");
const { normalizeDirection } = require("./direction");

const DEFAULT_COLOR = "#3DDC97";
const FPS = 30;
const DEFAULT_FRAMES = 12;
const HOLD = 0.2;
const SLIDE_TRAVEL = 16;
const SCALE_FROM = 80;
const BLUR_FROM = 12;

const PRESETS = ["fade", "scale", "slideUp", "typewriter", "blur"];

const COMPANIONS_POLICY =
  "Optional. Not required. Never redistributed. Caption Style Tools is the native path.";

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

function hasArabic(text) {
  return /[\u0600-\u06FF]/.test(String(text || ""));
}

function normalizePreset(preset) {
  const key = String(preset || "fade").replace(/[\s_-]/g, "").toLowerCase();
  if (key === "slideup") return "slideUp";
  if (key === "fade" || key === "scale" || key === "typewriter" || key === "blur") return key;
  return "fade";
}

function parseColorHex(input) {
  let s = String(input == null ? "" : input).trim();
  if (s.charAt(0) === "#") s = s.slice(1);
  if (/^[0-9a-fA-F]{3}$/.test(s)) {
    s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
  }
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return DEFAULT_COLOR;
  return "#" + s.toUpperCase();
}

function hexToRgb01(hex) {
  const h = parseColorHex(hex).slice(1);
  return [
    round4(parseInt(h.slice(0, 2), 16) / 255),
    round4(parseInt(h.slice(2, 4), 16) / 255),
    round4(parseInt(h.slice(4, 6), 16) / 255)
  ];
}

function normalizeKeywords(list) {
  if (list == null) return [];
  if (typeof list === "string") {
    list = String(list).split(/[,;\n]+/);
  }
  if (!Array.isArray(list)) return [];
  const seen = {};
  const out = [];
  list.forEach(function (item) {
    const token = String(item == null ? "" : item).trim();
    if (!token) return;
    const key = token.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    out.push(token);
  });
  out.sort(function (a, b) {
    return b.length - a.length;
  });
  return out;
}

function rangesOverlap(a, b) {
  return a.start < b.end && b.start < a.end;
}

function findKeywordRanges(text, keywords) {
  const src = String(text == null ? "" : text);
  const words = normalizeKeywords(keywords);
  if (!src || !words.length) return [];
  const lower = src.toLowerCase();
  const taken = [];
  const found = [];

  words.forEach(function (kw) {
    const needle = kw.toLowerCase();
    if (!needle) return;
    let from = 0;
    while (from < lower.length) {
      const i = lower.indexOf(needle, from);
      if (i === -1) break;
      const range = {
        keyword: kw,
        start: i,
        end: i + needle.length,
        length: needle.length
      };
      const hit = taken.some(function (prev) {
        return rangesOverlap(prev, range);
      });
      if (!hit) {
        taken.push(range);
        found.push(range);
      }
      from = i + needle.length;
    }
  });

  found.sort(function (a, b) {
    return a.start - b.start;
  });

  const len = src.length || 1;
  return found.map(function (r, i) {
    return {
      keyword: r.keyword,
      index: i,
      start: r.start,
      end: r.end,
      length: r.length,
      aeStart: r.start + 1,
      aeEnd: r.end,
      startPercent: round4((r.start / len) * 100),
      endPercent: round4((r.end / len) * 100)
    };
  });
}

function colorKeywords(opts) {
  opts = opts || {};
  const text = opts.text == null ? "" : String(opts.text);
  const colorHex = parseColorHex(opts.colorHex);
  const colorRgb = hexToRgb01(colorHex);
  const ranges = findKeywordRanges(text, opts.keywords);

  return {
    kind: "colorKeywords",
    note: "Native AE text animator Fill Color + range selector. Meow Captions is not required.",
    text: text,
    colorHex: colorHex,
    colorRgb: colorRgb,
    arabic: hasArabic(text),
    ranges: ranges,
    animators: ranges.map(function (r, i) {
      return {
        name: "EVO_CAP_COLOR_" + i,
        property: "fillColor",
        matchName: "ADBE Text Fill Color",
        color: colorRgb,
        selector: {
          type: "range",
          basedOn: "characters",
          units: "index",
          start: r.start,
          end: r.end,
          aeStart: r.aeStart,
          aeEnd: r.aeEnd,
          startPercent: r.startPercent,
          endPercent: r.endPercent
        }
      };
    })
  };
}

function presetAnimators(preset) {
  if (preset === "scale") {
    return [{
      name: "EVO_CAP_SCALE",
      property: "scale",
      matchName: "ADBE Text Scale 3D",
      from: [SCALE_FROM, SCALE_FROM, 100],
      to: [100, 100, 100]
    }];
  }
  if (preset === "slideUp") {
    return [
      {
        name: "EVO_CAP_OPACITY",
        property: "opacity",
        matchName: "ADBE Text Opacity",
        from: 0,
        to: 100
      },
      {
        name: "EVO_CAP_POSITION",
        property: "position",
        matchName: "ADBE Text Position 3D",
        from: [0, SLIDE_TRAVEL, 0],
        to: [0, 0, 0]
      }
    ];
  }
  if (preset === "typewriter") {
    return [{
      name: "EVO_CAP_TYPEWRITER",
      property: "opacity",
      matchName: "ADBE Text Opacity",
      from: 0,
      to: 100
    }];
  }
  if (preset === "blur") {
    return [
      {
        name: "EVO_CAP_OPACITY",
        property: "opacity",
        matchName: "ADBE Text Opacity",
        from: 0,
        to: 100
      },
      {
        name: "EVO_CAP_BLUR",
        property: "blur",
        matchName: "ADBE Text Blur",
        from: BLUR_FROM,
        to: 0
      }
    ];
  }
  return [{
    name: "EVO_CAP_OPACITY",
    property: "opacity",
    matchName: "ADBE Text Opacity",
    from: 0,
    to: 100
  }];
}

function propertyKeys(from, to, direction, duration, hold) {
  if (direction === "out") {
    return [
      { t: 0, value: to },
      { t: duration, value: from }
    ];
  }
  if (direction === "both") {
    return [
      { t: 0, value: from },
      { t: duration, value: to },
      { t: round4(duration + hold), value: to },
      { t: round4(duration + hold + duration), value: from }
    ];
  }
  return [
    { t: 0, value: from },
    { t: duration, value: to }
  ];
}

function typewriterEndKeys(direction, duration, hold) {
  if (direction === "out") {
    return [
      { t: 0, end: 100 },
      { t: duration, end: 0 }
    ];
  }
  if (direction === "both") {
    return [
      { t: 0, end: 0 },
      { t: duration, end: 100 },
      { t: round4(duration + hold), end: 100 },
      { t: round4(duration + hold + duration), end: 0 }
    ];
  }
  return [
    { t: 0, end: 0 },
    { t: duration, end: 100 }
  ];
}

function lerpValue(a, b, u) {
  if (Array.isArray(a) && Array.isArray(b)) {
    const out = [];
    const n = Math.max(a.length, b.length);
    let i;
    for (i = 0; i < n; i++) {
      out.push(round4(lerpValue(a[i] == null ? 0 : a[i], b[i] == null ? 0 : b[i], u)));
    }
    return out;
  }
  return round4(Number(a) + (Number(b) - Number(a)) * u);
}

function valueAtKeys(keys, t, field) {
  const list = keys || [];
  if (!list.length) return null;
  const x = Number(t);
  if (x <= list[0].t) return list[0][field];
  let i;
  for (i = 0; i < list.length - 1; i++) {
    const a = list[i];
    const b = list[i + 1];
    if (x >= a.t && x <= b.t) {
      const span = b.t - a.t;
      const u = span === 0 ? 1 : clamp((x - a.t) / span, 0, 1);
      return lerpValue(a[field], b[field], u);
    }
  }
  return list[list.length - 1][field];
}

function captionInOut(opts) {
  opts = opts || {};
  const requested = normalizePreset(opts.preset);
  const direction = normalizeDirection(opts.direction);
  const fps = clamp(opts.fps == null ? FPS : opts.fps, 1, 120);
  const frames = Math.round(clamp(opts.frames == null ? DEFAULT_FRAMES : opts.frames, 1, 180));
  const duration = round4(frames / fps);
  const hold = HOLD;
  const text = opts.text == null ? "" : String(opts.text);
  const arabic = hasArabic(text);
  let preset = requested;
  let note = "Native AE text animators. Presetify / Meow Captions are not required.";
  if (arabic && requested === "typewriter") {
    preset = "fade";
    note = "Arabic detected. Typewriter would break shaping. Using fade. Live text, no bitmap.";
  }

  const selector = preset === "typewriter"
    ? {
      type: "range",
      basedOn: "characters",
      rangeType: 1,
      start: 0,
      keys: typewriterEndKeys(direction, duration, hold)
    }
    : {
      type: "range",
      basedOn: "all",
      rangeType: 3,
      start: 0,
      end: 100
    };

  const animators = presetAnimators(preset).map(function (def) {
    const item = {
      name: def.name,
      property: def.property,
      matchName: def.matchName,
      from: def.from,
      to: def.to,
      selector: selector
    };
    if (preset === "typewriter") {
      item.value = 0;
      item.selectorKeys = selector.keys;
    } else {
      item.keys = propertyKeys(def.from, def.to, direction, duration, hold);
    }
    return item;
  });

  return {
    kind: "captionInOut",
    preset: preset,
    requestedPreset: requested,
    direction: direction,
    frames: frames,
    fps: fps,
    duration: duration,
    hold: direction === "both" ? hold : 0,
    ease: "apple",
    easeInfluences: easePair("apple"),
    arabic: arabic,
    note: note,
    animators: animators
  };
}

function captionValueAt(plan, property, t) {
  if (!plan || !plan.animators) return null;
  let i;
  for (i = 0; i < plan.animators.length; i++) {
    const anim = plan.animators[i];
    if (anim.property !== property) continue;
    if (anim.keys) return valueAtKeys(anim.keys, t, "value");
    if (anim.selectorKeys) return valueAtKeys(anim.selectorKeys, t, "end");
    return anim.value;
  }
  return null;
}

module.exports = {
  DEFAULT_COLOR,
  PRESETS,
  FPS,
  DEFAULT_FRAMES,
  HOLD,
  SLIDE_TRAVEL,
  SCALE_FROM,
  BLUR_FROM,
  COMPANIONS_POLICY,
  round4,
  clamp,
  hasArabic,
  normalizePreset,
  parseColorHex,
  hexToRgb01,
  normalizeKeywords,
  findKeywordRanges,
  colorKeywords,
  captionInOut,
  captionValueAt,
  valueAtKeys
};
