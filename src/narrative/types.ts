import type { DialogueBeat as CoreDialogueBeat, CognitionPhase } from '../core/types';
export type { CognitionPhase };
export interface SubtitlePair { en:string; zhHans:string }
export type CognitionVariant = { phase: Lowercase<CognitionPhase>; subtitles: SubtitlePair; delivery?: string };
export type DialogueSpeaker = string;
export interface DialogueChoice { id:string; label:SubtitlePair; branchBeatId:string; convergesAt:string }
export interface DialogueBeat extends CoreDialogueBeat {
  sceneId:string; stimulusId:string; voiceAsset:string; nextBeatId?:string; tags:string[];
  choices?:DialogueChoice[];
  perceivedText?: Partial<Record<CognitionPhase, SubtitlePair>>;
  perceivedVoiceAssets?: Partial<Record<CognitionPhase,string>>;
}

