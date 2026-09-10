#target aftereffects
/* Evotechly Motion OS — apply compiled ae-output.json to the active comp.
 *
 * How to use:
 * 1. Open the composition that already has layers named like the JSON
 *    (Title, Card 1, CTA, Screenshot, …).
 * 2. File > Scripts > Apply Evotechly Motion.jsx
 * 3. Pick examples/ae-output.json (or any compiled AE JSON).
 *
 * The script matches layers by name (case-insensitive).
 * It writes Opacity, Position and Scale keys. It does not create layers.
 */

(function evotechlyApply() {
  function readFile(file) {
    file.open("r");
    file.encoding = "UTF-8";
    var str = file.read();
    file.close();
    return str;
  }

  function normName(s) {
    return String(s || "").toLowerCase().replace(/^\s+|\s+$/g, "");
  }

  function findLayer(comp, name) {
    var want = normName(name);
    for (var i = 1; i <= comp.numLayers; i++) {
      if (normName(comp.layer(i).name) === want) return comp.layer(i);
    }
    return null;
  }

  function clearKeys(prop) {
    for (var i = prop.numKeys; i >= 1; i--) {
      prop.removeKey(i);
    }
  }

  function easePair(kind) {
    if (kind === "easeInOut") {
      return {
        i: new KeyframeEase(0, 33),
        o: new KeyframeEase(0, 33)
      };
    }
    return {
      i: new KeyframeEase(0, 70),
      o: new KeyframeEase(0, 16)
    };
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
      for (var i = 0; i < n; i++) {
        ins.push(e.i);
        outs.push(e.o);
      }
      prop.setTemporalEaseAtKey(keyIndex, ins, outs);
    } catch (err) {}
  }

  function applyLayer(layer, spec) {
    var pos = layer.property("ADBE Transform Group").property("ADBE Position");
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    var current = pos.value;
    var is3d = current.length > 2;
    var t0 = spec.delay;
    var t1 = spec.delay + spec.duration;
    var from = spec.from;
    var to = spec.to;
    var kind = spec.easingAE || "easeOut";

    clearKeys(op);
    clearKeys(pos);
    clearKeys(sc);

    op.setValueAtTime(t0, from.opacity);
    op.setValueAtTime(t1, to.opacity);
    applyEase(op, 1, kind);
    applyEase(op, 2, kind);

    var p0 = [current[0] + from.positionX, current[1] + from.positionY];
    var p1 = [current[0] + to.positionX, current[1] + to.positionY];
    if (is3d) {
      p0.push(current[2]);
      p1.push(current[2]);
    }
    pos.setValueAtTime(t0, p0);
    pos.setValueAtTime(t1, p1);
    applyEase(pos, 1, kind);
    applyEase(pos, 2, kind);

    var curS = sc.value;
    var s0 = [from.scale[0], from.scale[1], curS.length > 2 ? curS[2] : 100];
    var s1 = [to.scale[0], to.scale[1], curS.length > 2 ? curS[2] : 100];
    if (curS.length === 2) {
      s0 = [from.scale[0], from.scale[1]];
      s1 = [to.scale[0], to.scale[1]];
    }
    sc.setValueAtTime(t0, s0);
    sc.setValueAtTime(t1, s1);
    applyEase(sc, 1, kind);
    applyEase(sc, 2, kind);
  }

  if (!app.project) {
    alert("Open a project first.");
    return;
  }
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) {
    alert("Open a composition, then run this script.");
    return;
  }

  var file = File.openDialog("Select Evotechly ae-output.json", "*.json");
  if (!file) return;

  var data;
  try {
    data = JSON.parse(readFile(file));
  } catch (e) {
    alert("Could not parse JSON:\n" + e.toString());
    return;
  }
  if (!data || !data.layers || !data.layers.length) {
    alert("This file has no layers. Compile a design JSON first.");
    return;
  }

  app.beginUndoGroup("Apply Evotechly Motion");
  var applied = [];
  var missing = [];
  for (var i = 0; i < data.layers.length; i++) {
    var spec = data.layers[i];
    var layer = findLayer(comp, spec.name || spec.layer);
    if (!layer) {
      missing.push(spec.name || spec.layer);
      continue;
    }
    applyLayer(layer, spec);
    applied.push(layer.name);
  }
  app.endUndoGroup();

  var msg = "Evotechly applied " + applied.length + " layer(s).";
  if (missing.length) {
    msg += "\n\nNot found in this comp:\n- " + missing.join("\n- ");
    msg += "\n\nRename AE layers to match exactly, then run again.";
  }
  alert(msg);
})();
