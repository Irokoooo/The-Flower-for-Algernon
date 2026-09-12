# Carson / Lead integration

Current spoken text is frozen as 15 exact-string jobs in `voice-jobs.json`.
Original source hashes remain provenance; UI-only edits no longer block generation.
Voice generation is BLOCKED: authorized speech request returned HTTP 403. No MP3
was saved. Two requests have reservations (first failed without classified cause,
second HTTP 403); neither is automatically retried. Upper reservation $0.0058515,
actual billing unknown. Provider pricing evidence is in `pricing-evidence.json`.
The 20-second music WAV exists and can be integrated now.

```ts
import { voiceForText } from './audio/production-voices';
const voice = voiceForText(line.en);
if (voice) {
  setSpeaker(voice.speaker);
  await audio.unlock(); // first call within Start/interaction user gesture
  const handle = await audio.playVoice(voice.assetId);
  // Guard async completion against newer dialogue/closed UI in App.
  setSpeaking(true);
  await handle.ended;
  setSpeaking(false);
}
```

Registry: merge output records from `assets/audio/production/manifest-proposal.json`.
Expand the central Vite glob to `../../assets/audio/**/*.{wav,mp3}` and return
`language: 'en'` and `voiceProfileId` for voice assets along with URL/provenance.
Keep the Core registry as the only URL resolver. Unknown text or missing files show
audio unavailable; never invoke browser speech synthesis or a frontend provider API.
Dr. Strauss uses onyx, Gimpy fable, Charlie echo in every phase. Correct speaker
labels via this mapping even where App currently overrides the default speaker.
Music ID: `audio.music.still-room`; merge `music/manifest-proposal.json` and loop via
`playSound(id, true)`. Human listening and mix review remain pending.



Latest: single authorized SDK diagnostic for “What do you see?” / onyx timed out
with APITimeoutError (60s, max_retries=0). No MP3 and no batch continuation.
Combined upper reservation $0.0158515; actual billing unknown. Music is now
registered and connected in App Start with duplicate-loop guard, verified in code.
