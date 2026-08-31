# Mr. BB — Duct Run

A small browser platformer set on an HVAC construction site. Run, jump, collect ten duct sections, and dodge falling mastic buckets.

Play: <https://sergeisysoev.github.io/mr-bb-game/>

## Controls

- Move: `A` / `D` or arrow keys
- Jump: `W`, `Arrow Up`, or `Space`
- Touch: on-screen left, right, and jump buttons
- Restart: `R` or the **Restart run** button

## Local development

```bash
npm install
npm run dev
```

Verification:

```bash
npm test
npm run lint
npm run build
```

## Open-source foundation

Mr. BB uses the MIT-licensed [LittleJS](https://github.com/KilledByAPixel/LittleJS) engine and adapts the structure and platforming ideas from its [platformer example](https://github.com/KilledByAPixel/LittleJS/tree/main/examples/platformer). LittleJS license text is preserved in `vendor/LITTLEJS-LICENSE.txt` and attribution details are in `THIRD_PARTY_NOTICES.md`.

All Mr. BB character art and HVAC-themed game design in this repository are original to this project. Generation provenance and exact prompts are recorded in `art/IMAGEGEN-PROMPTS.md`. No Nintendo or Mario assets are used.
