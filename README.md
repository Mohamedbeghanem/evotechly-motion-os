# Evotechly Motion OS

Deterministic compiler for **SaaS-style motion**, plus a dockable After Effects panel.

v0.8: Editor Kit + selection Auto-Animate + local asset browser. See [ULTIMATE.md](ULTIMATE.md). Does not include Saber / QCA3 / Displacer / Liquid Glass.

**Editors: install `ae/Evotechly Motion OS.jsx` and read [EDITOR.md](EDITOR.md) + [ae/INSTALL-AE.md](ae/INSTALL-AE.md).**

## After Effects app

Copy `ae/Evotechly Motion OS.jsx` into `Scripts/ScriptUI Panels`, restart AE, open **Window > Evotechly Motion OS**.

Motion tab: Scan / Apply. Animate tab: selected layers, no names. Assets tab: local caption templates.

No Node on the editor machine.

## Node compiler (optional)

```bash
node index.js examples/saas-hero.json --style stripe
```

Default style is `stripe` so existing hero demos stay put.

MIT (c) 2026 Evotechly / Mohamed Beghanem
