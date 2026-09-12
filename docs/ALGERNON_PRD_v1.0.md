# 《Flowers for Algernon》Interactive Narrative Game
## Product Requirements Document v1.0
### Hackathon Vertical Slice + Long-term Full Game Architecture

**Project codename:** ALGERNON  
**Format:** Web-based interactive narrative / cognitive experience  
**Primary stack:** React + TypeScript + Vite + React Three Fiber / Three.js  
**Target:** Hackathon playable vertical slice first; architecture must support long-term expansion into a polished complete game.

---

# 0. INSTRUCTIONS TO THE LEAD DEVELOPMENT AGENT

**Do not begin implementation immediately.**

First read this entire PRD.

Then inspect:

- repository state;
- available coding agents/subagents;
- maximum useful concurrency;
- available Skills / MCP servers / plugins;
- runtime and deployment environment;
- existing assets;
- API credentials available to the developer.

Before coding, respond with a proposed **Parallel Development Plan** containing:

1. Recommended number of concurrent development Agents.
2. Why this is the optimal concurrency.
3. Exact responsibility of each Agent.
4. Exact directories/files each Agent owns.
5. Dependencies between Agents.
6. Wave 1 / Wave 2 / integration sequence.
7. Which Skills/plugins/MCPs each Agent should use.
8. Estimated fastest route to a playable vertical slice.
9. Risks of merge conflicts and how they will be prevented.
10. Which P0 features must be cut last if time becomes constrained.

Prefer **maximum useful parallelism**, not maximum theoretical agent count.

After presenting the plan, ask the developer to approve or modify the proposed Agent count.

## Critical rule

No scene Agent may independently invent a replacement implementation of a Core System.

If a Core API is missing, request/implement it through the Core owner rather than creating scene-local alternatives.

---

# 1. PRODUCT VISION

This is **not**:

- a chatbot based on *Flowers for Algernon*;
- an illustrated summary of the novel;
- a collection of unrelated mini-games;
- “AI + famous literature”;
- a visual novel where players merely click Next.

It is an interactive experience in which:

> **The player temporarily inhabits Charlie Gordon's perception of reality.**

The central system is:

> **Objective Reality → Charlie's Cognition Renderer → Player Experience**

Reality itself should remain largely constant.

What changes is Charlie's ability to:

- see;
- hear;
- read;
- understand;
- associate;
- interpret;
- remember;
- express;
- act upon that reality.

The player should not merely be told that Charlie becomes more intelligent and later declines.

**The interface itself must make the player experience gaining and losing cognition.**

---

# 2. CORE EMOTIONAL ARC

### LOW
> I don't understand everything, but the world feels simple and safe.

### ASCENDING
> Wait. I understand this now.

### HIGH / PEAK
> Everything connects.

### ALGERNON REVERSAL
> I understand exactly what is going to happen to me.

### DECLINE
> I remember that I used to know how.

### ENDING
> Charlie may lose the connection. The player still remembers.

---

# 3. PLAYER–CHARLIE RELATIONSHIP

Use an **A + C identity model**.

During the first half:

> **Player ≡ Charlie**

NPCs look toward the camera and address the player as Charlie.

The player performs Charlie's tests, work, learning, writing and exploration.

During decline, gradually create:

> **Player cognition > Charlie cognition**

The player remembers information and abilities that Charlie can no longer access.

This separation is one of the game's most important mechanics.

## Fundamental rule

> **Player ability does not decline. Charlie's affordances decline.**

Do NOT simulate cognitive decline primarily by making the player's keyboard malfunction, making controls arbitrarily bad, or obscuring the entire screen.

The player should often know exactly what to do while discovering that **Charlie can no longer do it**.

---

# 4. DESIGN INVARIANTS — DO NOT VIOLATE

These belong in `/AGENTS.md`.

## Narrative invariants

**Reality does not change merely because cognition changes.**

**Branch locally, converge globally.**

Player choices may alter:

- NPC responses;
- immediate relationship state;
- Charlie's wording;
- emotional texture;
- optional dialogue.

They must not casually rewrite major canonical events.

**Algernon never literally speaks human language.**

Charlie may talk to Algernon. Algernon communicates through movement, behavior and Charlie's interpretation.

**Do not use an explicit IQ meter.**

Algernon's maze functions as the primary external cognition indicator.

**Do not announce cognition states.**

Never display things like:

- `INTELLIGENCE LEVEL 78%`
- `DECLINE PHASE STARTED`

Players should infer change through interaction.

**Nothing in the final room should appear for the first time.**

Every award, photograph, article, book, research paper and meaningful object visible in the ending must have appeared earlier.

**Decline ≠ LOW played backwards.**

LOW Charlie lacks understanding.

Declining Charlie possesses **memory of having understood**.

This distinction is essential.

---

# 5. CORE GAMEPLAY VOCABULARY

Every mechanic should map onto this vocabulary.

| System | Player verb |
|---|---|
| Environmental exploration | Look / Observe |
| Cognition Graph | Focus / Connect |
| NPC interaction | Listen / Interpret |
| Progress Report | Reflect / Express |
| Algernon Maze | Measure / Foreshadow |
| Cognition Run | Struggle / Learn |
| Peak exploration | Explore / Discover |
| Decline | Remember / Lose |

The first half roughly follows:

> **Look → Focus → Connect → Understand → Reflect → Transition**

