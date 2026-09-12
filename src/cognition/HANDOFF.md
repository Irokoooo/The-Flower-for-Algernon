# Cognition handoff — current

Status: review, 88%. Typecheck and production build pass; existing large-bundle warning remains. Dependencies are installed. No browser session/430px screenshot was verified in this final pass; do not mark visual or interaction acceptance complete.

## Carson integration notes
App currently passes onInspectChange={setMazeOpen}. Callback true on expansion, false on close/Escape/backdrop/suspend/unmount. Keep this as a separate pause reason and combine with task/dialogue/transition pauses. Host owns world input/timers; keep MazeBox mounted and unsuspended while inspecting so the mouse remains interactive. Maze adds no global keyboard handlers. Only the canonical Core CognitionState is consumed.

## Responsive sizing
At <=760px, fixed corner tile 140x158px, canvas 100px high, Inspect target 44px. Secondary controls, label and help hidden. Desktop 240x250px. Expanded narrow modal fills 100dvh and restores controls. Selectors beat legacy App width/height overrides independent of import order. These are verified CSS rules, not a measured browser screenshot.

## Interaction and validation
True Three.js mouse with eyes, tube whiskers and curved tail. Raycast click or Offer grain/Enter starts a local turn/approach/nibble/return sequence, then resumes deterministic movement. No speech or plot mutation. Suspended stops rendering/time and closes inspection; absent mouse preserves empty box. Drag/orbit, zoom .7–1.65, tilt 0–1.15, reset, Escape and local focus trap implemented.

Sampled all route segments against walls including caps: minimum clearance .4275. Typecheck/build and CSS source assertions pass. Final human/browser checklist: 430px tile does not cover hands; tap Inspect fills screen; raycast click visibly feeds and resumes; zoom/orbit/reset; Escape and focus return; world stays paused; suspend closes and absent Algernon leaves empty box. Camera bounds checked in prior pass. Visual polish and feeding naturalness remain pending, not approved production quality.

Graph props unchanged: model, cognition, connectedEdgeIds, onConnect. MazeBox existing props unchanged plus optional onInspectChange(boolean).
