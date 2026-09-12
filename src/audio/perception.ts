import type { AudioPerception } from './types';

/** Listening-tuning examples, not an alternative CognitionState or phase model. */
export const PERCEPTION_PRESETS = {
  clear: { lowpassHz: 18000, voiceGain: 1, ambienceGain: 0.35, transitionSeconds: 0.35 },
  softened: { lowpassHz: 4200, voiceGain: 1, ambienceGain: 0.25, transitionSeconds: 0.8 },
  strained: { lowpassHz: 6500, voiceGain: 0.95, ambienceGain: 0.18, transitionSeconds: 1.2 },
} satisfies Record<string, AudioPerception>;

export function normalizePerception(value: AudioPerception, sampleRate: number): AudioPerception {
  const clamp = (n: number, min: number, max: number) => {
    if (!Number.isFinite(n)) throw new Error('Audio perception values must be finite');
    return Math.min(max, Math.max(min, n));
  };
  return {
    lowpassHz: clamp(value.lowpassHz, 80, Math.min(20000, sampleRate / 2)),
    voiceGain: clamp(value.voiceGain, 0, 1),
    ambienceGain: clamp(value.ambienceGain, 0, 1),
    transitionSeconds: clamp(value.transitionSeconds, 0.01, 10),
  };
}
