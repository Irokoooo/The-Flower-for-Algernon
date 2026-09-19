import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** Local, Y-up GLB only. Fits a tabletop prop without changing its source proportions. */
export function loadDeskModel(options: {
  url: string; world: THREE.Scene; surfaces: THREE.Mesh[]; fallback: THREE.Mesh;
  hotspot: 'book' | 'paper' | 'bread'; footprint: [number, number]; center: [number, number]; tableY: number;
}): () => void {
  let cancelled = false;
  let roots: THREE.Object3D[] = [];
  let placement: THREE.Group | undefined;
  const meshes: THREE.Mesh[] = [];
  const { world, surfaces, fallback } = options;
  const manager = new THREE.LoadingManager();
  // Reject remote model URLs AND any external model dependencies before fetching them.
  manager.setURLModifier(value => {
    if (value.startsWith('blob:') || value.startsWith('data:')) return value;
    const resolved = new URL(value, window.location.href);
    if (resolved.origin !== window.location.origin || !['http:', 'https:'].includes(resolved.protocol)) {
      throw new Error('Desk models and their dependencies must be served locally.');
    }
    return resolved.href;
  });
  function disposeResources() {
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    const skeletons = new Set<THREE.Skeleton>();
    roots.forEach(root => root.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      (Array.isArray(object.material) ? object.material : [object.material]).forEach(mat => {
        materials.add(mat);
        Object.values(mat).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); });
      });
      if (object instanceof THREE.SkinnedMesh) skeletons.add(object.skeleton);
    }));
    geometries.forEach(value => value.dispose());
    materials.forEach(value => value.dispose());
    const images = new Set<ImageBitmap>();
    textures.forEach(value => {
      if (typeof ImageBitmap !== 'undefined' && value.image instanceof ImageBitmap) images.add(value.image);
      value.dispose();
    });
    images.forEach(value => value.close());
    skeletons.forEach(value => value.dispose());
    roots = [];
  }
  try {
    new GLTFLoader(manager).load(options.url, gltf => {
      roots = gltf.scenes;
      if (!roots.includes(gltf.scene)) roots.push(gltf.scene);
      if (cancelled) { disposeResources(); return; }
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model, true);
      const size = bounds.getSize(new THREE.Vector3());
      if (bounds.isEmpty() || ![size.x,size.y,size.z].every(Number.isFinite) || size.x <= 0 || size.z <= 0) {
        disposeResources(); return;
      }
      model.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.userData.hotspot = options.hotspot;
          object.castShadow = object.receiveShadow = true;
          meshes.push(object);
        }
      });
      if (!meshes.length) { disposeResources(); return; }
      const scale = Math.min(options.footprint[0]/size.x, options.footprint[1]/size.z);
      const center = bounds.getCenter(new THREE.Vector3());
      placement = new THREE.Group();
      placement.add(model); placement.scale.setScalar(scale);
      placement.position.set(options.center[0]-center.x*scale, options.tableY-bounds.min.y*scale, options.center[1]-center.z*scale);
      world.add(placement); placement.updateMatrixWorld(true);
      surfaces.push(...meshes);
      fallback.visible = false;
      const index = surfaces.indexOf(fallback);
      if (index !== -1) surfaces.splice(index,1);
    }, undefined, () => { /* A failed model leaves the existing clickable blockout in place. */ });
  } catch { /* Invalid/nonlocal URL: retain blockout. */ }
  return () => {
    cancelled = true;
    placement?.removeFromParent();
    for (const mesh of meshes) { const index=surfaces.indexOf(mesh); if(index!==-1)surfaces.splice(index,1); }
    disposeResources();
    fallback.visible=true;
    if (!surfaces.includes(fallback)) surfaces.push(fallback);
  };
}
