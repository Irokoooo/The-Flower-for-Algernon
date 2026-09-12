import { useState, useId } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { SubtitlePair, CognitionPhase } from '../../narrative/types';
import { saveProgressReport, preserveFinalMemory } from '../../narrative/report';
import type { ReportDraft } from '../../narrative/report';
export function SubtitleBlock({text}:{text:SubtitlePair}) {
  return <div aria-live="polite" aria-atomic="true"><p lang="en">{text.en}</p><p lang="zh-Hans">{text.zhHans}</p></div>;
}
/** Existing raw onSave callback retained; onSaveReport provides the auditable saved projection. */
export function ReportEditor({onSave, onSaveReport, phase='PEAK', stimulusId='test-card', initialText='', debug=false}:{
  onSave?:(raw:string)=>void; onSaveReport?:(report:ReportDraft)=>void;
  phase?:CognitionPhase; stimulusId?:string; initialText?:string; debug?:boolean;
}) {
  const [raw,setRaw]=useState(initialText);
  const [saved,setSaved]=useState<ReportDraft | null>(null);
  const id=useId();
  return <form onSubmit={(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const report=saveProgressReport(raw,stimulusId,phase);
    setSaved(report); onSaveReport?.(report); onSave?.(raw);
  }}>
    <label htmlFor={id}>Progress report / 进步报告</label>
    <textarea id={id} value={raw} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setRaw(e.target.value)} />
    <button type="submit">Save report / 保存报告</button>
    {saved && <section aria-live="polite"><h3>Saved report / 已保存报告</h3>
      <p style={{whiteSpace:'pre-wrap'}}>{saved.expressedText}</p>
      {debug && <details><summary>Original input / 原始输入</summary><pre style={{whiteSpace:'pre-wrap'}}>{saved.rawText}</pre></details>}
    </section>}
  </form>;
}
export function FinalMemoryEditor({onSave}:{onSave:(raw:string)=>void}) {
  const [raw,setRaw]=useState('');
  const id=useId();
  return <form onSubmit={(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();onSave(preserveFinalMemory(raw));}}>
    <label htmlFor={id}>What will you remember? / 你会记住什么？</label>
    <textarea id={id} value={raw} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>setRaw(e.target.value)}/>
    <button type="submit">Keep these words / 留下这些话</button>
  </form>;
}

