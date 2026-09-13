"use strict";

const TRIGGERS = [
  "ASSET_READY", "ASSET_UPDATED", "EDIT_UPDATED", "VARIANT_UPDATED",
  "QA_STATUS_CHANGED", "REVIEW_APPROVED", "CONTENT_STATUS_CHANGED",
  "PERFORMANCE_IMPORTED", "LEARNING_PROMOTED", "SCRIPT_UPDATED"
];

const SAFETY = {
  "refresh.readiness": "READ_ONLY",
  "qa.preflight": "READ_ONLY",
  "brand.check": "READ_ONLY",
  "variant.markUpdate": "SAFE_WRITE",
  "review.suggest": "READ_ONLY",
  "review.start": "CONFIRM_WRITE",
  "variant.rebuild": "CONFIRM_WRITE",
  "variant.delete": "DESTRUCTIVE",
  "director.apply": "DESTRUCTIVE",
  "edit.compile": "CONFIRM_WRITE"
};

function safetyOf(cmd) {
  return SAFETY[cmd] || "CONFIRM_WRITE";
}

function canAuto(cmd, mode, profile) {
  const s = safetyOf(cmd);
  if (s === "DESTRUCTIVE") return false;
  if (mode === "SUGGEST" || mode === "ASK") return false;
  if (profile === "CONSERVATIVE" && s !== "READ_ONLY") return false;
  return mode === "AUTO" && (s === "READ_ONLY" || s === "SAFE_WRITE");
}

function rule(opts) {
  const o = opts || {};
  return {
    id: o.id || "EVO_RULE_001",
    name: o.name || "Untitled",
    enabled: o.enabled !== false,
    trigger: o.trigger || "ASSET_READY",
    conditions: o.conditions || [],
    actions: o.actions || [],
    mode: o.mode || "SUGGEST",
    scope: o.scope || "PROJECT"
  };
}

function condOk(conds, ctx) {
  const list = conds || [];
  if (!list.length) return true;
  return list.every(function (c) {
    const v = ctx && ctx[c.field];
    if (c.op === "EQUALS") return v === c.value;
    if (c.op === "NOT_EQUALS") return v !== c.value;
    if (c.op === "EXISTS") return v != null && v !== "";
    return false;
  });
}

function match(rules, event, ctx) {
  return (rules || []).filter(function (r) {
    if (!r.enabled) return false;
    if (r.trigger !== event.type) return false;
    return condOk(r.conditions, ctx);
  });
}

function detectCycle(rules) {
  const graph = {};
  (rules || []).forEach(function (r) {
    graph[r.trigger] = graph[r.trigger] || [];
    (r.emits || []).forEach(function (e) { graph[r.trigger].push(e); });
  });
  function dfs(node, stack) {
    if (stack.indexOf(node) !== -1) return true;
    const next = graph[node] || [];
    for (let i = 0; i < next.length; i++) {
      if (dfs(next[i], stack.concat(node))) return true;
    }
    return false;
  }
  return Object.keys(graph).some(function (k) { return dfs(k, []); });
}

function chainStop(depth, max) {
  return depth >= (max || 5);
}

module.exports = { TRIGGERS, SAFETY, safetyOf, canAuto, rule, condOk, match, detectCycle, chainStop };
