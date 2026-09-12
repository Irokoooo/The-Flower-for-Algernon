# Diary audio handoff

`pencil-writing.wav` is an original procedural 0.95s mono 22050Hz PCM WAV created
with `generate-pencil.mjs`. Five soft friction strokes, no third-party samples.
LicenseRef-ALGERNON-Original-Prototype: supplied for use, modification and distribution
within ALGERNON. Human listening/mix review pending.

Merge `diary-manifest-proposal.json` in the Lead registry. Use the existing manager:
`audio.playSound('audio.diary.pencil')` when a fragment is placed. Avoid overlapping
bursts on rapid repeated input by stopping the previous SFX handle.
`src/audio/diary-audio.ts` maps only successfully saved phrase assets by fragment ID.
Missing phrase audio means silent text, never speechSynthesis or a client-side API call.
English text remains Darwin-owned; echo voice identity and speed 0.85 remain constant.

2026-09-12 integration: pencil asset merged into ASSET_MANIFEST.json and shared
AudioManager placement playback. One diagnostic for "I" returned HTTP 429
upstream_rate_limit (provider group saturated). No MP3 saved, no batch or retry.
See diary-production/sdk-ledger.json. $0.01 request reservation sits within the
Lead's $1 diary allocation; actual billing remains unknown. The exclusive ledger
guard prevents accidental repeat calls. Typecheck/build pass; human listening pending.
