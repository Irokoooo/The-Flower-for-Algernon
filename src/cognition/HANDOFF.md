# Cognition handoff

Status: implemented, awaiting dependency installation, integrated build, and human smoke check.

Core owns CognitionState and CognitionPhase in src/core/types.ts. This module imports/re-exports those canonical types and creates no global state. Lead must add `three` and `@types/three` to the root package; no package/config files were changed here. npm was unavailable in this task environment.

Exports:
- CognitionGraph({ model, cognition, connectedEdgeIds, onConnect, className? }): controlled connection discovery. Click two stimuli; accessible phase/affordance connections emit onConnect(edgeId). Core stores discovered IDs. Inaccessible connections and their meanings are not rendered, including after decline. BAKERY_GRAPH provides original bilingual sample stimuli, unchanged between phases.
- MazeBox({ cognition, algernonPresent?, suspended?, className? }): real Three.js maze with procedural mouse. Mount once outside scene replacement. Defaults to top view; pointer drag/arrows orbit, Home/button reset. Empty box persists with algernonPresent=false. suspended hides it and pauses animation.
- sampleMouse(seconds, phase): deterministic continuous corridor movement with LOW pauses, ASCENDING acceleration, PEAK steady traversal, DECLINE hesitation/backtracking. Phase changes currently restart traversal; polish phase transitions during integration.

Maze uses one WebGL renderer for this persistent widget and disposes all resources on unmount. It is a functional prototype; the shared R3F viewport remains a later optimization. Lead should record this temporary renderer choice in DECISIONS.md. Walls and mouse are procedural placeholders without external artwork. Scene camera listeners must attach to the scene canvas, not global capture events; widget stops bubbling input.

Validation required after dependency installation: typecheck/build; click flour + laughter in LOW; click glance + laughter in ASCENDING; PEAK unlocks third relationship; DECLINE hides higher-level connections; drag/release outside widget; reset; arrows/Home; absent mouse leaves box; suspend/resume; scene camera stays still. Human review needed for emotional readability, movement pace and narrow layouts. No production artwork or final voicing claimed.

Lead dashboard: Cognition review (implementation ready, integration unverified), Graph interactive prototype, Maze functional Three.js prototype, assets procedural placeholders.
