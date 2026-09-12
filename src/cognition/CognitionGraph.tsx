import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import type { CognitionState } from '../core/types';
import type { CognitionGraphModel, PerceivedLabel } from './contracts';
import './cognition.css';
export interface CognitionGraphProps {
  model: CognitionGraphModel;
  cognition: CognitionState;
  connectedEdgeIds: readonly string[];
  onConnect: (edgeId: string) => void;
  className?: string;
  presentation?: 'default' | 'wandering';
  /** Caller supplies only thoughts Charlie can currently perceive. */
  ambientThoughts?: readonly PerceivedLabel[];
}
const motionStyle=(index:number):CSSProperties=>({
  '--thought-delay':`${-index*2.3}s`, '--thought-duration':`${13+index%4*3}s`,
  '--thought-tilt':`${index%2?5:-5}deg`, '--thought-scale':`${.94+index%3*.06}`,
} as CSSProperties);
export function CognitionGraph({ model, cognition, connectedEdgeIds, onConnect, className = '', presentation = 'default', ambientThoughts = [] }: CognitionGraphProps) {
  const titleId = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('Choose two details. / 选择两个细节。');
  const [paused,setPaused]=useState(false);
  const wandering=presentation==='wandering';
  const canvas=useRef<HTMLDivElement>(null);
  const [clock,setClock]=useState(0);
  const elapsed=useRef(0);
  const [reduced,setReduced]=useState(false);
  const gesture=useRef<{id:string;pointerId:number;x:number;y:number;moved:boolean}|null>(null);
  const suppressClick=useRef(false);
  const [preview,setPreview]=useState<{from:string;x:number;y:number;target:string|null}|null>(null);
  useEffect(()=>{
    const query=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(query.matches);update();query.addEventListener('change',update);
    return()=>query.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    if(!wandering||paused||reduced)return;
    let frame=0,last=performance.now(),paint=last;
    const tick=(now:number)=>{
      elapsed.current+=Math.min(50,now-last)/1000;last=now;
      if(now-paint>=32){setClock(elapsed.current);paint=now;}
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[wandering,paused,reduced]);
  // The whole target moves. SVG endpoints and pointer hit areas share this position.
  const positions=new Map(model.nodes.map((node,i)=>{
    const t=clock*(.26+i*.025),seed=i*1.9;
    const dx=wandering&&!reduced?Math.sin(t+seed)*10+Math.sin(t*.61+seed)*3:0;
    const dy=wandering&&!reduced?Math.cos(t*.83+seed)*9+Math.sin(t*.47)*3:0;
    return [node.id,wandering?{x:Math.max(12,Math.min(88,node.x+dx)),y:Math.max(12,Math.min(88,node.y+dy))}:{x:node.x,y:node.y}];
  }));
  const accessible = model.edges.filter(e => e.phases.includes(cognition.phase) && (!e.requiredAffordance || cognition.affordances.includes(e.requiredAffordance)));
  const byId = new Map(model.nodes.map(n => [n.id, n]));
  const connectPair=(from:string,id:string)=>{
    const edge = accessible.find(e => (e.from === from && e.to === id) || (e.to === from && e.from === id));
    setSelected(null);setFeedbackPhase(cognition.phase);
    if (edge) { if (!connectedEdgeIds.includes(edge.id)) onConnect(edge.id); setMessage(`${edge.meaning.en} / ${edge.meaning.zhHans}`); }
    else setMessage('I cannot put these together yet. / 我还不能把它们联系起来。');
  };
  const select = (id: string) => {
    if (!selected || !byId.has(selected)) { setSelected(id); setMessage('Choose another detail. / 再选择一个细节。'); return; }
    if (selected === id) { setSelected(null); return; }
    connectPair(selected,id);
  };
  const [feedbackPhase, setFeedbackPhase] = useState(cognition.phase);
  function targetAt(x:number,y:number,source:string){
    const candidates=Array.from(canvas.current?.querySelectorAll<HTMLButtonElement>('[data-thought-id]')??[])
      .filter(node=>node.dataset.thoughtId!==source).map(node=>({id:node.dataset.thoughtId!,rect:node.getBoundingClientRect()}))
      .filter(({rect:r})=>x>=r.left-6&&x<=r.right+6&&y>=r.top-6&&y<=r.bottom+6);
    candidates.sort((a,b)=>Math.hypot(x-a.rect.left-a.rect.width/2,y-a.rect.top-a.rect.height/2)-Math.hypot(x-b.rect.left-b.rect.width/2,y-b.rect.top-b.rect.height/2));
    return candidates[0]?.id??null;
  }
  function startDrag(e:PointerEvent<HTMLButtonElement>,id:string){
    if(!wandering||!e.isPrimary||e.button!==0)return;
    suppressClick.current=false;gesture.current={id,pointerId:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function moveDrag(e:PointerEvent<HTMLButtonElement>){
    const g=gesture.current,r=canvas.current?.getBoundingClientRect();if(!g||!r||g.pointerId!==e.pointerId)return;
    g.moved ||= Math.hypot(e.clientX-g.x,e.clientY-g.y)>5;
    if(!g.moved)return;e.preventDefault();
    setPreview({from:g.id,x:(e.clientX-r.left)/r.width*100,y:(e.clientY-r.top)/r.height*100,target:targetAt(e.clientX,e.clientY,g.id)});
  }
  function finishDrag(e:PointerEvent<HTMLButtonElement>){
    const g=gesture.current;if(!g||g.pointerId!==e.pointerId)return;
    gesture.current=null;setPreview(null);suppressClick.current=g.moved;
    if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    if(!g.moved)return;
    const target=targetAt(e.clientX,e.clientY,g.id);
    if(target)connectPair(g.id,target);
    else {setSelected(g.id);setMessage('The thread is still here. Choose another thought. / 线头还在，选另一个念头。');}
  }
  function cancelDrag(){if(gesture.current)suppressClick.current=true;gesture.current=null;setPreview(null);}
  return <section className={`cognition-graph ${wandering?'cognition-graph--wandering':''} ${className}`} aria-labelledby={titleId} data-motion-paused={paused} data-thought-selected={!!selected}>
    <h2 id={titleId}>Connections <span lang="zh-Hans">关联</span></h2>
    {wandering&&<button type="button" className="cognition-graph__motion-toggle" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?'Resume thoughts / 继续漂移':'Pause thoughts / 暂停漂移'}</button>}
    {wandering&&<p className="cognition-graph__gesture-hint">Pull a thread between two thoughts. / 从一个念头拖出线，接住另一个。也可以依次点选。</p>}
    <div ref={canvas} className="cognition-graph__canvas">
      {wandering&&<div className="cognition-graph__ambient" aria-hidden="true">{ambientThoughts.map((thought,i)=><div key={i} className="cognition-graph__wisp" style={{...motionStyle(i),left:`${10+i*37%78}%`,top:`${10+i*29%75}%`}}><span lang="en">{thought.en}</span><span lang="zh-Hans">{thought.zhHans}</span></div>)}</div>}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{accessible.filter(e => connectedEdgeIds.includes(e.id)).map(e => {
        const a = positions.get(e.from), b = positions.get(e.to);
        return a && b ? <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} /> : null;
      })}{preview&&positions.has(preview.from)&&<line className="cognition-graph__thread-preview" x1={positions.get(preview.from)!.x} y1={positions.get(preview.from)!.y} x2={preview.x} y2={preview.y}/>}</svg>
      {model.nodes.map((n,index) => { const label = n.perceivedLabels?.[cognition.phase] ?? n.label;
        const position=positions.get(n.id)!;
        return <button key={n.id} type="button" className="cognition-graph__node" aria-pressed={selected === n.id}
          data-thought-id={n.id} data-thread-target={preview?.target===n.id}
          onPointerDown={e=>startDrag(e,n.id)} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}
          style={{...(wandering?motionStyle(index):{}),left: `${position.x}%`, top: `${position.y}%` }} onClick={e => { if(e.detail!==0&&suppressClick.current){suppressClick.current=false;return;}setFeedbackPhase(cognition.phase); select(n.id); }}>
          {wandering?<span className="cognition-graph__thought" data-shape={index%3}><span lang="en">{label.en}</span><span lang="zh-Hans">{label.zhHans}</span></span>:<><span lang="en">{label.en}</span><span lang="zh-Hans">{label.zhHans}</span></>}
        </button>;
      })}
    </div><p role="status">{feedbackPhase === cognition.phase ? message : 'Choose two details. / 选择两个细节。'}</p>
  </section>;
}