Decline transforms this into:

> **Look → Focus → Fail to Connect → Remember Having Understood → Lose**

Avoid adding mechanics that do not reinforce this language.

---

# 6. COGNITION STATE

Recommended state model:

```ts
type CognitionPhase =
  | "PROLOGUE"
  | "LOW"
  | "ASCENDING"
  | "HIGH"
  | "PEAK"
  | "DECLINING"
  | "ENDING";
```

Do not limit cognition to one numeric intelligence score.

Expose parameters such as:

```ts
interface CognitionState {
  phase: CognitionPhase;

  semanticClarity: number;
  connectionDensity: number;
  vocabularyAccess: number;
  spellingAccuracy: number;

  audioClarity: number;
  socialReadability: number;
  facialReadability: number;

  memoryAccess: number;
  expressionCapacity: number;
  controlReliability: number;

  colorTemperature: number;
  saturation: number;
  contrast: number;
  bloom: number;
  focusStability: number;
}
```

Exact implementation may change, but scenes must consume a common cognition model.

---

# 7. VISUAL LANGUAGE

## LOW

Warm, soft, gentle bloom, lower contrast, low semantic density.

People appear emotionally simple.

This does **not** mean the world is objectively kinder.

Charlie is compressing complexity into simple explanations.

## ASCENDING

Increasing clarity, information density, readable expressions and semantic connections.

Gradual cooling.

## PEAK

Cool, sharp, precise, high information density and high contrast.

Visually magnificent rather than simply depressing.

**Intelligence must feel desirable.**

## DECLINE

Do NOT return to the original warm LOW state.

Instead use:

- desaturation;
- unstable focus;
- disappearing connections;
- incomplete graphs;
- delayed semantic responses;
- lost labels;
- fragmented audio.

Core visual principle:

> **Charlie becoming smarter is not the world becoming higher-resolution. It is the world becoming more relational.**

And:

> **LOW sees an expression. PEAK sees a person.**

---

# 8. WORLD FORMAT

Prefer **2.5D**.

Use:

- light 3D environments;
- depth;
- parallax;
- camera movement;
- lighting;
- shaders;
- 2D portrait planes / billboards for NPCs.

NPCs should use a small number of high-quality expression variants rather than expensive full 3D character rigs.

Avoid for MVP:

- Blender-heavy pipelines;
- skeletal animation;
- lip-sync;
- collision-heavy gameplay;
- full 3D character locomotion.

---

# 9. COGNITION GRAPH — CORE SYSTEM

This is the visual and mechanical heart of the game.

Interaction:

> **Look → Focus → Connect**

Player examines a stimulus.

Reality dims.

Relevant objects/concepts become nodes.

Connections grow according to Charlie's current cognition.

### LOW
Few simple associations.

### ASCENDING
More causal/semantic relationships.

### PEAK
Dense, cross-domain networks.

### DECLINE
Connections attempt to grow but stop, flicker, break, disappear, or lose labels.

Reuse the same Graph system for:

- psychological tests;
- books;
- machinery;
- NPC expressions;
- academic concepts;
- research;
- family memories;
- Algernon investigation.

Do not build separate graph implementations for each scene.

---

# 10. OPENING — LABORATORY

Black screen.

Ambient laboratory audio:

- paper;
- clock;
- room tone;
- distant speech.

Researcher:

> “Charlie?”

Player opens eyes.

Warm LOW-cognition laboratory.

Allow approximately 15–30 seconds of free exploration before exposition.

Examples:

Certificate:

> **Some important paper.**

Complex book:

> **A big book.**

Algernon:

> **A little white mouse.**

This silently teaches:

> **The player only knows what Charlie knows.**

Researcher introduces the experiment and psychological testing. The player should not receive an exposition dump before being allowed to look around.

---

# 11. PSYCHOLOGICAL TEST

Researcher presents an original abstract inkblot-like stimulus.

Do not reproduce protected test material unnecessarily.

Enter Cognition Graph.

LOW Charlie sees simple possibilities:

- butterfly;
- monster;
- don't know.

This test returns later.

## PEAK callback

The same stimulus produces sophisticated interpretation and meta-analysis.

Charlie may begin analyzing assumptions behind the test itself.

## DECLINE callback

Player remembers sophisticated interpretations.

Charlie cannot access them.

Example:

`~~[The symmetry suggests…]~~`

Unavailable.

Possible internal line:

> **I knew how to say this before.**

---

# 12. ALGERNON MAZE

Algernon's maze replaces a conventional cognition progress bar.

### LOW
Slow. Wrong turns. Backtracking. Charlie loses.

### ASCENDING
Algernon improves. Charlie catches up.

### PEAK
Elegant, fast completion.

### FIRST CRACK
Algernon unexpectedly enters a dead end.

No popup. No explanation.

### DECLINE
Increasing hesitation and errors.

Identity progression:

> **Competitor → Benchmark → Mirror → Companion**

---

# 13. PROGRESS REPORT / DIARY

Progress Reports form the narrative spine.

After major sequences, the diary subtly glows.

Player opens it.

Charlie writes.

Writing reflects cognition.

### LOW
Misspellings. Simple syntax.

### ASCENDING
Increasingly fluent.

### PEAK
Complex and analytical.

### DECLINE
Errors and simplification return.

But unlike LOW, Charlie/player remembers better language.

---

