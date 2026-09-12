import type { ReportDraft } from '../narrative/report';

export interface Checkpoint {
  version: 1;
  savedAt: string;
  step: 'bakery' | 'machine' | 'chapter' | 'empty-room';
  chapterId: string;
  diaries: Record<string, ReportDraft>;
  observed: string[];
  bread: number;
  choice: string;
  intent: string;
}
// Additive v1 extension: old first/peak/last records remain readable and unmodified.
const key = 'algernon.diary-checkpoint.v1';
const phases = ['LOW', 'ASCENDING', 'PEAK', 'DECLINE'];
function isReport(value: unknown): value is ReportDraft {
  if (!value || typeof value !== 'object') return false;
  const report = value as ReportDraft;
  return typeof report.rawText === 'string' && typeof report.expressedText === 'string'
    && typeof report.stimulusId === 'string' && typeof report.savedAt === 'string'
    && Number.isFinite(Date.parse(report.savedAt)) && phases.includes(report.phase)
    && ['none', 'modest-spelling-v1'].includes(report.transformation);
}
export function loadCheckpoint(): { checkpoint?: Checkpoint; error?: string } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || !['bakery', 'machine', 'chapter', 'empty-room'].includes(data.step)
      || !['classroom-a', 'classroom-b', 'classroom-c', 'algernon-first-failure', 'investigation', 'shared-procedure', 'research', 'conference'].includes(data.chapterId)
      || typeof data.savedAt !== 'string' || !Number.isFinite(Date.parse(data.savedAt))
      || !Array.isArray(data.observed) || !data.observed.every((id: unknown) => typeof id === 'string')
      || !Number.isInteger(data.bread) || data.bread < 0 || data.bread > 3
      || typeof data.choice !== 'string' || typeof data.intent !== 'string'
      || !data.diaries || typeof data.diaries !== 'object' || Array.isArray(data.diaries)) throw Error();
    const reports = Object.entries(data.diaries);
    if (!reports.length || reports.some(([id, report]) => !['first', 'ascending', 'peak', 'last'].includes(id) || !isReport(report))) throw Error();
    return { checkpoint: data };
  } catch {
    return { error: 'Saved checkpoint could not be read. It has been kept unchanged. / 存档无法读取，原数据已保留。' };
  }
}
export function saveCheckpoint(checkpoint: Checkpoint): boolean {
  try { localStorage.setItem(key, JSON.stringify(checkpoint)); return true; }
  catch { return false; }
}
