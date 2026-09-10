# Evotechly Motion OS

Deterministic compiler for **SaaS-style motion**, plus a dockable After Effects panel.

**Editors: install `ae/Evotechly Motion OS.jsx` and read [EDITOR.md](EDITOR.md) + [ae/INSTALL-AE.md](ae/INSTALL-AE.md).**

## After Effects app

Copy `ae/Evotechly Motion OS.jsx` into `Scripts/ScriptUI Panels`, restart AE, open **Window > Evotechly Motion OS**.

Name layers `Title`, `Card 1`, `CTA`, `Screenshot`, `Cursor`. Pick Stripe / Linear / Vercel. Scan. Apply.

No Node on the editor machine.

## Node compiler (optional)

```bash
node index.js examples/saas-hero.json --style stripe
```

MIT (c) 2026 Evotechly / Mohamed Beghanem
