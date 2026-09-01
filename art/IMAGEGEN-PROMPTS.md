# Image generation prompts

All assets were generated as original artwork for Mr. BB. No Nintendo or Mario assets were used.

## `assets/mr-bb-v2.png`

Initial mode: built-in `precise-object-edit`
Current revision modes: built-in `precise-object-edit`, built-in `background-extraction`, then local connected-background alpha cleanup with Node/ffmpeg (no generative redraw)

- Generated: 2026-08-31 with OpenAI image generation through Codex
- Revised: 2026-08-31 — bald head, light eyebrows, and subtle light stubble
- Revised again: 2026-08-31 — plain blue denim jeans without knee pads, charcoal-gray gloves with small white `BB` marks, no side pouches, and one original black four-pocket tool apron centered across the front of the waist
- Eye/shirt/boot revision: 2026-08-31 — cool gray-blue irises, a plain black short-sleeve crew-neck T-shirt, and brown leather boot toes with no black caps
- Project file: the latest generated cutout received the documented connected-background alpha cleanup, was mechanically scaled to the approved 375×436 character footprint, then padded to 488×446 and bottom-anchored at pixel y=437 in the LittleJS texture
- Project file SHA-256: `d4343778a84edf6b339918b4afedbe46d1b0d1b1ff099010c6c7abb81f042de9`
- Project usage: included by the project owner under this repository's MIT license
- Structural reference only: the user-supplied `Photo 1.jpg` black waist-apron image and [Lowe's model 106668-BLKXL](https://www.lowes.com/pd/Carhartt-Men-s-Black-Canvas-Waist-Apron-X-Large-Adjustable-Strap-12-ounce-Cotton-Duck-Construction-4-Large-Pockets/5014783235); all brand marks and proprietary plaques were excluded from the original Mr. BB design

The latest identity correction below supersedes the clean-shaven and dark-hair details in the original proportion prompt. The final eye/shirt/boot correction supersedes every older brown-eye and blue/navy-shirt detail while preserving the approved splash boots.

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

### Gray-blue eyes, black T-shirt, and brown-boots revision prompt

```text
Use case: precise-object-edit
Asset type: transparent 2D game character sprite/cutout for the original Mr. BB HVAC platformer.

Input images:
- Image 1 is the exact edit target.

Primary request: Make exactly three targeted appearance corrections to Mr. BB and leave everything else unchanged.

Required edits:
1. EYES: Change both visible irises from warm brown/amber to a clearly cool, desaturated light gray-blue. Preserve the exact eye shapes, black pupils, white sclera, catchlights, eyelids, gaze direction, and expression. The irises must read as gray-blue, not brown, hazel, green, or saturated royal blue.
2. SHIRT: Replace the visible blue collared long-sleeve work shirt with a plain solid black short-sleeve crew-neck T-shirt worn underneath the existing orange/yellow safety vest. Remove every blue shirt area, collar, placket, and shirt buttons. The T-shirt sleeves must end above the elbows so both forearms remain naturally bare. Use black fabric with subtle charcoal highlights only for readable folds; no logo, print, pocket, or text.
3. GAME BOOTS: Remove the black toe caps from both boots. Make the entire leather upper of each boot, including each toe and forefoot, a consistent rich chestnut-brown leather matching the rest of the boot. Keep the yellow laces. A thin dark-brown rugged outsole may remain only under the boot, but no black protective cap, black panel, or black material may wrap over either toe. The boots must read simply as brown work boots.

Absolute invariants: Preserve the exact same friendly Mr. BB identity, completely bald scalp, light blond/beige eyebrows, subtle pale-blond short stubble, clean upper lip with no moustache, face, nose, ears, oversized cartoon head, compact body, right-facing running pose, anatomy, proportions, scale, exact crop and bottom anchor, brown hard hat, orange/yellow safety vest, plain blue denim jeans without knee pads or panels, charcoal-gray gloves with small white "BB" markings, black four-pocket front waist apron with tools, no side pouches, outlines, lighting, and transparent padding.

Style/medium: preserve the exact polished original 2D cartoon platform-game sprite style and bold readable outline.

Background: preserve genuine transparent alpha. Keep the full uncropped character and all existing padding.

Text (verbatim): preserve only the existing small white "BB" on the gloves. No other text.

Constraints: change only iris color, shirt garment/color/sleeve length, and boot toe color/material. No brand marks; no new objects; no logo; no watermark.

Avoid: brown or amber irises, blue shirt, navy shirt, collar, shirt buttons, long sleeves, black toe caps, black toe panels, black boot uppers, altered face, altered vest, altered apron, altered jeans, side pouches, knee pads, tan gloves, dark head hair, dark eyebrows, beard, moustache, changed pose, changed proportions, cropped body, opaque background, checkerboard background, Mario/Nintendo resemblance, extra limbs.
```

The service again returned a baked checkerboard rather than alpha. A deterministic connected-background cleanup removed only the connected light neutral backdrop; the resulting character was then mechanically normalized to the approved footprint without a generative redraw.

## Four-frame Mr. BB run cycle

Mode: built-in `precise-object-edit` for every accepted frame, followed by deterministic local connected-background alpha cleanup and common mechanical normalization with `scripts/build-run-sprites.mjs`.

- Generated: 2026-08-31 with OpenAI image generation through Codex
- Frame order: contact A → passing A → contact B → passing B
- Runtime behavior: traveled-distance animation only while grounded and moving; the approved `assets/mr-bb-v2.png` remains the idle, crouch, airborne, and non-playing texture
- Project geometry: each frame is 488×446 RGBA; all four source canvases received one shared 458/1254 scale; only small documented horizontal root-alignment offsets were applied; no frame was generatively redrawn during cleanup
- Alpha cleanup: only light neutral pixels connected to a source-canvas edge were removed; the remaining character pixels were encoded to RGBA and normalized with Lanczos scaling
- Original identity/style reference for contact A and passing A: `assets/mr-bb-v2.png`
- Final contact B input: accepted contact A ImageGen source `exec-63f0b280-9f97-4ced-9ec2-0b12392eab17.png`
- Final passing B intermediate/input: `/Users/assistant/.codex/generated_images/01a058d1-07d8-70b2-afb0-1fd34fb31a16/exec-258023bd-180b-4a3a-9e4c-5533caf0b0c7.png`
- Accepted ImageGen sources and project hashes:
  - contact A source `exec-63f0b280-9f97-4ced-9ec2-0b12392eab17.png` → SHA-256 `4d884c963922662a322e2f4bd600ff97bd6f8ce9efae95b144a92b1c81fa5250`
  - passing A source `exec-5620a25f-0b4a-43d6-8036-04223dcd7958.png` → SHA-256 `df8c53f21bc197cd31112e8ba1a33a9281c4d88d37243047f92b0de92fbcb638`
  - contact B source `exec-5288da84-6637-489c-9761-2d22cee04032.png` → SHA-256 `7c3a868cecabee60d3b3b42e491993c2f580da101fe134c074a331c396959114`
  - passing B source `exec-95312985-df5f-4a62-b9a3-164e85e8cda8.png` → SHA-256 `569871bd8ef90cf6fd7701ee35d9eb1f65f1759b515a0e22a8028a267c2fbd8b`

### Contact A prompt

~~~~text
Use case: precise-object-edit
Asset type: one transparent production frame for the original Mr. BB 2D platform-game run cycle — FRAME 1 OF 4, CONTACT A.

Input image:
- Image 1 is the exact identity, outfit, proportions, scale, rendering-style, lighting, and camera-angle anchor. Change only the full-body running pose.

Primary request: Redraw Mr. BB in a clear right-facing CONTACT running pose. The boot at SCREEN RIGHT reaches well forward for a controlled heel strike on the virtual ground line. The other boot extends well behind toward SCREEN LEFT, lifting from the toe. Drive the OPPOSITE arm forward with its bent glove near SCREEN RIGHT while the other bent arm drives back toward SCREEN LEFT. Use natural contralateral running biomechanics, flexed knees, elbows around 85 degrees, and an 8-degree forward torso lean. Make the silhouette energetic and unmistakably different from a passing or airborne pose.

Alignment: preserve the same nominal character scale as Image 1. Keep the head, hard hat, torso, and hip root stable and centered. Put the lowest boot sole at the same bottom ground baseline as Image 1. Preserve generous padding and the complete uncropped character.

Absolute appearance invariants: same friendly original Mr. BB face and identity; completely bald scalp beneath the brown hard hat; cool gray-blue irises; light blond/beige eyebrows; subtle pale-blond short stubble; clean upper lip with no moustache; oversized cartoon head and compact body; plain solid-black short-sleeve crew-neck T-shirt without collar, placket, buttons, or blue fabric; orange/yellow safety vest; plain medium-blue jeans without knee pads or panels; fitted charcoal-gray/black gloves with tiny white "BB" where naturally visible; one black four-pocket front waist apron centered across the belly with the same generic tool handles and no side pouches; rich chestnut-brown leather across both entire boot uppers/toes, yellow laces, dark outsole only under the boots, no black toe caps.

Style/medium: exact polished original 2D cartoon platform-game sprite style from Image 1, clean bold outlines, smooth dimensional shading, high contrast, original non-infringing mascot design.

Composition/framing: exactly one full-body character, facing right, same three-quarter side camera, centered on a square canvas, no motion blur.

Background: genuine transparent alpha. No baked checkerboard, white/gray background, floor, shadow, glow, prop, or scenery.

Text (verbatim): only the tiny white "BB" glove mark where visible. No other text.

Constraints: one anatomically complete character; exactly two arms, two hands, two legs, two boots; change only the pose; no logos or watermark.

Avoid: duplicated/missing limbs, same-side arm-leg gait, ambiguous fused legs, changing head or torso size, outfit flicker, dark hair, dark eyebrows, beard, moustache, brown eyes, blue shirt, collar, buttons, long sleeves, knee pads, side pouches, tan gloves, black boot toes, red plumber clothing, blue overalls, white gloves, lettered cap, Mario/Nintendo resemblance, crop, checkerboard background.
~~~~

### Passing A prompt

~~~~text
Use case: precise-object-edit
Asset type: one transparent production frame for the original Mr. BB 2D platform-game run cycle — FRAME 2 OF 4, PASSING A.

Input image:
- Image 1 is the exact identity, outfit, proportions, rendering style, lighting, and camera-angle anchor. Change only the full-body running pose.

Primary request: Redraw Mr. BB in a clearly readable right-facing PASSING running pose. His weight-bearing boot is directly beneath the hips with the knee softly bent and the sole planted on the virtual ground. The other thigh swings forward toward SCREEN RIGHT with the knee raised high and the lower leg folded back, so the two legs form a compact, unmistakable passing silhouette rather than a wide split. Arms counter-swing naturally: the arm opposite the raised forward knee drives forward, while the other bent arm pulls behind the torso. Elbows remain bent around 85 degrees. Add a restrained 8-degree forward torso lean. This must look like the middle of a real run stride and be visibly different from a contact pose.

Alignment: preserve the same nominal character scale as Image 1. Keep the head, hard hat, torso, and hip root stable and centered. Put the support-boot sole on the same bottom ground baseline as Image 1. Preserve generous padding and the complete uncropped character.

Absolute appearance invariants: same friendly original Mr. BB face and identity; completely bald scalp beneath the brown hard hat; cool gray-blue irises; light blond/beige eyebrows; subtle pale-blond short stubble; clean upper lip with no moustache; oversized cartoon head and compact body; plain solid-black short-sleeve crew-neck T-shirt without collar, placket, buttons, or blue fabric; orange/yellow safety vest; plain medium-blue jeans without knee pads or panels; fitted charcoal-gray/black gloves with tiny white "BB" where naturally visible; one black four-pocket front waist apron centered across the belly with the same generic tool handles and no side pouches; rich chestnut-brown leather across both entire boot uppers/toes, yellow laces, dark outsole only under the boots, no black toe caps.

Style/medium: exact polished original 2D cartoon platform-game sprite style from Image 1, clean bold outlines, smooth dimensional shading, high contrast, original non-infringing mascot design.

Composition/framing: exactly one full-body character, facing right, same three-quarter side camera, centered on a square canvas, no motion blur.
Background: genuine transparent alpha. No baked checkerboard, white/gray background, floor, shadow, glow, prop, or scenery.
Text (verbatim): only the tiny white "BB" glove mark where visible. No other text.
Constraints: one anatomically complete character; exactly two arms, two hands, two legs, two boots; change only the pose; no logos or watermark.
Avoid: duplicated/missing limbs, same-side arm-leg gait, wide contact stride, ambiguous fused legs, changing head or torso size, outfit flicker, hair, dark eyebrows, beard, moustache, brown eyes, blue shirt, collar, buttons, long sleeves, knee pads, side pouches, tan gloves, black boot toes, red plumber clothing, blue overalls, white gloves, lettered cap, resemblance to any copyrighted game character, crop, checkerboard background.
~~~~

### Superseded contact B intermediary prompt

~~~~text
Use case: precise-object-edit
Asset type: corrected production run-cycle frame for the original Mr. BB game — CONTACT B.

Edit Image 1. Keep the exact character, face, outfit, right-facing direction, leg pose, scale, camera angle, lighting, and framing. Make one essential biomechanical correction: COMPLETELY REVERSE THE TWO ARM POSITIONS.

Required arms:
- The arm and glove currently on SCREEN LEFT must swing FORWARD across the side of the chest toward SCREEN RIGHT, elbow bent, with its fist clearly visible ahead of the torso.
- The arm and glove currently on SCREEN RIGHT must swing BACK behind the torso toward SCREEN LEFT, elbow bent, with its fist beside or slightly behind the rear hip.
- Do not leave the front raised fist on screen right. The new silhouette must visibly show the opposite arm phase from Image 1.
- Preserve exactly two complete arms and two complete hands. Natural contralateral running biomechanics.

Keep the current wide contact leg pose: the near leg reaches forward toward SCREEN RIGHT for heel contact; the far leg extends back toward SCREEN LEFT. Keep the head, torso, and hip root steady.

Absolute appearance invariants: friendly original Mr. BB; completely bald; brown hard hat; cool gray-blue eyes; light eyebrows and pale-blond short stubble; no moustache; large cartoon head; black short-sleeve crew-neck T-shirt; orange/yellow safety vest; plain blue jeans without knee pads; charcoal-gray/black gloves with tiny white "BB"; centered black four-pocket front waist apron, no side pouches; chestnut-brown boot uppers and toes with yellow laces, dark outsole only beneath, no black toe caps.

Background: genuine transparent alpha, no baked checkerboard, floor, shadow, glow, props, scenery, labels, borders, logo, or watermark.
Composition: one full uncropped right-facing character centered on a square canvas with generous padding.
Style: preserve the exact polished original 2D platform-game cartoon style. Original non-infringing mascot; no resemblance to copyrighted game characters.
Avoid: keeping the same arm positions, both fists in front, both arms back, same-side arm-leg gait, extra/duplicate/missing limbs, fused anatomy, identity/outfit changes, hair, beard, moustache, brown eyes, blue shirt, knee pads, side bags, tan gloves, black toe caps, crop, checkerboard background.
~~~~

### Superseded passing B intermediary prompt

~~~~text
Use case: precise-object-edit
Asset type: corrected production run-cycle frame for the original Mr. BB game — PASSING B / LIGHT FLIGHT.

Edit Image 1. Keep the exact character, face, outfit, right-facing direction, leg pose, scale, camera angle, lighting, and framing. Make one essential biomechanical correction: COMPLETELY REVERSE THE TWO ARM POSITIONS.

Required arms:
- The arm and glove currently on SCREEN LEFT must swing FORWARD across the side of the chest toward SCREEN RIGHT, elbow bent, with its fist clearly visible ahead of the torso.
- The arm and glove currently on SCREEN RIGHT must swing BACK behind the torso toward SCREEN LEFT, elbow bent, with its fist beside or slightly behind the rear hip.
- Do not leave the front raised fist on screen right. The new silhouette must visibly show the opposite arm phase from Image 1.
- Preserve exactly two complete arms and two complete hands. Natural contralateral running biomechanics.

Keep the current running leg pose and make it a restrained light-flight recovery: near knee forward toward SCREEN RIGHT, far leg folded behind toward SCREEN LEFT, both boots only slightly above the virtual baseline. Keep the head, torso, and hip root steady.

Absolute appearance invariants: friendly original Mr. BB; completely bald; brown hard hat; cool gray-blue eyes; light eyebrows and pale-blond short stubble; no moustache; large cartoon head; black short-sleeve crew-neck T-shirt; orange/yellow safety vest; plain blue jeans without knee pads; charcoal-gray/black gloves with tiny white "BB"; centered black four-pocket front waist apron, no side pouches; chestnut-brown boot uppers and toes with yellow laces, dark outsole only beneath, no black toe caps.

Background: genuine transparent alpha, no baked checkerboard, floor, shadow, glow, props, scenery, labels, borders, logo, or watermark.
Composition: one full uncropped right-facing character centered on a square canvas with generous padding.
Style: preserve the exact polished original 2D platform-game cartoon style. Original non-infringing mascot; no resemblance to copyrighted game characters.
Avoid: keeping the same arm positions, both fists in front, both arms back, same-side arm-leg gait, extra/duplicate/missing limbs, fused anatomy, identity/outfit changes, hair, beard, moustache, brown eyes, blue shirt, knee pads, side bags, tan gloves, black toe caps, high jump, crop, checkerboard background.
~~~~

The two intermediary B frames above were rejected during final phone-scale review because their screen silhouettes still read too similarly to the A half-cycle. They are not shipped.

### Final opposite contact B prompt

~~~~text
Use case: precise-object-edit
Asset type: production replacement for FRAME 3 OF 4 of the original Mr. BB game run cycle — OPPOSITE CONTACT B.

Edit Image 1 as a strict opposite-stride partner to it. Preserve the exact Mr. BB head, hard hat, face, expression, torso, vest, shirt, waist apron, nominal scale, lighting, camera angle, canvas, head center, hip/root position, and ground baseline. Do not flip the whole character and do not move or resize the upper body.

Essential opposite-limb pose:
- The NEAR/FOREGROUND LEG must now extend BACK toward SCREEN LEFT, large and clearly visible in front, pushing off its toe.
- The FAR/BACKGROUND LEG must reach FORWARD toward SCREEN RIGHT for heel contact, visibly narrower and about 12 percent darker blue, passing behind at the hip so it is unmistakably the other leg.
- The NEAR/FOREGROUND ARM must now drive FORWARD toward SCREEN RIGHT, but LOW at waist/lower-rib height with the large glove clearly ahead of the torso.
- The FAR/BACKGROUND ARM must pull BACK toward SCREEN LEFT, HIGHER near the rear ribs, slightly smaller and darker, clearly behind the torso.
- This is natural contralateral running: the near leg trails while the near arm drives forward; the far leg leads while the far arm trails.
- Make the two glove positions vertically and horizontally unmistakably different from Image 1: forward glove low and extended; rear glove high and tucked.
- Preserve exactly two arms, two hands, two legs, and two boots.

Motion: wide opposite contact stride, flexed knees, elbows 80–95 degrees, restrained 8-degree forward torso lean, no motion blur. The silhouette must read as the second footfall at about 100 pixels tall, not as the same Image 1 stride repeated.

Absolute appearance invariants: same friendly original Mr. BB; completely bald scalp beneath the brown hard hat; cool gray-blue irises; light blond/beige eyebrows; subtle pale-blond short stubble; clean upper lip with no moustache; oversized cartoon head and compact body; plain solid-black short-sleeve crew-neck T-shirt with no collar, placket, buttons, or blue fabric; orange/yellow safety vest; plain medium-blue jeans with no knee pads or panels; fitted charcoal-gray/black gloves with tiny white "BB" where naturally visible; one centered black four-pocket front waist apron with the same generic tool handles and no side pouches; chestnut-brown leather across every boot upper and toe, yellow laces, dark outsole only beneath, no black toe caps.

Style: preserve the exact polished original 2D platform-game cartoon style, bold clean outline, smooth dimensional shading, high contrast, original non-infringing mascot.
Composition: exactly one complete uncropped character facing right, generous padding.
Background: genuine transparent alpha; no baked checkerboard, floor, shadow, glow, scenery, label, border, logo, or watermark.
Avoid: retaining Image 1's near/far limb assignment, both frames looking identical, same glove heights, same-side arm-leg gait, fused or duplicated limbs, changing head/torso size or position, outfit flicker, hair, beard, moustache, brown eyes, blue shirt, knee pads, side bags, tan gloves, black toe caps, red plumber clothes, white gloves, lettered cap, resemblance to any copyrighted game character, crop, checkerboard background.
~~~~

### Final passing B heel-kick prompt

~~~~text
Use case: precise-object-edit
Asset type: final leg-pose correction for FRAME 4 OF 4 of the original Mr. BB run cycle — REAR HEEL-KICK PASSING B.

Edit Image 1. Preserve the character's exact head, hard hat, face, identity, expression, torso, vest, black T-shirt, waist apron, BOTH ARMS AND BOTH GLOVES IN THEIR CURRENT POSITIONS, nominal scale, lighting, camera angle, canvas, head center, and hip/root position. Change only the two leg poses below.

Required clearly different leg silhouette:
- The NEAR/FOREGROUND LEG must fold sharply BACK toward SCREEN LEFT in a classic running heel-kick recovery. Its knee points down/back and its brown boot rises high behind the body, with the heel approaching the rear of the jeans/apron. This bent rear leg must be bright, large, and completely readable.
- The FAR/BACKGROUND LEG must extend DOWN beneath and slightly FORWARD of the hips toward SCREEN RIGHT, much straighter than in Image 1, with its brown boot close to the virtual ground baseline. Make this far leg slightly narrower and about 12 percent darker blue.
- Remove Image 1's high forward-knee silhouette. The new pose must not show a knee lifted in front of the waist.
- Keep the two legs clearly separated at 100-pixel game size with no fused shapes.
- Exactly two legs and two boots.

This should look like the opposite passing/recovery beat between footfalls: one heel kicks high behind while the other leg reaches down under the body. It must be unmistakably different from the other passing frame, which has a high forward knee.

Absolute appearance invariants: same friendly original Mr. BB; completely bald; brown hard hat; cool gray-blue eyes; light eyebrows; pale-blond short stubble; no moustache; plain black short-sleeve crew-neck T-shirt; orange/yellow safety vest; plain medium-blue jeans without knee pads; charcoal-gray/black gloves with tiny white "BB"; centered black four-pocket front waist apron, no side pouches; chestnut-brown leather across every boot upper and toe, yellow laces, dark outsole only beneath, no black toe caps.

Background: genuine transparent alpha, no baked checkerboard, floor, shadow, glow, props, scenery, labels, border, logo, or watermark.
Composition: one complete uncropped right-facing character with generous padding.
Style: preserve the polished original 2D platform-game cartoon style, original non-infringing mascot.
Avoid: changing the arms, gloves, head, torso, face, outfit, root, or scale; high forward knee; both knees forward; straight rear leg; fused/duplicate/missing limbs; hair, beard, moustache, brown eyes, blue shirt, knee pads, side bags, tan gloves, black toe caps, red plumber clothing, white gloves, lettered cap, resemblance to copyrighted game characters, crop, checkerboard background.
~~~~

The generator again returned RGB files with a baked light checkerboard. The accepted frames were therefore passed through the repository's deterministic connected-edge cleanup script. The script applies one shared source-to-output scale and explicit root-alignment offsets; it does not invent, repaint, or regenerate character pixels. Final alpha bounds end at source y=437 for every frame; detected hard-hat centers are x=270, 270.5, 267, and 267, keeping upper-body drift below one runtime pixel.

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
- Eye/shirt revision: 2026-08-31 — cool gray-blue irises and a black short-sleeve shirt; the approved splash boots were preserved
- Crew-neck correction: 2026-08-31 — full-splash attempts removed most blue fabric but retained work-shirt details; a final close-up ImageGen edit removed the collar, placket, and buttons and completed the plain black short-sleeve crew-neck T-shirt
- Project files: the final ImageGen close-up was resized to the source crop's exact 160×160 geometry and feather-blended only into the shirt region at (670, 270); the completed 1200×675 splash and social card are byte-identical
- Mechanical composite: pre-composite full-splash SHA-256 `8c1216564291d92cc9f2644c888383f96606836b3dc9c2bba753f893f3dfd200`; 160×160 patch; 160×160 grayscale mask with a white `118×120` rectangle at `(24, 12)` on black, Gaussian blur sigma `6`; overlay at `(670, 270)`; final output forced to RGB24
- Final close-up ImageGen source: `/Users/assistant/.codex/generated_images/01a058d1-07d8-70b2-afb0-1fd34fb31a16/exec-1f436d51-d215-424b-a3c1-b067caf7d2ec.png`
- Project file SHA-256: `32ac600f239f9a420eeb2be98566c7d967e4ef3d1794145cd57af152fd8ed7a3`
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

### Gray-blue eyes and black T-shirt splash revision prompt

```text
Use case: precise-object-edit
Asset type: existing 16:9 landscape launch splash and social card for the original web game "Mr. BB — Duct Run".

Input images:
- Image 1 is the exact artwork edit target.

Primary request: Make exactly two targeted appearance corrections to the running worker and leave everything else unchanged.

Required edits:
1. EYES: Change both visible irises from warm brown/amber to a clearly cool, desaturated light gray-blue. Preserve the exact eye shapes, black pupils, white sclera, catchlights, eyelids, gaze direction, and friendly expression. The irises must read as gray-blue, not brown, hazel, green, or saturated royal blue.
2. SHIRT: Replace the visible navy/blue collared shirt with a plain solid black short-sleeve crew-neck T-shirt worn underneath the existing orange safety vest. Remove every blue shirt area, collar, placket, and shirt buttons. The T-shirt sleeves must end above the elbows so both forearms remain naturally bare. Use black fabric with subtle charcoal highlights only for folds and lighting; no logo, print, pocket, or text.

Critical boot invariant: The boots in this splash are already correct. Preserve both existing brown work boots exactly as drawn, including their shape, brown leather, sole, perspective, lighting, and running position. Do not redesign, recolor, simplify, or move the splash boots.

Character invariants: Preserve Mr. BB's exact identity, completely bald scalp under the brown hard hat, light blond/beige eyebrows, subtle pale-blond short stubble, clean upper lip with no moustache, face, nose, ears, body proportions, running pose, anatomy, brown hard hat, orange safety vest, plain blue denim jeans without knee pads, charcoal-gray gloves with small white "BB" marks, black multi-pocket front waist apron with tools, no side pouches, lighting, and shadows.

Scene invariants: Preserve the exact 16:9 composition, HVAC construction site, every rectangular and spiral duct, perspective, camera angle, cinematic polished cartoon style, lighting, color palette, framing, crop, motion, every flying silver screw, tape measure, screwdriver, pliers, wrench, loose work glove, and motion trail. Keep no bucket and no orange mastic/liquid/paint/splash/droplets.

Text (verbatim): Preserve the large title exactly once as "MR. BB" with a clearly visible normal space after the period, and preserve "DUCT RUN" exactly once. Keep both title areas fully legible, correctly spelled, unduplicated, and in their exact current positions and styles. Preserve only the existing tiny white "BB" markings on the worn gloves as additional clothing marks. No other text.

Constraints: change only iris color and the shirt garment/color/sleeve details. No new objects; no extra people; no logos; no trademarks; no watermark.

Avoid: brown or amber irises, blue or navy shirt, collar, shirt buttons, long sleeves, altered boots, black toe-cap edits on the splash boots, altered face, altered vest, altered apron, altered jeans, changed title spacing, misspelled or duplicate title, changed scene or ducts, bucket, orange liquid, Mario/Nintendo resemblance, cropped title, border, signature.
```

### First crew-neck correction prompt

```text
Use case: precise-object-edit
Asset type: existing 16:9 landscape launch splash and social card for the original web game "Mr. BB — Duct Run".

Input image:
- Image 1 is the exact artwork edit target.

Primary request: Correct ONLY the construction worker's black shirt neckline and front. It is currently a black collared polo/work shirt. Convert it into a plain solid-black SHORT-SLEEVE CREW-NECK T-SHIRT.

Required shirt correction:
- Completely remove both collar points and every trace of a folded collar.
- Completely remove the vertical button placket, seam line, opening, and all shirt buttons.
- Replace that area with one simple continuous black T-shirt chest and a smooth round crew neckline around the base of the neck.
- Keep both short sleeves ending above the elbows and both forearms bare.
- Keep the fabric black, with subtle charcoal highlights only for natural folds.
- No pocket, logo, print, zipper, V-neck, polo collar, dress-shirt collar, placket, or buttons.

Absolute pixel-preservation intent: Leave everything outside the black-shirt region unchanged as closely as possible.

Character invariants: Preserve the exact same Mr. BB identity, clearly cool gray-blue irises, eye shapes, pupils, catchlights, completely bald scalp beneath the brown hard hat, light blond/beige eyebrows, subtle pale-blond stubble, clean upper lip with no moustache, face, expression, nose, ears, head/body proportions, running pose, anatomy, brown hard hat, orange safety vest, plain blue jeans, charcoal gloves with small white "BB", centered black front waist apron and tools, no side pouches, skin, lighting, and shadows.

Critical boot invariant: Preserve both existing brown work boots exactly as currently drawn. Do not change their brown leather, toes, soles, shape, position, perspective, color, lighting, or detail.

Scene invariants: Preserve the exact 16:9 composition, HVAC construction site, every rectangular and spiral duct, background, perspective, camera angle, framing, crop, lighting, palette, every flying screw, tape measure, screwdriver, pliers, wrench, loose glove, and motion trail. Keep no bucket and no orange mastic/liquid/paint/splash/droplets.

Text (verbatim): Preserve the title exactly once as "MR. BB" with a visible normal space after the period, and "DUCT RUN" exactly once. Preserve the tiny white "BB" glove markings. No other text. Do not alter typography, spelling, position, scale, or spacing.

Constraints: make only the collar/placket/button-to-crew-neck-T-shirt correction; no new objects, extra people, logos, trademarks, signature, border, or watermark.

Avoid: any collar, collar points, polo shirt, work-shirt collar, dress-shirt collar, button placket, front buttons, blue or navy shirt, V-neck, altered eyes, brown or amber irises, altered boots, black toe-cap redesign, altered face, altered pose, changed title, changed tools, changed ducts, bucket, orange liquid, Mario/Nintendo resemblance.
```

This pass removed the folded collar but left tiny button/placket details. The final pass below removed those residual details.

### Second full-splash crew-neck and button-removal prompt

```text
Use case: precise-object-edit
Asset type: existing 16:9 Mr. BB game splash artwork.

Input image:
- Image 1 is the exact edit target.

Edit ONLY the small visible black shirt area on the worker's upper chest and neckline. The current image still contains tiny circular buttons and a vertical center placket/seam. DELETE ALL OF THEM.

Required final shirt:
- A plain solid-black short-sleeve CREW-NECK T-SHIRT.
- One smooth, continuous, uninterrupted black fabric surface on the chest.
- One simple round ribbed crew neckline at the base of the neck.
- Absolutely ZERO buttons: remove every tiny black or colored button dot from the chest.
- Absolutely ZERO vertical placket, opening, zipper, center seam, polo construction, collar, collar points, lapels, pocket, logo, or print.
- Keep sleeves short above both elbows and forearms bare.
- Natural charcoal highlights may describe folds, but must not resemble buttons, seams, a placket, or an opening.

Change nothing else. Preserve every other image element exactly as closely as possible: cool gray-blue irises; bald scalp; light brows; pale stubble; no moustache; brown hard hat; face/expression; orange vest; blue jeans; dark BB gloves; centered black front apron; both existing brown boots; running pose; all ducts; all tools and screws; lighting; composition; crop.

Text (verbatim): Keep "MR. BB" exactly once with its visible space, and "DUCT RUN" exactly once. Do not change any title letter, punctuation, spacing, typography, size, or position.

Keep no bucket and no orange mastic/liquid/paint/splash/droplets. No new objects, people, logos, signature, border, or watermark.

Avoid above all: shirt buttons, button dots, placket, vertical shirt opening, collar, polo shirt, work shirt, dress shirt, V-neck, navy/blue shirt, altered boots, altered eyes, changed title.
```

The full-splash edit still retained faint work-shirt details at high magnification. The final accepted close-up edit below was performed on a 160×160 crop from (670, 270), enlarged to 1024×1024 for ImageGen. Its corrected shirt region was mechanically resized back to 160×160 and feather-blended into that exact location. Pixels outside the feathered local patch came from the approved full splash.

### Accepted close-up crew-neck correction prompt

```text
Use case: precise localized object removal / inpainting
Asset type: square close-up crop from an existing Mr. BB game splash.

Image 1 is the exact edit target. It is a close-up of the worker's neck, black shirt, orange safety vest, glove, and tool apron.

Primary request: Convert ONLY the visible black collared/buttoned shirt details into a plain black crew-neck T-shirt. This close-up clearly shows two folded triangular black collar points beside the neck, a faint vertical center placket, and three small tan/brown buttons stacked down the chest. Remove ALL of those specific details.

Required edit:
- Erase the left folded collar point completely.
- Erase the right folded collar point completely.
- Erase all three tan/brown circular buttons completely.
- Erase the full vertical center placket/opening/seam completely.
- Reconstruct the area as one smooth uninterrupted field of plain black T-shirt fabric.
- Add/retain a simple round crew-neck edge that curves naturally and continuously around the base of the worker's neck.
- Keep the T-shirt opaque black with only broad subtle charcoal shading for fabric volume.
- No small circular marks, dots, snaps, holes, buttons, rivets, fasteners, seam, placket, opening, zipper, collar, collar points, lapels, V-neck, pocket, logo, or print anywhere on the black shirt.

STRICT preservation: Keep the exact crop dimensions and framing. Preserve the worker's skin/neck/chin, pale stubble, orange safety vest and reflective stripes, black sleeve areas, dark glove with white BB, front apron/tools, background, lighting, pose, and every pixel outside the shirt neckline/chest as closely as possible.

No new text or objects. No blue/navy fabric. No watermark.

Success criterion: the visible black garment must unmistakably be a plain short-sleeve round crew-neck T-shirt, like a basic unbuttoned undershirt, with perfectly uninterrupted black fabric down the center.
```
