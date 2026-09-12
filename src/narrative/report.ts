import type { CognitionPhase } from '../core/types';
import { firstSlice } from '../content/first-slice';
export interface ReportDraft {
  rawText: string; stimulusId: string; savedAt: string;
  expressedText: string; phase: CognitionPhase; transformation: 'none' | 'modest-spelling-v1';
}
/** At most two whole-word spelling slips; no substitution of meaning, names or sentences. */
export function transformDeclinedReport(text: string): string {
  let remaining = 2;
  return text.replace(/\b(because|remember|really)\b/g, word => {
    if (remaining === 0) return word;
    remaining--;
    return ({ because: 'becuase', remember: 'remeber', really: 'realy' } as Record<string,string>)[word];
  });
}
export function saveProgressReport(rawText: string, stimulusId: string, phase: CognitionPhase = 'PEAK'): ReportDraft {
  const expressedText = phase === 'DECLINE' ? transformDeclinedReport(rawText) : rawText;
  return { rawText, stimulusId, phase, savedAt: new Date().toISOString(), expressedText,
    transformation: expressedText === rawText ? 'none' : 'modest-spelling-v1' };
}
export function preserveFinalMemory(rawText: string): string { return rawText; }
export const reportPrompt = firstSlice.find(beat => beat.id === 'diary.prompt')!;

