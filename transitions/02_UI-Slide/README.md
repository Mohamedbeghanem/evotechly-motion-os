# UI-Slide (family B / 02)

Premium SaaS. Card-width travel, not full-frame. No glitch / RGB / flares.

Phase for this family: **3** (see docs/TRANSITION_PHASES.md). **Phase 3 is done** — the card family produces real deterministic plans.

Implemented IDs:

- `EVT_SLIDE_CARD_LEFT` · **Slide Card Left** · FAST · Single card enters from right — **implemented (Phase 3)**
- `EVT_SLIDE_CARD_RIGHT` · **Slide Card Right** · FAST · Single card enters from left — **implemented (Phase 3)**
- `EVT_SLIDE_PANEL_IN` · **Slide Panel In** · STANDARD · Side panel / inspector in — **implemented (Phase 3)**
- `EVT_SLIDE_PANEL_OUT` · **Slide Panel Out** · FAST · Side panel dismiss — **implemented (Phase 3)**
- `EVT_SLIDE_DRAWER` · **Slide Drawer** · STANDARD · Nav drawer from leading edge — **implemented (Phase 3)**
- `EVT_SLIDE_SHEET_UP` · **Slide Sheet Up** · STANDARD · Bottom sheet present — **implemented (Phase 3)**
- `EVT_SLIDE_STACK` · **Slide Stack** · SMOOTH · Card stack peek + commit — **implemented (Phase 3)**
- `EVT_SLIDE_PEEK` · **Slide Peek** · MICRO · Partial reveal, then hold — **implemented (Phase 3)**

Plans live in `core/transitions/uiSlide.js`. JSX mirrors the same numbers in `ae/Evotechly Transitions.jsx`. Travel is a card / panel / drawer width (0.22–0.42 of the axis), not a full-frame push.

EvoCRM path: dashboard → card → detail. Charts / device plates are a later P2b.

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
