import type { ReactNode } from 'react';
import './first-person-stage.css';
export type FirstPersonStageProps = { children?: ReactNode; className?: string };
/** Painted SVG prototype; production raster assets can replace these scenery layers. */
function Room({ kind, children, className = '' }: FirstPersonStageProps & { kind: 'laboratory' | 'bakery' }) {
 const bakery = kind === 'bakery';
 return <section className={`fp-stage fp-stage--${kind} ${className}`} aria-label={bakery ? 'Bakery interior' : 'Laboratory interior'} data-art="programmatic-prototype">
   <svg className="fp-stage__back" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
     <rect width="1200" height="720" fill={bakery?'#bca47b':'#abb6a0'} />
     <path d="M0 0 225 125V495L0 720Zm1200 0L990 125V495l210 225Z" fill={bakery?'#8c7759':'#70897a'} />
     <path d="M0 720 225 495h765l210 225Z" fill={bakery?'#74634d':'#66776b'} />
     <path d="M225 0v495h765V0M0 600h1200M0 675h1200M360 495 255 720m255-225-35 225m190-225 35 225m190-225 105 225" stroke="#31483d" strokeWidth="2" opacity=".25" fill="none" />
     <path d="M240 135h737M240 145h737" stroke="#d8d5b4" strokeWidth="4" opacity=".4" />
     <rect x="300" y="170" width="230" height="245" fill="#405d4f" />
     <rect x="310" y="180" width="210" height="222" fill={bakery?'#dbc78f':'#cbd5b9'} />
     <path d="M415 180v222m-105-113h210" stroke="#708272" strokeWidth="9" />
     <path d="m312 183 200 0-90 216H312Z" fill="#f1e5b9" opacity=".3" />
     {bakery ? <g>
       <rect x="620" y="192" width="285" height="241" rx="3" fill="#635942" />
       {[260,337,414].map(y=><g key={y}><path d={`M627 ${y}h270`} stroke="#c4a26b" strokeWidth="10" />{[649,725,806].map(x=><g key={x}><path d={`M${x} ${y-9}q-7-41 23-40 32 0 31 40Z`} fill="#c79a58" stroke="#967040" strokeWidth="2" /><path d={`m${x+13} ${y-38} 12 18m0-24 12 20`} stroke="#e8c58a" strokeWidth="4" /></g>)}</g>)}
       <path d="M103 360h80v172h-80Z" fill="#a98e64" /><path d="M108 361q30-110 63 0" fill="#ccb386" />
     </g> : <g>
       <rect x="625" y="207" width="279" height="217" fill="#738779" stroke="#455e50" strokeWidth="6" />
       <path d="M625 313h279m-142-106v217" stroke="#bac1a8" strokeWidth="5" />
       {[655,717,797,855].map((x,i)=><g key={x}><path d={`M${x} ${i%2?348:243}v12l-10 29q-2 8 8 8h21q9 0 6-8l-10-29v-12Z`} fill={i%2?'#b8bb9b':'#c8d0b0'} opacity=".8" /><path d={`M${x-7} ${i%2?389:284}h32`} stroke="#a89865" strokeWidth="5" /></g>)}
       <circle cx="1030" cy="220" r="38" fill="#d5d3b6" stroke="#415b4b" strokeWidth="7" /><path d="m1030 191v29l19 12" stroke="#415b4b" strokeWidth="4" fill="none" />
     </g>}
     <path d="M570 0v88m-62 45 62-45 64 45Z" stroke="#3d5141" strokeWidth="5" fill="#747860" />
     <ellipse cx="570" cy="136" rx="62" ry="8" fill="#e9d4a3" />
   </svg>
   <div className="fp-stage__light" aria-hidden="true" />
   <div className="fp-stage__actors">{children}</div>
   <svg className="fp-stage__foreground" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
     <path d="M85 40 1120 40l80 75H0Z" fill={bakery?'#b99a68':'#a3ac92'} stroke="#475446" strokeWidth="3" />
     <path d="M0 115h1200v85H0Z" fill={bakery?'#695640':'#485c4d'} />
     <path d="M0 124h1200" stroke="#d4bc88" strokeWidth="4" opacity=".5" />
     {bakery?<g><ellipse cx="268" cy="70" rx="143" ry="22" fill="#6c654d" /><path d="M169 65q15-58 76-18 50-62 107 13Z" fill="#ce9e56" stroke="#9b733e" strokeWidth="3" /><path d="m204 34 10 19m53-18 10 19m40-15 10 18" stroke="#edd099" strokeWidth="6" /></g>:<g><path d="m180 42 130-5 37 47-139 8Z" fill="#e2d9b6" /><path d="m211 51 70-3m-62 14 71-3m-63 14 43-2" stroke="#8c9177" strokeWidth="2" /><path d="M912 9h45v57q-21 15-45 0Z" fill="#bbcab3" stroke="#647f6d" strokeWidth="3" /><ellipse cx="934" cy="10" rx="22" ry="5" fill="#627a69" /></g>}
   </svg>
   <div className="fp-stage__grain" aria-hidden="true" />
 </section>;
}
export function LaboratoryStage(props: FirstPersonStageProps) { return <Room kind="laboratory" {...props} />; }
export function BakeryStage(props: FirstPersonStageProps) { return <Room kind="bakery" {...props} />; }
