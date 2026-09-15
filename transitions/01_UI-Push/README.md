# UI-Push (family A / 01)

Premium SaaS. No glitch / RGB / flares.

Phase for this family: **2** (see docs/TRANSITION_PHASES.md). Phase 1 implements the six UI Push IDs only.

Planned IDs:

- `EVT_UI_PUSH_LEFT` · STANDARD · Dashboard → next screen, iOS-style push left — **implemented (Phase 1)**
- `EVT_UI_PUSH_RIGHT` · STANDARD · Back navigation, previous screen from the left — **implemented (Phase 1)**
- `EVT_UI_PUSH_UP` · STANDARD · Sheet-like screen rise, settings stack — **implemented (Phase 1)**
- `EVT_UI_PUSH_DOWN` · STANDARD · Dismiss upward stack, close overlay screen — **implemented (Phase 1)**
- `EVT_UI_PUSH_SCALE` · STANDARD · Card or modal swap without a hard slide — **implemented (Phase 1)**
- `EVT_UI_PUSH_DEPTH` · SMOOTH · Recede outgoing, lift incoming — product tour — **implemented (Phase 1)**
- `EVT_UI_PUSH_SOFT` · SMOOTH · Same as left with longer settle
- `EVT_UI_PUSH_SNAP` · FAST · Short product chrome, tab-to-tab
- `EVT_UI_PUSH_OVERSHOOT` · STANDARD · Push with a quieter elastic settle
- `EVT_UI_PUSH_PARALLAX` · SMOOTH · Foreground moves more than background
- `EVT_UI_PUSH_FADE` · STANDARD · Push plus crossfade for busy UI
- `EVT_UI_PUSH_COVER` · STANDARD · Incoming covers outgoing; outgoing stays

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
