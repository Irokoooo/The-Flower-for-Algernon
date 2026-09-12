import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { CognitionState } from '../core/types';
import { sampleMouse } from './movement';
import './cognition.css';
export interface MazeBoxProps { cognition: CognitionState; /** Authored geometry milestone 0..4; independent of cognition. */ storyStage?: number; algernonPresent?: boolean; suspended?: boolean; className?: string; onInspectChange?: (inspecting: boolean) => void }
// Each rectangle leaves at least .35 units around the entire authored route.
const WALLS = [[-1,1.25,.13,1.5],[1,0,.13,3],[-1,-.5,2.8,.12],[-1,-1.5,.9,.12],[1,-1,.6,.12],[-1,-2,.12,.5]];
export function MazeBox({ cognition, algernonPresent = true, suspended = false, className = '', onInspectChange, storyStage = 0 }: MazeBoxProps) {
  const mount = useRef<HTMLDivElement>(null), panel = useRef<HTMLElement>(null), expandButton = useRef<HTMLButtonElement>(null);
  const [expanded,setExpanded] = useState(false), [error,setError] = useState(false);
  const [interacting,setInteracting] = useState(false);
  const latest = useRef({ phase:cognition.phase, algernonPresent, suspended });
  latest.current = { phase:cognition.phase, algernonPresent, suspended };
  const view = useRef({tilt:.30,rotation:-.20,zoom:1});
  const stage=Number.isFinite(storyStage)?Math.max(0,Math.min(4,Math.floor(storyStage))):0;
  const geometryStage=useRef(stage);geometryStage.current=stage;
  const pointer = useRef<{id:number;x:number;y:number;travel:number} | null>(null);
  const pick = useRef<(x:number,y:number)=>void>(()=>{}), offer = useRef<()=>void>(()=>{});
  useEffect(()=> { if(suspended) {setExpanded(false); pointer.current=null;} },[suspended]);
  const inspectCallback=useRef(onInspectChange);
  inspectCallback.current=onInspectChange;
  useEffect(()=> {
    if(!expanded || suspended)return;
    inspectCallback.current?.(true);
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return ()=> {inspectCallback.current?.(false);if(!latest.current.suspended)expandButton.current?.focus();};
  },[expanded,suspended]);
  useEffect(()=> {
    const host=mount.current; if(!host) return;
    let renderer:THREE.WebGLRenderer;
    try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});} catch {setError(true);return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
    renderer.domElement.setAttribute('aria-hidden','true'); host.appendChild(renderer.domElement);
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(38,1,.1,80);
    const geometries:THREE.BufferGeometry[]=[], materials:THREE.Material[]=[];
    renderer.setClearColor(0x000000,0);
    const mat=(color:number,wood=false)=> {const m=new THREE.MeshStandardMaterial({color,roughness:wood?.68:.8});materials.push(m);return m;};
    const timber=mat(0xbb8c59,true),edge=mat(0x936641,true),fur=mat(0xf7f2e5),pink=mat(0xc9968e),eye=mat(0x221b18),brass=mat(0xba9450),foodMat=mat(0xc69a54);
    const add=(geo:THREE.BufferGeometry,m:THREE.Material,parent:THREE.Object3D=scene)=> {geometries.push(geo);const mesh=new THREE.Mesh(geo,m);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
    const box=(x:number,y:number,z:number,w:number,h:number,d:number,m=timber)=> {const mesh=add(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);return mesh;};
    box(0,-.30,0,5.65,.55,5.65,edge);
    // Actual separate timber planks and joinery, not a painted texture.
    const floorA=mat(0x806044,true),floorB=mat(0x846347,true);
    for(let i=0;i<8;i++)box(-2.275+i*.65,0,0,.648,.07,5.2,i%2?floorA:floorB);
    const stageMeshes:{mesh:THREE.Object3D;stage:number}[]=[];
    for(const [x,z,w,d] of [[-2.68,0,.2,5.55],[2.68,0,.2,5.55],[0,-2.68,5.55,.2],[0,2.68,5.55,.2]]) {
      box(x,.27,z,w,.55,d,edge);box(x,.56,z,w+.04,.055,d+.04);
    }
    WALLS.forEach(([x,z,w,d],i)=> {
      const threshold=Math.max(0,i-2); // Three navigable dividers at entry; stages 1–3 add branches.
      stageMeshes.push({mesh:box(x,.24,z,w,.44,d),stage:threshold},{mesh:box(x,.47,z,w+.025,.025,d+.025),stage:threshold});
    });
    for(const x of [-2.7,2.7])for(const z of [-2.7,2.7]) {
      const foot=box(x,-.65,z,.24,.20,.24,edge);stageMeshes.push({mesh:foot,stage:4});
      for(let level=0;level<3;level++)stageMeshes.push({mesh:box(x,-.43+level*.15,z,.25,.06,.26,timber),stage:4});
    }
    for(const x of [-2.67,2.67]) for(const z of [-2.67,2.67]) {const pin=add(new THREE.CylinderGeometry(.035,.035,.012,12),brass);pin.position.set(x,.594,z);}

    scene.add(new THREE.HemisphereLight(0xfff1d6,0x677068,1.5));
    const key=new THREE.DirectionalLight(0xffefd6,4);key.position.set(-3,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-4,right:4,top:4,bottom:-4,near:.1,far:20});key.shadow.normalBias=.025;key.shadow.bias=-.0002;scene.add(key);
    const fill=new THREE.DirectionalLight(0xc4d5e2,1.3);fill.position.set(4,3,-4);scene.add(fill);
    const mouse=new THREE.Group();scene.add(mouse);
    const ellipsoid=(x:number,y:number,z:number,sx:number,sy:number,sz:number,m:THREE.Material)=> {const mesh=add(new THREE.SphereGeometry(1,20,14),m,mouse);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);return mesh;};
    eye.roughness=.16;
    const body=ellipsoid(0,.17,0,.175,.14,.26,fur);
    const head=ellipsoid(0,.18,.22,.115,.095,.14,fur);ellipsoid(0,.16,.335,.036,.029,.035,pink);
    for(const s of [-1,1]) {ellipsoid(s*.078,.29,.18,.066,.075,.024,fur);ellipsoid(s*.078,.29,.202,.042,.052,.012,pink);ellipsoid(s*.084,.213,.26,.018,.021,.018,eye);for(const z of [-.13,.13])ellipsoid(s*.10,.065,z,.035,.028,.066,pink);}
    for(const side of [-1,1]) for(let i=0;i<3;i++) {
      const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.035,.165,.30),new THREE.Vector3(side*.12,.17+i*.012,.30),new THREE.Vector3(side*.21,.16+i*.018,.24+i*.055)]);
      add(new THREE.TubeGeometry(curve,8,.0022,4,false),fur,mouse);
    }
    const tailCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.09,-.18),new THREE.Vector3(.05,.055,-.34),new THREE.Vector3(.12,.04,-.48),new THREE.Vector3(.08,.04,-.57)]);
    const tail=add(new THREE.TubeGeometry(tailCurve,20,.013,6,false),pink,mouse);
    const food=add(new THREE.SphereGeometry(.055,12,8),foodMat);food.scale.set(1,.5,1.5);food.visible=false;
    let seconds=0, previous=performance.now(), frame=0;
    let interaction:null|{time:number;start:THREE.Vector3;target:THREE.Vector3;heading:number}=null;
    const begin=()=> {
      if(latest.current.suspended || !latest.current.algernonPresent || interaction) return;
      // A short offer along the local corridor, not across a wall or toward a plot target.
      const p=sampleMouse(seconds,latest.current.phase);
      const target=mouse.position.clone();
      for(let step=1;step<=120;step++){const ahead=sampleMouse(seconds+step*.05,latest.current.phase);const distance=Math.hypot(ahead.x-p.x,ahead.z-p.z);if(distance>=.20 && distance<=.28){target.set(ahead.x,0,ahead.z);break;}}
      if(target.distanceTo(mouse.position)<.02) target.copy(mouse.position);
      interaction={time:0,start:mouse.position.clone(),target,heading:p.heading};
      const toward=target.clone().sub(mouse.position).normalize();
      food.scale.set(1,.5,1.5);food.position.copy(target).addScaledVector(toward,.24);food.position.y=.08;
      // Keep the grain inside the same free corridor, including at corners.
      const blocked=WALLS.some(([x,z,w,d])=>Math.abs(food.position.x-x)<w/2+.09 && Math.abs(food.position.z-z)<d/2+.09);
      if(blocked || Math.abs(food.position.x)>2.42 || Math.abs(food.position.z)>2.42)food.position.set(target.x,.08,target.z);
      food.visible=true;setInteracting(true);
    };
    offer.current=begin;
    const ray=new THREE.Raycaster();
    pick.current=(x,y)=> {if(latest.current.suspended)return;const r=renderer.domElement.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1),camera);const hit=ray.intersectObjects(scene.children,true)[0];if(hit && (hit.object.parent===mouse))begin();};
    const resize=()=> {const {width,height}=host.getBoundingClientRect();if(width && height){renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}};
    const observer=new ResizeObserver(resize);observer.observe(host);resize();
    const animate=(now:number)=> {
      frame=requestAnimationFrame(animate);const dt=Math.min((now-previous)/1000,.05);previous=now;
      if(latest.current.suspended || document.hidden)return;
      stageMeshes.forEach(({mesh,stage})=>{mesh.visible=geometryStage.current>=stage;});
      mouse.visible=latest.current.algernonPresent;
      if(!mouse.visible && interaction){interaction=null;food.visible=false;setInteracting(false);}
      if(interaction) {
        interaction.time+=dt;const t=interaction.time;
        const fraction=t<.4?0:t<1.2?(t-.4)/.8:t<2.5?1:Math.max(0,1-(t-2.5)/.8);
        mouse.position.lerpVectors(interaction.start,interaction.target,fraction*fraction*(3-2*fraction));
        const direction=interaction.target.clone().sub(interaction.start);
        if(direction.lengthSq()>.0001){const desired=Math.atan2(direction.x,direction.z)+(t>2.5?Math.PI:0);mouse.rotation.y+=Math.atan2(Math.sin(desired-mouse.rotation.y),Math.cos(desired-mouse.rotation.y))*Math.min(1,dt*10);}
        const nibbling=t>1.2 && t<2.5;
        head.position.y=.18+(nibbling?Math.sin(t*18)*.008:Math.sin(t*7)*.004);
        food.visible=t<2.4;food.scale.setScalar(nibbling?Math.max(.05,1-(t-1.2)/1.2):1);
        body.scale.y=.14+(t>.8 && t<1.8?Math.sin(t*15)*.006:0);
        if(t>=3.3){mouse.rotation.y=interaction.heading;head.position.y=.18;interaction=null;food.visible=false;body.scale.y=.13;setInteracting(false);}
      } else if(mouse.visible) {seconds+=dt;const p=sampleMouse(seconds,latest.current.phase);mouse.position.set(p.x,0,p.z);mouse.rotation.y=p.heading;tail.rotation.y=Math.sin(seconds*9)*.055;}
      const {tilt,rotation,zoom}=view.current;
      // Bounding sphere fits the complete box for every orbit and permitted zoom.
      const halfFov=Math.min(THREE.MathUtils.degToRad(19),Math.atan(Math.tan(THREE.MathUtils.degToRad(19))*camera.aspect));
      const distance=4.2/Math.sin(halfFov)*1.16/zoom;
      camera.position.set(distance*Math.sin(tilt+.001)*Math.sin(rotation),distance*Math.cos(tilt+.001),distance*Math.sin(tilt+.001)*Math.cos(rotation));camera.lookAt(0,0,0);
      renderer.render(scene,camera);
    };
    frame=requestAnimationFrame(animate);
    return ()=> {cancelAnimationFrame(frame);observer.disconnect();pick.current=()=>{};offer.current=()=>{};geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();};
  },[]);
  const rotate=(dx:number,dy:number)=> {view.current.rotation+=dx*.009;view.current.tilt=Math.max(0,Math.min(1.15,view.current.tilt+dy*.009));};
  const zoom=(amount:number)=> {view.current.zoom=Math.max(.7,Math.min(1.15,view.current.zoom+amount));};
  const reset=()=> {view.current={tilt:.30,rotation:-.20,zoom:1};};
  return <div hidden={suspended} className={`cognition-maze-shell ${expanded?'is-expanded':''}`}
    onPointerDown={e=>e.stopPropagation()} onPointerMove={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()} onPointerCancel={e=>e.stopPropagation()}
    onClick={e=>e.stopPropagation()} onWheel={e=>e.stopPropagation()} onKeyDown={e=> {
      e.stopPropagation();
      if(expanded && e.key==='Escape'){e.preventDefault();setExpanded(false);}
      if(expanded && e.key==='Tab') {
        const elements=Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),[tabindex="0"]') ?? []);
        const first=elements[0],last=elements[elements.length-1];
        if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();}
        else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}
      }
    }} onKeyUp={e=>e.stopPropagation()}>
    {expanded && <div className="cognition-maze__backdrop" onClick={()=>setExpanded(false)} />}
    <aside ref={panel} className={`cognition-maze ${className}`} role={expanded?'dialog':undefined} aria-modal={expanded?true:undefined} aria-label="Algernon's maze / 阿尔吉侬的迷宫">
      <div className="cognition-maze__inspect"><button ref={expandButton} type="button" onClick={()=>setExpanded(v=>!v)}>{expanded?'Close / 关闭':'Inspect / 放大'}</button></div>
      <div ref={mount} className="cognition-maze__viewport" tabIndex={0} role="group" aria-label="Drag or arrows to orbit. Scroll or +/- to zoom. Home resets. Enter offers food. / 拖拽或方向键旋转，滚轮缩放，Home复位，Enter提供食物。"
        onWheel={e=> {e.stopPropagation();zoom(e.deltaY>0?-.06:.06);}}
        onKeyDown={e=> {if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','+','=','-','Enter'].includes(e.key)){e.preventDefault();if(e.key==='Home')reset();else if(e.key==='Enter')offer.current();else if(['+','=','-'].includes(e.key))zoom(e.key==='-'?-.1:.1);else rotate(e.key==='ArrowLeft'?-16:e.key==='ArrowRight'?16:0,e.key==='ArrowUp'?-16:e.key==='ArrowDown'?16:0);}}}
        onPointerDown={e=> {if(!e.isPrimary || e.button!==0 || suspended)return;e.preventDefault();e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);pointer.current={id:e.pointerId,x:e.clientX,y:e.clientY,travel:0};}}
        onPointerMove={e=> {const p=pointer.current;if(!p || p.id!==e.pointerId)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;rotate(dx,dy);pointer.current={id:p.id,x:e.clientX,y:e.clientY,travel:p.travel+Math.hypot(dx,dy)};}}
        onPointerUp={e=> {const p=pointer.current;if(!p || p.id!==e.pointerId)return;if(p.travel<5)pick.current(e.clientX,e.clientY);pointer.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}}
        onPointerCancel={()=>{pointer.current=null;}} onLostPointerCapture={()=>{pointer.current=null;}}>
        {error && <p role="alert">3D rendering unavailable. / 3D 渲染不可用。</p>}
      </div>
      <div className="cognition-maze__tools"><button type="button" onClick={()=>zoom(-.15)} aria-label="Zoom out / 缩小">−</button><button type="button" onClick={()=>zoom(.15)} aria-label="Zoom in / 放大">+</button><button type="button" onClick={reset}>Reset / 复位</button><button type="button" disabled={!algernonPresent || error || interacting} onClick={()=>offer.current()}>Offer grain / 喂食</button></div>
      <p className="cognition-sr-only" role="status">{!algernonPresent?'The box is quiet. / 盒子安静了。':interacting?'A moment of curiosity. / 片刻的好奇。':'Click Algernon to offer a grain. / 点击阿尔吉侬，递上一粒食物。'}</p>

    </aside>
  </div>;
}

