#target aftereffects
/*
  Evotechly Motion OS v0.7 Editor Kit
  Scripts/ScriptUI Panels → Window > Evotechly Motion OS
  Motion | Polish | Person | Captions | Recipes. No Node. No third-party binaries.
*/
(function (thisObj) {
  var ROLE_ORDER = ["logo","eyebrow","title","subtitle","nav","sidebar","dashboard","screenshot","image","card","metric","badge","tooltip","button","cta","cursor","modal","toast","row","stack","caption"];
  var ALIASES = [
    { role: "caption", match: ["caption", "burn-in", "lower third"] },
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
    uiToast:    { duration: 0.36, easing: "easeOut",   from: { o: 0, x: 0, y:-14, s: 98  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    hookSlam:   { duration: 0.28, easing: "easeOut",   from: { o: 0, x: 0, y: 22, s: 86  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    typeBuild:  { duration: 0.32, easing: "easeOut",   from: { o: 0, x: 0, y: 14, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    punchIn:    { duration: 0.70, easing: "easeInOut", from: { o: 0, x: 0, y: 0,  s: 112 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    captionIn:  { duration: 0.28, easing: "easeOut",   from: { o: 0, x: 0, y: 10, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } }
  };
  function R(p, b, s, sc, a) { return { preset: p, base: b, stagger: s, durationScale: sc, after: a || null }; }
  function ui() { return { modal: R("uiModal", 0.2, 0, 1), toast: R("uiToast", 0.52, 0.04, 0.9), row: R("uiRow", 0.22, 0.05, 1), stack: R("uiStack", 0.22, 0.05, 1), caption: R("captionIn", 0.1, 0.08, 0.85) }; }
  function mix(roles) { var e = ui(), k; for (k in e) if (e.hasOwnProperty(k) && !roles[k]) roles[k] = e[k]; return roles; }
  var STYLES = {
    stripe: { id: "stripe", gap: 0.12, travel: 1, roles: mix({ logo: R("fadeUp",0,0,0.9), eyebrow: R("fadeUp",0.02,0,0.85), title: R("fadeUp",0.06,0,1), subtitle: R("fadeUpSoft",0.14,0,1), nav: R("uiNav",0.08,0.03,0.8), sidebar: R("slideRight",0.12,0,1), dashboard: R("slideUp",0.18,0,1), screenshot: R("zoomOut",0.16,0,1), image: R("zoomOut",0.16,0.08,1), card: R("scaleIn",0.28,0.07,1), metric: R("slideUp",0.34,0.05,0.9), badge: R("pop",0.4,0.04,0.8), tooltip: R("fadeUpSoft",0.48,0.04,0.75), button: R("scaleIn",0.5,0.04,0.84), cta: R("pop",null,0,0.8,"group"), cursor: R("cursorIn",null,0,1,"cta") }) },
    linear: { id: "linear", gap: 0.1, travel: 0.88, roles: mix({ logo: R("fadeUp",0,0,0.9), eyebrow: R("fadeUp",0,0,0.8), title: R("slideUp",0.04,0,0.95), subtitle: R("fadeUpSoft",0.12,0,1), nav: R("uiNav",0.06,0.03,0.8), sidebar: R("slideRight",0.1,0,1), dashboard: R("fadeUp",0.16,0,1.1), screenshot: R("zoomOut",0.14,0,1.05), image: R("zoomOut",0.14,0.08,1), card: R("fadeUp",0.24,0.06,1), metric: R("fadeUp",0.3,0.05,0.9), badge: R("pop",0.36,0.04,0.75), tooltip: R("fadeUpSoft",0.44,0.04,0.75), button: R("scaleIn",0.46,0.04,0.84), cta: R("scaleIn",null,0,0.8,"group"), cursor: R("cursorIn",null,0,1,"cta") }) },
    vercel: { id: "vercel", gap: 0.08, travel: 0.72, roles: mix({ logo: R("fadeUp",0,0,0.75), eyebrow: R("fadeUp",0,0,0.7), title: R("fadeUp",0.04,0,0.85), subtitle: R("fadeUpSoft",0.1,0,0.9), nav: R("uiNav",0.04,0.02,0.7), sidebar: R("slideRight",0.08,0,0.85), dashboard: R("scaleIn",0.12,0,0.9), screenshot: R("zoomOut",0.1,0,0.85), image: R("zoomOut",0.1,0.06,0.85), card: R("scaleIn",0.2,0.05,0.9), metric: R("slideUp",0.24,0.04,0.8), badge: R("pop",0.3,0.03,0.7), tooltip: R("fadeUpSoft",0.36,0.03,0.7), button: R("pop",0.38,0.03,0.75), cta: R("pop",null,0,0.72,"group"), cursor: R("cursorIn",null,0,0.9,"cta") }) },
    evotechly: { id: "evotechly", gap: 0.16, travel: 0.62, roles: mix({ logo: R("fadeUpSoft",0,0,0.85), eyebrow: R("fadeUpSoft",0.03,0,0.8), title: R("fadeUpSoft",0.08,0,0.92), subtitle: R("fadeUpSoft",0.16,0,0.95), nav: R("uiNav",0.05,0.03,0.8), sidebar: R("slideRight",0.1,0,0.9), dashboard: R("uiCard",0.14,0,0.95), screenshot: R("zoomOut",0.12,0,0.92), image: R("zoomOut",0.12,0.06,0.92), card: R("uiCard",0.24,0.05,0.95), metric: R("fadeUpSoft",0.3,0.04,0.85), badge: R("fadeUpSoft",0.36,0.03,0.8), tooltip: R("fadeUpSoft",0.42,0.03,0.75), button: R("uiCard",0.46,0.03,0.84), cta: R("uiCard",null,0,0.95,"group"), cursor: R("cursorIn",null,0,0.95,"cta") }) },
    apple: { id: "apple", gap: 0.22, travel: 0.38, roles: mix({ logo: R("fadeUpCalm",0,0,1.05), eyebrow: R("fadeUpCalm",0.06,0,1), title: R("fadeUpCalm",0.1,0,1.2), subtitle: R("fadeUpCalm",0.2,0,1.18), nav: R("uiNav",0.08,0.05,1.1), sidebar: R("fadeUpCalm",0.12,0,1.15), dashboard: R("fadeUpCalm",0.18,0,1.2), screenshot: R("fadeUpCalm",0.16,0,1.25), image: R("fadeUpCalm",0.16,0.08,1.2), card: R("fadeUpCalm",0.3,0.1,1.15), metric: R("fadeUpCalm",0.4,0.08,1.1), badge: R("fadeUpSoft",0.48,0.06,1), tooltip: R("fadeUpCalm",0.54,0.05,0.95), button: R("fadeUpCalm",0.56,0.05,1.05), cta: R("fadeUpCalm",null,0,1.1,"group"), cursor: R("cursorIn",null,0,1.15,"cta") }) }
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
    if (shot !== "logoLockup" && shot !== "logoSting") { plan._lockup = null; return plan; }
    var pins = pinSet(findLockupPart(plan, "mark"), findLockupPart(plan, "type"));
    var sting = shot === "logoSting";
    var markN = 0, typeN = 0, i, part;
    for (i = 0; i < plan.length; i++) {
      part = lockupPart(plan[i]);
      if (part === "mark") { plan[i].delay = round4((sting ? 0 : 0.02) + markN * (sting ? 0.03 : 0.05)); plan[i].lockupPart = "mark"; markN += 1; }
      else if (part === "type") { plan[i].delay = round4((sting ? 0.08 : 0.16) + typeN * (sting ? 0.05 : 0.08)); plan[i].lockupPart = "type"; typeN += 1; }
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
      if (style.travel && style.travel !== 1) {
        poses.from = { o: poses.from.o, x: round4(poses.from.x * style.travel), y: round4(poses.from.y * style.travel), s: poses.from.s };
      }
      delay = rule.base == null ? 0 : rule.base + sibling * rule.stagger;
      plan.push({ name: item.name, role: role, preset: rule.preset, after: rule.after, direction: direction, delay: round4(delay), duration: round4(preset.duration * rule.durationScale), easing: preset.easing, from: poses.from, to: poses.to, both: poses.both, hold: 0 });
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
    applyReelShot(plan, shot, direction);
    return applyLockupShot(plan, shot);
  }
  function applyReelShot(plan, shot, direction) {
    var i, p, reel = shot === "hook" || shot === "kineticType" || shot === "uiPunchIn" || shot === "logoSting" || shot === "captions";
    if (shot === "hook") {
      for (i = 0; i < plan.length; i++) {
        p = plan[i]; p.delay = round4(p.delay * 0.35); p.duration = round4(p.duration * 0.55);
        if (p.role === "title" || p.role === "eyebrow") { p.preset = "hookSlam"; p.from = PRESETS.hookSlam.from; p.to = PRESETS.hookSlam.to; }
      }
    }
    if (shot === "kineticType") {
      var types = [];
      for (i = 0; i < plan.length; i++) {
        p = plan[i];
        if (p.role === "eyebrow" || p.role === "title" || p.role === "subtitle" || p.role === "caption") types.push(p);
      }
      for (i = 0; i < types.length; i++) {
        types[i].delay = round4(0.02 + i * 0.07);
        types[i].preset = "typeBuild";
        types[i].from = PRESETS.typeBuild.from;
        types[i].to = PRESETS.typeBuild.to;
        types[i].duration = Math.min(types[i].duration, 0.36);
      }
    }
    if (shot === "uiPunchIn") {
      for (i = 0; i < plan.length; i++) {
        p = plan[i];
        if (p.role === "screenshot" || p.role === "dashboard" || p.role === "image") { p.preset = "punchIn"; p.from = PRESETS.punchIn.from; p.to = PRESETS.punchIn.to; p.delay = 0.04; }
      }
    }
    if (shot === "captions") {
      var n = 0;
      for (i = 0; i < plan.length; i++) {
        p = plan[i];
        if (p.role === "caption" || p.role === "subtitle" || p.role === "title") { p.delay = round4(0.04 + n * 0.1); p.preset = "captionIn"; n += 1; }
      }
    }
    if (reel && direction === "both") {
      for (i = 0; i < plan.length; i++) plan[i].hold = shot === "hook" ? 0.12 : 0.22;
    }
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
    if (spec.both) setPose(pos, sc, op, current, is3d, t1 + (spec.hold || 0) + spec.duration, spec.from, kind);
  }
  function selectedLayers(comp) {
    var out = [], i;
    if (!comp) return out;
    for (i = 1; i <= comp.numLayers; i++) if (comp.layer(i).selected) out.push(comp.layer(i));
    return out;
  }
  function requireComp() {
    var comp = activeComp();
    if (!comp) { alert("Open a composition first."); return null; }
    return comp;
  }
  function requireSelected(comp) {
    var layers = selectedLayers(comp);
    if (!layers.length) { alert("Select one or more layers."); return null; }
    return layers;
  }
  function easeInfluences(kind) {
    if (kind === "soft") return { i: 40, o: 40 };
    return { i: 80, o: 18 };
  }
  function applyEaseToProp(prop, kind) {
    if (!prop || !prop.numKeys) return 0;
    var inf = easeInfluences(kind), n = 1, t, k, ins, outs, j, applied = 0;
    try { t = prop.propertyValueType; } catch (e) { return 0; }
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
        applied += 1;
      } catch (err) {}
    }
    return applied;
  }
  function polishEase(kind) {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var i, layer, tg, names, p, n, count = 0;
    names = ["ADBE Position", "ADBE Scale", "ADBE Opacity", "ADBE Rotate Z"];
    app.beginUndoGroup("Evotechly " + (kind === "soft" ? "Soft Ease" : "Apple Ease"));
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      try { tg = layer.property("ADBE Transform Group"); } catch (e) { tg = null; }
      if (!tg) continue;
      for (n = 0; n < names.length; n++) {
        p = tg.property(names[n]);
        count += applyEaseToProp(p, kind);
      }
    }
    app.endUndoGroup();
    alert((kind === "soft" ? "Soft Ease" : "Apple Ease") + " on " + count + " key(s).");
  }
  function polishSpring() {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var expr = "freq=8;damp=0.7;n=0;if(numKeys>0){n=nearestKey(time).index;if(key(n).time>time)n--;}if(n>0){t=time-key(n).time;v=velocityAtTime(key(n).time-thisComp.frameDuration);value+v*(Math.sin(freq*t*2*Math.PI)/Math.exp(damp*t))/freq;}else value;";
    var i, pos, added = 0;
    app.beginUndoGroup("Evotechly Spring");
    for (i = 0; i < layers.length; i++) {
      try {
        pos = layers[i].property("ADBE Transform Group").property("ADBE Position");
        pos.expression = expr;
        added += 1;
      } catch (e) {}
    }
    app.endUndoGroup();
    alert("Spring expression on Position for " + added + " layer(s).");
  }
  function polishTextIn() {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var i, layer, pos, op, t0, t1, cur, is3d, p0, kind = "easeOut", count = 0;
    app.beginUndoGroup("Evotechly Apple Text In");
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      try {
        pos = layer.property("ADBE Transform Group").property("ADBE Position");
        op = layer.property("ADBE Transform Group").property("ADBE Opacity");
        t0 = comp.time; t1 = t0 + 0.42; cur = pos.value; is3d = cur.length > 2;
        p0 = [cur[0], cur[1] + 8]; if (is3d) p0.push(cur[2]);
        op.setValueAtTime(t0, 0); applyEase(op, op.nearestKeyIndex(t0), kind);
        op.setValueAtTime(t1, 100); applyEase(op, op.nearestKeyIndex(t1), kind);
        pos.setValueAtTime(t0, p0); applyEase(pos, pos.nearestKeyIndex(t0), kind);
        pos.setValueAtTime(t1, cur); applyEase(pos, pos.nearestKeyIndex(t1), kind);
        applyEaseToProp(pos, "apple"); applyEaseToProp(op, "apple");
        count += 1;
      } catch (e) {}
    }
    app.endUndoGroup();
    alert("Apple Text In on " + count + " layer(s).");
  }
  function polishTypewriter() {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var i, layer, td, src, expr, caret, count = 0;
    app.beginUndoGroup("Evotechly Typewriter");
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      try {
        td = layer.property("ADBE Text Properties");
        if (!td) continue;
        src = layer.text.sourceText.value;
        if (src && src.text !== undefined) src = src.text;
        src = String(src || layer.name);
        src = src.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
        expr = "var full=\"" + src + "\";var cps=18;var n=Math.floor((time-inPoint)*cps);if(n<0)n=0;if(n>full.length)n=full.length;full.substr(0,n);";
        layer.text.sourceText.expression = expr;
        caret = comp.layers.addText("|");
        caret.name = layer.name + " caret";
        caret.startTime = layer.startTime;
        caret.inPoint = layer.inPoint;
        caret.outPoint = layer.outPoint;
        caret.transform.position.setValue(layer.transform.position.value);
        caret.transform.opacity.expression = "Math.sin(time*14)>0?100:0;";
        count += 1;
      } catch (e) {}
    }
    app.endUndoGroup();
    alert("Typewriter + caret on " + count + " text layer(s).");
  }
  function polishCursor() {
    var comp = requireComp(); if (!comp) return;
    var shape, group, rect, fill;
    app.beginUndoGroup("Evotechly Add Cursor");
    shape = comp.layers.addShape();
    shape.name = "Cursor";
    group = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    group.name = "pointer";
    rect = group.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Rect");
    rect.property("ADBE Vector Rect Size").setValue([18, 24]);
    fill = group.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue([1, 1, 1]);
    shape.transform.position.setValue([comp.width * 0.62, comp.height * 0.58]);
    app.endUndoGroup();
    alert("Cursor shape added. Scan will pick it up as role cursor.");
  }
  function polishSquash() {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var i, sc, t0, v, dip, rec, count = 0;
    app.beginUndoGroup("Evotechly Click squash");
    for (i = 0; i < layers.length; i++) {
      try {
        sc = layers[i].property("ADBE Transform Group").property("ADBE Scale");
        t0 = comp.time; v = sc.value;
        dip = t0 + 0.06; rec = t0 + 0.16;
        sc.setValueAtTime(t0, v);
        sc.setValueAtTime(dip, [v[0] * 0.88, v[1] * 1.06].concat(v.length > 2 ? [v[2]] : []));
        sc.setValueAtTime(rec, v);
        applyEaseToProp(sc, "apple");
        count += 1;
      } catch (e) {}
    }
    app.endUndoGroup();
    alert("Click squash on " + count + " layer(s).");
  }
  function polishRipple() {
    var comp = requireComp(); if (!comp) return;
    var shape, el, st, t0;
    app.beginUndoGroup("Evotechly Click ripple");
    shape = comp.layers.addShape();
    shape.name = "Click ripple";
    el = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    el.name = "ring";
    st = el.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
    st.property("ADBE Vector Ellipse Size").setValue([24, 24]);
    el.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Color").setValue([1, 1, 1]);
    t0 = comp.time;
    shape.transform.position.setValue([comp.width / 2, comp.height / 2]);
    shape.transform.scale.setValueAtTime(t0, [20, 20]);
    shape.transform.scale.setValueAtTime(t0 + 0.4, [160, 160]);
    shape.transform.opacity.setValueAtTime(t0, 80);
    shape.transform.opacity.setValueAtTime(t0 + 0.4, 0);
    applyEaseToProp(shape.transform.scale, "soft");
    app.endUndoGroup();
    alert("Click ripple added at playhead.");
  }
  function polishWet() {
    var comp = requireComp(); if (!comp) return;
    var adj, fx;
    app.beginUndoGroup("Evotechly Wet look");
    adj = comp.layers.addSolid([0, 0, 0], "Wet look", comp.width, comp.height, 1);
    adj.adjustmentLayer = true;
    adj.name = "Wet look (hooks & logo sting only)";
    try {
      fx = adj.property("ADBE Effect Parade").addProperty("ADBE Glo2");
      if (fx) {
        try { fx.property("ADBE Glo2-0002").setValue(40); } catch (e1) {}
        try { fx.property("ADBE Glo2-0003").setValue(0.35); } catch (e2) {}
      }
    } catch (e3) {}
    try { adj.property("ADBE Effect Parade").addProperty("ADBE Noise"); } catch (e4) {}
    app.endUndoGroup();
    alert("Wet look adj layer (Glow + Noise). Use on hooks and logo sting only. Off talking-head.");
  }
  function tryEffect(layer, names) {
    var i, fx;
    for (i = 0; i < names.length; i++) {
      try {
        fx = layer.property("ADBE Effect Parade").addProperty(names[i]);
        if (fx) return fx;
      } catch (e) {}
    }
    return null;
  }
  function personCutout() {
    var comp = requireComp(); if (!comp) return;
    var layers = selectedLayers(comp);
    var src = layers.length ? layers[0] : null;
    var copy;
    app.beginUndoGroup("Evotechly Cutout Prep");
    if (src) {
      copy = src.duplicate();
      copy.name = "CUTOUT";
      copy.moveToBeginning();
      try { copy.comment = "Roto Brush 3: paint / refine / freeze / pre-render ProRes 4444+Alpha"; } catch (e) {}
    }
    app.endUndoGroup();
    alert("Cutout Prep\n\n1. Work on CUTOUT (duplicated selection, or rename talent CUTOUT).\n2. Roto Brush 3: paint foreground.\n3. Refine Edge, then Freeze.\n4. Pre-render ProRes 4444 + Alpha.\n\nThe panel does not paint Roto strokes.");
  }
  function personKeylight() {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var i, fx, spill, n = 0;
    app.beginUndoGroup("Evotechly Keylight recipe");
    for (i = 0; i < layers.length; i++) {
      fx = tryEffect(layers[i], ["Keylight 906", "VIDEOCOPILOT Keylight", "Keylight"]);
      if (fx) {
        n += 1;
        try { layers[i].comment = "Keylight (1.2): pick Screen Colour. Screen Matte — clip black ~0–15, clip white ~85–100. Then spill."; } catch (e) {}
      }
      spill = tryEffect(layers[i], ["ADBE Advanced Spill Suppressor"]);
    }
    app.endUndoGroup();
    if (!n) alert("Keylight is not available in this AE install. Recipe documented in EDITOR.md.");
    else alert("Keylight recipe on " + n + " layer(s). Pick Screen Colour. Clip the Screen Matte. Spill suppressor added when present.");
  }
  function personLightWrap() {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var src = layers[0], wrap;
    app.beginUndoGroup("Evotechly Light wrap");
    wrap = src.duplicate();
    wrap.name = src.name + " WRAP";
    wrap.moveAfter(src);
    try { wrap.blendingMode = BlendingMode.SCREEN; } catch (e) {}
    try { wrap.opacity.setValue(35); } catch (e2) {}
    tryEffect(wrap, ["ADBE Simple Choker"]);
    tryEffect(wrap, ["ADBE Gaussian Blur 2", "ADBE Fast Blur"]);
    try { wrap.comment = "Light wrap: Simple Choker ~1.2, blur ~12, Screen 35%."; } catch (e3) {}
    app.endUndoGroup();
    alert("Light wrap duplicate above the key. Choker + blur + Screen 35%.");
  }
  function personStack() {
    var comp = requireComp(); if (!comp) return;
    var i, layer, n;
    function bucket(name) {
      n = lower(name);
      if (n.indexOf("cutout") !== -1 || n.indexOf("keyed") !== -1 || n.indexOf("talent") !== -1) return "cutout";
      if (n.indexOf("caption") !== -1 || n.indexOf("lower") !== -1 || n.indexOf("burn") !== -1) return "caption";
      if (n.indexOf("screenshot") !== -1 || n.indexOf("ui") !== -1 || n.indexOf("card") !== -1 || n.indexOf("title") !== -1 || n.indexOf("cta") !== -1) return "product";
      if (n.indexOf("bg") !== -1 || n.indexOf("plate") !== -1 || n.indexOf("background") !== -1) return "bg";
      return null;
    }
    app.beginUndoGroup("Evotechly talking-head stack");
    var groups = { cutout: [], caption: [], product: [], bg: [] };
    for (i = 1; i <= comp.numLayers; i++) {
      layer = comp.layer(i);
      n = bucket(layer.name);
      if (n) groups[n].push(layer);
    }
    var stack = groups.cutout.concat(groups.caption).concat(groups.product).concat(groups.bg);
    for (i = stack.length - 1; i >= 0; i--) {
      try { stack[i].moveToBeginning(); } catch (e) {}
    }
    app.endUndoGroup();
    alert("Talking-head stack (top → bottom):\nCUTOUT | keyed\nCaptions\nProduct UI / L3\nBG\n\nWet / Saber / QCA off by default on talking-head.");
  }
  function captionSafeY(comp, yNorm, frame) {
    var top = frame === "wide169" ? 0.08 : 0.12;
    var bot = frame === "wide169" ? 0.10 : 0.14;
    var y = yNorm;
    if (y < top) y = top;
    if (y > 1 - bot) y = 1 - bot;
    return [comp.width / 2, comp.height * y];
  }
  function addCaptionLayer(comp, name, text, yNorm, size, dur) {
    var layer = comp.layers.addText(text);
    layer.name = name;
    try {
      var doc = layer.property("ADBE Text Properties").property("ADBE Text Document").value;
      doc.fontSize = size;
      doc.justification = ParagraphJustification.CENTER_JUSTIFY;
      layer.property("ADBE Text Properties").property("ADBE Text Document").setValue(doc);
    } catch (e) {}
    layer.transform.position.setValue(captionSafeY(comp, yNorm, "reel916"));
    layer.startTime = comp.time;
    layer.inPoint = comp.time;
    layer.outPoint = comp.time + dur;
    return layer;
  }
  function applyCaptionTemplate(which, arTop) {
    var comp = requireComp(); if (!comp) return;
    var w = Math.min(comp.width, comp.height);
    var size = Math.round(w * 0.045);
    app.beginUndoGroup("Evotechly caption template");
    if (which === "hook") {
      addCaptionLayer(comp, "Caption Hook", "Hook line", 0.42, Math.round(size * 1.35), 1);
    } else if (which === "kinetic") {
      addCaptionLayer(comp, "Caption 1", "Word one", 0.58, size, 2.2);
      addCaptionLayer(comp, "Caption 2", "Word two", 0.66, size, 2.2).startTime = comp.time + 0.08;
    } else if (which === "stackArEn") {
      var ar = addCaptionLayer(comp, "Caption AR", "العنوان بالعربية", arTop ? 0.70 : 0.78, size, 3);
      var en = addCaptionLayer(comp, "Caption EN", "English line", arTop ? 0.78 : 0.70, Math.round(size * 0.82), 3);
      try { ar.comment = "RTL: set Paragraph direction in AE. Live text, no bitmap."; } catch (e) {}
      try { en.comment = "EN stack pair"; } catch (e2) {}
    } else if (which === "lowerThird") {
      var nameL = addCaptionLayer(comp, "Caption Name", "Name / الاسم", 0.80, Math.round(size * 0.72), 4);
      addCaptionLayer(comp, "Caption Title", "Title / المسمى", 0.86, Math.round(size * 0.58), 4);
      try { nameL.transform.position.setValue([comp.width * 0.12, comp.height * 0.80]); } catch (e3) {}
    } else {
      addCaptionLayer(comp, "Caption", "Subtitle line", 0.86, Math.round(size * 0.78), 2.4);
    }
    app.endUndoGroup();
    alert("Caption template applied as live AE text. Style with Captions shot + Evotechly / Calm if needed.");
  }
  function parseSrtText(raw) {
    var src = String(raw || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var blocks = src.split("\n\n"), cues = [], i, lines, idx, times, start, end, body;
    function toSec(token) {
      var p = String(token || "").trim().replace(",", ".").split(":");
      if (p.length < 3) return 0;
      return Math.round((Number(p[0]) * 3600 + Number(p[1]) * 60 + Number(p[2])) * 1000) / 1000;
    }
    for (i = 0; i < blocks.length; i++) {
      lines = blocks[i].split("\n");
      var clean = [], j;
      for (j = 0; j < lines.length; j++) if (lines[j].length) clean.push(lines[j]);
      if (!clean.length) continue;
      idx = /^\d+$/.test(clean[0]) ? 1 : 0;
      if (!clean[idx] || clean[idx].indexOf("-->") === -1) continue;
      times = clean[idx].split("-->");
      start = toSec(times[0]); end = toSec(times[1]);
      body = clean.slice(idx + 1).join("\n");
      if (!body) continue;
      cues.push({ start: start, end: end, text: body });
    }
    return cues;
  }
  function importSrt() {
    var comp = requireComp(); if (!comp) return;
    var f = File.openDialog("Import SRT (basic SubRip)", "SRT:*.srt");
    if (!f) return;
    f.open("r");
    var raw = f.read();
    f.close();
    var cues = parseSrtText(raw), i, layer, size;
    if (!cues.length) { alert("No cues. Basic SRT only: index, timecode, text."); return; }
    size = Math.round(Math.min(comp.width, comp.height) * 0.035);
    app.beginUndoGroup("Evotechly Import SRT");
    for (i = 0; i < cues.length; i++) {
      layer = addCaptionLayer(comp, "Caption " + (i + 1), cues[i].text, 0.86, size, Math.max(0.2, cues[i].end - cues[i].start));
      layer.startTime = 0;
      layer.inPoint = cues[i].start;
      layer.outPoint = cues[i].end;
    }
    app.endUndoGroup();
    alert("Imported " + cues.length + " cue(s) as live text. Nested/ASS/styled SRT is not parsed.");
  }
  function captionSafeGuides() {
    var comp = requireComp(); if (!comp) return;
    var g, yTop = comp.height * 0.12, yBot = comp.height * 0.86, xPad = comp.width * 0.08;
    app.beginUndoGroup("Evotechly caption safe");
    function pin(id, x, y) {
      g = comp.layers.addNull();
      g.name = "EVO_SKIP_SAFE_" + id;
      try { g.guideLayer = true; } catch (e) {}
      try { g.shy = true; } catch (e2) {}
      g.transform.position.setValue([x, y]);
    }
    pin("TOP", comp.width / 2, yTop);
    pin("BOT", comp.width / 2, yBot);
    pin("L", xPad, comp.height / 2);
    pin("R", comp.width - xPad, comp.height / 2);
    app.endUndoGroup();
    alert("9:16 caption safe guides (EVO_SKIP). Top 12% / bottom 14% / side 8%.");
  }
  function kpiCountUp() {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var i, layer, fx, n = 0, expr;
    expr = "var t=effect(\"Target\")(\"Slider\");var d=1.4;var u=time-inPoint;if(u<0)u=0;if(u>d)u=d;Math.floor(t*u/d);";
    app.beginUndoGroup("Evotechly KPI count-up");
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      try {
        if (!layer.property("ADBE Text Properties")) continue;
        fx = tryEffect(layer, ["ADBE Slider Control"]);
        if (fx) {
          try { fx.name = "Target"; } catch (e) {}
          try { fx.property("ADBE Slider Control-0001").setValue(100); } catch (e2) {}
        }
        layer.text.sourceText.expression = expr;
        n += 1;
      } catch (err) {}
    }
    app.endUndoGroup();
    if (!n) alert("Select a text layer (KPI / metric).");
    else alert("KPI count-up on " + n + " layer(s). Set the Target slider.");
  }
  function recipeFounderGs() {
    personKeylight();
    alert("Founder GS path: Keylight on the plate. Talking-head: Wet/Saber/QCA off.");
  }
  function recipeFounderRoto() {
    personCutout();
  }
  function recipeErp() {
    var comp = requireComp(); if (!comp) return;
    polishCursor();
    alert("ERP demo: Fit footage on the recording, Add Cursor, Apple Ease the click, Scan → Apply (no Saber).");
  }
  function recipeHook15() {
    alert("15s hook reminders — official sites only, not bundled:\n\nSaber — videocopilot.net/products/saber\nQCA3 — aescripts.com/quick-chromatic-aberration\nDisplacer Pro — aescripts.com/displacer-pro\n\nOptional: Wet look (native) + Logo sting shot.\nTalking-head stays clean.");
  }
  function recipeFeatureCard() {
    var comp = requireComp(); if (!comp) return;
    var w = Math.min(comp.width, comp.height), s;
    app.beginUndoGroup("Evotechly Feature card");
    s = comp.layers.addShape();
    s.name = "Card Icon";
    s.transform.position.setValue([comp.width / 2, comp.height * 0.38]);
    addCaptionLayer(comp, "Title AR", "ميزة المنتج", 0.52, Math.round(w * 0.04), 3);
    var kpi = addCaptionLayer(comp, "Metric KPI", "0", 0.62, Math.round(w * 0.06), 3);
    app.endUndoGroup();
    try { kpi.selected = true; } catch (e) {}
    alert("Feature card: icon + Arabic title + KPI layer. Select KPI → count-up.");
  }
  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Evotechly Motion OS", undefined, { resizeable: true });
    win.orientation = "column"; win.alignChildren = ["fill", "top"]; win.spacing = 6; win.margins = 10;
    win.add("statictext", undefined, "EVOTECHLY MOTION OS  ·  v0.7 Editor Kit");
    var tabs = win.add("tabbedpanel");
    tabs.alignChildren = ["fill", "fill"];
    tabs.alignment = ["fill", "fill"];
    var tabMotion = tabs.add("tab", undefined, "Motion");
    var tabPolish = tabs.add("tab", undefined, "Polish");
    var tabPerson = tabs.add("tab", undefined, "Person");
    var tabCaptions = tabs.add("tab", undefined, "Captions");
    var tabRecipes = tabs.add("tab", undefined, "Recipes");
    tabMotion.orientation = "column"; tabMotion.alignChildren = ["fill", "top"]; tabMotion.spacing = 6;
    tabPolish.orientation = "column"; tabPolish.alignChildren = ["fill", "top"]; tabPolish.spacing = 6;
    tabPerson.orientation = "column"; tabPerson.alignChildren = ["fill", "top"]; tabPerson.spacing = 6;
    tabCaptions.orientation = "column"; tabCaptions.alignChildren = ["fill", "top"]; tabCaptions.spacing = 6;
    tabRecipes.orientation = "column"; tabRecipes.alignChildren = ["fill", "top"]; tabRecipes.spacing = 6;
    var styleRow = tabMotion.add("group"); styleRow.add("statictext", undefined, "Style");
    var styleList = styleRow.add("dropdownlist", undefined, ["Stripe / premium SaaS", "Linear / product-native", "Vercel / sharp reveal", "Evotechly / product-native", "Calm / system"]);
    styleList.selection = 0; styleList.alignment = ["fill", "center"];
    var dirRow = tabMotion.add("group"); dirRow.add("statictext", undefined, "Direction");
    var dirList = dirRow.add("dropdownlist", undefined, ["In", "Out", "Both"]);
    dirList.selection = 0; dirList.alignment = ["fill", "center"];
    var shotRow = tabMotion.add("group"); shotRow.add("statictext", undefined, "Shot");
    var shotList = shotRow.add("dropdownlist", undefined, ["Hero", "Feature row", "Pricing", "Dashboard tour", "Logo lockup", "UI screen", "Hook", "Kinetic type", "UI punch-in", "Logo sting", "Captions"]);
    shotList.selection = 0; shotList.alignment = ["fill", "center"];
    var selectedOnly = tabMotion.add("checkbox", undefined, "Selected layers only"); selectedOnly.value = false;
    var status = tabMotion.add("statictext", undefined, "Open a comp, name layers, then Scan."); status.characters = 36;
    var list = tabMotion.add("listbox", undefined, [], { numberOfColumns: 3, showHeaders: true, columnTitles: ["Layer", "Role", "Time"], columnWidths: [140, 80, 70] });
    list.preferredSize = [320, 180]; list.alignment = ["fill", "fill"];
    var ignoredText = tabMotion.add("statictext", undefined, "", { multiline: true }); ignoredText.preferredSize = [320, 32];
    var buttons = tabMotion.add("group"); buttons.alignment = ["fill", "bottom"];
    var scanBtn = buttons.add("button", undefined, "Scan comp");
    var applyBtn = buttons.add("button", undefined, "Apply motion"); applyBtn.enabled = false;
    var fitBtn = buttons.add("button", undefined, "Fit footage");
    tabMotion.add("statictext", undefined, "Names: Title, Card, CTA, Logo, Caption. Fit footage = cover crop.", { multiline: true });
    var p1 = tabPolish.add("group");
    var appleEaseBtn = p1.add("button", undefined, "Apple Ease");
    var softEaseBtn = p1.add("button", undefined, "Soft Ease");
    var springBtn = p1.add("button", undefined, "Spring");
    var p2 = tabPolish.add("group");
    var textInBtn = p2.add("button", undefined, "Apple Text In");
    var typeBtn = p2.add("button", undefined, "Typewriter");
    var cursorBtn = p2.add("button", undefined, "Add Cursor");
    var p3 = tabPolish.add("group");
    var squashBtn = p3.add("button", undefined, "Click squash");
    var rippleBtn = p3.add("button", undefined, "Click ripple");
    var wetBtn = p3.add("button", undefined, "Wet look");
    tabPolish.add("statictext", undefined, "Wet look = native Glow + grain. Hooks & logo sting only.", { multiline: true });
    tabPerson.add("statictext", undefined, "Talking-head: QCA / Saber / Wet OFF by default.", { multiline: true });
    var cutoutBtn = tabPerson.add("button", undefined, "Cutout Prep");
    var keyBtn = tabPerson.add("button", undefined, "Keylight recipe");
    var wrapBtn = tabPerson.add("button", undefined, "Light wrap");
    var stackBtn = tabPerson.add("button", undefined, "Talking-head stack");
    tabPerson.add("statictext", undefined, "Cutout = Roto Brush 3 prep (paint / refine / freeze / ProRes 4444+Alpha). Keylight ships with AE.", { multiline: true });
    var capRow = tabCaptions.add("group");
    capRow.add("statictext", undefined, "Template");
    var capList = capRow.add("dropdownlist", undefined, ["Hook caption", "Word-by-word / kinetic", "Two-line AR+EN", "Lower-third", "Subs burn-in"]);
    capList.selection = 0; capList.alignment = ["fill", "center"];
    var arTop = tabCaptions.add("checkbox", undefined, "AR on top (else EN on top)"); arTop.value = true;
    var capApply = tabCaptions.add("button", undefined, "Apply Caption Template");
    var srtBtn = tabCaptions.add("button", undefined, "Import SRT");
    var safeBtn = tabCaptions.add("button", undefined, "9:16 caption safe");
    var kpiBtn = tabCaptions.add("button", undefined, "KPI count-up");
    tabCaptions.add("statictext", undefined, "Live AE text only. Arabic stays shapeable. Basic SRT: index + timecode + text.", { multiline: true });
    tabRecipes.add("button", undefined, "Founder GS").onClick = recipeFounderGs;
    tabRecipes.add("button", undefined, "Founder Roto").onClick = recipeFounderRoto;
    tabRecipes.add("button", undefined, "ERP demo").onClick = recipeErp;
    tabRecipes.add("button", undefined, "15s hook reminders").onClick = recipeHook15;
    tabRecipes.add("button", undefined, "Feature card").onClick = recipeFeatureCard;
    tabRecipes.add("statictext", undefined, "ERP demo = screen record + cursor + ease. No Saber.", { multiline: true });
    win.add("statictext", undefined, "Plugins: AC / Saber / QCA3 / Displacer / FX Console — official sites only; hooks only; off talking-head.", { multiline: true });
    var state = { plan: [] };
    var styleIds = ["stripe", "linear", "vercel", "evotechly", "apple"];
    var dirIds = ["in", "out", "both"];
    var shotIds = ["hero", "featureRow", "pricing", "dashboardTour", "logoLockup", "uiScreen", "hook", "kineticType", "uiPunchIn", "logoSting", "captions"];
    var capIds = ["hook", "kinetic", "stackArEn", "lowerThird", "burnIn"];
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
      if ((currentShot() === "logoLockup" || currentShot() === "logoSting") && state.plan._lockup) {
        guides = applyLockupGuides(comp, state.plan._lockup);
      }
      app.endUndoGroup();
      var msg = "Applied SaaS motion to " + applied + " layer(s).";
      if (guides) msg += "\nLockup guides: " + guides + " (EVO_SKIP, not keyed).";
      if (missing.length) msg += "\n\nMissing:\n- " + missing.join("\n- ");
      alert(msg);
    }
    function fitFootage() {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      var layer = null, i, role;
      for (i = 1; i <= comp.numLayers; i++) {
        if (comp.layer(i).selected && isAnimatable(comp.layer(i))) { layer = comp.layer(i); break; }
      }
      if (!layer) {
        for (i = 1; i <= comp.numLayers; i++) {
          role = detectRole(comp.layer(i).name);
          if (role === "screenshot" || role === "image" || role === "dashboard") { layer = comp.layer(i); break; }
        }
      }
      if (!layer) { alert("Select a recording or name a layer Screenshot."); return; }
      try {
        var src = layer.source;
        var sw = src ? src.width : layer.width;
        var sh = src ? src.height : layer.height;
        if (!sw || !sh) { alert("Layer has no footage size."); return; }
        var scale = Math.max(comp.width / sw, comp.height / sh) * 100;
        app.beginUndoGroup("Evotechly Fit footage");
        layer.transform.scale.setValue([scale, scale]);
        layer.transform.position.setValue([comp.width / 2, comp.height / 2]);
        app.endUndoGroup();
        alert("Fit footage: cover crop at " + Math.round(scale) + "% (9:16-safe).");
      } catch (e) { alert("Fit footage failed: " + e.toString()); }
    }
    scanBtn.onClick = scan; applyBtn.onClick = apply; fitBtn.onClick = fitFootage;
    styleList.onChange = function () { if (state.plan.length) scan(); };
    dirList.onChange = function () { if (state.plan.length) scan(); };
    shotList.onChange = function () { if (state.plan.length) scan(); };
    selectedOnly.onClick = function () { if (state.plan.length) scan(); };
    appleEaseBtn.onClick = function () { polishEase("apple"); };
    softEaseBtn.onClick = function () { polishEase("soft"); };
    springBtn.onClick = polishSpring;
    textInBtn.onClick = polishTextIn;
    typeBtn.onClick = polishTypewriter;
    cursorBtn.onClick = polishCursor;
    squashBtn.onClick = polishSquash;
    rippleBtn.onClick = polishRipple;
    wetBtn.onClick = polishWet;
    cutoutBtn.onClick = personCutout;
    keyBtn.onClick = personKeylight;
    wrapBtn.onClick = personLightWrap;
    stackBtn.onClick = personStack;
    capApply.onClick = function () {
      var id = capIds[capList.selection ? capList.selection.index : 0] || "burnIn";
      applyCaptionTemplate(id, arTop.value);
    };
    srtBtn.onClick = importSrt;
    safeBtn.onClick = captionSafeGuides;
    kpiBtn.onClick = kpiCountUp;
    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); } else { win.layout.layout(true); win.layout.resize(); }
  }
  buildUI(thisObj);
})(this);
