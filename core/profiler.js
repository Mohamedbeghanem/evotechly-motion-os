"use strict";

const C = require("./core");
const A = require("./automation");

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

function suite() {
  return [
    run("registry.1k", function () {
      const objs = [];
      for (let i = 0; i < 1000; i++) objs.push({ objectId: C.newObjectId(), objectType: "ASSET" });
      return C.rebuild(objs).quarantined.length;
    })
  ];
}

module.exports = { run, suite };
