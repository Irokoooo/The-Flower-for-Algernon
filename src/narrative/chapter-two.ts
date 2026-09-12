import type { CognitionPhase, DialogueBeat } from '../core/types';
import type { CognitionGraphModel } from '../cognition/contracts';

export type ChapterText = DialogueBeat['subtitles'];
export type ChapterAction =
  | { kind: 'inspect'; targetId: string }
  | { kind: 'place'; targetId: string; itemId: string }
  | { kind: 'connect'; edgeId: string }
  | { kind: 'choose'; targetId: string; optionId: string };
export interface ChapterRequirement {
  id: string;
  action: ChapterAction;
  /** All prerequisites must have been fulfilled before this action. */
  after?: readonly string[];
}
export interface ChapterVoiceLine extends DialogueBeat {
  voiceAsset: string;
  language: 'en';
  productionStatus: 'script-only';
}
export interface ChapterStep {
  id: string;
  sceneId: 'classroom' | 'algernon-maze' | 'investigation' | 'research' | 'conference';
  phase: CognitionPhase;
  title: ChapterText;
  objective: ChapterText;
  /** Facts visible in the world; never replace these when phase changes. */
  stimulus: { id: string; facts: ChapterText };
  perception: Record<CognitionPhase, ChapterText>;
  graph: CognitionGraphModel;
  requirements: readonly ChapterRequirement[];
  options?: readonly { targetId: string; optionId: string; label: ChapterText; lineId: string }[];
  dialogueIds: readonly string[];
  /** Hold the unfinished lecture until the player predicts; no speed-test timeout. */
  presentation?: { holdConclusionUntilRequirementId: string; conclusion: ChapterText };
  perceptionLineIds: Record<CognitionPhase, string>;
  /** Only transition after every requirement is satisfied. Never a generic Next action. */
  nextStepId?: string;
}
export interface ChapterProgress { readonly completed: readonly string[] }
function sameAction(a: ChapterAction, b: ChapterAction): boolean {
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case 'inspect': return b.kind === 'inspect' && a.targetId === b.targetId;
    case 'place': return b.kind === 'place' && a.targetId === b.targetId && a.itemId === b.itemId;
    case 'connect': return b.kind === 'connect' && a.edgeId === b.edgeId;
    case 'choose': return b.kind === 'choose' && a.targetId === b.targetId && a.optionId === b.optionId;
  }
}
/** Pure interaction gate. Core owns persistence, camera, graph rendering and scene transitions. */
export function applyChapterAction(step: ChapterStep, progress: ChapterProgress, action: ChapterAction) {
  const validIds = new Set(step.requirements.map(requirement => requirement.id));
  const completed = new Set(progress.completed.filter(id => validIds.has(id)));
  const matches = step.requirements.filter(requirement =>
    !completed.has(requirement.id) && sameAction(requirement.action, action)
    && (requirement.after ?? []).every(id => completed.has(id)));
  matches.forEach(requirement => completed.add(requirement.id));
  const ready = step.requirements.length > 0 && step.requirements.every(requirement => completed.has(requirement.id));
  return { progress: { completed: [...completed] }, accepted: matches.length > 0, ready,
    nextStepId: ready ? step.nextStepId : undefined };
}
