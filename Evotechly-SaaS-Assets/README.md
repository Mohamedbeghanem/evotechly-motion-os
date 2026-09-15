# Evotechly SaaS Assets Pack — P1

Source discovery + license audit + library scaffold. **No pirated packs. No fake downloads.**

P1 ships native text / UI / cursor generators (`core/assets/`) and apply tabs on [Evotechly Transitions](../ae/Evotechly Transitions.jsx). P0 folders, legal docs, registry schema, and Lucide icons stay. See [Documentation/P1_NATIVE.md](Documentation/P1_NATIVE.md).

## What P0 is not

- Not a zip of AEJuice / Motion Bro / Animation Composer / Liquid Glass binaries
- Not a claim that we downloaded Gumroad / itch.io / Pack Manager files
- Not Evotechly ownership of third-party source files
- Not a replacement for Ultimate 2.0.0 or the Transition Kit catalog

## Layout

| Path | Role |
|---|---|
| `01_Transitions/` … `20_Camera-Moves/` | Intended contents + `EVT_` examples |
| `Engine/` `Presets/` `Scripts/` `Metadata/` `Previews/` `Licenses/` `Sources/` `Documentation/` | Reserved infrastructure |
| `ThirdParty/` | Foreign files only, with LICENSE per vendor. Redistribution-forbidden items stay off git |
| `EvotechlyNative/` | Our generators / plans / shapes. MIT Evotechly |
| `SOURCES.md` | Official URLs + license research |
| `MANUAL-DOWNLOADS.md` | Browser / $0 checkout checklist |
| `ASSET-AUDIT.md` | KEEP / REJECT / REBUILD / REQUIRES LICENSE REVIEW |
| `Metadata/asset-registry.json` | Schema + native Transition Kit stubs + Lucide rows |

## Legal rules (hard)

1. Official sources only. No Envato / Motion Array reuploads, no cracks, no scraped paywalls.
2. Record a license for every third-party entry.
3. `downloaded: true` in the registry only after a real fetch + verification.
4. Do not redistribute third-party source files in an Evotechly zip when the vendor forbids it.
5. Prefer **native rebuild** when a companion is personal-only, evaluation-only, or redistribution-forbidden.

## Next

P2 = charts / devices **or** Transition Kit Phase 3 Card family (recommended next for EvoCRM). Still no AEJuice / Motion Bro / Bento in git.

Motion OS pointer: [docs/SAAS_ASSETS_P1.md](../docs/SAAS_ASSETS_P1.md).
