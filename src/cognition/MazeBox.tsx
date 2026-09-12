import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { CognitionState } from '../core/types';
import { sampleMouse } from './movement';
import './cognition.css';
export interface MazeBoxProps {
  cognition: CognitionState;
  algernonPresent?: boolean;
  suspended?: boolean;
  className?: string;
}
/** Persistent shell widget; local state contains camera/time only, never cognition. */
export function MazeBox({ cognition, algernonPresent = true, suspended = false, className = '' }: MazeBoxProps) {
  const mount = useRef<HTMLDivElement>(null);
  const latest = useRef({ phase: cognition.phase, algernonPresent, suspended });
  latest.current = { phase: cognition.phase, algernonPresent, suspended };
  const cameraView = useRef({ tilt: 0, rotation: 0 });
  const pointer = useRef<{id:number; x:number; y:number} | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setError(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth || 240, 210);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, (host.clientWidth || 240)/210, .1, 100);
    scene.add(new THREE.HemisphereLight(0xfff5dd, 0x746950, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 3); light.position.set(-3,8,4); scene.add(light);
    const geometries: THREE.BufferGeometry[] = [], materials: THREE.Material[] = [];
    const material = (color: number) => { const m = new THREE.MeshStandardMaterial({color,roughness:.9}); materials.push(m); return m; };
    const wood = material(0xb7a080), pale = material(0xf2eadc), pink = material(0xd0a49c);
    const box = (x:number,y:number,z:number,w:number,h:number,d:number) => {
      const geometry = new THREE.BoxGeometry(w,h,d); geometries.push(geometry);
      const mesh = new THREE.Mesh(geometry,wood); mesh.position.set(x,y,z); scene.add(mesh);
    };
    box(0,-.2,0,5.2,.3,5.2);
    box(-2.6,.2,0,.15,.65,5.3); box(2.6,.2,0,.15,.65,5.3);
    box(0,.2,-2.6,5.3,.65,.15); box(0,.2,2.6,5.3,.65,.15);
    // Interior walls leave a continuous corridor around the deterministic route.
    box(-1,.2,1,.13,.55,2.6); box(1,.2,.1,.13,.55,3.2);
    box(-1,.2,-.5,2.9,.55,.12); box(-1,.2,-1.5,2.8,.55,.12);
    const mouse = new THREE.Group(); scene.add(mouse);
    const sphere = (x:number,y:number,z:number,sx:number,sy:number,sz:number,mat:THREE.Material) => {
      const geo = new THREE.SphereGeometry(1,12,8); geometries.push(geo);
      const part = new THREE.Mesh(geo,mat); part.position.set(x,y,z); part.scale.set(sx,sy,sz); mouse.add(part);
    };
    sphere(0,.1,0,.12,.10,.22,pale); sphere(0,.13,.20,.09,.08,.1,pale);
    sphere(-.075,.21,.16,.05,.055,.035,pink); sphere(.075,.21,.16,.05,.055,.035,pink);
    sphere(0,.05,-.28,.018,.018,.16,pink);
    let frame = 0, seconds = 0, previous = performance.now(), phase = latest.current.phase;
    const animate = (now:number) => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min((now-previous)/1000,.1); previous = now;
      if (latest.current.suspended || document.hidden) return;
      if (phase !== latest.current.phase) { phase = latest.current.phase; seconds = 0; }
      seconds += delta;
      const p = sampleMouse(seconds, phase);
      mouse.visible = latest.current.algernonPresent;
      mouse.position.set(p.x,0,p.z); mouse.rotation.y = p.heading;
      const { tilt, rotation } = cameraView.current;
      // Tiny epsilon makes the top-down lookAt basis well-defined.
      camera.position.set(9*Math.sin(tilt+.001)*Math.sin(rotation),9*Math.cos(tilt+.001),9*Math.sin(tilt+.001)*Math.cos(rotation));
      camera.lookAt(0,0,0); renderer.render(scene,camera);
    };
    frame = requestAnimationFrame(animate);
    const observer = new ResizeObserver(() => { const w = host.clientWidth; if (w > 0) { renderer.setSize(w,210); camera.aspect=w/210; camera.updateProjectionMatrix(); } });
    observer.observe(host);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  const reset = () => { cameraView.current = {tilt:0,rotation:0}; };
  const rotate = (dx:number,dy:number) => { const v = cameraView.current; v.rotation += dx*.01; v.tilt = Math.max(0, Math.min(1.1,v.tilt+dy*.01)); };
  return <aside hidden={suspended} className={`cognition-maze ${className}`} aria-label="Algernon's maze / 阿尔吉侬的迷宫"
    onPointerDown={e=>e.stopPropagation()} onPointerMove={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}
    onClick={e=>e.stopPropagation()} onWheel={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()} onKeyUp={e=>e.stopPropagation()}>
    <header><span>ALGERNON / 阿尔吉侬</span><button type="button" onClick={reset}>Top / 俯视</button></header>
    <div ref={mount} className="cognition-maze__viewport" tabIndex={0} role="group" aria-label="Drag or use arrows to rotate maze. Home resets. / 拖拽或方向键旋转，Home复位。"
      onKeyDown={e=> { e.stopPropagation(); if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)) { e.preventDefault(); if(e.key==='Home') reset(); else rotate(e.key==='ArrowLeft'?-15:e.key==='ArrowRight'?15:0,e.key==='ArrowUp'?-15:e.key==='ArrowDown'?15:0); } }}
      onPointerDown={e=> { e.stopPropagation(); if(!e.isPrimary || e.button!==0) return; e.preventDefault(); e.currentTarget.focus(); e.currentTarget.setPointerCapture(e.pointerId); pointer.current={id:e.pointerId,x:e.clientX,y:e.clientY}; }}
      onPointerMove={e=> { e.stopPropagation(); const p=pointer.current; if(!p || p.id!==e.pointerId) return; rotate(e.clientX-p.x,e.clientY-p.y); pointer.current={id:p.id,x:e.clientX,y:e.clientY}; }}
      onPointerUp={e=> { e.stopPropagation(); pointer.current=null; if(e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
      onPointerCancel={()=> { pointer.current=null; }} onLostPointerCapture={()=> { pointer.current=null; }}>
      {error && <p role="alert">3D rendering unavailable. / 3D渲染不可用。</p>}
    </div>
    <p>Drag to inspect · Home to reset<br /><span lang="zh-Hans">拖拽观察 · Home 恢复俯视</span></p>
    <span className="cognition-sr-only">{algernonPresent ? 'Algernon is in the maze.' : 'The maze is empty. / 迷宫空了。'}</span>
  </aside>;
}
