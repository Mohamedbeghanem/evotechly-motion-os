# Manual downloads — editor machine only

P0 does **not** perform these downloads. This is a checklist for a human with a browser, a vendor account, and the ability to read a checkout license.

`redistributionAllowed` is whether the **raw file** may enter Evotechly git / the release zip. Finished-video use is a different question (see `SOURCES.md`).

Price **FREE / $0** means the listing was free or pay-what-you-want at research time. Confirm at checkout — Gumroad $0+ can change.

---

## How to run a row

1. Open the official URL (no mirrors).
2. Create an account if required.
3. Read the license on that page / PDF **before** clicking download.
4. If commercial is not explicit → stop and mark **REQUIRES LICENSE REVIEW**.
5. Install where the vendor says.
6. Destination below is the *logical* ThirdParty slot. If `redistributionAllowed` is false, **leave git empty** — keep the files only in your AE folder.

---

### 1. AEJuice Pack Manager + free / Starter packs

| Field | Value |
|---|---|
| Asset | AEJuice Pack Manager + any pack labeled Free / Starter |
| URL | https://aejuice.com · https://aejuice.com/product/starter-pack/ · https://aejuice.com/terms-and-conditions/ |
| Steps | 1) Create AEJuice account. 2) Install **Pack Manager** from the official site. 3) In the manager, open the pack’s license line. 4) If it says **Free Evaluation** → **do not use in Evotechly commercial**. 5) If it is a named free Starter with commercial language, screenshot the license and file a review. 6) Never export packs into this repo. |
| Price | FREE (manager). Packs vary. Evaluation imports ≠ a paid license. |
| License | AEJuice EULA: Evaluation = no commercial; Individual/Business for commercial; no redistributing Package; no competing presets. Product page may still advertise commercial Starter — **review the in-app license**. |
| Why needed | Optional extra HUD / liquid / slides. Not required. Native transitions exist. |
| Destination | `ThirdParty/aejuice/` (**gitignored** — do not commit) |
| redistributionAllowed | **false** |

---

### 2. Mixkit SFX (Free License clips)

| Field | Value |
|---|---|
| Asset | Individual SFX: whoosh, click, interface, notification (Free License only) |
| URL | https://mixkit.co/free-sound-effects/whoosh/ · https://mixkit.co/free-sound-effects/click/ · https://mixkit.co/free-sound-effects/interface/ · https://mixkit.co/free-sound-effects/notification/ · license index: https://mixkit.co/license/ |
| Steps | 1) Open a clip. 2) Confirm **Sound Effects Free License** (not Restricted). 3) Download to your machine. 4) Use on Transition Kit markers `EVT_SFX_*`. 5) Do not add WAV/MP3 to git. |
| Price | FREE |
| License | Mixkit SFX Free License — commercial finished works typical; no raw stock redistribution. |
| Why needed | Soft UI audio on anticipate / action / crossover / settle. |
| Destination | `ThirdParty/mixkit-sfx/` (local only) or AE project folder |
| redistributionAllowed | **false** |

**Candidates (search pages, not downloaded):** whoosh, click, interface, notification. Pick 4–8 short, quiet clips. Skip anything that sounds like a game explosion.

---

### 3. Pixabay UI SFX

| Field | Value |
|---|---|
| Asset | Short UI ticks / whooshes |
| URL | https://pixabay.com/sound-effects/search/ui/ · https://pixabay.com/service/license-summary/ |
| Steps | 1) Open file page. 2) Confirm Content License (or CC0 if pre-2019). 3) Download. 4) Do not ship as a standalone SFX pack. |
| Price | FREE (account may be required) |
| License | Pixabay Content License — commercial in a larger work; no standalone redistribute. |
| Why needed | Backup if Mixkit search is thin. |
| Destination | `ThirdParty/pixabay-sfx/` (local only) |
| redistributionAllowed | **false** |

---

### 4. Freesound (CC0 / CC-BY only)

| Field | Value |
|---|---|
| Asset | UI click / whoosh with license filter |
| URL | https://freesound.org/search/?q=ui+click&f=license%3A%22Creative+Commons+0%22 · FAQ: https://freesound.org/help/faq/ |
| Steps | 1) Filter **CC0** (preferred) or **CC-BY**. 2) Reject **CC-BY-NC**. 3) Download + save attribution text for BY. 4) Do not claim authorship. |
| Price | FREE (account required) |
| License | Per file CC0 or CC-BY 4.0 |
| Why needed | Same as Mixkit backup. CC0 is the only realistic “could we ever vendor?” case — still optional. |
| Destination | `ThirdParty/freesound/` (local unless a future P-phase vendors a tiny CC0 set with credit file) |
| redistributionAllowed | **false** by default; CC0 may be revisited later |