# 14. PROGRESS REPORT TRANSITION

Avoid chapter-selection screens.

After writing:

Ink gathers into a point.

`●`

A connection grows:

`●────●`

More connections emerge.

Semantic/neural imagery fills the frame.

Black/blink.

Charlie raises his head into the next scene.

Repeat enough times that the player develops an expectation:

> **Write → Transition → World continues.**

This expectation is deliberately broken at the ending.

---

# 15. COGNITION RUN

2D horizontal movement sequence.

Purpose:

> **Charlie desperately trying to catch up with understanding the world.**

Controls remain simple:

- left/right;
- jump;
- duck if needed.

No combat.

Audio begins fragmented and becomes intelligible with progress.

Floating language fragments gradually form coherent meaning.

Connection nodes may be collected.

Reward:

> **Understanding**, not XP.

## Failure

Do NOT instantly restart.

Charlie remains stopped/sitting.

Inner voice changes by cognition:

LOW:

> “Maybe I'm not smart enough.”

ASCENDING:

> “I can learn this.”

PEAK:

> “I see the mistake.”

DECLINE:

> “I did this before.”

Player explicitly chooses:

> **Try again?**

Retry becomes characterization.

---

# 16. BAKERY — VISIT ONE

Warmest major environment.

Simple mini-game:

> collect / bag / deliver bread.

Coworkers laugh.

Objective audio exists, but Charlie's cognition filters it.

Charlie interprets:

> **They're laughing again.**

> **I make everybody laugh.**

> **They like having me here.**

NPC hover may simply read:

> **My friend.**

Important:

Their real behavior already exists.

Coworkers exchange looks.

Someone imitates Charlie.

Someone suppresses laughter.

Reality is NOT rewritten during Visit Two.

A recording of Visit One should reveal that the cues were always present.

---

# 17. BAKERY — VISIT TWO

The mechanical task itself evolves.

Charlie encounters machinery he previously could not understand.

Earlier hover:

> **A big machine.**

> **I'm not supposed to touch it.**

Now:

Focus.

Graph:

`lever → gear → roller → dough thickness`

Player connects machinery logic.

Machine visually opens into an exploded semantic/mechanical view.

Short operation mini-game.

Charlie learns extremely quickly.

## Crucial result

Charlie succeeds.

Coworkers are not happy.

NPC cognition:

`smile → surprise → embarrassment → threat`

Charlie:

> **He's not happy.**

> **But I did it right.**

---

# 18. BAKERY DIALOGUE CHOICES

Cognition unlocks expression affordances.

Possible responses:

> **I only did what I was asked.**

> **Why are you angry? I did it correctly.**

> **You didn't mind me when I couldn't do it.**

> **Say nothing.**

Choices change NPC response and relationship state.

They do NOT rewrite the major event.

## Design rule

> **Branch locally, converge globally.**

---

# 19. BAKERY CORE REALIZATION

First visit:

`failure → laughter`

Second visit:

`success → anger`

Player manually connects the contradiction.

Possible conclusion node:

> **They never wanted me to become their equal.**

Do not make every coworker identical.

One may be threatened.

One may laugh because others laugh.

One may feel affection and guilt simultaneously.

At higher cognition:

> There is no simple “they.”

This realizes:

> **LOW sees an expression. PEAK sees a person.**

Use the same underlying recorded coworker audio across cognition states where possible. Perception/filtering and interpretation change; objective reality does not.

---

# 20. BAKERY OPTIONAL THIRD VISIT

P1/P2.

Charlie encounters the machine again during decline.

Graph attempts:

`lever → gear → ?`

He once mastered it.

Now he cannot reconstruct it.

The coworker who previously resented him may witness this and **not laugh**.

Small human callback.

---

# 21. UNIVERSITY CLASSROOM — COGNITIVE POWER FANTASY

This sequence must make intelligence feel genuinely wonderful.

Structure:

## A — I understand it.

Previously incomprehensible material becomes meaningful.

Charlie:

> **I understand him.**

## B — I'm faster than him.

Professor begins reasoning.

Charlie's Cognition Graph completes the implication first.

Possible player choices:

- answer;
- point out flaw;
- ask question;
- remain silent.

Again: local branch, global convergence.

## C — Everything connects.

The Graph escapes the boundaries of the current object.

`memory → learning → language → identity → perception`

Connections reach:

- bakery;
- psychological test;
- Algernon;
- research;
- family memories;
- Progress Reports.

Previous audio fragments may return.

Previously isolated experiences become one system.

---

# 22. PEAK FREE EXPLORATION

For the first time:

### Remove explicit objective.

Let the player explore the cognition network freely.

This communicates:

> Charlie no longer needs someone else to tell him what to understand.

Player decides when to continue.

Eventually a meaningful node triggers progression.

---

# 23. PEAK PROGRESS REPORT

At PEAK, provide:

> **100% Expression Agency**

Player writes.

The system does not alter the text.

This creates the baseline required for later Expression Betrayal.

---

# 24. FIRST ALGERNON FAILURE

After the cognitive high:

Return to familiar Algernon Maze.

Algernon moves rapidly.

Then:

dead end.

Pause.

Backtrack.

No dramatic music.

No warning.

No explanation.

Ideally subtle enough for the player to wonder:

> **…Did I just see that?**

Repeat later.

Charlie notices.

---

# 25. ALGERNON INVESTIGATION

