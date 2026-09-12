import type { CognitionState, MazeState } from '../core/types';
import type { FlowStep } from '../core/flow';
export interface GameState { cognition: CognitionState; maze: MazeState; sceneId: string; flow: { step: FlowStep; cognitionGain: boolean }; }
export const initialGameState: GameState = { sceneId: 'opening-lab', flow: { step: 'title', cognitionGain: false }, cognition: { phase: 'LOW', affordances: [], perceivedDetail: 0.35 }, maze: { visible: true, rotation: { x: 65, y: 0 }, algernonPresent: true, runProgress: 0 } };
