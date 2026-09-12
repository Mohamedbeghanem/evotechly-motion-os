# Editor assets (v0.7)

Ship with the kit. No third-party plugin binaries. No commercial font files.

## Captions

`assets/caption-templates.json` — timing, scale, safe margins, role names.

Sample SRT (short stubs only):

- `examples/captions/demo-en.srt`
- `examples/captions/demo-ar.srt`
- `examples/captions/demo-ar-en.srt`

Panel: Captions tab → Apply template, or Import SRT (basic parser: index + timecode + text). Nested/ASS/styled SRT is out of scope.

## Fonts (names only)

Use a system font that already supports Arabic. Do not commit font binaries.

Recommended if present on the machine:

- Noto Naskh Arabic
- Noto Sans Arabic
- Cairo
- IBM Plex Sans Arabic
- Inter / SF Pro Text for English

Set paragraph direction in AE for Arabic. Do not rasterize captions to PNG.

## LUT / BG placeholders

- `assets/luts/` — drop a licensed brand LUT here. Nothing ships in this folder.
- `assets/bg/` — drop an office plate or gradient still. No stock pulled from paid libraries.
