# ThirdParty/

**Foreign files only.** Evotechly does not own these. Do not rebrand them as Evotechly Native.

## Rules

1. Every vendor subtree needs a `LICENSE` (or a `LICENSE.md` that quotes the official EULA URL and the date we read it) plus a `SOURCES.md` with the exact official download URL.
2. If the license **forbids redistribution** of raw files (almost every AE pack), **do not commit the binaries**. The editor installs from the official site. Record the row in `../MANUAL-DOWNLOADS.md` with `redistributionAllowed: false`.
3. If the license **allows redistribution** (MIT / ISC / CC0 with no extra stock-redistribute ban), a **curated** subset may live here. P0 example: `lucide/` (ISC + Feather MIT SVGs).
4. Never commit `.jsxbin`, `.aex`, `.plugin`, `.mbr`, AEJuice/Motion Bro packs, or encrypted CEP zips.
5. Registry rows for this tree use `sourceType: "thirdParty"` and must not claim `owner: "Evotechly"`.

## P0 contents

| Subtree | Why it is here |
|---|---|
| `lucide/` | Curated SaaS icon SVGs fetched from the official Lucide GitHub repo. LICENSE copied. Rebuild as AE shapes in P1. |

Everything else is **documented, not vendored**. See `../SOURCES.md`.

## What must never land here

- Envato / Motion Array / Freepik premium reuploads
- “Free evaluation” AEJuice imports used as if they were commercial
- BentoMotion Liquid Glass personal-free files (blocked for Evotechly commercial)
- Any file we did not fetch ourselves
