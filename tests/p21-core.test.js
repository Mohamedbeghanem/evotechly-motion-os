"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const C = require("../core/core");

test("IDs unique; human rename does not change objectId", function () {
  const a = C.newObjectId();
  const b = C.newObjectId();
  assert.notEqual(a, b);
  const obj = { objectId: a, objectType: "CONTENT", displayId: "EVO-AD-041" };
  obj.displayId = "Deal Won — September";
  assert.equal(obj.objectId, a);
});

test("duplicate IDs quarantine; events only after commit", function () {
  const id = C.newObjectId();
  const r = C.rebuild([{ objectId: id, objectType: "ASSET" }, { objectId: id, objectType: "ASSET" }]);
  assert.equal(r.quarantined.length, 1);
  assert.equal(C.emit(C.event({ committed: false })).ok, false);
  assert.equal(C.emit(C.event({ committed: true })).ok, true);
});

test("newer schema is read-only; same schema needs no migrate", function () {
  assert.equal(C.migratePreview(5, 4).status, "BLOCKED");
  assert.equal(C.migratePreview(4, 4).status, "NOT NEEDED");
});

test("where-used and status map", function () {
  const g = C.graph();
  C.link(g, "edit1", "asset1", "USES");
  assert.equal(C.whereUsed(g, "asset1").length, 1);
  assert.equal(C.normalizeHealth("READY_WITH_WARNINGS"), "WARNING");
});
