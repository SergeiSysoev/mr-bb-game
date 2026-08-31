# Mr. BB project instructions

## Role

Build and maintain a small, original HVAC construction platformer for the web.

## Product rules

- Keep the game immediately playable on iPad, phone, and desktop.
- Touch targets must be at least 44px and keyboard controls must remain available.
- Keep the first level short: ten duct sections, falling mastic hazards, three hard hats.
- Do not use Mario, Nintendo, or other copyrighted game art, audio, names, or level designs.
- Preserve LittleJS MIT attribution and `vendor/LITTLEJS-LICENSE.txt`.
- Prefer original assets, canvas primitives, and dependency-free gameplay code.
- Do not add accounts, analytics, ads, payments, or networked leaderboards without approval.

## Architecture

- `index.html` and `styles.css`: page, HUD, overlays, gesture feedback, and opt-in accessible tap controls.
- `src/game.js`: LittleJS world, objects, rendering, input, and DOM integration.
- `src/game-logic.js`: pure scoring and life-state rules.
- `tests/`: Node test runner coverage for pure game rules.
- `vendor/`: pinned LittleJS runtime and license.

## Commands

- Development: `npm run dev`
- Tests: `npm test`
- Syntax check: `npm run lint`
- Production build: `npm run build`

## Workflow

Use `/deep` for research, `/shape` for planning, `/make` for execution, and `/audit` for review.
