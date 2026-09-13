"use strict";

let seq = 1;

function newObjectId() {
  const n = seq++;
  const hex = ("00000000" + n.toString(16).toUpperCase()).slice(-8);
  return "EVO-OBJ-" + hex;
}

function fingerprint(fields) {
  return JSON.stringify(fields || {});
}

function registry() {
  return { byId: {}, byType: {} };
}

function register(reg, obj) {
  if (!obj || !obj.objectId) return { ok: false, error: "CORE_ID_MISSING" };
  if (reg.byId[obj.objectId]) return { ok: false, error: "CORE_ID_DUPLICATE" };
  reg.byId[obj.objectId] = obj;
  const t = obj.objectType || "UNKNOWN";
  reg.byType[t] = reg.byType[t] || [];
  reg.byType[t].push(obj.objectId);
  return { ok: true, error: "" };
}

function rebuild(objects) {
  const r = registry();
  const quarantined = [];
  (objects || []).forEach(function (o) {
    const res = register(r, o);
    if (!res.ok) quarantined.push({ object: o, error: res.error });
  });
  return { registry: r, quarantined: quarantined };
}

function normalizeHealth(engineStatus) {
  const map = {
    READY: "HEALTHY",
    READY_WITH_WARNINGS: "WARNING",
    BLOCKED: "BLOCKED",
    BROKEN: "BROKEN",
    ARCHIVED: "ARCHIVED"
  };
  return map[engineStatus] || "UNKNOWN";
}

function event(opts) {
  const o = opts || {};
  return {
    eventId: o.eventId || newObjectId().replace("EVO-OBJ-", "EVO-EVT-"),
    eventType: o.eventType || "ASSET.UPDATED",
    sourceEngine: o.sourceEngine || "p15",
    sourceObjectId: o.sourceObjectId || "",
    origin: o.origin || "USER",
    payloadVersion: 1,
    committed: !!o.committed
  };
}

function emit(ev) {
  if (!ev.committed) return { ok: false, error: "EVENT_BEFORE_COMMIT" };
  return { ok: true, event: ev };
}

function graph() {
  return { edges: [] };
}

function link(g, from, to, kind) {
  g.edges.push({ from: from, to: to, kind: kind || "USES" });
}

function whereUsed(g, id) {
  return g.edges.filter(function (e) { return e.to === id || e.from === id; });
}

function brokenRefs(g, live) {
  const set = {};
  (live || []).forEach(function (id) { set[id] = true; });
  return g.edges.filter(function (e) { return !set[e.from] || !set[e.to]; });
}

function supports(engine, cap) {
  return !!(engine && engine.capabilities && engine.capabilities.indexOf(cap) !== -1);
}

function health(reg, g, live) {
  const broken = brokenRefs(g, live);
  const dup = 0;
  let status = "READY";
  if (broken.length) status = "READY WITH WARNINGS";
  if (!reg || !reg.byId) status = "RECOVERY REQUIRED";
  return { status: status, engines: 21, broken: broken.length, duplicates: dup };
}

function migratePreview(fromSchema, toSchema, count) {
  if (fromSchema > toSchema) return { status: "BLOCKED", reason: "NEWER_SCHEMA_READONLY" };
  if (fromSchema === toSchema) return { status: "NOT NEEDED", reason: "" };
  return { status: "READY", reason: "", objects: count || 0 };
}

module.exports = {
  newObjectId,
  fingerprint,
  registry,
  register,
  rebuild,
  normalizeHealth,
  event,
  emit,
  graph,
  link,
  whereUsed,
  brokenRefs,
  supports,
  health,
  migratePreview
};
