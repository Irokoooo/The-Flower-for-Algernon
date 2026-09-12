import type { VoiceProfile } from './types';

/** Casting proposals only. No production recordings are included or implied. */
export const VOICE_PROFILES_EXAMPLE: VoiceProfile[] = [
  { id: 'voice.charlie.en', characterId: 'charlie', language: 'en', identity: 'charlie-primary', preview: { locale: 'en-US', rate: 0.94, pitch: 0.96 },
    sourceSupportedFacts: [{ fact: 'Charlie narrates the story in progress reports.', reference: 'Daniel Keyes, Flowers for Algernon (copyrighted; reference only)' }],
    proposedCasting: { agePresentation: 'adult', timbre: 'open, plainspoken, warm', temperament: 'earnest', accent: 'clear General American; proposed, not canonical', delivery: 'same identity across phases; phrasing and pacing evolve' }, status: 'proposed' },
  { id: 'voice.miss-kinnian.en', characterId: 'miss-kinnian', language: 'en', identity: 'kinnian-primary', preview: { locale: 'en-US', rate: 0.98, pitch: 1.08 },
    sourceSupportedFacts: [{ fact: 'Miss Kinnian is Charlie’s teacher and advocate.', reference: 'Daniel Keyes, Flowers for Algernon (copyrighted; reference only)' }],
    proposedCasting: { agePresentation: 'adult', timbre: 'clear, patient, grounded', temperament: 'empathetic', accent: 'clear Midwestern American; proposed, not canonical', delivery: 'measured classroom warmth' }, status: 'proposed' },
  { id: 'voice.dr-strauss.en', characterId: 'dr-strauss', language: 'en', identity: 'strauss-primary', preview: { locale: 'en-GB', rate: 0.91, pitch: 0.88 },
    sourceSupportedFacts: [{ fact: 'Dr. Strauss is a scientist involved in the procedure.', reference: 'Daniel Keyes, Flowers for Algernon (copyrighted; reference only)' }],
    proposedCasting: { agePresentation: 'adult', timbre: 'precise, restrained', temperament: 'clinical', accent: 'neutral English; proposed, not canonical', delivery: 'controlled professional cadence' }, status: 'proposed' },
];

