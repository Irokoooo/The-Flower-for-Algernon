import type { CognitionPhase } from '../core/types';
/** A fixed corridor route. All phases share objective maze geometry. */
export const MAZE_ROUTE = [[-2,2],[-2,0],[0,0],[0,2],[2,2],[2,-2],[0,-2],[0,-1],[-2,-1],[-2,-2]] as const;
export function sampleMouse(seconds: number, phase: CognitionPhase) {
  const t = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  let distance: number;
  if (phase === 'PEAK') distance = t * 1.4;
  else if (phase === 'ASCENDING') distance = t * .7 + Math.min(t * t * .006, t * .5);
  else if (phase === 'LOW') distance = Math.floor(t / 5) * 2.1 + Math.min(t % 5, 3) * .7;
  else { // Authored hesitation and backtracking, not LOW reversed.
    const cycle = t % 9;
    distance = Math.floor(t / 9) * 1.4 + (cycle < 3 ? cycle * .7 : cycle < 5 ? 2.1 : cycle < 7 ? 2.1 - (cycle - 5) * .35 : 1.4);
  }
  const segments = MAZE_ROUTE.slice(1).map((p,i) => Math.hypot(p[0]-MAZE_ROUTE[i][0], p[1]-MAZE_ROUTE[i][1]));
  const length = segments.reduce((a,b) => a+b,0);
  // Ping-pong the corridor rather than teleport across walls on loop boundaries.
  const wrapped = distance % (length * 2);
  const backwards = wrapped > length;
  let remaining = backwards ? length * 2 - wrapped : wrapped;
  let index = 0;
  while (index < segments.length - 1 && remaining > segments[index]) remaining -= segments[index++];
  const a = MAZE_ROUTE[index], b = MAZE_ROUTE[index+1], ratio = remaining / segments[index];
  const retreat = phase === 'DECLINE' && t % 9 >= 5 && t % 9 < 7;
  return { x:a[0]+(b[0]-a[0])*ratio, z:a[1]+(b[1]-a[1])*ratio,
    heading:Math.atan2(b[0]-a[0], b[1]-a[1]) + ((backwards !== retreat) ? Math.PI : 0) };
}
