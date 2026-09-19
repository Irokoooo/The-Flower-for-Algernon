import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FirstPersonControls } from '../../core/first-person-controls';
import './explorable-room.css';
import { loadDeskModel } from './desk-model';

export type RoomScene = 'laboratory' | 'bakery' | 'classroom' | 'research' | 'private-room';
/** Learning-room art uses walls; model URLs must come from the caller's Asset Registry. */
export type RoomAssets = Partial<Record<'floor' | 'walls' | 'backdrop' | 'npc' | 'npcReaction' | 'hands' | 'foreground' | 'bookModel' | 'diaryModel' | 'breadModel', string>>;
export interface ExplorableRoomProps {
  scene: RoomScene;
  /** URLs resolved by the caller's Asset Registry. NPC/foreground require transparent raster images. */
  assets?: RoomAssets;
  onInteract?: (hotspotId: string) => void;
  paused?: boolean;
  /** Swap to a same-size, aligned whole-figure expression PNG (not a face overlay). */
  npcReacting?: boolean;
  /** Display label only; interaction callbacks still emit npc. */
  npcName?: string;
  /** Display-only action labels; never remaps physical hotspot IDs. */
  hotspotLabels?: Partial<Record<string, string>>;
}
const EMPTY_ASSETS: RoomAssets = {};

