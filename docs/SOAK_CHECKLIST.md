# Soak checklist — v0.32 RC (zero code changes)

Editor-only. **Automation OFF.** Do not edit JSX, engines, or this repo during soak.

Record **After Effects version + OS** on [issue #11](https://github.com/Mohamedbeghanem/evotechly-motion-os/issues/11) when you finish (or if anything fails).

This is the **v0.32 RC** soak. It does **not** unlock `v2.0.0`. That still needs the 12-variant EvoCRM campaign in AE with zero code changes — see [V2_RELEASE_GATE.md](../V2_RELEASE_GATE.md).

Packaging: [RELEASE_ZIP_CHECKLIST.md](RELEASE_ZIP_CHECKLIST.md). One-page path: [QUICK_START.md](QUICK_START.md).

## 1. Install (both panels + optional Seed)

Quit After Effects. Copy into **Scripts/ScriptUI Panels**, then restart:

- [ ] `ae/Evotechly Motion OS.jsx` (~297 KB, v0.32 Reliability) — confirm the file is **not** a stub / `PLACEHOLDER_SEE_FILE`
- [ ] `ae/SaaS Demo Tools.jsx` (~28 KB) — **Window → SaaS Demo Tools**

Optional (Scripts folder, not ScriptUI Panels):

- [ ] `ae/Seed Golden Project.jsx` — **File → Scripts → Run Script File…**  
  Or skip the Scripts copy and use **Window → SaaS Demo Tools → Seed Golden Project** (seed JSX must sit next to the panel).

Do **not** install AEJuice, Motion Bro, Liquid Glass, UI Animator Pro, or Meow Captions for this soak. Companions stay optional and external — [EDITOR_FREE_KIT.md](EDITOR_FREE_KIT.md).

## 2. Seed Golden Project

- [ ] **File → Scripts → Run Script File…** → `ae/Seed Golden Project.jsx`  
  **or** **Window → SaaS Demo Tools → Seed Golden Project**
- [ ] Project now has `00_HOME`, `ERP_DEMO`, `TALKING_HEAD`, `REEL_9x16`
- [ ] Run Seed a second time — existing names are skipped (idempotent; no duplicates)

There is no checked-in `.aep`. The script builds the comps.

## 3. ERP_DEMO smoke

Open `ERP_DEMO`. Leave **Automation OFF**.

Pick **one** path (both are valid):

**A — SaaS Demo Tools**

- [ ] Select `Card 1`–`Card 3` → **Stagger reveal**
- [ ] Select `CTA` → **Cursor + click**
- [ ] Select `Screenshot` or a card → **Glass Panel**
- [ ] Select a reveal layer → **Gradient Wipe**
- [ ] Select cards → **Proximity Hover** (run Cursor first)

**B — Motion OS**

- [ ] **Motion** — Style / Direction / Shot → **Scan** → **Apply** (one undo)

Either path counts. Do not rewrite code if a button is missing — that is a zip/install miss, not a soak fail. Confirm `SaaS Demo Tools.jsx` is in the zip and in ScriptUI Panels.

## 4. TALKING_HEAD (cutout + mid captions)

Open `TALKING_HEAD`. Footage or the seed solid is fine.

- [ ] **Person** — Cutout Prep (or Keylight recipe) on `CUTOUT` / `VIDEO_PLACEHOLDER`
- [ ] **Captions** — mid-stack captions readable (`Caption` / AR / EN). Audio not destroyed
- [ ] **Polish** — ease only. Wet / Glow / Saber / QCA **off**

## 5. REEL_9x16 (SAFE + hook)

Open `REEL_9x16` (1080×1920).

- [ ] `SAFE_TOP` / `SAFE_BOTTOM` / `SAFE_LEFT` / `SAFE_RIGHT` visible; type stays inside
- [ ] **Motion** — Hook (and/or Kinetic type) → **Scan** → **Apply**

## 6. Save / quit / reopen

- [ ] Save the project
- [ ] Quit After Effects
- [ ] Reopen the project — comps, keys, and panel stores persist

## 7. Record on issue #11

- [ ] After Effects version (e.g. 25.x / 24.x)
- [ ] OS (macOS / Windows + version)
- [ ] Pass / fail per section above
- [ ] Any unexpected dialog, missing Window menu item, or undo stack surprise

## Out of scope for this soak

- Turning Automation ON
- Tagging `v2.0.0` or `v2.0.0-rc1`
- Installing or redistributing companion binaries
- Editing `ae/Evotechly Motion OS.jsx` (297 KB body stays put)
