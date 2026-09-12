# Decision Log

- 2026-09-12 user playtest follow-up: record test-stimulus, early Chinese spelling/handwriting and physical bread-packing improvements in docs/PLAYTEST_FEEDBACK.md; defer their polish while focusing on core interactions. User owns functional playtesting; agents run typecheck/build for code changes only, no browser playthroughs unless requested again.

- ADR-018 (supersedes prototype presentation): User rejected SVG characters and environment art. Generate raster literary illustrations; compose them in genuinely explorable 3D rooms. Charlie hand design is now required. Expandable maze with mouse interaction is required. Final English audio must be pre-generated recordings, not browser synthesis. Art production blocked until an available generation service is configured; do not claim prototype acceptance or silently substitute art.

- ADR-001: Objective reality and cognition rendering are separate.
- ADR-002: Player equals Charlie initially; decline creates player cognition greater than Charlie's access.
- ADR-003: Dialogue branches locally and reconverges globally.
- ADR-004: Algernon's maze communicates cognition instead of an IQ meter.
- ADR-005: Algernon does not speak.
- ADR-006: Decline is not LOW played backwards.
- ADR-007: Player controls remain reliable except rare authored control betrayal.
- ADR-008: Ending objects must have prior history.
- ADR-009: 2.5D first.
- ADR-010: AI remains backstage.
- ADR-011: English voice with English and Simplified Chinese subtitles.
- ADR-012: Progress is tracked in a lightweight JSON + HTML board; human playtesting guides experience quality.
- ADR-013: Charlie is represented through a first-person camera; no persistent visible player avatar.
- ADR-014: NPCs use interactive illustrated 2D/2.5D rigs with layered or deformable motion rather than static portraits.
- ADR-015: Algernon's maze is a persistent, draggable, rotatable 3D maze-box widget with a default top-down view.
- ADR-016: English voice uses distinct, consistent character voice profiles and accents; Algernon never receives human speech.
- ADR-017: Reuse mature external tools and properly licensed existing assets where practical; every external asset records source and license.
# 2026-09-12 — Floating world and authored diary progression
User-directed revision: persistent maze is a standalone transparent-canvas 3D box, without a framed window; plot milestones progressively add maze structure. Inspection enlarges the object without restoring a solid panel. Cognition decline changes mouse behavior/access, not the player's controls.
Dialogue/thought presentation: Charlie's internal thoughts float near screen center; spoken NPC subtitles remain distinct. Prompts and interaction layers use feathered transparent gradients and restrained float transitions. Notebook is an authored collage interaction with Chinese word fragments for this iteration, separate from bilingual spoken dialogue. LOW fragments are limited and contain deliberate misspellings; PEAK expands language; DECLINE preserves player agency and saved prior writing. Diary save gates story progression.
This iteration ownership: Carson App/core/main-line integration; Hubble maze; Darwin Chinese diary content and narrative sequence; Harvey room/hands; Kepler collage notebook component/CSS (temporary explicit reassignment, no paid voice requests). Lead global CSS presentation, board/schema, integration checks.
