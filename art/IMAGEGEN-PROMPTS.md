# Image generation prompts

All assets were generated as original artwork for Mr. BB. No Nintendo or Mario assets were used.

## `assets/mr-bb-v2.png`

Initial mode: built-in `precise-object-edit`
Current revision modes: built-in `precise-object-edit`, built-in `background-extraction`, then local connected-background alpha cleanup with Node/ffmpeg (no generative redraw)

- Generated: 2026-08-31 with OpenAI image generation through Codex
- Revised: 2026-08-31 — bald head, light eyebrows, and subtle light stubble
- Revised again: 2026-08-31 — plain blue denim jeans without knee pads, charcoal-gray gloves with small white `BB` marks, no side pouches, and one original black four-pocket tool apron centered across the front of the waist
- Project file: the generated cutout received the documented connected-background alpha cleanup, was resized to 488×446, then was mechanically scaled and bottom-anchored to match the previous approved character footprint in the LittleJS texture
- Project file SHA-256: `44636e90e652f9b0932b5a3a9f47d5d550f375f7e9f28a603e29f5d74e685699`
- Project usage: included by the project owner under this repository's MIT license
- Structural reference only: the user-supplied `Photo 1.jpg` black waist-apron image and [Lowe's model 106668-BLKXL](https://www.lowes.com/pd/Carhartt-Men-s-Black-Canvas-Waist-Apron-X-Large-Adjustable-Strap-12-ounce-Cotton-Duck-Construction-4-Large-Pockets/5014783235); all brand marks and proprietary plaques were excluded from the original Mr. BB design

The latest identity correction below supersedes the clean-shaven and dark-hair details in the original proportion prompt.

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

### Bald identity correction prompt

```text
Use case: precise-object-edit
Asset type: transparent 2D game character sprite/cutout for the Mr. BB HVAC platformer
Input images: Image 1 is the exact edit target
Primary request: Change only Mr. BB's hair, eyebrows, and facial stubble. Make him visibly bald by removing every visible patch of dark hair beneath and behind the hard hat, including the dark hair at the temple, around the ear, and at the back of the head; replace those areas with naturally shaded bare scalp matching his skin. Change both eyebrows from dark brown/black to clearly light blond/light beige eyebrows that remain easy to read at small game scale. Add subtle very light blond-to-pale-gray short stubble across the lower cheeks, jawline, and chin, like one or two days of light unshaven growth.
Subject invariants: Preserve the exact same original friendly adult HVAC worker identity, oversized cartoon head and compact body proportions, facial expression, eye shape, nose, ears, dynamic right-facing running pose, brown construction hard hat, blue shirt, orange/yellow safety vest, gray pants, gloves, brown boots, colors, outlines, lighting, crop, and transparent padding.
Style/medium: Preserve the exact polished original 2D cartoon platform-game sprite style, bold clean outline, high-contrast readable silhouette.
Background: preserve genuine transparent alpha.
Constraints: The scalp must read as bald wherever visible under the hard hat. Eyebrows must be light, not dark. Stubble must be light-colored, short, sparse, and subtle; it is not a beard and not a moustache. Keep one complete uncropped character only. No text, logo, shadow outside the character, or watermark.
Avoid: any visible dark head hair, dark eyebrows, thick beard, full beard, goatee, moustache, dark facial hair, red plumber clothing, cap with a letter, Mario or Nintendo resemblance, changed pose, changed anatomy, changed outfit, changed hard-hat color, opaque background, checkerboard background, extra objects, duplicate limbs.
```

### Latest transparency correction prompt

```text
Use case: background-extraction
Asset type: transparent 2D game character sprite/cutout
Input images: Image 1 is the exact edit target
Primary request: Remove the entire gray-and-white checkerboard background and replace it with genuine transparent alpha.
Constraints: Change only the background. Preserve Mr. BB exactly as shown, including his completely bald head with no visible dark hair beneath the brown hard hat, clearly light blond/light beige eyebrows, subtle light blond-to-pale-gray short stubble on the lower cheeks, jaw, and chin, clean upper lip with no moustache, oversized cartoon head and compact body, facial expression, pose, outlines, colors, brown hard hat, blue shirt, orange/yellow vest, gray pants, gloves, boots, anatomy, lighting, and all edges. Keep the complete uncropped character centered. No added shadow, text, logo, or watermark.
Avoid: baked checkerboard, white background, gray background, colored halo, edge fringing, dark head hair, dark eyebrows, thick beard, moustache, character redesign, altered pose, cropped hard hat or feet.
```

### Plain-jeans and front-apron outfit revision prompt

```text
Use case: precise-object-edit
Asset type: transparent 2D game character sprite/cutout for the original Mr. BB HVAC platformer.

Input images:
- Image 1 is the exact character edit target.
- Image 2 is a reference ONLY for the general construction, silhouette, and front-worn placement of a black multi-pocket waist tool apron. Do not copy any brand marks, plaques, logos, or exact proprietary details from Image 2.

Primary request: Change only Mr. BB's jeans, gloves, and tool-storage garment.

Required clothing edits:
1. Replace the current gray work pants with ordinary plain medium-blue denim jeans. The jeans must be simple continuous denim with normal seams and natural folds only. Absolutely no knee pads, no knee patches, no reinforced knee panels, no contrasting shapes or accessories on either knee.
2. Replace the current tan/orange padded gauntlet gloves with ordinary fitted work gloves in charcoal black and medium gray. Keep the gloves simple, flexible, and believable, with a tiny clean white "BB" marking on the back of each glove where visible.
3. Remove every side tool pocket, hip pouch, holster, side-mounted tool holder, and all tools hanging at either hip.
4. Add one original black/charcoal canvas waist tool apron worn across the FRONT of his lower abdomen at the belt line. It must hang centered in front like Image 2: a wide waistband/strap with four distinct open front pockets arranged across the belly, compact enough for running, with only a few small generic tool handles peeking from the FRONT pockets. The front apron must clearly replace the side pouches. No branded metal plaques and no recognizable third-party logo.

Identity and pose invariants: Preserve the exact same friendly Mr. BB identity, oversized cartoon head, compact body, facial expression, eye shape, nose, ears, completely bald scalp under the hard hat, light blond/light beige eyebrows, subtle pale-blond short stubble on lower cheeks/jaw/chin, clean upper lip with no moustache, brown construction hard hat, dark-blue shirt, orange/yellow safety vest, brown work boots, dynamic right-facing running pose, anatomy, proportions, outline, lighting, crop, and transparent padding.

Style/medium: preserve the exact polished original 2D cartoon platform-game sprite style, bold clean outline, high-contrast readable silhouette, production-ready.

Background: preserve genuine transparent alpha. Keep one complete uncropped character centered with all limbs, boots, and hard hat fully visible.

Text (verbatim): "BB" only, rendered very small in white on the backs of the dark gloves. No other text.

Constraints: original generic construction apparel only; no Carhartt name or logo; no trademarks; no side pouches; no knee pads; no knee patches; no tan gloves; no orange gloves; no extra tools floating outside the apron; no new objects; no watermark.

Avoid: altered face or identity, dark head hair, dark eyebrows, beard, moustache, gray pants, cargo pockets, knee panels, knee guards, hip holsters, side tool bags, brand marks, metal logo plaques, Mario/Nintendo resemblance, red plumber clothing, extra people, duplicate limbs, cropped body, opaque background, checkerboard background, scenery, external shadow.
```

### Final outfit alpha-extraction prompt

```text
Use case: background-extraction
Asset type: production game sprite with a real transparent alpha channel.

Input images:
- Image 1 is the exact character artwork to isolate. Preserve this character and outfit exactly.
- Image 2 is reference ONLY for the required genuine transparent-alpha file behavior and clean isolated edge treatment. Do not restore Image 2's old clothes.

Primary request: Extract the entire complete Mr. BB character from Image 1 and place him on a truly transparent RGBA canvas. Delete every background pixel, including every light-gray and white checkerboard square. The checkerboard in Image 1 is a background artifact to remove, NOT a pattern to preserve or redraw.

Absolute invariants: preserve the exact Image 1 character, face, bald scalp, light eyebrows, subtle pale stubble, clean upper lip, brown hard hat, running pose, blue shirt, orange/yellow vest, plain blue jeans with no knee pads or panels, dark charcoal-gray gloves with small white "BB", brown boots, and the centered black four-pocket front waist apron with tool handles and no side pouches. Preserve outlines, colors, lighting, scale, crop, and full uncropped body.

Output requirement: PNG with actual transparent alpha outside the character. When viewed on a transparency grid, the grid must come from the viewer and must not exist as RGB pixels in the image. No solid white, gray, or colored background. No baked checkerboard.

Text (verbatim): preserve only "BB" on the gloves.

Avoid: any character redesign, old gray pants, tan gloves, side pouches, knee pads, background pattern, drop shadow, halo, edge fringing, logo, watermark, crop, extra objects.
```

The image-generation service returned the final cutout with a baked light checkerboard in an RGB PNG despite the extraction prompt. The project sprite therefore received a deterministic, non-generative connected-light-background removal and RGBA encoding pass with Node and ffmpeg before its 488×446 resize. The character pixels were not redrawn during this cleanup.

## `assets/mr-bb.png` — retired legacy sprite

Status: retained only for provenance; the runtime must use `assets/mr-bb-v2.png`.

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

## `public/og.png` and `assets/mr-bb-splash.png`

Initial mode: built-in `ads-marketing`
Current revision mode: built-in `precise-object-edit`

- Generated: 2026-08-31 with OpenAI image generation through Codex
- Revised: 2026-08-31 — bald head, light eyebrows, subtle light stubble, and brown hard hat
- Revised again: 2026-08-31 — removed the airborne mastic bucket and orange liquid; added flying screws and tools for the buttonless launch splash
- Final title revision: 2026-08-31 — restored the clearly visible space in the exact title `MR. BB`
- Outfit revision: 2026-08-31 — plain blue denim jeans without a knee pad, charcoal-gray gloves with small white `BB` marks, no side pouches, and one original black multi-pocket front waist apron
- Project files: the same generated edit resized to 1200×675 for both the launch splash and social card
- Project file SHA-256: `e86f9c16a3350ebe8b2e5fb408f04c8af2a574481cb24f7f4ac3ea291fafa774`
- Project usage: included by the project owner under this repository's MIT license
- Structural reference only: the user-supplied `Photo 1.jpg` black waist-apron image and [Lowe's model 106668-BLKXL](https://www.lowes.com/pd/Carhartt-Men-s-Black-Canvas-Waist-Apron-X-Large-Adjustable-Strap-12-ounce-Cotton-Duck-Construction-4-Large-Pockets/5014783235); all brand marks and proprietary plaques were excluded from the original Mr. BB design

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

### Brown hard-hat revision prompt

```text
Use case: precise-object-edit
Asset type: existing 16:9 social-preview card for the browser game Mr. BB — Duct Run
Input image: Image 1 is the edit target.
Primary request: Change only two details on the running worker: (1) remove his entire beard and moustache so his face is completely clean-shaven, with no facial hair and no stubble; (2) recolor his yellow hard hat to a clearly brown construction hard hat, using a rich medium chestnut-brown color with natural darker shadows and lighter brown highlights.
Text (verbatim): Preserve "MR. BB" exactly once and "DUCT RUN" exactly once, perfectly spelled and fully legible in the exact existing positions and styles.
Constraints: Preserve the exact 16:9 composition, worker identity, expression, running pose, anatomy, clothing, orange safety vest, HVAC jobsite, shiny rectangular and spiral ductwork, falling gray mastic bucket, orange mastic splash, lighting, palette, title typography, supporting-copy typography, crop, and overall polished 2D game-illustration style. Do not change anything except facial hair removal and hard-hat color. No new text, logos, signatures, borders, or watermark.
Avoid: beard, moustache, goatee, stubble, yellow hard hat, orange hard hat, red hard hat, misspelled text, duplicate text, extra people, changed background, changed bucket, changed ducts, Mario resemblance.
```

### Current identity revision prompt

```text
Use case: precise-object-edit
Asset type: existing 16:9 social-preview card for the browser game Mr. BB — Duct Run
Input images: Image 1 is the exact edit target
Primary request: Change only the running worker's visible head hair, eyebrows, and facial stubble. Make him visibly bald by removing every dark hair patch and dark hairline visible beneath and behind the brown hard hat, including the temple, side, and rear of the head; replace those areas with naturally shaded bare scalp matching his skin. Change both eyebrows from dark brown/black to clearly light blond/light beige. Add subtle very light blond-to-pale-gray short stubble across the lower cheeks, jawline, and chin, like one or two days of light unshaven growth. Keep the upper lip clean with absolutely no moustache.
Text (verbatim): Preserve "MR. BB" exactly once and "DUCT RUN" exactly once, perfectly spelled, fully legible, and in the exact existing positions and styles.
Subject invariants: Preserve the exact worker identity, friendly expression, eyes, nose, ears, body proportions, running pose, brown hard hat, navy shirt, orange safety vest, gray/blue work pants, gloves, boots, tool belt, and all lighting and shadows.
Scene invariants: Preserve the exact 16:9 composition, HVAC construction site, shiny rectangular and spiral ductwork, falling mastic bucket, orange mastic splash, background, camera angle, crop, color palette, title typography, and supporting-copy typography.
Constraints: Change only hair, eyebrow color, and subtle light stubble. Bald scalp must be visible wherever hair was previously visible. Light stubble is not a beard, goatee, or moustache. No new text, logo, signature, border, or watermark.
Avoid: dark head hair, dark hairline, dark eyebrows, thick beard, full beard, goatee, moustache, dark facial hair, misspelled or changed text, duplicate text, changed construction scene, changed bucket or ducts, changed outfit, changed hard-hat color, extra people, Mario or Nintendo resemblance.
```

### Bucket-to-tools launch-splash revision prompt

```text
Use case: precise-object-edit
Asset type: landscape launch splash and social card for the original web game "Mr. BB — Duct Run"
Image 1: edit target.

Primary edit: Remove the airborne metal bucket on the right side and remove every trace of orange mastic, orange liquid, orange splash, and orange droplets around it. Replace only that airborne bucket-and-liquid area with a lively cluster of loose HVAC construction tools and hardware flying through the air as Mr. BB rushes past: several clearly recognizable silver screws, a compact yellow-and-black tape measure, a screwdriver, small pliers, and one work glove. Arrange the objects with energetic motion trails as if they spilled from a tool pouch, but keep them safely behind and beside him, not striking him.

Character invariants: Preserve Mr. BB's exact identity, face, pose, body, clothing, proportions, expression, and lighting. He is bald under a brown hard hat, with light blond eyebrows and subtle light-blond stubble, no moustache and no full beard.

Scene invariants: Preserve the HVAC construction site, all ducts, perspective, lighting, cinematic 3D cartoon style, framing, colors, and composition. Preserve the existing title text exactly and verbatim: "MR. BB" and "DUCT RUN". Do not change, misspell, duplicate, add, or remove any letters. Keep every area outside the former bucket-and-liquid region unchanged.

Constraints: no bucket anywhere; no orange liquid, mastic, paint, splash, or droplets; no dangerous impact; no extra people; no logos; no trademarks; no watermark.
```

### Exact title-spacing correction prompt

```text
Use case: precise-object-edit
Asset type: landscape launch splash and social card for the original web game "Mr. BB — Duct Run"
Image 1: exact edit target.

Primary edit: Change only the spacing in the large yellow title at upper left. Insert one clearly visible normal word space between the period after "MR" and the first "B" so the title reads exactly and unmistakably "MR. BB", not "MR.BB". Preserve the exact letters, period, 3D lettering style, size, colors, shadows, alignment, and all other spacing. Keep "DUCT RUN" exactly unchanged.

Absolute invariants: Preserve every pixel outside that small title-spacing region as closely as possible. Keep Mr. BB's exact identity, bald scalp, light blond eyebrows, subtle light-blond stubble, clean upper lip with no moustache, no full beard, brown hard hat, face, pose, clothes, lighting, and proportions. Keep the screws, tape measure, screwdriver, pliers, glove, motion trails, HVAC site, ducts, background, perspective, framing, colors, and 16:9 composition unchanged.

Constraints: exact visible text "MR. BB" and "DUCT RUN"; no bucket; no orange mastic, liquid, paint, splash, or droplets; no new objects; no logos; no watermark.
```

### Plain-jeans and front-apron splash revision prompt

```text
Use case: precise-object-edit
Asset type: existing 16:9 landscape launch splash and social card for the original web game "Mr. BB — Duct Run".

Input images:
- Image 1 is the exact artwork edit target.
- Image 2 is a reference ONLY for the general construction, silhouette, pocket arrangement, and centered front-worn placement of a black canvas waist tool apron. Do not copy any brand marks, metal plaques, logos, or exact proprietary details from Image 2.

Primary request: Change only the running worker's jeans, gloves, and tool-storage garment.

Required clothing edits:
1. Replace the worker's current blue work pants and visible gray knee pad/panel with ordinary plain medium-blue denim jeans. Both legs must be continuous normal denim with simple seams and natural folds only. Absolutely no knee pads, knee patches, reinforced knee panels, cargo panels, contrasting knee shapes, or accessories on either knee.
2. Replace the current tan/brown gloves with ordinary fitted work gloves in charcoal black and medium gray. Add a tiny simple white "BB" marking on the back of each glove where visible.
3. Remove every side tool pocket, hip pouch, tool holster, side-mounted bag, and all tools hanging from either hip.
4. Add one original black/charcoal canvas waist tool apron worn across the FRONT of his lower abdomen at the belt line, centered like Image 2. It must be a wide compact front apron with four distinct open front pockets across the belly and only a few small generic tool handles peeking from those FRONT pockets. It must read as one front waist apron, not side pouches. No branded metal plaques and no recognizable third-party logo.

Character invariants: Preserve Mr. BB's exact existing identity and face: completely bald scalp beneath the brown hard hat, light blond/light beige eyebrows, subtle pale-blond short stubble on the lower cheeks/jaw/chin, clean upper lip with no moustache, friendly expression, eye shape, nose, ears, head and body proportions, running pose, anatomy, brown hard hat, navy shirt, orange safety vest, brown boots, lighting, and shadows.

Scene invariants: Preserve the exact 16:9 composition, HVAC construction site, all rectangular and spiral shiny ductwork, perspective, camera angle, cinematic polished cartoon style, lighting, color palette, framing, crop, motion, every flying silver screw, yellow-black tape measure, screwdriver, pliers, loose work glove, and their motion trails. There must remain no bucket and no orange mastic/liquid/paint/splash/droplets.

Text (verbatim): Preserve the large title exactly once as "MR. BB" with a clearly visible normal space after the period, and preserve "DUCT RUN" exactly once. Keep both existing title areas fully legible, correctly spelled, unduplicated, and in their exact current positions and styles. Preserve only the tiny white "BB" markings on the gloves as additional clothing marks. No other text.

Constraints: Change only pants, gloves, and tool storage. Original generic construction apparel only. No Carhartt name or logo; no trademarks; no side pouches; no knee pads; no tan gloves; no new airborne objects; no extra people; no watermark.

Avoid: altered face or identity, dark head hair, dark eyebrows, beard, moustache, gray knee panels, cargo pants, hip holsters, side tool bags, brand marks, metal logo plaques, changed title spacing, misspelled or duplicate title, changed scene, changed ducts, bucket, orange liquid, Mario/Nintendo resemblance, red plumber clothing, cropped title, border, signature.
```
