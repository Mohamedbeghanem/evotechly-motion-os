"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const P = require("../core/profiler");
const A = require("../core/automation");
const C = require("../core/core");

test("node budgets hold on this host", function () {
  const rows = P.suite();
  const g = P.gate(rows);
  assert.equal(g.pass, true, JSON.stringify(g.fails));
});

test("duplicate IDs stay quarantined at 1k", function () {
  const id = C.newObjectId();
  const objs = [];
  for (let i = 0; i < 1000; i++) objs.push({ objectId: C.newObjectId(), objectType: "ASSET" });
  objs.push({ objectId: id, objectType: "ASSET" });
  objs.push({ objectId: id, objectType: "ASSET" });
  assert.equal(C.rebuild(objs).quarantined.length, 1);
});

test("automation loop still stops", function () {
  assert.equal(A.detectCycle([{ trigger: "A", emits: ["B"] }, { trigger: "B", emits: ["A"] }]), true);
  assert.equal(A.canAuto("variant.delete", "AUTO", "ASSISTED"), false);
});
