# Mr. BB project instructions

## Role

Build and maintain a small, original HVAC construction platformer for the web.

## Product rules

- Keep the launch artwork immediate on iPad, phone, and desktop, but require one explicit START activation before gameplay.
- Keep gameplay landscape-only: portrait shows the same approved artwork before START or a rotate-only pause gate during play, with no portrait bypass.
- Touch targets must be at least 44px and keyboard controls must remain available.
- Keep the first level short: ten varied HVAC parts, falling construction hazards, three hard hats.
- Keep Mr. BB bald with gray-blue eyes, light eyebrows, subtle light stubble, no moustache or full beard, and a brown hard hat.
- Keep Mr. BB in a plain black short-sleeve T-shirt, plain blue jeans with no knee pads or knee panels, dark gray/black gloves with a small white `BB`, and one black multi-pocket tool apron centered across the front of his waist; never restore a blue collared shirt or side tool pouches.
- Keep the runtime sprite's work-boot leather entirely brown, including both toes; never restore contrasting black toe caps. Preserve the approved splash boots as drawn.
- Keep the original four-phase Mr. BB run cycle readable at phone scale: grounded movement must alternate the authored arm-and-leg poses in traveled-distance order, while idle, airborne, crouching, stopped, and non-playing states must not keep cycling. Do not replace it with procedural bobbing or copied character animation.
- Do not use Mario, Nintendo, or other copyrighted game art, audio, names, or level designs.
- Preserve LittleJS MIT attribution and `vendor/LITTLEJS-LICENSE.txt`.
- Prefer original assets, canvas primitives, and dependency-free gameplay code.
- Do not add accounts, analytics, ads, payments, or networked leaderboards without approval.

## Architecture

- `index.html` and `styles.css`: page, explicit landscape START gate, HUD, end-state overlay, and gesture feedback.
- `src/launch.js`: lightweight artwork readiness, orientation state, and guarded dynamic game bootstrap.
- `src/game.js`: LittleJS world, idempotent engine startup, objects, rendering, input, and DOM integration.
- `src/player-animation.js`: pure traveled-distance run-cycle state and frame selection.
- `src/game-logic.js`: pure scoring and life-state rules.
- `src/level-data.js`: level-one part and hazard definitions and placements.
- `tests/`: Node test runner coverage for pure game rules.
- `vendor/`: pinned LittleJS runtime and license.

## Commands

- Development: `npm run dev`
- Tests: `npm test`
- Syntax check: `npm run lint`
- Production build: `npm run build`

## Workflow

Use `/deep` for research, `/shape` for planning, `/make` for execution, and `/audit` for review.
