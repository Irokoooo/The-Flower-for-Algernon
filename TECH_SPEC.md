# Technical Specification

## Initial stack
React + TypeScript + Vite, lightweight shared state, structured JSON/TypeScript content, Web Audio, and 2.5D scene primitives.

## Boundaries
Scenes consume Core APIs. Cognition is represented by a shared `CognitionState`; the Graph is one reusable system. Dialogue, audio, and assets are manifest-driven.

## Definition of done
An item is `complete` only after implementation, integration, and a focused human-reviewable play path. Automated checks stay small: typecheck, build, and critical-path smoke checks.
