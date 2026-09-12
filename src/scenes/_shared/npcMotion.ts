export const NPC_MOTION = {
  idle: { duration: '4.8s', easing: 'ease-in-out' },
  attention: { duration: '1.2s', easing: 'cubic-bezier(.2,.8,.2,1)' },
  transition: { duration: '280ms', easing: 'ease-out' },
} as const;

export type NPCInteraction = 'hover' | 'focus' | 'click';
export function interactionLabel(name: string, action = 'Interact'): string { return `${action} with ${name}`; }
