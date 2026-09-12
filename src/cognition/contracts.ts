/** Core owns persistence and transitions; this module owns domain vocabulary only. */
import type { CognitionPhase } from '../core/types';
export type { CognitionPhase, CognitionState } from '../core/types';

export interface PerceivedLabel {
  readonly en: string;
  readonly zhHans: string;
}

export interface CognitionNode {
  readonly id: string;
  /** Coordinates in the graph's 0..100 view space. */
  readonly x: number;
  readonly y: number;
  readonly label: PerceivedLabel;
  readonly perceivedLabels?: Partial<Record<CognitionPhase, PerceivedLabel>>;
}

export interface CognitionEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly meaning: PerceivedLabel;
  readonly phases: readonly CognitionPhase[];
  readonly requiredAffordance?: string;
}

/** Objective structure stays unchanged when perception changes. */
export interface CognitionGraphModel {
  readonly nodes: readonly CognitionNode[];
  readonly edges: readonly CognitionEdge[];
}

export interface MazePoint { readonly x: number; readonly y: number }
export interface MazeWall { readonly id: string; readonly from: MazePoint; readonly to: MazePoint }
export interface MazeBoxModel {
  /** Normalized 0..1 coordinates, shared with a future 3D renderer. */
  readonly walls: readonly MazeWall[];
  /** Core/scene supplies the position; this component never simulates cognition. */
  readonly algernon: {
    readonly present: boolean;
    readonly position: MazePoint;
    readonly headingDegrees: number;
    readonly behavior: 'running' | 'hesitating' | 'resting';
  };
}

export interface MazeView { readonly tilt: number; readonly rotation: number }
export const TOP_DOWN_VIEW: MazeView = { tilt: 0, rotation: 0 };
export function clampMazeView(view: MazeView): MazeView {
  return {
    tilt: Number.isFinite(view.tilt) ? Math.max(0, Math.min(65, view.tilt)) : 0,
    rotation: Number.isFinite(view.rotation) ? ((view.rotation % 360) + 360) % 360 : 0,
  };
}