The maze expands from HUD indicator into full interaction.

Charlie studies:

- completion time;
- wrong turns;
- memory retention;
- response latency;
- experimental records.

Observe Algernon.

Graph:

`familiar route → hesitation → wrong turn → tries again`

Charlie:

> **You remember this maze.**

Pause.

> **Don't you?**

Algernon never answers verbally.

This is the core form of Charlie ↔ Algernon "dialogue": Charlie speaks, while Algernon's movement and behavior function as the reply.

---

# 26. THE CONNECTION

Player analyzes:

`same procedure`

→ `same intervention`

→ `same cognitive gain`

Meanwhile:

`Algernon`

→ `declining performance`

→ `progressive`

→ `irreversible?`

Two unconnected nodes remain:

**ALGERNON**

**CHARLIE**

The game does NOT connect them automatically.

The player must do it.

`ALGERNON ───────── CHARLIE`

Graph goes quiet.

Charlie:

> **“…Oh.”**

No speech explaining the revelation.

---

# 27. THE RACE AGAINST HIMSELF

Do not transition directly into decline.

Charlie still possesses PEAK cognition.

After silence:

A new node appears.

> **Why?**

Charlie himself creates the next objective.

`Why → mechanism → data → experiment → research`

Player chooses:

> **Begin Research**

This begins a fast research sequence.

---

# 28. RESEARCH RACE

Reuse existing mechanics rather than inventing another game.

Combine:

- Focus;
- Cognition Graph;
- reading;
- Cognition Run;
- Progress Report/research writing;
- environmental navigation.

Research gets faster.

Connections proliferate.

Meanwhile:

### Algernon's Maze becomes the clock.

No countdown timer.

Charlie:

`●──●──●──●──●──●`

Algernon:

`🐁 → →`

then:

`🐁 → … →`

then:

`🐁 ↩︎`

One accelerates.

One slows.

---

# 29. OPTIONAL VISIT TO ALGERNON

During research:

> **Continue Research**

or

> **Visit Algernon**

This does not alter the main plot.

If visited:

Charlie sits beside the cage.

No Cognition Graph.

He no longer needs to analyze Algernon.

Possible lines:

> **I know what's happening to you.**

> **I'm sorry I didn't understand sooner.**

Later:

> **I'm scared too.**

Algernon may approach the cage wall.

No anthropomorphic speech.

This completes:

> **Mirror → Companion**

---

# 30. ACADEMIC CONFERENCE

Now the conference has narrative purpose.

Researchers publicly present the experiment as a success.

Charlie already knows it is failing.

Presentation:

> **SUCCESS OF THE EXPERIMENT**

Researcher:

> “The results demonstrate sustained—”

Charlie's cognition creates:

`sustained`

↓

`Algernon performance ↓`

↓

`FALSE?`

Charlie hears himself described as:

> subject / patient / experiment

Graph connects:

`subject → patient → experiment → person`

Charlie understands the objectification.

---

# 31. CONFERENCE CHOICE

Player may:

- interrupt;
- wait;
- challenge the conclusion;
- remain silent initially.

Responses change interpersonal reactions.

Core reality converges:

> Charlie publicly exposes the serious problem in the experiment.

---

# 32. “WHAT DO YOU SEE?” CALLBACK

This is mandatory.

Opening:

Researcher stands.

Charlie sits.

Researcher gives Charlie the test.

> **What do you see?**

Conference/research reversal:

Charlie stands before the researchers.

They sit.

Charlie presents the evidence.

> **What do you see?**

Meaning changes from:

> Can you understand our test?

to:

> Can you understand what I have discovered?

---

# 33. FREE ALGERNON

After the conference:

Quiet laboratory.

No crowd.

No applause.

Algernon's cage has a subtle interaction glow.

Do NOT display:

> FREE ALGERNON

Player discovers it.

Interaction:

> **Open the cage.**

Player performs the action.

Algernon pauses.

Then leaves.

## Important

The maze HUD remains.

But it is now empty.

The absence itself becomes UI storytelling.

---

# 34. FIRST SIGNS OF CHARLIE'S DECLINE

Charlie returns to research.

Graph still works.

Then one node takes approximately a fraction longer than expected to appear.

Potentially subtle enough to resemble latency.

Next:

one typo.

Charlie backspaces.

Corrects it.

Continues.

No explanation.

## Rule

> **The first sign of decline should be small enough to be mistaken for a technical hiccup.**

---

# 35. THREE BETRAYALS

## Information Betrayal — high frequency

Player can act, but Charlie cannot retrieve information.

Examples:

- unreadable text;
- disappearing semantic nodes;
- lost facial cues;
- fragmented speech.

## Expression Betrayal — medium frequency

Player retains intention.

Charlie cannot fully express it.

Most important manifestation:

### Progress Report transformation.

Player types:

> I don't want to lose everything I've learned.

On Save:

> I dont want to lose what I lerned.

Later:

> I dont want to forget.

The player's original may briefly remain as ghost text before disappearing.

Keyboard itself works normally.

Transformation occurs at commit/save.

## Control Betrayal — very low frequency

Use only approximately 1–2 major moments.

Player provides the correct input.

Charlie cannot execute it as before.

Example:

player correctly jumps during a previously mastered Cognition Run.

Charlie hesitates.

Inner voice:

> **“…I pressed it.”**

Do not overuse this.

