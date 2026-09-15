"use strict";

const fs = require("fs");
const path = require("path");
const { IMPLEMENTED_IDS } = require("./engine");

const CATALOG_PATH = path.join(__dirname, "..", "..", "transitions", "Metadata", "catalog.json");

const CATEGORIES = [
  "UI-Push",
  "UI-Slide",
  "Scale-Zoom",
  "Crossfade",
  "Mask-Reveal",
  "Blur-Focus",
  "Depth-Parallax",
  "Overlay-Modal",
  "Page-Screen",
  "Wipe-Split",
  "Shared-Element",
  "Stagger-Cascade",
  "Camera-Dolly",
  "Glass-Frost",
  "Hero",
  "Micro"
];

const ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:5"];
const STYLE = "premium-saas";

let cached = null;

function loadCatalog() {
  if (cached) return cached;
  const raw = fs.readFileSync(CATALOG_PATH, "utf8");
  const json = JSON.parse(raw);
  const entries = Array.isArray(json) ? json : json.transitions || json.entries || [];
  cached = entries.map(function (row) {
    const copy = Object.assign({}, row);
    copy.style = copy.style || STYLE;
    copy.aspectRatios = copy.aspectRatios && copy.aspectRatios.length ? copy.aspectRatios.slice() : ASPECT_RATIOS.slice();
    copy.sfx = Array.isArray(copy.sfx) ? copy.sfx.slice() : [];
    copy.implemented = copy.implemented === true;
    return copy;
  });
  return cached;
}

function getById(id) {
  const want = String(id || "")
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, "_");
  const list = loadCatalog();
  let i;
  for (i = 0; i < list.length; i++) {
    if (list[i].id === want) return Object.assign({}, list[i]);
  }
  return null;
}

function listByCategory(category) {
  const want = String(category || "");
  return loadCatalog().filter(function (row) {
    return row.category === want;
  });
}

function listImplemented() {
  return loadCatalog().filter(function (row) {
    return row.implemented === true;
  });
}

function filterCatalog(opts) {
  opts = opts || {};
  const query = String(opts.query || "")
    .trim()
    .toLowerCase();
  const category = opts.category ? String(opts.category) : "";
  return loadCatalog().filter(function (row) {
    if (opts.implemented === true && row.implemented !== true) return false;
    if (opts.implemented === false && row.implemented !== false) return false;
    if (category && row.category !== category) return false;
    if (!query) return true;
    const blob = [row.id, row.name, row.category, row.bestUse, row.duration, row.intensity].join(" ").toLowerCase();
    return blob.indexOf(query) !== -1;
  });
}

function catalogIds() {
  return loadCatalog().map(function (row) {
    return row.id;
  });
}

function uniqueIdErrors() {
  const seen = {};
  const errors = [];
  loadCatalog().forEach(function (row) {
    if (!row.id || String(row.id).indexOf("EVT_") !== 0) {
      errors.push("bad-id:" + row.id);
      return;
    }
    if (seen[row.id]) errors.push("duplicate:" + row.id);
    seen[row.id] = true;
  });
  return errors;
}

function implementedFlagErrors() {
  const errors = [];
  const byId = {};
  loadCatalog().forEach(function (row) {
    byId[row.id] = row;
  });
  IMPLEMENTED_IDS.forEach(function (id) {
    if (!byId[id]) errors.push("missing-implemented:" + id);
    else if (byId[id].implemented !== true) errors.push("flag-false:" + id);
  });
  loadCatalog().forEach(function (row) {
    if (row.implemented === true && IMPLEMENTED_IDS.indexOf(row.id) === -1) {
      errors.push("flag-unexpected:" + row.id);
    }
  });
  return errors;
}

function categories() {
  return CATEGORIES.slice();
}

module.exports = {
  CATALOG_PATH,
  CATEGORIES,
  ASPECT_RATIOS,
  STYLE,
  loadCatalog,
  getById,
  listByCategory,
  listImplemented,
  filterCatalog,
  catalogIds,
  uniqueIdErrors,
  implementedFlagErrors,
  categories
};
