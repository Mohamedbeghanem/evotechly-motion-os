# Install Evotechly Motion OS Ultimate 2.0 in After Effects

Four JSX files on Ultimate 2.0.0, plus the Transition Kit companion. No Node.

## Files

`ae/Evotechly Motion OS.jsx` — main panel (~297 KB, v0.32 Reliability). Do not replace with a stub.

`ae/SaaS Demo Tools.jsx` — **Window → SaaS Demo Tools / Motion OS Hub** (Home seed, SaaS engines including UI presets + P1b text reveal, Kit Hub URLs)

`ae/Caption Style Tools.jsx` — **Window → Caption Style Tools** (keyword color + fade/scale/slideUp/typewriter/blur — P1c)

`ae/Evotechly Transitions.jsx` — **Window → Evotechly Transitions** (UI Push family + P1 Text / UI / Cursor tabs). Install beside the Hub. See `docs/TRANSITION_KIT.md` and `Evotechly-SaaS-Assets/Documentation/P1_NATIVE.md`.

`ae/Seed Golden Project.jsx` — **File → Scripts → Run Script File…** (or Hub → Home → Seed). Required. Not a Window panel.

Caption pack (not required inside AE, sit next to the project): `assets/` + `examples/captions/`.

Editor path: `docs/QUICK_START.md`.

## Install

1. Quit After Effects.
2. Copy the ScriptUI files into **Scripts/ScriptUI Panels**: `Evotechly Motion OS.jsx`, `SaaS Demo Tools.jsx`, `Caption Style Tools.jsx`, `Evotechly Transitions.jsx`.
3. Copy `Seed Golden Project.jsx` into **Scripts** (and keep a copy next to the Hub if you seed from Home).
4. Open AE → **Window → Evotechly Motion OS**, **Window → SaaS Demo Tools** (Motion OS Hub), **Window → Caption Style Tools**, and **Window → Evotechly Transitions**.

If a panel is missing from Window, the file is in `Scripts` instead of `Scripts/ScriptUI Panels`.

## First run

Demo comp → Style Stripe → Shot Hero → Direction In → Scan → Apply.
Captions tab → Apply Caption Template → Shot Captions → Scan → Apply. Keyword color / in/out: Caption Style Tools.
Polish / Person as needed. Fit footage = cover crop.

Never keyed: cameras, lights, locked layers, names containing `EVO_SKIP`.
