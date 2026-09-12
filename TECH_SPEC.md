# Technical Specification

## Initial stack
React + TypeScript + Vite, lightweight shared state, structured JSON/TypeScript content, Web Audio, and 2.5D scene primitives.

## Boundaries
Scenes consume Core APIs. Cognition is represented by a shared `CognitionState`; the Graph is one reusable system. Dialogue, audio, and assets are manifest-driven.

## Presentation contracts
Charlie uses a first-person camera and has no default visible body. NPC presentation must expose an interaction state and support lightweight motion through layered sprites, deformation, rigging, or an equivalent 2D/2.5D technique. The Algernon Maze component is persistent across scenes, renders a small 3D maze box, defaults to top-down, and exposes pointer drag orbit without blocking scene interaction.

## Reuse-first asset policy
Before custom production, check established libraries, asset stores, public-domain collections, and approved generation/audio tools. Use only assets whose license and source are recorded in `ASSET_MANIFEST.json`; do not copy unknown web assets.

Live2D-like motion is the presentation target, not a mandatory vendor choice. Evaluate ready-made rig availability and licensing before selecting Live2D Cubism, Spine, or lightweight layered animation. Start with breathing, blink, gaze, head/torso sway, expression transitions, and hover/click reactions; detailed phoneme lip-sync is deferred. Prefer a shared R3F renderer with a viewport for the maze over one extra WebGL renderer per widget.

## Definition of done
An item is `complete` only after implementation, integration, and human review of a playable path. For code changes, automated checks stay small: typecheck and build. The latest user instruction delegates functional interaction testing to the user; agents must not run playthrough/smoke interactions unless requested again. Documentation-only changes require no build.
