import type { CognitionPhase } from '../core/types';
import type { DialogueBeat } from './types';
/** Resolve both subtitle languages atomically; do not replay base audio against changed words. */
export function resolveDialogue(beat: DialogueBeat, phase: CognitionPhase) {
  const variant = beat.perceivedText?.[phase];
  return {
    subtitles: variant ?? beat.subtitles,
    voiceAsset: variant ? beat.perceivedVoiceAssets?.[phase] : beat.voiceAsset,
    speaker: beat.speaker,
    stimulusId: beat.stimulusId
  };
}
