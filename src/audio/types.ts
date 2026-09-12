/** Audio consumes perception parameters; Cognition remains the state owner. */
export interface AudioPerception {
  lowpassHz: number;
  voiceGain: number;
  ambienceGain: number;
  transitionSeconds: number;
}

export interface VoiceProfile {
  id: string;
  characterId: string;
  language: 'en';
  /** Stable casting identity, including across Charlie's cognition phases. */
  identity: string;
  sourceSupportedFacts: Array<{ fact: string; reference: string }>;
  proposedCasting: {
    agePresentation: string;
    timbre: string;
    temperament: string;
    accent: string;
    delivery: string;
  };
  status: 'proposed' | 'approved' | 'recorded';
  preview?: { locale: string; rate: number; pitch: number; preferredVoiceName?: string };
}

export interface SpeechPreviewState {
  available: boolean;
  reason: 'browser-speech-synthesis' | 'no-browser-support' | 'english-voice-unavailable';
  voiceName?: string;
}

export interface AssetProvenance {
  source: { kind: 'original' | 'licensed' | 'public-domain' | 'generated'; url: string | null; creator: string };
  license: { identifier: string; evidence: string | null; attribution: string; reviewed: boolean };
  adaptations: string[];
}

/** Returned by the Core registry, never constructed from scene-local paths. */
export interface AudioAsset {
  id: string;
  url: string;
  kind: 'voice' | 'ambience' | 'sfx';
  language?: 'en';
  voiceProfileId?: string;
  provenance: AssetProvenance;
}

export type ResolveAudioAsset = (id: string) => AudioAsset | Promise<AudioAsset>;

export interface PlaybackHandle {
  stop(): void;
  /** Resolves for natural completion, interruption, and manager disposal. */
  ended: Promise<void>;
}
