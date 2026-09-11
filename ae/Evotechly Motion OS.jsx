#target aftereffects
/*
  Evotechly Motion OS v0.5 Ultimate
  Scripts/ScriptUI Panels → Window > Evotechly Motion OS
  Style / Direction / Shot. L2 lockup. No Node.
*/
(function (thisObj) {
  var ROLE_ORDER = ["logo","eyebrow","title","subtitle","nav","sidebar","dashboard","screenshot","image","card","metric","badge","tooltip","button","cta","cursor","modal","toast","row","stack"];
  var ALIASES = [
    { role: "cta", match: ["cta", "get started", "start free", "book demo"] },
    { role: "button", match: ["button", "btn", "primarybutton"] },
    { role: "cursor", match: ["cursor", "pointer", "mouse"] },
    { role: "modal", match: ["modal", "dialog", "sheet"] },
    { role: "toast", match: ["toast", "snackbar", "notice"] },
    { role: "row", match: ["uirow", "feature row", "row"] },
    { role: "stack", match: ["uistack", "stack"] },
    { role: "tooltip", match: ["tooltip", "hint"] },
    { role: "badge", match: ["badge", "chip", "tag"] },
    { role: "metric", match: ["metric", "kpi", "stat", "number"] },
    { role: "card", match: ["card"] },
    { role: "screenshot", match: ["screenshot", "product shot", "ui shot"] },
    { role: "image", match: ["image", "photo"] },
    { role: "dashboard", match: ["dashboard", "app shell", "canvas"] },
    { role: "sidebar", match: ["sidebar"] },
    { role: "nav", match: ["navbar", "nav", "menu"] },
    { role: "subtitle", match: ["subtitle", "subhead", "subheading", "deck"] },
    { role: "title", match: ["title", "headline", "heading", "h1"] },
    { role: "eyebrow", match: ["eyebrow", "kicker", "label"] },
    { role: "logo", match: ["logo", "wordmark"] }
  ];
  var PRESETS = {
    fadeUp:     { duration: 0.55, easing: "easeOut",   from: { o: 0, x: 0, y: 16, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    fadeUpSoft: { duration: 0.60, easing: "easeOut",   from: { o: 0, x: 0, y: 10, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    fadeUpCalm: { duration: 0.70, easing: "easeOut",   from: { o: 0, x: 0, y: 6,  s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    scaleIn:    { duration: 0.50, easing: "easeOut",   from: { o: 0, x: 0, y: 0,  s: 96  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    slideUp:    { duration: 0.60, easing: "easeOut",   from: { o: 0, x: 0, y: 28, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    slideRight: { duration: 0.55, easing: "easeOut",   from: { o: 0, x:-24, y: 0,  s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    zoomOut:    { duration: 0.90, easing: "easeInOut", from: { o: 0, x: 0, y: 0,  s: 106 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    pop:        { duration: 0.42, easing: "easeOut",   from: { o: 0, x: 0, y: 8,  s: 92  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    cursorIn:   { duration: 0.50, easing: "easeInOut", from: { o: 0, x: 12, y: 12, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    uiRow:      { duration: 0.48, easing: "easeOut",   from: { o: 0, x:-16, y: 0,  s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    uiStack:    { duration: 0.50, easing: "easeOut",   from: { o: 0, x: 0, y: 12, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    uiCard:     { duration: 0.46, easing: "easeOut",   from: { o: 0, x: 0, y: 8,  s: 97  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    uiModal:    { duration: 0.42, easing: "easeOut",   from: { o: 0, x: 0, y: 10, s: 96  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    uiNav:      { duration: 0.38, easing: "easeOut",   from: { o: 0, x: 0, y: 8,  s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    uiToast:    { duration: 0.36, easing: "easeOut",   from: { o: 0, x: 0, y:-14, s: 98  }, to: { o: 100, x: 0, y: 0, s: 100 } }
  };
  function R(p, b, s, sc, a) { return { preset: p, base: b, stagger: s, durationScale: sc, after: a || null }; }
  function ui() { return { modal: R("uiModal", 0.2, 0, 1), toast: R("uiToast", 0.52, 0.04, 0.9), row: R("uiRow", 0.22, 0.05, 1), stack: R("uiStack", 0.22, 0.05, 1) }; }
  function mix(roles) { var e = ui(), k; for (k in e) if (e.hasOwnProperty(k) && !roles[k]) roles[k] = e[k]; return roles; }
  var STYLES = {
    stripe: { id: "stripe", gap: 0.12, roles: mix({ logo: R("fadeUp",0,0,0.9), eyebrow: R("fadeUp",0.02,0,0.85), title: R("fadeUp",0.06,0,1), subtitle: R("fadeUpSoft",0.14,0,1), nav: R("uiNav",0.08,0.03,0.8), sidebar: R("slideRight",0.12,0,1), dashboard: R("slideUp",0.18,0,1), screenshot: R("zoomOut",0.16,0,1), image: R("zoomOut",0.16,0.08,1), card: R("scaleIn",0.28,0.07,1), metric: R("slideUp",0.34,0.05,0.9), badge: R("pop",0.4,0.04,0.8), tooltip: R("fadeUpSoft",0.48,0.04,0.75), button: R("scaleIn",0.5,0.04,0.84), cta: R("pop",null,0,0.8,"group"), cursor: R("cursorIn",null,0,1,"cta") }) },
    linear: { id: "linear", gap: 0.1, roles: mix({ logo: R("fadeUp",0,0,0.9), eyebrow: R("fadeUp",0,0,0.8), title: R("slideUp",0.04,0,0.95), subtitle: R("fadeUpSoft",0.12,0,1), nav: R("uiNav",0.06,0.03,0.8), sidebar: R("slideRight",0.1,0,1), dashboard: R("fadeUp",0.16,0,1.1), screenshot: R("zoomOut",0.14,0,1.05), image: R("zoomOut",0.14,0.08,1), card: R("fadeUp",0.24,0.06,1), metric: R("fadeUp",0.3,0.05,0.9), badge: R("pop",0.36,0.04,0.75), tooltip: R("fadeUpSoft",0.44,0.04,0.75), button: R("scaleIn",0.46,0.04,0.84), cta: R("scaleIn",null,0,0.8,"group"), cursor: R("cursorIn",null,0,1,"cta") }) },
    vercel: { id: "vercel", gap: 0.08, roles: mix({ logo: R("fadeUp",0,0,0.75), eyebrow: R("fadeUp",0,0,0.7), title: R("fadeUp",0.04,0,0.85), subtitle: R("fadeUpSoft",0.1,0,0.9), nav: R("uiNav",0.04,0.02,0.7), sidebar: R("slideRight",0.08,0,0.85), dashboard: R("scaleIn",0.12,0,0.9), screenshot: R("zoomOut",0.1,0,0.85), image: R("zoomOut",0.1,0.06,0.85), card: R("scaleIn",0.2,0.05,0.9), metric: R("slideUp",0.24,0.04,0.8), badge: R("pop",0.3,0.03,0.7), tooltip: R("fadeUpSoft",0.36,0.03,0.7), button: R("pop",0.38,0.03,0.75), cta: R("pop",null,0,0.72,"group"), cursor: R("cursorIn",null,0,0.9,"cta") }) },
    evotechly: { id: "evotechly", gap: 0.11, roles: mix({ logo: R("fadeUpSoft",0,0,0.9), eyebrow: R("fadeUpSoft",0.02,0,0.85), title: R("fadeUp",0.06,0,1), subtitle: R("fadeUpSoft",0.14,0,1), nav: R("uiNav",0.06,0.03,0.85), sidebar: R("slideRight",0.1,0,0.95), dashboard: R("uiCard",0.16,0,1), screenshot: R("zoomOut",0.14,0,1), image: R("zoomOut",0.14,0.08,1), card: R("uiCard",0.26,0.06,1), metric: R("fadeUpSoft",0.32,0.05,0.9), badge: R("pop",0.38,0.04,0.8), tooltip: R("fadeUpSoft",0.46,0.04,0.75), button: R("uiCard",0.48,0.04,0.84), cta: R("pop",null,0,0.8,"group"), cursor: R("cursorIn",null,0,1,"cta") }) },
    apple: { id: "apple", gap: 0.14, roles: mix({ logo: R("fadeUpCalm",0,0,1), eyebrow: R("fadeUpCalm",0.04,0,0.9), title: R("fadeUpCalm",0.08,0,1.05), subtitle: R("fadeUpCalm",0.16,0,1.05), nav: R("uiNav",0.06,0.04,1), sidebar: R("fadeUpCalm",0.1,0,1.05), dashboard: R("fadeUpCalm",0.16,0,1.1), screenshot: R("fadeUpCalm",0.14,0,1.15), image: R("fadeUpCalm",0.14,0.06,1.1), card: R("uiCard",0.26,0.08,1.05), metric: R("fadeUpCalm",0.34,0.06,1), badge: R("fadeUpSoft",0.4,0.05,0.9), tooltip: R("fadeUpCalm",0.48,0.04,0.85), button: R("uiCard",0.5,0.04,0.95), cta: R("uiCard",null,0,0.95,"group"), cursor: R("cursorIn",null,0,1.05,"cta") }) }
  };
  function round4(n) { return Math.round(n * 10000) / 10000; }
  function lower(s) { return String(s || "").toLowerCase(); }
  function detectRole(name) {
    var n = lower(name), i, j, a;
    for (i = 0; i < ALIASES.length; i++) {
      a = ALIASES[i].match;
      for (j = 0; j < a.length; j++) if (n.indexOf(a[j]) !== -1) return ALIASES[i].role;
    }
    return null;
  }
  function roleIndex(role) {
    var i; for (i = 0; i < ROLE_ORDER.length; i++) if (ROLE_ORDER[i] === role) return i;
    return 99;
  }
  function isAnimatable(layer) {
    if (!layer) return false;
    if (layer instanceof CameraLayer || layer instanceof LightLayer) return false;
    try { return layer.property("ADBE Transform Group") !== null; } catch (e) { return false; }
  }
  function activeComp() {
    var comp = app.project ? app.project.activeItem : null;
    return (comp && comp instanceof CompItem) ? comp : null;
  }
  function isSkip(name) {
    var n = lower(name);
    return n.indexOf("evo_skip") !== -1 || n.indexOf("evo_lockup") !== -1;
  }
  function layerBounds(comp, layer) {
    var x = layer.transform.position.value[0], y = layer.transform.position.value[1], w = 48, h = 48;
    try {
      var r = layer.sourceRectAtTime(comp.time, false);
      w = r.width; h = r.height;
      x = layer.transform.position.value[0] + r.left;
      y = layer.transform.position.value[1] + r.top;
    } catch (e) {}
    return { x: x, y: y, width: w, height: h };
  }
  function collectLayers(comp, selectedOnly) {
    var out = [], ignored = [], i, layer, role, b;
    for (i = 1; i <= comp.numLayers; i++) {
      layer = comp.layer(i);
      if (selectedOnly && !layer.selected) continue;
      if (isSkip(layer.name)) { ignored.push(layer.name); continue; }
      if (!isAnimatable(layer)) { ignored.push(layer.name); continue; }
      role = detectRole(layer.name);
      if (!role) { ignored.push(layer.name); continue; }
      b = layerBounds(comp, layer);
      out.push({ name: layer.name, role: role, x: b.x, y: b.y, width: b.width, height: b.height });
    }
    return { layers: out, ignored: ignored };
  }
  function sortLayers(list) {
    list.sort(function (a, b) {
      var ra = roleIndex(a.role), rb = roleIndex(b.role);
      if (ra !== rb) return ra - rb;
      if (a.y !== b.y) return a.y - b.y;
      if (a.x !== b.x) return a.x - b.x;
      return 0;
    });
    return list;
  }
  function directedPoses(preset, direction) {
    if (direction === "out") return { from: preset.to, to: preset.from, both: false };
    return { from: preset.from, to: preset.to, both: direction === "both" };
  }
  function lockupPart(item) {
    var n = lower(item.name), role = item.role;
    if (n.indexOf("wordmark") !== -1) return "type";
    if (n.indexOf("logo") !== -1 || n.indexOf("mark") !== -1 || n.indexOf("icon") !== -1) return "mark";
    if (role === "logo") return "mark";
    if (role === "title" || role === "subtitle" || role === "eyebrow") return "type";
    return null;
  }
  function typeMetrics(layer) {
    var h = Number(layer && layer.height) || 48;
    var w = Number(layer && layer.width) || h;
    var y = Number(layer && layer.y) || 0;
    var x = Number(layer && layer.x) || 0;
    return { x: x, y: y, width: w, height: h, capHeight: round4(h * 0.72), xHeight: round4(h * 0.52), baseline: round4(y + h * 0.82) };
  }
  function pinSet(mark, word) {
    var m = typeMetrics(mark || {}), t = typeMetrics(word || mark || {});
    var markRight = m.x + m.width;
    var gap = word ? (t.x - markRight) : m.height * 0.28;
    return {
      markCenter: { x: round4(m.x + m.width / 2), y: round4(m.y + m.height / 2) },
      opticalGap: round4(Math.max(8, gap)),
      gapX: round4(markRight + Math.max(8, gap)),
      baseline: t.baseline,
      capY: round4(t.baseline - t.capHeight),
      xHeightY: round4(t.baseline - t.xHeight)
    };
  }
  function findLockupPart(plan, part) {
    var fallback = null, i, n;
    for (i = 0; i < plan.length; i++) {
      if (lockupPart(plan[i]) !== part) continue;
      n = lower(plan[i].name);
      if (part === "type" && n.indexOf("wordmark") !== -1) return plan[i];
      if (part === "mark" && n.indexOf("logo") !== -1) return plan[i];
      if (!fallback) fallback = plan[i];
    }
    return fallback;
  }
  function applyLockupShot(plan, shot) {
    if (shot !== "logoLockup") { plan._lockup = null; return plan; }
    var pins = pinSet(findLockupPart(plan, "mark"), findLockupPart(plan, "type"));
    var markN = 0, typeN = 0, i, part;
    for (i = 0; i < plan.length; i++) {
      part = lockupPart(plan[i]);
      if (part === "mark") { plan[i].delay = round4(0.02 + markN * 0.05); plan[i].lockupPart = "mark"; markN += 1; }
      else if (part === "type") { plan[i].delay = round4(0.16 + typeN * 0.08); plan[i].lockupPart = "type"; typeN += 1; }
    }
    plan._lockup = { applied: true, pins: pins, marks: markN, type: typeN };
    return plan;
  }
  function clearLockupGuides(comp) {
    var i, layer;
    for (i = comp.numLayers; i >= 1; i--) {
      layer = comp.layer(i);
      if (isSkip(layer.name)) try { layer.remove(); } catch (e) {}
    }
  }
  function applyLockupGuides(comp, lockup) {
    if (!lockup || !lockup.pins) return 0;
    var pins = lockup.pins, made = 0;
    function addGuide(id, x, y) {
      var n = comp.layers.addNull();
      n.name = "EVO_SKIP_LOCKUP_" + id;
      try { n.guideLayer = true; } catch (e) {}
      try { n.shy = true; } catch (e2) {}
      n.transform.position.setValue([x, y]);
      made += 1;
    }
    clearLockupGuides(comp);
    addGuide("MARK", pins.markCenter.x, pins.markCenter.y);
    addGuide("GAP", pins.gapX, pins.markCenter.y);
    addGuide("BASE", pins.markCenter.x, pins.baseline);
    addGuide("CAP", pins.markCenter.x, pins.capY);
    addGuide("XHT", pins.markCenter.x, pins.xHeightY);
    return made;
  }
  function buildPlan(rawLayers, styleId, direction, shot) {
    var style = STYLES[styleId] || STYLES.stripe;
    var list = sortLayers(rawLayers.slice(0));
    var counts = {}, plan = [], i, item, role, rule, preset, delay, sibling, poses, end;
    direction = direction || "in";
    for (i = 0; i < list.length; i++) {
      item = list[i]; role = item.role; rule = style.roles[role] || style.roles.card;
      if (counts[role] == null) counts[role] = 0;
      sibling = counts[role]; counts[role] += 1;
      preset = PRESETS[rule.preset] || PRESETS.fadeUp;
      poses = directedPoses(preset, direction);
      delay = rule.base == null ? 0 : rule.base + sibling * rule.stagger;
      plan.push({ name: item.name, role: role, preset: rule.preset, after: rule.after, direction: direction, delay: round4(delay), duration: round4(preset.duration * rule.durationScale), easing: preset.easing, from: poses.from, to: poses.to, both: poses.both });
    }
    var groupEnd = 0, ctaEnd = 0;
    for (i = 0; i < plan.length; i++) {
      if (plan[i].after) continue;
      end = plan[i].delay + plan[i].duration * (plan[i].both ? 2 : 1);
      if (end > groupEnd) groupEnd = end;
    }
    for (i = 0; i < plan.length; i++) {
      if (plan[i].after === "group") {
        plan[i].delay = round4(groupEnd + style.gap - plan[i].duration * 0.15);
        if (plan[i].delay < 0) plan[i].delay = 0;
      }
    }
    for (i = 0; i < plan.length; i++) {
      if (plan[i].role === "cta") {
        end = plan[i].delay + plan[i].duration * (plan[i].both ? 2 : 1);
        if (end > ctaEnd) ctaEnd = end;
      }
    }
    if (ctaEnd === 0) ctaEnd = groupEnd;
    for (i = 0; i < plan.length; i++) if (plan[i].after === "cta") plan[i].delay = round4(ctaEnd + 0.06);
    return applyLockupShot(plan, shot);
  }
  function clearKeys(prop) { var i; for (i = prop.numKeys; i >= 1; i--) prop.removeKey(i); }
  function easePair(kind) {
    if (kind === "easeInOut") return { i: new KeyframeEase(0, 33), o: new KeyframeEase(0, 33) };
    return { i: new KeyframeEase(0, 70), o: new KeyframeEase(0, 16) };
  }
  function applyEase(prop, keyIndex, kind) {
    try {
      var e = easePair(kind), t = prop.propertyValueType, n = 1, ins = [], outs = [], i;
      if (t === PropertyValueType.TwoD || t === PropertyValueType.TwoD_SPATIAL) n = 2;
      if (t === PropertyValueType.ThreeD || t === PropertyValueType.ThreeD_SPATIAL) n = 3;
      for (i = 0; i < n; i++) { ins.push(e.i); outs.push(e.o); }
      prop.setTemporalEaseAtKey(keyIndex, ins, outs);
    } catch (err) {}
  }
  function findLayer(comp, name) {
    var want = lower(name), i;
    for (i = 1; i <= comp.numLayers; i++) if (lower(comp.layer(i).name) === want) return comp.layer(i);
    return null;
  }
  function setPose(pos, sc, op, current, is3d, t, pose, kind) {
    op.setValueAtTime(t, pose.o); applyEase(op, op.nearestKeyIndex(t), kind);
    var p = [current[0] + pose.x, current[1] + pose.y];
    if (is3d) p.push(current[2]);
    pos.setValueAtTime(t, p); applyEase(pos, pos.nearestKeyIndex(t), kind);
    var curS = sc.value, s = curS.length === 2 ? [pose.s, pose.s] : [pose.s, pose.s, curS[2]];
    sc.setValueAtTime(t, s); applyEase(sc, sc.nearestKeyIndex(t), kind);
  }
  function applySpec(layer, spec) {
    var pos = layer.property("ADBE Transform Group").property("ADBE Position");
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    var current = pos.value, is3d = current.length > 2;
    var t0 = spec.delay, t1 = spec.delay + spec.duration, kind = spec.easing || "easeOut";
    clearKeys(op); clearKeys(pos); clearKeys(sc);
    setPose(pos, sc, op, current, is3d, t0, spec.from, kind);
    setPose(pos, sc, op, current, is3d, t1, spec.to, kind);
    if (spec.both) setPose(pos, sc, op, current, is3d, t1 + spec.duration, spec.from, kind);
  }
  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Evotechly Motion OS", undefined, { resizeable: true });
    win.orientation = "column"; win.alignChildren = ["fill", "top"]; win.spacing = 8; win.margins = 12;
    win.add("group").add("statictext", undefined, "EVOTECHLY MOTION OS");
    var styleRow = win.add("group"); styleRow.add("statictext", undefined, "Style");
    var styleList = styleRow.add("dropdownlist", undefined, ["Stripe / premium SaaS", "Linear / product-native", "Vercel / sharp reveal", "Evotechly / brand taste", "Apple / calm"]);
    styleList.selection = 0; styleList.alignment = ["fill", "center"];
    var dirRow = win.add("group"); dirRow.add("statictext", undefined, "Direction");
    var dirList = dirRow.add("dropdownlist", undefined, ["In", "Out", "Both"]);
    dirList.selection = 0; dirList.alignment = ["fill", "center"];
    var shotRow = win.add("group"); shotRow.add("statictext", undefined, "Shot");
    var shotList = shotRow.add("dropdownlist", undefined, ["Hero", "Feature row", "Pricing", "Dashboard tour", "Logo lockup", "UI screen"]);
    shotList.selection = 0; shotList.alignment = ["fill", "center"];
    var selectedOnly = win.add("checkbox", undefined, "Selected layers only"); selectedOnly.value = false;
    var status = win.add("statictext", undefined, "Open a comp, name layers, then Scan."); status.characters = 36;
    var list = win.add("listbox", undefined, [], { numberOfColumns: 3, showHeaders: true, columnTitles: ["Layer", "Role", "Time"], columnWidths: [140, 80, 70] });
    list.preferredSize = [320, 220]; list.alignment = ["fill", "fill"];
    var ignoredText = win.add("statictext", undefined, "", { multiline: true }); ignoredText.preferredSize = [320, 36];
    var buttons = win.add("group"); buttons.alignment = ["fill", "bottom"];
    var scanBtn = buttons.add("button", undefined, "Scan comp");
    var applyBtn = buttons.add("button", undefined, "Apply motion"); applyBtn.enabled = false;
    win.add("statictext", undefined, "Names: Title, Card 1, CTA, Logo, Wordmark, Modal", { multiline: true });
    var state = { plan: [] };
    var styleIds = ["stripe", "linear", "vercel", "evotechly", "apple"];
    var dirIds = ["in", "out", "both"];
    var shotIds = ["hero", "featureRow", "pricing", "dashboardTour", "logoLockup", "uiScreen"];
    function currentStyle() { return styleIds[styleList.selection ? styleList.selection.index : 0] || "stripe"; }
    function currentDirection() { return dirIds[dirList.selection ? dirList.selection.index : 0] || "in"; }
    function currentShot() { return shotIds[shotList.selection ? shotList.selection.index : 0] || "hero"; }
    function refreshList(plan, ignored, compName) {
      var i, row; list.removeAll();
      for (i = 0; i < plan.length; i++) { row = list.add("item", plan[i].name); row.subItems[0].text = plan[i].role; row.subItems[1].text = plan[i].delay + "s"; }
      status.text = (compName || "Comp") + "  ·  " + plan.length + "  ·  " + currentStyle() + "  ·  " + currentDirection() + "  ·  " + currentShot();
      ignoredText.text = (ignored && ignored.length) ? ("Ignored: " + ignored.slice(0, 8).join(", ")) : (plan.length ? "All recognized layers will be keyed." : "No named SaaS layers found.");
      applyBtn.enabled = plan.length > 0;
    }
    function scan() {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      var found = collectLayers(comp, selectedOnly.value);
      state.plan = buildPlan(found.layers, currentStyle(), currentDirection(), currentShot());
      refreshList(state.plan, found.ignored, comp.name);
    }
    function apply() {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      if (!state.plan.length) scan();
      if (!state.plan.length) { alert("No layers matched. Rename to Title, Card 1, CTA, Logo…"); return; }
      app.beginUndoGroup("Evotechly Motion OS");
      var applied = 0, missing = [], i, layer, guides = 0;
      for (i = 0; i < state.plan.length; i++) {
        layer = findLayer(comp, state.plan[i].name);
        if (!layer) { missing.push(state.plan[i].name); continue; }
        applySpec(layer, state.plan[i]); applied += 1;
      }
      if (currentShot() === "logoLockup" && state.plan._lockup) {
        guides = applyLockupGuides(comp, state.plan._lockup);
      }
      app.endUndoGroup();
      var msg = "Applied SaaS motion to " + applied + " layer(s).";
      if (guides) msg += "\nLockup guides: " + guides + " (EVO_SKIP, not keyed).";
      if (missing.length) msg += "\n\nMissing:\n- " + missing.join("\n- ");
      alert(msg);
    }
    scanBtn.onClick = scan; applyBtn.onClick = apply;
    styleList.onChange = function () { if (state.plan.length) scan(); };
    dirList.onChange = function () { if (state.plan.length) scan(); };
    shotList.onChange = function () { if (state.plan.length) scan(); };
    selectedOnly.onClick = function () { if (state.plan.length) scan(); };
    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); } else { win.layout.layout(true); win.layout.resize(); }
  }
  buildUI(thisObj);
})(this);
