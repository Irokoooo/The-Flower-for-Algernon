export type HotspotRoom = 'laboratory' | 'bakery';
/** Renderer IDs are spatial objects; App IDs express the authored interaction. */
export function normalizeHotspot(id: string, room: HotspotRoom): string {
  const aliases: Record<string, string> = {
    book: room === 'bakery' ? 'bread-shelf' : 'lab-cabinet',
    paper: 'research-notes',
    test: 'test-desk',
    npc: room === 'bakery' ? 'baker' : 'researcher',
    machine: 'oven',
    bread: 'bread-counter',
    mouse: 'algernon-maze',
  };
  return aliases[id] ?? id;
}
