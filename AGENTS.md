# ALGERNON Development Constitution

## Product constraints
- Runtime language: English voice, English subtitles, Simplified Chinese subtitles.
- Objective reality stays stable; cognition changes perception and affordances.
- Player skill remains intact during decline; Charlie's access changes.
- Branch locally and converge globally. Algernon never speaks human language.
- No IQ meter, no scene-local replacements for Core systems, and no arbitrary asset paths.

## Ownership
- `src/core`, `src/state`, root configuration: Lead / Core owner.
- `src/cognition`: Cognition owner.
- `src/narrative`, `src/content`: Narrative owner.
- `src/scenes`: Scene owner for the assigned scene only.
- `src/audio`, `assets`, `ASSET_MANIFEST.json`: Audio / Assets owner.
- `project-status.json`, `project-status.html`: Lead owns schema; agents may update their status entries.

Agents must not edit another owner's area or create duplicate Dialogue, Cognition, Audio, or Asset Registry implementations. Contract changes are recorded in `DECISIONS.md` before implementation.

## Handoff and validation
Keep commits small and describe changed files, status, blockers, and next dependency. Other tools may work in this folder sequentially; read this file and `TECH_SPEC.md` first. Required checks are typecheck/build plus focused smoke checks where available. Human playtesting is the primary source for pacing, emotional impact, language quality, and usability.

## Content
Dialogue uses one beat with `en` and `zhHans` subtitle fields and optional cognition variants. English is the spoken runtime language. Copyright-safe original/adapted writing only.
