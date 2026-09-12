# User playtest feedback — 2026-09-12

Status: FB-01 image and licensed desk GLBs are integrated, awaiting user review. The user's subsequent request activates FB-02 handwriting, visible drag placement and diary audio. FB-03 physical bread pickup remains deferred. Existing production authorization applies; this record itself grants no additional spending authority.

## FB-01 — A visible psychological-test stimulus
- Current experience shows abstract word nodes instead of something the player can actually examine.
- Add an original generated raster inkblot-like test image, not a reproduction of protected standardized test plates or code-drawn art.
- The same objective image remains present across cognition phases. LOW Charlie cannot yet interpret much of it; later phases change available interpretations and connections, not the underlying picture.
- Graph labels support observing the image; they must not replace it or reveal inaccessible meaning prematurely.
- Owners: Narrative stimulus meaning; Assets illustration; Core/Scene presentation. PRD §11, §32.

## FB-02 — Less fluent early diary and uneven handwriting
- First diary currently feels too literate. Reduce early vocabulary and phrase complexity; increase plausible authored Chinese homophone mistakes.
- Explore errors such as 作/做, 在/再, 以经/已经, 记主/记住 as examples, not a fixed final word list.
- Make letter/character baselines, spacing, rotation and scale uneven, like uncertain handwriting. Preserve readability and reliable hit areas; do not distort player controls.
- Maintain the phase arc: early limited expression → richer language → decline with memory of previously available words. Keep saved player-composed text unchanged.
- Owners: Narrative word bank; diary component presentation. PRD §13.
- Latest request: visibly drag scattered paper fragments onto the page, with pencil audio and saved English Charlie murmurs where production audio is available. Introduce a distinct ascending entry between early and peak writing. NPC prompts must use character names. Functional playtesting remains with the user.

## FB-03 — Physical bread packing
- Current “bag a loaf” button and count are placeholders, not the final interaction.
- Later implement visible bread objects/model, paper bag destination, hand pickup/carry/place response, and progress driven by successful placement instead of generic button increments.
- This modelling/action polish is explicitly deferred for speed. Do not mark the final bakery interaction complete based on the current counter.
- Owners: Scene/Assets/Core integration. PRD §16.

## Validation workflow
The user will play and provide interaction feedback. Agents retain typecheck/build for relevant code edits, but do not run functional interaction tests or browser playthroughs unless requested again. These notes only record requirements; they do not change the running game.

## FB-04 — Object identity and passing test thoughts (activated)
- A test-desk prompt currently leads into the diary; the hovered book/table identity can also be confusing. Keep physical book, diary and test targets distinct, with matching prompts and actions. Re-examining the test during diary writing must not advance or reset the diary stage.
- Replace the rigid two-card test with more simple, tentative observations and passing thoughts. Use varied drifting, fading, returning fragments, soft ink-like gradients and varied typography. The source inkblot image remains unchanged.
- Moving thoughts pause under hover/focus or when selected; important connections remain obtainable. Offer a motion pause and respect reduced-motion settings. Ambient forgotten thoughts do not alter saved progress or impose a time limit.
- Lead/Core routing; Scene raycasts; Cognition shared graph presentation; Narrative original bilingual fragments. No new asset generation required.

## FB-05 — Moving connection targets (activated)
- User rejects animated labels over fixed connection targets. Whole selectable thoughts now move using the same live positions as the connection endpoints. Selection does not stop surrounding thoughts.
- Drag from a thought to another moving thought to connect, with a live thread preview. Existing links follow their endpoints. Pointer release resolves the destination at its current position. Click-click and keyboard selection remain available, along with pause/reduced motion.
- Lead implementation in shared CognitionGraph; other graph presentations retain their existing positions and rules. No functional playtesting run.
