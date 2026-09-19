import { useId } from 'react';
import type { CognitionState } from '../../core/types';
import type {
  ChapterAction, ChapterProgress, ChapterRequirement, ChapterStep, ChapterText,
} from '../../narrative/chapter-two';
import { CognitionGraph } from '../../cognition/CognitionGraph';
import { EvidencePlacement } from './EvidencePlacement';
import { SubtitleBlock } from './SubtitleBlock';
import './journey-panel.css';

export interface JourneyPanelProps {
  step: ChapterStep;
  progress: ChapterProgress;
  labels: Readonly<Record<string, ChapterText>>;
  onAction: (a: ChapterAction) => void;
  onContinue: () => void;
  continueLabel?: ChapterText;
}

const joined = (text: ChapterText) => `${text.en} / ${text.zhHans}`;
const continueText: ChapterText = { en: 'Continue', zhHans: '继续' };

/** Presentation only: the parent applies ChapterAction and owns progress and closing. */
export function JourneyPanel({
  step, progress, labels, onAction, onContinue, continueLabel = continueText,
}: JourneyPanelProps) {
  const titleId = useId();
  const completed = new Set(progress.completed);
  const done = (requirement: ChapterRequirement) => completed.has(requirement.id);
  const unlocked = (requirement: ChapterRequirement) =>
    (requirement.after ?? []).every(id => completed.has(id));
  const ready = step.requirements.length > 0 && step.requirements.every(done);
  const available = step.requirements.filter(requirement => !done(requirement) && unlocked(requirement));
  const low = step.phase === 'LOW';
  const first = available[0];
  // LOW reveals one action at a time, retaining every offered response to a choice.
  const visible = low ? available.filter(requirement => requirement === first || (
    first?.action.kind === 'choose' && requirement.action.kind === 'choose'
    && requirement.action.targetId === first.action.targetId
  )) : available;
  const send = (requirement: ChapterRequirement) => {
    if (!done(requirement) && unlocked(requirement)) onAction(requirement.action);
  };
  const objectIds = [...new Set(step.requirements.flatMap(({ action }) => {
    if (action.kind === 'connect') return [];
    return action.kind === 'place' ? [action.itemId, action.targetId] : [action.targetId];
  }))];
  const label = (id: string, kind: 'object' | 'item' | 'place' = 'object'): ChapterText => {
    if (labels[id]) return labels[id];
    const number = objectIds.indexOf(id) + 1;
    const fallback = {
      object: { en: 'Object', zhHans: '物件' },
      item: { en: 'Card', zhHans: '纸片' },
      place: { en: 'Place', zhHans: '位置' },
    }[kind];
    return { en: `${fallback.en} ${number}`, zhHans: `${fallback.zhHans} ${number}` };
  };
  const optionLabel = (action: Extract<ChapterAction, { kind: 'choose' }>): ChapterText =>
    step.options?.find(option => option.targetId === action.targetId && option.optionId === action.optionId)?.label
    ?? labels[action.optionId] ?? { en: 'Respond', zhHans: '回应' };

  const connections = step.requirements.filter(requirement => requirement.action.kind === 'connect');
  const activeConnections = visible.filter(requirement => requirement.action.kind === 'connect');
  const graphEdges = step.graph.edges.filter(edge => edge.phases.includes(step.phase)
    && connections.some(requirement => requirement.action.kind === 'connect'
      && requirement.action.edgeId === edge.id
      && (activeConnections.includes(requirement) || (!low && done(requirement)))));
  const graphNodeIds = new Set(graphEdges.flatMap(edge => [edge.from, edge.to]));
  const graph = { nodes: step.graph.nodes.filter(node => graphNodeIds.has(node.id)), edges: graphEdges };
  const connectedEdgeIds = connections.flatMap(requirement =>
    done(requirement) && requirement.action.kind === 'connect' ? [requirement.action.edgeId] : []);
  // A view adapter for the existing graph, not another cognition/progress store.
  const cognition: CognitionState = {
    phase: step.phase,
    perceivedDetail: 1,
    affordances: [...new Set(graphEdges.flatMap(edge => edge.requiredAffordance ? [edge.requiredAffordance] : []))],
  };
  const inspected = step.requirements.some(requirement => requirement.action.kind === 'inspect' && done(requirement));
  const receipt = (requirement: ChapterRequirement): ChapterText => {
    const action = requirement.action;
    if (action.kind === 'inspect') {
      const target = label(action.targetId);
      return { en: `Looked at ${target.en}.`, zhHans: `看过了：${target.zhHans}。` };
    }
    if (action.kind === 'place') {
      const item = label(action.itemId, 'item'), target = label(action.targetId, 'place');
      return { en: `${item.en} — placed: ${target.en}.`, zhHans: `${item.zhHans} · 已放置：${target.zhHans}。` };
    }
    if (action.kind === 'choose') {
      const choice = optionLabel(action);
      return { en: `My response: ${choice.en}`, zhHans: `我的回应：${choice.zhHans}` };
    }
    return { en: 'I made the connection.', zhHans: '我连起来了。' };
  };
  const conclusionVisible = step.presentation && step.requirements.some(requirement =>
    requirement.id === step.presentation?.holdConclusionUntilRequirementId && done(requirement));

  return <section className="interaction-panel journey-panel" data-quiet={low} aria-labelledby={titleId}>
    <header className="journey-panel__heading">
      <h2 id={titleId}><span lang="en">{step.title.en}</span><span lang="zh-Hans">{step.title.zhHans}</span></h2>
      <div className="journey-panel__objective"><SubtitleBlock text={step.objective} /></div>
    </header>

    {inspected && <div className="journey-panel__facts"><SubtitleBlock text={step.stimulus.facts} /></div>}

    {step.requirements.some(done) && <div className="journey-panel__receipt" role="status" aria-label="Completed actions">
      {step.requirements.filter(done).map(requirement => <span key={requirement.id}>
        <span lang="en">{receipt(requirement).en}</span>
        <span lang="zh-Hans">{receipt(requirement).zhHans}</span>
      </span>)}
    </div>}

    <div className="journey-panel__actions">
      {visible.map(requirement => {
        const action = requirement.action;
        const key = `${step.id}:${requirement.id}`;
        if (action.kind === 'inspect') return <button className="journey-panel__inspect" type="button" key={key} onClick={() => send(requirement)}>
          <span className="journey-panel__verb">Look closely / 看一看</span>
          <span lang="en">{label(action.targetId).en}</span><span lang="zh-Hans">{label(action.targetId).zhHans}</span>
        </button>;
        if (action.kind === 'place') return <div className="journey-panel__placement" key={key}>
          <EvidencePlacement
            itemLabel={joined(label(action.itemId, 'item'))}
            targetLabel={joined(label(action.targetId, 'place'))}
            onPlace={() => send(requirement)}
          />
        </div>;
        if (action.kind === 'choose') return <button className="journey-panel__choice" type="button" key={key} onClick={() => send(requirement)}>
          <span lang="en">{optionLabel(action).en}</span><span lang="zh-Hans">{optionLabel(action).zhHans}</span>
        </button>;
        return null;
      })}
    </div>

    {activeConnections.length > 0 && graphEdges.length > 0 && <div className="journey-panel__connections">
      <CognitionGraph
        key={`${step.id}:${step.phase}:${graphEdges.map(edge => edge.id).join('|')}`}
        model={graph}
        cognition={cognition}
        connectedEdgeIds={connectedEdgeIds}
        onConnect={edgeId => {
          const requirement = activeConnections.find(candidate => candidate.action.kind === 'connect' && candidate.action.edgeId === edgeId);
          if (requirement) send(requirement);
        }}
      />
    </div>}

    {conclusionVisible && step.presentation && <div className="journey-panel__conclusion"><SubtitleBlock text={step.presentation.conclusion} /></div>}
    {ready && <div className="journey-panel__resolution">
      <SubtitleBlock text={step.perception[step.phase]} />
      <button className="primary journey-panel__continue" type="button" onClick={() => { if (ready) onContinue(); }}>
        <span lang="en">{continueLabel.en}</span><span lang="zh-Hans">{continueLabel.zhHans}</span><span aria-hidden="true">→</span>
      </button>
    </div>}
  </section>;
}
