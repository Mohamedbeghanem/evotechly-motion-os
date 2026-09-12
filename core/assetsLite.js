"use strict";

/**
 * In-panel asset browser catalog. Paths only — no binaries.
 */

const CAPTION_ASSETS = [
  { id: "hook", label: "Hook caption", kind: "template", file: "assets/caption-templates.json" },
  { id: "kinetic", label: "Word-by-word / kinetic", kind: "template", file: "assets/caption-templates.json" },
  { id: "stackArEn", label: "Two-line AR+EN", kind: "template", file: "assets/caption-templates.json" },
  { id: "lowerThird", label: "Lower-third", kind: "template", file: "assets/caption-templates.json" },
  { id: "burnIn", label: "Subs burn-in", kind: "template", file: "assets/caption-templates.json" }
];

const SRT_ASSETS = [
  { id: "demo-en", label: "demo-en.srt", kind: "srt", file: "examples/captions/demo-en.srt" },
  { id: "demo-ar", label: "demo-ar.srt", kind: "srt", file: "examples/captions/demo-ar.srt" },
  { id: "demo-ar-en", label: "demo-ar-en.srt", kind: "srt", file: "examples/captions/demo-ar-en.srt" }
];

const COMPANIONS = [
  { name: "Liquid Glass", url: "https://aescripts.com/tools-for-motion/", note: "companion, not bundled" },
  { name: "Comp Exporter", url: "https://aescripts.com/tools-for-motion/", note: "companion, not bundled" },
  { name: "Saber", url: "https://www.videocopilot.net/products/saber/", note: "hooks only" },
  { name: "QCA3", url: "https://aescripts.com/quick-chromatic-aberration/", note: "hooks only" },
  { name: "Displacer Pro", url: "https://aescripts.com/displacer-pro/", note: "hooks only" },
  { name: "Animation Composer (free)", url: "https://www.mrhorse.com/animation-composer/", note: "hooks only" }
];

function listCaptionAssets() {
  return CAPTION_ASSETS.slice();
}

function listSrtAssets() {
  return SRT_ASSETS.slice();
}

module.exports = {
  CAPTION_ASSETS,
  SRT_ASSETS,
  COMPANIONS,
  listCaptionAssets,
  listSrtAssets
};
