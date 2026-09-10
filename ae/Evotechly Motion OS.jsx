#target aftereffects
/*
  Evotechly Motion OS — After Effects panel
  Install: copy this file into Scripts/ScriptUI Panels, restart AE,
  then open Window > Evotechly Motion OS.

  Name layers Title, Card 1, CTA, Screenshot, Cursor…
  Pick a style. Click Apply.
*/

(function (thisObj) {
  var ROLE_ORDER = ["logo","eyebrow","title","subtitle","nav","sidebar","dashboard","screenshot","image","card","metric","badge","tooltip","button","cta","cursor"];

  var ALIASES = [
    { role: "cta", match: ["cta", "get started", "start free", "book demo"] },
    { role: "button", match: ["button", "btn"] },
    { role: "cursor", match: ["cursor", "pointer", "mouse"] },
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
    scaleIn:    { duration: 0.50, easing: "easeOut",   from: { o: 0, x: 0, y: 0,  s: 96  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    slideUp:    { duration: 0.60, easing: "easeOut",   from: { o: 0, x: 0, y: 28, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    slideRight: { duration: 0.55, easing: "easeOut",   from: { o: 0, x:-24, y: 0,  s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    zoomOut:    { duration: 0.90, easing: "easeInOut", from: { o: 0, x: 0, y: 0,  s: 106 }, to: { o: 100, x: 0, y: 0, s: 100 } },
    pop:        { duration: 0.42, easing: "easeOut",   from: { o: 0, x: 0, y: 8,  s: 92  }, to: { o: 100, x: 0, y: 0, s: 100 } },
    cursorIn:   { duration: 0.50, easing: "easeInOut", from: { o: 0, x: 12, y: 12, s: 100 }, to: { o: 100, x: 0, y: 0, s: 100 } }
  };

  function roleRule(preset, base, stagger, scale, after) {
    return { preset: preset, base: base, stagger: stagger, durationScale: scale, after: after || null };
  }

  var STYLES = {
    stripe: {
      id: "stripe", label: "Stripe / premium SaaS", gap: 0.12,
      roles: {
        logo: roleRule("fadeUp", 0, 0, 0.9),
        eyebrow: roleRule("fadeUp", 0.02, 0, 0.85),
        title: roleRule("fadeUp", 0.06, 0, 1),
        subtitle: roleRule("fadeUpSoft", 0.14, 0, 1),
        nav: roleRule("fadeUp", 0.08, 0.03, 0.8),
        sidebar: roleRule("slideRight", 0.12, 0, 1),
        dashboard: roleRule("slideUp", 0.18, 0, 1),
        screenshot: roleRule("zoomOut", 0.16, 0, 1),
        image: roleRule("zoomOut", 0.16, 0.08, 1),
        card: roleRule("scaleIn", 0.28, 0.07, 1),
        metric: roleRule("slideUp", 0.34, 0.05, 0.9),
        badge: roleRule("pop", 0.4, 0.04, 0.8),
        tooltip: roleRule("fadeUpSoft", 0.48, 0.04, 0.75),
        button: roleRule("scaleIn", 0.5, 0.04, 0.84),
        cta: roleRule("pop", null, 0, 0.8, "group"),
        cursor: roleRule("cursorIn", null, 0, 1, "cta")
      }
    },
    linear: {
      id: "linear", label: "Linear / product-native", gap: 0.1,
      roles: {
        logo: roleRule("fadeUp", 0, 0, 0.9),
        eyebrow: roleRule("fadeUp", 0, 0, 0.8),
        title: roleRule("slideUp", 0.04, 0, 0.95),
        subtitle: roleRule("fadeUpSoft", 0.12, 0, 1),
        nav: roleRule("fadeUp", 0.06, 0.03, 0.8),
        sidebar: roleRule("slideRight", 0.1, 0, 1),
        dashboard: roleRule("fadeUp", 0.16, 0, 1.1),
        screenshot: roleRule("zoomOut", 0.14, 0, 1.05),
        image: roleRule("zoomOut", 0.14, 0.08, 1),
        card: roleRule("fadeUp", 0.24, 0.06, 1),
        metric: roleRule("fadeUp", 0.3, 0.05, 0.9),
        badge: roleRule("pop", 0.36, 0.04, 0.75),
        tooltip: roleRule("fadeUpSoft", 0.44, 0.04, 0.75),
        button: roleRule("scaleIn", 0.46, 0.04, 0.84),
        cta: roleRule("scaleIn", null, 0, 0.8, "group"),
        cursor: roleRule("cursorIn", null, 0, 1, "cta")
      }
    },
    vercel: {
      id: "vercel", label: "Vercel / sharp reveal", gap: 0.08,
      roles: {
        logo: roleRule("fadeUp", 0, 0, 0.75),
        eyebrow: roleRule("fadeUp", 0, 0, 0.7),
        title: roleRule("fadeUp", 0.04, 0, 0.85),
        subtitle: roleRule("fadeUpSoft", 0.1, 0, 0.9),
        nav: roleRule("fadeUp", 0.04, 0.02, 0.7),
        sidebar: roleRule("slideRight", 0.08, 0, 0.85),
        dashboard: roleRule("scaleIn", 0.12, 0, 0.9),
        screenshot: roleRule("zoomOut", 0.1, 0, 0.85),
        image: roleRule("zoomOut", 0.1, 0.06, 0.85),
        card: roleRule("scaleIn", 0.2, 0.05, 0.9),
        metric: roleRule("slideUp", 0.24, 0.04, 0.8),
        badge: roleRule("pop", 0.3, 0.03, 0.7),
        tooltip: roleRule("fadeUpSoft", 0.36, 0.03, 0.7),
        button: roleRule("pop", 0.38, 0.03, 0.75),
        cta: roleRule("pop", null, 0, 0.72, "group"),
        cursor: roleRule("cursorIn", null, 0, 0.9, "cta")
      }
    }
  };

  function round4(n) { return Math.round(n * 10000) / 10000; }
  function lower(s) { return String(s || "").toLowerCase(); }

  function detectRole(name) {
    var n = lower(name);
    var i, j, a;
    for (i = 0; i < ALIASES.length; i++) {
      a = ALIASES[i].match;
      for (j = 0; j < a.length; j++) {
        if (n.indexOf(a[j]) !== -1) return ALIASES[i].role;
      }
    }
    return null;
  }

  function roleIndex(role) {
    var i;
    for (i = 0; i < ROLE_ORDER.length; i++) {
      if (ROLE_ORDER[i] === role) return i;
    }
    return 99;
  }

  function isAnimatable(layer) {
    if (!layer) return false;
    if (layer instanceof CameraLayer) return false;
    if (layer instanceof LightLayer) return false;
    try { return layer.property("ADBE Transform Group") !== null; }
    catch (e) { return false; }
  }

  function activeComp() {
    var comp = app.project ? app.project.activeItem : null;
    if (comp && comp instanceof CompItem) return comp;
    return null;
  }

  function collectLayers(comp, selectedOnly) {
    var out = [];
    var ignored = [];
    var i, layer, role;
    for (i = 1; i <= comp.numLayers; i++) {
      layer = comp.layer(i);
      if (selectedOnly && !layer.selected) continue;
      if (!isAnimatable(layer)) { ignored.push(layer.name); continue; }
      role = detectRole(layer.name);
      if (!role) { ignored.push(layer.name); continue; }
      out.push({
        name: layer.name,
        role: role,
        x: layer.transform.position.value[0],
        y: layer.transform.position.value[1]
      });
    }
    return { layers: out, ignored: ignored };
  }

  function sortLayers(list) {
    list.sort(function (a, b) {
      var ra = roleIndex(a.role);
      var rb = roleIndex(b.role);
      if (ra !== rb) return ra - rb;
      if (a.y !== b.y) return a.y - b.y;
      if (a.x !== b.x) return a.x - b.x;
      return 0;
    });
    return list;
  }

  function buildPlan(rawLayers, styleId) {
    var style = STYLES[styleId] || STYLES.stripe;
    var list = sortLayers(rawLayers.slice(0));
    var counts = {};
    var plan = [];
    var i, item, role, rule, preset, delay, sibling, anim, end;
    for (i = 0; i < list.length; i++) {
      item = list[i];
      role = item.role;
      rule = style.roles[role] || style.roles.card;
      if (counts[role] == null) counts[role] = 0;
      sibling = counts[role];
      counts[role] += 1;
      preset = PRESETS[rule.preset] || PRESETS.fadeUp;
      anim = {
        duration: round4(preset.duration * rule.durationScale),
        easing: preset.easing,
        from: preset.from,
        to: preset.to
      };
      delay = rule.base == null ? 0 : rule.base + sibling * rule.stagger;
      plan.push({
        name: item.name, role: role, preset: rule.preset, after: rule.after,
        delay: round4(delay), duration: anim.duration, easing: anim.easing,
        from: anim.from, to: anim.to
      });
    }
    var groupEnd = 0;
    var ctaEnd = 0;
    for (i = 0; i < plan.length; i++) {
      if (plan[i].after) continue;
      end = plan[i].delay + plan[i].duration;
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
        end = plan[i].delay + plan[i].duration;
        if (end > ctaEnd) ctaEnd = end;
      }
    }
    if (ctaEnd === 0) ctaEnd = groupEnd;
    for (i = 0; i < plan.length; i++) {
      if (plan[i].after === "cta") plan[i].delay = round4(ctaEnd + 0.06);
    }
    return plan;
  }

  function clearKeys(prop) {
    var i;
    for (i = prop.numKeys; i >= 1; i--) prop.removeKey(i);
  }

  function easePair(kind) {
    if (kind === "easeInOut") return { i: new KeyframeEase(0, 33), o: new KeyframeEase(0, 33) };
    return { i: new KeyframeEase(0, 70), o: new KeyframeEase(0, 16) };
  }

  function applyEase(prop, keyIndex, kind) {
    try {
      var e = easePair(kind);
      var t = prop.propertyValueType;
      var n = 1;
      if (t === PropertyValueType.TwoD || t === PropertyValueType.TwoD_SPATIAL) n = 2;
      if (t === PropertyValueType.ThreeD || t === PropertyValueType.ThreeD_SPATIAL) n = 3;
      var ins = [];
      var outs = [];
      var i;
      for (i = 0; i < n; i++) { ins.push(e.i); outs.push(e.o); }
      prop.setTemporalEaseAtKey(keyIndex, ins, outs);
    } catch (err) {}
  }

  function findLayer(comp, name) {
    var want = lower(name);
    var i;
    for (i = 1; i <= comp.numLayers; i++) {
      if (lower(comp.layer(i).name) === want) return comp.layer(i);
    }
    return null;
  }

  function applySpec(layer, spec) {
    var pos = layer.property("ADBE Transform Group").property("ADBE Position");
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    var current = pos.value;
    var is3d = current.length > 2;
    var t0 = spec.delay;
    var t1 = spec.delay + spec.duration;
    var from = spec.from;
    var to = spec.to;
    var kind = spec.easing || "easeOut";
    clearKeys(op); clearKeys(pos); clearKeys(sc);
    op.setValueAtTime(t0, from.o);
    op.setValueAtTime(t1, to.o);
    applyEase(op, 1, kind); applyEase(op, 2, kind);
    var p0 = [current[0] + from.x, current[1] + from.y];
    var p1 = [current[0] + to.x, current[1] + to.y];
    if (is3d) { p0.push(current[2]); p1.push(current[2]); }
    pos.setValueAtTime(t0, p0);
    pos.setValueAtTime(t1, p1);
    applyEase(pos, 1, kind); applyEase(pos, 2, kind);
    var curS = sc.value;
    var s0, s1;
    if (curS.length === 2) { s0 = [from.s, from.s]; s1 = [to.s, to.s]; }
    else { s0 = [from.s, from.s, curS[2]]; s1 = [to.s, to.s, curS[2]]; }
    sc.setValueAtTime(t0, s0);
    sc.setValueAtTime(t1, s1);
    applyEase(sc, 1, kind); applyEase(sc, 2, kind);
  }

  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel)
      ? thisObj
      : new Window("palette", "Evotechly Motion OS", undefined, { resizeable: true });
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 12;
    var header = win.add("group");
    header.add("statictext", undefined, "EVOTECHLY MOTION OS");
    var styleRow = win.add("group");
    styleRow.add("statictext", undefined, "Style");
    var styleList = styleRow.add("dropdownlist", undefined, ["Stripe / premium SaaS", "Linear / product-native", "Vercel / sharp reveal"]);
    styleList.selection = 0;
    styleList.alignment = ["fill", "center"];
    var selectedOnly = win.add("checkbox", undefined, "Selected layers only");
    selectedOnly.value = false;
    var status = win.add("statictext", undefined, "Open a comp, name layers, then Scan.");
    status.characters = 36;
    var list = win.add("listbox", undefined, [], {
      numberOfColumns: 3, showHeaders: true,
      columnTitles: ["Layer", "Role", "Time"],
      columnWidths: [140, 80, 70]
    });
    list.preferredSize = [320, 220];
    list.alignment = ["fill", "fill"];
    var ignoredText = win.add("statictext", undefined, "", { multiline: true });
    ignoredText.preferredSize = [320, 36];
    var buttons = win.add("group");
    buttons.alignment = ["fill", "bottom"];
    var scanBtn = buttons.add("button", undefined, "Scan comp");
    var applyBtn = buttons.add("button", undefined, "Apply motion");
    applyBtn.enabled = false;
    win.add("statictext", undefined, "Names: Title, Card 1, CTA, Screenshot, Cursor", { multiline: true });
    var state = { plan: [] };
    var styleIds = ["stripe", "linear", "vercel"];
    function currentStyle() {
      var i = styleList.selection ? styleList.selection.index : 0;
      return styleIds[i] || "stripe";
    }
    function refreshList(plan, ignored, compName) {
      var i, row;
      list.removeAll();
      for (i = 0; i < plan.length; i++) {
        row = list.add("item", plan[i].name);
        row.subItems[0].text = plan[i].role;
        row.subItems[1].text = plan[i].delay + "s";
      }
      status.text = (compName || "Comp") + "  ·  " + plan.length + " layer(s)  ·  " + currentStyle();
      if (ignored && ignored.length) {
        ignoredText.text = "Ignored: " + ignored.slice(0, 8).join(", ") + (ignored.length > 8 ? "…" : "");
      } else {
        ignoredText.text = plan.length ? "All recognized layers will be keyed." : "No named SaaS layers found.";
      }
      applyBtn.enabled = plan.length > 0;
    }
    function scan() {
      var comp = activeComp();
      if (!comp) { alert("Open a composition first."); return; }
      var found = collectLayers(comp, selectedOnly.value);
      state.plan = buildPlan(found.layers, currentStyle());
      refreshList(state.plan, found.ignored, comp.name);
    }
    function apply() {
      var comp = activeComp();
      if (!comp) { alert("Open a composition first."); return; }
      if (!state.plan.length) scan();
      if (!state.plan.length) {
        alert("No layers matched. Rename layers to Title, Card 1, CTA, Screenshot…");
        return;
      }
      app.beginUndoGroup("Evotechly Motion OS");
      var applied = 0;
      var missing = [];
      var i, layer;
      for (i = 0; i < state.plan.length; i++) {
        layer = findLayer(comp, state.plan[i].name);
        if (!layer) { missing.push(state.plan[i].name); continue; }
        applySpec(layer, state.plan[i]);
        applied += 1;
      }
      app.endUndoGroup();
      var msg = "Applied SaaS motion to " + applied + " layer(s).";
      if (missing.length) msg += "\n\nMissing:\n- " + missing.join("\n- ");
      alert(msg);
    }
    scanBtn.onClick = scan;
    applyBtn.onClick = apply;
    styleList.onChange = function () { if (state.plan.length) scan(); };
    selectedOnly.onClick = function () { if (state.plan.length) scan(); };
    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); }
    else { win.layout.layout(true); win.layout.resize(); }
  }

  buildUI(thisObj);
})(this);
