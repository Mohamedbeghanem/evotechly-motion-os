"use strict";

function parseTime(raw) {
  const s = String(raw || "").trim();
  if (/^\d+(\.\d+)?$/.test(s)) return Number(s);
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  if (m[3] != null) return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
  return Number(m[1]) * 60 + Number(m[2]);
}

function comment(opts) {
  const o = opts || {};
  return { id: o.id || "EVO_COMMENT_001", t: o.t || 0, text: String(o.text || ""), priority: o.priority || "NORMAL", status: o.status || "OPEN" };
}

module.exports = { parseTime, comment };
