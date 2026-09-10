# Install Evotechly Motion OS in After Effects

This is the After Effects app. No Node. No JSON compile. One file.

## File

`ae/Evotechly Motion OS.jsx`

## Install (2 minutes)

1. Quit After Effects.
2. Copy `Evotechly Motion OS.jsx` into **ScriptUI Panels**:

**macOS**

```
/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/
```

or the user scripts folder:

```
~/Documents/Adobe/After Effects 2025/Scripts/ScriptUI Panels/
```

Create `Scripts/ScriptUI Panels` if it does not exist.

**Windows**

```
C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\ScriptUI Panels\
```

or

```
Documents\Adobe\After Effects 2025\Scripts\ScriptUI Panels\
```

Use your real AE year folder (2024 / 2025 / 2026).

3. Open After Effects.
4. If AE asks, enable **Preferences → Scripting & Expressions → Allow Scripts to Write Files and Access Network**.
5. Menu: **Window → Evotechly Motion OS**.
6. Dock the panel next to Essential Graphics.

If it is missing from Window, you put the file in `Scripts` instead of `Scripts/ScriptUI Panels`. Move it and restart.

## Use

1. Build your SaaS frame in the active comp.
2. Name layers: `Title`, `Subtitle`, `Card 1`, `Card 2`, `CTA`, `Screenshot`, `Cursor`.
3. In the panel: pick **Stripe**, **Linear**, or **Vercel**.
4. **Scan comp** — check the time list.
5. **Apply motion** — opacity, position, scale keys. Undo with Ctrl/Cmd+Z.

Only layers whose names match the contract are keyed. `Background` and `Null 1` are ignored.

## First-time test

Create a 1920×1080 comp. Add four shape layers named `Title`, `Card 1`, `Card 2`, `CTA`. Scan, Apply, RAM preview.
