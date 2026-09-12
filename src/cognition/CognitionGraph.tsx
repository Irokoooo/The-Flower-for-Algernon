import { useId, useState } from 'react';
import type { CognitionState } from '../core/types';
import type { CognitionGraphModel } from './contracts';
import './cognition.css';
export interface CognitionGraphProps {
  model: CognitionGraphModel;
  cognition: CognitionState;
  connectedEdgeIds: readonly string[];
  onConnect: (edgeId: string) => void;
  className?: string;
}
export function CognitionGraph({ model, cognition, connectedEdgeIds, onConnect, className = '' }: CognitionGraphProps) {
  const titleId = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('Choose two details. / 选择两个细节。');
  const accessible = model.edges.filter(e => e.phases.includes(cognition.phase) && (!e.requiredAffordance || cognition.affordances.includes(e.requiredAffordance)));
  const byId = new Map(model.nodes.map(n => [n.id, n]));
  const select = (id: string) => {
    if (!selected || !byId.has(selected)) { setSelected(id); setMessage('Choose another detail. / 再选择一个细节。'); return; }
    if (selected === id) { setSelected(null); return; }
    const edge = accessible.find(e => (e.from === selected && e.to === id) || (e.to === selected && e.from === id));
    setSelected(null);
    if (edge) { if (!connectedEdgeIds.includes(edge.id)) onConnect(edge.id); setMessage(`${edge.meaning.en} / ${edge.meaning.zhHans}`); }
    else setMessage('I cannot put these together yet. / 我还不能把它们联系起来。');
  };
  // Reset feedback on a phase/model change using a keyed child in the host, or
  // suppress prior meanings here: feedback is only displayed for its phase.
  const [feedbackPhase, setFeedbackPhase] = useState(cognition.phase);
  return <section className={`cognition-graph ${className}`} aria-labelledby={titleId}>
    <h2 id={titleId}>Connections <span lang="zh-Hans">关联</span></h2>
    <div className="cognition-graph__canvas">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{accessible.filter(e => connectedEdgeIds.includes(e.id)).map(e => {
        const a = byId.get(e.from), b = byId.get(e.to);
        return a && b ? <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} /> : null;
      })}</svg>
      {model.nodes.map(n => { const label = n.perceivedLabels?.[cognition.phase] ?? n.label;
        return <button key={n.id} type="button" className="cognition-graph__node" aria-pressed={selected === n.id}
          style={{ left: `${n.x}%`, top: `${n.y}%` }} onClick={() => { setFeedbackPhase(cognition.phase); select(n.id); }}>
          <span lang="en">{label.en}</span><span lang="zh-Hans">{label.zhHans}</span></button>;
      })}
    </div><p role="status">{feedbackPhase === cognition.phase ? message : 'Choose two details. / 选择两个细节。'}</p>
  </section>;
}
