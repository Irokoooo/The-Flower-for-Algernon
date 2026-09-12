# ALGERNON Development Constitution

## Product constraints
- Runtime language: English voice, English subtitles, Simplified Chinese subtitles.
- Objective reality stays stable; cognition changes perception and affordances.
- Player skill remains intact during decline; Charlie's access changes.
- Branch locally and converge globally. Algernon never speaks human language.
- No IQ meter, no scene-local replacements for Core systems, and no arbitrary asset paths.
- Charlie is first-person: no third-person avatar or recurring Charlie portrait. Voice and interaction convey his presence. Hands, shadows, or reflections are optional authored assets, not a default production requirement.
- NPCs are interactive 2D/2.5D illustrated characters. Prefer rigged or parameterized motion (Live2D-style deformation, layered sprites, puppet animation, or equivalent) over static portraits.
- Algernon's maze is a persistent, interactive 3D maze-box widget. It remains visible in a corner as a cognition indicator, supports drag orbit/inspection, and defaults to a top-down view.

## Ownership
- `src/core`, `src/state`, root configuration: Lead / Core owner.
- `src/cognition`: Cognition owner.
- `src/narrative`, `src/content`: Narrative owner.
- `src/scenes`: Scene owner for the assigned scene only.
- `src/audio`, `assets`, `ASSET_MANIFEST.json`: Audio / Assets owner.
- `project-status.json`, `project-status.html`: Lead owns schema; agents may update their status entries.

Agents must not edit another owner's area or create duplicate Dialogue, Cognition, Audio, or Asset Registry implementations. Contract changes are recorded in `DECISIONS.md` before implementation.

## Voice and asset sourcing
English is the runtime voice language. Each recurring character gets a distinct voice profile based on role, age, temperament, and an intentional accent; accents must remain consistent and understandable. Algernon has no human voice. Prefer existing reliable tools, libraries, public-domain or correctly licensed assets, and established production pipelines before building custom replacements. Record source, license, attribution, and adaptation notes in the asset manifest.

Separate source-supported character facts from proposed casting. Do not invent accents and claim they are canonical. Charlie retains the same recognizable voice identity across cognition phases; authored wording and delivery change. Both subtitle languages follow perceived meaning and must not reveal information Charlie cannot access.

The maze communicates behavior, never an IQ percentage or numeric cognition bar. Provide reset-to-top-view; dragging the widget must not move the scene camera. Preserve the empty maze after Algernon leaves. Narrative-required views and the epilogue may intentionally suspend the widget.

## Handoff and validation
Keep commits small and describe changed files, status, blockers, and next dependency. Other tools may work in this folder sequentially; read this file and `TECH_SPEC.md` first. Required checks are typecheck/build plus focused smoke checks where available. Human playtesting is the primary source for pacing, emotional impact, language quality, and usability.

## Content
Dialogue uses one beat with `en` and `zhHans` subtitle fields and optional cognition variants. English is the spoken runtime language. Copyright-safe original/adapted writing only.
