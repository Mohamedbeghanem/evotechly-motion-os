"use strict";

const C = require("./core");
const A = require("./automation");
const An = require("./analytics");

function now() {
  return process.hrtime.bigint();
}

function ms(start) {
  return Number(now() - start) / 1e6;
}

function run(name, fn) {
  const t0 = now();
  const result = fn();
  return { name: name, ms: ms(t0), result: result };
}

function stressRegistry(n) {
  const objs = [];
  for (let i = 0; i < n; i++) {
    objs.push({ objectId: C.newObjectId(), objectType: i % 5 === 0 ? "ASSET" : "VARIANT" });
  }
  return C.rebuild(objs);
}

function stressGraph(n) {
  const g = C.graph();
  const ids = [];
  for (let i = 0; i < n; i++) ids.push("o" + i);
  for (let i = 0; i < n; i++) C.link(g, ids[i], ids[(i + 1) % n], "USES");
  return C.whereUsed(g, "o0").length;
}

function stressEvents(n) {
  let ok = 0;
  for (let i = 0; i < n; i++) {
    if (C.emit(C.event({ committed: true })).ok) ok++;
  }
  return ok;
}

function stressRules(n) {
  const rules = [];
  for (let i = 0; i < n; i++) {
    rules.push(A.rule({ id: "R" + i, trigger: "ASSET_READY", actions: ["refresh.readiness"], mode: "AUTO" }));
  }
  return A.match(rules, { type: "ASSET_READY" }, {}).length;
}

function stressCtr(n) {
  const rows = [];
  for (let i = 0; i < n; i++) rows.push({ impressions: 1000, clicks: 20 });
  return An.weightedCtr(rows);
}

function suite() {
  return [
    run("registry.1k", function () { return stressRegistry(1000).quarantined.length; }),
    run("registry.10k", function () { return stressRegistry(10000).quarantined.length; }),
    run("graph.10k", function () { return stressGraph(10000); }),
    run("events.1k", function () { return stressEvents(1000); }),
    run("rules.500", function () { return stressRules(500); }),
    run("analytics.10k", function () { return stressCtr(10000); })
  ];
}

const BUDGETS_MS = {
  "registry.1k": 200,
  "registry.10k": 2500,
  "graph.10k": 200,
  "events.1k": 200,
  "rules.500": 50,
  "analytics.10k": 50
};

function gate(rows) {
  const fails = rows.filter(function (r) { return r.ms > (BUDGETS_MS[r.name] || 1e9); });
  return { pass: fails.length === 0, fails: fails };
}

module.exports = { run, suite, BUDGETS_MS, gate, stressRegistry, stressGraph };
