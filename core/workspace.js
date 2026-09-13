"use strict";

const ENGINES = [
  { id: "p8", name: "Edit", api: "1.0" },
  { id: "p11", name: "Brand", api: "1.0" },
  { id: "p12", name: "QA", api: "1.0" },
  { id: "p13", name: "Director", api: "1.0" },
  { id: "p14", name: "Variants", api: "1.0" },
  { id: "p15", name: "Assets", api: "1.0" },
  { id: "p16", name: "Review", api: "1.0" },
  { id: "p17", name: "Production", api: "1.0" },
  { id: "p18", name: "Analytics", api: "1.0" }
];

function resolveContext(input) {
  const i = input || {};
  if (i.explicit) return { kind: i.explicit.kind, id: i.explicit.id, ambiguous: false };
  const hits = [];
  if (i.variantId) hits.push({ kind: "variant", id: i.variantId });
  if (i.editId) hits.push({ kind: "edit", id: i.editId });
  if (i.contentId) hits.push({ kind: "content", id: i.contentId });
  if (i.compName) hits.push({ kind: "comp", id: i.compName });
  if (hits.length > 1 && i.ambiguousComps) {
    return { kind: "AMBIGUOUS", id: "", ambiguous: true, choices: i.ambiguousComps };
  }
  if (!hits.length) return { kind: "unmanaged", id: "", ambiguous: false };
  return Object.assign({ ambiguous: false }, hits[0]);
}

function blockers(state) {
  const s = state || {};
  const out = [];
  if (s.missingAssets && s.missingAssets.length) {
    out.push({ engine: "p15", severity: "BLOCKER", message: "Missing " + s.missingAssets[0], action: "OPEN ASSET" });
  }
  if (s.reviewBlocking) out.push({ engine: "p16", severity: "BLOCKER", message: "Open blocking review", action: "OPEN REVIEW" });
  if (s.qaBlocked) out.push({ engine: "p12", severity: "BLOCKER", message: "QA blocked", action: "RUN PREFLIGHT" });
  if (s.brandHard) out.push({ engine: "p11", severity: "WARNING", message: "Brand policy warning", action: "CHECK BRAND" });
  return out;
}

function nextAction(state) {
  const b = blockers(state);
  if (b.length) return b[0];
  if (state && state.stage === "READY TO EDIT" && !state.editId) {
    return { engine: "p8", severity: "NEXT", message: "Create master edit", action: "CREATE WITH P8" };
  }
  if (state && state.stage === "EDITING") {
    return { engine: "p8", severity: "NEXT", message: "Continue edit", action: "CONTINUE EDIT" };
  }
  return { engine: "p19", severity: "NEXT", message: "No required action", action: "IDLE" };
}

function commandSearch(q, registry) {
  const n = String(q || "").toLowerCase();
  return (registry || []).filter(function (c) {
    return (c.label + " " + (c.keywords || "")).toLowerCase().indexOf(n) !== -1;
  });
}

function capability(engineId, name, installed) {
  const e = (installed || ENGINES).filter(function (x) { return x.id === engineId; })[0];
  if (!e) return { ok: false, reason: "UNAVAILABLE" };
  if (e.api !== "1.0") return { ok: false, reason: "VERSION MISMATCH" };
  return { ok: true, reason: name };
}

module.exports = { ENGINES, resolveContext, blockers, nextAction, commandSearch, capability };
