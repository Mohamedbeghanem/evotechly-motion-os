"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const U = require("../core/ux");

test("phase numbers map to human labels", function () {
  assert.equal(U.label("P14"), "Variants");
  assert.equal(U.label("P12"), "Check");
});

test("selection classifies actions", function () {
  assert.deepEqual(U.actionsFor(U.classify("Hero Title")), ["Fade up", "Word reveal", "Keyword pop"]);
  assert.ok(U.actionsFor(U.classify("Save Deal Button")).indexOf("Click") !== -1);
});

test("next issue prefers blocking", function () {
  const n = U.nextIssue([{ severity: "OPEN", id: "a" }, { severity: "BLOCKING", id: "b" }]);
  assert.equal(n.id, "b");
});
