import manifest from '../../ASSET_MANIFEST.json';
import type { AudioAsset } from '../audio/types';
const files = import.meta.glob('../../assets/audio/*.wav', {eager:true,query:'?url',import:'default'}) as Record<string,string>;
export function resolveAudioAsset(id:string): AudioAsset {
 const entry=manifest.assets.find(a=>a.id===id);
 if(!entry || !('filename' in entry) || !entry.filename || !('provenance' in entry) || !entry.provenance) throw Error(`Audio asset not registered: ${id}`);
 const url=files[`../../${entry.filename}`];
 if(!url) throw Error(`Audio asset missing: ${id}`);
 return {id,url,kind:entry.kind as AudioAsset['kind'],provenance:entry.provenance as AudioAsset['provenance']};
}
