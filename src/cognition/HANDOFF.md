# Lead / Carson: floating maze integration

Current contract: MazeBox({ cognition, storyStage = 0, algernonPresent = true, suspended = false, className?, onInspectChange? }). storyStage is a finite integer clamped 0..4 (invalid values =>0), authored independently of cognition.phase. Stages 0..3 progressively expose route-safe dividers; stage 4 adds physical joinery and feet. Decline never automatically removes geometry or the empty box.

onInspectChange(true) pauses host world while inspection remains active; false on close/Escape/backdrop/suspend/unmount. Host must combine pause reasons. No global keyboard handler. Lead owns removal of competing App maze size overrides; do not size this component as a card.

Presentation: transparent WebGL canvas and physical timber planks/base/rim, no painted textures, no background plane, no card/header/frame. Tiny floating Inspect/Close and inspection controls. Desktop 250x260; narrow 150x166; expanded transparent scrim and large object. Default/reset tilt .30 rad with slight azimuth to expose thickness; arrows/drag orbit; .7..1.15 zoom with bounding-sphere full-box fit. Mouse raycast feeding/nibble/return remains local, no human voice/plot changes.

Validation: typecheck and production build passed (existing bundle warning). Focused five-stage sampled corridor clearance .4275 including caps; camera bounding-sphere fit passed at narrow/wide aspects and zoom endpoints. No browser screenshot/feeding naturalness approval this pass. Status review 88%, human review pending. Graph untouched.

Latest readability revision: initial stage0 now has THREE dividers, stages1–3 add one safe divider each (six total); stage4 joinery/feet. Floor uses subdued neighboring dark timber colors; white body widened for small-scale contrast. Narrow canvas footprint190x206. Typecheck/build and all-stage route clearance .4275 passed. CUA reports no available browsers, so screenshot and expanded full-box visual confirmation remain pending.
