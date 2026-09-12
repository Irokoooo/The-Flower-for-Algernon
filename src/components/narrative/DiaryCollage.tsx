import { useId, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { CognitionState } from '../../core/types';
import type { ReportDraft } from '../../narrative/report';
import { diaryEntries } from '../../content/diary-collage';
import './diary-collage.css';

export interface DiaryCollageProps {
  phase: CognitionState['phase'];
  entryId: 'first' | 'peak' | 'last';
  previousText?: string;
  onSave: (report: ReportDraft) => void;
}
type Fragment = { id: string; text: string; role: 'subject' | 'intent' | 'detail' | 'ending' };

/** Entry changes reset the local draft without relying on the parent's React key. */
export function DiaryCollage(props: DiaryCollageProps) {
  return <CollagePage key={`${props.entryId}:${props.phase}`} {...props} />;
}

function CollagePage({phase, entryId, previousText = '', onSave}: DiaryCollageProps) {
  const entry = diaryEntries[entryId];
  const [selected, setSelected] = useState<Fragment[]>([]);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const locked = useRef(false);
  const root = useRef<HTMLElement>(null);
  const gesture = useRef<{id: string; x: number; y: number} | null>(null);
  const suppressClick = useRef(false);
  const hintId = useId();
  // Whole prior text remains intact; matching old fragments are separately reusable.
  const recalled: Fragment[] = entryId === 'last' && previousText ?
    Object.values(diaryEntries).flatMap(value => value.fragments)
      .filter((fragment, index, all) => previousText.includes(fragment.text)
        && !entry.fragments.some(current => current.text === fragment.text)
        && all.findIndex(other => other.text === fragment.text) === index)
      .map(fragment => ({...fragment, id: `memory:${fragment.id}`})) : [];
  const fragments: Fragment[] = [...entry.fragments, ...recalled];
  const rawText = selected.map(fragment => fragment.text).join('');
  const minimum = Math.max(3, entry.minFragments);
  const meaningful = selected.length >= minimum
    && selected.some(fragment => fragment.role === 'subject')
    && selected.some(fragment => fragment.role === 'intent');

  function place(id: string, beforeId?: string) {
    if (locked.current || id === beforeId) return;
    const fragment = fragments.find(value => value.id === id);
    if (!fragment) return;
    setSelected(previous => {
      const next = previous.filter(value => value.id !== id);
      const index = beforeId ? next.findIndex(value => value.id === beforeId) : -1;
      next.splice(index < 0 ? next.length : index, 0, fragment);
      return next;
    });
    setNotice(`已放入「${fragment.text}」。`);
  }
  function move(index: number, direction: number) {
    if (locked.current) return;
    setSelected(previous => {
      const next = [...previous], target = index + direction;
      if (target < 0 || target >= next.length) return previous;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  function start(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (locked.current || event.button !== 0) return;
    suppressClick.current = false;
    gesture.current = {id, x: event.clientX, y: event.clientY};
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function finish(event: PointerEvent<HTMLButtonElement>) {
    const drag = gesture.current;
    gesture.current = null;
    if (!drag) return;
    const moved = Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8;
    suppressClick.current = moved;
    if (!moved) return;
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target && root.current?.contains(target) && target.closest('[data-collage-drop]')) {
      place(drag.id, target.closest<HTMLElement>('[data-fragment-id]')?.dataset.fragmentId);
    }
  }
  const gestureProps = (id: string) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => start(event, id),
    onPointerUp: finish,
    onPointerCancel: () => {gesture.current = null; suppressClick.current = true;},
  });

  return <section ref={root} className={`diary-collage diary-collage--${phase.toLowerCase()}`} lang="zh-Hans" aria-label={entry.title}>
    <header><span className="diary-collage__folio">进步报告 · {entryId === 'first' ? '01' : entryId === 'peak' ? '07' : '11'}</span>
      <h2>{entry.title}</h2><p>{entry.context}</p></header>
    {entryId === 'last' && previousText && <details className="diary-collage__memory" open>
      <summary>翻开从前写下的话</summary><blockquote>{previousText}</blockquote>
      <p>这些字还在。你可以从下方拾起记得的词，重新排列。</p>
    </details>}
    <p id={hintId} className="diary-collage__hint">点选或拖动纸片，把想说的话拼起来。用左右按钮调整顺序，× 收回纸片。</p>
    <div className="diary-collage__bank" aria-label="可用词语" aria-describedby={hintId}>
      {fragments.map(fragment => <button type="button" className={`diary-collage__scrap ${fragment.id.startsWith('memory:') ? 'diary-collage__scrap--memory' : ''}`} key={fragment.id}
        disabled={saved || selected.some(value => value.id === fragment.id)} {...gestureProps(fragment.id)}
        onClick={event => {if (event.detail === 0 || !suppressClick.current) place(fragment.id); suppressClick.current = false;}}
        aria-label={`放入：${fragment.text}`}>{fragment.text}</button>)}
    </div>
    <ol className="diary-collage__sentence" data-collage-drop aria-label="我的句子">
      {selected.length === 0 && <li className="diary-collage__empty">把第一张纸片放在这里……</li>}
      {selected.map((fragment, index) => <li key={fragment.id} data-fragment-id={fragment.id}>
        <button type="button" className="diary-collage__scrap" disabled={saved} {...gestureProps(fragment.id)} aria-label={`拖动「${fragment.text}」调整位置`}>{fragment.text}</button>
        {!saved && <div className="diary-collage__tools">
          <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`将「${fragment.text}」前移`}>←</button>
          <button type="button" disabled={index === selected.length - 1} onClick={() => move(index, 1)} aria-label={`将「${fragment.text}」后移`}>→</button>
          <button type="button" onClick={() => {if (!locked.current) setSelected(values => values.filter(value => value.id !== fragment.id));}} aria-label={`收回「${fragment.text}」`}>×</button>
        </div>}
      </li>)}
    </ol>
    <p className="diary-collage__reading" aria-label="连起来读">{rawText || '……'}</p>
    <div className="diary-collage__save"><button type="button" disabled={!meaningful || saved} onClick={() => {
      if (locked.current || !meaningful) return;
      locked.current = true;
      const report: ReportDraft = {rawText, expressedText: rawText, stimulusId: `diary-collage:${entryId}`, phase, savedAt: new Date().toISOString(), transformation: 'none'};
      try {onSave(report); setSaved(true); setNotice('这页已经保存。可以继续了。');}
      catch {locked.current = false; setNotice('这页还没有保存，请再试一次。');}
    }}>{saved ? '这页已留下' : '留下这页'}</button>
      {!meaningful && !saved && <small>至少选 {minimum} 张纸片，说说谁、想做什么。没有唯一的答案。</small>}
    </div>
    <p role="status" className="diary-collage__notice">{notice}</p>
  </section>;
}
