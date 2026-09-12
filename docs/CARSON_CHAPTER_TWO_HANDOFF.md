# Carson: corrected university progression

## Mainline placement (original PRD order)

Lab exploration → psychological test → initial Algernon maze → FIRST diary → signature transition → cognition growth/bakery first visit → cognition gain/machine → bakery revisit/local choices → university A/B/C → PEAK free exploration → PEAK diary → first Algernon failure → investigation → manual ALGERNON–CHARLIE connection → quiet realization → self-chosen Why / Begin Research → research race (optional visit to Algernon) → conference/local choices → mandatory “What do you see?” reversal → quiet lab/open cage → empty maze → ordered decline → LAST diary/broken transition → empty room → exit → flowers → final unmodified player memory.

Use PRD §§10–45 for ordering and §§61–62 for scope; the early demo's short decline callback is NOT the mainline continuation after bakery. Do not enter full decline before university, investigation, research and conference.

### Exact chapterTwoSteps insertion points

`classroom-a → classroom-b → classroom-c` supplies the university sequence. Intercept `classroom-c.nextStepId` (`algernon-first-failure`): insert unhurried free graph exploration and `diaryEntries.peak` first. Player chooses when to leave exploration; do not auto-advance on the third classroom edge.

`algernon-first-failure → investigation → shared-procedure` follows. The failure target currently represents a recorded observation; Core must supply actual dead-end/pause/backtrack maze behavior. Manual connection remains a genuine player edge action, never automatic.

Intercept `shared-procedure.nextStepId` (`research`): allow the quiet revelation, then a player-initiated research objective. Avoid auto-playing the explanatory PEAK perception line over that quiet moment.

`research → conference` is a small evidence-manipulation prototype. It does not yet implement the accelerating research race/maze clock, optional mouse visit, conference branches/objectification, or mandatory question reversal. Last step has no nextStepId; return control to Core for the quiet-lab/cage sequence. No ending is implemented by that absence.

### Diary integration dependency

Kepler owns the collage UI; `src/content/diary-collage.ts` exports `diaryEntries.first|peak|last`. First goes after the initial test/maze; peak between classroom free exploration and mouse failure; last immediately before broken transition/empty room. See KEPLER_DIARY_COLLAGE_HANDOFF.md. Keep free writing for peak/last PRD compliance; final memory stays completely separate and unchanged.

Ready for source review, not verified gameplay. Narrative task progress 90 is a task estimate, not overall PRD completion. Later investigation/research/conference content is unchanged. Coverage gaps remain in PRD_COVERAGE_PROPOSAL.json.

## Imports
```ts
import { chapterTwoEntryId, chapterTwoSteps, chapterTwoDialogue } from '../content/chapter-two';
import { applyChapterAction } from '../narrative/chapter-two';
```

Core stores `{ completed: [] }` per step. Call `applyChapterAction(step, progress, action)` for an actual player interaction. Save returned `progress`; use `accepted` for feedback. Only `ready` permits transition to returned `nextStepId`. Do not infer completion from number of clicks. Graph edge IDs and requirement IDs are distinct.

## Exact actions

| Step / phase | Ordered action payloads |
|---|---|
| classroom-a / ASCENDING | `{kind:'inspect',targetId:'memory-study'}` → `{kind:'place',itemId:'category-cue',targetId:'recall-results'}` → `{kind:'connect',edgeId:'classroom-a.connection'}` |
| classroom-b / PEAK | `{kind:'inspect',targetId:'trial-cards'}` → `{kind:'place',itemId:'cue-retest',targetId:'prediction-desk'}` → `{kind:'connect',edgeId:'classroom-b.connection'}` |
| classroom-c / PEAK | `{kind:'inspect',targetId:'connection-notebook'}` → three connect events in ANY order, edgeId = `classroom-c.connection`, `classroom-c.bakery`, `classroom-c.maze` |

A: show the two word-list trials and category cue as manipulable evidence. Player understands a university memory concept; this is not an elementary vocabulary lesson.

B: show the professor's unfinished explanation first. Withhold `presentation.conclusion` until completed contains `presentation.holdConclusionUntilRequirementId` (`classroom-b.connect`). Hold the chalk/conclusion naturally without a countdown or failure timeout. After the connection, show the professor's response BEFORE changing scenes, even though `ready` is already true. The connection is the completion action; do not add a generic next-button task. The conclusion is bilingual text only and needs a new registered recording if voiced; do not replay the unfinished sentence as its voice.

C: use four nodes and all three edges from `step.graph`; do not render a hard-coded two-node graph. After opening the notebook, expose all links concurrently. Resolve the player's chosen edge to its own `meaning`; allow test/bakery/maze links in any order, and retain completed links visibly. Inkblot, machine and route recollections should remain identifiable. Preserve time to enjoy the final connection before transitioning, rather than cutting feedback off immediately.

Render placement with object selection/drop or keyboard-equivalent item-to-target action. Inspect events should open the corresponding world evidence. Do not substitute a sequence of dialogue-dismiss buttons for these actions.

## Copy and voice

Use `step.stimulus.facts` as stable world evidence; `step.perception[phase]` gives aligned English/Chinese interpretation. Resolve `step.dialogueIds` and `step.perceptionLineIds[phase]` against `chapterTwoDialogue`; use both subtitle languages from the SAME entry. The 40 entries remain script-only. Changed classroom scripts require fresh audio validation; stable IDs do not guarantee older recordings match. Do not play declined interpretations during PEAK. Peak should feel curious, quick, expansive and enjoyable.

## Validation and remaining coverage

Typecheck passed. Focused checks cover prerequisite rejection, B's conclusion requirement ID, and C connections in multiple orders. No browser/human verification is claimed. Classroom B's optional interpersonal branches and the full PRD C web beyond the three prior domains remain gaps. Do not mark the whole university PRD requirement verified based on this handoff.
