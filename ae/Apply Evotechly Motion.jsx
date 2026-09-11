#target aftereffects
/* Evotechly Motion OS — apply compiled ae-output.json to the active comp.
 * in/out = 2 keys. both = 3 keys when spec.keyframes is present.
 */
(function evotechlyApply() {
  function readFile(file) { file.open("r"); file.encoding = "UTF-8"; var str = file.read(); file.close(); return str; }
  function normName(s) { return String(s || "").toLowerCase().replace(/^\s+|\s+$/g, ""); }
  function findLayer(comp, name) {
    var want = normName(name);
    for (var i = 1; i <= comp.numLayers; i++) if (normName(comp.layer(i).name) === want) return comp.layer(i);
    return null;
  }
  function clearKeys(prop) { for (var i = prop.numKeys; i >= 1; i--) prop.removeKey(i); }
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
  function applyLayer(layer, spec) {
    var pos = layer.property("ADBE Transform Group").property("ADBE Position");
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    var current = pos.value, is3d = current.length > 2, kind = spec.easingAE || "easeOut";
    var keys = spec.keyframes && spec.keyframes.length >= 2 ? spec.keyframes : null;
    clearKeys(op); clearKeys(pos); clearKeys(sc);
    function write(t, o, px, py, sx, sy) {
      op.setValueAtTime(t, o); applyEase(op, op.nearestKeyIndex(t), kind);
      var p = [current[0] + px, current[1] + py]; if (is3d) p.push(current[2]);
      pos.setValueAtTime(t, p); applyEase(pos, pos.nearestKeyIndex(t), kind);
      var curS = sc.value, s = curS.length === 2 ? [sx, sy] : [sx, sy, curS[2]];
      sc.setValueAtTime(t, s); applyEase(sc, sc.nearestKeyIndex(t), kind);
    }
    if (keys) {
      var k;
      for (k = 0; k < keys.length; k++) {
        var kf = keys[k];
        var sx = kf.scale ? kf.scale[0] : 100;
        var sy = kf.scale ? kf.scale[1] : sx;
        write(kf.t, kf.opacity, kf.positionX, kf.positionY, sx, sy);
      }
      return;
    }
    var from = spec.from || {}, to = spec.to || {};
    write(spec.delay, from.opacity, from.positionX != null ? from.positionX : from.x, from.positionY != null ? from.positionY : from.y, from.scale ? from.scale[0] : 100, from.scale ? from.scale[1] : 100);
    write(spec.delay + spec.duration, to.opacity, to.positionX != null ? to.positionX : to.x, to.positionY != null ? to.positionY : to.y, to.scale ? to.scale[0] : 100, to.scale ? to.scale[1] : 100);
  }
  if (!app.project) { alert("Open a project first."); return; }
  var comp = app.project.activeItem;
  if (!comp || !(comp instanceof CompItem)) { alert("Open a composition, then run this script."); return; }
  var file = File.openDialog("Select Evotechly ae-output.json", "*.json");
  if (!file) return;
  var data;
  try { data = JSON.parse(readFile(file)); } catch (e) { alert("Could not parse JSON:\n" + e.toString()); return; }
  if (!data || !data.layers || !data.layers.length) { alert("This file has no layers. Compile a design JSON first."); return; }
  app.beginUndoGroup("Apply Evotechly Motion");
  var applied = [], missing = [], i;
  for (i = 0; i < data.layers.length; i++) {
    var spec = data.layers[i];
    var layer = findLayer(comp, spec.name || spec.layer);
    if (!layer) { missing.push(spec.name || spec.layer); continue; }
    applyLayer(layer, spec); applied.push(layer.name);
  }
  app.endUndoGroup();
  var msg = "Evotechly applied " + applied.length + " layer(s).";
  if (missing.length) msg += "\n\nNot found in this comp:\n- " + missing.join("\n- ");
  alert(msg);
})();
