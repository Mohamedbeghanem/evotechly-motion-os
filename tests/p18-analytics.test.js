"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const A = require("../core/analytics");

test("weighted CTR is clicks/impressions not mean of percents", function () {
  const w = A.weightedCtr([
    { impressions: 100, clicks: 10 },
    { impressions: 900, clicks: 9 }
  ]);
  assert.ok(Math.abs(w - 0.019) < 1e-9);
});

test("zero denominator is null; mixed currency flagged", function () {
  assert.equal(A.derived({ spend: 10, clicks: 0 }).cpc, null);
  assert.equal(A.mixedCurrency([{ currency: "DZD" }, { currency: "USD" }]), true);
});

test("one differing field is controlled; many is confounded", function () {
  const ok = A.compare({}, {}, { a: { hook: "A", format: "9:16" }, b: { hook: "B", format: "9:16" } });
  assert.equal(ok.confounded, false);
  const bad = A.compare({}, {}, { a: { hook: "A", format: "9:16", lang: "en" }, b: { hook: "B", format: "4:5", lang: "ar" } });
  assert.equal(bad.confounded, true);
  assert.equal(bad.label, "CONFOUNDED COMPARISON");
});

test("observations are not causal; promote is explicit", function () {
  const o = A.observation({ text: "Hook B higher CTR" });
  assert.equal(o.causal, false);
  const l = A.promote(A.learning({ directorEligible: false }));
  assert.equal(l.directorEligible, true);
});
