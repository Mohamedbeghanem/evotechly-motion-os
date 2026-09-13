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

function nextAction(state) {
  if (state && state.missingAssets && state.missingAssets.length) {
    return { engine: "p15", action: "OPEN ASSET" };
  }
  return { engine: "p19", action: "IDLE" };
}

module.exports = { ENGINES, resolveContext, nextAction };
