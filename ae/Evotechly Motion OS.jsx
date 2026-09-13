#target aftereffects
/*
  Evotechly Motion OS v0.32 Reliability
  P0–P22 + P23 profiler. Feature freeze. Not v2.0.0 — AE soak missing.
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
  var MOTION_TAG = "EVO_MOTION";
  var SPRING_EXPR = "freq=8;damp=0.7;n=0;if(numKeys>0){n=nearestKey(time).index;if(key(n).time>time)n--;}if(n>0){t=time-key(n).time;v=velocityAtTime(key(n).time-thisComp.frameDuration);value+v*(Math.sin(freq*t*2*Math.PI)/Math.exp(damp*t))/freq;}else value;";
  var DEBUG = false;
  function logLine(msg) {
    if (!DEBUG) return;
    try { $.writeln("[MotionOS] " + msg); } catch (e) {}
  }
  function isAnimatable(layer) {
    if (!layer) return false;
    if (layer instanceof CameraLayer || layer instanceof LightLayer) return false;
    try { if (layer.locked) return false; } catch (e0) {}
    try { return layer.property("ADBE Transform Group") !== null; } catch (e) { return false; }
  }
  function activeComp() {
    var comp = app.project ? app.project.activeItem : null;
    return (comp && comp instanceof CompItem) ? comp : null;
  }
  function isSkip(name) {
    var n = lower(name);
    return n.indexOf("evo_skip") !== -1 || n.indexOf("evo_lockup") !== -1 || n.indexOf("evo_master") === 0 || n.indexOf("evo_camera") === 0;
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
    var out = [], ignored = [], i, layer, role, b, locked;
    for (i = 1; i <= comp.numLayers; i++) {
      layer = comp.layer(i);
      if (selectedOnly && !layer.selected) continue;
      if (isSkip(layer.name)) { ignored.push(layer.name); continue; }
      locked = false;
      try { locked = layer.locked === true; } catch (eL) {}
      if (locked) { ignored.push(layer.name + " (locked)"); continue; }
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
    var i, layer, n;
    for (i = comp.numLayers; i >= 1; i--) {
      layer = comp.layer(i);
      n = String(layer.name || "").toUpperCase();
      if (n.indexOf("EVO_SKIP_LOCKUP_") === 0) {
        try { layer.remove(); } catch (e) {}
      }
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
  function readComment(layer) {
    try { return String(layer.comment || ""); } catch (e) { return ""; }
  }
  function writeComment(layer, text) {
    try { layer.comment = text; } catch (e) {}
  }
  function parseMotionTag(comment) {
    var raw = String(comment || ""), idx = raw.indexOf(MOTION_TAG + "|"), chunk, parts;
    if (idx === -1) return null;
    chunk = raw.slice(idx).split("\n")[0];
    parts = chunk.split("|");
    if (parts.length < 6) return { owned: true };
    return {
      owned: true,
      px: Number(parts[2]), py: Number(parts[3]),
      sx: Number(parts[4]), sy: Number(parts[5]),
      op: parts[6] != null ? Number(parts[6]) : 100
    };
  }
  function writeMotionTag(prev, rest) {
    var lines = String(prev || "").split("\n"), kept = [], i, tag;
    for (i = 0; i < lines.length; i++) if (lines[i].indexOf(MOTION_TAG + "|") !== 0 && lines[i] !== MOTION_TAG) kept.push(lines[i]);
    tag = MOTION_TAG + "|v0.9|" + rest.px + "|" + rest.py + "|" + rest.sx + "|" + rest.sy + "|" + rest.op;
    if (kept.length && kept[kept.length - 1] === "") kept.pop();
    return (kept.join("\n") ? kept.join("\n") + "\n" : "") + tag;
  }
  function stripMotionTag(prev) {
    var lines = String(prev || "").split("\n"), kept = [], i;
    for (i = 0; i < lines.length; i++) if (lines[i].indexOf(MOTION_TAG) !== 0) kept.push(lines[i]);
    return kept.join("\n");
  }
  function isOurSpring(expr) {
    return String(expr || "").indexOf("freq=8;damp=0.7") !== -1;
  }
  function propKeyCount(prop) {
    try { return prop && prop.numKeys ? prop.numKeys : 0; } catch (e) { return 0; }
  }
  function hasForeignKeys(layer) {
    var tg, pos, sc, op, tag;
    try { tg = layer.property("ADBE Transform Group"); } catch (e) { return false; }
    if (!tg) return false;
    pos = tg.property("ADBE Position");
    sc = tg.property("ADBE Scale");
    op = tg.property("ADBE Opacity");
    tag = parseMotionTag(readComment(layer));
    if (tag && tag.owned) return false;
    return propKeyCount(pos) > 0 || propKeyCount(sc) > 0 || propKeyCount(op) > 0;
  }
  function restFromLayer(layer) {
    var tag = parseMotionTag(readComment(layer)), pos, sc, op, pv, sv;
    if (tag && !isNaN(tag.px) && !isNaN(tag.py)) {
      return { px: tag.px, py: tag.py, sx: tag.sx, sy: tag.sy, op: tag.op };
    }
    pos = layer.property("ADBE Transform Group").property("ADBE Position");
    sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    pv = pos.value; sv = sc.value;
    return { px: pv[0], py: pv[1], sx: sv[0], sy: sv[1], op: op.value };
  }
  function setPoseRest(pos, sc, op, rest, is3d, t, pose, kind) {
    op.setValueAtTime(t, pose.o);
    applyEase(op, op.nearestKeyIndex(t), kind);
    var p = [rest.px + pose.x, rest.py + pose.y];
    if (is3d) {
      try { p.push(pos.value[2]); } catch (e) { p.push(0); }
    }
    pos.setValueAtTime(t, p);
    applyEase(pos, pos.nearestKeyIndex(t), kind);
    var curS = sc.value, s = curS.length === 2 ? [pose.s, pose.s] : [pose.s, pose.s, curS[2]];
    sc.setValueAtTime(t, s);
    applyEase(sc, sc.nearestKeyIndex(t), kind);
  }
  function applySpec(layer, spec) {
    var tg, pos, sc, op, rest, is3d, t0, t1, kind, sep;
    tg = layer.property("ADBE Transform Group");
    if (!tg) throw new Error("Transform unavailable");
    pos = tg.property("ADBE Position");
    sc = tg.property("ADBE Scale");
    op = tg.property("ADBE Opacity");
    if (!pos || !sc || !op) throw new Error("Position/Scale/Opacity unavailable");
    try { sep = pos.dimensionsSeparated === true; } catch (eS) { sep = false; }
    if (sep) throw new Error("Position has separated dimensions");
    rest = restFromLayer(layer);
    is3d = false;
    try { is3d = pos.value.length > 2; } catch (e3) {}
    t0 = spec.delay; t1 = spec.delay + spec.duration; kind = spec.easing || "easeOut";
    if (isOurSpring(pos.expression) || isMasterExpr(pos.expression)) {
      try { pos.expression = ""; } catch (eX) {}
    }
    if (isMasterExpr(sc.expression)) {
      try { sc.expression = ""; } catch (eY) {}
    }
    clearKeys(op); clearKeys(pos); clearKeys(sc);
    setPoseRest(pos, sc, op, rest, is3d, t0, spec.from, kind);
    setPoseRest(pos, sc, op, rest, is3d, t1, spec.to, kind);
    if (spec.both) setPoseRest(pos, sc, op, rest, is3d, t1 + (spec.hold || 0) + spec.duration, spec.from, kind);
    writeComment(layer, writeMotionTag(readComment(layer), rest));
    attachMasterExpr(layer, spec);
  }


  var MASTER_NAME = "EVO_MASTER";
  var TEXT_ROLES = { title:1, subtitle:1, eyebrow:1, caption:1 };
  function isMasterExpr(expr) {
    return String(expr || "").indexOf("// EVO_MASTER") === 0;
  }
  function findMaster(comp) {
    var i, layer;
    if (!comp) return null;
    for (i = 1; i <= comp.numLayers; i++) {
      layer = comp.layer(i);
      if (lower(layer.name) === "evo_master") return layer;
    }
    return null;
  }
  function addNamedSlider(layer, name, value) {
    var fx;
    try {
      fx = layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
      fx.name = name;
      fx.property("ADBE Slider Control-0001").setValue(value);
    } catch (e) {}
    return fx;
  }
  function addNamedBox(layer, name, on) {
    var fx;
    try {
      fx = layer.property("ADBE Effect Parade").addProperty("ADBE Checkbox Control");
      fx.name = name;
      fx.property("ADBE Checkbox Control-0001").setValue(on ? 1 : 0);
    } catch (e) {}
    return fx;
  }
  function masterHasControl(layer, name) {
    try { return layer.property("ADBE Effect Parade").property(name) != null; } catch (e) { return false; }
  }
  function ensureMaster(comp) {
    var layer = findMaster(comp);
    if (layer) return layer;
    layer = comp.layers.addNull();
    layer.name = MASTER_NAME;
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|master|v0.10");
    addNamedSlider(layer, "EVO Motion", 100);
    addNamedSlider(layer, "EVO Speed", 100);
    addNamedSlider(layer, "EVO Travel", 100);
    addNamedSlider(layer, "EVO Stagger", 100);
    addNamedSlider(layer, "EVO Overshoot", 100);
    addNamedSlider(layer, "EVO Spring", 100);
    addNamedSlider(layer, "EVO Text", 100);
    addNamedSlider(layer, "EVO UI", 100);
    addNamedSlider(layer, "EVO Seed", 1);
    addNamedBox(layer, "EVO Reduce", false);
    addNamedBox(layer, "EVO Blur", false);
    addNamedSlider(layer, "EVO Camera", 100);
    addNamedSlider(layer, "EVO Transition", 100);
    addNamedSlider(layer, "EVO SFX", 100);
    try { layer.moveToEnd(); } catch (e3) {}
    logLine("Created EVO_MASTER");
    return layer;
  }
  function readSlider(layer, name, fallback) {
    try { return Number(layer.property("ADBE Effect Parade").property(name).property("ADBE Slider Control-0001").value); } catch (e) { return fallback; }
  }
  function writeSlider(layer, name, value) {
    try { layer.property("ADBE Effect Parade").property(name).property("ADBE Slider Control-0001").setValue(value); } catch (e) {}
  }
  function readBox(layer, name) {
    try { return layer.property("ADBE Effect Parade").property(name).property("ADBE Checkbox Control-0001").value === 1; } catch (e) { return false; }
  }
  function writeBox(layer, name, on) {
    try { layer.property("ADBE Effect Parade").property(name).property("ADBE Checkbox Control-0001").setValue(on ? 1 : 0); } catch (e) {}
  }
  function readMasterValues(layer) {
    if (!layer) return { motion:100, speed:100, travel:100, stagger:100, overshoot:100, spring:100, text:100, ui:100, seed:1, reduce:false, blur:false };
    function clamp(v, lo, hi, d) { v = Number(v); if (isNaN(v)) v = d; if (v < lo) v = lo; if (v > hi) v = hi; return v; }
    return {
      motion: clamp(readSlider(layer, "EVO Motion", 100), 0, 200, 100),
      speed: clamp(readSlider(layer, "EVO Speed", 100), 25, 200, 100),
      travel: clamp(readSlider(layer, "EVO Travel", 100), 0, 200, 100),
      stagger: clamp(readSlider(layer, "EVO Stagger", 100), 0, 200, 100),
      overshoot: clamp(readSlider(layer, "EVO Overshoot", 100), 0, 200, 100),
      spring: clamp(readSlider(layer, "EVO Spring", 100), 0, 200, 100),
      text: clamp(readSlider(layer, "EVO Text", 100), 0, 200, 100),
      ui: clamp(readSlider(layer, "EVO UI", 100), 0, 200, 100),
      seed: Math.round(clamp(readSlider(layer, "EVO Seed", 1), 1, 9999, 1)),
      reduce: readBox(layer, "EVO Reduce"),
      blur: readBox(layer, "EVO Blur")
    };
  }
  function masterPosExpr(role, dir) {
    var ch = TEXT_ROLES[role] ? 1 : 0;
    return "// EVO_MASTER\n" +
      "var L=null;try{L=thisComp.layer(\"" + MASTER_NAME + "\");}catch(e){}\n" +
      "function sl(n,d){try{return L.effect(n)(\"Slider\");}catch(e){return d;}}\n" +
      "function ck(n){try{return L.effect(n)(\"Checkbox\");}catch(e){return 0;}}\n" +
      "var f=(sl(\"EVO Motion\",100)/100)*(sl(\"EVO Travel\",100)/100)*(sl(\"" + (ch ? "EVO Text" : "EVO UI") + "\",100)/100);\n" +
      "if(ck(\"EVO Reduce\")==1)f*=0.25;\n" +
      "if(numKeys<1)value;\n" +
      "var rest=(" + (dir === "out" ? "key(1).value" : "numKeys>=2?key(2).value:value") + ");\n" +
      "rest+(value-rest)*f;";
  }
  function masterScaleExpr(role, dir) {
    var ch = TEXT_ROLES[role] ? 1 : 0;
    return "// EVO_MASTER\n" +
      "var L=null;try{L=thisComp.layer(\"" + MASTER_NAME + "\");}catch(e){}\n" +
      "function sl(n,d){try{return L.effect(n)(\"Slider\");}catch(e){return d;}}\n" +
      "function ck(n){try{return L.effect(n)(\"Checkbox\");}catch(e){return 0;}}\n" +
      "var ov=sl(\"EVO Overshoot\",100)/100*(sl(\"EVO Motion\",100)/100)*(sl(\"" + (ch ? "EVO Text" : "EVO UI") + "\",100)/100);\n" +
      "if(ck(\"EVO Reduce\")==1)ov=0;\n" +
      "if(numKeys<1)value;\n" +
      "var rest=(" + (dir === "out" ? "key(1).value" : "numKeys>=2?key(2).value:value") + ");\n" +
      "rest+(value-rest)*ov;";
  }
  function attachMasterExpr(layer, spec) {
    var pos, sc, dir;
    try {
      pos = layer.property("ADBE Transform Group").property("ADBE Position");
      sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    } catch (e) { return; }
    dir = spec && spec.direction ? spec.direction : "in";
    try {
      if (!pos.expression || isMasterExpr(pos.expression) || isOurSpring(pos.expression)) {
        pos.expression = masterPosExpr(spec.role, dir);
      }
    } catch (eP) {}
    try {
      if (!sc.expression || isMasterExpr(sc.expression)) {
        sc.expression = masterScaleExpr(spec.role, dir);
      }
    } catch (eS) {}
  }
  function clearMasterExpr(layer) {
    var pos, sc;
    try {
      pos = layer.property("ADBE Transform Group").property("ADBE Position");
      if (isMasterExpr(pos.expression)) pos.expression = "";
      sc = layer.property("ADBE Transform Group").property("ADBE Scale");
      if (isMasterExpr(sc.expression)) sc.expression = "";
    } catch (e) {}
  }
  function applyMasterBlur(layer, on) {
    var comment = readComment(layer);
    try {
      if (on) {
        if (layer.motionBlur !== true) {
          layer.motionBlur = true;
          if (comment.indexOf("EVO_MB|1") === -1) writeComment(layer, comment + "\nEVO_MB|1");
        }
      } else if (comment.indexOf("EVO_MB|1") !== -1) {
        layer.motionBlur = false;
        writeComment(layer, comment.replace("\nEVO_MB|1", "").replace("EVO_MB|1", ""));
      }
    } catch (e) {}
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
    var expr = "// EVO_MASTER\nvar spr=100;try{spr=thisComp.layer(\"EVO_MASTER\").effect(\"EVO Spring\")(\"Slider\");}catch(e){}\nif(spr<0)spr=0;if(spr>200)spr=200;var red=0;try{red=thisComp.layer(\"EVO_MASTER\").effect(\"EVO Reduce\")(\"Checkbox\");}catch(e2){}\nif(red==1)spr=0;freq=8*(spr/100);damp=0.7+(1-spr/100)*0.5;n=0;if(numKeys>0){n=nearestKey(time).index;if(key(n).time>time)n--;}if(n>0&&spr>0){t=time-key(n).time;v=velocityAtTime(key(n).time-thisComp.frameDuration);value+v*(Math.sin(freq*t*2*Math.PI)/Math.exp(damp*t))/Math.max(freq,0.01);}else value;";
    var i, pos, added = 0;
    app.beginUndoGroup("Evotechly Spring");
    for (i = 0; i < layers.length; i++) {
      try {
        pos = layers[i].property("ADBE Transform Group").property("ADBE Position");
        if (pos.expression && pos.expression.length && !isOurSpring(pos.expression)) {
          logLine("Spring skipped " + layers[i].name + " — existing expression");
          continue;
        }
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
        if (findLayer(comp, layer.name + " caret")) {
          logLine("Typewriter caret exists for " + layer.name);
        } else {
        caret = comp.layers.addText("|");
        caret.name = layer.name + " caret";
        caret.startTime = layer.startTime;
        caret.inPoint = layer.inPoint;
        caret.outPoint = layer.outPoint;
        caret.transform.position.setValue(layer.transform.position.value);
        caret.transform.opacity.expression = "Math.sin(time*14)>0?100:0;";
        }
        count += 1;
      } catch (e) {}
    }
    app.endUndoGroup();
    alert("Typewriter + caret on " + count + " text layer(s).");
  }
  function polishCursor() {
    var comp = requireComp(); if (!comp) return;
    var existing = findLayer(comp, "Cursor"), shape, group, rect, fill;
    if (existing) { alert("A layer named Cursor already exists. Not adding another."); return; }
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
    var i, existing = false, adj, fx;
    for (i = 1; i <= comp.numLayers; i++) {
      if (lower(comp.layer(i).name).indexOf("wet look") === 0) { existing = true; break; }
    }
    if (existing) { alert("Wet look already in this comp. Hooks & logo sting only — not added again."); return; }
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

  function autoOffset(dir) {
    if (dir === "down") return { x: 0, y: -28, s: 100 };
    if (dir === "left") return { x: 28, y: 0, s: 100 };
    if (dir === "right") return { x: -28, y: 0, s: 100 };
    if (dir === "upLeft") return { x: 20, y: 20, s: 100 };
    if (dir === "upRight") return { x: -20, y: 20, s: 100 };
    if (dir === "downLeft") return { x: 20, y: -20, s: 100 };
    if (dir === "downRight") return { x: -20, y: -20, s: 100 };
    if (dir === "scale") return { x: 0, y: 0, s: 92 };
    return { x: 0, y: 28, s: 100 };
  }
  function autoEaseKind(easing) {
    if (easing === "soft") return "soft";
    if (easing === "expo") return "expo";
    return "apple";
  }
  function applyEaseKindToProp(prop, kind) {
    if (!prop || !prop.numKeys) return;
    var infI = 80, infO = 18, n = 1, t, k, ins, outs, j;
    if (kind === "soft") { infI = 40; infO = 40; }
    if (kind === "expo") { infI = 90; infO = 10; }
    try { t = prop.propertyValueType; } catch (e) { return; }
    if (t === PropertyValueType.TwoD || t === PropertyValueType.TwoD_SPATIAL) n = 2;
    if (t === PropertyValueType.ThreeD || t === PropertyValueType.ThreeD_SPATIAL) n = 3;
    for (k = 1; k <= prop.numKeys; k++) {
      try {
        ins = []; outs = [];
        for (j = 0; j < n; j++) {
          ins.push(new KeyframeEase(0, infI));
          outs.push(new KeyframeEase(0, infO));
        }
        prop.setTemporalEaseAtKey(k, ins, outs);
      } catch (err) {}
    }
  }
  function autoAnimateApply(mode, dir, easing, duration, stagger, sequence) {
    var comp = requireComp(); if (!comp) return;
    var layers = requireSelected(comp); if (!layers) return;
    var list = [], i, layer, y, off, t0, t1, t2, pos, sc, op, current, is3d, from, to, hold;
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      if (!isAnimatable(layer) || isSkip(layer.name) || layer.locked) continue;
      y = layer.transform.position.value[1];
      try { y = layerBounds(comp, layer).y; } catch (e) {}
      list.push({ layer: layer, y: y, index: i });
    }
    if (!list.length) { alert("No animatable selected layers."); return; }
    if (sequence === "topToBottom") list.sort(function (a, b) { return a.y - b.y; });
    else if (sequence === "bottomToTop") list.sort(function (a, b) { return b.y - a.y; });
    off = autoOffset(dir);
    hold = 0.12;
    app.beginUndoGroup("Evotechly Auto-Animate");
    for (i = 0; i < list.length; i++) {
      layer = list[i].layer;
      pos = layer.property("ADBE Transform Group").property("ADBE Position");
      sc = layer.property("ADBE Transform Group").property("ADBE Scale");
      op = layer.property("ADBE Transform Group").property("ADBE Opacity");
      current = pos.value; is3d = current.length > 2;
      t0 = i * stagger;
      t1 = t0 + duration;
      t2 = t1 + hold + duration;
      from = { o: 0, x: off.x, y: off.y, s: off.s };
      to = { o: 100, x: 0, y: 0, s: 100 };
      clearKeys(op); clearKeys(pos); clearKeys(sc);
      if (mode === "out") {
        setPose(pos, sc, op, current, is3d, t0, to, "easeOut");
        setPose(pos, sc, op, current, is3d, t1, from, "easeOut");
      } else if (mode === "both") {
        setPose(pos, sc, op, current, is3d, t0, from, "easeOut");
        setPose(pos, sc, op, current, is3d, t1, to, "easeOut");
        setPose(pos, sc, op, current, is3d, t2, from, "easeOut");
      } else {
        setPose(pos, sc, op, current, is3d, t0, from, "easeOut");
        setPose(pos, sc, op, current, is3d, t1, to, "easeOut");
      }
      applyEaseKindToProp(pos, autoEaseKind(easing));
      applyEaseKindToProp(sc, autoEaseKind(easing));
      applyEaseKindToProp(op, autoEaseKind(easing));
      if (easing === "spring") {
        try {
          pos.expression = "freq=8;damp=0.7;n=0;if(numKeys>0){n=nearestKey(time).index;if(key(n).time>time)n--;}if(n>0){t=time-key(n).time;v=velocityAtTime(key(n).time-thisComp.frameDuration);value+v*(Math.sin(freq*t*2*Math.PI)/Math.exp(damp*t))/freq;}else value;";
        } catch (e) {}
      }
    }
    app.endUndoGroup();
    alert("Auto-Animate (" + mode + ", " + dir + ", " + easing + ") on " + list.length + " layer(s). Keyframe mode. Expression In/Out is v0.9.");
  }

  function intStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_INT_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_INT_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|intstore");
    return layer;
  }
  function readInteractions(comp) {
    var layer = intStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeInteractions(comp, list) {
    var layer = intStoreLayer(comp, true), payload;
    payload = "{list:" + interactionsToJs(list) + "}";
    try { layer.text.sourceText.setValue(payload); } catch (e) {}
  }
  function jsStr(v) {
    return "\"" + String(v == null ? "" : v).replace(/\\/g, "\\\\").replace(/\"/g, "\\\"") + "\"";
  }
  function interactionsToJs(list) {
    var i, it, parts = [];
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",name:" + jsStr(it.name) + ",action:" + jsStr(it.action) + ",recipe:" + jsStr(it.recipe || "") + ",cursor:" + jsStr(it.cursor) + ",target:" + jsStr(it.target) + ",source:" + jsStr(it.source) + ",dest:" + jsStr(it.dest) + ",response:" + jsStr(it.response) + ",toast:" + jsStr(it.toast) + ",metric:" + jsStr(it.metric) + ",path:" + jsStr(it.path || "natural") + ",point:" + jsStr(it.point || "center") + ",ox:" + Number(it.ox || 0) + ",oy:" + Number(it.oy || 0) + ",t0:" + Number(it.t0 || 0) + ",duration:" + Number(it.duration || 0.6) + ",style:" + jsStr(it.style || "evotechly") + "}");
    }
    return "[" + parts.join(",") + "]";
  }
  function nextIntId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_INT_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_INT_" + n;
  }
  function intTag(id) { return "EVO_INT|" + id; }
  function layerHasInt(layer, id) {
    return readComment(layer).indexOf(intTag(id)) !== -1;
  }
  function markIntLayer(layer, id) {
    var c = readComment(layer);
    if (c.indexOf(intTag(id)) === -1) writeComment(layer, c + "\n" + intTag(id));
  }
  function targetPoint(comp, layer, point, ox, oy) {
    var b = layerBounds(comp, layer), x, y;
    x = b.x + b.width / 2; y = b.y + b.height / 2;
    if (point === "topLeft") { x = b.x; y = b.y; }
    else if (point === "topRight") { x = b.x + b.width; y = b.y; }
    else if (point === "bottomLeft") { x = b.x; y = b.y + b.height; }
    else if (point === "bottomRight") { x = b.x + b.width; y = b.y + b.height; }
    return [x + Number(ox || 0), y + Number(oy || 0)];
  }
  function setSpatial(pos, k, kind) {
    try {
      if (kind === "straight") pos.setSpatialTangentsAtKey(k, [0, 0, 0], [0, 0, 0]);
    } catch (e) {}
  }
  function moveCursorTo(cursor, dest, t0, dur, path) {
    var pos = cursor.property("ADBE Transform Group").property("ADBE Position");
    var from = pos.value;
    pos.setValueAtTime(t0, from);
    pos.setValueAtTime(t0 + dur, dest);
    applyEase(pos, pos.nearestKeyIndex(t0), "easeOut");
    applyEase(pos, pos.nearestKeyIndex(t0 + dur), "easeOut");
    if (path !== "straight") {
      try {
        var mid = [(from[0] + dest[0]) / 2 + (path === "snap" ? 0 : 18), (from[1] + dest[1]) / 2 - (path === "natural" ? 12 : 6)];
        pos.setValueAtTime(t0 + dur * 0.5, mid);
        applyEase(pos, pos.nearestKeyIndex(t0 + dur * 0.5), "easeInOut");
      } catch (e) {}
    }
  }
  function keyScalePulse(layer, t0, dur, mid) {
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var v = sc.value, a = v[0], b = v.length > 1 ? v[1] : v[0];
    sc.setValueAtTime(t0, v);
    sc.setValueAtTime(t0 + dur * 0.4, [a * mid / 100, b * mid / 100].concat(v.length > 2 ? [v[2]] : []));
    sc.setValueAtTime(t0 + dur, v);
    applyEaseToProp(sc, "apple");
  }
  function fadeSlide(layer, t0, dur, rise, show) {
    var pos = layer.property("ADBE Transform Group").property("ADBE Position");
    var op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    var rest = pos.value;
    if (show) {
      op.setValueAtTime(t0, 0); op.setValueAtTime(t0 + dur, 100);
      pos.setValueAtTime(t0, [rest[0], rest[1] + rise]); pos.setValueAtTime(t0 + dur, rest);
    } else {
      op.setValueAtTime(t0, 100); op.setValueAtTime(t0 + dur, 0);
      pos.setValueAtTime(t0, rest); pos.setValueAtTime(t0 + dur, [rest[0], rest[1] + rise]);
    }
    applyEaseToProp(op, "apple"); applyEaseToProp(pos, "apple");
  }
  function addCompMarker(comp, t, label) {
    try {
      var m = new MarkerValue(label);
      comp.marker.setValueAtTime(t, m);
    } catch (e) {}
  }
  function ensureRipple(comp, id, pt, t0, dur, scaleMul) {
    var name = "EVO_SKIP_INT_RIP_" + id, layer = findLayer(comp, name), shape, el, st;
    if (layer) {
      try { layer.remove(); } catch (e0) {}
    }
    if (scaleMul <= 0) return null;
    shape = comp.layers.addShape();
    shape.name = name;
    writeComment(shape, MOTION_TAG + "\n" + intTag(id));
    el = shape.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    st = el.property("ADBE Vectors Group").addProperty("ADBE Vector Shape - Ellipse");
    st.property("ADBE Vector Ellipse Size").setValue([24, 24]);
    try { el.property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Color").setValue([1, 1, 1]); } catch (e1) {}
    shape.transform.position.setValue(pt);
    shape.transform.scale.setValueAtTime(t0, [20, 20]);
    shape.transform.scale.setValueAtTime(t0 + dur, [140 * scaleMul, 140 * scaleMul]);
    shape.transform.opacity.setValueAtTime(t0, 70);
    shape.transform.opacity.setValueAtTime(t0 + dur, 0);
    applyEaseToProp(shape.transform.scale, "soft");
    return shape;
  }
  function intStyleTokens(style) {
    if (style === "stripe") return { hover: 102, click: 92, rise: 14, ripple: 1 };
    if (style === "linear") return { hover: 101.5, click: 96, rise: 8, ripple: 0.5 };
    if (style === "vercel") return { hover: 102, click: 93, rise: 8, ripple: 0.8 };
    if (style === "apple") return { hover: 101, click: 98, rise: 4, ripple: 0 };
    return { hover: 102, click: 94, rise: 10, ripple: 0.7 };
  }
  function masterSpeed() {
    var comp = activeComp(), m;
    if (!comp) return 100;
    m = findMaster(comp);
    return m ? readMasterValues(m).speed : 100;
  }
  function masterUI() {
    var comp = activeComp(), m, v;
    if (!comp) return { ui: 1, reduce: false, speed: 100 };
    m = findMaster(comp);
    if (!m) return { ui: 1, reduce: false, speed: 100 };
    v = readMasterValues(m);
    return { ui: v.ui / 100, reduce: v.reduce, speed: v.speed };
  }
  function buildClickLike(comp, it, doubleClick) {
    var cursor = findLayer(comp, it.cursor), target = findLayer(comp, it.target);
    var tok = intStyleTokens(it.style), mv = masterUI();
    var dur = Number(it.duration || 0.6) / (mv.speed / 100);
    var t0 = Number(it.t0 || 0), move = dur * 0.55, pause = dur * 0.08, press = dur * 0.18;
    var dest, clickT, uiClick;
    if (!cursor || !target) throw new Error("Select a Cursor and a Target.");
    dest = targetPoint(comp, target, it.point, it.ox, it.oy);
    moveCursorTo(cursor, dest, t0, move, it.path || "natural");
    markIntLayer(cursor, it.id); markIntLayer(target, it.id);
    clickT = t0 + move + pause;
    uiClick = mv.reduce ? 98 : (100 - (100 - tok.click) * mv.ui);
    keyScalePulse(cursor, clickT, press, mv.reduce ? 96 : tok.click);
    keyScalePulse(target, clickT, press, uiClick);
    ensureRipple(comp, it.id, dest, clickT, Math.max(0.22, press * 1.6), mv.reduce ? 0 : tok.ripple * mv.ui);
    addCompMarker(comp, clickT, "EVO_CLICK " + it.id);
    if (doubleClick) {
      keyScalePulse(cursor, clickT + press + 0.08, press, mv.reduce ? 96 : tok.click);
      keyScalePulse(target, clickT + press + 0.08, press, uiClick);
      addCompMarker(comp, clickT + press + 0.08, "EVO_CLICK " + it.id);
    }
    return clickT + press;
  }
  function buildHover(comp, it) {
    var cursor = findLayer(comp, it.cursor), target = findLayer(comp, it.target);
    var tok = intStyleTokens(it.style), mv = masterUI(), t0 = Number(it.t0 || 0), dur = Number(it.duration || 0.4) / (mv.speed / 100);
    if (!cursor || !target) throw new Error("Select a Cursor and a Target.");
    moveCursorTo(cursor, targetPoint(comp, target, it.point, it.ox, it.oy), t0, dur * 0.7, it.path || "natural");
    keyScalePulse(target, t0 + dur * 0.5, dur * 0.5, mv.reduce ? 100.4 : tok.hover);
    markIntLayer(cursor, it.id); markIntLayer(target, it.id);
  }
  function buildOpenClose(comp, it, show) {
    var end = buildClickLike(comp, it, false);
    var panel = findLayer(comp, it.response);
    var tok = intStyleTokens(it.style), mv = masterUI();
    if (!panel) throw new Error("Select a response layer (modal / drawer).");
    fadeSlide(panel, end, 0.36 / (mv.speed / 100), (mv.reduce ? tok.rise * 0.25 : tok.rise) * (mv.ui), show);
    markIntLayer(panel, it.id);
    addCompMarker(comp, end, (show ? "EVO_OPEN " : "EVO_CLOSE ") + it.id);
  }
  function buildDrag(comp, it) {
    var cursor = findLayer(comp, it.cursor), src = findLayer(comp, it.source || it.target), dst = findLayer(comp, it.dest);
    var mv = masterUI(), t0 = Number(it.t0 || 0), dur = Number(it.duration || 0.9) / (mv.speed / 100);
    var grab, mid, drop, p0, p1;
    if (!cursor || !src || !dst) throw new Error("Select Cursor, Source, and Destination.");
    p0 = targetPoint(comp, src, "center", 0, 0);
    p1 = targetPoint(comp, dst, it.point || "center", it.ox, it.oy);
    grab = dur * 0.25; mid = dur * 0.55; drop = dur * 0.2;
    moveCursorTo(cursor, p0, t0, grab * 0.7, it.path || "natural");
    keyScalePulse(cursor, t0 + grab * 0.7, grab * 0.3, 92);
    moveCursorTo(cursor, p1, t0 + grab, mid, it.path || "natural");
    src.property("ADBE Transform Group").property("ADBE Position").setValueAtTime(t0 + grab, src.property("ADBE Transform Group").property("ADBE Position").value);
    src.property("ADBE Transform Group").property("ADBE Position").setValueAtTime(t0 + grab + mid, p1);
    applyEaseToProp(src.property("ADBE Transform Group").property("ADBE Position"), "apple");
    keyScalePulse(src, t0 + grab + mid, drop, mv.reduce ? 100.5 : 102);
    markIntLayer(cursor, it.id); markIntLayer(src, it.id); markIntLayer(dst, it.id);
    addCompMarker(comp, t0 + grab, "EVO_DRAG_START " + it.id);
    addCompMarker(comp, t0 + grab + mid, "EVO_DRAG_END " + it.id);
    return t0 + grab + mid + drop;
  }
  function buildToast(comp, it, tStart) {
    var toast = findLayer(comp, it.toast || it.response);
    var mv = masterUI(), tok = intStyleTokens(it.style);
    var t0 = tStart != null ? tStart : Number(it.t0 || 0);
    var dur = 0.32 / (mv.speed / 100), hold = 0.7 / (mv.speed / 100);
    if (!toast) throw new Error("Select a Toast layer.");
    fadeSlide(toast, t0, dur, mv.reduce ? 4 : tok.rise, true);
    fadeSlide(toast, t0 + dur + hold, dur, mv.reduce ? 4 : tok.rise, false);
    markIntLayer(toast, it.id);
    addCompMarker(comp, t0, "EVO_TOAST " + it.id);
  }
  function buildMetric(comp, it, tStart) {
    var layer = findLayer(comp, it.metric || it.target);
    var t0 = tStart != null ? tStart : Number(it.t0 || 0);
    var fx, expr;
    if (!layer) throw new Error("Select a Metric text layer.");
    try {
      if (!layer.property("ADBE Text Properties")) throw new Error("Metric must be text.");
      fx = tryEffect(layer, ["ADBE Slider Control"]);
      if (fx) { try { fx.name = "Target"; } catch (e) {} }
      expr = "var t=effect(\"Target\")(\"Slider\");var d=1.2;var u=time-" + t0 + ";if(u<0)u=0;if(u>d)u=d;Math.floor(t*u/d);";
      layer.text.sourceText.expression = expr;
    } catch (e) { throw new Error("Metric update failed on " + layer.name); }
    markIntLayer(layer, it.id);
    addCompMarker(comp, t0, "EVO_METRIC " + it.id);
    keyScalePulse(layer, t0, 0.24, masterUI().reduce ? 100.5 : 104);
  }
  function buildType(comp, it) {
    var layer = findLayer(comp, it.target);
    if (!layer) throw new Error("Select a text layer to type.");
    try { layer.selected = true; } catch (e) {}
    polishTypewriter();
    markIntLayer(layer, it.id);
  }
  function buildScroll(comp, it) {
    var layer = findLayer(comp, it.target);
    var t0 = Number(it.t0 || 0), dur = Number(it.duration || 0.8) / (masterUI().speed / 100);
    var pos, v;
    if (!layer) throw new Error("Select a content layer to scroll.");
    pos = layer.property("ADBE Transform Group").property("ADBE Position");
    v = pos.value;
    pos.setValueAtTime(t0, v);
    pos.setValueAtTime(t0 + dur, [v[0], v[1] - 160]);
    applyEaseToProp(pos, "soft");
    markIntLayer(layer, it.id);
  }
  function buildHighlight(comp, it) {
    var target = findLayer(comp, it.target), name = "EVO_SKIP_INT_HL_" + it.id, box;
    var b, t0 = Number(it.t0 || 0);
    if (!target) throw new Error("Select a target to highlight.");
    box = findLayer(comp, name);
    if (box) try { box.remove(); } catch (e0) {}
    b = layerBounds(comp, target);
    box = comp.layers.addSolid([0.15, 0.45, 1], name, Math.max(8, Math.round(b.width + 16)), Math.max(8, Math.round(b.height + 16)), 1);
    box.name = name;
    writeComment(box, MOTION_TAG + "\n" + intTag(it.id));
    box.transform.position.setValue([b.x + b.width / 2, b.y + b.height / 2]);
    try { box.blendingMode = BlendingMode.SCREEN; } catch (e1) {}
    box.transform.opacity.setValueAtTime(t0, 0);
    box.transform.opacity.setValueAtTime(t0 + 0.2, 35);
    box.transform.opacity.setValueAtTime(t0 + Number(it.duration || 1.2), 0);
  }
  function runInteraction(comp, it) {
    var t;
    if (it.recipe === "openLead" || it.action === "open") { buildOpenClose(comp, it, true); return; }
    if (it.recipe === "logActivity") {
      t = buildClickLike(comp, it, false);
      if (it.response) buildOpenClose(comp, it, true);
      if (it.toast) buildToast(comp, it, t + 0.5);
      return;
    }
    if (it.recipe === "moveDeal" || it.recipe === "dealWon" || it.action === "drag") {
      t = buildDrag(comp, it);
      if (it.toast) buildToast(comp, it, t);
      if (it.recipe === "dealWon" && it.metric) buildMetric(comp, it, t + 0.1);
      return;
    }
    if (it.recipe === "search") { buildClickLike(comp, it, false); if (it.response) buildOpenClose(comp, it, true); if (it.target) buildType(comp, it); return; }
    if (it.recipe === "askEvo" || it.recipe === "whatsapp") { buildOpenClose(comp, it, true); if (it.toast) buildToast(comp, it, Number(it.t0 || 0) + 0.7); return; }
    if (it.action === "move") {
      var cursor = findLayer(comp, it.cursor), target = findLayer(comp, it.target);
      if (!cursor || !target) throw new Error("Select a Cursor and a Target.");
      moveCursorTo(cursor, targetPoint(comp, target, it.point, it.ox, it.oy), Number(it.t0 || 0), Number(it.duration || 0.45) / (masterUI().speed / 100), it.path || "natural");
      markIntLayer(cursor, it.id);
      return;
    }
    if (it.action === "hover") { buildHover(comp, it); return; }
    if (it.action === "doubleClick") { buildClickLike(comp, it, true); return; }
    if (it.action === "close") { buildOpenClose(comp, it, false); return; }
    if (it.action === "select" || it.action === "click") { buildClickLike(comp, it, false); return; }
    if (it.action === "toggle") { buildClickLike(comp, it, false); return; }
    if (it.action === "toast") { buildToast(comp, it, null); return; }
    if (it.action === "metric") { buildMetric(comp, it, null); return; }
    if (it.action === "type") { buildType(comp, it); return; }
    if (it.action === "scroll") { buildScroll(comp, it); return; }
    if (it.action === "highlight") { buildHighlight(comp, it); return; }
    buildClickLike(comp, it, false);
  }
  function resetInteractionOwned(comp, id) {
    var i, layer, n, removed = 0;
    for (i = comp.numLayers; i >= 1; i--) {
      layer = comp.layer(i);
      n = layer.name || "";
      if (n.indexOf("EVO_SKIP_INT_RIP_" + id) === 0 || n.indexOf("EVO_SKIP_INT_HL_" + id) === 0) {
        try { layer.remove(); removed += 1; } catch (e) {}
        continue;
      }
      if (!layerHasInt(layer, id)) continue;
      try {
        if (isMasterExpr(layer.property("ADBE Transform Group").property("ADBE Position").expression) === false) {
          /* keep compiler expressions */
        }
      } catch (e2) {}
    }
    return removed;
  }


  function camStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_CAM_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_CAM_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|camstore");
    return layer;
  }
  function readCameras(comp) {
    var layer = camStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeCameras(comp, list) {
    var layer = camStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",name:" + jsStr(it.name) + ",type:" + jsStr(it.type) + ",mode:" + jsStr(it.mode || "2d") + ",target:" + jsStr(it.target || "") + ",t0:" + Number(it.t0 || 0) + ",duration:" + Number(it.duration || 0.8) + ",strength:" + Number(it.strength || 100) + ",style:" + jsStr(it.style || "evotechly") + ",ox:" + Number(it.ox || 0) + ",oy:" + Number(it.oy || 0) + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextCamId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_CAM_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_CAM_" + n;
  }
  function camTokens(style) {
    if (style === "stripe") return { push: 108, snap: 114, punch: 114, settle: 110, pan: 56 };
    if (style === "linear") return { push: 105, snap: 108, punch: 108, settle: 105, pan: 32 };
    if (style === "vercel") return { push: 107, snap: 112, punch: 112, settle: 107, pan: 40 };
    if (style === "apple") return { push: 103, snap: 105, punch: 105, settle: 103, pan: 16 };
    return { push: 108, snap: 112, punch: 112, settle: 108, pan: 48 };
  }
  function camMul() {
    var v = masterUI(), inten = 100, travel = 100, cam = 100, m;
    try {
      m = findMaster(activeComp());
      if (m) {
        inten = readMasterValues(m).intensity;
        travel = readMasterValues(m).travel;
      }
    } catch (e) {}
    cam = v.speed ? 100 : 100;
    return {
      speed: v.speed,
      ui: v.ui,
      reduce: v.reduce,
      mag: function (strength) {
        var s = Number(strength || 100);
        if (s < 0) s = 0; if (s > 200) s = 200;
        return (s / 100) * (0.5 + 0.5 * (inten / 100)) * (0.7 + 0.3 * (travel / 100));
      }
    };
  }
  function findCamFrame(comp) {
    return findLayer(comp, "EVO_SKIP_CAM_FRAME");
  }
  function ensureCamFrame(comp) {
    var layer = findCamFrame(comp), pos;
    if (layer) return layer;
    layer = comp.layers.addNull();
    layer.name = "EVO_SKIP_CAM_FRAME";
    pos = [comp.width / 2, comp.height / 2];
    layer.transform.position.setValue(pos);
    layer.transform.scale.setValue([100, 100]);
    layer.transform.anchorPoint.setValue([0, 0]);
    try { layer.guideLayer = true; } catch (e0) {}
    writeComment(layer, MOTION_TAG + "|camframe|" + pos[0] + "|" + pos[1] + "|100|100|100");
    return layer;
  }
  function userCameras(comp) {
    var out = [], i;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i) instanceof CameraLayer && comp.layer(i).name.indexOf("EVO_SKIP_CAM") !== 0) out.push(comp.layer(i));
    }
    return out;
  }
  function ensureCam3D(comp) {
    var cam = findLayer(comp, "EVO_SKIP_CAM"), users = userCameras(comp), master;
    if (cam) return cam;
    if (users.length) {
      if (!confirm("A user camera already exists (" + users[0].name + ").\nOK = create a separate EVO rig.\nCancel = abort.")) return null;
    }
    cam = comp.layers.addCamera("EVO_SKIP_CAM", [comp.width / 2, comp.height / 2]);
    cam.name = "EVO_SKIP_CAM";
    writeComment(cam, MOTION_TAG + "|cam3d");
    master = findLayer(comp, "EVO_SKIP_CAM_MASTER");
    if (!master) {
      master = comp.layers.addNull();
      master.name = "EVO_SKIP_CAM_MASTER";
      try { master.threeDLayer = true; } catch (e0) {}
      master.transform.position.setValue([comp.width / 2, comp.height / 2, 0]);
      writeComment(master, MOTION_TAG + "|cammaster");
    }
    return cam;
  }
  function attachSelectedToFrame(comp, frame) {
    var layers = selectedLayers(comp), i, layer, n = 0;
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      if (isSkip(layer.name)) continue;
      if (layer === frame) continue;
      try {
        if (!layer.parent) { layer.parent = frame; n += 1; }
      } catch (e) {}
    }
    return n;
  }
  function camEaseProp(prop, kind) {
    applyEaseToProp(prop, kind === "linear" ? "linear" : kind === "expo" ? "expo" : kind === "soft" ? "soft" : "apple");
  }
  function zoomTo(frame, t0, dur, startS, endS, ease) {
    var sc = frame.transform.scale;
    sc.setValueAtTime(t0, [startS, startS]);
    sc.setValueAtTime(t0 + dur, [endS, endS]);
    camEaseProp(sc, ease);
  }
  function panBy(frame, t0, dur, dx, dy, ease) {
    var pos = frame.transform.position, v = pos.valueAtTime(t0, false);
    if (!v || v.length < 2) v = pos.value;
    pos.setValueAtTime(t0, v);
    pos.setValueAtTime(t0 + dur, [v[0] + dx, v[1] + dy]);
    camEaseProp(pos, ease);
  }
  function panToward(comp, frame, target, t0, dur, ox, oy, ease) {
    var dest = targetPoint(comp, target, "center", ox, oy);
    var pos = frame.transform.position, v = pos.value;
    var cx = comp.width / 2, cy = comp.height / 2;
    pos.setValueAtTime(t0, v);
    pos.setValueAtTime(t0 + dur, [v[0] + (cx - dest[0]), v[1] + (cy - dest[1])]);
    camEaseProp(pos, ease);
  }
  function punchZoom(frame, t0, dur, peak, settle, ease) {
    var sc = frame.transform.scale;
    sc.setValueAtTime(t0, [100, 100]);
    sc.setValueAtTime(t0 + dur * 0.45, [peak, peak]);
    sc.setValueAtTime(t0 + dur, [settle, settle]);
    camEaseProp(sc, ease);
  }
  function applyHandheld(frame, amount, freq, seed) {
    var expr = "// EVO_CAM_HANDHELD\nseedRandom(" + Number(seed || 1) + ", true);\nwiggle(" + Number(freq || 0.3) + ", " + Number(amount || 2) + ");";
    try { frame.transform.position.expression = expr; } catch (e) {}
  }
  function cropWarn(comp, endScale) {
    if (endScale > 115) return "Zoom " + endScale + "% may crop UI. Product clarity first.";
    return "";
  }
  function runCamera(comp, mv) {
    var tok = camTokens(mv.style), mul = camMul(), mag = mul.mag(mv.strength);
    var dur = Number(mv.duration || 0.8) / (mul.speed / 100);
    var t0 = Number(mv.t0 || 0), ease = "apple";
    var frame, target, endS, peak, pan, warn, mode = mv.mode || "2d";
    if (mul.reduce && (String(mv.type).indexOf("whip") === 0)) {
      mv.type = "push";
    }
    if (mode === "3d") {
      if (!ensureCam3D(comp)) return;
    }
    frame = ensureCamFrame(comp);
    target = mv.target ? findLayer(comp, mv.target) : null;
    if (mv.type === "push" || mv.type === "slowPush" || mv.type === "microPush") {
      endS = 100 + ((mv.type === "microPush" ? 3 : mv.type === "slowPush" ? 5 : (tok.push - 100)) * mag);
      if (mul.reduce) endS = 100 + (endS - 100) * 0.25;
      if (endS > 118) endS = 118;
      zoomTo(frame, t0, dur, 100, endS, ease);
    } else if (mv.type === "pull" || mv.type === "slowPull") {
      endS = 100 + ((tok.push - 100) * mag);
      if (mul.reduce) endS = 100 + (endS - 100) * 0.25;
      zoomTo(frame, t0, dur, endS, 100, ease);
    } else if (mv.type === "panLeft" || mv.type === "panRight" || mv.type === "panUp" || mv.type === "panDown") {
      pan = tok.pan * mag;
      if (mul.reduce) pan *= 0.2;
      if (mv.type === "panLeft") panBy(frame, t0, dur, pan, 0, ease);
      if (mv.type === "panRight") panBy(frame, t0, dur, -pan, 0, ease);
      if (mv.type === "panUp") panBy(frame, t0, dur, 0, pan, ease);
      if (mv.type === "panDown") panBy(frame, t0, dur, 0, -pan, ease);
    } else if (mv.type === "panTo" || mv.type === "focus") {
      if (!target) throw new Error("Camera " + mv.id + " needs a target layer.");
      panToward(comp, frame, target, t0, dur, mv.ox, mv.oy, ease);
      if (mv.type === "focus") {
        endS = 100 + ((tok.push - 100) * mag * 0.7);
        if (mul.reduce) endS = 100 + (endS - 100) * 0.25;
        zoomTo(frame, t0, dur, 100, endS, ease);
      }
      addCompMarker(comp, t0, "EVO_CAM_FOCUS " + mv.id);
    } else if (mv.type === "snap") {
      endS = 100 + ((tok.snap - 100) * mag);
      if (mul.reduce) endS = 100 + (endS - 100) * 0.25;
      if (endS > 118) endS = 118;
      zoomTo(frame, t0, Math.min(dur, 0.36 / (mul.speed / 100)), 100, endS, "expo");
    } else if (mv.type === "punch") {
      peak = 100 + ((tok.punch - 100) * mag);
      endS = 100 + ((tok.settle - 100) * mag);
      if (mul.reduce) { peak = 100 + (peak - 100) * 0.25; endS = 100 + (endS - 100) * 0.25; }
      punchZoom(frame, t0, Math.min(dur, 0.5), peak, endS, ease);
    } else if (String(mv.type).indexOf("whip") === 0) {
      pan = tok.pan * 2.2 * mag;
      if (mv.type === "whipLeft") panBy(frame, t0, Math.min(dur, 0.28), pan, 0, "expo");
      if (mv.type === "whipRight") panBy(frame, t0, Math.min(dur, 0.28), -pan, 0, "expo");
      if (mv.type === "whipUp") panBy(frame, t0, Math.min(dur, 0.28), 0, pan, "expo");
      if (mv.type === "whipDown") panBy(frame, t0, Math.min(dur, 0.28), 0, -pan, "expo");
      addCompMarker(comp, t0, "EVO_CAM_WHIP " + mv.id);
    } else if (mv.type === "handheld" || mv.type === "interviewDrift") {
      applyHandheld(frame, mul.reduce ? 0.4 : (2 * mag), mv.type === "interviewDrift" ? 0.18 : 0.32, 1);
    } else if (mv.type === "parallax") {
      applyParallax(comp, mv, mag, t0, dur);
    } else if (mv.type === "reframeV") {
      endS = 100 + (12 * mag);
      if (endS > 118) endS = 118;
      zoomTo(frame, t0, dur, 100, endS, ease);
      if (target) panToward(comp, frame, target, t0, dur, mv.ox, mv.oy, ease);
    } else {
      endS = 100 + ((tok.push - 100) * mag);
      zoomTo(frame, t0, dur, 100, endS, ease);
    }
    addCompMarker(comp, t0, "EVO_CAM_START " + mv.id);
    addCompMarker(comp, t0 + dur, "EVO_CAM_END " + mv.id);
    warn = cropWarn(comp, endS || 100);
    if (warn) alert(warn);
  }
  function applyParallax(comp, mv, mag, t0, dur) {
    var layers = selectedLayers(comp), i, layer, amt;
    if (layers.length < 2) throw new Error("Parallax needs 2+ selected layers (FG then MID then BG).");
    if (!confirm("Parallax will key Position on the selected layers only. Continue?")) return;
    for (i = 0; i < layers.length; i++) {
      layer = layers[i];
      if (isSkip(layer.name)) continue;
      amt = (i === 0 ? 18 : i === 1 ? 10 : 5) * mag;
      panBy(layer, t0, dur, amt, amt * 0.2, "apple");
      markIntLayer(layer, mv.id);
    }
  }
  function resetCameraOwned(comp, id) {
    var frame = findCamFrame(comp);
    if (frame) {
      try { if (String(frame.transform.position.expression).indexOf("EVO_CAM_HANDHELD") !== -1) frame.transform.position.expression = ""; } catch (e) {}
    }
    return 1;
  }
  function resetAllEvoCamera(comp) {
    var frame = findCamFrame(comp), cam = findLayer(comp, "EVO_SKIP_CAM"), master = findLayer(comp, "EVO_SKIP_CAM_MASTER");
    if (frame) {
      try { frame.transform.position.expression = ""; } catch (e0) {}
      try {
        while (frame.transform.position.numKeys) frame.transform.position.removeKey(1);
        while (frame.transform.scale.numKeys) frame.transform.scale.removeKey(1);
        frame.transform.position.setValue([comp.width / 2, comp.height / 2]);
        frame.transform.scale.setValue([100, 100]);
      } catch (e1) {}
    }
    writeCameras(comp, []);
    return true;
  }


  function transStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_TRANS_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_TRANS_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|transstore");
    return layer;
  }
  function readTransitions(comp) {
    var layer = transStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeTransitions(comp, list) {
    var layer = transStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",name:" + jsStr(it.name) + ",type:" + jsStr(it.type) + ",from:" + jsStr(it.from) + ",to:" + jsStr(it.to) + ",ta:" + jsStr(it.ta || "") + ",tb:" + jsStr(it.tb || "") + ",dir:" + jsStr(it.dir || "left") + ",align:" + jsStr(it.align || "center") + ",t0:" + Number(it.t0 || 0) + ",duration:" + Number(it.duration || 0.35) + ",strength:" + Number(it.strength || 100) + ",style:" + jsStr(it.style || "evotechly") + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextTransId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_TRANS_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_TRANS_" + n;
  }
  function transWin(t0, dur, align) {
    if (align === "before") return { start: t0 - dur, mid: t0 - dur / 2, end: t0 };
    if (align === "after") return { start: t0, mid: t0 + dur / 2, end: t0 + dur };
    return { start: t0 - dur / 2, mid: t0, end: t0 + dur / 2 };
  }
  function transTravel(comp, style, strength, type, reduce) {
    var frac = 0.45;
    if (style === "stripe") frac = 0.55;
    if (style === "linear") frac = 0.35;
    if (style === "vercel") frac = 0.4;
    if (style === "apple") frac = 0.16;
    if (type === "whip" || type === "hook") frac = Math.min(0.92, frac * 1.6);
    if (type === "calm") frac = 0.12;
    if (type === "cut") frac = 0;
    if (reduce) frac *= 0.25;
    return comp.width * frac * (Number(strength || 100) / 100);
  }
  function dirDelta(dir, amt) {
    if (dir === "right") return [-amt, 0];
    if (dir === "up") return [0, amt];
    if (dir === "down") return [0, -amt];
    return [amt, 0];
  }
  function trimHelper(layer, start, end) {
    try { layer.inPoint = start; layer.outPoint = end; } catch (e) {}
  }
  function removeNamed(comp, name) {
    var layer = findLayer(comp, name);
    if (layer) try { layer.remove(); } catch (e) {}
  }
  function addTransBlur(comp, id, mid, start, end, amount) {
    var name = "EVO_SKIP_TRANS_BLUR_" + id, adj, fx;
    removeNamed(comp, name);
    if (amount <= 0) return null;
    adj = comp.layers.addSolid([0, 0, 0], name, comp.width, comp.height, 1);
    adj.name = name;
    adj.adjustmentLayer = true;
    writeComment(adj, MOTION_TAG + "\nEVO_TRANS|" + id);
    trimHelper(adj, start, end);
    try {
      fx = adj.property("ADBE Effect Parade").addProperty("ADBE Fast Blur");
      if (!fx) fx = adj.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
      if (fx) {
        fx.property(1).setValueAtTime(start, 0);
        fx.property(1).setValueAtTime(mid, amount);
        fx.property(1).setValueAtTime(end, 0);
      }
    } catch (e) {}
    return adj;
  }
  function addTransFlash(comp, id, mid, start, end, strength) {
    var name = "EVO_SKIP_TRANS_FLASH_" + id, solid;
    removeNamed(comp, name);
    solid = comp.layers.addSolid([1, 1, 1], name, comp.width, comp.height, 1);
    solid.name = name;
    writeComment(solid, MOTION_TAG + "\nEVO_TRANS|" + id);
    trimHelper(solid, Math.max(start, mid - 0.04), Math.min(end, mid + 0.06));
    try { solid.blendingMode = BlendingMode.ADD; } catch (e) {}
    solid.transform.opacity.setValueAtTime(mid - 0.03, 0);
    solid.transform.opacity.setValueAtTime(mid, Math.min(55, 18 + strength * 0.2));
    solid.transform.opacity.setValueAtTime(mid + 0.05, 0);
    return solid;
  }
  function addTransMatte(comp, id, layer, start, end, dir, revealIn) {
    var name = "EVO_SKIP_TRANS_MATTE_" + id, matte, w = layer.width || 100, h = layer.height || 100;
    try { if (layer.source) { w = layer.source.width; h = layer.source.height; } } catch (e0) {}
    removeNamed(comp, name);
    matte = comp.layers.addSolid([1, 1, 1], name, Math.max(8, Math.round(w)), Math.max(8, Math.round(h)), 1);
    matte.name = name;
    writeComment(matte, MOTION_TAG + "\nEVO_TRANS|" + id);
    try { matte.moveAfter(layer); } catch (e1) {}
    try { layer.trackMatteType = TrackMatteType.ALPHA; } catch (e2) {}
    trimHelper(matte, start, end);
    if (dir === "up" || dir === "down") {
      matte.transform.scale.setValueAtTime(revealIn ? start : end, [100, 0]);
      matte.transform.scale.setValueAtTime(revealIn ? end : start, [100, 100]);
    } else if (dir === "radial") {
      matte.transform.scale.setValueAtTime(revealIn ? start : end, [0, 0]);
      matte.transform.scale.setValueAtTime(revealIn ? end : start, [100, 100]);
    } else {
      matte.transform.scale.setValueAtTime(revealIn ? start : end, [0, 100]);
      matte.transform.scale.setValueAtTime(revealIn ? end : start, [100, 100]);
    }
    applyEaseToProp(matte.transform.scale, "apple");
    return matte;
  }
  function restPos(layer) {
    return layer.transform.position.value;
  }
  function restScale(layer) {
    return layer.transform.scale.value;
  }
  function restOp(layer) {
    try { return layer.transform.opacity.value; } catch (e) { return 100; }
  }
  function keyPushPair(fromL, toL, win, delta, ease) {
    var a0 = restPos(fromL), b0 = restPos(toL);
    fromL.transform.position.setValueAtTime(win.start, a0);
    fromL.transform.position.setValueAtTime(win.end, [a0[0] + delta[0], a0[1] + delta[1]]);
    toL.transform.position.setValueAtTime(win.start, [b0[0] - delta[0], b0[1] - delta[1]]);
    toL.transform.position.setValueAtTime(win.end, b0);
    applyEaseToProp(fromL.transform.position, ease);
    applyEaseToProp(toL.transform.position, ease);
  }
  function keyZoomThrough(fromL, toL, win) {
    var as = restScale(fromL), bs = restScale(toL);
    fromL.transform.scale.setValueAtTime(win.start, as);
    fromL.transform.scale.setValueAtTime(win.end, [as[0] * 1.18, as[1] * 1.18]);
    toL.transform.scale.setValueAtTime(win.start, [bs[0] * 1.18, bs[1] * 1.18]);
    toL.transform.scale.setValueAtTime(win.end, bs);
    fromL.transform.opacity.setValueAtTime(win.start, 100);
    fromL.transform.opacity.setValueAtTime(win.mid, 0);
    toL.transform.opacity.setValueAtTime(win.start, 0);
    toL.transform.opacity.setValueAtTime(win.mid, 100);
    applyEaseToProp(fromL.transform.scale, "expo");
    applyEaseToProp(toL.transform.scale, "apple");
  }
  function keyCrossfade(fromL, toL, win) {
    fromL.transform.opacity.setValueAtTime(win.start, restOp(fromL));
    fromL.transform.opacity.setValueAtTime(win.end, 0);
    toL.transform.opacity.setValueAtTime(win.start, 0);
    toL.transform.opacity.setValueAtTime(win.end, 100);
    applyEaseToProp(fromL.transform.opacity, "soft");
    applyEaseToProp(toL.transform.opacity, "soft");
  }
  function keyScaleMatch(comp, fromL, toL, ta, tb, win) {
    var a = ta ? findLayer(comp, ta) : fromL;
    var b = tb ? findLayer(comp, tb) : toL;
    var pa, pb, sa;
    if (!a || !b) { keyZoomThrough(fromL, toL, win); return; }
    pa = targetPoint(comp, a, "center", 0, 0);
    pb = targetPoint(comp, b, "center", 0, 0);
    sa = restScale(fromL);
    fromL.transform.position.setValueAtTime(win.start, restPos(fromL));
    fromL.transform.position.setValueAtTime(win.end, [restPos(fromL)[0] + (pb[0] - pa[0]), restPos(fromL)[1] + (pb[1] - pa[1])]);
    fromL.transform.scale.setValueAtTime(win.start, sa);
    fromL.transform.scale.setValueAtTime(win.end, [sa[0] * 1.12, sa[1] * 1.12]);
    fromL.transform.opacity.setValueAtTime(win.mid, 0);
    toL.transform.opacity.setValueAtTime(win.start, 0);
    toL.transform.opacity.setValueAtTime(win.mid, 100);
    applyEaseToProp(fromL.transform.position, "apple");
  }
  function warnHandles(fromL, toL, win) {
    var stillA = false, stillB = false, warn = [];
    try { stillA = !(fromL.source && fromL.source.duration); } catch (e0) {}
    try { stillB = !(toL.source && toL.source.duration); } catch (e1) {}
    try {
      if (!stillA && (win.start < fromL.inPoint - 0.001 || win.end > fromL.outPoint + 0.001)) warn.push("Outgoing clip needs more frames.");
    } catch (e2) {}
    try {
      if (!stillB && (win.start < toL.inPoint - 0.001 || win.end > toL.outPoint + 0.001)) warn.push("Incoming clip needs more frames.");
    } catch (e3) {}
    if (warn.length) alert(warn.join("\n") + "\nShorten the transition or extend the layers. Motion OS will not invent footage.");
    return warn.length === 0;
  }
  function runTransition(comp, tr) {
    var fromL = findLayer(comp, tr.from), toL = findLayer(comp, tr.to);
    var mv = masterUI(), dur, win, amt, delta, ease = "apple", type = tr.type, reduce;
    if (!fromL || !toL) throw new Error("Transition " + (tr.id || "") + " needs FROM and TO layers.");
    if (fromL.name === toL.name) throw new Error("FROM and TO must be different layers.");
    reduce = mv.reduce;
    dur = Number(tr.duration || 0.35) / (mv.speed / 100);
    if (type === "cut") dur = 0.001;
    if (type === "hook") dur = Math.min(dur, 0.2);
    if (type === "calm") dur = Math.max(dur, 0.42);
    if (reduce && (type === "whip" || type === "hook" || type === "glitch")) type = "clean";
    if (reduce && type === "flash") type = "exposure";
    win = transWin(Number(tr.t0 || 0), dur, tr.align || "center");
    warnHandles(fromL, toL, win);
    amt = transTravel(comp, tr.style, tr.strength, type, reduce);
    delta = dirDelta(tr.dir || "left", amt);
    markIntLayer(fromL, tr.id);
    markIntLayer(toL, tr.id);
    if (type === "cut") {
      fromL.transform.opacity.setValueAtTime(win.mid - 0.001, 100);
      fromL.transform.opacity.setValueAtTime(win.mid, 0);
      toL.transform.opacity.setValueAtTime(win.mid - 0.001, 0);
      toL.transform.opacity.setValueAtTime(win.mid, 100);
    } else if (type === "push" || type === "whip" || type === "clean" || type === "personProduct" || type === "productPerson") {
      keyPushPair(fromL, toL, win, delta, type === "whip" ? "expo" : ease);
      if (type === "clean" || type === "personProduct") {
        fromL.transform.scale.setValueAtTime(win.start, restScale(fromL));
        fromL.transform.scale.setValueAtTime(win.end, [restScale(fromL)[0] * 1.03, restScale(fromL)[1] * 1.03]);
      }
      addTransBlur(comp, tr.id, win.mid, win.start, win.end, type === "whip" ? 16 : (type === "calm" ? 2 : 8) * (reduce ? 0.3 : 1) * (Number(tr.strength || 100) / 100));
    } else if (type === "calm") {
      keyCrossfade(fromL, toL, win);
      keyPushPair(fromL, toL, win, dirDelta(tr.dir || "left", amt * 0.4), "soft");
    } else if (type === "zoom" || type === "zoomMatch") {
      keyZoomThrough(fromL, toL, win);
      addTransBlur(comp, tr.id, win.mid, win.start, win.end, 6);
    } else if (type === "scaleMatch" || type === "uiMatch") {
      keyScaleMatch(comp, fromL, toL, tr.ta, tr.tb, win);
      addTransBlur(comp, tr.id, win.mid, win.start, win.end, 5);
    } else if (type === "mask" || type === "wipe") {
      keyCrossfade(fromL, toL, win);
      addTransMatte(comp, tr.id, toL, win.start, win.end, type === "wipe" && tr.dir === "up" ? "radial" : (tr.dir || "left"), true);
    } else if (type === "blur") {
      keyCrossfade(fromL, toL, win);
      addTransBlur(comp, tr.id, win.mid, win.start, win.end, 14 * (reduce ? 0.3 : 1));
    } else if (type === "flash" || type === "exposure" || type === "hook") {
      if (type === "hook") keyPushPair(fromL, toL, win, delta, "expo");
      else keyCrossfade(fromL, toL, win);
      addTransFlash(comp, tr.id, win.mid, win.start, win.end, reduce ? 20 : Number(tr.strength || 100));
      addTransBlur(comp, tr.id, win.mid, win.start, win.end, type === "hook" ? 12 : 4);
    } else if (type === "glitch") {
      keyPushPair(fromL, toL, win, delta, "expo");
      addTransFlash(comp, tr.id, win.mid, win.start, win.end, 40);
      addTransBlur(comp, tr.id, win.mid, win.start, win.end, 20);
    } else {
      keyPushPair(fromL, toL, win, delta, ease);
      addTransBlur(comp, tr.id, win.mid, win.start, win.end, 8);
    }
    addCompMarker(comp, win.start, "EVO_TRANS_START " + tr.id);
    addCompMarker(comp, win.mid, "EVO_TRANS_MID " + tr.id);
    addCompMarker(comp, win.end, "EVO_TRANS_END " + tr.id);
  }
  function resetTransitionOwned(comp, id) {
    var names = ["EVO_SKIP_TRANS_BLUR_" + id, "EVO_SKIP_TRANS_FLASH_" + id, "EVO_SKIP_TRANS_MATTE_" + id], i;
    for (i = 0; i < names.length; i++) removeNamed(comp, names[i]);
  }
  function resetAllEvoTransitions(comp) {
    var list = readTransitions(comp), i;
    for (i = 0; i < list.length; i++) resetTransitionOwned(comp, list[i].id);
    writeTransitions(comp, []);
  }


  function rhythmStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_RHYTHM_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_RHYTHM_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|rhythmstore");
    return layer;
  }
  function readRhythm(comp) {
    var layer = rhythmStoreLayer(comp, false), raw, data;
    if (!layer) return { bpm: 120, start: 0, mode: "BEAT_1X", offset: 0, audio: "", confidence: "MANUAL", locks: [] };
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      if (!data.bpm) data.bpm = 120;
      if (!data.locks) data.locks = [];
      if (!data.mode) data.mode = "BEAT_1X";
      return data;
    } catch (e) { return { bpm: 120, start: 0, mode: "BEAT_1X", offset: 0, audio: "", confidence: "MANUAL", locks: [] }; }
  }
  function writeRhythm(comp, data) {
    var layer = rhythmStoreLayer(comp, true), i, lockParts = [], L;
    for (i = 0; i < (data.locks || []).length; i++) {
      L = data.locks[i];
      lockParts.push("{kind:" + jsStr(L.kind) + ",id:" + jsStr(L.id) + ",point:" + jsStr(L.point) + ",beat:" + Number(L.beat || 0) + ",interval:" + jsStr(L.interval || "BEAT_1X") + "}");
    }
    try {
      layer.text.sourceText.setValue("{bpm:" + Number(data.bpm || 120) + ",start:" + Number(data.start || 0) + ",mode:" + jsStr(data.mode || "BEAT_1X") + ",offset:" + Number(data.offset || 0) + ",audio:" + jsStr(data.audio || "") + ",confidence:" + jsStr(data.confidence || "MANUAL") + ",locks:[" + lockParts.join(",") + "]}");
    } catch (e) {}
  }
  function beatStep(bpm, mode) {
    var q = 60 / Math.max(40, Math.min(240, Number(bpm) || 120));
    if (mode === "BEAT_HALF_INTERVAL") return q / 2;
    if (mode === "BEAT_QUARTER_INTERVAL") return q / 4;
    if (mode === "BEAT_2X_INTERVAL") return q * 2;
    if (mode === "BEAT_4X_INTERVAL") return q * 4;
    return q;
  }
  function collectEvoBeatMarkers(comp) {
    var out = [], i, m, t, label;
    try {
      if (!comp.marker || !comp.marker.numKeys) return out;
      for (i = 1; i <= comp.marker.numKeys; i++) {
        t = comp.marker.keyTime(i);
        m = comp.marker.keyValue(i);
        label = String(m.comment || m);
        if (label.indexOf("EVO_BEAT_") === 0 || label.indexOf("EVO_HALF_") === 0 || label.indexOf("EVO_QUARTER_") === 0) {
          out.push({ time: t, label: label, index: out.length + 1 });
        }
      }
    } catch (e) {}
    return out;
  }
  function nearestRhythmBeat(comp, t, prefer) {
    var beats = collectEvoBeatMarkers(comp), i, best = null, d, ad, bestD = 99999;
    if (!beats.length) return null;
    if (prefer === "next") {
      for (i = 0; i < beats.length; i++) if (beats[i].time >= t - 0.0001) return beats[i];
      return beats[beats.length - 1];
    }
    if (prefer === "prev") {
      for (i = beats.length - 1; i >= 0; i--) if (beats[i].time <= t + 0.0001) return beats[i];
      return beats[0];
    }
    for (i = 0; i < beats.length; i++) {
      ad = Math.abs(beats[i].time - t);
      if (ad < bestD) { bestD = ad; best = beats[i]; }
    }
    return best;
  }
  function clearEvoRhythmMarkers(comp) {
    var i, m, label, removed = 0;
    try {
      for (i = comp.marker.numKeys; i >= 1; i--) {
        m = comp.marker.keyValue(i);
        label = String(m.comment || m);
        if (label.indexOf("EVO_BEAT_") === 0 || label.indexOf("EVO_HALF_") === 0 || label.indexOf("EVO_QUARTER_") === 0 || label.indexOf("EVO_DROP") === 0 || label.indexOf("EVO_IMPACT") === 0 || label.indexOf("EVO_INTRO") === 0 || label.indexOf("EVO_HOOK") === 0 || label.indexOf("EVO_BUILD") === 0 || label.indexOf("EVO_OUTRO") === 0) {
          comp.marker.removeKey(i);
          removed += 1;
        }
      }
    } catch (e) {}
    return removed;
  }
  function generateBeatGrid(comp, bpm, start, end, mode, offsetSec) {
    var step = beatStep(bpm, mode), t = start + Number(offsetSec || 0), i = 1, prefix, label, cap = 400;
    prefix = mode === "BEAT_HALF_INTERVAL" ? "EVO_HALF_" : mode === "BEAT_QUARTER_INTERVAL" ? "EVO_QUARTER_" : "EVO_BEAT_";
    if ((end - start) / step > cap) {
      alert("Grid would create too many markers. Use Work Area or a coarser grid.");
      end = start + step * cap;
    }
    while (t <= end + 0.0001 && i <= cap) {
      label = prefix + (String(1000 + i).slice(-3));
      addCompMarker(comp, t, label);
      t += step;
      i += 1;
    }
    return i - 1;
  }
  function ensureAudioAmp(comp, audioName) {
    var audio = findLayer(comp, audioName), helper = findLayer(comp, "EVO_SKIP_AUDIO_ANALYSIS"), cmd;
    if (!audio) throw new Error("Select an audio layer first.");
    if (helper) return helper;
    try { audio.selected = true; } catch (e0) {}
    try {
      cmd = app.findMenuCommandId("Convert Audio to Keyframes");
      if (cmd) app.executeCommand(cmd);
    } catch (e1) {
      throw new Error("Could not run Convert Audio to Keyframes. Use Manual BPM.");
    }
    helper = findLayer(comp, "Audio Amplitude");
    if (helper) {
      helper.name = "EVO_SKIP_AUDIO_ANALYSIS";
      writeComment(helper, MOTION_TAG + "|audioamp");
    }
    return helper;
  }
  function peaksFromAmp(helper, minGap, thr) {
    var fx, sl, i, samples = [], last = -999, out = [], v, t;
    try {
      fx = helper.property("ADBE Effect Parade");
      sl = helper.effect("Both Channels") ? helper.effect("Both Channels").property("Slider") : null;
      if (!sl && fx && fx.numProperties) sl = fx.property(1).property("Slider");
    } catch (e) { sl = null; }
    if (!sl || !sl.numKeys) return [];
    for (i = 1; i <= sl.numKeys; i++) {
      t = sl.keyTime(i);
      v = sl.keyValue(i);
      if (v >= sl.keyValue(Math.max(1, i - 1)) && v >= sl.keyValue(Math.min(sl.numKeys, i + 1)) && v >= thr && t - last >= minGap) {
        out.push({ time: t, value: v });
        last = t;
      }
    }
    return out;
  }


  function typeStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_TYPE_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_TYPE_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|typestore");
    return layer;
  }
  function readTypes(comp) {
    var layer = typeStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeTypes(comp, list) {
    var layer = typeStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",name:" + jsStr(it.name) + ",mode:" + jsStr(it.mode) + ",target:" + jsStr(it.target) + ",dir:" + jsStr(it.dir || "up") + ",order:" + jsStr(it.order || "forward") + ",keyword:" + jsStr(it.keyword || "") + ",t0:" + Number(it.t0 || 0) + ",duration:" + Number(it.duration || 0.6) + ",stagger:" + Number(it.stagger || 0.05) + ",startN:" + Number(it.startN || 0) + ",endN:" + Number(it.endN || 100) + ",prefix:" + jsStr(it.prefix || "") + ",suffix:" + jsStr(it.suffix || "") + ",style:" + jsStr(it.style || "evotechly") + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextTypeId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_TYPE_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_TYPE_" + n;
  }
  function textContent(layer) {
    var src;
    try {
      src = layer.text.sourceText.value;
      if (src && src.text !== undefined) src = src.text;
      return String(src || "");
    } catch (e) { return ""; }
  }
  function isTextLayer(layer) {
    try { return layer.property("ADBE Text Properties") !== null; } catch (e) { return false; }
  }
  function hasArabicText(str) {
    return /[\u0600-\u06FF]/.test(String(str || ""));
  }
  function rangeUnit(mode) {
    if (mode === "line") return 4;
    if (mode === "character") return 1;
    return 3;
  }
  function addOwnedAnimator(layer, name) {
    var animators, anim;
    animators = layer.property("ADBE Text Properties").property("ADBE Text Animators");
    anim = animators.addProperty("ADBE Text Animator");
    try { anim.name = name; } catch (e) {}
    return anim;
  }
  function animatorByName(layer, name) {
    var group, i, a;
    try {
      group = layer.property("ADBE Text Properties").property("ADBE Text Animators");
      for (i = 1; i <= group.numProperties; i++) {
        a = group.property(i);
        if (a && a.name === name) return a;
      }
    } catch (e) {}
    return null;
  }
  function removeOwnedAnimators(layer, id) {
    var group, i, a;
    try {
      group = layer.property("ADBE Text Properties").property("ADBE Text Animators");
      for (i = group.numProperties; i >= 1; i--) {
        a = group.property(i);
        if (a && String(a.name).indexOf("EVO_TYPE_") === 0 && String(a.name).indexOf(id) !== -1) {
          try { a.remove(); } catch (e0) {}
        }
      }
    } catch (e) {}
  }
  function configureSelector(anim, unit, t0, t1, reverse) {
    var sel, endP;
    try {
      sel = anim.property("ADBE Text Selectors").property(1);
      try { sel.property("ADBE Text Range Type2").setValue(unit); } catch (e0) {}
      try {
        endP = sel.property("ADBE Text Range End 2");
        if (!endP) endP = sel.property("End");
        endP.setValueAtTime(t0, reverse ? 100 : 0);
        endP.setValueAtTime(t1, reverse ? 0 : 100);
      } catch (e1) {}
    } catch (e) {}
    return sel;
  }
  function addOpacityReveal(layer, id, unit, t0, t1, reverse) {
    var anim = addOwnedAnimator(layer, "EVO_TYPE_OPACITY_" + id), props, op;
    props = anim.property("ADBE Text Animator Properties");
    try {
      op = props.addProperty("ADBE Text Opacity");
      op.setValue(0);
    } catch (e) {}
    configureSelector(anim, unit, t0, t1, reverse);
    return anim;
  }
  function addPosReveal(layer, id, unit, t0, t1, dx, dy, reverse) {
    var anim = addOwnedAnimator(layer, "EVO_TYPE_POSITION_" + id), props, pos;
    props = anim.property("ADBE Text Animator Properties");
    try {
      pos = props.addProperty("ADBE Text Position 3D");
      if (!pos) pos = props.addProperty("ADBE Text Position");
      pos.setValue([dx, dy, 0]);
    } catch (e) {}
    configureSelector(anim, unit, t0, t1, reverse);
    return anim;
  }
  function addTrackReveal(layer, id, unit, t0, t1, amount) {
    var anim = addOwnedAnimator(layer, "EVO_TYPE_TRACK_" + id), props, tr;
    props = anim.property("ADBE Text Animator Properties");
    try {
      tr = props.addProperty("ADBE Text Tracking Amount");
      tr.setValue(amount);
    } catch (e) {}
    configureSelector(anim, unit, t0, t1, false);
    return anim;
  }
  function addBlurReveal(layer, id, unit, t0, t1, amount) {
    var anim = addOwnedAnimator(layer, "EVO_TYPE_BLUR_" + id), props, bl;
    props = anim.property("ADBE Text Animator Properties");
    try {
      bl = props.addProperty("ADBE Text Blur");
      bl.setValue(amount);
    } catch (e) {}
    configureSelector(anim, unit, t0, t1, false);
    return anim;
  }
  function addScalePunch(layer, id, t0, dur, peak) {
    var sc = layer.transform.scale, v = sc.value;
    sc.setValueAtTime(t0, v);
    sc.setValueAtTime(t0 + dur * 0.4, [v[0] * peak / 100, v[1] * peak / 100]);
    sc.setValueAtTime(t0 + dur, v);
    applyEaseToProp(sc, "apple");
    markIntLayer(layer, id);
  }
  function addTypeMatte(comp, layer, id, t0, t1, dir) {
    var name = "EVO_SKIP_TYPE_MATTE_" + id, matte, b;
    removeNamed(comp, name);
    b = layerBounds(comp, layer);
    matte = comp.layers.addSolid([1, 1, 1], name, Math.max(8, Math.round(b.width + 24)), Math.max(8, Math.round(b.height + 24)), 1);
    matte.name = name;
    writeComment(matte, MOTION_TAG + "\nEVO_TYPE|" + id);
    matte.transform.position.setValue([b.x + b.width / 2, b.y + b.height / 2]);
    try { matte.moveAfter(layer); layer.trackMatteType = TrackMatteType.ALPHA; } catch (e) {}
    if (dir === "left" || dir === "right") {
      matte.transform.scale.setValueAtTime(t0, [0, 100]);
      matte.transform.scale.setValueAtTime(t1, [100, 100]);
    } else {
      matte.transform.scale.setValueAtTime(t0, [100, 0]);
      matte.transform.scale.setValueAtTime(t1, [100, 100]);
    }
    applyEaseToProp(matte.transform.scale, "apple");
    return matte;
  }
  function addTypePill(comp, layer, id, t0, t1) {
    var name = "EVO_SKIP_TYPE_PILL_" + id, box, b;
    removeNamed(comp, name);
    b = layerBounds(comp, layer);
    box = comp.layers.addSolid([0.06, 0.3, 0.36], name, Math.max(8, Math.round(b.width + 28)), Math.max(8, Math.round(b.height + 14)), 1);
    box.name = name;
    writeComment(box, MOTION_TAG + "\nEVO_TYPE|" + id);
    box.transform.position.setValue([b.x + b.width / 2, b.y + b.height / 2]);
    try { box.moveAfter(layer); } catch (e) {}
    box.transform.scale.setValueAtTime(t0, [0, 100]);
    box.transform.scale.setValueAtTime(t1, [100, 100]);
    box.transform.opacity.setValue(70);
    applyEaseToProp(box.transform.scale, "apple");
    return box;
  }
  function applyCounterExpr(layer, it) {
    var existing = "";
    try { existing = String(layer.text.sourceText.expression || ""); } catch (e0) {}
    if (existing && existing.indexOf("EVO_TYPE_COUNTER") === -1) {
      throw new Error("Source Text already has an expression. Reset it or pick another layer.");
    }
    layer.text.sourceText.expression = "// EVO_TYPE_COUNTER " + it.id + "\nvar a=" + Number(it.startN || 0) + ";var b=" + Number(it.endN || 100) + ";var d=" + Number(it.duration || 1.2) + ";var t0=" + Number(it.t0 || 0) + ";var p=\"" + String(it.prefix || "").replace(/\"/g, "\\\"") + "\";var s=\"" + String(it.suffix || "").replace(/\"/g, "\\\"") + "\";var u=time-t0;if(u<0)u=0;if(u>d)u=d;p+Math.round(a+(b-a)*u/d)+s;";
  }
  function dirOffset(dir, amount) {
    if (dir === "down") return [0, -amount];
    if (dir === "left") return [amount, 0];
    if (dir === "right") return [-amount, 0];
    if (dir === "none") return [0, 0];
    return [0, amount];
  }
  function runType(comp, it) {
    var layer = findLayer(comp, it.target), t0 = Number(it.t0 || 0), dur, t1, unit, off, reduce, inten, txt, mode;
    var mv = masterUI();
    if (!layer) throw new Error("Select one text layer.");
    if (!isTextLayer(layer)) throw new Error("Select one text layer.");
    txt = textContent(layer);
    mode = it.mode;
    if (hasArabicText(txt) && mode === "character") {
      alert("Arabic detected. Character reveal can break shaping. Using Word / Opacity instead.");
      mode = "word";
    }
    reduce = mv.reduce;
    inten = 1;
    try { inten = readMasterValues(findMaster(comp)).text / 100; } catch (eI) {}
    dur = Number(it.duration || 0.6) / (mv.speed / 100);
    t1 = t0 + dur;
    unit = rangeUnit(mode);
    off = dirOffset(it.dir || "up", (reduce ? 4 : 12) * inten);
    markIntLayer(layer, it.id);
    if (mode === "word" || mode === "line" || mode === "character" || mode === "hookClean" || mode === "hookSlam" || mode === "bilingual" || mode === "lowerThird") {
      addOpacityReveal(layer, it.id, unit === 4 && mode !== "line" ? 3 : unit, t0, t1, it.order === "reverse");
      if (!reduce && (off[0] || off[1])) addPosReveal(layer, it.id, unit, t0, t1, off[0], off[1], it.order === "reverse");
      if (mode === "hookSlam") addScalePunch(layer, it.id, t0, Math.min(dur, 0.28), reduce ? 104 : 110);
    } else if (mode === "mask") {
      addTypeMatte(comp, layer, it.id, t0, t1, it.dir || "up");
      addOpacityReveal(layer, it.id, 3, t0, t1, false);
    } else if (mode === "tracking") {
      addTrackReveal(layer, it.id, 3, t0, t1, reduce ? 10 : 32 * inten);
      addOpacityReveal(layer, it.id, 3, t0, t1, false);
    } else if (mode === "blur") {
      addBlurReveal(layer, it.id, 3, t0, t1, reduce ? 4 : 12 * inten);
      addOpacityReveal(layer, it.id, 3, t0, t1, false);
    } else if (mode === "punch" || mode === "keyword") {
      addScalePunch(layer, it.id, t0, Math.min(dur, 0.32), reduce ? 104 : 110);
      if (it.keyword && txt.toLowerCase().indexOf(String(it.keyword).toLowerCase()) === -1) {
        alert("Keyword \"" + it.keyword + "\" not found. Punch applied to the layer. Copy unchanged.");
      }
    } else if (mode === "highlight" || mode === "pill") {
      addTypePill(comp, layer, it.id, t0, t1);
    } else if (mode === "counter") {
      applyCounterExpr(layer, it);
      addScalePunch(layer, it.id, t0 + dur, 0.2, reduce ? 102 : 106);
    } else {
      addOpacityReveal(layer, it.id, 3, t0, t1, false);
    }
    addCompMarker(comp, t0, "EVO_TYPE_START " + it.id);
    addCompMarker(comp, t1, "EVO_TYPE_END " + it.id);
    if (mode === "punch" || mode === "keyword" || mode === "counter") addCompMarker(comp, mode === "counter" ? t1 : t0 + dur * 0.4, "EVO_TYPE_HIT " + it.id);
  }
  function resetTypeOwned(comp, id) {
    var i, layer, n;
    removeNamed(comp, "EVO_SKIP_TYPE_MATTE_" + id);
    removeNamed(comp, "EVO_SKIP_TYPE_PILL_" + id);
    for (i = 1; i <= comp.numLayers; i++) {
      layer = comp.layer(i);
      if (!isTextLayer(layer)) continue;
      if (String(readComment(layer)).indexOf(id) === -1 && animatorByName(layer, "EVO_TYPE_OPACITY_" + id) === null) continue;
      removeOwnedAnimators(layer, id);
      try {
        if (String(layer.text.sourceText.expression).indexOf("EVO_TYPE_COUNTER " + id) !== -1) layer.text.sourceText.expression = "";
      } catch (e) {}
    }
  }
  function resetAllEvoType(comp) {
    var list = readTypes(comp), i;
    for (i = 0; i < list.length; i++) resetTypeOwned(comp, list[i].id);
    writeTypes(comp, []);
  }


  function seqStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_SEQ_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_SEQ_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|seqstore");
    return layer;
  }
  function readSeqs(comp) {
    var layer = seqStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeSeqs(comp, list) {
    var layer = seqStoreLayer(comp, true), parts = [], i, it, kids;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      kids = it.children ? "\"" + it.children.join(",") + "\"" : "\"\"";
      parts.push("{id:" + jsStr(it.id) + ",recipe:" + jsStr(it.recipe) + ",name:" + jsStr(it.name) + ",t0:" + Number(it.t0 || 0) + ",energy:" + jsStr(it.energy || "standard") + ",rhythm:" + jsStr(it.rhythm || "free") + ",status:" + jsStr(it.status || "READY") + ",children:" + kids + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextSeqId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_SEQ_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_SEQ_" + n;
  }
  function recipeCatalog() {
    return [
      { id: "saas_hero", cat: "SaaS", name: "SaaS Hero", req: ["title", "dashboard"] },
      { id: "saas_dashboard", cat: "SaaS", name: "Dashboard Reveal", req: ["dashboard"] },
      { id: "saas_feature", cat: "SaaS", name: "Feature Reveal", req: ["feature"] },
      { id: "saas_speedrun", cat: "SaaS", name: "UI Speedrun", req: ["cursor", "t1"] },
      { id: "saas_workflow", cat: "SaaS", name: "Workflow Demo", req: ["cursor"] },
      { id: "saas_before_after", cat: "SaaS", name: "Before / After", req: ["from", "to"] },
      { id: "saas_metric", cat: "SaaS", name: "Metric Payoff", req: ["metric"] },
      { id: "social_hook", cat: "Social", name: "Viral Hook", req: ["title"] },
      { id: "social_problem", cat: "Social", name: "Problem → Solution", req: ["problem", "solution"] },
      { id: "social_benefits", cat: "Social", name: "3 Benefits", req: ["b1"] },
      { id: "pro_talking", cat: "Professional", name: "Talking Head Clean", req: ["person"] },
      { id: "hyb_founder_product", cat: "Hybrid", name: "Founder → Product", req: ["person", "dashboard"] },
      { id: "hyb_product_founder", cat: "Hybrid", name: "Product → Founder CTA", req: ["dashboard", "person"] },
      { id: "hyb_person_demo", cat: "Hybrid", name: "Person → Demo → Person", req: ["person", "dashboard"] },
      { id: "brand_outro", cat: "Brand", name: "Logo Outro", req: ["logo"] },
      { id: "brand_sting", cat: "Brand", name: "Logo Sting", req: ["logo"] },
      { id: "brand_launch", cat: "Brand", name: "Product Launch", req: ["title"] },
      { id: "crm_won", cat: "EvoCRM", name: "Deal Won", req: ["cursor", "deal", "won"] },
      { id: "crm_lead_deal", cat: "EvoCRM", name: "Lead to Deal", req: ["cursor"] },
      { id: "crm_followup", cat: "EvoCRM", name: "Follow-up Flow", req: ["cursor"] },
      { id: "crm_pipeline", cat: "EvoCRM", name: "Pipeline Speedrun", req: ["cursor", "t1"] },
      { id: "crm_ask", cat: "EvoCRM", name: "Ask Evo", req: ["cursor"] },
      { id: "crm_kpi", cat: "EvoCRM", name: "Dashboard KPI", req: ["dashboard", "metric"] }
    ];
  }
  function energyMulSeq(energy) {
    if (energy === "calm") return 1.25;
    if (energy === "high") return 0.82;
    return 1;
  }
  function pushChild(kids, kind, id) { if (id) kids.push(kind + ":" + id); }
  function runRecipeSteps(comp, recipeId, inputs, t0, energy, rhythm) {
    var kids = [], t = t0, mul = energyMulSeq(energy), dType = 0.55 * mul, dCam = 0.7 * mul, dInt = 0.6 * mul, dTr = 0.35 * mul;
    function beatSnap(time) {
      var b;
      if (rhythm === "free") return time;
      b = nearestRhythmBeat(comp, time, "next");
      return b ? b.time : time;
    }
    function doType(key, mode) {
      var layer = inputs[key], it;
      if (!layer) return;
      t = beatSnap(t);
      it = { id: nextTypeId(readTypes(comp)), name: recipeId + " " + key, mode: mode || "word", target: layer, dir: "up", order: "forward", keyword: "", t0: t, duration: dType, stagger: 0.05, startN: 0, endN: 100, prefix: "", suffix: "", style: currentStyle() };
      runType(comp, it);
      writeTypes(comp, readTypes(comp).concat([it]));
      pushChild(kids, "type", it.id);
      t += dType;
    }
    function doCam(key, type) {
      var layer = inputs[key], mv, list;
      if (!layer && type !== "push") return;
      t = beatSnap(t);
      list = readCameras(comp);
      mv = { id: nextCamId(list), name: recipeId + " cam", type: type || "push", mode: "2d", target: layer || "", t0: t, duration: dCam, strength: 100, style: currentStyle(), ox: 0, oy: 0 };
      runCamera(comp, mv);
      writeCameras(comp, list.concat([mv]));
      pushChild(kids, "cam", mv.id);
      t += dCam;
    }
    function doInt(spec) {
      var it, list;
      if (!spec.cursor || !inputs[spec.cursor]) return;
      if (spec.target && !inputs[spec.target] && spec.kind !== "toast") return;
      t = beatSnap(t);
      list = readInteractions(comp);
      it = { id: nextIntId(list), name: recipeId + " " + (spec.kind || "click"), action: spec.kind || "click", recipe: spec.recipe || "", cursor: inputs[spec.cursor] || "", target: inputs[spec.target] || "", source: inputs[spec.source] || "", dest: inputs[spec.dest] || "", response: inputs[spec.response] || "", toast: inputs[spec.toast] || "", metric: inputs[spec.metric] || "", path: "natural", point: "center", ox: 0, oy: 0, t0: t, duration: dInt, style: currentStyle() };
      runInteraction(comp, it);
      writeInteractions(comp, list.concat([it]));
      pushChild(kids, "int", it.id);
      t += dInt;
    }
    function doTrans(kind, a, b) {
      var tr, list;
      if (!inputs[a] || !inputs[b]) return;
      t = beatSnap(t);
      list = readTransitions(comp);
      tr = { id: nextTransId(list), name: recipeId + " trans", type: kind || "clean", from: inputs[a], to: inputs[b], ta: "", tb: "", dir: "left", align: "center", t0: t, duration: dTr, strength: 100, style: currentStyle() };
      runTransition(comp, tr);
      writeTransitions(comp, list.concat([tr]));
      pushChild(kids, "trans", tr.id);
      t += dTr;
    }
    if (recipeId === "saas_hero") { doType("eyebrow", "word"); doType("title", "hookClean"); doType("subtitle", "line"); doCam("dashboard", "push"); doType("cta", "word"); doInt({ kind: "click", cursor: "cursor", target: "cta" }); }
    else if (recipeId === "saas_dashboard") { doType("title", "word"); doCam("dashboard", "push"); doCam("feature", "focus"); doType("metric", "counter"); doType("cta", "word"); }
    else if (recipeId === "saas_feature") { doType("title", "word"); doCam("feature", "focus"); doInt({ kind: "click", cursor: "cursor", target: "feature" }); doInt({ kind: "open", cursor: "cursor", target: "feature", response: "response" }); }
    else if (recipeId === "saas_speedrun") { doInt({ kind: "click", cursor: "cursor", target: "t1" }); doInt({ kind: "click", cursor: "cursor", target: "t2" }); doInt({ kind: "click", cursor: "cursor", target: "t3" }); doType("cta", "word"); }
    else if (recipeId === "saas_workflow") { doInt({ kind: "click", cursor: "cursor", target: "t1" }); doInt({ kind: "click", cursor: "cursor", target: "t2" }); doInt({ kind: "drag", cursor: "cursor", source: "t2", dest: "t3" }); doInt({ kind: "toast", toast: "toast" }); doType("metric", "counter"); }
    else if (recipeId === "saas_before_after") { doType("beforeLabel", "word"); doTrans("clean", "from", "to"); doType("afterLabel", "hookClean"); doType("metric", "counter"); }
    else if (recipeId === "saas_metric") { doType("title", "word"); doType("metric", "counter"); doCam("metric", "punch"); addCompMarker(comp, t, "EVO_SEQ_PAYOFF"); }
    else if (recipeId === "social_hook") { doType("title", "hookSlam"); doType("keyword", "punch"); doCam("product", "snap"); }
    else if (recipeId === "social_problem") { doType("problem", "line"); doTrans("clean", "problem", "solution"); doType("solution", "hookClean"); doType("cta", "word"); }
    else if (recipeId === "social_benefits") { doType("b1", "word"); doType("b2", "word"); doType("b3", "word"); doType("cta", "punch"); }
    else if (recipeId === "pro_talking") { doType("name", "lowerThird"); doType("role", "word"); doCam("person", "microPush"); doType("caption", "line"); }
    else if (recipeId === "hyb_founder_product") { doCam("person", "microPush"); doTrans("personProduct", "person", "dashboard"); doCam("feature", "focus"); doInt({ kind: "click", cursor: "cursor", target: "feature" }); doType("cta", "word"); }
    else if (recipeId === "hyb_product_founder") { doCam("dashboard", "push"); doTrans("productPerson", "dashboard", "person"); doType("cta", "word"); }
    else if (recipeId === "hyb_person_demo") { doCam("person", "microPush"); doTrans("personProduct", "person", "dashboard"); doInt({ kind: "click", cursor: "cursor", target: "feature" }); doTrans("productPerson", "dashboard", "person"); doType("cta", "word"); }
    else if (recipeId === "brand_outro") { doType("cta", "word"); doCam("logo", "microPush"); }
    else if (recipeId === "brand_sting") { doType("wordmark", "word"); doCam("logo", "punch"); }
    else if (recipeId === "brand_launch") { doType("title", "hookSlam"); doCam("dashboard", "push"); doInt({ kind: "click", cursor: "cursor", target: "f1" }); doInt({ kind: "click", cursor: "cursor", target: "f2" }); doType("metric", "counter"); doType("cta", "word"); doCam("logo", "microPush"); }
    else if (recipeId === "crm_won") { doInt({ kind: "drag", recipe: "dealWon", cursor: "cursor", source: "deal", dest: "won", toast: "toast", metric: "metric" }); doType("metric", "counter"); doType("cta", "word"); addCompMarker(comp, t, "EVO_SEQ_PAYOFF"); }
    else if (recipeId === "crm_lead_deal") { doInt({ kind: "open", recipe: "openLead", cursor: "cursor", target: "lead", response: "drawer" }); doInt({ kind: "click", cursor: "cursor", target: "deal" }); }
    else if (recipeId === "crm_followup") { doInt({ kind: "click", recipe: "whatsapp", cursor: "cursor", target: "lead" }); doInt({ kind: "toast", toast: "toast" }); }
    else if (recipeId === "crm_pipeline") { doInt({ kind: "click", cursor: "cursor", target: "t1" }); doInt({ kind: "click", cursor: "cursor", target: "t2" }); doInt({ kind: "click", cursor: "cursor", target: "t3" }); }
    else if (recipeId === "crm_ask") { doInt({ kind: "open", recipe: "askEvo", cursor: "cursor", target: "ask", response: "panel" }); doType("response", "line"); }
    else if (recipeId === "crm_kpi") { doCam("dashboard", "push"); doType("metric", "counter"); doType("cta", "word"); }
    else { doType("title", "word"); }
    addCompMarker(comp, t0, "EVO_SEQ_START");
    addCompMarker(comp, t, "EVO_SEQ_END");
    return { children: kids, end: t };
  }
  function resetSeqOwned(comp, seq) {
    var parts = String(seq.children || "").split(","), i, pair, kind, id;
    for (i = 0; i < parts.length; i++) {
      pair = parts[i].split(":");
      kind = pair[0]; id = pair[1];
      if (!id) continue;
      if (kind === "type") resetTypeOwned(comp, id);
      if (kind === "cam") resetCameraOwned(comp, id);
      if (kind === "int") resetInteractionOwned(comp, id);
      if (kind === "trans") resetTransitionOwned(comp, id);
    }
  }


  function editStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_EDIT_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_EDIT_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|editstore");
    return layer;
  }
  function readEdits(comp) {
    var layer = editStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeEdits(comp, list) {
    var layer = editStoreLayer(comp, true), parts = [], i, ed, shots = [], j, sh;
    for (i = 0; i < list.length; i++) {
      ed = list[i];
      shots = [];
      for (j = 0; j < (ed.shots || []).length; j++) {
        sh = ed.shots[j];
        shots.push("{id:" + jsStr(sh.id) + ",name:" + jsStr(sh.name) + ",purpose:" + jsStr(sh.purpose) + ",recipe:" + jsStr(sh.recipe) + ",ph:" + (sh.placeholder ? "1" : "0") + "}");
      }
      parts.push("{id:" + jsStr(ed.id) + ",name:" + jsStr(ed.name) + ",format:" + jsStr(ed.format) + ",target:" + Number(ed.target || 15) + ",rhythm:" + jsStr(ed.rhythm || "beat") + ",status:" + jsStr(ed.status || "READY") + ",shots:[" + shots.join(",") + "],children:" + jsStr((ed.children || []).join(",")) + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextEditId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_EDIT_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_EDIT_" + n;
  }
  function structurePurposes(key) {
    if (key === "problem_solution") return ["PROBLEM", "PRODUCT", "PROOF", "CTA"];
    if (key === "feature_demo") return ["FEATURE", "INTERACTION", "PROOF", "CTA"];
    if (key === "fast_tutorial") return ["HOOK", "FEATURE", "FEATURE", "PROOF", "CTA"];
    if (key === "product_proof") return ["HOOK", "INTERACTION", "METRIC", "CTA"];
    if (key === "founder_product") return ["A-ROLL", "PRODUCT", "INTERACTION", "PROOF", "CTA"];
    if (key === "case_study") return ["PROBLEM", "PRODUCT", "PROOF", "METRIC", "CTA"];
    if (key === "testimonial") return ["A-ROLL", "PROOF", "CTA"];
    if (key === "announcement") return ["HOOK", "PRODUCT", "CTA", "LOGO"];
    if (key === "custom") return ["CUSTOM"];
    return ["HOOK", "PRODUCT", "FEATURE", "PROOF", "CTA", "LOGO"];
  }
  function purposeRecipe(p) {
    if (p === "HOOK") return "social_hook";
    if (p === "PROBLEM") return "social_problem";
    if (p === "PRODUCT") return "saas_dashboard";
    if (p === "FEATURE") return "saas_feature";
    if (p === "INTERACTION") return "saas_workflow";
    if (p === "PROOF") return "crm_won";
    if (p === "METRIC") return "saas_metric";
    if (p === "CTA" || p === "LOGO") return "brand_outro";
    if (p === "A-ROLL") return "pro_talking";
    return "saas_hero";
  }
  function ensurePlaceholder(comp, shotId, kind) {
    var name = "EVO_PLACEHOLDER_" + shotId + "_" + String(kind || "ASSET"), layer = findLayer(comp, name);
    if (layer) return layer;
    layer = comp.layers.addSolid([0.15, 0.15, 0.18], name, Math.max(320, Math.round(comp.width * 0.6)), Math.max(180, Math.round(comp.height * 0.28)), 1);
    layer.name = name;
    writeComment(layer, MOTION_TAG + "|placeholder|" + shotId);
    try {
      var t = comp.layers.addText(shotId + "\n" + kind + "\nReplace Me");
      t.name = name + "_LBL";
      t.parent = layer;
      t.transform.position.setValue([0, 0]);
      writeComment(t, MOTION_TAG + "|placeholder|" + shotId);
    } catch (e) {}
    return layer;
  }
  function recipeReq(id) {
    var all = recipeCatalog(), i;
    for (i = 0; i < all.length; i++) if (all[i].id === id) return all[i].req || [];
    return [];
  }


  function proStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_PRO_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_PRO_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|prostore");
    return layer;
  }
  function readPros(comp) {
    var layer = proStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writePros(comp, list) {
    var layer = proStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",type:" + jsStr(it.type) + ",person:" + jsStr(it.person) + ",layout:" + jsStr(it.layout) + ",product:" + jsStr(it.product || "") + ",name:" + jsStr(it.nameL || "") + ",role:" + jsStr(it.role || "") + ",status:" + jsStr(it.status || "READY") + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextProId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_PRO_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_PRO_" + n;
  }
  function isAudioLayer(layer) {
    var n = lower(layer.name || "");
    if (n.indexOf("audio") !== -1 || n.indexOf("vo") !== -1 || n.indexOf("voice") !== -1 || n.indexOf("music") !== -1) return true;
    try { if (layer.hasVideo === false && layer.hasAudio === true) return true; } catch (e) {}
    return false;
  }
  function proZone(comp, layout) {
    var name = "EVO_SKIP_PRO_ZONE", g = findLayer(comp, name), x, y, w, h;
    if (layout === "left") { x = comp.width * 0.58; y = comp.height * 0.18; w = comp.width * 0.36; h = comp.height * 0.64; }
    else if (layout === "right") { x = comp.width * 0.06; y = comp.height * 0.18; w = comp.width * 0.36; h = comp.height * 0.64; }
    else { x = comp.width * 0.08; y = comp.height * 0.72; w = comp.width * 0.84; h = comp.height * 0.18; }
    if (!g) {
      g = comp.layers.addSolid([0.2, 0.5, 0.6], name, Math.max(8, Math.round(w)), Math.max(8, Math.round(h)), 1);
      g.name = name;
      try { g.guideLayer = true; } catch (e0) {}
      writeComment(g, MOTION_TAG + "|prozone");
    }
    g.transform.position.setValue([x + w / 2, y + h / 2]);
    return g;
  }
  function framePerson(comp, person, layout) {
    var pos = person.transform.position, sc = person.transform.scale, cx = comp.width / 2, cy = comp.height / 2, s = 100;
    if (layout === "centered") { s = 108; }
    if (layout === "left") { cx = comp.width * 0.32; s = 112; }
    if (layout === "right") { cx = comp.width * 0.68; s = 112; }
    if (layout === "top") { cy = comp.height * 0.28; s = 110; }
    if (layout === "split50") { cx = comp.width * 0.25; }
    pos.setValue([cx, cy]);
    sc.setValue([s, s]);
    markIntLayer(person, "PROFRAME");
  }
  function addProPip(comp, product, layout, id) {
    var name = "[EVO PRO] Product PIP " + id, wrap = findLayer(comp, name);
    var px = layout === "left" ? comp.width * 0.78 : comp.width * 0.22;
    if (!product) return null;
    if (wrap) return wrap;
    try { product.transform.position.setValue([px, comp.height * 0.5]); product.transform.scale.setValue([38, 38]); } catch (e) {}
    markIntLayer(product, id);
    return product;
  }
  function addProDim(comp, id, t0) {
    var name = "[EVO PRO] Dim " + id, s = findLayer(comp, name);
    if (s) return s;
    s = comp.layers.addSolid([0, 0, 0], name, comp.width, comp.height, 1);
    s.name = name;
    s.transform.opacity.setValue(28);
    writeComment(s, MOTION_TAG + "\nEVO_PRO|" + id);
    return s;
  }
  function resetProOwned(comp, id) {
    var i, layer, n;
    for (i = comp.numLayers; i >= 1; i--) {
      layer = comp.layer(i);
      n = layer.name || "";
      if (n.indexOf("[EVO PRO]") === 0 && (n.indexOf(id) !== -1 || id === "*")) {
        try { layer.remove(); } catch (e) {}
      }
    }
    removeNamed(comp, "EVO_SKIP_PRO_ZONE");
  }


  function sfxStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_SFX_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_SFX_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|sfxstore");
    return layer;
  }
  function readSfx(comp) {
    var layer = sfxStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeSfx(comp, list) {
    var layer = sfxStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",event:" + jsStr(it.event) + ",cat:" + jsStr(it.cat) + ",family:" + jsStr(it.family) + ",t:" + Number(it.t || 0) + ",gain:" + Number(it.gain || -12) + ",status:" + jsStr(it.status || "READY") + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextSfxId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_SFX_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_SFX_" + n;
  }
  function sfxSuggest(label) {
    var k = String(label || "").split(" ")[0];
    if (k === "EVO_CLICK" || k === "EVO_DOUBLE_CLICK") return "click";
    if (k === "EVO_DRAG_END") return "drop";
    if (k === "EVO_OPEN") return "uiOpen";
    if (k === "EVO_CLOSE") return "uiClose";
    if (k === "EVO_TOAST") return "notification";
    if (k === "EVO_METRIC" || k === "EVO_COUNTER_END" || k === "EVO_SEQ_PAYOFF") return "softImpact";
    if (k === "EVO_CAM_WHIP" || k === "EVO_TRANS_MID" || k === "EVO_TRANS_START") return "whoosh";
    if (k === "EVO_DROP") return "bassHit";
    if (k === "EVO_IMPACT" || k === "EVO_PAYOFF") return "impact";
    if (k === "EVO_TYPE_HIT") return "tick";
    if (k === "EVO_PRO_PRODUCT_IN") return "softWhoosh";
    return "none";
  }
  function sfxPriority(cat) {
    if (cat === "bassHit") return 100;
    if (cat === "impact") return 90;
    if (cat === "drop") return 80;
    if (cat === "whoosh" || cat === "fastWhoosh") return 70;
    if (cat === "softImpact") return 60;
    if (cat === "notification") return 40;
    if (cat === "click") return 30;
    return 10;
  }
  function collectSemanticEvents(comp) {
    var out = [], i, m, t, label;
    try {
      if (!comp.marker || !comp.marker.numKeys) return out;
      for (i = 1; i <= comp.marker.numKeys; i++) {
        t = comp.marker.keyTime(i);
        m = comp.marker.keyValue(i);
        label = String(m.comment || m);
        if (label.indexOf("EVO_") === 0) out.push({ t: t, label: label });
      }
    } catch (e) {}
    return out;
  }
  function densityAllows(cat, density) {
    if (cat === "none") return false;
    if (density === "low") return cat === "bassHit" || cat === "impact" || cat === "drop" || cat === "logoHit";
    if (density === "high") return true;
    return cat !== "tick" && cat !== "pop";
  }
  function planSfxCues(comp, family, density, intensity) {
    var ev = collectSemanticEvents(comp), i, cat, plan = [], applied = [], lastT = -999, lastPri = 0;
    for (i = 0; i < ev.length; i++) {
      cat = sfxSuggest(ev[i].label);
      if (!densityAllows(cat, density)) continue;
      plan.push({ t: ev[i].t, event: ev[i].label, cat: cat });
    }
    plan.sort(function (a, b) { return a.t - b.t; });
    for (i = 0; i < plan.length; i++) {
      if (plan[i].t - lastT <= 3 * comp.frameDuration && sfxPriority(plan[i].cat) <= lastPri) continue;
      applied.push(plan[i]);
      lastT = plan[i].t;
      lastPri = sfxPriority(plan[i].cat);
    }
    return { plan: plan, applied: applied };
  }
  function placeSfxMarker(comp, cue) {
    addCompMarker(comp, cue.t, "EVO_SFX " + cue.id + " " + cue.cat);
  }
  function resetSfxOwned(comp, id) {
    var i, layer, n;
    for (i = comp.numLayers; i >= 1; i--) {
      layer = comp.layer(i);
      n = layer.name || "";
      if (n.indexOf("[EVO SFX") === 0 && (!id || n.indexOf(id) !== -1)) {
        try { layer.remove(); } catch (e) {}
      }
    }
  }


  function brandStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_BRAND_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_BRAND_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|brandstore");
    return layer;
  }
  function readBrand(comp) {
    var layer = brandStoreLayer(comp, false), raw, data;
    if (!layer) return { profile: "evotechly", mode: "product", energy: "standard", context: "dark", link: "linked" };
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.active || { profile: "evotechly", mode: "product", energy: "standard", context: "dark", link: "linked" };
    } catch (e) { return { profile: "evotechly", mode: "product", energy: "standard", context: "dark", link: "linked" }; }
  }
  function writeBrand(comp, active) {
    var layer = brandStoreLayer(comp, true);
    try { layer.text.sourceText.setValue("{active:{profile:" + jsStr(active.profile) + ",mode:" + jsStr(active.mode) + ",energy:" + jsStr(active.energy) + ",context:" + jsStr(active.context || "dark") + ",link:" + jsStr(active.link || "linked") + "}}"); } catch (e) {}
  }
  function brandAccent(profile, context) {
    if (profile === "evocrm" || profile === "evotechly") return context === "light" ? [0.925, 0.376, 0.145] : [1, 0.416, 0];
    return [0.06, 0.30, 0.36];
  }
  function countMarkersPrefix(comp, prefixes) {
    var n = 0, i, label, p;
    try {
      if (!comp.marker || !comp.marker.numKeys) return 0;
      for (i = 1; i <= comp.marker.numKeys; i++) {
        label = String(comp.marker.keyValue(i).comment || comp.marker.keyValue(i));
        for (p = 0; p < prefixes.length; p++) if (label.indexOf(prefixes[p]) === 0) n++;
      }
    } catch (e) {}
    return n;
  }


  function qaStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_QA_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_QA_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|qastore");
    return layer;
  }
  function writeQa(comp, text) {
    var layer = qaStoreLayer(comp, true);
    try { layer.text.sourceText.setValue(text); } catch (e) {}
  }
  function countNamePrefix(comp, prefix) {
    var n = 0, i;
    for (i = 1; i <= comp.numLayers; i++) if ((comp.layer(i).name || "").indexOf(prefix) === 0) n++;
    return n;
  }
  function anySolo(comp) {
    var i;
    try { for (i = 1; i <= comp.numLayers; i++) if (comp.layer(i).solo) return true; } catch (e) {}
    return false;
  }
  function debugRenderable(comp) {
    var i, layer, n;
    for (i = 1; i <= comp.numLayers; i++) {
      layer = comp.layer(i);
      n = layer.name || "";
      if (n.indexOf("EVO_SKIP_") === 0) {
        try { if (layer.enabled && !layer.guideLayer) return true; } catch (e) {}
      }
    }
    return false;
  }
  function runPreflight(comp) {
    var issues = [], blockers = 0, warnings = 0, info = 0;
    function add(sev, cat, msg) {
      issues.push(sev + "  " + cat + "  " + msg);
      if (sev === "BLOCKER") blockers++;
      else if (sev === "WARNING") warnings++;
      else info++;
    }
    if (!comp) { add("BLOCKER", "Render", "No active composition."); return { status: "BLOCKED", issues: issues, blockers: blockers, warnings: warnings, info: info }; }
    if (countNamePrefix(comp, "EVO_PLACEHOLDER_") > 0) add("BLOCKER", "Edit", "Unresolved EVO_PLACEHOLDER_* — delivery blocked.");
    if (debugRenderable(comp)) add("BLOCKER", "Render", "A Motion OS store/guide layer is renderable. Mark it Guide / disable.");
    if (anySolo(comp)) add("BLOCKER", "Render", "A layer is soloed.");
    if (comp.frameRate && [24, 25, 30, 50, 60].indexOf(Math.round(comp.frameRate)) === -1) add("WARNING", "Render", "Frame rate " + comp.frameRate + " is unverified in this release.");
    if (comp.numLayers > 200) add("INFO", "Performance", comp.numLayers + " layers in this comp.");
    add("INFO", "Audio", "Final loudness/mix must be reviewed manually.");
    add("INFO", "Release", "Motion OS 0.21.0-rc1. v1.0.0 gated on AE host verification.");
    var status = blockers ? "BLOCKED" : (warnings ? "READY WITH WARNINGS" : "READY");
    return { status: status, issues: issues, blockers: blockers, warnings: warnings, info: info };
  }


  function dirStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_DIR_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_DIR_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|dirstore");
    return layer;
  }
  function writeDir(comp, text) {
    var layer = dirStoreLayer(comp, true);
    try { layer.text.sourceText.setValue(text); } catch (e) {}
  }
  function markerHas(comp, prefix) {
    var i, label;
    try {
      if (!comp.marker || !comp.marker.numKeys) return false;
      for (i = 1; i <= comp.marker.numKeys; i++) {
        label = String(comp.marker.keyValue(i).comment || "");
        if (label.indexOf(prefix) === 0) return true;
      }
    } catch (e) {}
    return false;
  }
  function countPrefix(comp, prefix) {
    var n = 0, i, label;
    try {
      if (!comp.marker || !comp.marker.numKeys) return 0;
      for (i = 1; i <= comp.marker.numKeys; i++) {
        label = String(comp.marker.keyValue(i).comment || "");
        if (label.indexOf(prefix) === 0) n++;
      }
    } catch (e) {}
    return n;
  }
  function directorAnalyze(comp, goal, mode) {
    var recs = [], punches, sfx, hasCta, hasPayoff, hasHook;
    if (!comp) return [{ action: "Open a composition", reason: "No active comp.", engine: "none" }];
    punches = countPrefix(comp, "EVO_CAM_");
    sfx = countPrefix(comp, "EVO_SFX");
    hasCta = markerHas(comp, "EVO_SEQ_CTA") || markerHas(comp, "EVO_CTA") || markerHas(comp, "EVO_PRO_CTA");
    hasPayoff = markerHas(comp, "EVO_SEQ_PAYOFF") || markerHas(comp, "EVO_PAYOFF") || markerHas(comp, "EVO_DROP");
    hasHook = markerHas(comp, "EVO_TYPE_") || markerHas(comp, "EVO_EDIT_START");
    if (goal === "Social Ad" && !hasCta) recs.push({ action: "Add CTA before logo", engine: "recipe", reason: "Social Ad has no CTA marker." });
    if (!hasPayoff) recs.push({ action: "Metric Focus on payoff", engine: "camera", reason: "No payoff / drop marker." });
    if (!hasHook && goal !== "Professional") recs.push({ action: "Hook Clean on title", engine: "type", reason: "No opening type marker." });
    if (punches >= 3) recs.push({ action: "Remove extra camera punches", engine: "camera", reason: punches + " camera events flatten hierarchy." });
    if (sfx >= 8) recs.push({ action: "Remove SFX from CTA", engine: "sfx", reason: "SFX density is high." });
    if (mode === "Professional") recs.push({ action: "Micro Push only; no SFX on A-roll", engine: "pro", reason: "Professional mode favors restraint." });
    if (!recs.length) recs.push({ action: "Do nothing", engine: "none", reason: "Structure already has hierarchy. Do not invent work." });
    return recs;
  }


  function varStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_VAR_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_VAR_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|varstore");
    return layer;
  }
  function readVars(comp) {
    var layer = varStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeVars(comp, list) {
    var layer = varStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",fmt:" + jsStr(it.fmt) + ",dur:" + jsStr(it.dur) + ",lang:" + jsStr(it.lang) + ",hook:" + jsStr(it.hook) + ",status:" + jsStr(it.status) + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextVarId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_VARIANT_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_VARIANT_" + n;
  }
  function adaptPlan(fromFmt, toFmt, targetDur) {
    var lines = [];
    if (fromFmt !== toFmt) {
      if ((fromFmt === "16:9" && toFmt === "9:16") || (fromFmt === "16:9" && toFmt === "4:5")) {
        lines.push("REBUILD Person/Product split → stacked");
        lines.push("REFRAME product target (keep cursor alignment)");
        lines.push("REFLOW captions → lower safe zone");
      } else if (fromFmt === "9:16" && toFmt === "16:9") {
        lines.push("REBUILD stacked → Person L / Product R");
      } else {
        lines.push("REFRAME product + captions");
      }
      lines.push("KEEP logo proportions — no stretch");
    } else lines.push("KEEP format");
    if (targetDur === "6 sec") {
      lines.push("KEEP Hook / Interaction / Payoff / CTA");
      lines.push("REMOVE optional features");
      lines.push("SHORTEN dashboard hold — no 250% stretch");
    }
    return lines;
  }


  function astStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_AST_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_AST_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|aststore");
    return layer;
  }
  function readAssets(comp) {
    var layer = astStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeAssets(comp, list) {
    var layer = astStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",key:" + jsStr(it.key) + ",name:" + jsStr(it.name) + ",lang:" + jsStr(it.lang) + ",fmt:" + jsStr(it.fmt) + ",status:" + jsStr(it.status) + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextAssetId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_ASSET_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_ASSET_" + n;
  }
  function guessKey(name) {
    var n = lower(name || "");
    if (n.indexOf("logo") !== -1 && n.indexOf("dark") !== -1) return "LOGO_DARK";
    if (n.indexOf("logo") !== -1) return "LOGO_LIGHT";
    if (n.indexOf("pipeline") !== -1) return "PRODUCT_PIPELINE";
    if (n.indexOf("founder") !== -1) return "FOUNDER_MAIN";
    if (n.indexOf("ask") !== -1) return "PRODUCT_ASK_EVO";
    if (n.indexOf("metric") !== -1) return "PRODUCT_METRIC";
    return "PRODUCT_MAIN";
  }


  function revStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_REV_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_REV_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|revstore");
    return layer;
  }
  function readRevs(comp) {
    var layer = revStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeRevs(comp, list) {
    var layer = revStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",t:" + Number(it.t || 0) + ",pri:" + jsStr(it.pri) + ",status:" + jsStr(it.status) + ",text:" + jsStr(it.text) + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextCommentId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO_COMMENT_", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO_COMMENT_" + n;
  }


  function prodStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_PROD_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_PROD_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|prodstore");
    return layer;
  }
  function readProd(comp) {
    var layer = prodStoreLayer(comp, false), raw, data;
    if (!layer) return [];
    try {
      raw = layer.text.sourceText.value;
      if (raw && raw.text !== undefined) raw = raw.text;
      data = eval("(" + String(raw || "{}") + ")");
      return data.list || [];
    } catch (e) { return []; }
  }
  function writeProd(comp, list) {
    var layer = prodStoreLayer(comp, true), parts = [], i, it;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      parts.push("{id:" + jsStr(it.id) + ",title:" + jsStr(it.title) + ",type:" + jsStr(it.type) + ",status:" + jsStr(it.status) + "}");
    }
    try { layer.text.sourceText.setValue("{list:[" + parts.join(",") + "]}"); } catch (e) {}
  }
  function nextContentId(list) {
    var max = 0, i, n;
    for (i = 0; i < list.length; i++) {
      n = parseInt(String(list[i].id || "").replace("EVO-VID-", ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    n = String(max + 1);
    while (n.length < 3) n = "0" + n;
    return "EVO-VID-" + n;
  }


  function anStoreLayer(comp, create) {
    var i, layer;
    for (i = 1; i <= comp.numLayers; i++) {
      if (comp.layer(i).name === "EVO_SKIP_AN_STORE") return comp.layer(i);
    }
    if (!create) return null;
    layer = comp.layers.addText("{}");
    layer.name = "EVO_SKIP_AN_STORE";
    try { layer.guideLayer = true; } catch (e0) {}
    try { layer.shy = true; } catch (e1) {}
    try { layer.enabled = false; } catch (e2) {}
    writeComment(layer, MOTION_TAG + "|anstore");
    return layer;
  }
  function writeAn(comp, text) {
    var layer = anStoreLayer(comp, true);
    try { layer.text.sourceText.setValue(text); } catch (e) {}
  }

  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Evotechly Motion OS", undefined, { resizeable: true });
    win.orientation = "column"; win.alignChildren = ["fill", "top"]; win.spacing = 6; win.margins = 10;
    win.add("statictext", undefined, "EVOTECHLY MOTION OS  ·  v0.32 Reliability");
    var tabs = win.add("tabbedpanel");
    tabs.alignChildren = ["fill", "fill"];
    tabs.alignment = ["fill", "fill"];
    var tabHome = tabs.add("tab", undefined, "Home");
    var tabAuto = tabs.add("tab", undefined, "Auto");
    var tabCore = tabs.add("tab", undefined, "System");
    var tabMotion = tabs.add("tab", undefined, "Motion");
    var tabAnimate = tabs.add("tab", undefined, "Animate");
    var tabPolish = tabs.add("tab", undefined, "Polish");
    var tabPerson = tabs.add("tab", undefined, "Person");
    var tabCaptions = tabs.add("tab", undefined, "Captions");
    var tabRecipes = tabs.add("tab", undefined, "Recipes");
    var tabAssets = tabs.add("tab", undefined, "Assets");
    var tabMaster = tabs.add("tab", undefined, "Master");
    var tabInteract = tabs.add("tab", undefined, "Interact");
    var tabCamera = tabs.add("tab", undefined, "Camera");
    var tabTrans = tabs.add("tab", undefined, "Transition");
    var tabRhythm = tabs.add("tab", undefined, "Rhythm");
    var tabType = tabs.add("tab", undefined, "Type");
    var tabSeq = tabs.add("tab", undefined, "Recipes");
    var tabEdit = tabs.add("tab", undefined, "Edit");
    var tabPro = tabs.add("tab", undefined, "Pro");
    var tabSfx = tabs.add("tab", undefined, "SFX");
    var tabBrand = tabs.add("tab", undefined, "Brand");
    var tabQa = tabs.add("tab", undefined, "QA");
    var tabDir = tabs.add("tab", undefined, "Director");
    var tabVar = tabs.add("tab", undefined, "Variants");
    var tabAst = tabs.add("tab", undefined, "Assets");
    var tabRev = tabs.add("tab", undefined, "Review");
    var tabProd = tabs.add("tab", undefined, "Prod");
    var tabAn = tabs.add("tab", undefined, "Analytics");
    tabHome.orientation = "column"; tabHome.alignChildren = ["fill", "top"]; tabHome.spacing = 6;
    tabAuto.orientation = "column"; tabAuto.alignChildren = ["fill", "top"]; tabAuto.spacing = 6;
    tabCore.orientation = "column"; tabCore.alignChildren = ["fill", "top"]; tabCore.spacing = 6;
    tabMotion.orientation = "column"; tabMotion.alignChildren = ["fill", "top"]; tabMotion.spacing = 6;
    tabAnimate.orientation = "column"; tabAnimate.alignChildren = ["fill", "top"]; tabAnimate.spacing = 6;
    tabPolish.orientation = "column"; tabPolish.alignChildren = ["fill", "top"]; tabPolish.spacing = 6;
    tabPerson.orientation = "column"; tabPerson.alignChildren = ["fill", "top"]; tabPerson.spacing = 6;
    tabCaptions.orientation = "column"; tabCaptions.alignChildren = ["fill", "top"]; tabCaptions.spacing = 6;
    tabRecipes.orientation = "column"; tabRecipes.alignChildren = ["fill", "top"]; tabRecipes.spacing = 6;
    tabAssets.orientation = "column"; tabAssets.alignChildren = ["fill", "top"]; tabAssets.spacing = 6;
    tabMaster.orientation = "column"; tabMaster.alignChildren = ["fill", "top"]; tabMaster.spacing = 6;
    tabInteract.orientation = "column"; tabInteract.alignChildren = ["fill", "top"]; tabInteract.spacing = 6;
    tabCamera.orientation = "column"; tabCamera.alignChildren = ["fill", "top"]; tabCamera.spacing = 6;
    tabTrans.orientation = "column"; tabTrans.alignChildren = ["fill", "top"]; tabTrans.spacing = 6;
    tabRhythm.orientation = "column"; tabRhythm.alignChildren = ["fill", "top"]; tabRhythm.spacing = 6;
    tabType.orientation = "column"; tabType.alignChildren = ["fill", "top"]; tabType.spacing = 6;
    tabSeq.orientation = "column"; tabSeq.alignChildren = ["fill", "top"]; tabSeq.spacing = 6;
    tabEdit.orientation = "column"; tabEdit.alignChildren = ["fill", "top"]; tabEdit.spacing = 6;
    tabPro.orientation = "column"; tabPro.alignChildren = ["fill", "top"]; tabPro.spacing = 6;
    tabSfx.orientation = "column"; tabSfx.alignChildren = ["fill", "top"]; tabSfx.spacing = 6;
    tabBrand.orientation = "column"; tabBrand.alignChildren = ["fill", "top"]; tabBrand.spacing = 6;
    tabQa.orientation = "column"; tabQa.alignChildren = ["fill", "top"]; tabQa.spacing = 6;
    tabDir.orientation = "column"; tabDir.alignChildren = ["fill", "top"]; tabDir.spacing = 6;
    tabVar.orientation = "column"; tabVar.alignChildren = ["fill", "top"]; tabVar.spacing = 6;
    tabAst.orientation = "column"; tabAst.alignChildren = ["fill", "top"]; tabAst.spacing = 6;
    tabRev.orientation = "column"; tabRev.alignChildren = ["fill", "top"]; tabRev.spacing = 6;
    tabProd.orientation = "column"; tabProd.alignChildren = ["fill", "top"]; tabProd.spacing = 6;
    tabAn.orientation = "column"; tabAn.alignChildren = ["fill", "top"]; tabAn.spacing = 6;
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
    var preflightBtn = buttons.add("button", undefined, "Preflight");
    var resetBtn = buttons.add("button", undefined, "Reset motion");
    tabMotion.add("statictext", undefined, "Names: Title, Card, CTA, Logo, Caption. Fit footage = cover crop.", { multiline: true });
    tabAnimate.add("statictext", undefined, "Selected layers. No role names. Keyframe mode.", { multiline: true });
    var anModeRow = tabAnimate.add("group"); anModeRow.add("statictext", undefined, "Mode");
    var anMode = anModeRow.add("dropdownlist", undefined, ["In", "Out", "Both"]); anMode.selection = 0; anMode.alignment = ["fill", "center"];
    var anDirRow = tabAnimate.add("group"); anDirRow.add("statictext", undefined, "Direction");
    var anDir = anDirRow.add("dropdownlist", undefined, ["Up", "Down", "Left", "Right", "Up Left", "Up Right", "Down Left", "Down Right", "Scale"]); anDir.selection = 0; anDir.alignment = ["fill", "center"];
    var anEaseRow = tabAnimate.add("group"); anEaseRow.add("statictext", undefined, "Easing");
    var anEase = anEaseRow.add("dropdownlist", undefined, ["Apple Ease", "Soft Ease", "Expo", "Spring"]); anEase.selection = 0; anEase.alignment = ["fill", "center"];
    var anSeqRow = tabAnimate.add("group"); anSeqRow.add("statictext", undefined, "Sequence");
    var anSeq = anSeqRow.add("dropdownlist", undefined, ["Index order", "Top to bottom", "Bottom to top"]); anSeq.selection = 0; anSeq.alignment = ["fill", "center"];
    var anDurRow = tabAnimate.add("group"); anDurRow.add("statictext", undefined, "Duration s");
    var anDur = anDurRow.add("edittext", undefined, "0.42"); anDur.characters = 6;
    var anStagRow = tabAnimate.add("group"); anStagRow.add("statictext", undefined, "Stagger s");
    var anStag = anStagRow.add("edittext", undefined, "0.06"); anStag.characters = 6;
    var autoApplyBtn = tabAnimate.add("button", undefined, "Auto-Animate selected");
    tabAnimate.add("statictext", undefined, "Does not rewrite Scan → Apply. Expression In/Out is v0.9.", { multiline: true });
    tabAssets.add("statictext", undefined, "Local repo assets only. No CDN.", { multiline: true });
    var assetList = tabAssets.add("dropdownlist", undefined, ["Hook caption", "Word-by-word / kinetic", "Two-line AR+EN", "Lower-third", "Subs burn-in"]);
    assetList.selection = 0; assetList.alignment = ["fill", "center"];
    var assetArTop = tabAssets.add("checkbox", undefined, "AR on top (else EN on top)"); assetArTop.value = true;
    var assetApplyBtn = tabAssets.add("button", undefined, "Apply selected asset");
    tabAssets.add("statictext", undefined, "SRT samples: examples/captions/demo-en.srt, demo-ar.srt, demo-ar-en.srt", { multiline: true });
    var assetSrtBtn = tabAssets.add("button", undefined, "Import SRT");
    tabAssets.add("statictext", undefined, "Companions (official): TFM Liquid Glass, Comp Exporter, Saber, QCA3, Displacer, AC.", { multiline: true });


    tabInteract.add("statictext", undefined, "Interactions start at the CTI. Compiler Scan is unchanged.", { multiline: true });
    function iRow(label, items) {
      var g = tabInteract.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var iAction = iRow("Action", ["Move", "Hover", "Click", "Double Click", "Drag", "Open UI", "Close UI", "Select", "Toggle", "Toast", "Metric", "Type Text", "Scroll", "Highlight"]);
    var iRecipe = iRow("Recipe", ["(none)", "Open Lead", "Log Activity", "Move Deal", "Deal Won", "Search", "Ask Evo", "WhatsApp"]);
    var iPath = iRow("Path", ["Natural", "Soft Curve", "Straight", "Snap"]);
    var iPoint = iRow("Point", ["Center", "Top Left", "Top Right", "Bottom Left", "Bottom Right"]);
    var iDurG = tabInteract.add("group"); iDurG.add("statictext", undefined, "Duration").preferredSize = [72, 18];
    var iDur = iDurG.add("edittext", undefined, "0.60"); iDur.characters = 6;
    var iOffG = tabInteract.add("group"); iOffG.add("statictext", undefined, "Offset XY").preferredSize = [72, 18];
    var iOx = iOffG.add("edittext", undefined, "0"); iOx.characters = 5;
    var iOy = iOffG.add("edittext", undefined, "0"); iOy.characters = 5;
    var iUseSelCursor = tabInteract.add("button", undefined, "Use selected as Cursor");
    var iUseSelTarget = tabInteract.add("button", undefined, "Use selected as Target");
    var iUseSelSource = tabInteract.add("button", undefined, "Use selected as Source");
    var iUseSelDest = tabInteract.add("button", undefined, "Use selected as Dest / Response / Toast / Metric");
    var iStatus = tabInteract.add("statictext", undefined, "Cursor: —   Target: —", { multiline: true });
    iStatus.preferredSize = [320, 48];
    var iList = tabInteract.add("listbox", undefined, []);
    iList.preferredSize = [320, 90];
    var iBtns = tabInteract.add("group");
    var iBuild = iBtns.add("button", undefined, "Build Interaction");
    var iUpdate = iBtns.add("button", undefined, "Update");
    var iReset = iBtns.add("button", undefined, "Reset");
    var iDelete = iBtns.add("button", undefined, "Delete");
    var iPreview = iBtns.add("button", undefined, "Preview range");
    var iPicks = { cursor: "", target: "", source: "", dest: "", response: "", toast: "", metric: "" };
    function firstSelectedName(comp) {
      var layers = selectedLayers(comp);
      return layers.length ? layers[0].name : "";
    }
    function refreshIntStatus() {
      iStatus.text = "Cursor: " + (iPicks.cursor || "—") + "\nTarget: " + (iPicks.target || "—") + "  Src: " + (iPicks.source || "—") + "  Dest: " + (iPicks.dest || "—") + "\nResponse: " + (iPicks.response || "—") + "  Toast: " + (iPicks.toast || "—") + "  Metric: " + (iPicks.metric || "—");
    }
    function refreshIntList() {
      var comp = activeComp(), list, i;
      iList.removeAll();
      if (!comp) return;
      list = readInteractions(comp);
      for (i = 0; i < list.length; i++) iList.add("item", list[i].id + "  " + list[i].name);
    }
    var actionIds = ["move", "hover", "click", "doubleClick", "drag", "open", "close", "select", "toggle", "toast", "metric", "type", "scroll", "highlight"];
    var recipeIds = ["", "openLead", "logActivity", "moveDeal", "dealWon", "search", "askEvo", "whatsapp"];
    var pathIds = ["natural", "soft", "straight", "snap"];
    var pointIds = ["center", "topLeft", "topRight", "bottomLeft", "bottomRight"];
    function currentInteractionDraft(comp) {
      var list = readInteractions(comp);
      return {
        id: nextIntId(list),
        name: (iRecipe.selection && iRecipe.selection.index > 0) ? iRecipe.selection.text : iAction.selection.text,
        action: actionIds[iAction.selection ? iAction.selection.index : 2] || "click",
        recipe: recipeIds[iRecipe.selection ? iRecipe.selection.index : 0] || "",
        cursor: iPicks.cursor,
        target: iPicks.target,
        source: iPicks.source,
        dest: iPicks.dest,
        response: iPicks.response || iPicks.dest,
        toast: iPicks.toast || iPicks.response,
        metric: iPicks.metric || iPicks.target,
        path: pathIds[iPath.selection ? iPath.selection.index : 0],
        point: pointIds[iPoint.selection ? iPoint.selection.index : 0],
        ox: parseFloat(iOx.text) || 0,
        oy: parseFloat(iOy.text) || 0,
        t0: comp.time,
        duration: parseFloat(iDur.text) || 0.6,
        style: currentStyle()
      };
    }
    function selectedStoredInteraction(comp) {
      var list = readInteractions(comp), idx;
      if (!iList.selection) return null;
      idx = iList.selection.index;
      return list[idx] || null;
    }


    tabCamera.add("statictext", undefined, "Default 2D Frame. Parent content to EVO_SKIP_CAM_FRAME or attach selected. Starts at CTI.", { multiline: true });
    function cRow(label, items) {
      var g = tabCamera.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var cMode = cRow("Mode", ["2D Frame", "3D Camera"]);
    var cMove = cRow("Move", ["Push In", "Pull Out", "Pan Left", "Pan Right", "Pan Up", "Pan Down", "Pan To Layer", "Snap Zoom", "Punch Zoom", "Focus Push", "Whip Left", "Whip Right", "Whip Up", "Whip Down", "Parallax", "Handheld", "Micro Push", "Slow Push", "Slow Pull", "Interview Drift", "Reframe Vertical"]);
    var cPreset = cRow("Preset", ["(none)", "Premium Push", "Dashboard Drift", "Feature Focus", "Metric Punch", "UI Snap", "Wide Reveal", "Hook Punch", "Fast Focus", "Snap In", "Snap Out", "Micro Push", "Slow Push", "Slow Pull", "Interview Drift", "Logo Breathe", "Logo Push"]);
    var cDurG = tabCamera.add("group"); cDurG.add("statictext", undefined, "Duration").preferredSize = [72, 18];
    var cDur = cDurG.add("edittext", undefined, "0.80"); cDur.characters = 6;
    var cStrG = tabCamera.add("group"); cStrG.add("statictext", undefined, "Strength").preferredSize = [72, 18];
    var cStr = cStrG.add("edittext", undefined, "100"); cStr.characters = 6;
    var cOffG = tabCamera.add("group"); cOffG.add("statictext", undefined, "Offset XY").preferredSize = [72, 18];
    var cOx = cOffG.add("edittext", undefined, "0"); cOx.characters = 5;
    var cOy = cOffG.add("edittext", undefined, "0"); cOy.characters = 5;
    var cUseTarget = tabCamera.add("button", undefined, "Use selected as target");
    var cAttach = tabCamera.add("button", undefined, "Attach selected to frame");
    var cFollow = tabCamera.add("checkbox", undefined, "Focus on selected / interaction target");
    var cStatus = tabCamera.add("statictext", undefined, "Target: —", { multiline: true });
    cStatus.preferredSize = [320, 28];
    var cList = tabCamera.add("listbox", undefined, []);
    cList.preferredSize = [320, 80];
    var cBtns = tabCamera.add("group");
    var cBuild = cBtns.add("button", undefined, "Build Camera");
    var cUpdate = cBtns.add("button", undefined, "Update");
    var cReset = cBtns.add("button", undefined, "Reset");
    var cDelete = cBtns.add("button", undefined, "Delete");
    var cResetAll = tabCamera.add("button", undefined, "Reset All EVO Camera");

    tabTrans.add("statictext", undefined, "Connects Shot A → Shot B around the CTI. Does not flatten or rewrite Motion.", { multiline: true });
    function tRow(label, items) {
      var g = tabTrans.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var tType = tRow("Type", ["Hard Cut", "Clean Push", "Whip", "Zoom Through", "Zoom Match", "Scale Match", "UI Match", "Mask Reveal", "Shape Wipe", "Blur Focus", "Exposure Hit", "Flash", "Evotechly Clean", "Calm", "Hook Cut", "Person → Product", "Product → Person", "Glitch (aggressive)"]);
    var tDir = tRow("Direction", ["Left", "Right", "Up", "Down"]);
    var tAlign = tRow("Align", ["Centered", "Before CTI", "After CTI"]);
    var tDurG = tabTrans.add("group"); tDurG.add("statictext", undefined, "Duration").preferredSize = [72, 18];
    var tDur = tDurG.add("edittext", undefined, "0.35"); tDur.characters = 6;
    var tStrG = tabTrans.add("group"); tStrG.add("statictext", undefined, "Strength").preferredSize = [72, 18];
    var tStr = tStrG.add("edittext", undefined, "100"); tStr.characters = 6;
    var tFromBtn = tabTrans.add("button", undefined, "Use selected as FROM");
    var tToBtn = tabTrans.add("button", undefined, "Use selected as TO");
    var tTaBtn = tabTrans.add("button", undefined, "Use selected as Target A");
    var tTbBtn = tabTrans.add("button", undefined, "Use selected as Target B");
    var tMatchCam = tabTrans.add("checkbox", undefined, "Suggest from last camera move");
    var tAfterInt = tabTrans.add("checkbox", undefined, "Start after last interaction");
    var tStatus = tabTrans.add("statictext", undefined, "FROM: —   TO: —", { multiline: true });
    tStatus.preferredSize = [320, 40];
    var tList = tabTrans.add("listbox", undefined, []);
    tList.preferredSize = [320, 80];
    var tBtns = tabTrans.add("group");
    var tBuild = tBtns.add("button", undefined, "Build Transition");
    var tUpdate = tBtns.add("button", undefined, "Update");
    var tReset = tBtns.add("button", undefined, "Reset");
    var tDelete = tBtns.add("button", undefined, "Delete");
    var tPreview = tBtns.add("button", undefined, "Preview range");
    var tResetAll = tabTrans.add("button", undefined, "Reset All EVO Transitions");

    tabType.add("statictext", undefined, "Never changes font, copy, alignment, or direction. Native animators only.", { multiline: true });
    function yRow(label, items) {
      var g = tabType.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var yMode = yRow("Mode", ["Word Reveal", "Line Reveal", "Character Reveal", "Mask Reveal", "Tracking Reveal", "Blur Reveal", "Punch", "Keyword", "Highlight", "Pill", "Counter", "Hook Clean", "Hook Slam", "Bilingual Clean", "Lower Third"]);
    var yDir = yRow("Direction", ["Up", "Down", "Left", "Right", "None"]);
    var yOrder = yRow("Order", ["Forward", "Reverse"]);
    var yDurG = tabType.add("group"); yDurG.add("statictext", undefined, "Duration").preferredSize = [72, 18];
    var yDur = yDurG.add("edittext", undefined, "0.60"); yDur.characters = 6;
    var yStG = tabType.add("group"); yStG.add("statictext", undefined, "Stagger").preferredSize = [72, 18];
    var ySt = yStG.add("edittext", undefined, "0.05"); ySt.characters = 6;
    var yKeyG = tabType.add("group"); yKeyG.add("statictext", undefined, "Keyword").preferredSize = [72, 18];
    var yKey = yKeyG.add("edittext", undefined, ""); yKey.characters = 14;
    var yNumG = tabType.add("group"); yNumG.add("statictext", undefined, "Count A→B").preferredSize = [72, 18];
    var yA = yNumG.add("edittext", undefined, "0"); yA.characters = 5;
    var yB = yNumG.add("edittext", undefined, "100"); yB.characters = 5;
    var yFixG = tabType.add("group"); yFixG.add("statictext", undefined, "Pre/Suf").preferredSize = [72, 18];
    var yPre = yFixG.add("edittext", undefined, ""); yPre.characters = 5;
    var ySuf = yFixG.add("edittext", undefined, "%"); ySuf.characters = 5;
    var yUse = tabType.add("button", undefined, "Use selected text layer");
    var yStatus = tabType.add("statictext", undefined, "Target: —", { multiline: true });
    yStatus.preferredSize = [320, 24];
    var yList = tabType.add("listbox", undefined, []);
    yList.preferredSize = [320, 72];
    var yBtns = tabType.add("group");
    var yBuild = yBtns.add("button", undefined, "Build Type");
    var yUpdate = yBtns.add("button", undefined, "Update");
    var yReset = yBtns.add("button", undefined, "Reset");
    var yDelete = yBtns.add("button", undefined, "Delete");
    var yResetAll = tabType.add("button", undefined, "Reset All EVO Type");

    tabSeq.add("statictext", undefined, "Orchestration only. SETUP validates inputs. BUILD calls Type / Interact / Camera / Transition.", { multiline: true });
    function sRow(label, items) {
      var g = tabSeq.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var sCat = sRow("Category", ["SaaS", "Social", "Professional", "Hybrid", "Brand", "EvoCRM"]);
    var sRec = sRow("Recipe", ["SaaS Hero"]);
    var sEnergy = sRow("Energy", ["Standard", "Calm", "High"]);
    var sRhythm = sRow("Rhythm", ["Free", "Beat", "Drop-driven"]);
    var sBind = tabSeq.add("button", undefined, "Bind selected → next empty slot");
    var sSetup = tabSeq.add("button", undefined, "SETUP");
    var sBuild = tabSeq.add("button", undefined, "BUILD RECIPE");

    tabEdit.add("statictext", undefined, "Plan shots. Compile calls Recipes. Does not choose story or assets.", { multiline: true });
    function eRow(label, items) {
      var g = tabEdit.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var eStruct = eRow("Structure", ["SaaS Launch", "Problem → Solution", "Feature Demo", "Fast Tutorial", "Product Proof", "Founder → Product", "Case Study", "Testimonial", "Announcement", "Custom"]);
    var eFmt = eRow("Format", ["9:16", "16:9", "1:1", "4:5"]);
    var eDur = eRow("Target", ["15 sec", "6 sec", "10 sec", "30 sec", "60 sec"]);
    var eRhy = eRow("Rhythm", ["Beat", "Free", "Drop-driven"]);
    var eNew = tabEdit.add("button", undefined, "NEW EDIT from structure");
    var eList = tabEdit.add("listbox", undefined, []);
    eList.preferredSize = [320, 88];
    var eShotBtns = tabEdit.add("group");
    eShotBtns.add("button", undefined, "Add").onClick = function () { eShots.push({ id: "SHOT_" + (eShots.length + 1), name: "CUSTOM", purpose: "CUSTOM", recipe: "saas_hero", inputs: {}, placeholder: false }); refreshEditShots(); };
    eShotBtns.add("button", undefined, "Remove").onClick = function () { if (eList.selection) { eShots.splice(eList.selection.index, 1); refreshEditShots(); } };
    eShotBtns.add("button", undefined, "Up").onClick = function () { var i; if (!eList.selection || eList.selection.index === 0) return; i = eList.selection.index; var tmp = eShots[i - 1]; eShots[i - 1] = eShots[i]; eShots[i] = tmp; refreshEditShots(); };
    var eBind = tabEdit.add("button", undefined, "Bind selected to shot recipe slots");
    var ePh = tabEdit.add("button", undefined, "Placeholder for selected shot");
    var ePre = tabEdit.add("button", undefined, "PREFLIGHT");
    var eGo = tabEdit.add("button", undefined, "COMPILE EDIT");

    tabPro.add("statictext", undefined, "Enhances the speaker. No face detect, no transcription, no audio cuts.", { multiline: true });
    function prRow(label, items) {
      var g = tabPro.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var prType = prRow("Type", ["Talking Head", "Founder Clean", "Founder Social", "Interview", "Testimonial", "Case Study", "Educational", "Person + Product"]);
    var prLay = prRow("Layout", ["Full Frame", "Centered", "Person Left", "Person Right", "Person Top", "Split 50/50"]);
    var prDens = prRow("Density", ["Low", "Medium", "High"]);
    var prPerson = tabPro.add("button", undefined, "Use selected as Person");
    var prProduct = tabPro.add("button", undefined, "Use selected as Product / B-roll");
    var prName = tabPro.add("button", undefined, "Use selected as Name / Role / Quote text");
    var prStatus = tabPro.add("statictext", undefined, "Person: —", { multiline: true });
    prStatus.preferredSize = [320, 40];
    var prSetup = tabPro.add("button", undefined, "SETUP");
    var prBuild = tabPro.add("button", undefined, "BUILD PRO");

    tabSfx.add("statictext", undefined, "Cues follow EVO_* markers. No bundled samples. Music / VO never touched.", { multiline: true });
    function xRow(label, items) {
      var g = tabSfx.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var xFam = xRow("Family", ["Evotechly Clean", "SaaS UI", "Social", "Professional", "Impact", "Minimal"]);
    var xDen = xRow("Density", ["Standard", "Low", "High"]);
    var xIntG = tabSfx.add("group"); xIntG.add("statictext", undefined, "Intensity").preferredSize = [72, 18];
    var xInt = xIntG.add("edittext", undefined, "100"); xInt.characters = 5;
    var xDry = tabSfx.add("button", undefined, "AUTO CUE (dry-run)");

    tabBrand.add("statictext", undefined, "Policy layer. APPLY sets tokens. Does not rebuild the comp.", { multiline: true });
    function bRow(label, items) {
      var g = tabBrand.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var bProf = bRow("Profile", ["Evotechly", "EvoCRM"]);
    var bMode = bRow("Mode", ["Product", "Social", "Professional", "Launch", "Educational", "Brand"]);
    var bEnergy = bRow("Energy", ["Standard", "Calm", "High"]);
    var bCtx = bRow("Context", ["Dark", "Light"]);
    var bLink = bRow("Objects", ["Linked", "Snapshot", "Detached"]);
    var bApply = tabBrand.add("button", undefined, "APPLY PROFILE");
    var bCheck = tabBrand.add("button", undefined, "CHECK BRAND");

    tabQa.add("statictext", undefined, "Read-only until you choose Fix / Delivery. v1.0.0 is gated.", { multiline: true });
    var qScope = tabQa.add("dropdownlist", undefined, ["Current Comp", "Current Edit"]);
    qScope.selection = 0;
    var qRun = tabQa.add("button", undefined, "RUN PREFLIGHT");

    tabDir.add("statictext", undefined, "Analyze is read-only. Nothing changes until APPLY SELECTED.", { multiline: true });
    function dRow(label, items) {
      var g = tabDir.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var dGoal = dRow("Goal", ["Product Demo", "Social Ad", "Product Launch", "Professional", "Educational"]);
    var dFocus = dRow("Focus", ["Product Clarity", "Premium", "Energy", "Conversion"]);
    var dMode = dRow("Mode", ["Product", "Social", "Professional", "Launch"]);
    var dAn = tabDir.add("button", undefined, "ANALYZE");
    var dList = tabDir.add("listbox", undefined, [], { multiselect: true });
    dList.preferredSize = [320, 88];
    var dWhy = tabDir.add("statictext", undefined, "Reasons appear after Analyze.", { multiline: true });
    dWhy.preferredSize = [320, 48];
    var dPrev = tabDir.add("button", undefined, "PREVIEW PLAN");
    var dApp = tabDir.add("button", undefined, "APPLY SELECTED");

    tabVar.add("statictext", undefined, "Master is never rewritten. Analyze is read-only.", { multiline: true });
    function vRow(label, items) {
      var g = tabVar.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var vFrom = vRow("Master", ["16:9", "9:16", "4:5", "1:1"]);
    var vTo = vRow("Target", ["9:16", "4:5", "1:1", "16:9"]);
    var vDur = vRow("Duration", ["Keep", "6 sec", "10 sec", "15 sec", "30 sec"]);
    var vLang = vRow("Language", ["English", "Arabic", "Bilingual", "French"]);
    var vHook = vRow("Hook", ["A", "B", "C"]);
    var vAn = tabVar.add("button", undefined, "ANALYZE ADAPTATION");
    var vPlan = tabVar.add("statictext", undefined, "No plan.", { multiline: true });
    vPlan.preferredSize = [320, 80];
    var vBuild = tabVar.add("button", undefined, "BUILD VARIANT");

    tabAst.add("statictext", undefined, "Register selected footage. Filename tokens are suggestions only.", { multiline: true });
    var aKey = tabAst.add("dropdownlist", undefined, ["PRODUCT_MAIN", "PRODUCT_DASHBOARD", "PRODUCT_PIPELINE", "PRODUCT_LEAD_DRAWER", "PRODUCT_ASK_EVO", "PRODUCT_METRIC", "FOUNDER_MAIN", "LOGO_LIGHT", "LOGO_DARK", "VOICEOVER_MAIN"]);
    aKey.selection = 0;
    var aReg = tabAst.add("button", undefined, "REGISTER SELECTED");

    tabRev.add("statictext", undefined, "Local notes. Import is preview-first. Opening Review does not change the edit.", { multiline: true });
    var rPri = tabRev.add("dropdownlist", undefined, ["NORMAL", "HIGH", "BLOCKING", "LOW"]);
    rPri.selection = 0;
    var rAdd = tabRev.add("button", undefined, "NEW COMMENT @ CTI");

    tabProd.add("statictext", undefined, "Plan first. Handoff proposes P8 shots. Approved edits are not rewritten.", { multiline: true });
    var pType = tabProd.add("dropdownlist", undefined, ["SOCIAL AD", "PRODUCT DEMO", "FOUNDER", "TUTORIAL"]);
    pType.selection = 0;
    var pNew = tabProd.add("button", undefined, "NEW CONTENT");

    tabAn.add("statictext", undefined, "Observed metrics only. Highest CTR is not a Winner. Brand still vetoes.", { multiline: true });
    var anDim = tabAn.add("dropdownlist", undefined, ["Hook", "CTA", "Format", "Language"]);
    anDim.selection = 0;
    var anA = tabAn.add("edittext", undefined, "Hook A 1.9%");
    var anB = tabAn.add("edittext", undefined, "Hook B 2.8%");
    var anGo = tabAn.add("button", undefined, "COMPARE");
    var anLearn = tabAn.add("button", undefined, "CREATE LEARNING (manual)");

    tabHome.add("statictext", undefined, "Context from the active comp. Ambiguous comps are not guessed.", { multiline: true });
    var hStat = tabHome.add("statictext", undefined, "Unmanaged comp.", { multiline: true });
    hStat.preferredSize = [320, 72];
    var hNext = tabHome.add("button", undefined, "NEXT ACTION");

    var uxMode = tabHome.add("dropdownlist", undefined, ["Quick", "Standard", "Advanced"]);
    uxMode.selection = 1;
    var uxHint = tabHome.add("statictext", undefined, "Select layers. Quick hides Tools. Advanced keeps every engine tab.", { multiline: true });
    uxHint.preferredSize = [320, 36];
    var uxAct = tabHome.add("button", undefined, "SUGGESTED ACTION");


    tabAuto.add("statictext", undefined, "Rules are declarative. Pause All disables follow-up. Engines stay correct with Auto off.", { multiline: true });
    var auOn = tabAuto.add("checkbox", undefined, "Automation ON");
    auOn.value = false;
    var auList = tabAuto.add("listbox", undefined, [
      "AUTO  Refresh readiness on ASSET_READY",
      "AUTO  Mark variants outdated on EDIT_UPDATED",
      "AUTO  Read-only QA on VARIANT_UPDATED",
      "SUGGEST  Prepare review when QA READY",
      "REJECT  Delete variants — never auto"
    ]);
    auList.preferredSize = [320, 80];
    var auDry = tabAuto.add("button", undefined, "DRY RUN");

    tabCore.add("statictext", undefined, "Health is read-only. Rebuild Registry does not rewrite keyframes.", { multiline: true });
    var cHealth = tabCore.add("statictext", undefined, "Core READY  Engines loaded  Migrations NONE", { multiline: true });
    cHealth.preferredSize = [320, 48];
    var cScan = tabCore.add("button", undefined, "QUICK HEALTH");
    var cRebuild = tabCore.add("button", undefined, "REBUILD REGISTRY");
    var cProf = tabCore.add("button", undefined, "PROFILE NOTE");

    var auHist = tabAuto.add("statictext", undefined, "No runs.", { multiline: true });
    auHist.preferredSize = [320, 40];

    var hQa = tabHome.add("button", undefined, "RUN PREFLIGHT");
    var hDir = tabHome.add("button", undefined, "ASK DIRECTOR");
    var hSearch = tabHome.add("edittext", undefined, "");
    var hFind = tabHome.add("button", undefined, "SEARCH");
    hSearch.alignment = ["fill", "center"];

    var anOut = tabAn.add("statictext", undefined, "No comparison.", { multiline: true });
    anOut.preferredSize = [320, 72];

    var pList = tabProd.add("listbox", undefined, []);
    pList.preferredSize = [320, 64];
    var pReady = tabProd.add("button", undefined, "CHECK READINESS");
    var pHand = tabProd.add("button", undefined, "HAND OFF TO EDIT (preview)");
    var pStat = tabProd.add("statictext", undefined, "No content.", { multiline: true });
    pStat.preferredSize = [320, 56];
    function refreshProd() {
      var c = activeComp(), list, i;
      pList.removeAll();
      if (!c) return;
      list = readProd(c);
      for (i = 0; i < list.length; i++) pList.add("item", list[i].id + "  " + list[i].type + "  " + list[i].status);
    }

    var rList = tabRev.add("listbox", undefined, []);
    rList.preferredSize = [320, 72];
    var rGo = tabRev.add("button", undefined, "GO TO COMMENT");
    var rRes = tabRev.add("button", undefined, "RESOLVE");
    var rImp = tabRev.add("button", undefined, "IMPORT NOTES (preview)");
    var rApp = tabRev.add("button", undefined, "APPROVE (explicit)");
    var rStat = tabRev.add("statictext", undefined, "No review.", { multiline: true });
    rStat.preferredSize = [320, 40];
    function refreshRev() {
      var c = activeComp(), list, i, open = 0, block = 0;
      rList.removeAll();
      if (!c) return;
      list = readRevs(c);
      for (i = 0; i < list.length; i++) {
        rList.add("item", list[i].id + "  " + list[i].pri + "  " + list[i].status + "  @" + (Math.round(list[i].t * 100) / 100));
        if (list[i].status === "OPEN" && list[i].pri === "BLOCKING") block++;
        if (list[i].status === "OPEN") open++;
      }
      rStat.text = "Open " + open + "  Blocking " + block + (block ? "  CHANGES REQUESTED" : "");
    }

    var aVal = tabAst.add("button", undefined, "VALIDATE / FIND GAPS");
    var aStat = tabAst.add("statictext", undefined, "No registry.", { multiline: true });
    aStat.preferredSize = [320, 56];
    var aList = tabAst.add("listbox", undefined, []);
    aList.preferredSize = [320, 72];
    function refreshAst() {
      var c = activeComp(), list, i;
      aList.removeAll();
      if (!c) return;
      list = readAssets(c);
      for (i = 0; i < list.length; i++) aList.add("item", list[i].id + "  " + list[i].key + "  " + list[i].name);
    }

    var vList = tabVar.add("listbox", undefined, []);
    vList.preferredSize = [320, 56];
    var vLines = [];
    function refreshVarList() {
      var c = activeComp(), list, i;
      vList.removeAll();
      if (!c) return;
      list = readVars(c);
      for (i = 0; i < list.length; i++) vList.add("item", list[i].id + "  " + list[i].fmt + "  " + list[i].lang + "  " + list[i].status);
    }

    var dPass = tabDir.add("group");
    dPass.add("button", undefined, "Simplify").onClick = function () { dFilter(/Remove|Do nothing|Hard Cut|Hold/); };
    dPass.add("button", undefined, "More Premium").onClick = function () { dFilter(/Remove|Micro Push|Do nothing/); };
    var dCache = [];
    function dFilter(re) {
      var i, keep = [];
      for (i = 0; i < dCache.length; i++) if (re.test(dCache[i].action)) keep.push(dCache[i]);
      dList.removeAll();
      if (!keep.length) keep = [{ action: "Do nothing", engine: "none", reason: "No simplify actions." }];
      for (i = 0; i < keep.length; i++) dList.add("item", keep[i].action);
      dCache = keep;
    }

    var qStatus = tabQa.add("statictext", undefined, "No preflight.", { multiline: true });
    qStatus.preferredSize = [320, 96];
    var qFix = tabQa.add("button", undefined, "FIX SAFE ISSUES (dry-run)");
    var qDel = tabQa.add("button", undefined, "PREPARE DELIVERY");
    var qWork = tabQa.add("button", undefined, "SET WORK AREA TO COMP");
    var qLast = null;

    var bSum = tabBrand.add("statictext", undefined, "Active: Evotechly / Product / Standard", { multiline: true });
    bSum.preferredSize = [320, 88];
    var bProfIds = ["evotechly", "evocrm"];
    var bModeIds = ["product", "social", "professional", "launch", "educational", "brand"];
    var bEnergyIds = ["standard", "calm", "high"];
    function currentBrandSel() {
      return {
        profile: bProfIds[bProf.selection ? bProf.selection.index : 0],
        mode: bModeIds[bMode.selection ? bMode.selection.index : 0],
        energy: bEnergyIds[bEnergy.selection ? bEnergy.selection.index : 0],
        context: bCtx.selection && bCtx.selection.index === 1 ? "light" : "dark",
        link: bLink.selection ? ["linked", "snapshot", "detached"][bLink.selection.index] : "linked"
      };
    }

    var xApply = tabSfx.add("button", undefined, "APPLY CUES");
    var xQuick = tabSfx.add("group");
    xQuick.add("button", undefined, "Click").onClick = function () { addManualCue("click"); };
    xQuick.add("button", undefined, "Whoosh").onClick = function () { addManualCue("whoosh"); };
    xQuick.add("button", undefined, "Impact").onClick = function () { addManualCue("impact"); };
    xQuick.add("button", undefined, "Success").onClick = function () { addManualCue("success"); };
    var xPlan = tabSfx.add("statictext", undefined, "No plan.", { multiline: true });
    xPlan.preferredSize = [320, 72];
    var xList = tabSfx.add("listbox", undefined, []);
    xList.preferredSize = [320, 64];
    var xFoot = tabSfx.add("group");
    var xReset = xFoot.add("button", undefined, "Reset All EVO SFX");
    var xDetach = xFoot.add("button", undefined, "Detach All");
    var xMute = xFoot.add("checkbox", undefined, "Mute EVO SFX");
    var xPending = [];
    var xFamIds = ["evotechly_clean", "saas_ui", "social", "professional", "impact", "minimal"];
    var xDenIds = ["standard", "low", "high"];
    function refreshSfxList() {
      var comp = activeComp(), list, i;
      xList.removeAll();
      if (!comp) return;
      list = readSfx(comp);
      for (i = 0; i < list.length; i++) xList.add("item", list[i].id + "  " + list[i].cat + "  " + list[i].event);
    }
    function addManualCue(cat) {
      var comp = activeComp(), cue, list;
      if (!comp) return;
      app.beginUndoGroup("Evotechly Add SFX");
      cue = { id: nextSfxId(readSfx(comp)), event: "CTI", cat: cat, family: xFamIds[xFam.selection ? xFam.selection.index : 0], t: comp.time, gain: -12, status: "READY" };
      placeSfxMarker(comp, cue);
      list = readSfx(comp);
      list.push(cue);
      writeSfx(comp, list);
      refreshSfxList();
      app.endUndoGroup();
    }

    var prQuick = tabPro.add("group");
    var prMicro = prQuick.add("button", undefined, "Micro Push");
    var prLT = prQuick.add("button", undefined, "Lower Third");
    var prIns = prQuick.add("button", undefined, "Product Insert");
    var prCap = prQuick.add("button", undefined, "Captions");
    var prCut = tabPro.add("group");
    prCut.add("button", undefined, "Cutout Prep").onClick = personCutout;
    prCut.add("button", undefined, "Keylight").onClick = personKeylight;
    prCut.add("button", undefined, "Light Wrap").onClick = personLightWrap;
    prCut.add("button", undefined, "Stack").onClick = personStack;
    var prList = tabPro.add("listbox", undefined, []);
    prList.preferredSize = [320, 56];
    var prFoot = tabPro.add("group");
    var prReset = prFoot.add("button", undefined, "Reset");
    var prDetach = prFoot.add("button", undefined, "Detach");
    var prMark = prFoot.add("button", undefined, "Mark speech hit");
    var prPicks = { person: "", product: "", name: "", role: "", quote: "" };
    var prTypes = ["talkingHead", "founderClean", "founderSocial", "interview", "testimonial", "caseStudy", "educational", "personProduct"];
    var prLays = ["full", "centered", "left", "right", "top", "split50"];
    function refreshProList() {
      var comp = activeComp(), list, i;
      prList.removeAll();
      if (!comp) return;
      list = readPros(comp);
      for (i = 0; i < list.length; i++) prList.add("item", list[i].id + "  " + list[i].type + "  " + list[i].status);
    }
    function selectedPro(comp) {
      var list = readPros(comp);
      if (!prList.selection) return null;
      return list[prList.selection.index] || null;
    }

    var eStatus = tabEdit.add("statictext", undefined, "No edit.", { multiline: true });
    eStatus.preferredSize = [320, 64];
    var eEdits = tabEdit.add("listbox", undefined, []);
    eEdits.preferredSize = [320, 48];
    var eFoot = tabEdit.add("group");
    var eDetach = eFoot.add("button", undefined, "Detach Edit");
    var eReset = eFoot.add("button", undefined, "Reset assembly");
    var eShots = [];
    var eInputs = {};
    var eStructIds = ["saas_launch", "problem_solution", "feature_demo", "fast_tutorial", "product_proof", "founder_product", "case_study", "testimonial", "announcement", "custom"];
    var eDurVals = [15, 6, 10, 30, 60];
    function refreshEditShots() {
      var i;
      eList.removeAll();
      for (i = 0; i < eShots.length; i++) eList.add("item", eShots[i].id + "  " + eShots[i].purpose + "  " + eShots[i].recipe + (eShots[i].placeholder ? "  PH" : ""));
    }
    function refreshEditList() {
      var comp = activeComp(), list, i;
      eEdits.removeAll();
      if (!comp) return;
      list = readEdits(comp);
      for (i = 0; i < list.length; i++) eEdits.add("item", list[i].id + "  " + list[i].name + "  " + list[i].status);
    }

    var sPreview = tabSeq.add("statictext", undefined, "Assign required layers, then SETUP.", { multiline: true });
    sPreview.preferredSize = [320, 72];
    var sList = tabSeq.add("listbox", undefined, []);
    sList.preferredSize = [320, 64];
    var sBtns = tabSeq.add("group");
    var sReset = sBtns.add("button", undefined, "Reset");
    var sDelete = sBtns.add("button", undefined, "Delete");
    var sDetach = sBtns.add("button", undefined, "Detach");
    var sInputs = {};
    var sSlots = ["title", "dashboard", "cta", "cursor", "logo", "metric", "feature", "t1", "t2", "t3", "from", "to", "person", "deal", "won", "toast", "lead", "drawer", "ask", "panel", "response", "problem", "solution", "b1", "keyword", "product", "name", "role"];
    function recipesInCat(cat) {
      var all = recipeCatalog(), out = [], i;
      for (i = 0; i < all.length; i++) if (all[i].cat === cat) out.push(all[i]);
      return out;
    }
    function refreshRecipeDropdown() {
      var cat = sCat.selection ? sCat.selection.text : "SaaS", list = recipesInCat(cat), i;
      sRec.removeAll();
      for (i = 0; i < list.length; i++) sRec.add("item", list[i].name);
      if (sRec.items.length) sRec.selection = 0;
    }
    function currentRecipeDef() {
      var cat = sCat.selection ? sCat.selection.text : "SaaS", list = recipesInCat(cat);
      return list[sRec.selection ? sRec.selection.index : 0] || list[0];
    }
    function refreshSeqList() {
      var comp = activeComp(), list, i;
      sList.removeAll();
      if (!comp) return;
      list = readSeqs(comp);
      for (i = 0; i < list.length; i++) sList.add("item", list[i].id + "  " + list[i].name + "  " + list[i].status);
    }
    function selectedSeq(comp) {
      var list = readSeqs(comp);
      if (!sList.selection) return null;
      return list[sList.selection.index] || null;
    }

    var yHitBeat = tabType.add("button", undefined, "Text hit on beat");
    var yKeyDrop = tabType.add("button", undefined, "Keyword on drop");
    var yTarget = "";
    var yModes = ["word", "line", "character", "mask", "tracking", "blur", "punch", "keyword", "highlight", "pill", "counter", "hookClean", "hookSlam", "bilingual", "lowerThird"];
    var yDirs = ["up", "down", "left", "right", "none"];
    var yOrders = ["forward", "reverse"];
    function refreshTypeList() {
      var comp = activeComp(), list, i;
      yList.removeAll();
      if (!comp) return;
      list = readTypes(comp);
      for (i = 0; i < list.length; i++) yList.add("item", list[i].id + "  " + list[i].name);
    }
    function selectedType(comp) {
      var list = readTypes(comp);
      if (!yList.selection) return null;
      return list[yList.selection.index] || null;
    }


    tabRhythm.add("statictext", undefined, "Manual BPM is the source of truth. Analysis is local (Convert Audio to Keyframes). Never moves user keys.", { multiline: true });
    var rBpmG = tabRhythm.add("group"); rBpmG.add("statictext", undefined, "BPM").preferredSize = [72, 18];
    var rBpm = rBpmG.add("edittext", undefined, "120"); rBpm.characters = 6;
    var rOffG = tabRhythm.add("group"); rOffG.add("statictext", undefined, "Offset f").preferredSize = [72, 18];
    var rOff = rOffG.add("edittext", undefined, "0"); rOff.characters = 5;
    function rRow(label, items) {
      var g = tabRhythm.add("group");
      g.add("statictext", undefined, label).preferredSize = [72, 18];
      var d = g.add("dropdownlist", undefined, items); d.selection = 0; d.alignment = ["fill", "center"];
      return d;
    }
    var rGrid = rRow("Grid", ["1 Beat", "1/2 Beat", "1/4 Beat", "2 Beats", "4 Beats"]);
    var rRange = rRow("Range", ["Work Area", "Comp", "Selected audio"]);
    var rSnap = rRow("Snap", ["Nearest", "Previous", "Next"]);
    var rUseAudio = tabRhythm.add("button", undefined, "Use selected audio");
    var rAnalyze = tabRhythm.add("button", undefined, "Analyze Audio");
    var rGridBtn = tabRhythm.add("button", undefined, "GENERATE RHYTHM");
    var rTap = tabRhythm.add("button", undefined, "Tap tempo");
    var rNav = tabRhythm.add("group");
    var rPrev = rNav.add("button", undefined, "Prev beat");
    var rNext = rNav.add("button", undefined, "Next beat");
    var rMarks = tabRhythm.add("group");
    rMarks.add("button", undefined, "Mark Drop").onClick = function () { var c = activeComp(); if (!c) return; app.beginUndoGroup("EVO_DROP"); addCompMarker(c, c.time, "EVO_DROP"); app.endUndoGroup(); };
    rMarks.add("button", undefined, "Mark Impact").onClick = function () { var c = activeComp(); if (!c) return; app.beginUndoGroup("EVO_IMPACT"); addCompMarker(c, c.time, "EVO_IMPACT"); app.endUndoGroup(); };
    var rSnapBtn = tabRhythm.add("button", undefined, "Snap selected OS event");
    var rClickBeat = tabRhythm.add("button", undefined, "Click on beat");
    var rCamPeak = tabRhythm.add("button", undefined, "Camera peak on beat");
    var rTransMid = tabRhythm.add("button", undefined, "Transition mid on beat");
    var rMetricDrop = tabRhythm.add("button", undefined, "Metric on drop");
    var rLockBtn = tabRhythm.add("button", undefined, "Lock selected event");
    var rUnlockBtn = tabRhythm.add("button", undefined, "Unlock selected event");
    var rUpdateLocks = tabRhythm.add("button", undefined, "Update locked events");
    var rClear = tabRhythm.add("button", undefined, "CLEAR EVO RHYTHM markers");
    var rStatus = tabRhythm.add("statictext", undefined, "BPM 120  ·  MANUAL  ·  Audio: —", { multiline: true });
    rStatus.preferredSize = [320, 48];
    var rAudioName = "";
    var rTaps = [];
    var rGridModes = ["BEAT_1X", "BEAT_HALF_INTERVAL", "BEAT_QUARTER_INTERVAL", "BEAT_2X_INTERVAL", "BEAT_4X_INTERVAL"];
    var rSnapPref = ["nearest", "prev", "next"];
    function refreshRhythmStatus(comp) {
      var d = comp ? readRhythm(comp) : null;
      rStatus.text = "BPM " + (d ? d.bpm : rBpm.text) + "  ·  " + (d ? d.confidence : "MANUAL") + "\nAudio: " + ((d && d.audio) || rAudioName || "—") + "\nLocks: " + ((d && d.locks) ? d.locks.length : 0);
    }

    var tPicks = { from: "", to: "", ta: "", tb: "" };
    var transTypes = ["cut", "push", "whip", "zoom", "zoomMatch", "scaleMatch", "uiMatch", "mask", "wipe", "blur", "exposure", "flash", "clean", "calm", "hook", "personProduct", "productPerson", "glitch"];
    var transDirs = ["left", "right", "up", "down"];
    var transAligns = ["center", "before", "after"];
    function refreshTransStatus() {
      tStatus.text = "FROM: " + (tPicks.from || "—") + "\nTO: " + (tPicks.to || "—") + "\nA: " + (tPicks.ta || "—") + "  B: " + (tPicks.tb || "—");
    }
    function refreshTransList() {
      var comp = activeComp(), list, i;
      tList.removeAll();
      if (!comp) return;
      list = readTransitions(comp);
      for (i = 0; i < list.length; i++) tList.add("item", list[i].id + "  " + list[i].name);
    }
    function selectedTrans(comp) {
      var list = readTransitions(comp);
      if (!tList.selection) return null;
      return list[tList.selection.index] || null;
    }

    var cPick = "";
    var camTypes = ["push", "pull", "panLeft", "panRight", "panUp", "panDown", "panTo", "snap", "punch", "focus", "whipLeft", "whipRight", "whipUp", "whipDown", "parallax", "handheld", "microPush", "slowPush", "slowPull", "interviewDrift", "reframeV"];
    function refreshCamList() {
      var comp = activeComp(), list, i;
      cList.removeAll();
      if (!comp) return;
      list = readCameras(comp);
      for (i = 0; i < list.length; i++) cList.add("item", list[i].id + "  " + list[i].name);
    }
    function selectedCam(comp) {
      var list = readCameras(comp);
      if (!cList.selection) return null;
      return list[cList.selection.index] || null;
    }
    function applyPreset() {
      var p = cPreset.selection ? cPreset.selection.text : "";
      if (p === "Premium Push" || p === "Logo Push") { cMove.selection = 0; cDur.text = "0.80"; cStr.text = "100"; }
      if (p === "Dashboard Drift") { cMove.selection = 3; cDur.text = "1.40"; cStr.text = "70"; }
      if (p === "Feature Focus") { cMove.selection = 9; cDur.text = "0.70"; cStr.text = "90"; }
      if (p === "Metric Punch" || p === "Hook Punch") { cMove.selection = 8; cDur.text = "0.40"; cStr.text = "120"; }
      if (p === "UI Snap" || p === "Snap In") { cMove.selection = 7; cDur.text = "0.28"; cStr.text = "110"; }
      if (p === "Snap Out" || p === "Wide Reveal") { cMove.selection = 1; cDur.text = "0.70"; cStr.text = "90"; }
      if (p === "Micro Push") { cMove.selection = 16; cDur.text = "6.00"; cStr.text = "35"; }
      if (p === "Slow Push") { cMove.selection = 17; cDur.text = "4.00"; cStr.text = "50"; }
      if (p === "Slow Pull") { cMove.selection = 18; cDur.text = "4.00"; cStr.text = "50"; }
      if (p === "Interview Drift") { cMove.selection = 19; cDur.text = "8.00"; cStr.text = "30"; }
      if (p === "Logo Breathe") { cMove.selection = 16; cDur.text = "2.00"; cStr.text = "25"; }
    }

    tabMaster.add("statictext", undefined, "EVO_MASTER  ·  100 = compiled baseline. Travel/Intensity/Text/UI/Overshoot/Reduce = LIVE. Speed/Stagger = Update Motion.", { multiline: true });
    function masterRow(label, def) {
      var g = tabMaster.add("group");
      g.add("statictext", undefined, label).preferredSize = [90, 18];
      var e = g.add("edittext", undefined, String(def)); e.characters = 6;
      return e;
    }
    var mMotion = masterRow("Motion", "100");
    var mSpeed = masterRow("Speed", "100");
    var mTravel = masterRow("Travel", "100");
    var mStagger = masterRow("Stagger", "100");
    var mOver = masterRow("Overshoot", "100");
    var mSpring = masterRow("Spring", "100");
    var mText = masterRow("Text", "100");
    var mUI = masterRow("UI", "100");
    var mSeed = masterRow("Seed", "1");
    var mBlur = tabMaster.add("checkbox", undefined, "Motion Blur (owned layers)");
    var mReduce = tabMaster.add("checkbox", undefined, "Reduce Motion");
    tabMaster.add("statictext", undefined, "Camera tab owns framing. Transition / SFX not implemented.", { multiline: true });
    var mBtns = tabMaster.add("group");
    var pushMasterBtn = mBtns.add("button", undefined, "Push to EVO_MASTER");
    var updateMotionBtn = mBtns.add("button", undefined, "Update Motion");
    var resetMasterBtn = mBtns.add("button", undefined, "Reset Master");

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
    tabPolish.add("statictext", undefined, "SaaS Demo (cursor path, depth, stagger, carousel): Window → SaaS Demo Tools.", { multiline: true });
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
    win.add("statictext", undefined, "Companions: TFM Liquid Glass / Comp Exporter + Saber / QCA3 / Displacer / AC — official sites only; hooks only; off talking-head. SaaS Demo Tools is a separate Window panel.", { multiline: true });
    var state = { plan: [], compId: null, styleId: null, shotId: null, dirId: null, scanned: false };
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
    function planIsStale(comp) {
      if (!state.scanned) return true;
      if (!comp || state.compId !== comp.id) return true;
      if (state.styleId !== currentStyle() || state.shotId !== currentShot() || state.dirId !== currentDirection()) return true;
      return false;
    }
    function scan() {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      var found = collectLayers(comp, selectedOnly.value);
      state.plan = buildPlan(found.layers, currentStyle(), currentDirection(), currentShot());
      state.compId = comp.id;
      state.styleId = currentStyle();
      state.shotId = currentShot();
      state.dirId = currentDirection();
      state.scanned = true;
      logLine("Scan: " + found.layers.length + " eligible · ignored " + found.ignored.length + " · " + state.styleId + " / " + state.shotId + " / " + state.dirId);
      refreshList(state.plan, found.ignored, comp.name);
    }
    function collectPreflight(comp) {
      var missing = [], locked = [], conflicts = [], unsupported = [], i, layer, item;
      if (!comp) return { status: "BLOCKED", reason: "No active composition.", missing: missing, locked: locked, conflicts: conflicts, unsupported: unsupported };
      if (!state.plan.length) return { status: "BLOCKED", reason: "No planned layers. Scan first.", missing: missing, locked: locked, conflicts: conflicts, unsupported: unsupported };
      if (planIsStale(comp)) return { status: "BLOCKED", reason: "Composition changed since the last Scan. Scan again before Apply.", missing: missing, locked: locked, conflicts: conflicts, unsupported: unsupported };
      for (i = 0; i < state.plan.length; i++) {
        item = state.plan[i];
        layer = findLayer(comp, item.name);
        if (!layer) { missing.push(item.name); continue; }
        try {
          if (layer.locked) { locked.push(item.name); continue; }
        } catch (eL) {}
        try {
          if (layer.property("ADBE Transform Group").property("ADBE Position").dimensionsSeparated) {
            unsupported.push(item.name + " (separated Position)");
            continue;
          }
        } catch (eD) {}
        if (hasForeignKeys(layer)) conflicts.push(item.name);
      }
      if (missing.length && missing.length === state.plan.length) {
        return { status: "BLOCKED", reason: "All planned layers are missing. Scan again.", missing: missing, locked: locked, conflicts: conflicts, unsupported: unsupported };
      }
      if (locked.length || conflicts.length || unsupported.length || missing.length) {
        return { status: "READY WITH WARNINGS", reason: "Apply can skip problem layers.", missing: missing, locked: locked, conflicts: conflicts, unsupported: unsupported };
      }
      return { status: "READY", reason: "Plan is valid.", missing: missing, locked: locked, conflicts: conflicts, unsupported: unsupported };
    }
    function formatPreflight(pf) {
      var lines = ["Preflight: " + pf.status, pf.reason];
      if (pf.missing && pf.missing.length) lines.push("Missing: " + pf.missing.join(", "));
      if (pf.locked && pf.locked.length) lines.push("Locked: " + pf.locked.join(", "));
      if (pf.unsupported && pf.unsupported.length) lines.push("Unsupported: " + pf.unsupported.join(", "));
      if (pf.conflicts && pf.conflicts.length) lines.push("Existing keys (not Motion OS): " + pf.conflicts.join(", "));
      return lines.join("\n");
    }
    function confirmConflicts(names) {
      var w = new Window("dialog", "Motion OS — existing animation"), g, skipBtn, cancelBtn, overBtn, choice = "cancel";
      w.add("statictext", undefined, "These layers already have Position / Scale / Opacity keys:", { multiline: true });
      w.add("statictext", undefined, names.join("\n"), { multiline: true });
      w.add("statictext", undefined, "Motion OS will not overwrite them unless you choose Overwrite.", { multiline: true });
      g = w.add("group");
      cancelBtn = g.add("button", undefined, "Cancel");
      skipBtn = g.add("button", undefined, "Skip conflicting");
      overBtn = g.add("button", undefined, "Overwrite");
      cancelBtn.onClick = function () { choice = "cancel"; w.close(); };
      skipBtn.onClick = function () { choice = "skip"; w.close(); };
      overBtn.onClick = function () { choice = "overwrite"; w.close(); };
      w.show();
      return choice;
    }
    function apply() {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      if (!state.plan.length || planIsStale(comp)) {
        alert("Composition changed since the last Scan. Scan again before Apply.");
        return;
      }
      var pf = collectPreflight(comp), skipConflict = {}, i, layer, item, applied = 0, skipped = [], failed = [], guides = 0, choice;
      if (pf.status === "BLOCKED") { alert(formatPreflight(pf)); return; }
      if (pf.conflicts.length) {
        choice = confirmConflicts(pf.conflicts);
        if (choice === "cancel") return;
        if (choice === "skip") {
          for (i = 0; i < pf.conflicts.length; i++) skipConflict[pf.conflicts[i]] = true;
        }
      }
      app.beginUndoGroup("Evotechly Motion OS");
      try {
        ensureMaster(comp);
        for (i = 0; i < state.plan.length; i++) {
          item = state.plan[i];
          layer = findLayer(comp, item.name);
          if (!layer) { skipped.push(item.name + " (missing)"); continue; }
          if (layer.locked) { skipped.push(item.name + " (locked)"); continue; }
          if (skipConflict[item.name]) { skipped.push(item.name + " (existing keys)"); continue; }
          try {
            applySpec(layer, item);
            applyMasterBlur(layer, readMasterValues(findMaster(comp)).blur);
            applied += 1;
          } catch (err) {
            failed.push(item.name + " — " + err.toString());
            logLine("Apply failed " + item.name + ": " + err.toString());
          }
        }
        if ((currentShot() === "logoLockup" || currentShot() === "logoSting") && state.plan._lockup) {
          guides = applyLockupGuides(comp, state.plan._lockup);
        }
      } catch (fatal) {
        failed.push(fatal.toString());
      }
      app.endUndoGroup();
      logLine("Apply: " + applied + " success · skipped " + skipped.length + " · failed " + failed.length);
      var msg = "Applied Motion OS to " + applied + " layer(s).";
      if (guides) msg += "\nLockup guides: " + guides + " (EVO_SKIP_LOCKUP_*, not keyed).";
      if (skipped.length) msg += "\n\nSkipped:\n- " + skipped.join("\n- ");
      if (failed.length) msg += "\n\nCould not animate:\n- " + failed.join("\n- ");
      alert(msg);
    }
    function runPreflight() {
      var comp = activeComp();
      if (!comp) { alert("Open a composition first."); return; }
      if (!state.plan.length || planIsStale(comp)) { alert("Scan this composition first."); return; }
      alert(formatPreflight(collectPreflight(comp)));
    }
    function resetMotion() {
      var comp = activeComp(); if (!comp) return;
      var i, layer, tag, tg, pos, sc, op, restored = 0, skipped = [];
      app.beginUndoGroup("Evotechly Reset motion");
      for (i = 1; i <= comp.numLayers; i++) {
        layer = comp.layer(i);
        tag = parseMotionTag(readComment(layer));
        if (!tag || !tag.owned) continue;
        if (layer.locked) { skipped.push(layer.name + " (locked)"); continue; }
        try {
          tg = layer.property("ADBE Transform Group");
          pos = tg.property("ADBE Position");
          sc = tg.property("ADBE Scale");
          op = tg.property("ADBE Opacity");
          if (isOurSpring(pos.expression) || isMasterExpr(pos.expression)) pos.expression = "";
          if (isMasterExpr(sc.expression)) sc.expression = "";
          clearKeys(op); clearKeys(pos); clearKeys(sc);
          if (!isNaN(tag.px) && !isNaN(tag.py)) {
            try {
              if (pos.value.length > 2) pos.setValue([tag.px, tag.py, pos.value[2]]);
              else pos.setValue([tag.px, tag.py]);
            } catch (eP) {}
            try {
              if (sc.value.length > 2) sc.setValue([tag.sx, tag.sy, sc.value[2]]);
              else sc.setValue([tag.sx, tag.sy]);
            } catch (eS) {}
            try { op.setValue(tag.op); } catch (eO) {}
          }
          writeComment(layer, stripMotionTag(readComment(layer)));
          restored += 1;
        } catch (err) {
          skipped.push(layer.name + " — " + err.toString());
        }
      }
      app.endUndoGroup();
      alert("Reset Motion OS on " + restored + " layer(s)." + (skipped.length ? "\n\nSkipped:\n- " + skipped.join("\n- ") : "") + "\n\nUser keys on untagged layers were not touched. Lockup/safe guides were not removed.");
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

    function numField(field, lo, hi, d) {
      var v = parseFloat(field.text);
      if (isNaN(v)) v = d;
      if (v < lo) v = lo;
      if (v > hi) v = hi;
      field.text = String(v);
      return v;
    }
    function pushPanelToMaster(comp) {
      var master = ensureMaster(comp);
      writeSlider(master, "EVO Motion", numField(mMotion, 0, 200, 100));
      writeSlider(master, "EVO Speed", numField(mSpeed, 25, 200, 100));
      writeSlider(master, "EVO Travel", numField(mTravel, 0, 200, 100));
      writeSlider(master, "EVO Stagger", numField(mStagger, 0, 200, 100));
      writeSlider(master, "EVO Overshoot", numField(mOver, 0, 200, 100));
      writeSlider(master, "EVO Spring", numField(mSpring, 0, 200, 100));
      writeSlider(master, "EVO Text", numField(mText, 0, 200, 100));
      writeSlider(master, "EVO UI", numField(mUI, 0, 200, 100));
      writeSlider(master, "EVO Seed", numField(mSeed, 1, 9999, 1));
      writeBox(master, "EVO Reduce", mReduce.value);
      writeBox(master, "EVO Blur", mBlur.value);
      return master;
    }
    function pullMasterToPanel(comp) {
      var master = findMaster(comp), v;
      if (!master) return;
      v = readMasterValues(master);
      mMotion.text = String(v.motion);
      mSpeed.text = String(v.speed);
      mTravel.text = String(v.travel);
      mStagger.text = String(v.stagger);
      mOver.text = String(v.overshoot);
      mSpring.text = String(v.spring);
      mText.text = String(v.text);
      mUI.text = String(v.ui);
      mSeed.text = String(v.seed);
      mReduce.value = v.reduce;
      mBlur.value = v.blur;
    }
    function applyMasterTimingToPlan(plan, masterVals, gap) {
      var speed = masterVals.speed / 100, stag = masterVals.stagger / 100, i, item, byRole = {}, role, group, minD, j, groupEnd = 0, ctaEnd = 0;
      for (i = 0; i < plan.length; i++) {
        item = plan[i];
        if (!byRole[item.role]) byRole[item.role] = [];
        byRole[item.role].push(item);
      }
      for (role in byRole) if (byRole.hasOwnProperty(role) && byRole[role].length > 1) {
        group = byRole[role];
        minD = group[0].delay;
        for (j = 1; j < group.length; j++) if (group[j].delay < minD) minD = group[j].delay;
        for (j = 0; j < group.length; j++) group[j].delay = round4(minD + (group[j].delay - minD) * stag);
      }
      for (i = 0; i < plan.length; i++) {
        plan[i].delay = round4(plan[i].delay / speed);
        plan[i].duration = round4(plan[i].duration / speed);
        if (plan[i].hold) plan[i].hold = round4(plan[i].hold / speed);
      }
      for (i = 0; i < plan.length; i++) {
        if (plan[i].after) continue;
        j = plan[i].delay + plan[i].duration * (plan[i].both ? 2 : 1);
        if (j > groupEnd) groupEnd = j;
      }
      for (i = 0; i < plan.length; i++) if (plan[i].after === "group") {
        plan[i].delay = round4(groupEnd + gap / speed - plan[i].duration * 0.15);
        if (plan[i].delay < 0) plan[i].delay = 0;
      }
      for (i = 0; i < plan.length; i++) if (plan[i].role === "cta") {
        j = plan[i].delay + plan[i].duration * (plan[i].both ? 2 : 1);
        if (j > ctaEnd) ctaEnd = j;
      }
      if (ctaEnd === 0) ctaEnd = groupEnd;
      for (i = 0; i < plan.length; i++) if (plan[i].after === "cta") plan[i].delay = round4(ctaEnd + 0.06 / speed);
      return plan;
    }
    function updateMotion() {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      if (!state.plan.length || planIsStale(comp)) { alert("Composition changed since the last Scan. Scan again before Update Motion."); return; }
      var master, vals, timed, i, layer, item, n = 0, skipped = [], style;
      app.beginUndoGroup("Evotechly Update Motion");
      try {
        master = pushPanelToMaster(comp);
        vals = readMasterValues(master);
        style = STYLES[currentStyle()] || STYLES.stripe;
        timed = applyMasterTimingToPlan(state.plan.slice(0), vals, style.gap);
        for (i = 0; i < timed.length; i++) {
          item = timed[i];
          layer = findLayer(comp, item.name);
          if (!layer) { skipped.push(item.name + " (missing)"); continue; }
          if (!parseMotionTag(readComment(layer))) { skipped.push(item.name + " (no Motion OS tag)"); continue; }
          if (layer.locked) { skipped.push(item.name + " (locked)"); continue; }
          try {
            applySpec(layer, item);
            applyMasterBlur(layer, vals.blur);
            n += 1;
          } catch (err) {
            skipped.push(item.name + " — " + err.toString());
          }
        }
      } catch (fatal) {
        skipped.push(fatal.toString());
      }
      app.endUndoGroup();
      alert("Update Motion on " + n + " layer(s). Travel/Intensity stay LIVE on EVO_MASTER." + (skipped.length ? "\n\nSkipped:\n- " + skipped.join("\n- ") : ""));
    }
    function resetMaster() {
      var comp = activeComp(); if (!comp) return;
      mMotion.text = "100"; mSpeed.text = "100"; mTravel.text = "100"; mStagger.text = "100";
      mOver.text = "100"; mSpring.text = "100"; mText.text = "100"; mUI.text = "100"; mSeed.text = "1";
      mReduce.value = false; mBlur.value = false;
      app.beginUndoGroup("Evotechly Reset Master");
      try {
        pushPanelToMaster(comp);
      } catch (e) {}
      app.endUndoGroup();
      if (state.plan.length && !planIsStale(comp)) updateMotion();
      else alert("Master sliders reset to 100. Scan + Update Motion if timing was changed.");
    }

    scanBtn.onClick = scan; applyBtn.onClick = apply; fitBtn.onClick = fitFootage;
    preflightBtn.onClick = runPreflight; resetBtn.onClick = resetMotion;
    pushMasterBtn.onClick = function () { var c = activeComp(); if (!c) { alert("Open a composition first."); return; } app.beginUndoGroup("Evotechly Push Master"); pushPanelToMaster(c); app.endUndoGroup(); };
    updateMotionBtn.onClick = updateMotion;
    resetMasterBtn.onClick = resetMaster;
    iUseSelCursor.onClick = function () { var c = activeComp(); if (!c) return; iPicks.cursor = firstSelectedName(c); refreshIntStatus(); };
    iUseSelTarget.onClick = function () { var c = activeComp(); if (!c) return; iPicks.target = firstSelectedName(c); refreshIntStatus(); };
    iUseSelSource.onClick = function () { var c = activeComp(); if (!c) return; iPicks.source = firstSelectedName(c); refreshIntStatus(); };
    iUseSelDest.onClick = function () {
      var c = activeComp(), n; if (!c) return; n = firstSelectedName(c);
      if (!iPicks.dest) iPicks.dest = n;
      else if (!iPicks.response) iPicks.response = n;
      else if (!iPicks.toast) iPicks.toast = n;
      else iPicks.metric = n;
      refreshIntStatus();
    };
    function buildOrUpdateInteraction(update) {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      var it = update ? selectedStoredInteraction(comp) : currentInteractionDraft(comp);
      var list, i;
      if (!it) { alert("Select an interaction in the list to update."); return; }
      if (update) {
        it.t0 = comp.time;
        it.duration = parseFloat(iDur.text) || it.duration;
        it.path = pathIds[iPath.selection ? iPath.selection.index : 0];
        if (iPicks.cursor) it.cursor = iPicks.cursor;
        if (iPicks.target) it.target = iPicks.target;
      }
      if (!it.cursor) it.cursor = firstSelectedName(comp);
      app.beginUndoGroup(update ? "Evotechly Update Interaction" : "Evotechly Build Interaction");
      try {
        ensureMaster(comp);
        runInteraction(comp, it);
        list = readInteractions(comp);
        if (!update) list.push(it);
        else {
          for (i = 0; i < list.length; i++) if (list[i].id === it.id) list[i] = it;
        }
        writeInteractions(comp, list);
        refreshIntList();
      } catch (err) {
        alert(String(err));
      }
      app.endUndoGroup();
    }
    iBuild.onClick = function () { buildOrUpdateInteraction(false); };
    iUpdate.onClick = function () { buildOrUpdateInteraction(true); };
    iReset.onClick = function () {
      var comp = activeComp(); if (!comp) return;
      var it = selectedStoredInteraction(comp);
      if (!it) { alert("Select an interaction."); return; }
      app.beginUndoGroup("Evotechly Reset Interaction");
      resetInteractionOwned(comp, it.id);
      app.endUndoGroup();
      alert("Reset helpers for " + it.id + ". User layers kept. Rebuild to restore motion.");
    };
    iDelete.onClick = function () {
      var comp = activeComp(); if (!comp) return;
      var it = selectedStoredInteraction(comp), list = [], i, all;
      if (!it) { alert("Select an interaction."); return; }
      app.beginUndoGroup("Evotechly Delete Interaction");
      resetInteractionOwned(comp, it.id);
      all = readInteractions(comp);
      for (i = 0; i < all.length; i++) if (all[i].id !== it.id) list.push(all[i]);
      writeInteractions(comp, list);
      refreshIntList();
      app.endUndoGroup();
    };
    iPreview.onClick = function () {
      var comp = activeComp(); if (!comp) return;
      var it = selectedStoredInteraction(comp) || currentInteractionDraft(comp);
      try {
        comp.workAreaStart = Math.max(0, it.t0);
        comp.workAreaDuration = Math.max(comp.frameDuration * 2, Number(it.duration || 0.6) + 0.8);
      } catch (e) { alert("Could not set work area."); }
    };
    refreshIntList();
    cPreset.onChange = applyPreset;
    cUseTarget.onClick = function () {
      var c = activeComp(); if (!c) return;
      cPick = firstSelectedName(c);
      cStatus.text = "Target: " + (cPick || "—");
    };
    cAttach.onClick = function () {
      var c = activeComp(); if (!c) return;
      app.beginUndoGroup("Evotechly Attach to Camera Frame");
      alert("Attached " + attachSelectedToFrame(c, ensureCamFrame(c)) + " layer(s) to EVO_SKIP_CAM_FRAME.");
      app.endUndoGroup();
    };
    function buildOrUpdateCamera(update) {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      var list = readCameras(comp), mv, i;
      if (update) {
        mv = selectedCam(comp);
        if (!mv) { alert("Select a camera move in the list."); return; }
        mv.t0 = comp.time;
        mv.duration = parseFloat(cDur.text) || mv.duration;
        mv.strength = parseFloat(cStr.text) || mv.strength;
        if (cPick) mv.target = cPick;
      } else {
        mv = {
          id: nextCamId(list),
          name: cPreset.selection && cPreset.selection.index > 0 ? cPreset.selection.text : cMove.selection.text,
          type: camTypes[cMove.selection ? cMove.selection.index : 0] || "push",
          mode: cMode.selection && cMode.selection.index === 1 ? "3d" : "2d",
          target: cPick || (cFollow.value ? firstSelectedName(comp) : ""),
          t0: comp.time,
          duration: parseFloat(cDur.text) || 0.8,
          strength: parseFloat(cStr.text) || 100,
          style: currentStyle(),
          ox: parseFloat(cOx.text) || 0,
          oy: parseFloat(cOy.text) || 0
        };
      }
      app.beginUndoGroup(update ? "Evotechly Update Camera" : "Evotechly Build Camera");
      try {
        ensureMaster(comp);
        runCamera(comp, mv);
        if (!update) list.push(mv);
        else {
          for (i = 0; i < list.length; i++) if (list[i].id === mv.id) list[i] = mv;
        }
        writeCameras(comp, list);
        refreshCamList();
      } catch (err) {
        alert(String(err));
      }
      app.endUndoGroup();
    }
    cBuild.onClick = function () { buildOrUpdateCamera(false); };
    cUpdate.onClick = function () { buildOrUpdateCamera(true); };
    cReset.onClick = function () {
      var comp = activeComp(), mv;
      if (!comp) return;
      mv = selectedCam(comp);
      if (!mv) { alert("Select a camera move."); return; }
      app.beginUndoGroup("Evotechly Reset Camera");
      resetCameraOwned(comp, mv.id);
      app.endUndoGroup();
    };
    cDelete.onClick = function () {
      var comp = activeComp(), mv, keep = [], all, i;
      if (!comp) return;
      mv = selectedCam(comp);
      if (!mv) { alert("Select a camera move."); return; }
      app.beginUndoGroup("Evotechly Delete Camera");
      resetCameraOwned(comp, mv.id);
      all = readCameras(comp);
      for (i = 0; i < all.length; i++) if (all[i].id !== mv.id) keep.push(all[i]);
      if (!keep.length && confirm("Last EVO camera move removed. Remove empty EVO frame rig too?")) {
        resetAllEvoCamera(comp);
      } else {
        writeCameras(comp, keep);
      }
      refreshCamList();
      app.endUndoGroup();
    };
    cResetAll.onClick = function () {
      var comp = activeComp(); if (!comp) return;
      if (!confirm("Reset all Motion OS camera moves? User cameras stay.")) return;
      app.beginUndoGroup("Evotechly Reset All Camera");
      resetAllEvoCamera(comp);
      refreshCamList();
      app.endUndoGroup();
    };

    refreshCamList();
    tFromBtn.onClick = function () { var c = activeComp(); if (!c) return; tPicks.from = firstSelectedName(c); refreshTransStatus(); };
    tToBtn.onClick = function () { var c = activeComp(); if (!c) return; tPicks.to = firstSelectedName(c); refreshTransStatus(); };
    tTaBtn.onClick = function () { var c = activeComp(); if (!c) return; tPicks.ta = firstSelectedName(c); refreshTransStatus(); };
    tTbBtn.onClick = function () { var c = activeComp(); if (!c) return; tPicks.tb = firstSelectedName(c); refreshTransStatus(); };
    function lastCamType(comp) {
      var list = readCameras(comp);
      return list.length ? list[list.length - 1].type : "";
    }
    function lastIntEnd(comp) {
      var list = readInteractions(comp), it;
      if (!list.length) return null;
      it = list[list.length - 1];
      return Number(it.t0 || 0) + Number(it.duration || 0.6);
    }
    function suggestDirFromCam(type) {
      if (type === "panRight" || type === "whipRight") return 1;
      if (type === "panLeft" || type === "whipLeft") return 0;
      if (type === "panUp" || type === "whipUp") return 2;
      if (type === "panDown" || type === "whipDown") return 3;
      return 0;
    }
    function buildOrUpdateTransition(update) {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      var list = readTransitions(comp), tr, i, t0;
      t0 = comp.time;
      if (tAfterInt.value) {
        i = lastIntEnd(comp);
        if (i != null) t0 = i;
      }
      if (tMatchCam.value) tDir.selection = suggestDirFromCam(lastCamType(comp));
      if (update) {
        tr = selectedTrans(comp);
        if (!tr) { alert("Select a transition in the list."); return; }
        tr.t0 = t0;
        tr.duration = parseFloat(tDur.text) || tr.duration;
        tr.strength = parseFloat(tStr.text) || tr.strength;
        tr.dir = transDirs[tDir.selection ? tDir.selection.index : 0];
        if (tPicks.from) tr.from = tPicks.from;
        if (tPicks.to) tr.to = tPicks.to;
        if (tPicks.ta) tr.ta = tPicks.ta;
        if (tPicks.tb) tr.tb = tPicks.tb;
      } else {
        tr = {
          id: nextTransId(list),
          name: tType.selection ? tType.selection.text : "Clean Push",
          type: transTypes[tType.selection ? tType.selection.index : 12] || "clean",
          from: tPicks.from || firstSelectedName(comp),
          to: tPicks.to,
          ta: tPicks.ta,
          tb: tPicks.tb,
          dir: transDirs[tDir.selection ? tDir.selection.index : 0],
          align: transAligns[tAlign.selection ? tAlign.selection.index : 0],
          t0: t0,
          duration: parseFloat(tDur.text) || 0.35,
          strength: parseFloat(tStr.text) || 100,
          style: currentStyle()
        };
      }
      if (!tr.from || !tr.to) { alert("Select FROM and TO layers."); return; }
      app.beginUndoGroup(update ? "Evotechly Update Transition" : "Evotechly Build Transition");
      try {
        resetTransitionOwned(comp, tr.id);
        runTransition(comp, tr);
        if (!update) list.push(tr);
        else {
          for (i = 0; i < list.length; i++) if (list[i].id === tr.id) list[i] = tr;
        }
        writeTransitions(comp, list);
        refreshTransList();
      } catch (err) {
        alert(String(err));
      }
      app.endUndoGroup();
    }
    tBuild.onClick = function () { buildOrUpdateTransition(false); };
    tUpdate.onClick = function () { buildOrUpdateTransition(true); };
    tReset.onClick = function () {
      var comp = activeComp(), tr;
      if (!comp) return;
      tr = selectedTrans(comp);
      if (!tr) { alert("Select a transition."); return; }
      app.beginUndoGroup("Evotechly Reset Transition");
      resetTransitionOwned(comp, tr.id);
      app.endUndoGroup();
    };
    tDelete.onClick = function () {
      var comp = activeComp(), tr, keep = [], all, i;
      if (!comp) return;
      tr = selectedTrans(comp);
      if (!tr) { alert("Select a transition."); return; }
      app.beginUndoGroup("Evotechly Delete Transition");
      resetTransitionOwned(comp, tr.id);
      all = readTransitions(comp);
      for (i = 0; i < all.length; i++) if (all[i].id !== tr.id) keep.push(all[i]);
      writeTransitions(comp, keep);
      refreshTransList();
      app.endUndoGroup();
    };
    tPreview.onClick = function () {
      var comp = activeComp(), tr, d;
      if (!comp) return;
      tr = selectedTrans(comp);
      if (!tr) { alert("Select a transition."); return; }
      d = Number(tr.duration || 0.35);
      try {
        comp.workAreaStart = Math.max(0, Number(tr.t0 || 0) - d);
        comp.workAreaDuration = Math.max(comp.frameDuration * 2, d * 2 + 0.2);
      } catch (e) { alert("Could not set work area."); }
    };
    tResetAll.onClick = function () {
      var comp = activeComp(); if (!comp) return;
      if (!confirm("Reset all Motion OS transitions? Source shots stay.")) return;
      app.beginUndoGroup("Evotechly Reset All Transitions");
      resetAllEvoTransitions(comp);
      refreshTransList();
      app.endUndoGroup();
    };

    refreshTransList();
    rUseAudio.onClick = function () {
      var c = activeComp(); if (!c) return;
      rAudioName = firstSelectedName(c);
      refreshRhythmStatus(c);
    };
    rTap.onClick = function () {
      var c = activeComp(), bpm, i, avg = 0;
      if (!c) return;
      rTaps.push(c.time);
      if (rTaps.length > 8) rTaps.shift();
      if (rTaps.length >= 2) {
        for (i = 1; i < rTaps.length; i++) avg += rTaps[i] - rTaps[i - 1];
        avg = avg / (rTaps.length - 1);
        if (avg > 0) {
          bpm = Math.round(60 / avg);
          if (bpm < 40) bpm = 40; if (bpm > 240) bpm = 240;
          rBpm.text = String(bpm);
        }
      }
    };
    rAnalyze.onClick = function () {
      var comp = activeComp(), helper, peaks, i, gaps = [], mid, bpm, conf = "LOW";
      if (!comp) return;
      if (!rAudioName) rAudioName = firstSelectedName(comp);
      app.beginUndoGroup("Evotechly Analyze Audio");
      try {
        helper = ensureAudioAmp(comp, rAudioName);
        peaks = peaksFromAmp(helper, 0.28, 8);
        if (peaks.length < 4) {
          alert("Low confidence. Use Manual BPM. Peaks: " + peaks.length);
          conf = "LOW";
        } else {
          for (i = 1; i < peaks.length; i++) gaps.push(peaks[i].time - peaks[i - 1].time);
          gaps.sort(function (a, b) { return a - b; });
          mid = gaps[Math.floor(gaps.length / 2)];
          bpm = mid > 0 ? Math.round(60 / mid) : 120;
          if (bpm < 70) bpm *= 2;
          if (bpm > 180) bpm = Math.round(bpm / 2);
          if (bpm < 40) bpm = 40; if (bpm > 240) bpm = 240;
          rBpm.text = String(bpm);
          conf = (gaps[gaps.length - 1] - gaps[0] < 0.28) ? "MEDIUM" : "LOW";
          alert("Estimated BPM ≈ " + bpm + " (" + conf + "). " + peaks.length + " peaks. Confirm before generating grid.");
        }
        writeRhythm(comp, { bpm: parseFloat(rBpm.text) || 120, start: comp.time, mode: rGridModes[rGrid.selection ? rGrid.selection.index : 0], offset: 0, audio: rAudioName, confidence: conf, locks: readRhythm(comp).locks || [] });
        refreshRhythmStatus(comp);
      } catch (err) { alert(String(err)); }
      app.endUndoGroup();
    };
    rGridBtn.onClick = function () {
      var comp = activeComp(), start, end, mode, offFrames, offSec, n, data;
      if (!comp) return;
      mode = rGridModes[rGrid.selection ? rGrid.selection.index : 0];
      if (rRange.selection && rRange.selection.index === 1) { start = 0; end = comp.duration; }
      else { start = comp.workAreaStart; end = comp.workAreaStart + comp.workAreaDuration; }
      offFrames = parseFloat(rOff.text) || 0;
      offSec = offFrames * comp.frameDuration;
      app.beginUndoGroup("Evotechly Generate Rhythm");
      clearEvoRhythmMarkers(comp);
      n = generateBeatGrid(comp, parseFloat(rBpm.text) || 120, start, end, mode, offSec);
      data = readRhythm(comp);
      data.bpm = parseFloat(rBpm.text) || 120;
      data.start = start;
      data.mode = mode;
      data.offset = offSec;
      data.audio = rAudioName;
      if (!data.confidence) data.confidence = "MANUAL";
      writeRhythm(comp, data);
      refreshRhythmStatus(comp);
      app.endUndoGroup();
      alert("Wrote " + n + " rhythm markers. User markers untouched.");
    };
    rPrev.onClick = function () {
      var c = activeComp(), b; if (!c) return;
      b = nearestRhythmBeat(c, c.time - 0.0002, "prev");
      if (b) c.time = b.time;
    };
    rNext.onClick = function () {
      var c = activeComp(), b; if (!c) return;
      b = nearestRhythmBeat(c, c.time + 0.0002, "next");
      if (b) c.time = b.time;
    };
    function snapPrefer() { return rSnapPref[rSnap.selection ? rSnap.selection.index : 0]; }
    function shiftStoredT0(list, id, newt0) {
      var i;
      for (i = 0; i < list.length; i++) if (list[i].id === id) list[i].t0 = newt0;
      return list;
    }
    rSnapBtn.onClick = function () {
      var comp = activeComp(), beat, it, mv, trs;
      if (!comp) return;
      beat = nearestRhythmBeat(comp, comp.time, snapPrefer());
      if (!beat) { alert("Generate a rhythm grid first."); return; }
      app.beginUndoGroup("Evotechly Snap to Beat");
      it = (typeof selectedStoredInteraction === "function") ? selectedStoredInteraction(comp) : null;
      mv = (typeof selectedCam === "function") ? selectedCam(comp) : null;
      trs = (typeof selectedTrans === "function") ? selectedTrans(comp) : null;
      if (it) { it.t0 = beat.time; writeInteractions(comp, shiftStoredT0(readInteractions(comp), it.id, beat.time)); alert(it.id + " start → " + beat.label); }
      else if (mv) { mv.t0 = beat.time; writeCameras(comp, shiftStoredT0(readCameras(comp), mv.id, beat.time)); alert(mv.id + " start → " + beat.label); }
      else if (trs) { trs.t0 = beat.time; writeTransitions(comp, shiftStoredT0(readTransitions(comp), trs.id, beat.time)); alert(trs.id + " start → " + beat.label); }
      else alert("Select an Interaction, Camera move, or Transition in its list.");
      app.endUndoGroup();
    };
    rClickBeat.onClick = function () {
      var comp = activeComp(), it, beat, dur, speed, move, pause, clickAt, delta;
      if (!comp) return;
      it = selectedStoredInteraction(comp);
      beat = nearestRhythmBeat(comp, comp.time, snapPrefer());
      if (!it || !beat) { alert("Select an interaction and generate beats."); return; }
      dur = Number(it.duration || 0.6);
      speed = masterUI().speed;
      move = (dur / (speed / 100)) * 0.55;
      pause = (dur / (speed / 100)) * 0.08;
      clickAt = Number(it.t0 || 0) + move + pause;
      delta = beat.time - clickAt;
      app.beginUndoGroup("Evotechly Click on Beat");
      it.t0 = Number(it.t0 || 0) + delta;
      writeInteractions(comp, shiftStoredT0(readInteractions(comp), it.id, it.t0));
      app.endUndoGroup();
      alert(it.id + " click lands on " + beat.label + ". Rebuild the interaction to apply keys.");
    };
    rCamPeak.onClick = function () {
      var comp = activeComp(), mv, beat, peakAt, delta;
      if (!comp) return;
      mv = selectedCam(comp);
      beat = nearestRhythmBeat(comp, comp.time, snapPrefer());
      if (!mv || !beat) { alert("Select a camera move and generate beats."); return; }
      peakAt = Number(mv.t0 || 0) + Number(mv.duration || 0.8) * 0.45;
      delta = beat.time - peakAt;
      app.beginUndoGroup("Evotechly Camera Peak on Beat");
      mv.t0 = Number(mv.t0 || 0) + delta;
      writeCameras(comp, shiftStoredT0(readCameras(comp), mv.id, mv.t0));
      app.endUndoGroup();
      alert(mv.id + " peak → " + beat.label + ". Update Camera to rebuild keys.");
    };
    rTransMid.onClick = function () {
      var comp = activeComp(), trs, beat, mid, delta;
      if (!comp) return;
      trs = selectedTrans(comp);
      beat = nearestRhythmBeat(comp, comp.time, snapPrefer());
      if (!trs || !beat) { alert("Select a transition and generate beats."); return; }
      mid = Number(trs.t0 || 0);
      if ((trs.align || "center") === "before") mid = Number(trs.t0 || 0) - Number(trs.duration || 0.35) / 2;
      if (trs.align === "after") mid = Number(trs.t0 || 0) + Number(trs.duration || 0.35) / 2;
      delta = beat.time - mid;
      app.beginUndoGroup("Evotechly Transition Mid on Beat");
      trs.t0 = Number(trs.t0 || 0) + delta;
      writeTransitions(comp, shiftStoredT0(readTransitions(comp), trs.id, trs.t0));
      app.endUndoGroup();
      alert(trs.id + " midpoint → " + beat.label + ". Update Transition to rebuild.");
    };
    rMetricDrop.onClick = function () {
      var comp = activeComp(), i, drop = null, it, m;
      if (!comp) return;
      try {
        for (i = 1; i <= comp.marker.numKeys; i++) {
          m = String(comp.marker.keyValue(i).comment || "");
          if (m.indexOf("EVO_DROP") === 0) drop = { time: comp.marker.keyTime(i) };
        }
      } catch (e) {}
      if (!drop) { alert("Mark Drop first."); return; }
      it = selectedStoredInteraction(comp);
      if (!it) { alert("Select a Metric interaction."); return; }
      app.beginUndoGroup("Evotechly Metric on Drop");
      it.t0 = drop.time;
      writeInteractions(comp, shiftStoredT0(readInteractions(comp), it.id, it.t0));
      app.endUndoGroup();
      alert(it.id + " → EVO_DROP. Rebuild interaction.");
    };
    rLockBtn.onClick = function () {
      var comp = activeComp(), data, it, mv, trs, beat;
      if (!comp) return;
      data = readRhythm(comp);
      beat = nearestRhythmBeat(comp, comp.time, "nearest");
      it = selectedStoredInteraction(comp);
      mv = selectedCam(comp);
      trs = selectedTrans(comp);
      if (it) data.locks.push({ kind: "int", id: it.id, point: "start", beat: beat ? beat.index : 0, interval: data.mode });
      else if (mv) data.locks.push({ kind: "cam", id: mv.id, point: "start", beat: beat ? beat.index : 0, interval: data.mode });
      else if (trs) data.locks.push({ kind: "trans", id: trs.id, point: "mid", beat: beat ? beat.index : 0, interval: data.mode });
      else { alert("Select an OS event in a list."); return; }
      writeRhythm(comp, data);
      refreshRhythmStatus(comp);
    };
    rUnlockBtn.onClick = function () {
      var comp = activeComp(), data, it, mv, trs, keep = [], i, id = "";
      if (!comp) return;
      data = readRhythm(comp);
      it = selectedStoredInteraction(comp); mv = selectedCam(comp); trs = selectedTrans(comp);
      id = it ? it.id : mv ? mv.id : trs ? trs.id : "";
      for (i = 0; i < data.locks.length; i++) if (data.locks[i].id !== id) keep.push(data.locks[i]);
      data.locks = keep;
      writeRhythm(comp, data);
      refreshRhythmStatus(comp);
    };
    rUpdateLocks.onClick = function () {
      var comp = activeComp(), data, beats, i, L, target, list;
      if (!comp) return;
      data = readRhythm(comp);
      beats = collectEvoBeatMarkers(comp);
      if (!beats.length) { alert("Generate grid first."); return; }
      if (!confirm("Rhythm update: " + data.locks.length + " locked event(s). Continue?")) return;
      app.beginUndoGroup("Evotechly Update Locked Events");
      for (i = 0; i < data.locks.length; i++) {
        L = data.locks[i];
        target = beats[Math.max(0, Number(L.beat || 1) - 1)] || beats[0];
        if (L.kind === "int") writeInteractions(comp, shiftStoredT0(readInteractions(comp), L.id, target.time));
        if (L.kind === "cam") writeCameras(comp, shiftStoredT0(readCameras(comp), L.id, target.time));
        if (L.kind === "trans") writeTransitions(comp, shiftStoredT0(readTransitions(comp), L.id, target.time));
      }
      app.endUndoGroup();
      alert("Locked event start times updated. Rebuild/Update each event to rewrite keys.");
    };
    rClear.onClick = function () {
      var comp = activeComp(), n;
      if (!comp) return;
      if (!confirm("Clear EVO rhythm markers only? User markers stay.")) return;
      app.beginUndoGroup("Evotechly Clear Rhythm");
      n = clearEvoRhythmMarkers(comp);
      app.endUndoGroup();
      alert("Removed " + n + " EVO rhythm markers.");
    };

    refreshRhythmStatus(activeComp());
    yUse.onClick = function () {
      var c = activeComp(), n, layer;
      if (!c) return;
      n = firstSelectedName(c);
      layer = n ? findLayer(c, n) : null;
      if (!layer || !isTextLayer(layer)) { alert("Select one text layer."); return; }
      yTarget = n;
      yStatus.text = "Target: " + n + (hasArabicText(textContent(layer)) ? "  ·  Arabic detected" : "");
    };
    function buildOrUpdateType(update) {
      var comp = activeComp(); if (!comp) { alert("Open a composition first."); return; }
      var list = readTypes(comp), it, i, layer;
      if (update) {
        it = selectedType(comp);
        if (!it) { alert("Select a type effect in the list."); return; }
        it.t0 = comp.time;
        it.duration = parseFloat(yDur.text) || it.duration;
        it.stagger = parseFloat(ySt.text) || it.stagger;
        it.keyword = yKey.text;
        it.startN = parseFloat(yA.text) || 0;
        it.endN = parseFloat(yB.text) || 100;
        it.prefix = yPre.text;
        it.suffix = ySuf.text;
        if (yTarget) it.target = yTarget;
      } else {
        it = {
          id: nextTypeId(list),
          name: yMode.selection ? yMode.selection.text : "Word Reveal",
          mode: yModes[yMode.selection ? yMode.selection.index : 0] || "word",
          target: yTarget || firstSelectedName(comp),
          dir: yDirs[yDir.selection ? yDir.selection.index : 0],
          order: yOrders[yOrder.selection ? yOrder.selection.index : 0],
          keyword: yKey.text,
          t0: comp.time,
          duration: parseFloat(yDur.text) || 0.6,
          stagger: parseFloat(ySt.text) || 0.05,
          startN: parseFloat(yA.text) || 0,
          endN: parseFloat(yB.text) || 100,
          prefix: yPre.text,
          suffix: ySuf.text,
          style: currentStyle()
        };
      }
      layer = findLayer(comp, it.target);
      if (!layer || !isTextLayer(layer)) { alert("Select one text layer."); return; }
      app.beginUndoGroup(update ? "Evotechly Update Type" : "Evotechly Build Type");
      try {
        resetTypeOwned(comp, it.id);
        runType(comp, it);
        if (!update) list.push(it);
        else {
          for (i = 0; i < list.length; i++) if (list[i].id === it.id) list[i] = it;
        }
        writeTypes(comp, list);
        refreshTypeList();
      } catch (err) { alert(String(err)); }
      app.endUndoGroup();
    }
    yBuild.onClick = function () { buildOrUpdateType(false); };
    yUpdate.onClick = function () { buildOrUpdateType(true); };
    yReset.onClick = function () {
      var comp = activeComp(), it;
      if (!comp) return;
      it = selectedType(comp);
      if (!it) { alert("Select a type effect."); return; }
      app.beginUndoGroup("Evotechly Reset Type");
      resetTypeOwned(comp, it.id);
      app.endUndoGroup();
    };
    yDelete.onClick = function () {
      var comp = activeComp(), it, keep = [], all, i;
      if (!comp) return;
      it = selectedType(comp);
      if (!it) { alert("Select a type effect."); return; }
      app.beginUndoGroup("Evotechly Delete Type");
      resetTypeOwned(comp, it.id);
      all = readTypes(comp);
      for (i = 0; i < all.length; i++) if (all[i].id !== it.id) keep.push(all[i]);
      writeTypes(comp, keep);
      refreshTypeList();
      app.endUndoGroup();
    };
    yResetAll.onClick = function () {
      var comp = activeComp(); if (!comp) return;
      if (!confirm("Reset all Motion OS typography? Text layers stay.")) return;
      app.beginUndoGroup("Evotechly Reset All Type");
      resetAllEvoType(comp);
      refreshTypeList();
      app.endUndoGroup();
    };
    yHitBeat.onClick = function () {
      var comp = activeComp(), it, beat;
      if (!comp) return;
      it = selectedType(comp);
      beat = nearestRhythmBeat(comp, comp.time, "nearest");
      if (!it || !beat) { alert("Select a type effect and generate beats."); return; }
      app.beginUndoGroup("Evotechly Text Hit on Beat");
      it.t0 = beat.time;
      writeTypes(comp, (function (list) { var i; for (i = 0; i < list.length; i++) if (list[i].id === it.id) list[i].t0 = it.t0; return list; })(readTypes(comp)));
      app.endUndoGroup();
      alert(it.id + " → " + beat.label + ". Update Type to rebuild.");
    };
    yKeyDrop.onClick = function () {
      var comp = activeComp(), i, drop = null, it, m;
      if (!comp) return;
      try {
        for (i = 1; i <= comp.marker.numKeys; i++) {
          m = String(comp.marker.keyValue(i).comment || "");
          if (m.indexOf("EVO_DROP") === 0) drop = { time: comp.marker.keyTime(i) };
        }
      } catch (e) {}
      if (!drop) { alert("Mark Drop first."); return; }
      it = selectedType(comp);
      if (!it) { alert("Select a type effect."); return; }
      it.t0 = drop.time;
      writeTypes(comp, (function (list) { var i; for (i = 0; i < list.length; i++) if (list[i].id === it.id) list[i].t0 = it.t0; return list; })(readTypes(comp)));
      alert(it.id + " → EVO_DROP. Update Type to rebuild.");
    };

    refreshTypeList();
    refreshRecipeDropdown();
    sCat.onChange = refreshRecipeDropdown;
    sBind.onClick = function () {
      var c = activeComp(), n, i, key;
      if (!c) return;
      n = firstSelectedName(c);
      if (!n) return;
      for (i = 0; i < sSlots.length; i++) {
        key = sSlots[i];
        if (!sInputs[key]) { sInputs[key] = n; break; }
      }
      sPreview.text = "Bound " + n + ". SETUP to validate.";
    };
    sSetup.onClick = function () {
      var def = currentRecipeDef(), miss = [], i, lines = [];
      if (!def) return;
      for (i = 0; i < def.req.length; i++) {
        if (!sInputs[def.req[i]]) miss.push(def.req[i]);
        lines.push((sInputs[def.req[i]] ? "✓ " : "✕ ") + def.req[i] + (sInputs[def.req[i]] ? " = " + sInputs[def.req[i]] : ""));
      }
      sPreview.text = def.name + "\n" + lines.join("\n") + "\n" + (miss.length ? "BLOCKED: " + miss.join(", ") : "READY — BUILD");
    };
    sBuild.onClick = function () {
      var comp = activeComp(), def, miss = [], i, out, rec, list, energy, rhythm;
      if (!comp) { alert("Open a composition first."); return; }
      def = currentRecipeDef();
      if (!def) return;
      for (i = 0; i < def.req.length; i++) if (!sInputs[def.req[i]]) miss.push(def.req[i]);
      if (miss.length) { alert("Missing required: " + miss.join(", ")); return; }
      energy = sEnergy.selection ? sEnergy.selection.text.toLowerCase() : "standard";
      if (energy === "standard") energy = "standard";
      rhythm = sRhythm.selection && sRhythm.selection.index === 1 ? "beat" : (sRhythm.selection && sRhythm.selection.index === 2 ? "drop" : "free");
      app.beginUndoGroup("Evotechly Build Recipe");
      try {
        addCompMarker(comp, comp.time, "EVO_SEQ_START");
        out = runRecipeSteps(comp, def.id, sInputs, comp.time, energy, rhythm);
        rec = { id: nextSeqId(readSeqs(comp)), recipe: def.id, name: def.name, t0: comp.time, energy: energy, rhythm: rhythm, status: "READY", children: out.children };
        list = readSeqs(comp);
        list.push(rec);
        writeSeqs(comp, list);
        refreshSeqList();
        alert(def.name + " built.\nChildren: " + out.children.length + "\nEnd ~ " + (Math.round(out.end * 10) / 10) + "s");
      } catch (err) { alert(String(err)); }
      app.endUndoGroup();
    };
    sReset.onClick = function () {
      var comp = activeComp(), rec;
      if (!comp) return;
      rec = selectedSeq(comp);
      if (!rec) { alert("Select a recipe instance."); return; }
      app.beginUndoGroup("Evotechly Reset Recipe");
      resetSeqOwned(comp, rec);
      rec.status = "READY";
      app.endUndoGroup();
    };
    sDelete.onClick = function () {
      var comp = activeComp(), rec, keep = [], all, i;
      if (!comp) return;
      rec = selectedSeq(comp);
      if (!rec) { alert("Select a recipe instance."); return; }
      app.beginUndoGroup("Evotechly Delete Recipe");
      resetSeqOwned(comp, rec);
      all = readSeqs(comp);
      for (i = 0; i < all.length; i++) if (all[i].id !== rec.id) keep.push(all[i]);
      writeSeqs(comp, keep);
      refreshSeqList();
      app.endUndoGroup();
    };
    sDetach.onClick = function () {
      var comp = activeComp(), rec, all, i;
      if (!comp) return;
      rec = selectedSeq(comp);
      if (!rec) { alert("Select a recipe instance."); return; }
      rec.status = "DETACHED";
      rec.children = [];
      all = readSeqs(comp);
      for (i = 0; i < all.length; i++) if (all[i].id === rec.id) all[i] = rec;
      writeSeqs(comp, all);
      refreshSeqList();
      alert(rec.id + " detached. Child Type/Cam/Int/Trans remain.");
    };

    refreshSeqList();
    eNew.onClick = function () {
      var key = eStructIds[eStruct.selection ? eStruct.selection.index : 0], purposes = structurePurposes(key), i, id;
      eShots = [];
      for (i = 0; i < purposes.length; i++) {
        id = "SHOT_" + (i + 1 < 10 ? "0" + (i + 1) : String(i + 1));
        eShots.push({ id: id, name: purposes[i], purpose: purposes[i], recipe: purposeRecipe(purposes[i]), inputs: {}, placeholder: false });
      }
      refreshEditShots();
      eStatus.text = "Plan: " + eShots.length + " shots. Bind inputs, then PREFLIGHT.";
    };
    eBind.onClick = function () {
      var c = activeComp(), n, shot, req, i;
      if (!c || !eList.selection) { alert("Select a shot in the list."); return; }
      n = firstSelectedName(c);
      if (!n) return;
      shot = eShots[eList.selection.index];
      req = recipeReq(shot.recipe);
      if (!req.length) req = ["title"];
      for (i = 0; i < req.length; i++) if (!shot.inputs[req[i]]) { shot.inputs[req[i]] = n; break; }
      eStatus.text = shot.id + " bound " + n;
      refreshEditShots();
    };
    ePh.onClick = function () {
      var c = activeComp(), shot, layer;
      if (!c || !eList.selection) return;
      shot = eShots[eList.selection.index];
      layer = ensurePlaceholder(c, shot.id, shot.purpose || "ASSET");
      shot.placeholder = true;
      shot.inputs.title = shot.inputs.title || layer.name;
      shot.inputs.dashboard = shot.inputs.dashboard || layer.name;
      shot.inputs.person = shot.inputs.person || layer.name;
      refreshEditShots();
      eStatus.text = "Placeholder " + layer.name;
    };
    ePre.onClick = function () {
      var i, shot, req, miss, est = 0, warn = [], block = [], lines = [], min;
      for (i = 0; i < eShots.length; i++) {
        shot = eShots[i];
        req = recipeReq(shot.recipe);
        miss = [];
        for (var r = 0; r < req.length; r++) if (!shot.inputs[req[r]] && !shot.placeholder) miss.push(req[r]);
        min = 1.2;
        if (shot.recipe.indexOf("speedrun") !== -1 || shot.recipe.indexOf("pipeline") !== -1) min = 1.8;
        if (shot.recipe.indexOf("won") !== -1 || shot.recipe.indexOf("workflow") !== -1) min = 2.2;
        est += min;
        lines.push((Math.round((est - min) * 10) / 10) + "  " + shot.id + "  " + shot.recipe);
        if (shot.placeholder) warn.push(shot.id + " placeholder");
        if (miss.length) block.push(shot.id + " missing " + miss.join("/"));
      }
      var target = eDurVals[eDur.selection ? eDur.selection.index : 0];
      if (est > target * 1.35) block.push("Min readable ~" + (Math.round(est * 10) / 10) + "s > target " + target + "s");
      else if (est > target) warn.push("Est " + (Math.round(est * 10) / 10) + "s over target " + target + "s");
      eStatus.text = (block.length ? "BLOCKED" : warn.length ? "READY WITH WARNINGS" : "READY") + "\n" + lines.join("\n") + "\n~" + (Math.round(est * 10) / 10) + "s  " + (block.length ? block[0] : (warn[0] || ""));
    };
    eGo.onClick = function () {
      var comp = activeComp(), i, shot, out, kids = [], t0, rec, list, edit, energy, rhythm;
      if (!comp) { alert("Open a composition first."); return; }
      if (!eShots.length) { alert("NEW EDIT first."); return; }
      if (eStatus.text.indexOf("BLOCKED") === 0) { alert("Fix preflight blockers first."); return; }
      rhythm = eRhy.selection && eRhy.selection.index === 1 ? "free" : "beat";
      app.beginUndoGroup("Evotechly Compile Edit");
      try {
        t0 = comp.time;
        addCompMarker(comp, t0, "EVO_EDIT_START");
        for (i = 0; i < eShots.length; i++) {
          shot = eShots[i];
          addCompMarker(comp, t0, "EVO_SHOT_" + shot.id);
          out = runRecipeSteps(comp, shot.recipe, shot.inputs, t0, "standard", rhythm);
          kids = kids.concat(out.children);
          t0 = out.end;
        }
        addCompMarker(comp, t0, "EVO_EDIT_END");
        edit = { id: nextEditId(readEdits(comp)), name: "Edit", format: eFmt.selection ? eFmt.selection.text : "9:16", target: eDurVals[eDur.selection ? eDur.selection.index : 0], rhythm: rhythm, status: "READY", shots: eShots, children: kids };
        list = readEdits(comp);
        list.push(edit);
        writeEdits(comp, list);
        refreshEditList();
        try { comp.workAreaStart = Math.max(0, edit.shots.length ? comp.time : 0); } catch (eW) {}
        alert(edit.id + " compiled\nShots " + eShots.length + "\nChildren " + kids.length + "\nEnd ~ " + (Math.round(t0 * 10) / 10) + "s");
      } catch (err) {
        alert("BUILD FAILED: " + String(err));
      }
      app.endUndoGroup();
    };
    eDetach.onClick = function () {
      var comp = activeComp(), list, i;
      if (!comp || !eEdits.selection) { alert("Select a compiled edit."); return; }
      list = readEdits(comp);
      i = eEdits.selection.index;
      list[i].status = "DETACHED";
      list[i].children = [];
      writeEdits(comp, list);
      refreshEditList();
      alert(list[i].id + " detached. Shot objects remain.");
    };
    eReset.onClick = function () {
      var comp = activeComp(), list, i, parts, p, pair;
      if (!comp || !eEdits.selection) return;
      if (!confirm("Reset compiler assembly for this edit? Source assets stay.")) return;
      list = readEdits(comp);
      i = eEdits.selection.index;
      parts = String(list[i].children || "").split(",");
      app.beginUndoGroup("Evotechly Reset Edit");
      for (p = 0; p < parts.length; p++) {
        pair = parts[p].split(":");
        if (pair[0] === "type") resetTypeOwned(comp, pair[1]);
        if (pair[0] === "cam") resetCameraOwned(comp, pair[1]);
        if (pair[0] === "int") resetInteractionOwned(comp, pair[1]);
        if (pair[0] === "trans") resetTransitionOwned(comp, pair[1]);
      }
      list.splice(i, 1);
      writeEdits(comp, list);
      refreshEditList();
      app.endUndoGroup();
    };

    refreshEditList();
    prPerson.onClick = function () {
      var c = activeComp(), n, layer;
      if (!c) return;
      n = firstSelectedName(c);
      layer = n ? findLayer(c, n) : null;
      if (layer && isAudioLayer(layer)) { alert("That looks like audio. Select video footage."); return; }
      prPicks.person = n;
      prStatus.text = "Person: " + (n || "—") + "\nProduct: " + (prPicks.product || "—") + "\nName: " + (prPicks.name || "—");
    };
    prProduct.onClick = function () { var c = activeComp(); if (!c) return; prPicks.product = firstSelectedName(c); prStatus.text = "Person: " + (prPicks.person || "—") + "\nProduct: " + (prPicks.product || "—"); };
    prName.onClick = function () {
      var c = activeComp(), n;
      if (!c) return;
      n = firstSelectedName(c);
      if (!prPicks.name) prPicks.name = n;
      else if (!prPicks.role) prPicks.role = n;
      else prPicks.quote = n;
      prStatus.text = "Name: " + (prPicks.name || "—") + "  Role: " + (prPicks.role || "—");
    };
    prSetup.onClick = function () {
      var lines = [];
      lines.push(prPicks.person ? "✓ Person = " + prPicks.person : "✕ Person");
      if (prPicks.name) lines.push("✓ Name");
      if (prPicks.product) lines.push("✓ Product");
      else if (prTypes[prType.selection ? prType.selection.index : 0] === "personProduct") lines.push("✕ Product");
      prStatus.text = lines.join("\n") + "\n" + (prPicks.person ? "READY" : "BLOCKED");
    };
    prBuild.onClick = function () {
      var comp = activeComp(), person, type, layout, id, rec, list, mv;
      if (!comp) return;
      if (!prPicks.person) { alert("Select person footage."); return; }
      person = findLayer(comp, prPicks.person);
      if (!person) { alert("Person layer missing."); return; }
      if (isAudioLayer(person)) { alert("Person cannot be an audio layer."); return; }
      type = prTypes[prType.selection ? prType.selection.index : 0];
      layout = prLays[prLay.selection ? prLay.selection.index : 0];
      app.beginUndoGroup("Evotechly Build Pro");
      try {
        id = nextProId(readPros(comp));
        framePerson(comp, person, layout);
        proZone(comp, layout);
        if (prDens.selection && prDens.selection.index !== 0) {
          mv = { id: nextCamId(readCameras(comp)), name: "Pro " + id, type: prDens.selection.index === 2 ? "punch" : "microPush", mode: "2d", target: prPicks.person, t0: comp.time, duration: prDens.selection.index === 2 ? 0.4 : 6, strength: prDens.selection.index === 2 ? 40 : 35, style: currentStyle(), ox: 0, oy: 0 };
          runCamera(comp, mv);
          writeCameras(comp, readCameras(comp).concat([mv]));
        } else {
          mv = { id: nextCamId(readCameras(comp)), name: "Pro " + id, type: "microPush", mode: "2d", target: prPicks.person, t0: comp.time, duration: 6, strength: 35, style: currentStyle(), ox: 0, oy: 0 };
          runCamera(comp, mv);
          writeCameras(comp, readCameras(comp).concat([mv]));
        }
        if (prPicks.name) runType(comp, { id: nextTypeId(readTypes(comp)), name: "LT " + id, mode: "lowerThird", target: prPicks.name, dir: "up", order: "forward", keyword: "", t0: comp.time, duration: 0.5, stagger: 0.05, startN: 0, endN: 100, prefix: "", suffix: "", style: currentStyle() });
        if (prPicks.quote) runType(comp, { id: nextTypeId(readTypes(comp)), name: "Quote " + id, mode: "line", target: prPicks.quote, dir: "up", order: "forward", keyword: "", t0: comp.time + 0.6, duration: 0.6, stagger: 0.05, startN: 0, endN: 100, prefix: "", suffix: "", style: currentStyle() });
        if (prPicks.product && (type === "personProduct" || type === "founderSocial" || type === "caseStudy")) {
          addProPip(comp, findLayer(comp, prPicks.product), layout, id);
        }
        rec = { id: id, type: type, person: prPicks.person, layout: layout, product: prPicks.product, nameL: prPicks.name, role: prPicks.role, status: "READY" };
        list = readPros(comp);
        list.push(rec);
        writePros(comp, list);
        refreshProList();
        addCompMarker(comp, comp.time, "EVO_PRO_START " + id);
        alert(id + "  " + type + "  layout " + layout + "\nAudio layers were not touched.");
      } catch (err) { alert(String(err)); }
      app.endUndoGroup();
    };
    prMicro.onClick = function () {
      var c = activeComp(); if (!c || !prPicks.person) return;
      runCamera(c, { id: nextCamId(readCameras(c)), name: "Micro", type: "microPush", mode: "2d", target: prPicks.person, t0: c.time, duration: 6, strength: 35, style: currentStyle(), ox: 0, oy: 0 });
    };
    prLT.onClick = function () {
      var c = activeComp(); if (!c || !prPicks.name) { alert("Select a name text layer."); return; }
      runType(c, { id: nextTypeId(readTypes(c)), name: "Lower Third", mode: "lowerThird", target: prPicks.name, dir: "up", order: "forward", keyword: "", t0: c.time, duration: 0.5, stagger: 0.05, startN: 0, endN: 100, prefix: "", suffix: "", style: currentStyle() });
    };
    prIns.onClick = function () {
      var c = activeComp(), prod;
      if (!c || !prPicks.product) { alert("Select product / B-roll."); return; }
      prod = findLayer(c, prPicks.product);
      if (!prod) return;
      if (isAudioLayer(prod)) { alert("Insert is visual only. Audio A-roll was not changed."); return; }
      app.beginUndoGroup("Evotechly Product Insert");
      addProPip(c, prod, prLays[prLay.selection ? prLay.selection.index : 0], "INS");
      addCompMarker(c, c.time, "EVO_PRO_PRODUCT_IN");
      app.endUndoGroup();
    };
    prCap.onClick = function () { applyCaptionTemplate("hook", true); };
    prMark.onClick = function () {
      var c = activeComp(); if (!c) return;
      addCompMarker(c, c.time, "EVO_SPEECH_HIT");
    };
    prReset.onClick = function () {
      var c = activeComp(), rec;
      if (!c) return;
      rec = selectedPro(c);
      app.beginUndoGroup("Evotechly Reset Pro");
      resetProOwned(c, rec ? rec.id : "*");
      app.endUndoGroup();
    };
    prDetach.onClick = function () {
      var c = activeComp(), rec, list, i;
      if (!c) return;
      rec = selectedPro(c);
      if (!rec) return;
      rec.status = "DETACHED";
      list = readPros(c);
      for (i = 0; i < list.length; i++) if (list[i].id === rec.id) list[i] = rec;
      writePros(c, list);
      refreshProList();
    };

    refreshProList();
    xDry.onClick = function () {
      var comp = activeComp(), out, lines = [], i;
      if (!comp) return;
      out = planSfxCues(comp, xFamIds[xFam.selection ? xFam.selection.index : 0], xDenIds[xDen.selection ? xDen.selection.index : 0], parseFloat(xInt.text) || 100);
      xPending = out.applied;
      for (i = 0; i < out.applied.length && i < 8; i++) lines.push(out.applied[i].cat + "  @ " + (Math.round(out.applied[i].t * 100) / 100) + "  " + out.applied[i].event.split(" ")[0]);
      xPlan.text = "Suggested " + out.applied.length + " / scanned " + out.plan.length + "\n" + (lines.join("\n") || "No semantic events in markers.");
    };
    xApply.onClick = function () {
      var comp = activeComp(), i, cue, list, inten;
      if (!comp) return;
      if (!xPending.length) { alert("Run AUTO CUE dry-run first."); return; }
      inten = parseFloat(xInt.text) || 100;
      if (inten <= 0) { alert("SFX Intensity 0 — nothing placed."); return; }
      app.beginUndoGroup("Evotechly Apply SFX Cues");
      list = readSfx(comp);
      for (i = 0; i < xPending.length; i++) {
        cue = { id: nextSfxId(list), event: xPending[i].event, cat: xPending[i].cat, family: xFamIds[xFam.selection ? xFam.selection.index : 0], t: xPending[i].t, gain: -12, status: "READY" };
        placeSfxMarker(comp, cue);
        list.push(cue);
      }
      writeSfx(comp, list);
      refreshSfxList();
      app.endUndoGroup();
      alert("Placed " + xPending.length + " cue markers.\nImport licensed WAV/AIFF into [EVO SFX] layers yourself — Motion OS does not ship samples.");
    };
    xReset.onClick = function () {
      var comp = activeComp(); if (!comp) return;
      if (!confirm("Remove Motion OS SFX cues only? Music / VO stay.")) return;
      app.beginUndoGroup("Evotechly Reset SFX");
      resetSfxOwned(comp, null);
      writeSfx(comp, []);
      refreshSfxList();
      app.endUndoGroup();
    };
    xDetach.onClick = function () {
      var comp = activeComp(), list, i;
      if (!comp) return;
      list = readSfx(comp);
      for (i = 0; i < list.length; i++) list[i].status = "DETACHED";
      writeSfx(comp, list);
      refreshSfxList();
      alert("Cues detached. Markers remain as ordinary timeline notes.");
    };
    xMute.onClick = function () {
      var comp = activeComp(), i, layer;
      if (!comp) return;
      for (i = 1; i <= comp.numLayers; i++) {
        layer = comp.layer(i);
        if ((layer.name || "").indexOf("[EVO SFX") === 0) {
          try { layer.audioEnabled = !xMute.value; } catch (e) {}
        }
      }
    };

    refreshSfxList();
    bApply.onClick = function () {
      var comp = activeComp(), sel;
      if (!comp) { alert("Open a composition first."); return; }
      sel = currentBrandSel();
      app.beginUndoGroup("Evotechly Apply Brand Profile");
      writeBrand(comp, sel);
      addCompMarker(comp, comp.time, "EVO_BRAND " + sel.profile + " " + sel.mode);
      app.endUndoGroup();
      bSum.text = "Active: " + sel.profile + " / " + sel.mode + " / " + sel.energy + "\nContext " + sel.context + "  Objects " + sel.link + "\nAccent #FF6A00 (EvoCRM/Evotechly). New Motion OS objects inherit this profile.\nExisting objects were NOT rebuilt.";
    };
    bCheck.onClick = function () {
      var comp = activeComp(), sel, cams, whips, sfx, lines = [];
      if (!comp) return;
      sel = currentBrandSel();
      cams = countMarkersPrefix(comp, ["EVO_CAM_"]);
      whips = countMarkersPrefix(comp, ["EVO_CAM_WHIP", "EVO_TRANS_"]);
      sfx = countMarkersPrefix(comp, ["EVO_SFX"]);
      if (whips > 6 && sel.mode === "professional") lines.push("WARNING  Transition/camera density high for Professional");
      else if (whips > 8) lines.push("WARNING  Transition density exceeds " + sel.profile + " recommendation");
      if (cams > 6 && sel.mode !== "launch") lines.push("WARNING  Camera emphasis density high");
      if (sfx > 20 && sel.mode === "professional") lines.push("WARNING  SFX density high for Professional");
      if (sel.profile === "evocrm" && currentStyle() !== "evotechly" && currentStyle() !== "calm" && currentStyle() !== "linear") lines.push("INFO  Style " + currentStyle() + " is experimental for EvoCRM");
      if (!lines.length) lines.push("INFO  " + sel.profile + " " + sel.mode + " — no policy breaches on markers");
      bSum.text = "BRAND CHECK  " + sel.profile + " / " + sel.mode + "\n" + lines.join("\n") + "\nNo automatic restyle.";
    };
    (function loadBrand() {
      var comp = activeComp(), a;
      if (!comp) return;
      a = readBrand(comp);
      bSum.text = "Active: " + a.profile + " / " + a.mode + " / " + a.energy;
    })();


    qRun.onClick = function () {
      var comp = activeComp(), r;
      r = runPreflight(comp);
      qLast = r;
      qStatus.text = r.status + "\nBlockers " + r.blockers + "  Warnings " + r.warnings + "  Info " + r.info + "\n" + r.issues.slice(0, 6).join("\n");
      if (comp) writeQa(comp, r.status + " @ " + comp.time);
    };
    qFix.onClick = function () {
      var comp = activeComp(), i, layer, n, fixed = 0;
      if (!comp) return;
      app.beginUndoGroup("Evotechly QA Safe Fix");
      for (i = 1; i <= comp.numLayers; i++) {
        layer = comp.layer(i);
        n = layer.name || "";
        if (n.indexOf("EVO_SKIP_") === 0) {
          try { layer.guideLayer = true; layer.enabled = false; fixed++; } catch (e) {}
        }
      }
      app.endUndoGroup();
      alert("Safe fixes applied: " + fixed + " store/guide layers set Guide + disabled.\nNo creative timing changed.");
    };
    qDel.onClick = function () {
      var comp = activeComp(), r, layer;
      if (!comp) return;
      r = qLast || runPreflight(comp);
      if (r.blockers) { alert("BLOCKED. Resolve blockers before delivery."); return; }
      app.beginUndoGroup("Evotechly Prepare Delivery");
      layer = comp.layers.addText("README_DELIVERY\nMain: " + comp.name + "\n" + comp.width + "x" + comp.height + " @ " + comp.frameRate + "fps\nMotion OS 0.21.0-rc1\nStatus: " + r.status + "\nReview mix manually.");
      layer.name = "[EVO QA] README_DELIVERY";
      try { layer.guideLayer = true; } catch (e) {}
      writeQa(comp, "DELIVERY " + r.status);
      app.endUndoGroup();
      alert("Handoff note layer created.\nStatus: " + r.status + "\nv1.0.0 not tagged — AE host tests still required.");
    };
    qWork.onClick = function () {
      var comp = activeComp();
      if (!comp) return;
      try { comp.workAreaStart = 0; comp.workAreaDuration = Math.max(comp.frameDuration, comp.duration); } catch (e) { alert(String(e)); }
    };


    dAn.onClick = function () {
      var comp = activeComp(), recs, i, lines = [];
      recs = directorAnalyze(comp, dGoal.selection ? dGoal.selection.text : "Product Demo", dMode.selection ? dMode.selection.text : "Product");
      dCache = recs;
      dList.removeAll();
      for (i = 0; i < recs.length; i++) {
        dList.add("item", recs[i].action);
        if (i < 3) lines.push((i + 1) + ". " + recs[i].reason);
      }
      dWhy.text = "TOP " + Math.min(3, recs.length) + "\n" + lines.join("\n");
    };
    dPrev.onClick = function () {
      var n = dList.selection ? (dList.selection.length || 1) : 0;
      alert("PLAN (read-only)\nSelected: " + n + "\nNo layers will change until APPLY SELECTED.");
    };
    dApp.onClick = function () {
      var comp = activeComp(), i, rec, n = 0;
      if (!comp) { alert("Open a composition first."); return; }
      if (!dCache.length) { alert("ANALYZE first."); return; }
      if (!dList.selection) { alert("Select recommendations to apply."); return; }
      app.beginUndoGroup("Evotechly Director Apply");
      try {
        addCompMarker(comp, comp.time, "EVO_DIR_PLAN");
        for (i = 0; i < dCache.length; i++) {
          rec = dCache[i];
          if (rec.engine === "none") continue;
          addCompMarker(comp, comp.time + i * comp.frameDuration, "EVO_DIR " + rec.engine + " " + rec.action);
          n++;
        }
        writeDir(comp, "APPLIED " + n);
        alert("Applied " + n + " plan markers.\nUse Camera / Type / Interact / SFX tabs to execute the named actions.\nDirector does not invent keyframes.");
      } catch (err) { alert(String(err)); }
      app.endUndoGroup();
    };


    vAn.onClick = function () {
      var from = vFrom.selection ? vFrom.selection.text : "16:9";
      var to = vTo.selection ? vTo.selection.text : "9:16";
      var dur = vDur.selection ? vDur.selection.text : "Keep";
      vLines = adaptPlan(from, to, dur);
      if (vLang.selection && vLang.selection.text === "Arabic") vLines.push("COPY CHECK required — missing keys BLOCK");
      vPlan.text = from + " → " + to + " / " + dur + "\n" + vLines.join("\n");
    };
    vBuild.onClick = function () {
      var comp = activeComp(), list, rec;
      if (!comp) { alert("Open a composition first."); return; }
      if (!vLines.length) { alert("ANALYZE ADAPTATION first."); return; }
      app.beginUndoGroup("Evotechly Build Variant");
      list = readVars(comp);
      rec = { id: nextVarId(list), fmt: vTo.selection ? vTo.selection.text : "9:16", dur: vDur.selection ? vDur.selection.text : "Keep", lang: vLang.selection ? vLang.selection.text : "English", hook: vHook.selection ? vHook.selection.text : "A", status: "READY" };
      list.push(rec);
      writeVars(comp, list);
      addCompMarker(comp, comp.time, "EVO_VARIANT " + rec.id + " " + rec.fmt);
      refreshVarList();
      app.endUndoGroup();
      alert(rec.id + " recorded on this master.\nMaster objects were not remapped.\nBuild a dedicated variant comp in AE from this plan; do not scale the master.");
    };
    refreshVarList();


    aReg.onClick = function () {
      var c = activeComp(), n, list, rec, guess;
      if (!c) return;
      n = firstSelectedName(c);
      if (!n) { alert("Select a layer / footage."); return; }
      guess = guessKey(n);
      list = readAssets(c);
      rec = { id: nextAssetId(list), key: aKey.selection ? aKey.selection.text : guess, name: n, lang: "en", fmt: "9:16", status: "READY" };
      list.push(rec);
      writeAssets(c, list);
      refreshAst();
      aStat.text = rec.id + " bound to " + rec.key + "\nSuggestion from name was " + guess + " — confirm in the key list.";
    };
    aVal.onClick = function () {
      var c = activeComp(), list, need, i, have = {}, miss = [];
      if (!c) return;
      list = readAssets(c);
      need = ["PRODUCT_MAIN", "LOGO_LIGHT"];
      for (i = 0; i < list.length; i++) have[list[i].key] = list[i].name;
      for (i = 0; i < need.length; i++) if (!have[need[i]]) miss.push(need[i]);
      aStat.text = miss.length ? ("GAPS\n" + miss.join("\n")) : ("READY  " + list.length + " registered\nNo silent fallback.");
    };
    refreshAst();


    rAdd.onClick = function () {
      var c = activeComp(), list, rec, note;
      if (!c) return;
      note = prompt("Comment", "") || "";
      if (!note) return;
      app.beginUndoGroup("Evotechly Review Comment");
      list = readRevs(c);
      rec = { id: nextCommentId(list), t: c.time, pri: rPri.selection ? rPri.selection.text : "NORMAL", status: "OPEN", text: note };
      list.push(rec);
      writeRevs(c, list);
      addCompMarker(c, rec.t, "EVO_REVIEW " + rec.id);
      refreshRev();
      app.endUndoGroup();
    };
    rGo.onClick = function () {
      var c = activeComp(), list, rec;
      if (!c || !rList.selection) return;
      list = readRevs(c);
      rec = list[rList.selection.index];
      if (rec) try { c.time = rec.t; } catch (e) {}
    };
    rRes.onClick = function () {
      var c = activeComp(), list;
      if (!c || !rList.selection) return;
      list = readRevs(c);
      list[rList.selection.index].status = "RESOLVED";
      writeRevs(c, list);
      refreshRev();
    };
    rImp.onClick = function () {
      var raw = prompt("Paste notes: 00:07 - text", "") || "";
      var lines = raw.split("\\n"), i, n = 0, m;
      for (i = 0; i < lines.length; i++) {
        m = lines[i].match(/(\\d+:\\d+|\\d+\\.\\d+)\\s*[-:]\\s*(.+)/);
        if (m) n++;
      }
      alert("Preview only. Detected ~" + n + " timed notes.\\nConfirm in a later import. No comments written yet.");
    };
    rApp.onClick = function () {
      var c = activeComp(), list, i, block = 0;
      if (!c) return;
      list = readRevs(c);
      for (i = 0; i < list.length; i++) if (list[i].status === "OPEN" && list[i].pri === "BLOCKING") block++;
      if (block) { alert("Cannot approve. " + block + " blocking comments open."); return; }
      addCompMarker(c, c.time, "EVO_APPROVED");
      writeQa(c, "REVIEW APPROVED @ " + c.time);
      alert("APPROVED recorded for this state.\\nNot a legal signature. Material edits will stale this.");
    };
    refreshRev();


    pNew.onClick = function () {
      var c = activeComp(), list, rec, title;
      if (!c) return;
      title = prompt("Title", "Deal Won Reel") || "Untitled";
      list = readProd(c);
      rec = { id: nextContentId(list), title: title, type: pType.selection ? pType.selection.text : "SOCIAL AD", status: "BRIEF" };
      list.push(rec);
      writeProd(c, list);
      refreshProd();
      pStat.text = rec.id + " created. Script/shots still empty.";
    };
    pReady.onClick = function () {
      var c = activeComp(), ast, miss = [];
      if (!c) return;
      ast = readAssets(c);
      if (!ast.length) miss.push("No registered assets");
      pStat.text = miss.length ? ("BLOCKED\\n" + miss.join("\\n")) : "READY TO SHOOT if brief/script marked elsewhere.";
    };
    pHand.onClick = function () {
      alert("HANDOFF PREVIEW\\n1 Hook Clean\\n2 Workflow / Deal Won\\n3 Metric Payoff\\n4 CTA / Logo Outro\\nConfirm in Edit tab. This does not compile the timeline.");
    };
    refreshProd();


    anGo.onClick = function () {
      anOut.text = "OBSERVATION\\n" + (anA.text || "") + " vs " + (anB.text || "") + "\\nHighest observed " + (anDim.selection ? anDim.selection.text : "Hook") + ".\\nAudience equality unknown. Not causation.";
    };
    anLearn.onClick = function () {
      var c = activeComp();
      if (c) writeAn(c, "LEARNING DRAFT " + (anDim.selection ? anDim.selection.text : "Hook") + " — not Director-eligible until promoted.");
      alert("Learning stored as OBSERVED / MANUAL ONLY.\\nPromote to Director is a separate explicit action.");
    };


    function refreshHome() {
      var c = activeComp(), ast = 0, rev = 0, prod = 0;
      if (!c) { hStat.text = "No active composition.\nAnimate Selection still works without a Content ID."; return; }
      try { ast = readAssets(c).length; } catch (e0) {}
      try { rev = readRevs(c).length; } catch (e1) {}
      try { prod = readProd(c).length; } catch (e2) {}
      hStat.text = c.name + "\nAssets " + ast + "  Review notes " + rev + "  Content " + prod + "\nHome routes. Owners stay P15/P16/P12.";
    }
    hNext.onClick = function () {
      var c = activeComp();
      if (!c) { alert("Open a composition, or Animate Selection on the Motion tab."); return; }
      try {
        if (!readAssets(c).length) { alert("NEXT: REGISTER an asset (P15)."); return; }
      } catch (e) {}
      alert("NEXT: CONTINUE EDIT or RUN PREFLIGHT.\nHome only routes.");
    };
    hQa.onClick = function () { try { qRun.onClick(); } catch (e) { alert("Open QA tab."); } };
    hDir.onClick = function () { try { dAn.onClick(); } catch (e) { alert("Open Director tab."); } };
    hFind.onClick = function () {
      var q = lower(hSearch.text || ""), hits = [];
      if (!q) return;
      if (q.indexOf("cam") !== -1) hits.push("Camera tab");
      if (q.indexOf("asset") !== -1 || q.indexOf("deal") !== -1) hits.push("Assets tab");
      if (q.indexOf("review") !== -1) hits.push("Review tab");
      alert(hits.length ? hits.join("\n") : "No indexed hit. Use Advanced tabs.");
    };
    refreshHome();


    auDry.onClick = function () {
      var on = auOn.value;
      auHist.text = on
        ? "DRY RUN\nWould refresh readiness. No layers written. Director apply is never in this plan."
        : "Automation OFF. Dry run still allowed. No writes.";
    };


    cScan.onClick = function () {
      var c = activeComp(), n = 0;
      if (c) n = c.numLayers;
      cHealth.text = "READY\nLayers " + n + "  Stores counted only. No migration applied.";
    };
    cRebuild.onClick = function () {
      alert("Registry rebuild is an index refresh.\\nAuthoritative stores are unchanged. No visual rewrite.");
    };


    uxMode.onChange = function () {
      var m = uxMode.selection ? uxMode.selection.text : "Standard";
      uxHint.text = m === "Quick"
        ? "Quick: Animate / Interact / Frame / Text. Tools stay available."
        : m === "Advanced"
          ? "Advanced: IDs, System, Auto, raw stores."
          : "Standard: context + inspector-level actions.";
    };
    uxAct.onClick = function () {
      var c = activeComp(), name = "";
      if (c) name = firstSelectedName(c) || "";
      if (/text|title|hook|caption/i.test(name)) alert("TEXT\\nFade up / Word reveal / Keyword pop");
      else if (/btn|button|cta/i.test(name)) alert("INTERACTION\\nHover / Click / Cursor click");
      else if (/card|tile/i.test(name)) alert("ANIMATE\\nStagger in / UI card reveal");
      else alert("Select layers, or continue the current edit.\\nNo phase numbers.");
    };


    cProf.onClick = function () {
      alert("P23 profiler lives in node core/profiler.js.\\nAE long-session soak is not claimed from this button.");
    };

    pullMasterToPanel(activeComp());
    styleList.onChange = function () { if (state.plan.length) scan(); };
    dirList.onChange = function () { if (state.plan.length) scan(); };
    shotList.onChange = function () { if (state.plan.length) scan(); };
    selectedOnly.onClick = function () { if (state.plan.length) scan(); };
    var anModeIds = ["in", "out", "both"];
    var anDirIds = ["up", "down", "left", "right", "upLeft", "upRight", "downLeft", "downRight", "scale"];
    var anEaseIds = ["apple", "soft", "expo", "spring"];
    var anSeqIds = ["index", "topToBottom", "bottomToTop"];
    autoApplyBtn.onClick = function () {
      var dur = parseFloat(anDur.text);
      var st = parseFloat(anStag.text);
      if (isNaN(dur) || dur <= 0) dur = 0.42;
      if (isNaN(st) || st < 0) st = 0.06;
      autoAnimateApply(
        anModeIds[anMode.selection ? anMode.selection.index : 0] || "in",
        anDirIds[anDir.selection ? anDir.selection.index : 0] || "up",
        anEaseIds[anEase.selection ? anEase.selection.index : 0] || "apple",
        dur,
        st,
        anSeqIds[anSeq.selection ? anSeq.selection.index : 0] || "index"
      );
    };
    assetApplyBtn.onClick = function () {
      var id = capIds[assetList.selection ? assetList.selection.index : 0] || "hook";
      applyCaptionTemplate(id, assetArTop.value);
    };
    assetSrtBtn.onClick = importSrt;
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
