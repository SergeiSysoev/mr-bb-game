# Image generation prompts

All assets were generated as original artwork for Mr. BB. No Nintendo or Mario assets were used.

## `assets/mr-bb-v2.png`

Initial mode: built-in `precise-object-edit`
Current revision mode: built-in `background-extraction`

- Generated: 2026-08-31 with OpenAI image generation through Codex
- Project file: resized from the transparent generated cutout to 488×446 for the LittleJS texture
- Project file SHA-256: `4d2fe1020b630a07023c62ce6e2a8b2c5dd060c6388c46ec327770f4ed4fc83f`
- Project usage: included by the project owner under this repository's MIT license

### Proportion redesign prompt

```text
Use case: stylized-concept
Asset type: transparent game character sprite/cutout for a side-scrolling HVAC construction platformer
Input images: Image 1 is the existing Mr. BB character and the edit target
Primary request: Redesign only the character proportions so Mr. BB reads clearly at small phone-game scale. Give him an oversized expressive head, compact short torso, short sturdy limbs, large gloves and boots, and a playful three-heads-tall arcade mascot silhouette. Keep a dynamic running pose facing right.
Subject invariants: Same original clean-shaven adult HVAC worker identity and friendly expression; absolutely no beard and no mustache; brown construction hard hat; dark-blue work shirt; orange/yellow high-visibility vest; gray work pants; brown work boots; work gloves.
Style/medium: polished original 2D cartoon platform-game sprite, bold clean outline, simple high-contrast shapes, minimal tiny detail, readable silhouette, production-ready.
Composition/framing: one full-body character centered, all limbs and hard hat fully visible, generous transparent padding, square canvas.
Background: genuinely transparent alpha background.
Constraints: change proportions and cartoon readability while preserving the outfit, brown hard hat, clean-shaven face, colors, right-facing running action, and character identity; no text; no logos; no watermark.
Avoid: any resemblance to Mario or other Nintendo characters, red plumber clothing, blue overalls, white gloves, cap with a letter, mustache, beard, copyrighted game character styling, extra people, duplicate limbs, cropped feet or hard hat, scenery, shadows on an opaque background.
```

### Transparency correction prompt

```text
Use case: background-extraction
Asset type: transparent game character sprite/cutout
Input images: Image 1 is the exact edit target
Primary request: Remove the entire gray-and-white checkerboard background and replace it with genuine transparent alpha.
Constraints: change only the background; preserve the Mr. BB character exactly, including his oversized-head proportions, clean-shaven face with no mustache or beard, brown hard hat, pose, outline, colors, clothing, gloves, boots, facial expression, and all edges; keep the complete uncropped character centered; no added shadow; no text; no logo; no watermark.
Avoid: baked checkerboard, white background, gray background, colored halo, edge fringing, any character redesign.
```

## `assets/mr-bb.png`

Initial mode: built-in `stylized-concept`
Current revision modes: built-in `precise-object-edit`, then built-in `background-extraction`

- Generated: 2026-08-31 with OpenAI image generation through Codex
- Revised: 2026-08-31 — clean-shaven face and brown hard hat
- Project file SHA-256: `c767939fa0227067954da48bade70bac9123a54b352cff2388d6b76bace28d1f`
- Project usage: included by the project owner under this repository's MIT license

### Initial generation prompt

```text
Use case: stylized-concept
Asset type: 2D browser game character sprite, single transparent cutout
Primary request: create an original character named Mr. BB, a friendly HVAC construction worker for a side-scrolling platform game
Subject: full-body worker viewed in clean side profile facing right, mid-run pose, yellow hard hat, orange high-visibility vest over a dark navy work shirt, gray work pants, brown safety boots, work gloves, short dark beard; confident and approachable
Style/medium: polished 2D cartoon game art with subtle pixel-art influence, bold clean silhouette, flat shading, readable at about 80 pixels tall
Composition/framing: one centered character only, entire body visible with generous padding; no sprite sheet and no duplicate poses
Lighting/mood: bright, energetic, worksite-safe
Constraints: genuinely transparent background with preserved alpha; original design; no text; no letters; no logos; no trademarks; no watermark; no Mario resemblance; no red cap; no moustache; no extra tools or props; crisp edges
```

### Current revision prompts

```text
Use case: precise-object-edit
Asset type: existing 2D browser-game character sprite, transparent cutout
Input image: Image 1 is the edit target.
Primary request: Change only two details on Mr. BB: (1) remove the entire beard and moustache so his face is completely clean-shaven, with no facial hair and no stubble; (2) recolor the hard hat from yellow to a clearly brown construction hard hat, using a rich medium chestnut-brown color with natural darker shadows and lighter brown highlights.
Constraints: Preserve the exact same character identity, facial features, expression, running pose, proportions, side-facing direction, orange safety vest, navy shirt, gray pants, gloves, boots, illustration style, crop, edge quality, and genuine transparent background. Keep one character only. Do not modify anything except facial hair removal and hard-hat color. No text, no logo, no watermark.
Avoid: beard, moustache, goatee, sideburn facial hair, stubble, yellow hard hat, orange hard hat, red hard hat, background, extra objects, extra characters, Mario resemblance.
```

