#target aftereffects
/*
  Evotechly Motion OS Hub — companion ScriptUI panel (P0 unify shell).
  Palette title: Motion OS Hub. Window → SaaS Demo Tools (same file).
  Home (Seed) + SaaS engines + Kit Hub official URLs.
  Applies core/saasDemo.js + core/saasDemoFx.js + core/uiPresets.js + core/textReveal.js numbers in After Effects.
  Native AE only. No Liquid Glass, Deep Glow, Saber, QCA, or TFM.
  Kit Hub never downloads or vendors binaries — copy/alert official URLs only.
  Does not replace Evotechly Motion OS v0.32.
*/
(function (thisObj) {
  var CURSOR_NAME = "Cursor";
  var DEPTH_NAME = "EVO_DEPTH";
  var CAROUSEL_NAME = "EVO_CAROUSEL";
  var GLASS_NAME = "EVO_GLASS";
  var HOVER_NAME = "EVO_HOVER";
  var WIPE_MATTE = "EVO_WIPE_MATTE";
  var WIPE_GRAD = "EVO_WIPE_GRAD";
  var CURSOR_DRIVER = "Cursor";
  var PRESS = 0.12;
  var DIP_RATIO = 0.45;
  var CURSOR_DIP = 0.88;
  var TARGET_DIP = 0.94;
  var STAGGER_DUR = 0.42;
  var STAGGER_TRAVEL = 16;
  var STAGGER_HOLD = 0.2;
  var DEFAULT_DUR = 0.55;
  var UI_PRESET_DUR = 0.5;
  var UI_PRESET_HOLD = 0.2;
  var UI_PRESET_IDS = ["fade-up", "fade-scale", "slide-left", "slide-right", "slide-up", "pop"];
  var UI_PRESETS = {
    "fade-up": { x: 0, y: 16, scaleFrom: 100 },
    "fade-scale": { x: 0, y: 0, scaleFrom: 92 },
    "slide-left": { x: 24, y: 0, scaleFrom: 100 },
    "slide-right": { x: -24, y: 0, scaleFrom: 100 },
    "slide-up": { x: 0, y: 24, scaleFrom: 100 },
    pop: { x: 0, y: 0, scaleFrom: 90 }
  };
  var GLASS_OPACITY = 42;
  var GLASS_BLUR = 18;
  var WIPE_SOFT = 12;
  var WIPE_HOLD = 0.2;
  var HOVER_RADIUS = 140;
  var HOVER_SCALE = 6;
  var HOVER_OPACITY = 18;
  var CURSOR_SHAPES = {
    pointer: { style: "pointer", verts: [[0, 0], [0, 24], [7, 18], [11, 28], [14, 26], [10, 17], [20, 17]] },
    hand: { style: "hand", verts: [[8, 0], [12, 0], [12, 13], [15, 11], [16, 16], [19, 13], [20, 18], [23, 16], [24, 22], [21, 30], [5, 32], [2, 26], [0, 20], [0, 16], [6, 15], [8, 13]] },
    ibeam: { style: "ibeam", verts: [[0, 0], [10, 0], [10, 3], [6, 3], [6, 21], [10, 21], [10, 24], [0, 24], [0, 21], [4, 21], [4, 3], [0, 3]] }
  };
  var KIT_HUB = [
    { name: "UI Animator Pro", url: "https://whatstudio.gumroad.com/" },
    { name: "PinRig", url: "https://whatstudio.gumroad.com/" },
    { name: "AEJuice (free)", url: "https://aejuice.com" },
    { name: "Motion Bro (free)", url: "https://motionbro.com" },
    { name: "Animation Composer (free)", url: "https://www.mrhorse.com/animation-composer/" },
    { name: "Crate Light Wrap", url: "https://www.productioncrate.com/plugins/crates-light-wrap" },
    { name: "Meow Captions", url: "https://sinopskyd.itch.io/meow-captions" },
    { name: "Presetify", url: "https://kuldeepmp4.gumroad.com/l/Presetify" },
    { name: "Vignette Typer Lite", url: "https://vignettestudio.gumroad.com/l/vignette-typer-lite" },
    { name: "Repeater", url: "https://aaeplugins.com/plugins/repeater/" },
    { name: "PaulPack", url: "https://paulplane.gumroad.com/l/paulpackv1" },
    { name: "Liquid Glass (personal)", url: "https://bentomotion.gumroad.com/l/glass-ae" }
  ];
  var KIT_HUB_NAMES = [
    "UI Animator Pro",
    "PinRig",
    "AEJuice (free)",
    "Motion Bro (free)",
    "Animation Composer (free)",
    "Crate Light Wrap",
    "Meow Captions",
    "Presetify",
    "Vignette Typer Lite",
    "Repeater",
    "PaulPack",
    "Liquid Glass (personal)"
  ];

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
  function cursorStyleFromList(list) {
    var t = list && list.selection ? String(list.selection.text).toLowerCase() : "pointer";
    if (t === "hand") return "hand";
    if (t === "i-beam" || t === "ibeam") return "ibeam";
    return "pointer";
  }
  function zeros2(n) {
    var a = [], i;
    for (i = 0; i < n; i++) a.push([0, 0]);
    return a;
  }
  function applyCursorPath(group, verts) {
    var path, shp, i, item, found = null;
    for (i = 1; i <= group.property("ADBE Vectors Group").numProperties; i++) {
      item = group.property("ADBE Vectors Group").property(i);
      if (item && item.matchName === "ADBE Vector Shape - Group") { found = item; break; }
    }
    path = found || group.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Group");
    shp = new Shape();
    shp.vertices = verts;
    shp.inTangents = zeros2(verts.length);
    shp.outTangents = zeros2(verts.length);
    shp.closed = true;
    path.property("ADBE Vector Shape").setValue(shp);
  }
  function applyCursorStyle(layer, style) {
    var spec = CURSOR_SHAPES[style] || CURSOR_SHAPES.pointer;
    var group;
    try {
      group = layer.property("ADBE Root Vectors Group").property(1);
      if (!group) return;
      group.name = spec.style;
      applyCursorPath(group, spec.verts);
    } catch (e) {}
  }
  function addCursor(comp, style) {
    var spec = CURSOR_SHAPES[style] || CURSOR_SHAPES.pointer;
    var shape = comp.layers.addShape();
    var group, fill;
    shape.name = CURSOR_NAME;
    group = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    group.name = spec.style;
    applyCursorPath(group, spec.verts);
    fill = group.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
    return shape;
  }
  function parseNum(field, fallback) {
    var n = parseFloat(field && field.text);
    if (n !== n) return fallback;
    return n;
  }

  function runCursor(durField, clickField, styleList) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), i, target = null, cursor, start, end, dur, clickAt, pos, style;
    for (i = 0; i < sel.length; i++) {
      if (String(sel[i].name).toLowerCase() !== CURSOR_NAME.toLowerCase()) { target = sel[i]; break; }
    }
    style = cursorStyleFromList(styleList);
    dur = clamp(parseNum(durField, DEFAULT_DUR), 0.05, 30);
    clickAt = clamp(parseNum(clickField, dur), 0, dur);
    cursor = findLayer(comp, CURSOR_NAME);
    app.beginUndoGroup("Evotechly Cursor + click");
    if (!cursor) {
      cursor = addCursor(comp, style);
      cursor.transform.position.setValue([comp.width * 0.62, comp.height * 0.58]);
    } else {
      applyCursorStyle(cursor, style);
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
    alert("Cursor + click (" + style + ")\nMove " + dur + "s, click at " + clickAt + "s" + (target ? " on " + target.name : "") + ".\nNative shape (not PNG, no CursorKit). Scale-down on the clicked layer when one is selected.");
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

  function uiPresetSpec(id) {
    return UI_PRESETS[id] || UI_PRESETS["fade-up"];
  }

  function keyVec(prop, t, rest, dx, dy) {
    var v = [rest[0] + dx, rest[1] + dy];
    if (rest.length > 2) v.push(rest[2]);
    prop.setValueAtTime(t, v);
  }

  function keyScale(prop, t, rest, ratio) {
    var v = [rest[0] * ratio, (rest.length > 1 ? rest[1] : rest[0]) * ratio];
    if (rest.length > 2) v.push(rest[2]);
    prop.setValueAtTime(t, v);
  }

  function runUiPreset(presetList, dirList, durField, staggerField, easeList, mirrorBox) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), i, layer, pos, op, sc, rest, restS, t0, delay, dur, dir, ease, frames, fps, spec, mx, my, ratio, hold, mirrored, tIn, tOut;
    if (!sel.length) { alert("Select layers (cards) to apply a UI preset."); return; }
    spec = uiPresetSpec(presetList.selection ? String(presetList.selection.text) : "fade-up");
    dir = dirList.selection ? dirList.selection.text.toLowerCase() : "in";
    ease = easeList.selection ? easeList.selection.text.toLowerCase() : "apple";
    dur = clamp(parseNum(durField, UI_PRESET_DUR), 0.05, 30);
    frames = Math.round(clamp(parseNum(staggerField, 3), 0, 120));
    fps = comp.frameRate || 30;
    hold = UI_PRESET_HOLD;
    t0 = comp.time;
    app.beginUndoGroup("Evotechly Apply UI Preset");
    for (i = 0; i < sel.length; i++) {
      layer = sel[i];
      delay = (i * frames) / fps;
      pos = layer.property("ADBE Transform Group").property("ADBE Position");
      op = layer.property("ADBE Transform Group").property("ADBE Opacity");
      sc = layer.property("ADBE Transform Group").property("ADBE Scale");
      rest = pos.value;
      restS = sc.value;
      mx = spec.x;
      my = spec.y;
      ratio = spec.scaleFrom / 100;
      mirrored = !!(mirrorBox && mirrorBox.value && rest[0] < comp.width * 0.5);
      if (mirrored) mx = -mx;
      tIn = t0 + delay;
      if (dir === "out") {
        op.setValueAtTime(tIn, 100);
        op.setValueAtTime(tIn + dur, 0);
        keyVec(pos, tIn, rest, 0, 0);
        keyVec(pos, tIn + dur, rest, mx, my);
        keyScale(sc, tIn, restS, 1);
        keyScale(sc, tIn + dur, restS, ratio);
      } else {
        op.setValueAtTime(tIn, 0);
        op.setValueAtTime(tIn + dur, 100);
        keyVec(pos, tIn, rest, mx, my);
        keyVec(pos, tIn + dur, rest, 0, 0);
        keyScale(sc, tIn, restS, ratio);
        keyScale(sc, tIn + dur, restS, 1);
        if (dir === "both") {
          tOut = tIn + dur + hold;
          op.setValueAtTime(tOut, 100);
          op.setValueAtTime(tOut + dur, 0);
          keyVec(pos, tOut, rest, 0, 0);
          keyVec(pos, tOut + dur, rest, mx, my);
          keyScale(sc, tOut, restS, 1);
          keyScale(sc, tOut + dur, restS, ratio);
        }
      }
      applyEase(op, ease);
      applyEase(pos, ease);
      applyEase(sc, ease);
    }
    app.endUndoGroup();
    alert("UI preset " + (presetList.selection ? presetList.selection.text : "fade-up") + " · " + dir + " on " + sel.length + " layer(s).\nStagger " + frames + " frames · " + ease + " ease" + (mirrorBox && mirrorBox.value ? " · mirror on" : "") + ".");
  }

  function ensureGuideNull(comp, name) {
    var layer = findLayer(comp, name);
    if (!layer) {
      layer = comp.layers.addNull();
      layer.name = name;
      try { layer.guideLayer = true; } catch (e0) {}
    }
    return layer;
  }

  function addGlassShape(comp) {
    var shape = comp.layers.addShape(), group, rect, fill, size;
    shape.name = "Glass Panel";
    group = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    group.name = "panel";
    rect = group.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
    size = [Math.round(comp.width * 0.42), Math.round(comp.height * 0.28)];
    try { rect.property("ADBE Vector Rect Size").setValue(size); } catch (e0) {}
    try { rect.property("ADBE Vector Rect Roundness").setValue(24); } catch (e1) {}
    fill = group.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([0.94, 0.96, 0.99]);
    try { fill.property("ADBE Vector Fill Opacity").setValue(GLASS_OPACITY); } catch (e2) {}
    shape.transform.position.setValue([comp.width * 0.5, comp.height * 0.5]);
    return shape;
  }

  function applyGlassFx(layer, blurExpr, opacityExpr) {
    var blurFx, tintFx, levelsFx, fillFx;
    blurFx = tryEffect(layer, ["ADBE Fast Box Blur", "ADBE Box Blur2", "ADBE Gaussian Blur 2"]);
    if (blurFx) {
      try { blurFx.property(1).expression = blurExpr; } catch (e1) {}
      try { blurFx.property("Repeat Edge Pixels").setValue(1); } catch (e1b) {}
    }
    tintFx = tryEffect(layer, ["ADBE Tint"]);
    if (tintFx) {
      try { tintFx.property("Map White To").setValue([0.92, 0.95, 0.98]); } catch (e2) {}
    }
    levelsFx = tryEffect(layer, ["ADBE Easy Levels2", "ADBE Pro Levels2"]);
    if (levelsFx) {
      try { levelsFx.property("Gamma").setValue(1.08); } catch (e3) {}
    }
    if (layer instanceof ShapeLayer) {
      fillFx = tryEffect(layer, ["ADBE Fill"]);
      if (fillFx) {
        try { fillFx.property("Color").setValue([0.94, 0.96, 0.99]); } catch (e4) {}
      }
    }
    try { layer.property("ADBE Transform Group").property("ADBE Opacity").expression = opacityExpr; } catch (e5) {}
  }

  function runGlass() {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), ctrl, i, layers, blurExpr, opacityExpr;
    blurExpr = 'var ctrl = thisComp.layer("' + GLASS_NAME + '");\nctrl.effect("Blur")("Slider");';
    opacityExpr = 'var ctrl = thisComp.layer("' + GLASS_NAME + '");\nctrl.effect("Opacity")("Slider");';
    app.beginUndoGroup("Evotechly Glass panel");
    ctrl = ensureGuideNull(comp, GLASS_NAME);
    ensureSlider(ctrl, "Opacity", GLASS_OPACITY);
    ensureSlider(ctrl, "Blur", GLASS_BLUR);
    layers = sel.length ? sel : [addGlassShape(comp)];
    for (i = 0; i < layers.length; i++) applyGlassFx(layers[i], blurExpr, opacityExpr);
    app.endUndoGroup();
    alert("Glass panel on " + layers.length + " layer(s).\nEVO_GLASS Opacity / Blur drive native frost (Fast Box Blur + Tint/Levels). Liquid Glass pack is not required.");
  }

  function wipeSide(text) {
    var d = String(text || "Left").toLowerCase();
    if (d === "right" || d === "up" || d === "down") return { mode: "in", side: d };
    if (d === "out") return { mode: "out", side: "left" };
    if (d === "both") return { mode: "both", side: "left" };
    if (d === "in") return { mode: "in", side: "left" };
    return { mode: "in", side: "left" };
  }

  function wipeRampPoints(comp, side) {
    var w = comp.width, h = comp.height;
    if (side === "up") return { a: [w * 0.5, 0], b: [w * 0.5, h] };
    if (side === "down") return { a: [w * 0.5, h], b: [w * 0.5, 0] };
    if (side === "right") return { a: [w, h * 0.5], b: [0, h * 0.5] };
    return { a: [0, h * 0.5], b: [w, h * 0.5] };
  }

  function ensureWipeGradient(comp, side) {
    var layer = findLayer(comp, WIPE_GRAD), ramp, pts;
    pts = wipeRampPoints(comp, side);
    if (!layer) {
      layer = comp.layers.addSolid([1, 1, 1], WIPE_GRAD, comp.width, comp.height, 1);
      layer.name = WIPE_GRAD;
      try { layer.guideLayer = true; } catch (e0) {}
      try { layer.enabled = false; } catch (e1) {}
    }
    ramp = tryEffect(layer, ["ADBE Ramp"]);
    if (ramp) {
      try { ramp.property("Start of Ramp").setValue(pts.a); } catch (e2) {}
      try { ramp.property("End of Ramp").setValue(pts.b); } catch (e3) {}
    }
    return layer;
  }

  function setWipeKeys(fx, t0, keys, ease) {
    var prop = null, i;
    try { prop = fx.property("ADBE Gradient Wipe-0001"); } catch (e0) {}
    if (!prop) { try { prop = fx.property("Transition Completion"); } catch (e1) {} }
    if (!prop) { try { prop = fx.property(1); } catch (e2) {} }
    if (!prop) return false;
    for (i = 0; i < keys.length; i++) prop.setValueAtTime(t0 + keys[i].t, keys[i].completion);
    applyEase(prop, ease);
    try { fx.property("Softness").setValue(WIPE_SOFT); } catch (e3) {}
    try { fx.property("ADBE Gradient Wipe-0003").setValue(WIPE_SOFT); } catch (e4) {}
    return true;
  }

  function wipeKeyTimes(mode, dur) {
    if (mode === "out") return [{ t: 0, completion: 0 }, { t: dur, completion: 100 }];
    if (mode === "both") {
      return [
        { t: 0, completion: 100 },
        { t: dur, completion: 0 },
        { t: dur + WIPE_HOLD, completion: 0 },
        { t: dur + WIPE_HOLD + dur, completion: 100 }
      ];
    }
    return [{ t: 0, completion: 100 }, { t: dur, completion: 0 }];
  }

  function addWipeMatte(comp, layer, side, mode, dur, ease, t0) {
    var matte, pos, rest, w, h, from, to, keys, i, x, y, sx;
    w = layer.source ? layer.source.width : (layer.width || comp.width);
    h = layer.source ? layer.source.height : (layer.height || comp.height);
    try {
      var r = layer.sourceRectAtTime(t0, false);
      w = r.width; h = r.height;
    } catch (e0) {}
    rest = layer.transform.position.value;
    matte = comp.layers.addSolid([1, 1, 1], WIPE_MATTE + "_" + layer.index, Math.max(4, Math.round(w)), Math.max(4, Math.round(h)), 1);
    matte.name = WIPE_MATTE + "_" + layer.index;
    matte.moveBefore(layer);
    try { layer.setTrackMatte(matte, TrackMatteType.ALPHA); } catch (e1) {
      try { layer.trackMatteType = TrackMatteType.ALPHA; } catch (e2) {}
    }
    pos = matte.property("ADBE Transform Group").property("ADBE Position");
    x = rest[0]; y = rest[1];
    if (side === "up") { from = [x, y - h]; to = [x, y]; }
    else if (side === "down") { from = [x, y + h]; to = [x, y]; }
    else if (side === "right") { from = [x + w, y]; to = [x, y]; }
    else { from = [x - w, y]; to = [x, y]; }
    keys = wipeKeyTimes(mode, dur);
    for (i = 0; i < keys.length; i++) {
      sx = keys[i].completion > 50 ? from : to;
      pos.setValueAtTime(t0 + keys[i].t, [sx[0], sx[1]].concat(rest.length > 2 ? [rest[2]] : []));
    }
    applyEase(pos, ease);
    tryEffect(matte, ["ADBE Fast Box Blur", "ADBE Gaussian Blur 2"]);
    blurSoft(matte);
    return matte;
  }

  function blurSoft(layer) {
    var fx = findEffect(layer, ["ADBE Fast Box Blur", "ADBE Gaussian Blur 2", "ADBE Box Blur2"]);
    if (fx) {
      try { fx.property(1).setValue(WIPE_SOFT); } catch (e0) {}
    }
  }

  function runWipe(dirList, durField, easeList) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), i, layer, parsed, ease, dur, fx, keyed, t0, grad, keys;
    if (!sel.length) { alert("Select the layer(s) to gradient-wipe."); return; }
    parsed = wipeSide(dirList.selection ? dirList.selection.text : "Left");
    ease = easeList.selection ? easeList.selection.text.toLowerCase() : "apple";
    dur = clamp(parseNum(durField, DEFAULT_DUR), 0.05, 30);
    t0 = comp.time;
    keys = wipeKeyTimes(parsed.mode, dur);
    app.beginUndoGroup("Evotechly Gradient wipe");
    grad = ensureWipeGradient(comp, parsed.side);
    for (i = 0; i < sel.length; i++) {
      layer = sel[i];
      fx = tryEffect(layer, ["ADBE Gradient Wipe"]);
      keyed = false;
      if (fx) {
        try { fx.property("Invert Gradient").setValue((parsed.side === "right" || parsed.side === "down") ? 1 : 0); } catch (e1) {}
        try { fx.property("Gradient Layer").setValue(grad.index); } catch (e2) {}
        keyed = setWipeKeys(fx, t0, keys, ease);
      }
      if (!keyed) addWipeMatte(comp, layer, parsed.side, parsed.mode, dur, ease, t0);
    }
    app.endUndoGroup();
    alert("Gradient wipe " + parsed.mode + " / " + parsed.side + " on " + sel.length + " layer(s), " + dur + "s · " + ease + " ease.\nNative Gradient Wipe (shape matte fallback). Soft edge " + WIPE_SOFT + ".");
  }

  function hoverScaleExpr(driver) {
    return 'var drvName = "' + driver + '";\n' +
      'var ctrl = thisComp.layer("' + HOVER_NAME + '");\n' +
      "var d;\n" +
      "try { d = thisComp.layer(drvName); } catch (e) { d = ctrl; }\n" +
      'var radius = ctrl.effect("Radius")("Slider");\n' +
      'var boost = ctrl.effect("Scale Boost")("Slider");\n' +
      "var q = d.toComp(d.anchorPoint);\n" +
      "var p = toComp(anchorPoint);\n" +
      "var dist = length(p, q);\n" +
      "var t = clamp(1 - dist / Math.max(radius, 0.001), 0, 1);\n" +
      "var s = value[0] + boost * t;\n" +
      "[s, s];";
  }

  function hoverOpacityExpr(driver) {
    return 'var drvName = "' + driver + '";\n' +
      'var ctrl = thisComp.layer("' + HOVER_NAME + '");\n' +
      "var d;\n" +
      "try { d = thisComp.layer(drvName); } catch (e) { d = ctrl; }\n" +
      'var radius = ctrl.effect("Radius")("Slider");\n' +
      'var boost = ctrl.effect("Opacity Boost")("Slider");\n' +
      "var q = d.toComp(d.anchorPoint);\n" +
      "var p = toComp(anchorPoint);\n" +
      "var dist = length(p, q);\n" +
      "var t = clamp(1 - dist / Math.max(radius, 0.001), 0, 1);\n" +
      "clamp(value + boost * t, 0, 100);";
  }

  function runHover(radiusField, scaleField, opacityField) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedLayers(comp), ctrl, i, layer, driver, radius, scaleBoost, opacityBoost;
    if (!sel.length) { alert("Select the layers that should react when the cursor is near."); return; }
    radius = clamp(parseNum(radiusField, HOVER_RADIUS), 1, 10000);
    scaleBoost = clamp(parseNum(scaleField, HOVER_SCALE), 0, 80);
    opacityBoost = clamp(parseNum(opacityField, HOVER_OPACITY), 0, 100);
    driver = findLayer(comp, CURSOR_DRIVER) ? CURSOR_DRIVER : HOVER_NAME;
    app.beginUndoGroup("Evotechly Proximity hover");
    ctrl = ensureGuideNull(comp, HOVER_NAME);
    ensureSlider(ctrl, "Radius", radius);
    ensureSlider(ctrl, "Scale Boost", scaleBoost);
    ensureSlider(ctrl, "Opacity Boost", opacityBoost);
    for (i = 0; i < sel.length; i++) {
      layer = sel[i];
      if (String(layer.name).toLowerCase() === CURSOR_DRIVER.toLowerCase()) continue;
      if (String(layer.name).toLowerCase() === HOVER_NAME.toLowerCase()) continue;
      try { layer.property("ADBE Transform Group").property("ADBE Scale").expression = hoverScaleExpr(driver); } catch (e1) {}
      try { layer.property("ADBE Transform Group").property("ADBE Opacity").expression = hoverOpacityExpr(driver); } catch (e2) {}
    }
    app.endUndoGroup();
    alert("Proximity hover on " + sel.length + " layer(s).\nDriver: " + driver + " (Phase 1 Cursor + click if present).\nEVO_HOVER Radius / Scale Boost / Opacity Boost. Move the cursor near a card to scale + brighten.");
  }

  function runSeedGolden() {
    var here, seed;
    try { here = new File($.fileName); } catch (e0) { here = null; }
    seed = here && here.parent ? new File(here.parent.fsName + "/Seed Golden Project.jsx") : null;
    if (seed && seed.exists) {
      $.evalFile(seed);
      return;
    }
    alert("Seed Golden Project.jsx was not found next to this panel.\nFile → Scripts → Run Script File… and pick ae/Seed Golden Project.jsx.\nCreates 00_HOME, ERP_DEMO, TALKING_HEAD, REEL_9x16 if missing. See docs/QUICK_START.md.");
  }

  function copyOfficialUrl(url) {
    var os, safe, cmd;
    safe = String(url || "").replace(/[^a-zA-Z0-9:\/._\-?=&%]/g, "");
    if (safe.indexOf("https://") !== 0) return false;
    try {
      os = String($.os || "");
      if (os.indexOf("Windows") !== -1) {
        cmd = 'cmd.exe /c echo ' + safe + " | clip";
      } else {
        cmd = "printf %s '" + safe + "' | pbcopy";
      }
      system.callSystem(cmd);
      return true;
    } catch (e0) {
      return false;
    }
  }

  function showCompanionUrl(entry) {
    var copied;
    if (!entry || !entry.url) {
      alert("Select a companion in Kit Hub.");
      return;
    }
    copied = copyOfficialUrl(entry.url);
    alert(
      entry.name + "\n" + entry.url +
      "\n\nOfficial site only. Evotechly never downloads or vendors this companion." +
      (copied ? "\n\nURL copied to the clipboard." : "\n\nSelect the URL above and copy it.")
    );
  }

  function isTextLayer(layer) {
    try { return layer.property("ADBE Text Properties") !== null; } catch (e) { return false; }
  }

  function selectedTextLayers(comp) {
    var sel = selectedLayers(comp), out = [], i;
    for (i = 0; i < sel.length; i++) if (isTextLayer(sel[i])) out.push(sel[i]);
    return out;
  }

  function rangeUnit(unit) {
    if (unit === "line") return 4;
    if (unit === "word") return 3;
    return 1;
  }

  function addTextAnimator(layer, name) {
    var animators, anim;
    animators = layer.property("ADBE Text Properties").property("ADBE Text Animators");
    anim = animators.addProperty("ADBE Text Animator");
    try { anim.name = name; } catch (e) {}
    return anim;
  }

  function configureRangeEnd(anim, unit, keys, ease) {
    var sel, endP, i;
    try {
      sel = anim.property("ADBE Text Selectors").property(1);
      try { sel.property("ADBE Text Range Type2").setValue(unit); } catch (e0) {}
      try { sel.property("ADBE Text Range Shape").setValue(2); } catch (e1) {}
      try {
        endP = sel.property("ADBE Text Range End 2");
        if (!endP) endP = sel.property("End");
        for (i = 0; i < keys.length; i++) endP.setValueAtTime(keys[i].t, keys[i].end);
        applyEase(endP, ease);
      } catch (e2) {}
    } catch (e) {}
    return sel;
  }

  function hexToRgb(hex) {
    var s = String(hex || "").replace(/^#/, "").toUpperCase(), n;
    if (/^[0-9A-F]{3}$/.test(s)) s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
    if (!/^[0-9A-F]{6}$/.test(s)) s = "FF6A00";
    n = parseInt(s, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  function enableTextStroke(layer, rgb, width) {
    var doc;
    try {
      doc = layer.property("ADBE Text Properties").property("ADBE Text Document").value;
      doc.applyStroke = true;
      doc.strokeWidth = width;
      doc.strokeColor = rgb;
      layer.property("ADBE Text Properties").property("ADBE Text Document").setValue(doc);
    } catch (e) {}
  }

  function runFlowing(unitList, durField, easeList, dirList) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedTextLayers(comp), i, layer, anim, props, op, pos, unit, dur, ease, dir, t0, keys, hold;
    if (!sel.length) { alert("Select a text layer for Flowing Text (Captions-adjacent)."); return; }
    unit = unitList.selection ? unitList.selection.text.toLowerCase() : "char";
    if (unit === "chars") unit = "char";
    ease = easeList.selection ? easeList.selection.text.toLowerCase() : "apple";
    dir = dirList.selection ? dirList.selection.text.toLowerCase() : "in";
    dur = clamp(parseNum(durField, 0.8), 0.05, 30);
    hold = 0.2;
    t0 = comp.time;
    if (dir === "out") keys = [{ t: t0, end: 0 }, { t: t0 + dur, end: 100 }];
    else {
      keys = [{ t: t0, end: 100 }, { t: t0 + dur, end: 0 }];
      if (dir === "both") {
        keys.push({ t: t0 + dur + hold, end: 0 });
        keys.push({ t: t0 + dur + hold + dur, end: 100 });
      }
    }
    app.beginUndoGroup("Evotechly Flowing Text");
    for (i = 0; i < sel.length; i++) {
      layer = sel[i];
      anim = addTextAnimator(layer, "EVO_FLOW");
      props = anim.property("ADBE Text Animator Properties");
      try {
        op = props.addProperty("ADBE Text Opacity");
        op.setValue(0);
      } catch (e0) {}
      try {
        pos = props.addProperty("ADBE Text Position 3D");
        if (!pos) pos = props.addProperty("ADBE Text Position");
        pos.setValue([0, 12, 0]);
      } catch (e1) {}
      configureRangeEnd(anim, rangeUnit(unit), keys, ease);
    }
    app.endUndoGroup();
    alert("Flowing Text on " + sel.length + " layer(s).\nUnit " + unit + " · " + dur + "s · " + ease + " · " + dir + ".\nNative text animator (no vendor presets).");
  }

  function runColoured(hexField, durField, modeList) {
    var comp = requireComp(); if (!comp) return;
    var sel = selectedTextLayers(comp), i, layer, anim, props, fill, stroke, sw, mode, dur, rgb, t0, keys;
    if (!sel.length) { alert("Select a text layer for Coloured Reveal (Captions-adjacent)."); return; }
    mode = modeList.selection ? modeList.selection.text.toLowerCase() : "fill";
    dur = clamp(parseNum(durField, 0.6), 0.05, 30);
    rgb = hexToRgb(hexField && hexField.text);
    t0 = comp.time;
    keys = [{ t: t0, end: 0 }, { t: t0 + dur, end: 100 }];
    app.beginUndoGroup("Evotechly Coloured Reveal");
    for (i = 0; i < sel.length; i++) {
      layer = sel[i];
      anim = addTextAnimator(layer, "EVO_COLOUR");
      props = anim.property("ADBE Text Animator Properties");
      if (mode === "fill" || mode === "both") {
        try {
          fill = props.addProperty("ADBE Text Fill Color");
          fill.setValue(rgb);
        } catch (e0) {}
      }
      if (mode === "stroke" || mode === "both") {
        try {
          stroke = props.addProperty("ADBE Text Stroke Color");
          stroke.setValue(rgb);
        } catch (e1) {}
        try {
          sw = props.addProperty("ADBE Text Stroke Width");
          sw.setValue(2);
        } catch (e2) {}
        enableTextStroke(layer, rgb, 2);
      }
      configureRangeEnd(anim, 1, keys, "apple");
    }
    app.endUndoGroup();
    alert("Coloured Reveal on " + sel.length + " layer(s).\n" + mode + " · " + dur + "s · native fill/stroke animator.");
  }

  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Motion OS Hub", undefined, { resizeable: true });
    var g, durField, clickField, styleList, dirList, offsetField, easeList, axisList;
    var presetList, uiDirList, uiDurField, uiStaggerField, uiEaseList, mirrorBox;
    var wipeDirList, wipeDurField, wipeEaseList, hoverRadiusField, hoverScaleField, hoverOpacityField;
    var flowUnit, flowDur, flowEase, flowDir, colourHex, colourDur, colourMode;
    var homeP, saasP, kitP, kitNote, kitList, intro, foot;
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 10;
    win.add("statictext", undefined, "EVOTECHLY  ·  Motion OS Hub");
    intro = win.add("statictext", undefined, "Home + SaaS + Kit Hub. Companion to Motion OS v0.32 — does not replace it. Window → SaaS Demo Tools.", { multiline: true });
    intro.characters = 42;

    homeP = win.add("panel", undefined, "Home");
    homeP.orientation = "column";
    homeP.alignChildren = ["fill", "top"];
    homeP.margins = 8;
    homeP.add("button", undefined, "Seed Golden Project").onClick = runSeedGolden;

    saasP = win.add("panel", undefined, "SaaS");
    saasP.orientation = "column";
    saasP.alignChildren = ["fill", "top"];
    saasP.margins = 8;

    saasP.add("statictext", undefined, "Cursor + click");
    g = saasP.add("group");
    g.add("statictext", undefined, "Style");
    styleList = g.add("dropdownlist", undefined, ["Pointer", "Hand", "I-beam"]);
    styleList.selection = 0;
    g = saasP.add("group");
    g.add("statictext", undefined, "Duration");
    durField = g.add("edittext", undefined, "0.55");
    durField.characters = 6;
    g.add("statictext", undefined, "Click at");
    clickField = g.add("edittext", undefined, "0.55");
    clickField.characters = 6;
    saasP.add("button", undefined, "Cursor + click").onClick = function () { runCursor(durField, clickField, styleList); };

    saasP.add("statictext", undefined, "Depth reveal");
    saasP.add("button", undefined, "Depth reveal (selected)").onClick = runDepth;

    saasP.add("statictext", undefined, "Stagger reveal");
    g = saasP.add("group");
    g.add("statictext", undefined, "Dir");
    dirList = g.add("dropdownlist", undefined, ["In", "Out", "Both"]);
    dirList.selection = 0;
    g.add("statictext", undefined, "Frames");
    offsetField = g.add("edittext", undefined, "3");
    offsetField.characters = 4;
    g.add("statictext", undefined, "Ease");
    easeList = g.add("dropdownlist", undefined, ["Apple", "Soft", "Linear"]);
    easeList.selection = 0;
    saasP.add("button", undefined, "Stagger reveal (selected)").onClick = function () { runStagger(dirList, offsetField, easeList); };

    saasP.add("statictext", undefined, "UI presets (own)");
    g = saasP.add("group");
    g.add("statictext", undefined, "Preset");
    presetList = g.add("dropdownlist", undefined, UI_PRESET_IDS);
    presetList.selection = 0;
    g.add("statictext", undefined, "Dir");
    uiDirList = g.add("dropdownlist", undefined, ["In", "Out", "Both"]);
    uiDirList.selection = 0;
    g.add("statictext", undefined, "Ease");
    uiEaseList = g.add("dropdownlist", undefined, ["Apple", "Soft", "Linear"]);
    uiEaseList.selection = 0;
    g = saasP.add("group");
    g.add("statictext", undefined, "Duration");
    uiDurField = g.add("edittext", undefined, "0.50");
    uiDurField.characters = 5;
    g.add("statictext", undefined, "Frames");
    uiStaggerField = g.add("edittext", undefined, "3");
    uiStaggerField.characters = 4;
    mirrorBox = g.add("checkbox", undefined, "Mirror");
    mirrorBox.value = false;
    saasP.add("button", undefined, "Apply UI Preset").onClick = function () {
      runUiPreset(presetList, uiDirList, uiDurField, uiStaggerField, uiEaseList, mirrorBox);
    };

    saasP.add("statictext", undefined, "Carousel");
    g = saasP.add("group");
    g.add("statictext", undefined, "Axis");
    axisList = g.add("dropdownlist", undefined, ["X", "Y"]);
    axisList.selection = 0;
    saasP.add("button", undefined, "Carousel setup (selected)").onClick = function () { runCarousel(axisList); };

    saasP.add("statictext", undefined, "Glass panel");
    saasP.add("button", undefined, "Glass Panel (selected)").onClick = runGlass;

    saasP.add("statictext", undefined, "Gradient wipe");
    g = saasP.add("group");
    g.add("statictext", undefined, "Dir");
    wipeDirList = g.add("dropdownlist", undefined, ["Left", "Right", "Up", "Down", "In", "Out", "Both"]);
    wipeDirList.selection = 0;
    g.add("statictext", undefined, "Dur");
    wipeDurField = g.add("edittext", undefined, "0.55");
    wipeDurField.characters = 5;
    g.add("statictext", undefined, "Ease");
    wipeEaseList = g.add("dropdownlist", undefined, ["Apple", "Soft", "Linear"]);
    wipeEaseList.selection = 0;
    saasP.add("button", undefined, "Gradient Wipe (selected)").onClick = function () { runWipe(wipeDirList, wipeDurField, wipeEaseList); };

    saasP.add("statictext", undefined, "Proximity hover");
    g = saasP.add("group");
    g.add("statictext", undefined, "Radius");
    hoverRadiusField = g.add("edittext", undefined, "140");
    hoverRadiusField.characters = 5;
    g.add("statictext", undefined, "Scale");
    hoverScaleField = g.add("edittext", undefined, "6");
    hoverScaleField.characters = 4;
    g.add("statictext", undefined, "Opac");
    hoverOpacityField = g.add("edittext", undefined, "18");
    hoverOpacityField.characters = 4;
    saasP.add("button", undefined, "Proximity Hover (selected)").onClick = function () { runHover(hoverRadiusField, hoverScaleField, hoverOpacityField); };

    saasP.add("statictext", undefined, "Text reveal (captions-adjacent)");
    g = saasP.add("group");
    g.add("statictext", undefined, "Unit");
    flowUnit = g.add("dropdownlist", undefined, ["Char", "Word", "Line"]);
    flowUnit.selection = 0;
    g.add("statictext", undefined, "Dur");
    flowDur = g.add("edittext", undefined, "0.8");
    flowDur.characters = 5;
    g.add("statictext", undefined, "Ease");
    flowEase = g.add("dropdownlist", undefined, ["Apple", "Soft", "Linear"]);
    flowEase.selection = 0;
    g.add("statictext", undefined, "Dir");
    flowDir = g.add("dropdownlist", undefined, ["In", "Out", "Both"]);
    flowDir.selection = 0;
    saasP.add("button", undefined, "Flowing Text").onClick = function () { runFlowing(flowUnit, flowDur, flowEase, flowDir); };

    g = saasP.add("group");
    g.add("statictext", undefined, "Color");
    colourHex = g.add("edittext", undefined, "#FF6A00");
    colourHex.characters = 8;
    g.add("statictext", undefined, "Dur");
    colourDur = g.add("edittext", undefined, "0.6");
    colourDur.characters = 5;
    g.add("statictext", undefined, "Mode");
    colourMode = g.add("dropdownlist", undefined, ["Fill", "Stroke", "Both"]);
    colourMode.selection = 0;
    saasP.add("button", undefined, "Coloured Reveal").onClick = function () { runColoured(colourHex, colourDur, colourMode); };

    kitP = win.add("panel", undefined, "Kit Hub");
    kitP.orientation = "column";
    kitP.alignChildren = ["fill", "top"];
    kitP.margins = 8;
    kitNote = kitP.add("statictext", undefined, "Companion names + official URLs only. Copy or alert. Never download or vendor binaries.", { multiline: true });
    kitNote.characters = 40;
    kitList = kitP.add("listbox", undefined, KIT_HUB_NAMES);
    kitList.preferredSize = [300, 160];
    kitList.onDoubleClick = function () {
      if (kitList.selection) showCompanionUrl(KIT_HUB[kitList.selection.index]);
    };
    kitP.add("button", undefined, "Copy official URL").onClick = function () {
      if (!kitList.selection) { alert("Select a companion in Kit Hub."); return; }
      showCompanionUrl(KIT_HUB[kitList.selection.index]);
    };

    foot = win.add("statictext", undefined, "Window → SaaS Demo Tools / Motion OS Hub. Install: Scripts/ScriptUI Panels. v0.32 stays Window → Evotechly Motion OS. Docs: QUICK_START.md · EDITOR_FREE_KIT.md · KIT_CAPABILITY_MATRIX.md.", { multiline: true });
    foot.characters = 42;

    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); }
    else win.layout.layout(true);
    return win;
  }

  buildUI(thisObj);
})(this);