Otherwise narrative becomes perceived input lag.

---

# 36. DECLINE ORDER

Decline should dismantle cognition in layers:

> **Algernon → Semantic Connection → Language → Social Understanding → Memory → Control**

Not merely a numeric regression.

---

# 37. SOCIAL DECLINE

Return to familiar social cues.

At PEAK:

`forced smile → eye contact → shared joke → mockery`

During decline:

`smile → ?`

Crucially, Charlie does NOT return to:

> They're my friends!

Instead:

> **I know that smile means something.**

> **I can't remember what.**

Memory of understanding remains.

---

# 38. MEMORY DECLINE

Family photograph.

Earlier rich graph:

`mother → home → event → emotion → conflict → memory`

Later:

`mother → home → ? → ?`

Possible inner voice:

> **This matters to me.**

> **I don't know why.**

Charlie's room can serve as the reusable private memory space, reducing the need for many additional NPC scenes.

---

# 39. CONTROL DECLINE CALLBACK

Return to previously mastered Cognition Run.

The player remembers the route.

Previously available cognitive shortcuts no longer appear.

At one critical point:

player correctly jumps.

Charlie fails.

> **I did this before.**

Allow retry.

He may succeed.

The point is separation, not hopelessness.

---

# 40. RESEARCH LEGACY

P1 but strongly recommended.

Charlie may name or complete his discovered phenomenon/research.

Player contributes to the title/name.

At PEAK the game preserves the expression perfectly.

Later Charlie encounters his paper.

He cannot understand the body.

But sees:

> **Gordon**

Inner voice:

> **That's my name.**

This paper later appears in the final room.

---

# 41. LAST PROGRESS REPORT

Player receives the familiar diary interaction.

Allow full typing.

Example player input:

> **I don't want to forget the people who were important to me.**

On Save, Expression Betrayal occurs.

Possibly:

> **I dont want to forget them.**

The familiar transition begins.

Ink.

`●`

Connections grow.

One begins extending.

Then:

### it breaks.

Black.

---

# 42. EMPTY ROOM

Charlie raises his head.

Empty room.

No NPC.

No Cognition Graph spectacle.

No Algernon.

Environmental sound only.

Objects remain:

- award;
- newspaper coverage;
- photographs;
- books;
- research paper;
- diary;
- other previously experienced artifacts.

Every object must already have narrative history.

Example:

Book once produced an enormous semantic network.

Now:

> **A book.**

Award:

> **This has my name on it.**

Charlie may not know why.

The tragedy is not that his achievements disappeared.

> **His connection to their meaning disappeared.**

Allow the player to remain here indefinitely.

Do not automatically end.

---

# 43. EXIT

Player eventually finds the door.

Interact.

> **Leave?**

Player confirms.

Charlie exits.

This marks the separation of Player from Charlie.

---

# 44. FLOWERS FOR ALGERNON — EPILOGUE

Before the meta-ending:

A very short quiet scene.

Algernon's grave.

Flowers nearby.

No Cognition Graph.

No cognition state.

No Betrayal.

One interaction:

> **Place the flowers.**

Player places them.

This is important.

The title becomes an action.

And for the first time, the question changes from:

> What can Charlie do?

to:

> **What can I do for Charlie and Algernon?**

Fade.

---

# 45. FINAL META ENDING

Black / minimal interface.

For the first time:

a clean input field outside Charlie's cognition.

Prompt:

> **What do you want to remember?**

Player types anything.

### Absolutely no Betrayal.

The game preserves the text exactly.

A small node:

`●`

A final connection grows:

`●────●`

This connection belongs to the player.

Fade.

**END.**

---

# 46. THREE CENTRAL QUESTIONS

The entire game can be framed through three callbacks.

### Opening
Researcher → Charlie:

> **What do you see?**

### Peak
Charlie → Researchers:

> **What do you see?**

### Ending
Game → Player:

> **What do you want to remember?**

Thematic progression:

> **SEE → UNDERSTAND → REMEMBER**

Do not explicitly explain this structure to the player.

---

# 47. OPTIONAL P3 — “A MEMORY”

Do NOT rewrite canonical reality with a miracle cure.

Instead, after completion, optionally unlock:

> **A Memory**

A warm non-declining space.

Algernon can run.

Charlie can read.

Important people can exist.

Semantic Graph remains intact.

No decline timer.

No objective.

No failure.

The player can simply stay.

This is an **Emotional HE**, not a Plot HE.

Meaning:

> The tragedy happened.

> But if the player cannot bear to leave them completely, this memory remains.

---

# 48. TECHNICAL ARCHITECTURE

Recommended starting stack:

- Vite;
- React;
- TypeScript;
- React Three Fiber;
- Three.js;
- Zustand or an equivalently lightweight shared state store;
- Web Audio API;
- JSON/TypeScript content manifests;
- Playwright for critical-path browser testing.

The goal is a componentized 2.5D architecture where scene teams can work independently while consuming shared core systems.

---

# 49. ARCHITECTURE MODEL

Prefer:

> **Core Engine + Scene Packs**

Conceptually:

```text
Core
├── Scene Manager
├── Cognition State
├── Cognition Graph
├── Dialogue
├── Progress Report
├── Transition
├── Audio Perception
├── NPC
├── Interaction
├── Algernon Maze
├── Cognition Run
└── Asset Registry

Scenes
├── Opening Lab
├── Bakery
├── Charlie Room
├── Classroom
├── Investigation
├── Research
├── Conference
├── Decline Callbacks
├── Empty Room
└── Epilogue
```

