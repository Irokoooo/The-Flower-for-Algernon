# Floating interactions and diary-led progression

This iteration follows the user's five interaction corrections. Characters remain generated raster planes inside navigable 3D rooms. No new paid asset requests were made.

## Implemented
- Transparent-canvas physical maze box without card frame/header. Story stages progressively add divider structure; cognition still controls mouse behavior. Enlarging retains the world behind the complete box. Orbit, zoom, feeding, empty box and epilogue suspension remain.
- Feathered dialogue/task gradients, center-positioned Charlie thoughts, paper float animation and automatic labeled scene transitions. Last diary stays in the room rather than performing the familiar transition.
- Chinese diary phrase composition: select, drag/reorder or use move buttons, remove, read and save. Three phrase minimum with subject/intent; no fixed answer. Early homophone mistakes are authored vocabulary. Prior saved text is preserved exactly, with memory fragments reusable later.
- Versioned local diary checkpoints and title-screen resume; invalid saves remain untouched. Audio initializes on resume.
- Mainline graph: lab/test → first diary → bakery → machine/social realization → classroom A/B/C → peak diary → Algernon failure/investigation/shared procedure/research/conference → release/decline → last diary → empty room → flowers/final unmodified memory.
- Renderer-to-story hotspot adapter fixes previously ignored book/paper/NPC interactions. Visible-object clicking is occlusion checked; walking remains available. Hands split into left/right UV regions and extend beyond bottom edge to hide the crop.
- Chapter evidence placement is a shared pick-and-place paper interaction with return-to-records and destination choices, plus pointer drag and keyboard/touch buttons. Picking a card alone never satisfies the gate.

## Evidence and limits
Browser smoke reached first diary after book/paper/NPC/test, assembled a Chinese phrase, saved and arrived in bakery. Refresh displayed Resume saved diary and restored bakery. Center thought and transparent enlarged maze visually reviewed. Typecheck/build passed before final evidence-placement integration and are rerun after it.

Later narrative gates are integrated but still use reused room staging. University, conference, research race, flowers and ending need authored spatial staging and human playthrough; do not mark full PRD complete. Music/voice status unchanged: original loop exists, production speech blocked by provider failures. Character paper styling is retained intentionally.

## Next review
Human playtest diary language, readability/motion, pace and mouse interactions. Improve action staging within rooms instead of adding parallel scene-local systems. Follow AGENTS.md ownership and DECISIONS.md; only Lead should operate the shared browser during integration.
