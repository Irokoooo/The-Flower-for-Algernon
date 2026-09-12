import { useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import './illustrated-npc.css';
export type NPCMood = 'neutral' | 'warm' | 'uneasy' | 'angry' | 'guilty';
export type NPCPart = { id: string; content: ReactNode; className?: string; depth?: number };
export type IllustratedNPCProps = { name: string; parts?: NPCPart[]; mood?: NPCMood; onInteract?: () => void; className?: string; role?: 'researcher' | 'baker'; speaking?: boolean; disabled?: boolean };
/** Original programmatic prototype art. Replace with approved production illustrations later. */
export function IllustratedNPC({ name, parts, mood = 'neutral', onInteract, className = '', role = 'researcher', speaking = false, disabled = false }: IllustratedNPCProps) {
  const id = useId().replace(/:/g, '');
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  return <button type="button" className={`illustrated-npc ${className}`} data-mood={mood} data-speaking={speaking} data-art="programmatic-prototype" disabled={disabled} aria-label={`Talk to ${name}`} onClick={onInteract}
    onPointerMove={event => { if(event.pointerType === 'touch') return; const b = event.currentTarget.getBoundingClientRect(); setGaze({ x: Math.max(-1,Math.min(1,(event.clientX-b.left)/b.width*2-1)), y: Math.max(-1,Math.min(1,(event.clientY-b.top)/b.height*2-1)) }); }}
    onPointerLeave={() => setGaze({x:0,y:0})} onBlur={() => setGaze({x:0,y:0})} style={{'--gaze-x':gaze.x,'--gaze-y':gaze.y} as CSSProperties}>
    <span className="illustrated-npc__aura" aria-hidden="true" />
    <span className="illustrated-npc__puppet" aria-hidden="true">{parts ? parts.map(p => <span key={p.id} className={`illustrated-npc__part ${p.className ?? ''}`} style={{'--depth':p.depth ?? 0} as CSSProperties}>{p.content}</span>) :
    <svg viewBox="0 0 320 460" className="npc-art" focusable="false">
      <defs>
        <linearGradient id={`${id}-coat`} x2=".8" y2="1"><stop stopColor={role==='baker'?'#ae8a57':'#b9c1ac'} /><stop offset="1" stopColor={role==='baker'?'#766147':'#64796c'} /></linearGradient>
        <linearGradient id={`${id}-skin`} x2="1" y2=".5"><stop stopColor="#e2bd96" /><stop offset="1" stopColor="#af7f65" /></linearGradient>
        <filter id={`${id}-paper`}><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="8" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".05" /></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply" /></filter>
      </defs>
      <ellipse cx="160" cy="444" rx="120" ry="11" fill="#26382d" opacity=".2" />
      <g className="npc-art__body" filter={`url(#${id}-paper)`}>
        <path d="M38 433 48 268Q53 232 117 218L198 218Q261 230 270 268L287 433Z" fill={`url(#${id}-coat)`} stroke="#37463a" strokeWidth="2" />
        <path d="m129 195-6 34 36 29 34-30-6-34" fill={`url(#${id}-skin)`} />
        <path d="m124 229 35 28 34-29-4 202h-60Z" fill="#e2d8bc" />
        <path d="m117 221-17 53 30-9 24 86-2-94Zm81 0 24 53-28-8-27 85-5-94Z" fill={role==='baker'?'#cfbd95':'#e2e3cf'} />
        {role==='baker' && <path d="m105 300 111 1 18 131H89Z" fill="#ded1b1" stroke="#ac9670" />}
        <path d="m65 299-10 111 43 9m154-119 14 111-42 8" fill="none" stroke="#384b40" strokeWidth="3" opacity=".4" />
        <path d="M76 405q29-14 50 3l15 20-61 2Zm168 0q-29-14-49 3l-12 20 57 2Z" fill={`url(#${id}-skin)`} />
        <g className="npc-art__head">
          <path d="M108 123q-22-19-18 10t22 22m94-33q24-18 18 12t-21 21" fill="#b88b6c" />
          <path d="M104 96q-1-49 54-51 57 0 56 53l-7 69q-7 44-45 49-40-3-49-44Z" fill={`url(#${id}-skin)`} stroke="#826249" strokeWidth="1.5" />
          <path d="M102 124Q83 71 113 47q27-26 66-10 47 2 37 85l-14-36q-41 5-64-18-9 27-31 31Z" fill="#42483e" />
          <path d="M109 71q33-33 76-18m-77 30q18-17 31-19" stroke="#95917b" strokeWidth="5" opacity=".35" fill="none" />
          <path className="npc-art__brows" d="m117 119 26-3m32 0 26 4" stroke="#514b3d" strokeWidth="4" strokeLinecap="round" />
          <g className="npc-art__eyes"><path d="M115 134q15-11 30 0-16 9-30 0M172 134q15-11 30 0-16 9-30 0" fill="#e8ddc3" /><g className="npc-art__gaze" fill="#344237"><ellipse cx="131" cy="133" rx="4" ry="5" /><ellipse cx="188" cy="133" rx="4" ry="5" /></g></g>
          <path d="m160 131-5 27 12 3" stroke="#976e52" fill="none" strokeWidth="2" />
          <path className="npc-art__mouth" d="M142 181q18 4 35-1" stroke="#805447" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="m119 155 17 4m47 0 16-4" stroke="#c48468" strokeWidth="7" opacity=".22" />
        </g>
      </g>
    </svg>}</span><span className="illustrated-npc__name">{name}</span>
  </button>;
}

