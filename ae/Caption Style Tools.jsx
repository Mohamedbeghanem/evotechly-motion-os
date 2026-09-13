#target aftereffects
/*
  Evotechly Caption Style Tools — P1c companion ScriptUI.
  Applies core/captionStyle.js numbers in After Effects. Native text animators.
  Place live text first (Motion OS Captions tab or SRT). Does not replace v0.32.
  Window → Caption Style Tools. Not Meow. Not Presetify. No ElevenLabs.
*/
(function (thisObj) {
  var PREFIX = "EVO_CAP_";
  var DEFAULT_HEX = "#3DDC97";
  var DEFAULT_FRAMES = 12;
  var HOLD = 0.2;
  var SLIDE = 16;
  var SCALE_FROM = 80;
  var BLUR_FROM = 12;

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
  function isTextLayer(layer) {
    try { return layer.property("ADBE Text Properties") !== null; } catch (e) { return false; }
  }
  function selectedText(comp) {
    var sel = selectedLayers(comp), out = [], i;
    for (i = 0; i < sel.length; i++) if (isTextLayer(sel[i])) out.push(sel[i]);
    return out;
  }
  function textContent(layer) {
    var src;
    try {
      src = layer.text.sourceText.value;
      if (src && src.text !== undefined) src = src.text;
      return String(src || "");
    } catch (e) { return ""; }
  }
  function hasArabic(str) {
    return /[\u0600-\u06FF]/.test(String(str || ""));
  }
  function parseHex(input) {
    var s = String(input || "").replace("#", "").replace(/\s/g, "");
    if (/^[0-9a-fA-F]{3}$/.test(s)) s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
    if (!/^[0-9a-fA-F]{6}$/.test(s)) s = "3DDC97";
    return [
      parseInt(s.substring(0, 2), 16) / 255,
      parseInt(s.substring(2, 4), 16) / 255,
      parseInt(s.substring(4, 6), 16) / 255
    ];
  }
  function parseKeywords(raw) {
    var parts = String(raw || "").split(/[,;\n]+/), out = [], seen = {}, i, t, key;
    for (i = 0; i < parts.length; i++) {
      t = parts[i].replace(/^\s+|\s+$/g, "");
      if (!t) continue;
      key = t.toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;
      out.push(t);
    }
    out.sort(function (a, b) { return b.length - a.length; });
    return out;
  }
  function findRanges(text, keywords) {
    var src = String(text || ""), lower = src.toLowerCase(), taken = [], found = [], i, k, from, idx, range, hit, j;
    for (i = 0; i < keywords.length; i++) {
      k = keywords[i].toLowerCase();
      from = 0;
      while (from < lower.length) {
        idx = lower.indexOf(k, from);
        if (idx === -1) break;
        range = { start: idx, end: idx + k.length };
        hit = false;
        for (j = 0; j < taken.length; j++) {
          if (range.start < taken[j].end && taken[j].start < range.end) { hit = true; break; }
        }
        if (!hit) { taken.push(range); found.push(range); }
        from = idx + k.length;
      }
    }
    found.sort(function (a, b) { return a.start - b.start; });
    return found;
  }
  function parseNum(field, fallback) {
    var n = parseFloat(field && field.text);
    if (n !== n) return fallback;
    return n;
  }
  function applyEase(prop) {
    if (!prop || !prop.numKeys) return;
    var n = 1, t, k, ins, outs, j;
    try { t = prop.propertyValueType; } catch (e) { return; }
    if (t === PropertyValueType.TwoD || t === PropertyValueType.TwoD_SPATIAL) n = 2;
    if (t === PropertyValueType.ThreeD || t === PropertyValueType.ThreeD_SPATIAL) n = 3;
    for (k = 1; k <= prop.numKeys; k++) {
      try {
        ins = []; outs = [];
        for (j = 0; j < n; j++) {
          ins.push(new KeyframeEase(0, 80));
          outs.push(new KeyframeEase(0, 18));
        }
        prop.setTemporalEaseAtKey(k, ins, outs);
      } catch (err) {}
    }
  }
  function animatorsGroup(layer) {
    try { return layer.property("ADBE Text Properties").property("ADBE Text Animators"); } catch (e) { return null; }
  }
  function addAnimator(layer, name) {
    var group = animatorsGroup(layer), anim;
    if (!group) return null;
    anim = group.addProperty("ADBE Text Animator");
    try { anim.name = name; } catch (e) {}
    return anim;
  }
  function removeOwned(layer, kind) {
    var group = animatorsGroup(layer), i, a, name;
    if (!group) return;
    for (i = group.numProperties; i >= 1; i--) {
      a = group.property(i);
      if (!a) continue;
      name = String(a.name);
      if (name.indexOf(PREFIX) !== 0) continue;
      if (kind === "color" && name.indexOf(PREFIX + "COLOR_") !== 0) continue;
      if (kind === "inout" && name.indexOf(PREFIX + "COLOR_") === 0) continue;
      try { a.remove(); } catch (e0) {}
    }
  }
  function rangeSelector(anim) {
    try { return anim.property("ADBE Text Selectors").property(1); } catch (e) { return null; }
  }
  function setBasedOn(sel, unit) {
    try { sel.property("ADBE Text Range Type2").setValue(unit); } catch (e0) {}
  }
  function setRangePercent(sel, startPct, endPct) {
    var startP, endP;
    try { startP = sel.property("ADBE Text Percent Start") || sel.property("Start"); } catch (e0) { startP = null; }
    try { endP = sel.property("ADBE Text Percent End") || sel.property("ADBE Text Range End 2") || sel.property("End"); } catch (e1) { endP = null; }
    try { if (startP) startP.setValue(startPct); } catch (e2) {}
    try { if (endP) endP.setValue(endPct); } catch (e3) {}
  }
  function keyRangeEnd(sel, keys, t0) {
    var endP, i;
    try { endP = sel.property("ADBE Text Range End 2") || sel.property("ADBE Text Percent End") || sel.property("End"); } catch (e0) { return; }
    if (!endP) return;
    for (i = 0; i < keys.length; i++) {
      try { endP.setValueAtTime(t0 + keys[i].t, keys[i].end); } catch (e1) {}
    }
    applyEase(endP);
  }
  function addProp(anim, matchName) {
    try { return anim.property("ADBE Text Animator Properties").addProperty(matchName); } catch (e) { return null; }
  }
  function setKeys(prop, keys, t0) {
    var i, v;
    if (!prop || !keys) return;
    for (i = 0; i < keys.length; i++) {
      v = keys[i].value;
      try { prop.setValueAtTime(t0 + keys[i].t, v); } catch (e) {}
    }
    applyEase(prop);
  }

  function runColor(kwField, hexField) {
    var comp = requireComp(); if (!comp) return;
    var layers = selectedText(comp), keywords, rgb, i, layer, txt, ranges, len, r, anim, fill, sel, n;
    if (!layers.length) { alert("Select one or more text layers (Captions tab / SRT first)."); return; }
    keywords = parseKeywords(kwField && kwField.text);
    if (!keywords.length) { alert("Type one or more keywords, separated by commas."); return; }
    rgb = parseHex(hexField && hexField.text);
    n = 0;
    app.beginUndoGroup("Evotechly Color keywords");
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      txt = textContent(layer);
      ranges = findRanges(txt, keywords);
      if (!ranges.length) continue;
      removeOwned(layer, "color");
      len = txt.length || 1;
      for (r = 0; r < ranges.length; r++) {
        anim = addAnimator(layer, PREFIX + "COLOR_" + r);
        if (!anim) continue;
        fill = addProp(anim, "ADBE Text Fill Color");
        if (fill) {
          try { fill.setValue(rgb); } catch (e0) {}
        }
        sel = rangeSelector(anim);
        if (sel) {
          setBasedOn(sel, 1);
          setRangePercent(sel, (ranges[r].start / len) * 100, (ranges[r].end / len) * 100);
        }
      }
      n += 1;
    }
    app.endUndoGroup();
    if (!n) {
      alert("No keyword hits on the selected text.\nTried: " + keywords.join(", "));
      return;
    }
    alert("Keyword color on " + n + " text layer(s).\nNative Fill Color animator + range selector. Meow Captions is not required.");
  }

  function runInOut(presetList, dirList, framesField) {
    var comp = requireComp(); if (!comp) return;
    var layers = selectedText(comp), preset, dir, frames, fps, dur, hold, t0, i, layer, txt, used, sel, anim, prop;
    if (!layers.length) { alert("Select one or more text layers (Captions tab / SRT first)."); return; }
    preset = presetList.selection ? String(presetList.selection.text).replace(/\s/g, "") : "Fade";
    preset = preset.toLowerCase();
    if (preset === "slideup") preset = "slideUp";
    dir = dirList.selection ? String(dirList.selection.text).toLowerCase() : "in";
    frames = Math.round(clamp(parseNum(framesField, DEFAULT_FRAMES), 1, 180));
    fps = comp.frameRate || 30;
    dur = frames / fps;
    hold = HOLD;
    t0 = comp.time;
    app.beginUndoGroup("Evotechly Caption in/out");
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      txt = textContent(layer);
      used = (hasArabic(txt) && preset === "typewriter") ? "fade" : preset;
      removeOwned(layer, "inout");
      if (used === "typewriter") {
        anim = addAnimator(layer, PREFIX + "TYPEWRITER");
        prop = addProp(anim, "ADBE Text Opacity");
        if (prop) try { prop.setValue(0); } catch (e0) {}
        sel = rangeSelector(anim);
        if (sel) {
          setBasedOn(sel, 1);
          if (dir === "out") keyRangeEnd(sel, [{ t: 0, end: 100 }, { t: dur, end: 0 }], t0);
          else if (dir === "both") keyRangeEnd(sel, [
            { t: 0, end: 0 },
            { t: dur, end: 100 },
            { t: dur + hold, end: 100 },
            { t: dur + hold + dur, end: 0 }
          ], t0);
          else keyRangeEnd(sel, [{ t: 0, end: 0 }, { t: dur, end: 100 }], t0);
        }
      } else if (used === "scale") {
        anim = addAnimator(layer, PREFIX + "SCALE");
        prop = addProp(anim, "ADBE Text Scale 3D");
        if (!prop) prop = addProp(anim, "ADBE Text Scale");
        applyInOutKeys(prop, [SCALE_FROM, SCALE_FROM, 100], [100, 100, 100], dir, t0, dur, hold);
        coverAll(anim);
      } else if (used === "slideUp") {
        anim = addAnimator(layer, PREFIX + "OPACITY");
        prop = addProp(anim, "ADBE Text Opacity");
        applyInOutKeys(prop, 0, 100, dir, t0, dur, hold);
        coverAll(anim);
        anim = addAnimator(layer, PREFIX + "POSITION");
        prop = addProp(anim, "ADBE Text Position 3D");
        if (!prop) prop = addProp(anim, "ADBE Text Position");
        applyInOutKeys(prop, [0, SLIDE, 0], [0, 0, 0], dir, t0, dur, hold);
        coverAll(anim);
      } else if (used === "blur") {
        anim = addAnimator(layer, PREFIX + "OPACITY");
        prop = addProp(anim, "ADBE Text Opacity");
        applyInOutKeys(prop, 0, 100, dir, t0, dur, hold);
        coverAll(anim);
        anim = addAnimator(layer, PREFIX + "BLUR");
        prop = addProp(anim, "ADBE Text Blur");
        applyInOutKeys(prop, BLUR_FROM, 0, dir, t0, dur, hold);
        coverAll(anim);
      } else {
        anim = addAnimator(layer, PREFIX + "OPACITY");
        prop = addProp(anim, "ADBE Text Opacity");
        applyInOutKeys(prop, 0, 100, dir, t0, dur, hold);
        coverAll(anim);
      }
    }
    app.endUndoGroup();
    alert("Caption " + dir + " · " + preset + " on " + layers.length + " layer(s).\n" + frames + " frames · native text animators. Presetify is not required.");
  }

  function coverAll(anim) {
    var sel = rangeSelector(anim);
    if (!sel) return;
    setBasedOn(sel, 3);
    setRangePercent(sel, 0, 100);
  }

  function applyInOutKeys(prop, fromVal, toVal, dir, t0, dur, hold) {
    if (!prop) return;
    if (dir === "out") {
      setKeys(prop, [{ t: 0, value: toVal }, { t: dur, value: fromVal }], t0);
    } else if (dir === "both") {
      setKeys(prop, [
        { t: 0, value: fromVal },
        { t: dur, value: toVal },
        { t: dur + hold, value: toVal },
        { t: dur + hold + dur, value: fromVal }
      ], t0);
    } else {
      setKeys(prop, [{ t: 0, value: fromVal }, { t: dur, value: toVal }], t0);
    }
  }

  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Caption Style Tools", undefined, { resizeable: true });
    var g, kwField, hexField, presetList, dirList, framesField, intro, foot;
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 10;
    win.add("statictext", undefined, "EVOTECHLY  ·  Caption Style Tools");
    intro = win.add("statictext", undefined, "P1c native text animators. Place live text on the Captions tab first. Does not replace Motion OS v0.32. Meow / Presetify / ElevenLabs are not used.", { multiline: true });
    intro.characters = 44;

    win.add("statictext", undefined, "Keyword color");
    g = win.add("group");
    g.add("statictext", undefined, "Keywords");
    kwField = g.add("edittext", undefined, "ship, fast");
    kwField.characters = 16;
    g.add("statictext", undefined, "Hex");
    hexField = g.add("edittext", undefined, DEFAULT_HEX);
    hexField.characters = 8;
    win.add("button", undefined, "Color keywords").onClick = function () { runColor(kwField, hexField); };

    win.add("statictext", undefined, "In / Out preset");
    g = win.add("group");
    g.add("statictext", undefined, "Preset");
    presetList = g.add("dropdownlist", undefined, ["Fade", "Scale", "Slide Up", "Typewriter", "Blur"]);
    presetList.selection = 0;
    g.add("statictext", undefined, "Dir");
    dirList = g.add("dropdownlist", undefined, ["In", "Out", "Both"]);
    dirList.selection = 0;
    g.add("statictext", undefined, "Frames");
    framesField = g.add("edittext", undefined, String(DEFAULT_FRAMES));
    framesField.characters = 4;
    win.add("button", undefined, "Apply in/out").onClick = function () { runInOut(presetList, dirList, framesField); };

    foot = win.add("statictext", undefined, "Install: copy this file into Scripts/ScriptUI Panels. See docs/CAPTION_STYLE.md. Captions tab still owns templates + SRT.", { multiline: true });
    foot.characters = 44;

    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); }
    else win.layout.layout(true);
    return win;
  }

  buildUI(thisObj);
})(this);