---

### 5. ProductionCrate — Crate’s Light Wrap + free assets

| Field | Value |
|---|---|
| Asset | Light Wrap plugin; optionally free (non-Pro-star) assets |
| URL | https://www.productioncrate.com/plugins/crates-light-wrap · https://www.productioncrate.com/terms.html |
| Steps | 1) Create account. 2) Read TOS: Free/Personal/Pro **cannot** be used for corporate/employer work — Enterprise required. 3) If Evotechly corporate shipping → **stop** unless Enterprise. 4) Install via official Portal / plugin page. 5) Do not mirror assets. |
| Price | FREE plugin / free assets; Pro and Enterprise are paid |
| License | Production in finished media; no raw redistribute; corporate use = Enterprise |
| Why needed | Optional talking-head wrap. Native Person → Light wrap first. |
| Destination | `ThirdParty/productioncrate/` (local only) |
| redistributionAllowed | **false** |

---

### 6. BentoMotion Liquid Glass

| Field | Value |
|---|---|
| Asset | Liquid Glass UI Kit for AE |
| URL | https://bentomotion.gumroad.com/l/glass-ae |
| Steps | 1) Read listing: **Free = personal only**. 2) For Evotechly commercial → **do not download the free SKU**. 3) If a paid commercial/Universal license is purchased later, still do not put source in git. |
| Price | FREE personal / paid commercial |
| License | Personal/Demo vs paid Universal. No source redistribution. |
| Why needed | Not needed. Native glass frost ships. |
| Destination | `ThirdParty/bentomotion-liquid-glass/` (local, personal experiments only) |
| redistributionAllowed | **false** |

---

### 7. Tools for Motion — Liquid Glass plugin

| Field | Value |
|---|---|
| Asset | Liquid Glass `.aex` / Mac `.plugin` |
| URL | https://www.toolsformotion.com/liquid-glass |
| Steps | 1) Download from Tools for Motion only. 2) Install per their docs (Mac + Windows). 3) Use on editor machine. 4) Never copy the binary into this repo or the release zip. |
| Price | FREE |
| License | Free commercial + client work; **no redistribute / repackage** |
| Why needed | Optional true refraction. Product path stays native frost. |
| Destination | AE plugin folder (vendor). Logical: `ThirdParty/tfm-liquid-glass/` (empty in git) |
| redistributionAllowed | **false** |

---

### 8. What? Studio — UI Animator Pro

| Field | Value |
|---|---|
| Asset | UI Animator Pro script/plugin |
| URL | https://whatstudio.gumroad.com/ |
| Steps | 1) Open UI Animator Pro. 2) Accept **$0** Single User License at checkout. 3) Save the license text. 4) Install as they instruct. 5) **Do not** commit jsxbin. |
| Price | $0 |
| License | Gumroad Single User — confirm commercial clause on accept |
| Why needed | Extra presets we did not reimplement. Native `applyUiPreset` first. |
| Destination | `ThirdParty/whatstudio-ui-animator-pro/` (local only) |
| redistributionAllowed | **false** |

---

### 9. What? Studio — PinRig

| Field | Value |
|---|---|
| Asset | PinRig |
| URL | https://whatstudio.gumroad.com/ |
| Steps | Same as UI Animator Pro. Confirm whether the $0 SKU is full or “Free Demo Script.” |
| Price | $0 |
| License | Confirm on accept |
| Why needed | Optional logo pins. Native lockup first. |
| Destination | `ThirdParty/whatstudio-pinrig/` (local only) |
| redistributionAllowed | **false** |

---

### 10. PaulPack v1

| Field | Value |
|---|---|
| Asset | PaulPack shape ornaments |
| URL | https://paulplane.gumroad.com/l/paulpackv1 |
| Steps | 1) PWYW $0+. 2) Read license in listing + pack. 3) Do not copy AEP/shapes into git. |
| Price | $0+ |
| License | Gumroad accept + pack PDF |
| Why needed | Optional ornaments. Prefer native `18_Shapes-Ornaments`. |
| Destination | `ThirdParty/paulpack/` (local only) |
| redistributionAllowed | **false** |

---

### 11. Plugin Everything — Repeater

| Field | Value |
|---|---|
| Asset | Repeater `.aex` |
| URL | https://aaeplugins.com/plugins/repeater/ |
| Steps | 1) Download from aaeplugins.com. 2) Read installer EULA. 3) Install plugin. 4) Never vendor `.aex`. |
| Price | FREE |
| License | Plugin EULA in installer (not reproduced here) |
| Why needed | Repeat live layers. Native shape Repeater often enough. |
| Destination | AE Plugins folder. Logical: `ThirdParty/plugin-everything-repeater/` |
| redistributionAllowed | **false** |

