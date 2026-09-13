"use strict";

function parseNumber(raw) {
  const s = String(raw == null ? "" : raw).trim();
  if (!s) return null;
  let t = s.replace(/%/g, "").replace(/\s/g, "");
  if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(t)) t = t.replace(/,/g, "");
  else if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t)) t = t.replace(/\./g, "").replace(",", ".");
  else if (/^\d+,\d+$/.test(t)) t = t.replace(",", ".");
  const n = Number(t);
  return isFinite(n) ? n : null;
}

function derived(row) {
  const r = row || {};
  const out = {};
  out.ctr = (r.impressions && r.clicks != null) ? r.clicks / r.impressions : (r.ctr != null ? r.ctr : null);
  out.cpc = (r.clicks && r.spend != null) ? r.spend / r.clicks : null;
  out.cpm = (r.impressions && r.spend != null) ? r.spend / r.impressions * 1000 : null;
  out.cvr = (r.clicks && r.conversions != null) ? r.conversions / r.clicks : null;
  out.cpa = (r.conversions && r.spend != null) ? r.spend / r.conversions : null;
  out.roas = (r.spend && r.revenue != null) ? r.revenue / r.spend : null;
  return out;
}

function weightedCtr(rows) {
  let impr = 0, clicks = 0;
  (rows || []).forEach(function (r) {
    if (r.impressions != null && r.clicks != null) { impr += r.impressions; clicks += r.clicks; }
  });
  return impr ? clicks / impr : null;
}

function compare(a, b, dims) {
  const da = dims && dims.a || {};
  const db = dims && dims.b || {};
  const keys = ["hook", "cta", "format", "lang", "duration"];
  const differ = keys.filter(function (k) { return da[k] && db[k] && da[k] !== db[k]; });
  return { differ: differ, quality: differ.length <= 1 ? "STRONGER" : "WEAK", confounded: differ.length > 1, label: differ.length > 1 ? "CONFOUNDED COMPARISON" : "CONTROLLED COMPARISON" };
}

function observation(opts) {
  const o = opts || {};
  return { id: o.id || "EVO_OBS_001", text: o.text || "", metric: o.metric || "CTR", causal: false };
}

module.exports = { parseNumber, derived, weightedCtr, compare, observation };
