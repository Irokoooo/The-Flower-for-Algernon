import manifest from '../../ASSET_MANIFEST.json';
import { InMemoryAssetRegistry } from './asset-registry';

const files = import.meta.glob(['../../assets/characters/*-cutout.png', '../../assets/environments/*.png'], {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>;
const slots = {
  researcher: 'assets/characters/researcher-cutout.png',
  'researcher-reaction': 'assets/characters/researcher-concerned-cutout.png',
  baker: 'assets/characters/baker-cutout.png',
  'baker-reaction': 'assets/characters/baker-welcoming-cutout.png',
  alice: 'assets/characters/alice-cutout.png',
  'alice-reaction': 'assets/characters/alice-encouraging-cutout.png',
  'charlie-hands': 'assets/characters/charlie-hands-cutout.png',
  'lab-wall': 'assets/environments/lab-wall.png',
  'bakery-wall': 'assets/environments/bakery-wall.png',
  'wood-floor': 'assets/environments/wood-floor.png',
} as const;
export type VisualAssetId = keyof typeof slots;
export const visualRegistry = new InMemoryAssetRegistry();
for (const [id, filename] of Object.entries(slots)) {
  const metadata = manifest.assets.find(entry => 'filename' in entry && entry.filename === filename);
  visualRegistry.register({ id, kind: 'image', source: filename,
    license: metadata?.license ?? 'Generated asset; provenance review pending',
    status: files[`../../${filename}`] ? 'available' : 'planned' });
}
/** Missing production slots are omitted; never substitute the rejected procedural art. */
export function resolveVisualAsset(id: VisualAssetId): string | undefined {
  const asset = visualRegistry.get(id);
  return asset ? files[`../../${asset.source}`] : undefined;
}
export function getRoomVisuals(scene: 'laboratory' | 'bakery') {
  return { floor: resolveVisualAsset('wood-floor'),
    walls: resolveVisualAsset(scene === 'laboratory' ? 'lab-wall' : 'bakery-wall'),
    npc: resolveVisualAsset(scene === 'laboratory' ? 'researcher' : 'baker'),
    npcReaction: resolveVisualAsset(scene === 'laboratory' ? 'researcher-reaction' : 'baker-reaction'),
    hands: resolveVisualAsset('charlie-hands') };
}
