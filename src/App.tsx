import { useEffect, useRef, useState } from 'react';
import { ExplorableRoom } from './components/world/ExplorableRoom';
import { getRoomVisuals, resolveVisualAsset } from './core/visual-registry';

import { SubtitleBlock, ReportEditor } from './components/narrative/SubtitleBlock';
import { CognitionGraph } from './cognition/CognitionGraph';
import { MazeBox } from './cognition/MazeBox';
import { BAKERY_GRAPH } from './cognition/presets';
import { chapterTwoSteps } from './content/chapter-two';
import { applyChapterAction, type ChapterProgress, type ChapterAction } from './narrative/chapter-two';
import { observations, testGraph, machineGraph, lines } from './content/experience';
import type { CognitionState } from './core/types';
import type { ReportDraft } from './narrative/report';
import { voiceForText } from './audio/production-voices';
import { AudioManager } from './audio/AudioManager';
import { resolveAudioAsset } from './core/audio-registry';

import { PERCEPTION_PRESETS } from './audio/perception';
import './app.css';
type Step='title'|'lab'|'test'|'diary'|'bakery'|'gain'|'machine'|'revisit'|'peak-report'|'classroom'|'decline'|'last-report'|'finish';
type Pair={en:string;zhHans:string};
function availableVoice(english:string) {
 const voice=voiceForText(english);
 if(!voice)return undefined;
 try {const asset=resolveAudioAsset(voice.assetId);return asset.kind==='voice'?voice:undefined;}catch{return undefined;}
}
const classroom = chapterTwoSteps.find(item=>item.id==='classroom-a')!;
export default function App(){
 const [narrow,setNarrow]=useState(()=>window.matchMedia('(max-width: 760px)').matches);
 useEffect(()=>{const query=window.matchMedia('(max-width: 760px)');const change=()=>setNarrow(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
 const [lesson,setLesson]=useState<ChapterProgress>({completed:[]});
 const [step,setStep]=useState<Step>('title'),[text,setText]=useState<Pair>(lines.welcome),[speaker,setSpeaker]=useState('Dr. Strauss');
 const [observed,setObserved]=useState<string[]>([]),[edges,setEdges]=useState<string[]>([]),[bread,setBread]=useState(0),[choice,setChoice]=useState(''),[report,setReport]=useState<ReportDraft|null>(null),[intent,setIntent]=useState('');
 const [transition,setTransition]=useState(false),[muted,setMuted]=useState(false),[audioNote,setAudioNote]=useState(''),[speaking,setSpeaking]=useState(false),[taskOpen,setTaskOpen]=useState(false),[dialogueOpen,setDialogueOpen]=useState(false),[mazeOpen,setMazeOpen]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined), voiceRequest=useRef(0),musicStarted=useRef(false),audio=useRef<AudioManager|null>(null);
 const phase:CognitionState['phase']=['decline','last-report'].includes(step)?'DECLINE':['machine','revisit','peak-report'].includes(step)?'PEAK':step==='gain'||step==='classroom'?'ASCENDING':'LOW';
 const cognition:CognitionState={phase,affordances:[],perceivedDetail:phase==='PEAK'?1:phase==='DECLINE'?.3:.4};
 const bakery=['bakery','gain','machine','revisit','peak-report','classroom','decline','last-report'].includes(step);
 useEffect(()=>()=>{clearTimeout(timer.current);voiceRequest.current++;void audio.current?.dispose();},[]);
 useEffect(()=>{audio.current?.setPerception(phase==='PEAK'?PERCEPTION_PRESETS.clear:phase==='DECLINE'?PERCEPTION_PRESETS.strained:PERCEPTION_PRESETS.softened);},[phase]);
 const stopVoice=()=>{voiceRequest.current++;setSpeaking(false);audio.current?.stopVoice();};
 const say=(line:Pair,person=line===lines.welcome||line===lines.test?'Dr. Strauss':line===lines.bakery?'Gimpy':'Charlie')=>{
   stopVoice(); const request=voiceRequest.current;const voice=voiceForText(line.en);
   setText(line);setSpeaker(voice?.speaker??person);setDialogueOpen(true);setAudioNote('');
   if(!voice||!audio.current||!availableVoice(line.en))return;
   void audio.current.unlock().then(()=>{if(request!==voiceRequest.current)return;return audio.current!.playVoice(voice.assetId);}).then(async handle=>{if(!handle)return;if(request!==voiceRequest.current){handle.stop();return;}setSpeaking(true);await handle.ended;if(request===voiceRequest.current)setSpeaking(false);}).catch(()=>{if(request===voiceRequest.current)setSpeaking(false);});
 };
 const go=(next:Step,line?:Pair)=>{stopVoice();setSpeaking(false);setEdges([]);setReport(null);setStep(next);setTaskOpen(false);setDialogueOpen(false);if(line)say(line);};
 const bridge=(next:Step,line:Pair)=>{clearTimeout(timer.current);setTransition(true);void audio.current?.playSound('audio.paper.prototype').catch(()=>{});timer.current=setTimeout(()=>{go(next,line);setTransition(false);},1400);};
 const begin=()=>{setLesson({completed:[]});setObserved([]);setBread(0);setChoice('');setIntent('');if(!audio.current)audio.current=new AudioManager(resolveAudioAsset);audio.current.setMuted(muted);void audio.current.unlock().then(async()=>{if(musicStarted.current)return;musicStarted.current=true;try{await audio.current!.playSound('audio.music.still-room',true);}catch{musicStarted.current=false;}}).catch(()=>{});go('lab',lines.welcome);setSpeaker('Dr. Strauss');};
 const connect=(id:string)=>{setEdges(previous=>previous.includes(id)?previous:[...previous,id]);void audio.current?.playSound('audio.chime.prototype').catch(()=>{});};
 const lessonAction=(action:ChapterAction)=>{const result=applyChapterAction(classroom,lesson,action);setLesson(result.progress);};
 const lessonReady=classroom.requirements.every(item=>lesson.completed.includes(item.id));
 const closeUI=()=>{setTaskOpen(false);setDialogueOpen(false);stopVoice();};
 const interact=(id:string)=>{
   if(transition||taskOpen||dialogueOpen||mazeOpen)return;
   if(step==='lab') {
     if(!['lab-cabinet','research-notes','test-desk','researcher'].includes(id))return;
     const key=id==='lab-cabinet'?'book':'paper';
     if(id==='researcher'||id==='test-desk'&&observed.length>=2){if(observed.length>=2)go('test',lines.test);else say(lines.welcome);return;}
     setObserved(a=>a.includes(key)?a:[...a,key]);say(observations[key]);return;
   }
   if(step==='classroom'&&['bread-counter','oven','bread-shelf'].includes(id)){setTaskOpen(true);return;}
   if(id==='researcher'||id==='baker'){say(bakery?(bread<3?lines.bakery:lines.success):lines.test);return;}
   if(['test-desk','research-notes','bread-counter','oven','bread-shelf'].includes(id))setTaskOpen(true);
 };
 useEffect(()=>{if(!taskOpen&&!dialogueOpen)return;const before=document.activeElement as HTMLElement|null;const dialog=document.querySelector<HTMLElement>(dialogueOpen?'.dialogue-card':'.task-modal');dialog?.querySelector<HTMLElement>('button,textarea')?.focus();const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();if(dialogueOpen)setDialogueOpen(false);else setTaskOpen(false);stopVoice();}if(e.key==='Tab'){const items=Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea,a[href]')??[]);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};window.addEventListener('keydown',key);return()=>{window.removeEventListener('keydown',key);before?.focus();};},[taskOpen,dialogueOpen]);
 const objective=step==='classroom'?'Open your lecture notes at the workbench. / 在工作台边打开课堂笔记。':step==='lab'?'Examine two objects, then speak to the researcher. / 观察两件物品后，与研究员交谈。':step==='test'?'Examine the test desk. / 查看测试桌。':['diary','peak-report','last-report'].includes(step)?'Open your notebook at a desk. / 走到桌边打开笔记本。':step==='bakery'?'Go to the bread counter. / 走到面包柜台。':'Inspect the workbench or oven. / 查看工作台或烤炉。';
 return <main className={`game game--${phase.toLowerCase()}`}>
  <div className="world"><ExplorableRoom scene={bakery?'bakery':'laboratory'} assets={{...getRoomVisuals(bakery?'bakery':'laboratory'),...(narrow?{hands:undefined}:{})}} onInteract={interact} npcReacting={dialogueOpen&&speaker===(bakery?'Gimpy':'Dr. Strauss')} paused={step==='title'||step==='finish'||transition||taskOpen||dialogueOpen||mazeOpen}/></div>
  {narrow&&step!=='title'&&step!=='finish'&&!taskOpen&&!dialogueOpen&&!mazeOpen&&resolveVisualAsset('charlie-hands')&&<img className="player-hands player-hands--compact" src={resolveVisualAsset('charlie-hands')} alt=""/>}
  <header className="game-header"><a href="#" onClick={e=>{e.preventDefault();clearTimeout(timer.current);setTransition(false);closeUI();setStep('title');audio.current?.stopVoice();}}>ALGERNON<span>A STUDY IN REMEMBERING</span></a><nav><button onClick={()=>{setMuted(v=>!v);audio.current?.setMuted(!muted);}}>{muted?'Unmute':'Sound on'}</button><a href="/project-status.html" target="_blank" rel="noreferrer">Studio ↗</a></nav></header>
  {step==='title'?<section className="title-page"><p className="kicker">AN INTERACTIVE NARRATIVE</p><h1>Flowers<br/>for <em>Algernon.</em></h1><div className="fine-line"/><p className="title-quote">The world hasn't changed.<br/>The way you see it will.</p><button className="primary" onClick={begin}>Open your eyes <span>睁开眼睛 →</span></button><p className="build-note">First playable study · 正式插画持续制作中，英语配音待就绪<br/>English · EN / 简中</p></section>:<>
  <div className="chapter-mark"><span>{bakery?'D O N N E R ’ S   B A K E R Y':'B E E K M A N   L A B O R A T O R Y'}</span><i>{bakery?'Bread, flour, familiar faces.':'Paper. A clock. Someone waiting.'}</i></div>
  {step!=='finish'&&!taskOpen&&!dialogueOpen&&<p className="objective">{objective}</p>}
  {taskOpen&&<div className="modal-backdrop"><div className="task-modal" inert={dialogueOpen} role="dialog" aria-modal={!dialogueOpen} aria-label="Current task / 当前任务"><button className="close-task" onClick={closeUI}>Return to the room / 返回房间 ×</button>
  {step==='test'&&<section className="interaction-panel"><p className="kicker">A LITTLE INK ON PAPER</p><h2>What do you see?</h2><CognitionGraph model={testGraph} cognition={cognition} connectedEdgeIds={edges} onConnect={connect}/><button className="primary" disabled={!edges.length} onClick={()=>go('diary',{en:'Maybe I did all right. I should write it down.',zhHans:'也许我做得还不错。我应该写下来。'})}>A butterfly, maybe. <span>也许是蝴蝶 →</span></button></section>}
  {['diary','peak-report','last-report'].includes(step)&&<section className="interaction-panel report-panel"><p className="kicker">PROGRESS REPORT · {step==='diary'?'01':step==='peak-report'?'07':'11'}</p><h2>{step==='last-report'?'I remember knowing.':'A page of my own.'}</h2><ReportEditor key={step} phase={phase} initialText={step==='last-report'?intent:''} onSaveReport={r=>{setReport(r);if(step==='peak-report')setIntent(r.rawText);}}/>{report&&<button className="primary" onClick={()=>step==='diary'?bridge('bakery',lines.bakery):step==='peak-report'?go('classroom'):go('finish')}>Close the notebook <span>合上笔记本 →</span></button>}</section>}
  {step==='classroom'&&<section className="interaction-panel classroom-panel"><p className="kicker">LECTURE NOTES · 课堂笔记</p><h2>{classroom.title.en}</h2><p lang="zh-Hans">{classroom.title.zhHans}</p><p>{classroom.objective.en}<br/><small lang="zh-Hans">{classroom.objective.zhHans}</small></p>
    <button className="primary" onClick={()=>lessonAction({kind:'inspect',targetId:'memory-study'})}>Examine the study <span>查看实验记录</span></button>
    {lesson.completed.includes('classroom-a.inspect')&&<><SubtitleBlock text={classroom.stimulus.facts}/><button className="primary" disabled={lesson.completed.includes('classroom-a.place')} onClick={()=>lessonAction({kind:'place',targetId:'recall-results',itemId:'category-cue'})}>{lesson.completed.includes('classroom-a.place')?'Cue placed beside recall results':'Place category cue beside recall results'}<span>把类别提示放在回忆结果旁</span></button></>}
    {lesson.completed.includes('classroom-a.place')&&<CognitionGraph model={classroom.graph} cognition={cognition} connectedEdgeIds={lesson.completed.includes('classroom-a.connect')?['classroom-a.connection']:[]} onConnect={edgeId=>lessonAction({kind:'connect',edgeId})}/>}
    {lessonReady&&<><SubtitleBlock text={classroom.perception.ASCENDING}/><button className="primary" onClick={()=>bridge('decline',lines.decline)}>Keep the connection in my notebook <span>将联系记进笔记本 →</span></button></>}
  </section>}
  {step==='bakery'&&<section className="interaction-panel compact"><p className="kicker">THE MORNING SHIFT</p><h2>Something I know.</h2><p>Three loaves. One paper bag.<br/><small>三条面包。一个纸袋。</small></p><button className="bread-action" disabled={bread>=3} onClick={()=>{setBread(b=>b+1);say(bread===2?lines.laughter:lines.bakery);}}><span>{bread<3?'Bag a loaf / 装一条面包':'The bag is ready / 装好了'}</span><b>{bread} / 3</b></button>{bread===3&&<button className="primary" onClick={()=>bridge('gain',lines.gain)}>Another morning <span>又一个清晨 →</span></button>}</section>}
  {step==='gain'&&<section className="interaction-panel compact"><p className="kicker">THE SAME MACHINE</p><h2>Wait. I see it.</h2><p>The lever. The turning wheel.<br/>They aren't separate things.</p><p lang="zh-Hans">拉杆。转动的轮子。它们不是独立的。</p><button className="primary" onClick={()=>go('machine',lines.gain)}>Look closer <span>仔细看看 →</span></button></section>}
  {['machine','decline'].includes(step)&&<section className="interaction-panel"><p className="kicker">THE DOUGH ROLLER</p><h2>{step==='decline'?'There was a connection.':'One thing moves another.'}</h2><CognitionGraph key={step} model={machineGraph} cognition={cognition} connectedEdgeIds={edges} onConnect={connect}/>{step==='machine'?<button className="primary" disabled={edges.length<3} onClick={()=>go('revisit',lines.success)}>Turn the machine <span>开动机器 →</span></button>:<><p className="remembered">lever — gear — roller — dough</p><p>I used to understand this. / 我以前懂得这个。</p><button className="primary" onClick={()=>go('last-report',lines.decline)}>Find my notebook <span>找我的笔记本 →</span></button></>}</section>}
  {step==='revisit'&&<section className="interaction-panel"><p className="kicker">THE SAME LAUGHTER</p><h2>It was always there.</h2><CognitionGraph model={BAKERY_GRAPH} cognition={cognition} connectedEdgeIds={edges} onConnect={connect}/>{edges.length>0&&<div className="choices">{['I only did what I was asked.','Why are you angry?','Say nothing.'].map((line,i)=><button key={line} onClick={()=>{setChoice(line);say({en:i===0?'He looks away. Nobody asks how I did it.':i===1?'“Nobody is angry,” he says, without looking at me.':'I stay quiet. So does he.',zhHans:i===0?'他移开目光。没有人问我是怎样做到的。':i===1?'“没人生气，”他说，却不看我。':'我沉默。他也是。'});}}>{line}<small>{['我只是做了被要求的事。','你为什么生气？','保持沉默。'][i]}</small></button>)}</div>}{choice&&<button className="primary" onClick={()=>go('peak-report',lines.return)}>Write it down <span>记下来 →</span></button>}</section>}
  </div></div>}
  {step==='finish'&&<section className="interaction-panel compact"><p className="kicker">END OF THE FIRST STUDY</p><h2>You remember.</h2><p>That is where we begin.<br/><small>这是我们的起点。</small></p><p className="build-note">本次切片到此结束；课堂笔记已可交互；完整教室、研究、会议与结局仍在开发计划中。</p><button className="primary" onClick={()=>{setObserved([]);setBread(0);setChoice('');setIntent('');go('lab',lines.welcome);}}>Return to the room <span>回到房间 →</span></button></section>}
  {step!=='finish'&&dialogueOpen&&<footer className="subtitles dialogue-card" role="dialog" aria-modal="true" aria-label="Dialogue / 对话"><div className="speaker">{speaker}{speaking?' · speaking':''}</div><SubtitleBlock text={text}/>{availableVoice(text.en)&&<button className="replay" aria-label="Replay English voice" onClick={()=>say(text,speaker)}>↺</button>}<button className="dialogue-dismiss" onClick={()=>{setDialogueOpen(false);stopVoice();}}>Continue / 继续</button></footer>}
  <MazeBox onInspectChange={setMazeOpen} cognition={cognition} suspended={step==='finish'}/>
  </>}
  {audioNote&&<div className="audio-note" role="status" onClick={()=>setAudioNote('')}>{audioNote}</div>}
  {transition&&<div className="ink-transition" aria-label="Turning the page"><span/><i/><span/></div>}
 </main>;
}
