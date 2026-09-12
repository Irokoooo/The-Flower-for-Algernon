export type CognitionPhase = 'LOW' | 'ASCENDING' | 'PEAK' | 'DECLINE';
export interface CognitionState { phase: CognitionPhase; affordances: string[]; perceivedDetail: number; }
export interface DialogueBeat { id: string; speaker: string; voiceAsset?: string; subtitles: { en: string; zhHans: string }; perceivedText?: Partial<Record<CognitionPhase, { en: string; zhHans: string }>>; }
export interface AssetRecord { id: string; kind: 'image' | 'audio' | 'font' | 'model' | 'other'; source: string; license: string; attribution?: string; status: 'planned' | 'available' | 'verified'; }
export interface AssetRegistry { get(id: string): AssetRecord | undefined; list(): AssetRecord[]; register(asset: AssetRecord): void; }
export interface MazeState { visible: boolean; rotation: { x: number; y: number }; algernonPresent: boolean; runProgress: number; }