Scenes consume Core APIs.

They do not duplicate them.

---

# 50. REPOSITORY STRUCTURE

Recommended:

```text
/
├── AGENTS.md
├── GAME_DESIGN.md
├── TECH_SPEC.md
├── ROADMAP.md
├── DECISIONS.md
├── SCENE_MANIFEST.json
├── ASSET_MANIFEST.json
│
├── src/
│   ├── core/
│   ├── cognition/
│   ├── narrative/
│   ├── audio/
│   ├── scenes/
│   ├── components/
│   ├── content/
│   ├── assets/
│   ├── state/
│   └── tests/
│
├── assets/
│   ├── characters/
│   ├── environments/
│   ├── props/
│   ├── audio/
│   │   ├── voice/
│   │   ├── ambience/
│   │   └── sfx/
│   └── semantic/
│
└── .agents/
    └── skills/
```

---

# 51. PROJECT-SPECIFIC AGENT SKILLS

Create reusable project Skills such as:

```text
.agents/skills/
├── algernon-scene/
├── cognition-graph/
├── narrative-writing/
├── audio-perception/
├── visual-language/
├── asset-production/
└── qa-playthrough/
```

These should encode project conventions so future Agents do not behave like new team members with no project memory.

Examples:

### `algernon-scene`
- required Scene interface;
- scene registration;
- cognition access;
- interaction conventions;
- asset access;
- forbidden global-state creation.

### `visual-language`
- LOW / ASCENDING / PEAK / DECLINE visual rules;
- color-temperature principles;
- graph language;
- 2.5D character rules;
- prohibition on generic AI-dashboard aesthetics.

### `narrative-writing`
- Branch locally, converge globally;
- Algernon never speaks;
- avoid exposition;
- preserve Player ≡ Charlie → Player > Charlie transition;
- copyright-safe original/adapted dialogue.

### `qa-playthrough`
- critical emotional beats;
- expected state transitions;
- prohibited regressions;
- complete narrative smoke path.

Before implementation, the Lead Agent should inspect the current Skills/plugin/MCP ecosystem available in its environment and recommend useful external Skills rather than assuming a fixed list.

---

# 52. ASSET PIPELINE

Create an `ASSET_MANIFEST`.

Each asset should track approximately:

```ts
interface AssetManifestEntry {
  id: string;
  scene: string[];
  type: string;
  status: "missing" | "generating" | "ready" | "approved";
  filename?: string;
  prompt?: string;
  variants?: string[];
  cognitionStates?: CognitionPhase[];
  source?: string;
  license?: string;
}
```

Never let scene code reference arbitrary asset paths.

Use an Asset Registry.

This allows a dedicated Asset Agent to:

1. inspect scenes;
2. detect missing assets;
3. create prompts;
4. generate/source them;
5. register them;
6. report gaps.

---

# 53. CHARACTER ASSETS

NPCs should primarily use consistent 2.5D portraits.

Each major NPC ideally needs:

- neutral;
- smile;
- uncomfortable;
- negative/angry;
- optional special expression.

Lighting/perspective must remain consistent.

Avoid excessive character generation during hackathon.

---

# 54. AUDIO ARCHITECTURE

Use a common Audio Manager.

Objective voice recording remains stable.

Charlie cognition modifies perception using Web Audio processing:

- low-pass filtering;
- clarity;
- volume relationships;
- fragmentation/masking;
- spatial perception where useful.

Important bakery dialogue should preferably reuse the **same underlying recording** between visits.

Only perception changes.

This technically demonstrates:

> **Reality did not change.**

---

# 55. TTS / SOUND GENERATION

Prefer **pre-generated dialogue** for the hackathon rather than runtime TTS.

The development Agent should inspect currently available speech-generation APIs/plugins before implementation and choose a stable provider. OpenAI speech/TTS is an appropriate default if available.

Environmental Foley and ambience can likewise be pre-generated or sourced through an approved sound-effects generation workflow.

Potential assets:

- laboratory room tone;
- paper;
- clock;
- mouse cage movement;
- bakery oven;
- dough machine;
- door bell;
- classroom ambience;
- chalk;
- conference murmur;
- door latch.

These are **asset-production dependencies**, not runtime game dependencies.

---

# 56. CONTENT ARCHITECTURE

Do not hardcode dialogue deeply inside React components.

Prefer structured content:

```ts
interface DialogueBeat {
  id: string;
  speaker: string;
  objectiveAudio?: string;

  perceivedText: Partial<
    Record<CognitionPhase, string>
  >;

  choices?: DialogueChoice[];
}
```

Relationships can maintain lightweight local state.

Example:

```ts
interface NPCRelationship {
  trust: number;
  resentment: number;
  affection: number;
  discomfort: number;
}
```

Do not build a giant RPG relationship simulation.

Only store state that changes meaningful callbacks/dialogue.

---

# 57. PARALLEL AGENT DEVELOPMENT

The Lead Agent must determine exact concurrency after inspecting available resources.

Likely useful decomposition:

## Architecture Agent
Owns:
- repository;
- SceneManager;
- state contracts;
- interfaces;
- manifests;
- build system.

