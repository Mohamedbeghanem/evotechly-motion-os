#target aftereffects
/*
  Evotechly SaaS Demo Tools — companion ScriptUI panel.
  Applies core/saasDemo.js numbers in After Effects. Native AE only.
  Does not replace Evotechly Motion OS v0.32. Window → SaaS Demo Tools.
*/
(function (thisObj) {
  var CURSOR_NAME = "Cursor";
  var DEPTH_NAME = "EVO_DEPTH";
  var CAROUSEL_NAME = "EVO_CAROUSEL";
  var PRESS = 0.12;
  var DIP_RATIO = 0.45;
  var CURSOR_DIP = 0.88;
  var TARGET_DIP = 0.94;
  var STAGGER_DUR = 0.42;
  var STAGGER_TRAVEL = 16;
  var STAGGER_HOLD = 0.2;
  var DEFAULT_DUR = 0.55;
  var VERTS = [[0, 0], [0, 24], [7, 18], [11, 28], [14, 26], [10, 17], [20, 17]];

  function clamp(n, lo, hi) {
    n = Number(n);
    if (n !== n) return lo;
    if (n < lo) return lo;
    if (n > hi) return hi;
    return n;
  }
  function activeComp() {
    var c = app.project && app.project.activeItem;
    if (c && c instanceof CompItem) return c;
    return null;
  }
  function requireComp() {
    var c = activeComp();
    if (!c) alert("Open a composition first.");
    return c;
  }
  function selectedLayers(comp) {
    var out = [], i;
    for (i = 1; i <= comp.numLayers; i++) if (comp.layer(i).selected) out.push(comp.layer(i));
    return out;
  }
  function findLayer(comp, name) {
    var want = String(name || "").toLowerCase(), i;
    for (i = 1; i <= comp.numLayers; i++) if (String(comp.layer(i).name).toLowerCase() === want) return comp.layer(i);
    return null;
  }
  function easeInf(kind) {
    if (kind === "soft") return { i: 40, o: 40 };
    if (kind === "linear") return { i: 16, o: 16 };
    return { i: 80, o: 18 };
  }
  function applyEase(prop, kind) {
    if (!prop || !prop.numKeys) return;
    var inf = easeInf(kind), n = 1, t, k, ins, outs, j;
    try { t = prop.propertyValueType; } catch (e) { return; }
    if (t === PropertyValueType.TwoD || t === PropertyValueType.TwoD_SPATIAL) n = 2;
    if (t === PropertyValueType.ThreeD || t === PropertyValueType.ThreeD_SPATIAL) n = 3;
    for (k = 1; k <= prop.numKeys; k++) {
      try {
        ins = []; outs = [];
        for (j = 0; j < n; j++) {
          ins.push(new KeyframeEase(0, inf.i));
          outs.push(new KeyframeEase(0, inf.o));
        }
        prop.setTemporalEaseAtKey(k, ins, outs);
      } catch (err) {}
    }
  }
  function addSlider(layer, name, value) {
    var fx;
    try {
      fx = layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
      fx.name = name;
      fx.property("ADBE Slider Control-0001").setValue(value);
    } catch (e) {}
    return fx;
  }
  function ensureSlider(layer, name, value) {
    var fx;
    try {
      fx = layer.property("ADBE Effect Parade").property(name);
      if (fx) {
        fx.property("ADBE Slider Control-0001").setValue(value);
        return fx;
      }
    } catch (e0) {}
    return addSlider(layer, name, value);
  }
  function findEffect(layer, names) {
    var i, fx;
    for (i = 0; i < names.length; i++) {
      try {
        fx = layer.property("ADBE Effect Parade").property(names[i]);
        if (fx) return fx;
      } catch (e0) {}
    }
    return null;
  }
  function tryEffect(layer, names) {
    var existing = findEffect(layer, names), i, fx;
    if (existing) return existing;
    for (i = 0; i < names.length; i++) {
      try {
        fx = layer.property("ADBE Effect Parade").addProperty(names[i]);
        if (fx) return fx;
      } catch (e) {}
    }
    return null;
  }
  function layerCenter(layer) {
    var r;
    try {
      r = layer.sourceRectAtTime(layer.containingComp ? layer.containingComp.time : 0, false);
      return [layer.transform.position.value[0], layer.transform.position.value[1]];
    } catch (e) {
      return layer.transform.position.value;
    }
  }
  function setScaleKeys(layer, t0, press, dip) {
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var v = sc.value, a = v[0], b = v.length > 1 ? v[1] : v[0];
    var mid = t0 + press * DIP_RATIO, t1 = t0 + press;
    sc.setValueAtTime(t0, v);
    sc.setValueAtTime(mid, [a * dip, b * dip].concat(v.length > 2 ? [v[2]] : []));
    sc.setValueAtTime(t1, v);
    applyEase(sc, "apple");
  }
  function addPointer(comp) {
    var shape = comp.layers.addShape();
    var group, path, fill, shp;
    shape.name = CURSOR_NAME;
    group = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    group.name = "pointer";
    path = group.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
    shp = new Shape();
    shp.vertices = VERTS;
    shp.inTangents = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    shp.outTangents = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    shp.closed = true;
    path.property("ADBE Vector Shape").setValue(shp);
    fill = group.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
    return shape;
  }
  function parseNum(field, fallback) {
    var n = parseFloat(field && field.text);
    if (n !== n) return fallback;
    return n;
  }

  function runCursor(durField, clickField) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), i, target = null, cursor, start, end, dur, clickAt, pos;
    for (i = 0; i < sel.length; i++) {
      if (String(sel[i].name).toLowerCase() !== CURSOR_NAME.toLowerCase()) { target = sel[i]; break; }
    }
    dur = clamp(parseNum(durField, DEFAULT_DUR), 0.05, 30);
    clickAt = clamp(parseNum(clickField, dur), 0, dur);
    cursor = findLayer(comp, CURSOR_NAME);
    app.beginUndoGroup("Evotechly Cursor + click");
    if (!cursor) {
      cursor = addPointer(comp);
      cursor.transform.position.setValue([comp.width * 0.62, comp.height * 0.58]);
    }
    start = cursor.transform.position.value;
    end = target ? layerCenter(target) : [comp.width * 0.5, comp.height * 0.5];
    if (end.length > 2) end = [end[0], end[1]];
    pos = cursor.property("ADBE Transform Group").property("ADBE Position");
    pos.setValueAtTime(comp.time, start);
    pos.setValueAtTime(comp.time + dur, end.length > 2 ? end : [end[0], end[1]].concat(start.length > 2 ? [start[2]] : []));
    applyEase(pos, "apple");
    setScaleKeys(cursor, comp.time + clickAt, PRESS, CURSOR_DIP);
    if (target) setScaleKeys(target, comp.time + clickAt, PRESS, TARGET_DIP);
    app.endUndoGroup();
    alert("Cursor + click\nMove " + dur + "s, click at " + clickAt + "s" + (target ? " on " + target.name : "") + ".\nShape layer (not PNG). Scale-down on the clicked layer when one is selected.");
  }

  function runDepth() {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), ctrl, i, layer, n, depth, blurFx, glowFx, expr;
    if (!sel.length) { alert("Select the layers to depth-reveal (front → back)."); return; }
    n = sel.length;
    expr = 'var ctrl = thisComp.layer("' + DEPTH_NAME + '");\n' +
      'var focus = ctrl.effect("Focus")("Slider");\n' +
      'var strength = ctrl.effect("Strength")("Slider");\n' +
      'var depth = effect("Depth")("Slider");\n' +
      "Math.abs(depth - focus) * strength;";
    app.beginUndoGroup("Evotechly Depth reveal");
    ctrl = findLayer(comp, DEPTH_NAME);
    if (!ctrl) {
      ctrl = comp.layers.addNull();
      ctrl.name = DEPTH_NAME;
      try { ctrl.guideLayer = true; } catch (e0) {}
    }
    ensureSlider(ctrl, "Focus", 50);
    ensureSlider(ctrl, "Strength", 0.24);
    for (i = 0; i < n; i++) {
      layer = sel[i];
      depth = n <= 1 ? 50 : (i / (n - 1)) * 100;
      ensureSlider(layer, "Depth", depth);
      blurFx = tryEffect(layer, ["ADBE Fast Box Blur", "ADBE Box Blur2", "ADBE Gaussian Blur 2"]);
      if (blurFx) {
        try { blurFx.property(1).expression = expr; } catch (e1) {}
      }
      glowFx = tryEffect(layer, ["ADBE Glo2", "ADBE Glow"]);
      if (glowFx) {
        try { glowFx.property("ADBE Glo2-0002").setValue(24); } catch (e2) {}
      }
    }
    app.endUndoGroup();
    alert("Depth reveal on " + n + " layer(s).\nEVO_DEPTH Focus / Strength drive native blur. Glow is a native fallback. Deep Glow is not required.");
  }

  function runStagger(dirList, offsetField, easeList) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), i, layer, pos, op, rest, t0, delay, dur, dir, ease, frames, fps, rise, hold;
    if (!sel.length) { alert("Select layers to stagger (top of selection = first)."); return; }
    dir = dirList.selection ? dirList.selection.text.toLowerCase() : "in";
    ease = easeList.selection ? easeList.selection.text.toLowerCase() : "apple";
    frames = Math.round(clamp(parseNum(offsetField, 3), 0, 120));
    fps = comp.frameRate || 30;
    dur = STAGGER_DUR;
    rise = STAGGER_TRAVEL;
    hold = STAGGER_HOLD;
    t0 = comp.time;
    app.beginUndoGroup("Evotechly Stagger reveal");
    for (i = 0; i < sel.length; i++) {
      layer = sel[i];
      delay = (i * frames) / fps;
      pos = layer.property("ADBE Transform Group").property("ADBE Position");
      op = layer.property("ADBE Transform Group").property("ADBE Opacity");
      rest = pos.value;
      if (dir === "out") {
        op.setValueAtTime(t0 + delay, 100);
        op.setValueAtTime(t0 + delay + dur, 0);
        pos.setValueAtTime(t0 + delay, rest);
        pos.setValueAtTime(t0 + delay + dur, [rest[0], rest[1] + rise].concat(rest.length > 2 ? [rest[2]] : []));
      } else {
        op.setValueAtTime(t0 + delay, 0);
        op.setValueAtTime(t0 + delay + dur, 100);
        pos.setValueAtTime(t0 + delay, [rest[0], rest[1] + rise].concat(rest.length > 2 ? [rest[2]] : []));
        pos.setValueAtTime(t0 + delay + dur, rest);
        if (dir === "both") {
          op.setValueAtTime(t0 + delay + dur + hold, 100);
          op.setValueAtTime(t0 + delay + dur + hold + dur, 0);
          pos.setValueAtTime(t0 + delay + dur + hold, rest);
          pos.setValueAtTime(t0 + delay + dur + hold + dur, [rest[0], rest[1] + rise].concat(rest.length > 2 ? [rest[2]] : []));
        }
      }
      applyEase(op, ease);
      applyEase(pos, ease);
    }
    app.endUndoGroup();
    alert("Stagger " + dir + " on " + sel.length + " layer(s). Offset " + frames + " frames · " + ease + " ease.");
  }

  function runCarousel(axisList) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), ctrl, i, layer, axis, gap, rest, expr;
    if (!sel.length) { alert("Select slide layers in order (first = index 0)."); return; }
    axis = axisList.selection && axisList.selection.text === "Y" ? "y" : "x";
    gap = axis === "y" ? comp.height : comp.width;
    app.beginUndoGroup("Evotechly Carousel setup");
    ctrl = findLayer(comp, CAROUSEL_NAME);
    if (!ctrl) {
      ctrl = comp.layers.addNull();
      ctrl.name = CAROUSEL_NAME;
      try { ctrl.guideLayer = true; } catch (e0) {}
    }
    ensureSlider(ctrl, "Index", 0);
    ensureSlider(ctrl, "Gap", gap);
    for (i = 0; i < sel.length; i++) {
      layer = sel[i];
      rest = layer.transform.position.value;
      if (axis === "y") {
        expr = 'var c = thisComp.layer("' + CAROUSEL_NAME + '");\n' +
          'var idx = c.effect("Index")("Slider");\n' +
          'var gap = c.effect("Gap")("Slider");\n' +
          "var i = " + i + ";\n" +
          "[" + rest[0] + ", " + rest[1] + " + (i - idx) * gap];";
      } else {
        expr = 'var c = thisComp.layer("' + CAROUSEL_NAME + '");\n' +
          'var idx = c.effect("Index")("Slider");\n' +
          'var gap = c.effect("Gap")("Slider");\n' +
          "var i = " + i + ";\n" +
          "[" + rest[0] + " + (i - idx) * gap, " + rest[1] + "];";
      }
      try { layer.property("ADBE Transform Group").property("ADBE Position").expression = expr; } catch (e1) {}
    }
    app.endUndoGroup();
    alert("Carousel on " + sel.length + " slide(s), axis " + axis + ".\nScrub EVO_CAROUSEL → Index. Key that slider to change slides.");
  }

  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "SaaS Demo Tools", undefined, { resizeable: true });
    var g, durField, clickField, dirList, offsetField, easeList, axisList;
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 10;
    win.add("statictext", undefined, "EVOTECHLY  ·  SaaS Demo Tools");
    var intro = win.add("statictext", undefined, "Own engines. Native AE. Companion to Motion OS v0.32 — does not replace it.", { multiline: true });
    intro.characters = 42;

    win.add("statictext", undefined, "Cursor + click");
    g = win.add("group");
    g.add("statictext", undefined, "Duration");
    durField = g.add("edittext", undefined, "0.55");
    durField.characters = 6;
    g.add("statictext", undefined, "Click at");
    clickField = g.add("edittext", undefined, "0.55");
    clickField.characters = 6;
    win.add("button", undefined, "Cursor + click").onClick = function () { runCursor(durField, clickField); };

    win.add("statictext", undefined, "Depth reveal");
    win.add("button", undefined, "Depth reveal (selected)").onClick = runDepth;

    win.add("statictext", undefined, "Stagger reveal");
    g = win.add("group");
    g.add("statictext", undefined, "Dir");
    dirList = g.add("dropdownlist", undefined, ["In", "Out", "Both"]);
    dirList.selection = 0;
    g.add("statictext", undefined, "Frames");
    offsetField = g.add("edittext", undefined, "3");
    offsetField.characters = 4;
    g.add("statictext", undefined, "Ease");
    easeList = g.add("dropdownlist", undefined, ["Apple", "Soft", "Linear"]);
    easeList.selection = 0;
    win.add("button", undefined, "Stagger reveal (selected)").onClick = function () { runStagger(dirList, offsetField, easeList); };

    win.add("statictext", undefined, "Carousel");
    g = win.add("group");
    g.add("statictext", undefined, "Axis");
    axisList = g.add("dropdownlist", undefined, ["X", "Y"]);
    axisList.selection = 0;
    win.add("button", undefined, "Carousel setup (selected)").onClick = function () { runCarousel(axisList); };

    var foot = win.add("statictext", undefined, "Install: copy this file into Scripts/ScriptUI Panels. See docs/SAAS_DEMO_KIT.md. Companions stay external — docs/EDITOR_FREE_KIT.md.", { multiline: true });
    foot.characters = 42;

    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); }
    else win.layout.layout(true);
    return win;
  }

  buildUI(thisObj);
})(this);
