import type { AssetRecord, AssetRegistry } from './types';
export class InMemoryAssetRegistry implements AssetRegistry { private assets = new Map<string, AssetRecord>(); get(id: string) { return this.assets.get(id); } list() { return [...this.assets.values()]; } register(asset: AssetRecord) { this.assets.set(asset.id, asset); } }