## Cognition Agent
Owns:
- Cognition Graph;
- cognition renderer;
- visual parameters.

## Narrative Agent
Owns:
- Dialogue;
- Progress Reports;
- Betrayal logic;
- subtitles;
- inner voice.

## Scene Kit Agent
Owns:
- 2.5D environment primitives;
- NPC billboard;
- hotspots;
- camera;
- lighting.

## Audio Agent
Owns:
- AudioManager;
- perception filters;
- cue system.

## Asset Agent
Owns:
- manifest;
- portrait/environment generation pipeline;
- TTS;
- SFX.

## Scene Agents
Own isolated scene directories.

## Integration/QA Agent
May fix:
- interfaces;
- integration bugs;
- broken state transitions;
- accessibility;
- visual regressions.

Must NOT invent new narrative mechanics.

---

# 58. AGENT DEVELOPMENT WAVES

## Wave 0

Lead Agent:

- inspect environment;
- recommend useful concurrency;
- present the exact multi-Agent plan to the developer;
- ask developer to approve/change Agent count;
- establish contracts;
- create `AGENTS.md`;
- create manifests;
- define ownership boundaries.

## Wave 1

Parallel:

- Core architecture;
- Cognition Graph;
- Narrative system;
- Scene Kit;
- Audio;
- Asset pipeline;
- Opening vertical slice.

## Wave 2

Parallel:

- Bakery;
- Classroom;
- Algernon Investigation;
- Cognition Run;
- Progress Report polish.

## Wave 3

Parallel:

- Research;
- Conference;
- Decline;
- Ending.

## Wave 4

Integration.

No new features.

Fix:

- pacing;
- bugs;
- asset consistency;
- performance;
- transitions;
- audio;
- mobile/desktop issues.

---

# 59. MULTI-AGENT CONCURRENCY PROTOCOL

Before implementation, Lead Agent must explicitly answer:

> **How many concurrent Agents should we start to maximize speed without causing architectural conflict?**

It must recommend a number rather than merely asking the developer to choose blindly.

For example, if the environment supports enough concurrency, it may recommend 5–7 Wave-1 workers, but the number must be derived from the actual environment and dependency graph.

For every worker provide:

```text
Agent:
Mission:
Owned directories:
May modify:
Must not modify:
Depends on:
Deliverable:
Acceptance test:
Recommended skills/tools:
```

Parallel workers should communicate through **contracts and manifests**, not by repeatedly editing the same files.

If an Agent requires a Core contract change, it must surface the request to the Architecture/Core owner.

---

# 60. TESTING

Use automated browser testing for critical narrative paths where practical.

Required smoke path:

```text
Opening
→ Psychological Test
→ Maze
→ Progress Report
→ Transition
→ Bakery
→ Ascending
→ Bakery Revisit
→ Classroom
→ Algernon Failure
→ Investigation
→ Research
→ Conference
→ Free Algernon
→ Decline
→ Last Report
→ Empty Room
→ Flowers
→ Final Question
```

Agents should verify at minimum:

```bash
typecheck
test
build
```

before integration.

The Integration/QA Agent should also verify that:

- no scene accidentally creates a second core system;
- state transitions are deterministic;
- narrative callbacks occur;
- audio perception corresponds to cognition;
- local dialogue branches reconverge;
- final-room objects were introduced earlier;
- Betrayal events feel intentional rather than buggy.

---

# 61. HACKATHON PRIORITY

Do **not** attempt the complete polished game today.

Hackathon objective:

> **Prove that the cognition engine can carry the complete game.**

A successful vertical slice must demonstrate:

1. Objective Reality.
2. At least two cognition states.
3. Cognition Graph.
4. Same information perceived differently.
5. Progress Report.
6. Transition.
7. Algernon Maze.
8. One meaningful cognition increase.
9. One meaningful cognition loss/Betrayal.
10. A coherent visual/audio identity.

Recommended first polished playable slice:

> **Opening → Test → Maze → Diary → Transition → Bakery → Cognition Gain → Bakery Revisit / Algernon Crack**

The architecture must nevertheless support the full PRD.

---

# 62. PRIORITY LEVELS

## P0 — Core identity

- Opening.
- Psychological test.
- Cognition Graph.
- Algernon Maze.
- Progress Report.
- Signature transition.
- Bakery Visit 1/2.
- Bakery machine.
- Local dialogue branching.
- University A→B→C.
- Peak free exploration.
- Algernon Investigation.
- Player manually connects ALGERNON → CHARLIE.
- Research Race.
- Conference.
- “What do you see?” reversal.
- Free Algernon.
- Empty maze HUD.
- Decline Betrayals.
- Last Progress Report.
- Empty Room.
- Exit.
- Flowers.
- “What do you want to remember?”

## P1

- Family memory.
- Research legacy/paper.
- Decline psychological-test callback.
- Strong social decline callback.
- Additional relationship reactions.

## P2

- Bakery third visit.
- More complete conference staging.
- Expanded Cognition Run callbacks.
- Additional photographs/awards/environmental history.

## P3

- **A Memory — Emotional HE.**

---

# 63. COPYRIGHT / ADAPTATION RULE

The project is inspired by *Flowers for Algernon*.

Do not copy substantial passages of the novel into the game.

Dialogue, Progress Reports and scene writing should generally be newly written/adapted material expressing the designed experience rather than reproducing lengthy copyrighted text.

