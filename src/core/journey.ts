import type { CognitionPhase } from './types';

/** Story achievement, independent of the room currently being visited. */
export type JourneyMilestone = 'preoperative' | 'recovering' | 'noticing' | 'understanding' | 'peak' | 'declining';
export const JOURNEY_PHASE: Record<JourneyMilestone, CognitionPhase> = {
  preoperative:'LOW', recovering:'LOW', noticing:'ASCENDING', understanding:'ASCENDING', peak:'PEAK', declining:'DECLINE',
};
export const JOURNEY_ORDER: JourneyMilestone[] = ['preoperative','recovering','noticing','understanding','peak','declining'];
/** Advancing a scene never implicitly advances cognition. Preop and recovery stay LOW. */
export function advanceJourney(current: JourneyMilestone, next: JourneyMilestone): JourneyMilestone {
  return JOURNEY_ORDER.indexOf(next) > JOURNEY_ORDER.indexOf(current) ? next : current;
}
