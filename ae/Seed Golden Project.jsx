#target aftereffects
/*
  Evotechly Motion OS — Seed Golden Project (Phase 3).
  File → Scripts → Run Script File… (or SaaS Demo Tools → Seed Golden Project).
  Builds 00_HOME, ERP_DEMO, TALKING_HEAD, REEL_9x16. Idempotent: skip if name exists.
  Names match core/goldenProject.js. No .aep binary. Native AE only.
*/
(function seedGoldenProject() {
  var COMP_HOME = "00_HOME";
  var COMP_ERP = "ERP_DEMO";
  var COMP_TALK = "TALKING_HEAD";
  var COMP_REEL = "REEL_9x16";
  var META_NULL = "EVO_GOLDEN_META";
  var FPS = 30;
  var DESKTOP_W = 1920;
  var DESKTOP_H = 1080;
  var REEL_W = 1080;
  var REEL_H = 1920;
  var HOME_DUR = 10;
  var ERP_DUR = 10;
  var TALK_DUR = 15;
  var REEL_DUR = 15;
  var META_COMMENT = "Evotechly Motion OS golden seed (Phase 3). Required tabs: Motion, Polish, Person, Captions, Recipes, Interact, Window → SaaS Demo Tools. Jobs: ERP_DEMO = SaaS shot · TALKING_HEAD = Person/Captions · REEL_9x16 = hook/captions. SaaS Demo buttons: Cursor + click, Depth reveal, Stagger reveal, Carousel setup, Glass Panel, Gradient Wipe, Proximity Hover. See docs/QUICK_START.md.";

  function findComp(name) {
    var i, item;
    if (!app.project) return null;
    for (i = 1; i <= app.project.numItems; i++) {
      item = app.project.item(i);
      if (item instanceof CompItem && item.name === name) return item;
    }
    return null;
  }

  function addRect(comp, name, w, h, x, y, color) {
    var shape, group, rect, fill;
    shape = comp.layers.addShape();
    shape.name = name;
    group = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    group.name = name;
    rect = group.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
    rect.property("ADBE Vector Rect Size").setValue([w, h]);
    fill = group.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue(color);
    shape.transform.position.setValue([x, y]);
    return shape;
  }

  function addLabel(comp, name, text, x, y) {
    var layer, doc;
    layer = comp.layers.addText(text);
    layer.name = name;
    try {
      doc = layer.property("ADBE Text Properties").property("ADBE Text Document").value;
      doc.fontSize = 36;
      doc.fillColor = [0.92, 0.94, 0.97];
      doc.applyFill = true;
      layer.property("ADBE Text Properties").property("ADBE Text Document").setValue(doc);
    } catch (e0) {}
    layer.transform.position.setValue([x, y]);
    return layer;
  }

  function addSolidLayer(comp, name, color, w, h, x, y) {
    var layer = comp.layers.addSolid(color, name, Math.round(w), Math.round(h), 1);
    layer.name = name;
    layer.transform.position.setValue([x, y]);
    return layer;
  }

  function makeComp(name, w, h, duration) {
    return app.project.items.addComp(name, w, h, 1, duration, FPS);
  }

  function seedErp(comp) {
    addRect(comp, "Nav", 1840, 56, 960, 48, [0.12, 0.16, 0.22]);
    addRect(comp, "Sidebar", 220, 920, 130, 560, [0.10, 0.13, 0.18]);
    addRect(comp, "Title", 420, 48, 560, 160, [0.22, 0.30, 0.42]);
    addRect(comp, "Subtitle", 380, 28, 540, 214, [0.18, 0.24, 0.34]);
    addRect(comp, "CTA", 168, 44, 434, 280, [0.25, 0.48, 0.95]);
    addRect(comp, "Screenshot", 720, 400, 1200, 400, [0.20, 0.28, 0.40]);
    addRect(comp, "Card 1", 360, 200, 560, 820, [0.16, 0.22, 0.32]);
    addRect(comp, "Card 2", 360, 200, 960, 820, [0.16, 0.22, 0.32]);
    addRect(comp, "Card 3", 360, 200, 1360, 820, [0.16, 0.22, 0.32]);
    addRect(comp, "Cursor", 18, 24, 1400, 500, [1, 1, 1]);
  }

  function seedTalk(comp) {
    addSolidLayer(comp, "BG", [0.08, 0.09, 0.10], DESKTOP_W, DESKTOP_H, DESKTOP_W / 2, DESKTOP_H / 2);
    addRect(comp, "Product UI / L3", 640, 360, 1480, 780, [0.18, 0.24, 0.34]);
    addLabel(comp, "STACK_NOTE", "Mid-stack: Captions. Person tab → Talking-head stack. Replace VIDEO_PLACEHOLDER.", 960, 980);
    addLabel(comp, "Caption EN", "Caption EN", 960, 900);
    addLabel(comp, "Caption AR", "Caption AR", 960, 850);
    addLabel(comp, "Caption", "Caption", 960, 800);
    addRect(comp, "CUTOUT", 420, 640, 960, 460, [0.14, 0.42, 0.28]);
    addSolidLayer(comp, "VIDEO_PLACEHOLDER", [0.18, 0.20, 0.24], 960, 540, 960, 420);
  }

  function seedReel(comp) {
    var topH = Math.round(REEL_H * 0.12);
    var botH = Math.round(REEL_H * 0.14);
    var sideW = Math.round(REEL_W * 0.08);
    var g;
    g = addRect(comp, "SAFE_TOP", REEL_W, topH, REEL_W / 2, topH / 2, [1, 0.28, 0.36]);
    try { g.guideLayer = true; } catch (e0) {}
    try { g.opacity.setValue(28); } catch (e1) {}
    g = addRect(comp, "SAFE_BOTTOM", REEL_W, botH, REEL_W / 2, REEL_H - botH / 2, [1, 0.28, 0.36]);
    try { g.guideLayer = true; } catch (e2) {}
    try { g.opacity.setValue(28); } catch (e3) {}
    g = addRect(comp, "SAFE_LEFT", sideW, REEL_H, sideW / 2, REEL_H / 2, [1, 0.28, 0.36]);
    try { g.guideLayer = true; } catch (e4) {}
    try { g.opacity.setValue(28); } catch (e5) {}
    g = addRect(comp, "SAFE_RIGHT", sideW, REEL_H, REEL_W - sideW / 2, REEL_H / 2, [1, 0.28, 0.36]);
    try { g.guideLayer = true; } catch (e6) {}
    try { g.opacity.setValue(28); } catch (e7) {}
    addLabel(comp, "Hook", "Hook caption", REEL_W / 2, Math.round(REEL_H * 0.42));
    addLabel(comp, "Kinetic", "Kinetic caption", REEL_W / 2, Math.round(REEL_H * 0.62));
    addLabel(comp, "Caption AR", "Caption AR", REEL_W / 2, Math.round(REEL_H * 0.72));
    addLabel(comp, "Caption EN", "Caption EN", REEL_W / 2, Math.round(REEL_H * 0.78));
    addLabel(comp, "Caption", "Caption", REEL_W / 2, Math.round(REEL_H * 0.86));
  }

  function seedHome(comp, erp, talk, reel) {
    var meta, nested;
    addLabel(comp, "Title", "Evotechly Motion OS — Golden Project", 960, 160);
    addLabel(comp, "Note", "ERP_DEMO · TALKING_HEAD · REEL_9x16 — see docs/QUICK_START.md", 960, 230);
    if (erp) {
      nested = comp.layers.add(erp);
      nested.name = COMP_ERP;
      nested.transform.position.setValue([480, 640]);
      try { nested.transform.scale.setValue([32, 32]); } catch (e0) {}
    }
    if (talk) {
      nested = comp.layers.add(talk);
      nested.name = COMP_TALK;
      nested.transform.position.setValue([960, 640]);
      try { nested.transform.scale.setValue([32, 32]); } catch (e1) {}
    }
    if (reel) {
      nested = comp.layers.add(reel);
      nested.name = COMP_REEL;
      nested.transform.position.setValue([1500, 640]);
      try { nested.transform.scale.setValue([28, 28]); } catch (e2) {}
    }
    meta = comp.layers.addNull();
    meta.name = META_NULL;
    try { meta.shy = true; } catch (e3) {}
    try { meta.guideLayer = true; } catch (e4) {}
    try { meta.comment = META_COMMENT; } catch (e5) {}
    meta.transform.position.setValue([80, 80]);
  }

  function run() {
    var created = [];
    var skipped = [];
    var erp, talk, reel, home;
    if (!app.project) app.newProject();
    app.beginUndoGroup("Evotechly Seed Golden Project");

    erp = findComp(COMP_ERP);
    if (erp) {
      skipped.push(COMP_ERP);
    } else {
      erp = makeComp(COMP_ERP, DESKTOP_W, DESKTOP_H, ERP_DUR);
      seedErp(erp);
      created.push(COMP_ERP);
    }

    talk = findComp(COMP_TALK);
    if (talk) {
      skipped.push(COMP_TALK);
    } else {
      talk = makeComp(COMP_TALK, DESKTOP_W, DESKTOP_H, TALK_DUR);
      seedTalk(talk);
      created.push(COMP_TALK);
    }

    reel = findComp(COMP_REEL);
    if (reel) {
      skipped.push(COMP_REEL);
    } else {
      reel = makeComp(COMP_REEL, REEL_W, REEL_H, REEL_DUR);
      seedReel(reel);
      created.push(COMP_REEL);
    }

    home = findComp(COMP_HOME);
    if (home) {
      skipped.push(COMP_HOME);
    } else {
      home = makeComp(COMP_HOME, DESKTOP_W, DESKTOP_H, HOME_DUR);
      seedHome(home, erp, talk, reel);
      created.push(COMP_HOME);
    }

    try { if (home) home.openInViewer(); } catch (eView) {}
    app.endUndoGroup();

    if (!created.length) {
      alert("Golden project seed\n\nAll four comps already exist. Nothing added.\n00_HOME · ERP_DEMO · TALKING_HEAD · REEL_9x16");
      return;
    }
    alert(
      "Golden project seed\n\nCreated: " + created.join(", ") +
      (skipped.length ? "\nSkipped (already exist): " + skipped.join(", ") : "") +
      "\n\nOpen 00_HOME. Job map: docs/QUICK_START.md"
    );
  }

  run();
})();
