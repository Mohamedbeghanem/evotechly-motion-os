# Scale-Zoom (family C / 03)

Premium SaaS. No glitch / RGB / flares.

Phase for this family: **4** (see docs/TRANSITION_PHASES.md). Phase 1 implements the six UI Push IDs only.

Planned IDs:

- `EVT_ZOOM_IN` · STANDARD · Plate scales up into frame
- `EVT_ZOOM_OUT` · STANDARD · Pull back to context
- `EVT_ZOOM_TARGET` · SMOOTH · Frame a selected region (target required)
- `EVT_ZOOM_MATCH` · STANDARD · Match outgoing crop to incoming
- `EVT_SCALE_POP` · FAST · 90→100 card present
- `EVT_SCALE_BREATHE` · SMOOTH · Idle 100→102→100 — use sparingly
- `EVT_SCALE_PUNCH` · FAST · Short punch-in on a KPI
- `EVT_SCALE_SETTLE` · STANDARD · Oversize incoming eases to 100

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
