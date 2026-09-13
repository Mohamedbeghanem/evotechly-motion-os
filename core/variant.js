"use strict";

const FORMATS = {
  "16:9": { w: 1920, h: 1080 },
  "9:16": { w: 1080, h: 1920 },
  "4:5": { w: 1080, h: 1350 },
  "1:1": { w: 1080, h: 1080 }
};

function nextVariantId(existing) {
  let max = 0;
  (existing || []).forEach(function (v) {
    const n = parseInt(String(v.id || "").replace("EVO_VARIANT_", ""), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  const s = String(max + 1);
  return "EVO_VARIANT_" + (s.length < 3 ? ("000" + s).slice(-3) : s);
}

module.exports = { FORMATS, nextVariantId };
