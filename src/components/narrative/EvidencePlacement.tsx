import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import './evidence-placement.css';

export interface EvidencePlacementProps {
  itemLabel: string;
  targetLabel: string;
  onPlace: () => void;
  disabled?: boolean;
}
export function EvidencePlacement(props: EvidencePlacementProps) {
  return <Placement key={`${props.itemLabel}:${props.targetLabel}`} {...props} />;
}
function Placement({itemLabel, targetLabel, onPlace, disabled = false}: EvidencePlacementProps) {
  const [picked, setPicked] = useState(false), [done, setDone] = useState(false);
  const [notice, setNotice] = useState('');
  const root = useRef<HTMLDivElement>(null), completed = useRef(false);
  const held = useRef(false), suppress = useRef(false);
  const drag = useRef<{x:number;y:number} | null>(null);
  const unavailable = disabled || done;
  function choose() {
    if (disabled || completed.current) return;
    held.current = true; setPicked(true); setNotice(`已拿起「${itemLabel}」，请选择放置位置。`);
  }
  function place(destination: string) {
    if (disabled || completed.current || !held.current) return;
    held.current = false; setPicked(false);
    if (destination === 'records') {setNotice('已放回记录。'); return;}
    completed.current = true; setDone(true); setNotice(`已放到「${targetLabel}」。`); onPlace();
  }
  function pointerUp(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current; drag.current = null;
    if (!start) return;
    suppress.current = Math.hypot(event.clientX-start.x, event.clientY-start.y) > 8;
    if (!suppress.current) return;
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-evidence-destination]');
    if (target && root.current?.contains(target)) place(target.dataset.evidenceDestination!);
  }
  return <div ref={root} className="evidence-placement" aria-label="整理证据">
    <p className="evidence-placement__hint">先拿起纸片，再选择放置位置。也可以拖动纸片。</p>
    <button type="button" className="evidence-placement__card" disabled={unavailable} aria-pressed={picked}
      onPointerDown={event => {if(event.button!==0 || unavailable)return; suppress.current=false; choose(); drag.current={x:event.clientX,y:event.clientY}; event.currentTarget.setPointerCapture(event.pointerId);}}
      onPointerUp={pointerUp} onPointerCancel={()=>{drag.current=null;suppress.current=true;}}
      onClick={event=>{if(event.detail===0 || !suppress.current)choose();suppress.current=false;}}>
      <small>{done?'已放置':picked?'手中的纸片':'拿起纸片'}</small><span>{itemLabel}</span>
    </button>
    <div className="evidence-placement__destinations">
      <button type="button" data-evidence-destination="records" disabled={unavailable || !picked} onClick={()=>place('records')}>
        <span>↶</span> 放回记录<small>暂时收好</small>
      </button>
      <button type="button" data-evidence-destination="target" disabled={unavailable || !picked} onClick={()=>place('target')}>
        <span>＋</span> {targetLabel}<small>把纸片放在这里</small>
      </button>
    </div>
    <p className="evidence-placement__notice" role="status">{notice}</p>
  </div>;
}
