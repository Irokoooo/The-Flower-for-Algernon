# Decision Log

- 2026-09-19 scene-kit asset contract: retain `classroom` as the learning-space RoomScene and supply its generated illustration through the existing `RoomAssets.walls` slot. Add optional registry-resolved `RoomAssets.breadModel` to the existing local GLB loader with raw `bread` hotspot; Lead owns manifest/registry inclusion. Classroom/laboratory/bakery doors emit raw `door`, leaving transition gating to App. Physical bread pickup stays deferred. Static geometry review only for this handoff; no build, functional test, or commit requested.

- 2026-09-19 pacing implementation: user authorizes parallel agents, necessary generated illustrations and licensed reusable models; playable story first. Lead owns App, new core journey phase/checkpoint and final registry/budget/board. Narrative owns preoperative/early revisit ChapterStep content + diary entries; Interaction owns JourneyPanel; Scene owns room/GLB integration and sourcing; Assets owns one necessary learning-room illustration through approved existing provider/skill pipeline. No functional/browser tests. Preop route LOW → surgery (LOW) → recovery (LOW) → early revisits (ASCENDING) → machine/social ASCENDING → university/PEAK. No automatic upgrade from bread completion. Existing v1 saves must remain preserved and older pacing resumes identified explicitly.

- 2026-09-19 pacing correction (user confirmed): preoperative route laboratory test → bakery daily work → Alice learning space → Charlie room/diary → surgery; target 10–15 minutes without forced waits. All preoperative visits remain LOW. Familiar manual competence stays intact; causal/mechanical/social understanding unlocks gradually only after surgery and recovery through revisits. University/conference remain later. Existing step-driven abrupt gain/PEAK mapping must be replaced before expanding later plot. New layouts/content remain local unintegrated drafts; no implementation completion claimed by this decision.

- 2026-09-12 later-scene implementation: user prioritizes remaining playable scenes before polish and requests a persistent optimization TODO. This wave adds distinguishable classroom/research/private-room layouts with existing licensed assets (blockouts honestly marked), peak free exploration, deliberate research initiation/optional companion visit, and social-memory-research legacy decline beats before final diary. Reuse ChapterStep/CognitionGraph/EvidencePlacement, preserve raw diary and reliable inputs. Carson owns App/Core integration, Darwin later content/contracts, Harvey room layouts, Hubble reusable late-scene interaction component, Lead TODO/board/verification. No paid generation or functional tests in this wave.

- 2026-09-12 moving connection targets: user rejects fixed targets beneath animated labels. Lead revises shared wandering graph so node position, hit area and connection endpoints share live coordinates. Drag from one thought to another draws a live preview; all other thoughts keep drifting during selection/connection. Pause and reduced motion remain available. No functional interaction tests; typecheck/build only.

- 2026-09-12 test thoughts and object identity: user reports test desk opens diary, and asks for richer wandering/fading thoughts. Lead owns App routing: diary belongs to paper, test surface opens test/review, books inspect as books. Harvey owns room raycast/model hotspot identity and optional action labels. Hubble owns shared CognitionGraph opt-in drifting presentation; Darwin owns expanded test thoughts/content. Keep objective test image stable; preserve critical selectable clues on hover/focus/selection, offer pause motion and reduced-motion behavior. No duplicate graph system, paid assets or functional/browser tests in this iteration.

- 2026-09-12 diary production: user activates early handwriting/wordbank polish, requests visible drag-and-drop collage, phase-specific diary, writing sound and Charlie English fragment murmurs. LOW has fewer authored fragments and plausible homophone slips; drift belongs to glyphs, never unreliable controls. Core owns audio playback/persistence; diary emits placement events. NPC prompts use authored names, never raw IDs. This round Hubble owns DiaryCollage/CSS, Darwin content, Kepler saved audio/SFX, Harvey room labels, Carson App/mainline/checkpoint integration. Lead schema/manifest/review. No functional playtests.

- 2026-09-12 stimulus / model reuse: user activates FB-01 now. Generate an original raster test card using the existing authorized production budget; show the stable image before interpretation and reuse it on callbacks. Source licensed external book/diary GLBs and load them through the existing visual registry/Three scene, retaining hotspot contracts. User-owned functional testing remains in force. Early handwriting and bread pickup polish remain deferred.

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
