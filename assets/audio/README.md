# Audio asset intake

Three usable original generated WAV prototypes are included: room tone (loop), soft paper and soft chime (one-shots). See `asset-candidates.json` for exact filenames, IDs, hashes and provenance, and `PROVENANCE.md` for generation/license notes. No production voice recordings exist. `AudioManager.previewVoice()` uses browser speech synthesis for temporary auditions only.

## Researched candidates

- **howler.js** — mature Web Audio/HTML5 playback library, MIT license: https://github.com/goldfire/howler.js/blob/master/LICENSE.md. Candidate integration only; current manager uses native Web Audio to avoid an extra dependency.
- **Historical rhasspy/piper** — MIT text was fetched from https://raw.githubusercontent.com/rhasspy/piper/master/LICENSE.md on 2026-09-12. This is a mutable branch, not a pinned release or a claim about current Piper distributions. Current repository/version and model licenses remain unverified; a later README fetch failed. Do not adopt without checking the exact distribution and model.
- **Freesound** — large sound library: https://freesound.org/. Candidate source for ambience/SFX only; each chosen file must record its exact URL, creator, license, and attribution. No Freesound file is included yet.

Do not copy candidate files into this folder until provenance is approved and the Lead adds them to `ASSET_MANIFEST.json`.

Howler's linked license was fetched successfully (MIT); no version is pinned. Freesound was not fetched and remains an unverified source candidate, not a selected asset.

## Minimal App API

Create one app-owned manager with the Core registry's audio resolver. The Core adapter must supply `AudioAsset` records (including the bundled URL and provenance); Core's basic `AssetRecord` alone does not currently contain those fields. Register the three `assets` entries from `asset-candidates.json` first. Resolve WAV URLs in the central asset adapter with Vite `new URL('./relative-file.wav', import.meta.url).href`, relative to that adapter, so production builds include them. Do not put raw paths in scene components.

```ts
import { AudioManager, VOICE_PROFILES_EXAMPLE, PERCEPTION_PRESETS } from './audio';
import type { ResolveAudioAsset, PlaybackHandle } from './audio';

// Inject the Core-owned adapter; this does not create a second registry.
export function createAppAudio(resolveAudioAsset: ResolveAudioAsset) {
  const audio = new AudioManager(resolveAudioAsset);
  let room: PlaybackHandle | undefined;
  return {
    // Invoke once from an explicit Start/Enable audio button; disable while pending.
    async start() {
      await audio.unlock();
      room?.stop();
      room = await audio.playSound('audio.room-tone.prototype', true);
    },
    async paper() { await audio.unlock(); return audio.playSound('audio.paper.prototype'); },
    // Invoke from a preview button; pass Narrative's perceived English text only.
    preview(perceivedEnglish: string) {
      return audio.previewVoice(perceivedEnglish, VOICE_PROFILES_EXAMPLE[0]);
    },
    availability() { return audio.previewState; },
    soften() { audio.setPerception(PERCEPTION_PRESETS.softened); },
    stopVoice() { audio.stopVoice(); },
    async dispose() { await audio.dispose(); },
  };
}
```

Display “Provisional browser voice” for a successful preview, including the returned voice name. Display “English preview voice unavailable” when `available` is false. Voice lists can arrive asynchronously: re-read `audio.previewState` on `speechSynthesis`'s `voiceschanged` event and remove that listener on cleanup. Multiple characters can fall back to the same installed voice; accents are not guaranteed. Browser speech may depend on network services and bypasses Web Audio perception filters. Preview delivery is provisional, never a substitute for authored perceived dialogue or production voice files. Stop preview with `stopVoice()`; dispose the manager when the application audio owner unmounts.
