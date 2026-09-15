# UI-Push (family A / 01)

Premium SaaS. No glitch / RGB / flares.

Phase for this family: **2** (see docs/TRANSITION_PHASES.md). **Phase 2 is done** — the full UI Push family produces real deterministic plans.

Implemented IDs:

- `EVT_UI_PUSH_LEFT` · **UI Push Left** · STANDARD · Dashboard → next screen, iOS-style push left — **implemented (Phase 1)**
- `EVT_UI_PUSH_RIGHT` · **UI Push Right** · STANDARD · Back navigation, previous screen from the left — **implemented (Phase 1)**
- `EVT_UI_PUSH_UP` · **UI Push Up** · STANDARD · Sheet-like screen rise, settings stack — **implemented (Phase 1)**
- `EVT_UI_PUSH_DOWN` · **UI Push Down** · STANDARD · Dismiss upward stack, close overlay screen — **implemented (Phase 1)**
- `EVT_UI_PUSH_SCALE` · **UI Push + Scale** · STANDARD · Card or modal swap without a hard slide — **implemented (Phase 1)**
- `EVT_UI_PUSH_DEPTH` · **UI Push + Depth** · SMOOTH · Recede outgoing, lift incoming — product tour — **implemented (Phase 1)**
- `EVT_UI_PUSH_SOFT` · **UI Push Soft** · SMOOTH · Same as left with longer settle — **implemented (Phase 2)**
- `EVT_UI_PUSH_SNAP` · **UI Push Snap** · FAST · Short product chrome, tab-to-tab — **implemented (Phase 2)**
- `EVT_UI_PUSH_OVERSHOOT` · **UI Push Overshoot** · STANDARD · Push with a quieter elastic settle — **implemented (Phase 2)**
- `EVT_UI_PUSH_PARALLAX` · **UI Push Parallax** · SMOOTH · Foreground moves more than background — **implemented (Phase 2)**
- `EVT_UI_PUSH_FADE` · **UI Push Fade** · STANDARD · Push plus crossfade for busy UI — **implemented (Phase 2)**
- `EVT_UI_PUSH_COVER` · **UI Push Cover** · STANDARD · Incoming covers outgoing; outgoing stays — **implemented (Phase 2)**
- `EVT_UI_PUSH_PANEL` · **Panel Push** · STANDARD · Inspector / side panel from the trailing edge (`EVT_PANEL_PUSH` alias) — **implemented (Phase 2)**
- `EVT_UI_PUSH_DASHBOARD` · **Dashboard Push** · SMOOTH · Dashboard → next view with a quiet depth push — **implemented (Phase 2)**
- `EVT_UI_PUSH_SPLIT` · **Split Panel Push** · STANDARD · Master–detail split: panes part, incoming takes the open half — **implemented (Phase 2)**

Plans live in `core/transitions/uiPush.js`. JSX mirrors the same numbers in `ae/Evotechly Transitions.jsx`.

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