```text
Use case: background-extraction
Asset type: 2D browser-game character sprite, transparent cutout
Input image: Image 1 is the edit target.
Primary request: Remove the entire gray-and-white checkerboard background and replace it with genuine transparent alpha.
Constraints: Preserve the character exactly as shown, including his completely clean-shaven face with no beard, no moustache, and no stubble; preserve the brown hard hat, expression, pose, anatomy, clothing, colors, outlines, lighting, crop, and edge details. Output one isolated full-body character on a truly transparent background. Do not draw or simulate a checkerboard. No shadows outside the character, no text, no logo, no watermark.
Avoid: any visible background color or pattern, checkerboard pattern, facial hair, yellow hard hat, altered pose, cropped body, extra objects.
```

## `public/og.png`

Initial mode: built-in `ads-marketing`
Current revision mode: built-in `precise-object-edit`

- Generated: 2026-08-31 with OpenAI image generation through Codex
- Revised: 2026-08-31 — clean-shaven face and brown hard hat
- Project file SHA-256: `5e2a00bdca8fb1c9acfb045c1fe316bc99d1fe66cceed7a54c0cb9cd1b60072a`
- Project usage: included by the project owner under this repository's MIT license

### Initial generation prompt

```text
Use case: ads-marketing
Asset type: branded 16:9 landscape social-preview card for a browser game
Primary request: Create one energetic, polished promotional illustration for a game titled exactly "MR. BB" with supporting copy exactly "DUCT RUN".
Scene/backdrop: An unfinished commercial building interior with exposed concrete and steel framing, filled with shiny rectangular sheet-metal ductwork and spiral ductwork that create a dynamic obstacle-course feeling.
Subject: One original, friendly HVAC construction worker in a yellow hard hat and orange safety vest, shown full-body running through the building. Behind him, a gray mastic bucket is falling through the air with vivid bright-orange mastic splashing and trailing dramatically.
Style/medium: High-end polished 2D game illustration; expressive and approachable; crisp shapes, dimensional lighting, clean commercial finish; entirely original character design.
Composition/framing: Wide 16:9 landscape card with strong action, depth, and a clear focal hierarchy. Integrate a large, immediately readable title and smaller supporting copy without covering the runner's face or key action.
Lighting/mood: Energetic, friendly, adventurous construction-site atmosphere with dramatic highlights on the metal ducts.
Color palette: Industrial navy and steel blue-gray, accented by safety orange and hard-hat yellow; high contrast for thumbnail readability.
Text (verbatim): "MR. BB" and "DUCT RUN". Render "MR. BB" exactly once as the dominant title (characters: M R period, space, B B). Render "DUCT RUN" exactly once as the supporting copy beneath or near the title. Both strings must be large, crisp, correctly spelled, and fully legible.
Constraints: Landscape social-card layout; original friendly HVAC worker; yellow hard hat; orange safety vest; both rectangular and spiral shiny ductwork visible; falling gray mastic bucket; bright-orange mastic visible; exact title and supporting copy only.
Avoid: Any Mario resemblance, red plumber styling, Nintendo characters or assets, copyrighted game characters, extra people, extra words, misspellings, duplicate text, unrelated logos, brand marks, signatures, borders, or watermark.
```

### Current revision prompt

```text
Use case: precise-object-edit
Asset type: existing 16:9 social-preview card for the browser game Mr. BB — Duct Run
Input image: Image 1 is the edit target.
Primary request: Change only two details on the running worker: (1) remove his entire beard and moustache so his face is completely clean-shaven, with no facial hair and no stubble; (2) recolor his yellow hard hat to a clearly brown construction hard hat, using a rich medium chestnut-brown color with natural darker shadows and lighter brown highlights.
Text (verbatim): Preserve "MR. BB" exactly once and "DUCT RUN" exactly once, perfectly spelled and fully legible in the exact existing positions and styles.
Constraints: Preserve the exact 16:9 composition, worker identity, expression, running pose, anatomy, clothing, orange safety vest, HVAC jobsite, shiny rectangular and spiral ductwork, falling gray mastic bucket, orange mastic splash, lighting, palette, title typography, supporting-copy typography, crop, and overall polished 2D game-illustration style. Do not change anything except facial hair removal and hard-hat color. No new text, logos, signatures, borders, or watermark.
Avoid: beard, moustache, goatee, stubble, yellow hard hat, orange hard hat, red hard hat, misspelled text, duplicate text, extra people, changed background, changed bucket, changed ducts, Mario resemblance.
```