---

### 12. Meow Captions

| Field | Value |
|---|---|
| Asset | Meow Captions CEP panel |
| URL | https://sinopskyd.itch.io/meow-captions |
| Steps | 1) Download zip from itch.io. 2) Read INSTALLATION_GUIDE in the zip. 3) Copy to CEP extensions (paths in INSTALL.md). 4) Enable unsigned extensions if required. 5) Do not commit the zip. |
| Price | FREE |
| License | itch listing — confirm commercial before client work |
| Why needed | Optional. Native Caption Style Tools already covers keyword color + in/out. |
| Destination | CEP extensions. Logical: `ThirdParty/meow-captions/` |
| redistributionAllowed | **false** |

---

### 13. Presetify

| Field | Value |
|---|---|
| Asset | Presetify text presets |
| URL | https://kuldeepmp4.gumroad.com/l/Presetify |
| Steps | Gumroad $0+ accept → install per vendor → do not vendor files. |
| Price | $0+ |
| License | Gumroad accept |
| Why needed | Optional. Native caption in/out first. |
| Destination | `ThirdParty/presetify/` (local only) |
| redistributionAllowed | **false** |

---

### 14. Vignette Typer Lite

| Field | Value |
|---|---|
| Asset | Vignette Typer Lite |
| URL | https://vignettestudio.gumroad.com/l/vignette-typer-lite |
| Steps | Same as Presetify. |
| Price | $0+ |
| License | Gumroad accept |
| Why needed | Optional type-on. Polish Typewriter first. |
| Destination | `ThirdParty/vignette-typer-lite/` (local only) |
| redistributionAllowed | **false** |

---

### 15. Mister Horse — Animation Composer (free)

| Field | Value |
|---|---|
| Asset | Animation Composer plugin + starter pack |
| URL | https://www.mrhorse.com/animation-composer/ · https://misterhorse.com/terms-of-use |
| Steps | 1) Install from Mister Horse. 2) Accept EULA. 3) Use starter/free content per FAQ (commercial finished video OK). 4) Do not copy presets into git. 5) Paid packs need their own purchase. |
| Price | FREE (plugin + starter). Packs extra. |
| License | Mister Horse EULA — single user; no Package redistribute; no competing preset products |
| Why needed | Optional preset browser. Polish ease is native. |
| Destination | Vendor plugin location. Logical: `ThirdParty/mister-horse-ac/` |
| redistributionAllowed | **false** |

---

### 16. Motion Bro (plugin + free starter)

| Field | Value |
|---|---|
| Asset | Motion Bro host + Free Motion Bro Presets |
| URL | https://motionbro.com · https://motionbro.com/products/free-motion-bro-presets/ · https://motionbro.com/help/commercial-or-personal-use/ |
| Steps | 1) Install plugin from motionbro.com. 2) On the free starter SKU, confirm **Personal vs Commercial**. 3) Free personal = **do not use for Evotechly paid/client work**. 4) If you buy commercial, still never commit packs. |
| Price | Plugin free. Starter **personal** free; **commercial** is a paid license on their help page. |
| License | Personal vs commercial SKUs. Sell rendered video only — not project files containing presets. |
| Why needed | Host for some glass packs. Not required. |
| Destination | `ThirdParty/motion-bro/` (local only) |
| redistributionAllowed | **false** |

---

### 17. LottieFiles (per-file)

| Field | Value |
|---|---|
| Asset | A **single** public animation, if ever needed |
| URL | https://lottiefiles.com · https://lottiefiles.com/page/license |
| Steps | 1) Open **that** animation. 2) Confirm **Lottie Simple License** (or other). 3) Do not use Free-plan **created** files commercially. 4) Do not scrape / compile a library. 5) Prefer not to vendor JSON. |
| Price | FREE per public file; premium ≠ free |
| License | Per file. Simple License: commercial + modify; no competing compilation; standalone redistribute restricted. |
| Why needed | Rare. Prefer native AE. |
| Destination | `ThirdParty/lottiefiles/<slug>/` only after review (still usually local) |
| redistributionAllowed | **false** unless legal signs a specific file |

---

## Already fetched in P0 (not a manual step)

| Asset | URL | Notes |
|---|---|---|
| Lucide curated SVGs | https://github.com/lucide-icons/lucide | See `ThirdParty/lucide/`. LICENSE included. `redistributionAllowed: true` with notice. |

## Do not create manual rows for

- Envato / Motion Array / Telegram “AEJuice full pack”
- Cracked Saber / QCA / Displacer
- Solair project files
