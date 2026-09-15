# UI-Slide (family B / 02)

Premium SaaS. No glitch / RGB / flares.

Phase for this family: **3** (see docs/TRANSITION_PHASES.md). Phase 1 implements the six UI Push IDs only.

Planned IDs:

- `EVT_SLIDE_CARD_LEFT` · FAST · Single card enters from right
- `EVT_SLIDE_CARD_RIGHT` · FAST · Single card enters from left
- `EVT_SLIDE_PANEL_IN` · STANDARD · Side panel / inspector in
- `EVT_SLIDE_PANEL_OUT` · FAST · Side panel dismiss
- `EVT_SLIDE_DRAWER` · STANDARD · Nav drawer from leading edge
- `EVT_SLIDE_SHEET_UP` · STANDARD · Bottom sheet present
- `EVT_SLIDE_STACK` · SMOOTH · Card stack peek + commit
- `EVT_SLIDE_PEEK` · MICRO · Partial reveal, then hold

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
