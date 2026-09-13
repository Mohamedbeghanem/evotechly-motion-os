"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const W = require("../core/workspace");

test("ambiguous comps are not guessed", function () {
  const r = W.resolveContext({ ambiguousComps: ["A", "B"], editId: "e1", variantId: "v1" });
  assert.equal(r.ambiguous, true);
  assert.equal(r.kind, "AMBIGUOUS");
});

test("missing asset is the next action", function () {
  const n = W.nextAction({ missingAssets: ["PRODUCT_DEAL_WON"] });
  assert.equal(n.engine, "p15");
  assert.equal(n.action, "OPEN ASSET");
});

test("command search and missing engine", function () {
  const hits = W.commandSearch("push", [{ label: "Add Micro Push", keywords: "camera", engine: "p3" }]);
  assert.equal(hits.length, 1);
  assert.equal(W.capability("p99", "x", W.ENGINES).reason, "UNAVAILABLE");
});

test("unmanaged context is valid", function () {
  const r = W.resolveContext({});
  assert.equal(r.kind, "unmanaged");
});
