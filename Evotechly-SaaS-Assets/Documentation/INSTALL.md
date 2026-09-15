# Install — Evotechly SaaS Assets (P2b)

P1 + P2b apply lives on **Window → Evotechly Transitions** (tabs: Transitions / Text / UI / Cursor / Charts). Copy `ae/Evotechly Transitions.jsx` into ScriptUI Panels next to Motion OS Hub. Lucide SVGs are still static icons; motion is native plans, not vendor packs.

## After Effects script paths

Quit After Effects before copying JSX.

### macOS

Typical application install (version folder name varies):

```
/Applications/Adobe After Effects 2025/Scripts/ScriptUI Panels/
/Applications/Adobe After Effects 2025/Scripts/
```

User-level CEP companions (only if a vendor asks — **not** Evotechly JSX):

```
~/Library/Application Support/Adobe/CEP/extensions/
```

### Windows

```
C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\ScriptUI Panels\
C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\
```

User-level CEP:

```
%APPDATA%\Adobe\CEP\extensions\
```

If a Window panel is missing, the `.jsx` is in `Scripts\` instead of `Scripts\ScriptUI Panels\`.

## Motion OS files (required for motion)

Copy into **Scripts/ScriptUI Panels**:

| File | Window menu |
|---|---|
| `ae/Evotechly Motion OS.jsx` | Evotechly Motion OS (v0.32, ~297 KB — do not stub) |
| `ae/SaaS Demo Tools.jsx` | SaaS Demo Tools / Motion OS Hub |
| `ae/Caption Style Tools.jsx` | Caption Style Tools |
| `ae/Evotechly Transitions.jsx` | Evotechly Transitions |

`ae/Seed Golden Project.jsx` → **Scripts** (or Hub Home → Seed).

See [ae/INSTALL-AE.md](../../ae/INSTALL-AE.md) and [docs/QUICK_START.md](../../docs/QUICK_START.md).

## How this pack relates to Evotechly Transitions

`Window → Evotechly Transitions` reads `transitions/Metadata/catalog.json` and applies `core/transitions` plans for implemented `EVT_*` IDs.

This pack’s `Metadata/asset-registry.json` is a **future integration surface**:

- Native rows point at Transition Kit IDs we already own (`EVT_UI_PUSH_*`, etc.).
- Third-party rows are documentation / install reminders, not apply targets.
- P1+ may let the panel filter by pack category. P0 does **not** change the JSX apply path.

Do not invent new `EVT_*` IDs at apply time. Add them to the Transition Kit catalog first, then reference them here.

## ThirdParty — editor installs official sources

If `redistributionAllowed` is **false** (AEJuice, Motion Bro, Animation Composer, ProductionCrate, Gumroad $0 scripts, TFM `.aex`, Meow CEP, etc.):

1. Open the official URL in [../MANUAL-DOWNLOADS.md](../MANUAL-DOWNLOADS.md).
2. Accept the vendor license on **your** machine.
3. Install where the vendor says (Pack Manager, ScriptUI, CEP, Plugin folder).
4. **Do not** copy those files from this git repo — they are not in the repo, and must not be added if the license forbids redistribution.
5. Do not treat an Evotechly release zip as a substitute for the vendor installer.

If you are shipping **Evotechly commercial / client** work, skip any row marked `BLOCKED_FOR_COMMERCIAL` or `REQUIRES LICENSE REVIEW` until legal sign-off.

## Lucide SVGs (optional)

`ThirdParty/lucide/svg/*.svg` may be imported as footage or used as a rebuild source. Keep `ThirdParty/lucide/LICENSE` with any copy. They are **not** Evotechly-owned artwork; they are Lucide / Feather under ISC + MIT.

## What not to install for a product soak

Do not install AEJuice, Motion Bro, Liquid Glass, UI Animator Pro, or Meow Captions to judge Motion OS. Native paths exist. See [docs/SOAK_CHECKLIST.md](../../docs/SOAK_CHECKLIST.md).
