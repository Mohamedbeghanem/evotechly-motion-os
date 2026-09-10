/* Evotechly Motion OS — Figma exporter */
var ROLE_ALIASES = [
  { role: "cta", match: ["cta", "get started", "start free", "book demo", "primary button"] },
  { role: "button", match: ["button", "btn"] },
  { role: "cursor", match: ["cursor", "pointer", "mouse"] },
  { role: "tooltip", match: ["tooltip", "hint"] },
  { role: "badge", match: ["badge", "chip", "tag", "pill"] },
  { role: "metric", match: ["metric", "kpi", "stat", "number"] },
  { role: "card", match: ["card", "pricing", "plan", "feature tile", "tile"] },
  { role: "screenshot", match: ["screenshot", "product shot", "ui shot", "app preview"] },
  { role: "image", match: ["image", "photo", "cover"] },
  { role: "dashboard", match: ["dashboard", "app shell", "canvas"] },
  { role: "sidebar", match: ["sidebar"] },
  { role: "nav", match: ["navbar", "nav", "menu", "topbar"] },
  { role: "subtitle", match: ["subtitle", "subhead", "subheading", "deck", "description"] },
  { role: "title", match: ["title", "headline", "heading", "h1", "hero"] },
  { role: "eyebrow", match: ["eyebrow", "kicker", "label"] },
  { role: "logo", match: ["logo", "wordmark"] }
];
function detectRole(name, figmaType) {
  var n = String(name || "").toLowerCase();
  var i, j, a;
  for (i = 0; i < ROLE_ALIASES.length; i++) {
    a = ROLE_ALIASES[i].match;
    for (j = 0; j < a.length; j++) {
      if (n.indexOf(a[j]) !== -1) return ROLE_ALIASES[i].role;
    }
  }
  if (figmaType === "TEXT") return n.length < 24 ? "title" : "subtitle";
  if (figmaType === "INSTANCE" || figmaType === "COMPONENT") {
    if (n.indexOf("btn") !== -1 || n.indexOf("button") !== -1) return "button";
    return "card";
  }
  if (figmaType === "FRAME") return "dashboard";
  return "card";
}
function exportName(node, role) {
  var raw = String(node.name || role).replace(/^\s+|\s+$/g, "");
  if (detectRole(raw, node.type) === role) return raw;
  return role.charAt(0).toUpperCase() + role.slice(1);
}
function walk(node, parentId, acc, depth) {
  if (!node || depth > 6) return;
  if (node.name && String(node.name).indexOf("EVO_SKIP") !== -1) return;
  var useful = node.type === "TEXT" || node.type === "RECTANGLE" || node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE" || node.type === "GROUP" || node.type === "COMPONENT_SET";
  if (useful && node.id !== parentId) {
    var role = detectRole(node.name, node.type);
    acc.push({ id: node.id, name: exportName(node, role), role: role, type: role, figmaType: String(node.type).toLowerCase(), x: Math.round(node.x || 0), y: Math.round(node.y || 0), width: Math.round(node.width || 0), height: Math.round(node.height || 0), parentId: parentId || null, characters: node.type === "TEXT" ? String(node.characters || "").slice(0, 80) : undefined });
  }
  if ("children" in node && node.children) {
    var c;
    for (c = 0; c < node.children.length; c++) walk(node.children[c], useful ? node.id : parentId, acc, depth + 1);
  }
}
function rootFrame() {
  var sel = figma.currentPage.selection;
  if (!sel.length) return figma.currentPage;
  var n = sel[0];
  if (n.type === "FRAME" || n.type === "COMPONENT" || n.type === "COMPONENT_SET") return n;
  return n.parent && n.parent.type === "FRAME" ? n.parent : n;
}
figma.showUI(__html__, { width: 420, height: 520 });
function exportNow() {
  var root = rootFrame();
  var layers = [];
  if ("children" in root) {
    var i;
    for (i = 0; i < root.children.length; i++) walk(root.children[i], root.id, layers, 0);
  } else walk(root, null, layers, 0);
  figma.ui.postMessage({ type: "plan", plan: { schema: "evotechly.motion.design.v1", frameName: root.name || "Frame", style: "stripe", width: Math.round(root.width || 1440), height: Math.round(root.height || 900), source: "figma", layers: layers } });
}
figma.ui.onmessage = function (msg) {
  if (msg.type === "export") exportNow();
  if (msg.type === "close") figma.closePlugin();
};
exportNow();
