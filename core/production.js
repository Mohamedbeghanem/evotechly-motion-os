"use strict";

function nextContentId(existing, prefix) {
  const pre = prefix || "EVO-VID-";
  let max = 0;
  (existing || []).forEach(function (c) {
    const n = parseInt(String(c.id || "").replace(pre, ""), 10);
    if (!isNaN(n) && n > max) max = n;
  });
  const s = String(max + 1);
  return pre + (s.length < 3 ? ("000" + s).slice(-3) : s);
}

function contentItem(opts) {
  const o = opts || {};
  return { id: o.id || "EVO-VID-001", title: o.title || "", type: o.type || "SOCIAL AD", status: o.status || "IDEA" };
}

function readiness(item) {
  const it = item || {};
  const miss = it.missing || [];
  if (miss.length) return { status: "BLOCKED", missing: miss };
  return { status: "READY TO SHOOT", missing: [] };
}

module.exports = { nextContentId, contentItem, readiness };
