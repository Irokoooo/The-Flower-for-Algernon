import { firstSlice } from './first-slice';
export const psychologicalTestDialogue = firstSlice.filter(beat => beat.sceneId === 'lab');