Keep attribution/licensing/public-release considerations separate from hackathon prototyping and review them before public distribution.

---

# 64. WHAT THE AGENT MUST NOT DO

Do not:

- turn this into a chatbot;
- add an AI assistant character;
- create an IQ progress bar;
- make Algernon speak;
- make LOW = happy and HIGH = sad;
- make decline merely blur the screen;
- make all bakery coworkers evil;
- branch the main story into many timelines;
- auto-restart Cognition Run failures;
- use cheap jump scares for decline;
- explain every emotional beat through dialogue;
- introduce ending memorabilia that the player has never seen;
- add mechanics merely because they are technically impressive;
- create multiple competing implementations of Dialogue/Cognition/Audio;
- sacrifice the cognition system in order to create more scenes;
- allow scene-specific code to bypass Asset Registry / shared state / common audio contracts without justification;
- start coding before proposing the concurrency and implementation plan requested in Section 0.

When forced to choose:

> **fewer scenes + stronger cognition mechanics**

wins.

---

# 65. ACCEPTANCE TEST — THE EXPERIENCE

A successful player should be able to say:

Early:

> **I want to become smarter.**

Ascending:

> **Oh my god, I can understand it now.**

Bakery:

> **Wait. They were always treating me this way?**

Classroom:

> **I don't ever want to lose this brain.**

Algernon:

> **Oh no.**

Decline:

> **I know how to do this. Why won't Charlie do it?**

Ending:

> **I remember even if he can't.**

If the implementation produces these feelings, the project is working.

---

# 66. ENVIRONMENTAL STORYTELLING PRINCIPLE

The player's history must accumulate physically in the world.

Important objects should be introduced, earned, read, written, received or interacted with before appearing in later callbacks.

Examples:

- research paper;
- award;
- newspaper;
- photographs;
- books;
- diary;
- Algernon's maze;
- bakery machine;
- psychological test.

This allows the final room to function as **the player's own game-history ruins**, not as an exposition museum.

> **Nothing in the final room should be introduced for the first time.**

---

# 67. PLAYER AGENCY PRINCIPLE

Agency does not require alternate endings.

The player should repeatedly be allowed to decide:

- what to inspect;
- which connection to make;
- whether to speak;
- how to respond;
- whether to visit Algernon;
- how long to remain in free exploration;
- when to leave the final room;
- what to remember.

Major reality remains stable.

This is:

> **Branch locally, converge globally.**

Player agency changes **relationship, interpretation, emotional texture and timing**, rather than destroying narrative coherence.

---

# 68. AI USAGE PRINCIPLE

AI should primarily remain **backstage**.

Use AI during production for:

- development;
- asset generation;
- voice generation;
- sound generation;
- content iteration;
- testing assistance;
- code review.

Do not make “talk to an AI” the core player-facing gimmick.

Runtime AI calls should only be added where they create a meaningful experience that cannot be achieved more reliably through authored systems.

Hackathon runtime should prefer deterministic authored content where possible.

---

# 69. LONG-TERM DEVELOPMENT PRINCIPLE

The hackathon build is the first vertical slice of a larger project, not disposable prototype code.

However:

> **Long-term architecture must not become an excuse to over-engineer before the vertical slice works.**

Prefer stable interfaces and manifests over elaborate frameworks.

Maintain:

- `GAME_DESIGN.md` — canonical experience/design truth;
- `TECH_SPEC.md` — implementation contracts;
- `AGENTS.md` — development constitution;
- `ROADMAP.md` — staged expansion;
- `DECISIONS.md` — design/architecture decision log;
- `ASSET_MANIFEST.json` — asset source of truth;
- `SCENE_MANIFEST.json` — scene source of truth;
- structured narrative content files — dialogue/text source of truth.

The project must have **one source of truth per concern**.

---

# 70. DECISION LOG SEEDS

Seed `DECISIONS.md` with at least these decisions:

### ADR-001 — Reality/Cognition Separation
Objective reality remains stable; perception changes through cognition.

### ADR-002 — Player Identity
Player ≡ Charlie initially; decline creates Player cognition > Charlie cognition.

### ADR-003 — Local Branching
Dialogue branches locally and reconverges globally.

### ADR-004 — No IQ Meter
Algernon Maze communicates progression/decline.

### ADR-005 — Algernon Does Not Speak
Relationship is expressed through observed behavior and Charlie's speech/interpretation.

### ADR-006 — Decline Is Not LOW Reversal
Declining Charlie remembers previously possessed abilities.

### ADR-007 — Player Skill Remains Intact
Decline removes Charlie affordances, not player competence.

### ADR-008 — Final Room History
Every meaningful ending object must have appeared earlier.

### ADR-009 — 2.5D First
Use light 3D environments + 2D/2.5D characters before full 3D character production.

### ADR-010 — AI Backstage
Do not turn the game into an AI chatbot experience.

---

# 71. FINAL PRODUCT THESIS

The game's tragedy should not be:

> Charlie becomes stupid again.

It is:

> **The player remembers what it felt like to understand, while Charlie gradually loses access to the very abilities the player remembers possessing.**

The game begins by asking:

> **What do you see?**

At its cognitive peak, Charlie asks the world:

> **What do you see?**

And after Charlie can no longer hold everything he once understood, the game finally asks the player:

> **What do you want to remember?**

The final act is not solving a puzzle.

It is remembering.
