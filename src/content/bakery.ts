import { firstSlice } from './first-slice';
export const bakeryDialogue = firstSlice.filter(beat => beat.sceneId.startsWith('bakery'));
