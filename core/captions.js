"use strict";

/**
 * Reel caption templates + a basic SRT parser.
 * Panel recreates these as AE text layers (no baked bitmaps).
 * Arabic stays live text so AE can shape RTL.
 */

const SAFE = {
  reel916: { top: 0.12, bottom: 0.14, side: 0.08 },
  wide169: { top: 0.08, bottom: 0.10, side: 0.06 }
};

const TEMPLATES = {
  hook: {
    id: "hook",
    label: "Hook caption",
    role: "caption",
    duration: 1,
    fontSizeScale: 1.35,
    align: "center",
    safe: "reel916",
    y: 0.42
  },
  kinetic: {
    id: "kinetic",
    label: "Word-by-word / line kinetic",
    role: "caption",
    duration: 2.2,
    fontSizeScale: 1.05,
    align: "center",
    safe: "reel916",
    y: 0.62,
    stagger: 0.08
  },
  stackArEn: {
    id: "stackArEn",
    label: "Two-line AR+EN stack",
    role: "caption",
    duration: 3,
    fontSizeScale: 1,
    align: "center",
    safe: "reel916",
    y: 0.72,
    stack: true,
    defaultPrimary: "ar"
  },
  lowerThird: {
    id: "lowerThird",
    label: "Lower-third name + title",
    role: "caption",
    duration: 4,
    fontSizeScale: 0.72,
    align: "left",
    safe: "wide169",
    y: 0.82
  },
  burnIn: {
    id: "burnIn",
    label: "Subs burn-in",
    role: "caption",
    duration: 2.4,
    fontSizeScale: 0.78,
    align: "center",
    safe: "reel916",
    y: 0.86
  }
};

const TEMPLATE_ORDER = ["hook", "kinetic", "stackArEn", "lowerThird", "burnIn"];

const FONTS_GUIDANCE = [
  "Noto Naskh Arabic",
  "Noto Sans Arabic",
  "Cairo",
  "IBM Plex Sans Arabic",
  "Inter",
  "SF Pro Text"
];

function srtTimeToSeconds(token) {
  const raw = String(token || "").trim().replace(",", ".");
  const parts = raw.split(":");
  if (parts.length < 3) return 0;
  const h = Number(parts[0]) || 0;
  const m = Number(parts[1]) || 0;
  const s = Number(parts[2]) || 0;
  return Math.round((h * 3600 + m * 60 + s) * 1000) / 1000;
}

function parseSrt(text) {
  const src = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = src.split(/\n\s*\n/);
  const cues = [];
  for (let i = 0; i < blocks.length; i++) {
    const lines = blocks[i].split("\n").filter(function (l) { return l.length; });
    if (!lines.length) continue;
    let idx = 0;
    if (/^\d+$/.test(lines[0])) idx = 1;
    if (!lines[idx] || lines[idx].indexOf("-->") === -1) continue;
    const times = lines[idx].split("-->");
    const start = srtTimeToSeconds(times[0]);
    const end = srtTimeToSeconds(times[1]);
    const body = lines.slice(idx + 1).join("\n");
    if (!body) continue;
    cues.push({ index: cues.length + 1, start: start, end: end, text: body });
  }
  return cues;
}

function getTemplate(id) {
  return TEMPLATES[id] || TEMPLATES.burnIn;
}

function safeMargins(frame) {
  return SAFE[frame] || SAFE.reel916;
}

module.exports = {
  SAFE,
  TEMPLATES,
  TEMPLATE_ORDER,
  FONTS_GUIDANCE,
  parseSrt,
  srtTimeToSeconds,
  getTemplate,
  safeMargins
};
