"use strict";

function parseFilename(name) {
  const s = String(name || "").toLowerCase();
  const out = { product: "", feature: "", lang: "", format: "", version: "" };
  if (/evocrm/.test(s)) out.product = "evocrm";
  if (/pipeline/.test(s)) out.feature = "pipeline";
  if (/[_\-]ar[_\-.]|arabic/.test(s)) out.lang = "ar";
  else if (/[_\-]en[_\-.]|english/.test(s)) out.lang = "en";
  if (/9x16|1080x1920/.test(s)) out.format = "9:16";
  if (/16x9|1920x1080/.test(s)) out.format = "16:9";
  return out;
}

module.exports = { parseFilename };
