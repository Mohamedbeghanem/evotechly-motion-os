"use strict";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toPreview(plan, meta) {
  meta = meta || {};
  const width = meta.width || 1440;
  const height = meta.height || 900;
  const layers = (plan && plan.layers) || [];
  const payload = JSON.stringify({
    style: plan.style,
    duration: plan.duration,
    width: width,
    height: height,
    layers: layers
  }).replace(/</g, "\\u003c");

  return "<!DOCTYPE html>\n" +
"<html lang=\"en\">\n" +
"<head>\n" +
"  <meta charset=\"utf-8\" />\n" +
"  <title>Evotechly Motion preview</title>\n" +
"  <style>\n" +
"    :root { color-scheme: dark; }\n" +
"    * { box-sizing: border-box; }\n" +
"    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #07080d; color: #e8eaf1; }\n" +
"    header { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; border-bottom: 1px solid #1c2030; }\n" +
"    h1 { font-size: 14px; font-weight: 600; margin: 0; letter-spacing: .02em; }\n" +
"    .meta { color: #8b90a5; font-size: 12px; }\n" +
"    button { background: #5b6cff; color: white; border: 0; border-radius: 8px; padding: 8px 14px; font-weight: 600; cursor: pointer; }\n" +
"    main { padding: 24px; }\n" +
"    .stage-wrap { background: #0c1018; border: 1px solid #1c2030; border-radius: 16px; padding: 20px; overflow: auto; }\n" +
"    .stage { position: relative; width: " + width + "px; height: " + height + "px; margin: 0 auto; background: radial-gradient(1200px 500px at 50% -10%, #1a2150 0%, #0b0f19 55%); border-radius: 12px; overflow: hidden; }\n" +
"    .layer { position: absolute; border-radius: 12px; display: flex; align-items: center; padding: 0 16px; font-size: 13px; font-weight: 600; color: #f2f4ff; background: #161b2e; border: 1px solid #2a3150; opacity: 0; will-change: transform, opacity; }\n" +
"    .layer.title { background: transparent; border: 0; font-size: 28px; }\n" +
"    .layer.subtitle { background: transparent; border: 0; font-size: 16px; color: #9aa1b8; font-weight: 500; }\n" +
"    .layer.eyebrow { background: transparent; border: 0; font-size: 12px; color: #7b8cff; letter-spacing: .08em; text-transform: uppercase; }\n" +
"    .layer.cta, .layer.button { background: #5b6cff; border: 0; justify-content: center; }\n" +
"    .layer.screenshot, .layer.dashboard { background: #12172a; }\n" +
"    .layer.cursor { background: #fff; color: #111; width: 14px !important; height: 14px !important; border-radius: 2px 10px 10px 10px; padding: 0; }\n" +
"    table { width: 100%; border-collapse: collapse; margin-top: 22px; font-size: 12px; }\n" +
"    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #1c2030; }\n" +
"    th { color: #8b90a5; font-weight: 500; }\n" +
"  </style>\n" +
"</head>\n" +
"<body>\n" +
"  <header>\n" +
"    <div>\n" +
"      <h1>Evotechly Motion OS</h1>\n" +
"      <div class=\"meta\">" + escapeHtml(plan.style || "stripe") + " · " + escapeHtml(String(plan.duration || 0)) + "s · " + layers.length + " layers</div>\n" +
"    </div>\n" +
"    <button id=\"play\" type=\"button\">Play</button>\n" +
"  </header>\n" +
"  <main>\n" +
"    <div class=\"stage-wrap\"><div class=\"stage\" id=\"stage\"></div></div>\n" +
"    <table><thead><tr><th>Layer</th><th>Role</th><th>Preset</th><th>Delay</th><th>Duration</th></tr></thead><tbody id=\"rows\"></tbody></table>\n" +
"  </main>\n" +
"  <script>\n" +
"    const PLAN = " + payload + ";\n" +
"    const stage = document.getElementById(\"stage\");\n" +
"    const rows = document.getElementById(\"rows\");\n" +
"    const ease = { expoOut: \"cubic-bezier(0.16, 1, 0.3, 1)\", cubicInOut: \"cubic-bezier(0.65, 0, 0.35, 1)\", backOut: \"cubic-bezier(0.34, 1.4, 0.64, 1)\" };\n" +
"    function mount() {\n" +
"      stage.innerHTML = \"\"; rows.innerHTML = \"\";\n" +
"      PLAN.layers.forEach(function(l) {\n" +
"        var el = document.createElement(\"div\");\n" +
"        el.className = \"layer \" + (l.role || l.type || \"\");\n" +
"        el.textContent = l.layer;\n" +
"        el.style.left = (l.x || 40) + \"px\";\n" +
"        el.style.top = (l.y || 40) + \"px\";\n" +
"        el.style.width = Math.max(l.width || 160, 80) + \"px\";\n" +
"        el.style.height = Math.max(l.height || 36, 24) + \"px\";\n" +
"        el.dataset.name = l.layer;\n" +
"        stage.appendChild(el);\n" +
"        var tr = document.createElement(\"tr\");\n" +
"        tr.innerHTML = \"<td>\" + l.layer + \"</td><td>\" + (l.role || \"\") + \"</td><td>\" + l.preset + \"</td><td>\" + l.delay + \"s</td><td>\" + l.animation.duration + \"s</td>\";\n" +
"        rows.appendChild(tr);\n" +
"      });\n" +
"    }\n" +
"    function play() {\n" +
"      PLAN.layers.forEach(function(l) {\n" +
"        var el = stage.querySelector('[data-name=\"' + CSS.escape(l.layer) + '\"]');\n" +
"        if (!el) return;\n" +
"        var from = l.animation.from;\n" +
"        var to = l.animation.to;\n" +
"        el.getAnimations().forEach(function(a) { a.cancel(); });\n" +
"        el.animate([\n" +
"          { opacity: from.opacity, transform: \"translate(\" + (from.x || 0) + \"px,\" + from.y + \"px) scale(\" + from.scale + \")\" },\n" +
"          { opacity: to.opacity, transform: \"translate(\" + (to.x || 0) + \"px,\" + to.y + \"px) scale(\" + to.scale + \")\" }\n" +
"        ], { delay: l.delay * 1000, duration: l.animation.duration * 1000, easing: ease[l.animation.easing] || \"cubic-bezier(0.16, 1, 0.3, 1)\", fill: \"both\" });\n" +
"      });\n" +
"    }\n" +
"    mount();\n" +
"    document.getElementById(\"play\").addEventListener(\"click\", play);\n" +
"    play();\n" +
"  </script>\n" +
"</body>\n" +
"</html>\n";
}

module.exports = { toPreview };
