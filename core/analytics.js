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
  const impr = r.impressions;
  const clicks = r.clicks;
  const spend = r.spend;
  const conv = r.conversions;
  const rev = r.revenue;
  const out = {};
  out.ctr = (impr && clicks != null) ? clicks / impr : (r.ctr != null ? r.ctr : null);
  out.cpc = (clicks && spend != null) ? spend / clicks : null;
  out.cpm = (impr && spend != null) ? spend / impr * 1000 : null;
  out.cvr = (clicks && conv != null) ? conv / clicks : null;
  out.cpa = (conv && spend != null) ? spend / conv : null;
  out.roas = (spend && rev != null) ? rev / spend : null;
  return out;
}

function weightedCtr(rows) {
  let impr = 0, clicks = 0;
  (rows || []).forEach(function (r) {
    if (r.impressions != null && r.clicks != null) {
      impr += r.impressions;
      clicks += r.clicks;
    }
  });
  if (!impr) return null;
  return clicks / impr;
}

function compare(a, b, dims) {
  const da = dims && dims.a || {};
  const db = dims && dims.b || {};
  const keys = ["hook", "cta", "format", "lang", "duration"];
  const differ = keys.filter(function (k) { return da[k] && db[k] && da[k] !== db[k]; });
  const quality = differ.length <= 1 ? "STRONGER" : differ.length === 2 ? "MODERATE" : "WEAK";
  return {
    differ: differ,
    quality: quality,
    confounded: differ.length > 1,
    label: differ.length > 1 ? "CONFOUNDED COMPARISON" : "CONTROLLED COMPARISON"
  };
}

function observation(opts) {
  const o = opts || {};
  return {
    id: o.id || "EVO_OBS_001",
    text: o.text || "",
    metric: o.metric || "CTR",
    a: o.a,
    b: o.b,
    absPts: o.absPts,
    confidence: o.confidence || "LOW",
    causal: false
  };
}

function learning(opts) {
  const o = opts || {};
  return {
    id: o.id || "EVO_LEARNING_001",
    status: o.status || "OBSERVED",
    scope: o.scope || "campaign",
    observation: o.observation || "",
    directorEligible: !!o.directorEligible,
    brandOk: o.brandOk !== false
  };
}

function promote(l) {
  return Object.assign({}, l, { directorEligible: true, status: l.status === "OBSERVED" ? "TENTATIVE" : l.status });
}

function mixedCurrency(rows) {
  const set = {};
  (rows || []).forEach(function (r) { if (r.currency) set[r.currency] = true; });
  return Object.keys(set).length > 1;
}

function parseCsv(text, map) {
  const m = map || { impressions: 1, clicks: 2 };
  const lines = String(text || "").split(/\n/).filter(Boolean);
  const rows = [];
  const errors = [];
  lines.forEach(function (line, i) {
    if (i === 0 && /impress/i.test(line)) return;
    const cols = line.split(",");
    const impr = parseNumber(cols[m.impressions]);
    const clicks = parseNumber(cols[m.clicks]);
    if (impr == null && clicks == null) errors.push(i);
    else rows.push({ impressions: impr, clicks: clicks });
  });
  return { rows: rows, errors: errors };
}

module.exports = {
  parseNumber,
  derived,
  weightedCtr,
  compare,
  observation,
  learning,
  promote,
  mixedCurrency,
  parseCsv
};
