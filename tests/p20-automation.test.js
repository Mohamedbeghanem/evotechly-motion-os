"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const A = require("../core/automation");

test("destructive never autos", function () {
  assert.equal(A.canAuto("variant.delete", "AUTO", "ASSISTED"), false);
  assert.equal(A.canAuto("director.apply", "AUTO", "ASSISTED"), false);
  assert.equal(A.safetyOf("qa.preflight"), "READ_ONLY");
});

test("conservative profile downgrades writes", function () {
  assert.equal(A.canAuto("variant.markUpdate", "AUTO", "CONSERVATIVE"), false);
  assert.equal(A.canAuto("refresh.readiness", "AUTO", "CONSERVATIVE"), true);
});

test("conditions and already-satisfied skip", function () {
  const r = A.rule({ trigger: "ASSET_READY", conditions: [{ field: "brand", op: "EQUALS", value: "evocrm" }], actions: ["refresh.readiness"] });
  assert.equal(A.match([r], { type: "ASSET_READY" }, { brand: "evocrm" }).length, 1);
  assert.equal(A.match([r], { type: "ASSET_READY" }, { brand: "other" }).length, 0);
  assert.equal(A.alreadySatisfied("qa.preflight", { qa: "READY" }), true);
});

test("cycles and chain depth stop", function () {
  assert.equal(A.detectCycle([
    { trigger: "A", emits: ["B"] },
    { trigger: "B", emits: ["A"] }
  ]), true);
  assert.equal(A.chainStop(5, 5), true);
});