/** Metre-scale blockout geometry; illustrated art exists ONLY when supplied as raster textures. */
export function ExplorableRoom({ scene: room, assets = EMPTY_ASSETS, onInteract, paused = false, npcReacting = false, npcName, hotspotLabels: labelOverrides }: ExplorableRoomProps) {
  const hotspotLabels: Record<string, string> = {
    npc: npcName ?? (room === 'bakery' ? 'Gimpy / 金皮' : 'Dr. Strauss / 施特劳斯医生'),
    book: 'Book / 书籍',
    paper: 'Diary / 日记本',
    test: 'Test desk / 测试桌',
    mouse: "Algernon’s habitat / 阿尔吉侬的居所",
    machine: room === 'bakery' ? 'Oven / 烤炉' : 'Research equipment / 实验设备',
    bread: 'Bread counter / 面包柜台',
    records: room === 'classroom' ? 'Lesson notes / 学习笔记' : 'Records / 研究记录',
    keepsake: 'Keepsake box / 纪念物盒',
    door: 'Door / 房门',
  };
  const hotspotLabel = (id: string) => labelOverrides?.[id] ?? hotspotLabels[id] ?? 'Inspect object / 查看物品';
  const host = useRef<HTMLDivElement>(null);
  const enter = useRef<() => void>(() => {});
  const pauseRef = useRef(paused);
  const callback = useRef(onInteract);
  const reactionRef = useRef(npcReacting);
  const updateReaction = useRef<(url?: string) => void>(() => {});
  useEffect(() => { reactionRef.current = npcReacting; }, [npcReacting]);
  const [entered, setEntered] = useState(false);
  const [target, setTarget] = useState('');
  const [hoverTarget, setHoverTarget] = useState('');
  const [error, setError] = useState('');
  const controlsRef = useRef<FirstPersonControls | null>(null);
  useEffect(() => { callback.current = onInteract; }, [onInteract]);
  useEffect(() => { pauseRef.current = paused; controlsRef.current?.setPaused(paused || !entered); }, [paused, entered]);
  const {floor, walls, backdrop, npc, npcReaction, hands, foreground, bookModel, diaryModel, breadModel} = assets;
  const updateModels = useRef<(book?: string, diary?: string, bread?: string) => void>(() => {});
  useEffect(() => {
    const mount = host.current;
    if (!mount) return;
    setError(''); setTarget(''); setHoverTarget(''); setEntered(false);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
    catch { setError('WebGL is unavailable. Enable hardware acceleration to explore the room.'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('aria-label', `${room} 3D room`);
    const world = new THREE.Scene(); world.background = new THREE.Color('#303a34');
    const camera = new THREE.PerspectiveCamera(60, 1, .05, 40);
    // Keep x=0 clear from this spawn to z=0 in every layout, then approach the diary from the front.
    camera.position.set(0, 1.65, 3.6);
    const controls = new FirstPersonControls({
      camera, element: renderer.domElement,
      bounds: { minX: -3.92, maxX: 3.92, minZ: -4.92, maxZ: 4.92 },
      radius: .24, speed: 2, maxPitch: 1.2, allowPointerLock: true, paused: true,
    });
    controlsRef.current = controls;
    renderer.domElement.style.touchAction = 'none';
    enter.current = () => {
      if (!pauseRef.current) {
        setEntered(true); controls.setPaused(false); renderer.domElement.focus();
      }
    };
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    world.fog = new THREE.Fog('#899486', 9, 24);
    world.add(new THREE.HemisphereLight('#e5ebdf', '#5e5140', 1.2));
    const sun = new THREE.DirectionalLight('#ffe1ae', 2.2); sun.position.set(-3, 5, 2); sun.castShadow = true;
    sun.shadow.mapSize.set(1024,1024);
    Object.assign(sun.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:18});
    sun.shadow.normalBias=.035;
    world.add(sun);
    const pendant = new THREE.PointLight('#ffdaa0', 22, 7, 2);
    pendant.position.set(-1.5,2.85,-1.1); world.add(pendant);
    world.add(camera);
    const obstacles: THREE.Box3[] = [];
    const surfaces: THREE.Mesh[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    let alive = true;
    function material(color: string, url?: string, transparent = false) {
      const mat = new THREE.MeshStandardMaterial({color: url ? '#ffffff' : color, roughness: .9, transparent, alphaTest: transparent ? .15 : 0, side: transparent ? THREE.DoubleSide : THREE.FrontSide});
      if (transparent && url) mat.opacity = 0;
      materials.push(mat);
      if (url) loader.load(url, texture => {
        if (!alive) { texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        textures.push(texture); mat.map = texture; mat.opacity = 1; mat.needsUpdate = true;
      }, undefined, () => { if (alive) setError('An illustration texture failed to load. Check the supplied asset URLs.'); });
      return mat;
    }
    function box(size: [number,number,number], position: [number,number,number], mat: THREE.Material, solid = true, id?: string) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat); mesh.position.set(...position);
      mesh.castShadow = mesh.receiveShadow = true; world.add(mesh); surfaces.push(mesh);
      if(id) mesh.userData.hotspot = id;
      if(solid) obstacles.push(new THREE.Box3().setFromObject(mesh).expandByScalar(.24));
      return mesh;
    }
    const wallMat = material('#a2ad99');
    box([8,.15,10],[0,-.075,0],material('#796e58',floor),false);
    box([8,3.4,.16],[0,1.7,-5],wallMat);
    box([.16,3.4,10],[-4,1.7,0],wallMat); box([.16,3.4,10],[4,1.7,0],wallMat);
    box([8,3.4,.16],[0,1.7,5],wallMat);
    const timber = material(room === 'bakery' ? '#9f8258' : '#7e9183');
    const dark = material('#495b50');
    // Main writing desk is deliberately invariant: both GLB anchors depend on its surface.
    box([2.5,.15,1.05],[-1.5,.9,-1.2],timber,true,room === 'bakery' ? 'bread' : 'test');
    for(const x of [-2.5,-.5]) for(const z of [-1.58,-.82]) box([.1,.85,.1],[x,.425,z],dark);
    const paperMaterial=material('#d9cfb2');
    function table(x:number,z:number,width:number,depth:number,id?:string) {
      box([width,.12,depth],[x,.78,z],timber,true,id);
      for(const dx of [-width/2+.1,width/2-.1]) for(const dz of [-depth/2+.1,depth/2-.1])
        box([.09,.72,.09],[x+dx,.36,z+dz],dark);
    }
    function shelf(x:number,z:number,id:string) {
      box([1.8,1.85,.5],[x,.925,z],timber,true,id);
      for(const y of [.45,1,1.55]) box([1.85,.07,.58],[x,y,z+.04],dark,false,id);
    }
    function chair(x:number,z:number) {
      box([.46,.44,.48],[x,.22,z],dark,true);
      box([.46,.48,.08],[x,.68,z+.2],timber,false);
    }
    if(room==='classroom') {
      // Two columns, three rows. The centre aisle and left passage reach the main writing desk.
      for(const x of [-2.1,1.3]) for(const z of [.55,1.9,3.25]) {
        table(x,z,1.05,.55,'records'); chair(x,z+.52);
      }
      box([.78,1.04,.6],[1.35,.52,-3.25],timber,true,'records');
      box([.85,.08,.68],[1.35,1.08,-3.25],dark,false,'records');
      box([.4,.02,.28],[1.35,1.13,-3.25],paperMaterial,false,'records');
      shelf(2.85,-4.25,'book');
    } else if(room==='research') {
      table(2.05,-.3,1.8,1.15,'records');
      table(-2.25,1.55,1.65,.95,'records');
      for(const [x,z] of [[1.7,-.35],[2.35,-.1],[-2.5,1.55],[-2,1.65]])
        box([.35,.03,.26],[x,.855,z],paperMaterial,false,'records');
      shelf(2.85,-3.9,'records');
      box([1.2,.85,.65],[-3,.425,-3.9],timber,true,'machine');
      box([.48,.27,.35],[-2.9,.995,-3.9],material('#738675'),false,'mouse');
      chair(.55,-2.1);
    } else if(room==='private-room') {
      // Research paper stack, clear of both existing book/diary GLB footprints.
      box([.35,.03,.26],[-.65,.99,-1.35],paperMaterial,false,'records');
      // Bed frame/mattress are honest geometry blockouts, not generated finished furniture.
      box([1.55,.34,2.45],[2.65,.17,-2.5],timber,true);
      box([1.48,.18,2.35],[2.65,.43,-2.5],material('#b6b6a0'),false);
      box([1.55,.9,.12],[2.65,.45,-3.7],dark,false);
      box([.65,.12,.42],[2.65,.58,-3.27],paperMaterial,false);
      box([.6,.58,.6],[1.25,.29,-3.35],timber,true);
      box([.34,.16,.24],[1.25,.66,-3.35],material('#92724f'),false,'keepsake');
      chair(-1.5,-2.05);
    } else if(room==='bakery') {
      shelf(2.85,-3.9,'bread');
      box([1.2,.85,.65],[-3,.425,-3.9],timber,true,'machine');
      // Side workbench and long shop counter distinguish bakery circulation from the lab.
      table(2.6,.65,1.1,2.15,'bread');
      box([1.6,.95,.65],[-2.65,.475,2.45],timber,true,'bread');
      chair(.5,-2);
    } else {
      shelf(2.85,-3.9,'book');
      box([1.2,.85,.65],[-3,.425,-3.9],timber,true,'machine');
      box([.48,.27,.35],[-2.9,.995,-3.9],material('#738675'),false,'mouse');
      chair(.5,-2);
    }
    if (room === 'private-room' || room === 'classroom' || room === 'laboratory' || room === 'bakery') {
      // Closed door emits raw door; App owns explicit leaving and narrative gates.
      // Rear-right wall placement preserves spawn and the classroom's rear passage.
      box([1,2.2,.09],[2.35,1.1,4.85],timber,true,'door');
      box([.06,.07,.09],[2.02,1.05,4.77],dark,false,'door');
    }
    const diaryBlockout = box([.4,.025,.3],[-1.9,.9875,-.9],material('#d9cfb2'),false,'paper');
    const bookBlockout = box([.24,.06,.32],[-1.25,1.005,-1.2],material('#6b5745'),false,'book');
    // Provisional loaf footprint on the existing bakery bench; no pickup behavior is implied.
    const breadBlockout = room === 'bakery'
      ? box([.45,.14,.28],[2.6,.91,.65],material('#b78650'),false,'bread') : undefined;
    let disposeModels: Array<() => void> = [];
    updateModels.current = (book, diary, bread) => {
      disposeModels.forEach(dispose => dispose()); disposeModels=[];
      if (book) disposeModels.push(loadDeskModel({url:book,world,surfaces,fallback:bookBlockout,hotspot:'book',footprint:[.24,.32],center:[-1.25,-1.2],tableY:.975}));
      if (diary) disposeModels.push(loadDeskModel({url:diary,world,surfaces,fallback:diaryBlockout,hotspot:'paper',footprint:[.4,.3],center:[-1.9,-.9],tableY:.975}));
      if (bread && breadBlockout) disposeModels.push(loadDeskModel({url:bread,world,surfaces,fallback:breadBlockout,hotspot:'bread',footprint:[.45,.28],center:[2.6,.65],tableY:.84}));
    };
    box([.46,.08,.46],[-1.5,2.96,-1.1],timber,false);
    // No synthetic character substitute: an absent NPC raster leaves this slot empty.
    function imagePlane(url: string | undefined, width: number, height: number, position: [number,number,number], id?: string) {
      if (!url) return;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width,height),material('#ffffff',url,true));
      mesh.position.set(...position); if(id) mesh.userData.hotspot = id;
      world.add(mesh); surfaces.push(mesh);
      // Fit to the actual raster aspect, keeping feet/bottom fixed. Never distort the portrait.
      const fit = () => {
        const image = mesh.material.map?.image as { width: number; height: number } | undefined;
        if (!image?.width || !image.height) return;
        const aspect = image.width/image.height;
        const h = Math.min(height,width/aspect), w = h*aspect;
        mesh.scale.set(w/width,h/height,1);
        mesh.position.y=position[1]-height/2+h/2;
        mesh.position.y += Number(mesh.userData.bob ?? 0);
        mesh.updateMatrixWorld();
      };
      mesh.onBeforeRender = fit;
      return mesh;
    }
    // The generated learning-room illustration shares this existing rear-wall raster plane.
    imagePlane(backdrop ?? walls,7.7,3.2,[0,1.7,-4.89]);
    const npcPosition: [number,number,number] = room==='classroom' ? [.25,.9,-3.3] : room==='research' ? [.7,.9,-2.5] : [-1.5,.9,-2.05];
    const npcPlane = imagePlane(npc,1.2,1.8,npcPosition,'npc');
    let reactionMaterial: THREE.MeshStandardMaterial | undefined;
    updateReaction.current = url => {
      reactionMaterial = url ? material('#ffffff',url,true) : undefined;
    };
    const idleMaterial = npcPlane?.material;
    if (npcPlane) {
      const fit = npcPlane.onBeforeRender;
      npcPlane.onBeforeRender = (...args) => {
        fit(...args);
        if (!reducedMotion.matches) {
          npcPlane.scale.y *= 1+Math.sin(elapsed*1.25)*.002;
          npcPlane.position.y += Math.sin(elapsed*1.25)*.0018;
          npcPlane.updateMatrixWorld();
        }
      };
    }
    // Reuse the two halves of the actual cutout. Sleeve-cut boundaries live outside the viewport.
    const handPlanes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>[] = [];
    if (hands) {
      const handMaterial=material('#ffffff',hands,true);
      handMaterial.depthTest=false; handMaterial.depthWrite=false; handMaterial.fog=false;
      for (const side of [-1,1]) {
        const geometry=new THREE.PlaneGeometry(1,1);
        const uv=geometry.attributes.uv;
        for(let i=0;i<uv.count;i++) uv.setX(i,uv.getX(i)*.5+(side===1?.5:0));
        const hand=new THREE.Mesh(geometry,handMaterial);
        hand.position.z=-.75; hand.renderOrder=10; hand.frustumCulled=false;
        camera.add(hand); handPlanes.push(hand);
        hand.onBeforeRender=()=>{
          const image=handMaterial.map?.image as {width:number;height:number}|undefined;
          if(!image?.width || !image.height)return;
          const vh=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*.75, vw=vh*camera.aspect;
          const halfAspect=image.width/image.height/2;
          const height=Math.min(vh*.48,vw*.43/halfAspect), width=height*halfAspect;
          hand.scale.set(width,height,1);
          // Bleed by 8% beyond side/bottom so neither bob nor roll exposes a straight crop.
          hand.position.x=side*(vw/2-width*.42)+Number(hand.userData.sway??0);
          hand.position.y=-vh/2+height*.42+Number(hand.userData.bob??0);
          hand.rotation.z=Number(hand.userData.roll??0);
          hand.updateMatrixWorld();
        };
      }
    }    imagePlane(foreground,1.4,1.4,[2,.7,.2]);
    // Room-scale inspection: allow visible objects from the entrance; nearest surfaces still occlude.
    const ray = new THREE.Raycaster(); ray.far = 9;
    const pointerAim=new THREE.Vector2();
    const selectAt=(x:number,y:number)=>{
      world.updateMatrixWorld(true); camera.updateMatrixWorld(true);
      // Small screen-space tolerance. Every candidate still requires an unobstructed ray.
      const rect=renderer.domElement.getBoundingClientRect();
      const dx=24/Math.max(1,rect.width),dy=24/Math.max(1,rect.height);
      let central='';
      for(const [ox,oy] of [[0,0],[-dx,0],[dx,0],[0,-dy],[0,dy],[-dx,-dy],[dx,-dy],[-dx,dy],[dx,dy]]) {
        ray.setFromCamera(pointerAim.set(x+ox,y+oy),camera);
        const hit=ray.intersectObjects(surfaces,false).find(hit=>{
          for(let parent:THREE.Object3D|null=hit.object;parent;parent=parent.parent) if(!parent.visible)return false;
          const source=(hit.object as THREE.Mesh).material;
          const mat=Array.isArray(source)?source[hit.face?.materialIndex ?? 0]:source;
          return !!mat && mat.visible && (!mat.transparent || mat.opacity>0);
        });
        const id=(hit?.object.userData.hotspot ?? '') as string;
        // An exact visible hit wins. Nearby rays must never substitute another physical object.
        if(!ox&&!oy && hit) return id;
        if(!central && id)central=id;
      }
      return central;
    };    let active = '';
    let reactionUntil = 0;
    let nearby = false;
    let walkBlend = 0;
    function interact() { if (!controls.isPaused && active) { if(active === 'npc') { reactionUntil=elapsed+1.4; if(npcPlane && reactionMaterial?.map) npcPlane.material=reactionMaterial; } callback.current?.(active); } }
    function down(event: KeyboardEvent) {
      if (event.code === 'KeyE' && !event.repeat && !controls.isPaused) {
        active=selectAt(0,0); setTarget(active);
        event.preventDefault(); interact();
      }
    }
    // Drag release must never also activate a hotspot.
    let press: { x: number; y: number; moved: boolean } | null = null;
    const pointerDown = (e: PointerEvent) => {
      if (e.button === 0 && e.isPrimary) press = { x: e.clientX, y: e.clientY, moved: false };
    };
    const pointerMove = (e: PointerEvent) => {
      if (!press && !controls.isPaused && !controls.locked) {
        const b=renderer.domElement.getBoundingClientRect();
        const id=selectAt((e.clientX-b.left)/b.width*2-1,1-(e.clientY-b.top)/b.height*2);
        renderer.domElement.style.cursor=id?'pointer':'grab';
        setHoverTarget(id);
      }
      if (press && Math.hypot(e.clientX-press.x,e.clientY-press.y)>5) press.moved=true;
    };
    const pointerUp = (e: PointerEvent) => {
      if (press && !press.moved && e.button === 0) {
        const bounds=renderer.domElement.getBoundingClientRect();
        active=controls.locked?selectAt(0,0):selectAt((e.clientX-bounds.left)/bounds.width*2-1,1-(e.clientY-bounds.top)/bounds.height*2);
        setTarget(active); interact();
      }
      press=null;
    };
    const cancel = () => { press=null; setHoverTarget(''); };
    renderer.domElement.addEventListener('keydown',down);
    renderer.domElement.addEventListener('pointerdown',pointerDown);
    renderer.domElement.addEventListener('pointermove',pointerMove);
    renderer.domElement.addEventListener('pointerup',pointerUp);
    renderer.domElement.addEventListener('pointercancel',cancel);
    renderer.domElement.addEventListener('pointerleave',cancel);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');    const resize = new ResizeObserver(() => { const w = mount.clientWidth, h = mount.clientHeight; if(w && h) { renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); } }); resize.observe(mount);
    const previous = new THREE.Vector3();
    let elapsed = 0;
    let last = performance.now();
    renderer.setAnimationLoop(now => {
      const dt = Math.min((now-last)/1000,.05); last=now;
      if (!controls.isPaused) {
        elapsed += dt;
        previous.copy(camera.position);
        controls.update(dt);
        // Core owns navigation; the room only resolves its own furniture collisions.
        const desiredX=camera.position.x, desiredZ=camera.position.z;
        camera.position.copy(previous);
        for(const axis of ['x','z'] as const) {
          camera.position[axis] = axis === 'x' ? desiredX : desiredZ;
          const blocked = obstacles.some(b => camera.position.x>b.min.x && camera.position.x<b.max.x && camera.position.z>b.min.z && camera.position.z<b.max.z);
          if(blocked) camera.position[axis]=previous[axis];
        }
        if (npcPlane && idleMaterial) {
          const distance=camera.position.distanceTo(npcPlane.position);
          nearby=distance<(nearby?2.6:2.2);
          const reacting=reactionRef.current || active==='npc' || nearby || elapsed<reactionUntil;
          npcPlane.material=reacting && reactionMaterial?.map ? reactionMaterial : idleMaterial;
          npcPlane.rotation.z=reducedMotion.matches ? 0 : Math.sin(elapsed*.65)*.0025;
        }
        const walking=camera.position.distanceToSquared(previous)>.000001;
        walkBlend=THREE.MathUtils.damp(walkBlend,walking?1:0,10,dt);
        for (const hand of handPlanes) {
          hand.userData.bob=!reducedMotion.matches?Math.sin(elapsed*14)*.002*walkBlend:0;
          hand.userData.roll=!reducedMotion.matches?Math.sin(elapsed*7)*.003*walkBlend:0;
          hand.userData.sway=!reducedMotion.matches?Math.sin(elapsed*7)*.002*walkBlend:0;
        }        world.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        const next=selectAt(0,0);
        if(next!==active) { active=next; setTarget(next); }
      }
      // Authored dialogue reactions may change while movement is paused.
      if (npcPlane && idleMaterial && controls.isPaused) {
        const reacting=reactionRef.current || elapsed<reactionUntil;
        npcPlane.material=reacting && reactionMaterial?.map ? reactionMaterial : idleMaterial;
      }
      renderer.render(world,camera);
    });
    return () => {
      alive=false; renderer.setAnimationLoop(null); resize.disconnect();
      disposeModels.forEach(dispose => dispose()); updateModels.current=()=>{};
      controls.dispose(); controlsRef.current=null; enter.current=()=>{}; updateReaction.current=()=>{};
      renderer.domElement.removeEventListener('keydown',down);
      renderer.domElement.removeEventListener('pointerdown',pointerDown);
      renderer.domElement.removeEventListener('pointermove',pointerMove);
      renderer.domElement.removeEventListener('pointerup',pointerUp);
      renderer.domElement.removeEventListener('pointerleave',cancel);
      renderer.domElement.removeEventListener('pointercancel',cancel);      world.traverse(object => { if(object instanceof THREE.Mesh) object.geometry.dispose(); });
      materials.forEach(m=>m.dispose()); textures.forEach(t=>t.dispose()); renderer.dispose(); renderer.domElement.remove();
    };
  }, [room,floor,walls,backdrop,npc,hands,foreground]);
  useEffect(() => {
    updateModels.current(bookModel,diaryModel,breadModel);
  }, [bookModel,diaryModel,breadModel,room,floor,walls,backdrop,npc,hands,foreground]);
  // The expression URL can arrive after generation without rebuilding the room or resetting the camera.
  useEffect(() => {
    updateReaction.current(npcReaction);
  }, [npcReaction,room,floor,walls,backdrop,npc,hands,foreground]);
  return <div className="explorable-room">
    <div ref={host} className="explorable-room__canvas" />
    <div className="explorable-room__label">{room} · 3D blockout / provisional art slots</div>
    {!entered && !paused && <div className="explorable-room__entry"><button onClick={()=>enter.current()}>Enter room</button><p>Click visible objects to inspect · Drag to look · Hold WASD to walk</p></div>}
    {entered && !paused && <div className="explorable-room__aim" aria-live="polite"><span>+</span>{target && <p>E · {hotspotLabel(target)}</p>}</div>}
    {entered && !paused && <button style={{position:'absolute',right:16,top:16,zIndex:2}} onClick={async () => {
      const control=controlsRef.current;
      if (control?.locked) { control.exitPointerLock(); return; }
      if (!await control?.requestPointerLock()) setError('Mouse lock unavailable; drag to look remains available.');
    }}>Toggle mouse lock (optional)</button>}
    {entered && !paused && <div className="explorable-room__help">{hoverTarget ? 'Click / 点击 · '+hotspotLabel(hoverTarget) : 'Click visible objects · Drag to look · Hold WASD to walk · E to inspect'}</div>}
    {error && <p className="explorable-room__error" role="alert">{error}</p>}
  </div>;
}
