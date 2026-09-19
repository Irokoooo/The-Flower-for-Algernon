import { useEffect, useLayoutEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, PointerEvent, ReactNode } from 'react';
import type { CognitionState } from '../../core/types';
import type { ReportDraft } from '../../narrative/report';
import { diaryEntries } from '../../content/diary-collage';
import type { DiaryFragment } from '../../content/diary-collage';
import './diary-collage.css';
export interface DiaryCollageProps {
  phase: CognitionState['phase'];
  entryId: 'first' | 'preop' | 'recovery' | 'ascending' | 'peak' | 'last';
  previousText?: string;
  onSave: (report: ReportDraft) => void;
  onPlaceFragment?: (fragment: {id:string;text:string;english:string}, phase:CognitionState['phase']) => void;
}
type Placement = {id:string;x:number;y:number};
type Drag = {id:string;pointerId:number;startX:number;startY:number;x:number;y:number;moved:boolean;offsetX:number;offsetY:number;width:number};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
// Stable row bands, then left-to-right: no non-transitive proximity comparator.
const readingOrder=(a:Placement,b:Placement)=>Math.floor(a.y*8)-Math.floor(b.y*8) || a.x-b.x || a.y-b.y || a.id.localeCompare(b.id);
export function DiaryCollage(props:DiaryCollageProps){return <CollagePage key={`${props.entryId}:${props.phase}`} {...props}/>;}
function CollagePage({phase,entryId,previousText='',onSave,onPlaceFragment}:DiaryCollageProps){
  const entry=diaryEntries[entryId];
  const recalled:DiaryFragment[]=entryId==='last' && previousText ? Object.values(diaryEntries).flatMap(e=>e.fragments).filter((f,i,all)=>f.role==='detail'&&Array.from(f.text).length>1&&previousText.includes(f.text)&&!entry.fragments.some(v=>v.text===f.text)&&all.findIndex(v=>v.text===f.text)===i).slice(0,2):[];
  const fragments=[...entry.fragments.slice(0,phase==='LOW'?9:undefined),...recalled];
  const [placed,setPlaced]=useState<Placement[]>([]),[picked,setPicked]=useState<string|null>(null),[ghost,setGhost]=useState<Drag|null>(null);
  const [saved,setSaved]=useState(false),[notice,setNotice]=useState('');
  const locked=useRef(false),gesture=useRef<Drag|null>(null),suppress=useRef(false);
  const sheet=useRef<HTMLDivElement>(null),bank=useRef<HTMLDivElement>(null);
  const scrollFrame=useRef<number|null>(null);
  const stopScroll=()=>{if(scrollFrame.current!==null)cancelAnimationFrame(scrollFrame.current);scrollFrame.current=null;};
  useEffect(()=>()=>{stopScroll();gesture.current=null;},[]);
  function startScroll(){
    stopScroll();
    const modal=sheet.current?.closest<HTMLElement>('.task-modal');
    if(!modal)return;
    let last=performance.now();
    const tick=(now:number)=>{
      const g=gesture.current;
      if(!g?.moved){stopScroll();return;}
      const dt=Math.min(40,now-last);last=now;
      const r=modal.getBoundingClientRect(),top=Math.max(0,r.top),bottom=Math.min(window.innerHeight,r.bottom);
      const delta=g.y<top+72?-Math.min(1,(top+72-g.y)/72):g.y>bottom-72?Math.min(1,(g.y-bottom+72)/72):0;
      if(g.x>=r.left-24&&g.x<=r.right+24)modal.scrollTop+=delta*dt*.65;
      scrollFrame.current=requestAnimationFrame(tick);
    };
    scrollFrame.current=requestAnimationFrame(tick);
  }
  const hint=useId();
  const ordered=[...placed].sort(readingOrder);
  const rawText=ordered.map(p=>fragments.find(f=>f.id===p.id)?.text??'').join('');
  const minimum=Math.max(3,entry.minFragments);
  const meaningful=placed.length>=minimum && placed.some(p=>fragments.find(f=>f.id===p.id)?.role==='subject') && placed.some(p=>fragments.find(f=>f.id===p.id)?.role==='intent');
  function place(id:string,x:number,y:number){
    if(locked.current)return;
    const f=fragments.find(v=>v.id===id);if(!f)return;
    const bounds=sheet.current?.getBoundingClientRect();
    const paper=Array.from(sheet.current?.querySelectorAll<HTMLElement>('[data-scrap-id]')??[]).find(el=>el.dataset.scrapId===id);
    const next={id,x:clamp(x),y:clamp(y)};
    if(bounds&&paper){next.x=Math.max(0,Math.min(next.x,(bounds.width-paper.offsetWidth-8)/bounds.width));next.y=Math.max(0,Math.min(next.y,(bounds.height-paper.offsetHeight-8)/bounds.height));}
    const old=placed.find(p=>p.id===id);
    setPicked(id);
    if(old && Math.abs(old.x-next.x)<.002 && Math.abs(old.y-next.y)<.002)return;
    setPlaced(values=>[...values.filter(v=>v.id!==id),next]);
    setNotice(`已放下「${f.text}」。`);
    // Exactly one notification per committed placement, never during hover/render.
    onPlaceFragment?.({id:f.id,text:f.text,english:f.english},phase);
  }
  function remove(id:string){if(locked.current)return;setPlaced(p=>p.filter(v=>v.id!==id));setPicked(null);setNotice('纸片已放回桌面。');}
  const inside=(rect:DOMRect,x:number,y:number)=>x>=rect.left&&x<=rect.right&&y>=rect.top&&y<=rect.bottom;
  function start(e:PointerEvent<HTMLButtonElement>,id:string){
    if(locked.current || !e.isPrimary || e.button!==0)return;
    e.stopPropagation();suppress.current=false;
    const r=e.currentTarget.getBoundingClientRect();
    gesture.current={id,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,moved:false,offsetX:e.clientX-r.left,offsetY:e.clientY-r.top,width:r.width};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e:PointerEvent<HTMLButtonElement>){
    const g=gesture.current;if(!g||g.pointerId!==e.pointerId)return;
    e.stopPropagation();const next={...g,x:e.clientX,y:e.clientY,moved:g.moved||Math.hypot(e.clientX-g.startX,e.clientY-g.startY)>5};
    gesture.current=next;if(next.moved){e.preventDefault();setGhost(next);if(!g.moved)startScroll();}
  }
  function finish(e:PointerEvent<HTMLButtonElement>){
    const g=gesture.current;if(!g||g.pointerId!==e.pointerId)return;
    stopScroll();gesture.current=null;setGhost(null);suppress.current=g.moved;e.stopPropagation();
    if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
    if(!g.moved)return;
    const r=sheet.current?.getBoundingClientRect(),b=bank.current?.getBoundingClientRect();
    if(r&&inside(r,e.clientX,e.clientY))place(g.id,(e.clientX-r.left-g.offsetX)/r.width,(e.clientY-r.top-g.offsetY)/r.height);
    else if(b&&inside(b,e.clientX,e.clientY))remove(g.id);
    else setNotice('未放下，纸片留在原处。');
  }
  const scrap=(f:DiaryFragment,index:number)=> <button type="button" key={f.id} data-scrap-id={f.id} disabled={saved}
    className={`diary-collage__scrap ${picked===f.id?'is-picked':''} ${ghost?.id===f.id?'is-dragging':''}`}
    style={{'--turn':`${((index*7)%9)-4}deg`,'--drift':`${index%3-1}px`} as CSSProperties}
    aria-pressed={picked===f.id} aria-label={`拾起或移动：${f.text}`} onPointerDown={e=>start(e,f.id)} onPointerMove={move} onPointerUp={finish}
    onPointerCancel={()=>{stopScroll();gesture.current=null;setGhost(null);suppress.current=true;}}
    onLostPointerCapture={()=>{stopScroll();gesture.current=null;setGhost(null);}}
    onClick={e=>{e.stopPropagation();if(suppress.current&&e.detail!==0){suppress.current=false;return;}setPicked(f.id);setNotice(`已拾起「${f.text}」，点击纸页落点或选择下方“放到纸页”。`);}}
    onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Delete','Escape'].includes(e.key))return;e.preventDefault();e.stopPropagation();if(e.key==='Escape'){setPicked(null);return;}if(e.key==='Delete'){remove(f.id);return;}const p=placed.find(v=>v.id===f.id);if(p)place(f.id,p.x+(e.key==='ArrowLeft'?-.04:e.key==='ArrowRight'?.04:0),p.y+(e.key==='ArrowUp'?-.125:e.key==='ArrowDown'?.125:0));}}>
    <span aria-hidden="true">{Array.from(f.text).map((char,i)=><span className="diary-collage__glyph" key={i} style={{'--glyph-y':`${((i*3+index)%5)-2}px`,'--glyph-turn':`${((i+index)%5)-2}deg`} as CSSProperties}>{char}</span>)}</span>
  </button>;
  const selection=fragments.find(f=>f.id===picked);
  return <section className={`diary-collage diary-collage--${phase.toLowerCase()}`} lang="zh-Hans" aria-label={entry.title}>
    <header><span className="diary-collage__folio">进步报告 · {{first:'01',preop:'02',recovery:'08',ascending:'04',peak:'07',last:'11'}[entryId]}</span><h2>{entry.title}</h2><p>{entry.context}</p></header>
    {previousText&&<details className="diary-collage__memory" open={entryId==='last'}><summary>从前写下的话</summary><blockquote>{previousText}</blockquote></details>}
    <p id={hint} className="diary-collage__hint">把桌上的纸片拖进日记，也能拖回桌面。按纸页从上到下、从左到右读。</p>
    <div ref={bank} className="diary-collage__bank" aria-label="桌上的纸片，可拖回这里" aria-describedby={hint} style={{height:`${Math.ceil(fragments.length/3)*90+24}px`}}>
      {fragments.map((f,i)=>!placed.some(p=>p.id===f.id)&&<div className="diary-collage__loose" key={f.id} style={{left:`${(i%3)*33}%`,top:`${Math.floor(i/3)*90+8+(i%3)*6}px`}}>{scrap(f,i)}</div>)}
    </div>
    <div ref={sheet} className="diary-collage__sheet" aria-label="日记纸页" onClick={e=>{if(!picked||saved)return;const r=e.currentTarget.getBoundingClientRect();place(picked,(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height);}}>
      {!placed.length&&<p className="diary-collage__empty">把一句话留在纸上……</p>}
      {ordered.map(p=>{const f=fragments.find(v=>v.id===p.id)!;return <PlacedPaper key={p.id} placement={p} onConstrain={(x,y)=>setPlaced(values=>values.map(v=>v.id===p.id?{...v,x,y}:v))}>{scrap(f,fragments.indexOf(f))}</PlacedPaper>;})}
    </div>
    <div className="diary-collage__tools" aria-label="键盘摆放工具">
      <span>{selection?`手中：${selection.text}`:'也可以点选纸片，再点纸页落下。'}</span>
      {selection&&!saved&&<><button type="button" onClick={()=>{const count=placed.length;place(selection.id,(count%3)*.33,Math.min(.875,Math.floor(count/3)*.125));}}>放到纸页</button><button type="button" onClick={()=>remove(selection.id)}>放回桌面</button><small>纸片获得焦点后，方向键移动，Delete 收回，Esc 取消选择。</small></>}
    </div>
    <p className="diary-collage__reading" aria-label="连起来读">{rawText||'……'}</p>
    <div className="diary-collage__save"><button type="button" disabled={!meaningful||saved} onClick={()=>{
      if(locked.current||!meaningful)return;locked.current=true;
      try{onSave({rawText,expressedText:rawText,stimulusId:`diary-collage:${entryId}`,phase,savedAt:new Date().toISOString(),transformation:'none'});setSaved(true);setPicked(null);setNotice('这页已经保存。');}
      catch{locked.current=false;setNotice('尚未保存，请重试。');}
    }}>{saved?'这页已留下':'留下这页'}</button>{!meaningful&&!saved&&<small>至少 {minimum} 张，包含谁、想做什么。没有唯一答案。</small>}</div>
    <p role="status" className="diary-collage__notice">{notice}</p>
    {ghost&&createPortal(<div className={`diary-collage__ghost diary-collage--${phase.toLowerCase()}`} aria-hidden="true" style={{left:ghost.x-ghost.offsetX,top:ghost.y-ghost.offsetY,width:ghost.width}}>{fragments.find(f=>f.id===ghost.id)?.text}</div>,document.body)}
  </section>;
}


/** Measure natural wrapping and constrain every edge, including after modal resize. */
function PlacedPaper({placement,children,onConstrain}:{placement:Placement;children:ReactNode;onConstrain:(x:number,y:number)=>void}){
  const constrain=useRef(onConstrain);constrain.current=onConstrain;
  const ref=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const el=ref.current,parent=el?.parentElement;if(!el||!parent)return;
    const position=()=>{
      const width=parent.clientWidth,height=parent.clientHeight;
      const left=Math.max(8,Math.min(placement.x*width,width-el.offsetWidth-8));
      const top=Math.max(8,Math.min(placement.y*height,height-el.offsetHeight-8));
      el.style.left=left+'px';el.style.top=top+'px';
      if(width&&height&&(Math.abs(left/width-placement.x)>.001||Math.abs(top/height-placement.y)>.001))constrain.current(left/width,top/height);
    };
    position();const observer=new ResizeObserver(position);observer.observe(el);observer.observe(parent);
    return()=>observer.disconnect();
  },[placement.x,placement.y]);
  return <div ref={ref} className="diary-collage__placed">{children}</div>;
}
