import { firstSlice } from './first-slice';
export const openingDialogue = firstSlice.filter(beat => beat.id === 'lab.test');
