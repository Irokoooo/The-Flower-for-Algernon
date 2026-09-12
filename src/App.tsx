import { normalizeHotspot } from './core/hotspot-adapter';
import { useEffect, useRef, useState } from 'react';
import { ExplorableRoom } from './components/world/ExplorableRoom';
import { getRoomVisuals } from './core/visual-registry';

import { SubtitleBlock } from './components/narrative/SubtitleBlock';
import { DiaryCollage } from './components/narrative/DiaryCollage';
import { TestStimulus } from './components/narrative/TestStimulus';
import { EvidencePlacement } from './components/narrative/EvidencePlacement';
import { CognitionGraph } from './cognition/CognitionGraph';
import { MazeBox } from './cognition/MazeBox';
import { BAKERY_GRAPH } from './cognition/presets';
import { chapterObjectLabel } from './core/chapter-labels';
import { loadCheckpoint, saveCheckpoint, type Checkpoint } from './core/checkpoint';
import { conferenceChoices, conferenceConvergence, type ConferenceChoiceId } from './content/conference-choice';
import { chapterTwoSteps } from './content/chapter-two';
import { applyChapterAction, type ChapterProgress, type ChapterAction } from './narrative/chapter-two';
import { observations, testAmbientThoughts, testGraph, machineGraph, lines } from './content/experience';
import type { CognitionState } from './core/types';
import type { ReportDraft } from './narrative/report';
import { voiceForText } from './audio/production-voices';
import { DIARY_WRITING_ASSET, diaryVoiceForFragment } from './audio/diary-audio';
import type { PlaybackHandle } from './audio/types';
import { AudioManager } from './audio/AudioManager';
import { resolveAudioAsset } from './core/audio-registry';

import { PERCEPTION_PRESETS } from './audio/perception';
import './app.css';
type Step='chapter'|'realization'|'release'|'empty-room'|'flowers'|'memory'|'title'|'lab'|'test'|'diary'|'bakery'|'gain'|'ascending-report'|'machine'|'revisit'|'peak-report'|'classroom'|'decline'|'last-report'|'finish';
type Pair={en:string;zhHans:string};
function availableVoice(english:string) {
 const voice=voiceForText(english);
 if(!voice)return undefined;
 try {const asset=resolveAudioAsset(voice.assetId);return asset.kind==='voice'?voice:undefined;}catch{return undefined;}
}

export default function App(){
 const [taskView,setTaskView]=useState<'current'|'test-review'>('current');
 const [checkpoint,setCheckpoint]=useState(()=>loadCheckpoint());
 const [diaries,setDiaries]=useState<Record<string,ReportDraft>>({});
 const [chapterId,setChapterId]=useState('classroom-a');
 const [storyStage,setStoryStage]=useState(0);
 const [released,setReleased]=useState(false);
 const [conferenceChoice,setConferenceChoice]=useState<ConferenceChoiceId|null>(null);
 const selectedConference=conferenceChoices.find(option=>option.id===conferenceChoice);
 const [presented,setPresented]=useState(false);
 const [reversalAsked,setReversalAsked]=useState(false);
 const [memory,setMemory]=useState('');
 const [memorySaved,setMemorySaved]=useState(false);
 const [page,setPage]=useState<{next:Step;line?:Pair;title:string;chapterId?:string}|null>(null);
 const chapter=chapterTwoSteps.find(item=>item.id===chapterId)!;
 const [lesson,setLesson]=useState<ChapterProgress>({completed:[]});
 const [step,setStep]=useState<Step>('title'),[text,setText]=useState<Pair>(lines.welcome),[speaker,setSpeaker]=useState('Dr. Strauss');
 const [observed,setObserved]=useState<string[]>([]),[edges,setEdges]=useState<string[]>([]),[bread,setBread]=useState(0),[choice,setChoice]=useState(''),[intent,setIntent]=useState('');
 const [transition,setTransition]=useState(false),[muted,setMuted]=useState(false),[audioNote,setAudioNote]=useState(''),[speaking,setSpeaking]=useState(false),[taskOpen,setTaskOpen]=useState(false),[dialogueOpen,setDialogueOpen]=useState(false),[mazeOpen,setMazeOpen]=useState(false);
 const diarySound=useRef<PlaybackHandle|null>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined), voiceRequest=useRef(0),musicStarted=useRef(false),audio=useRef<AudioManager|null>(null);
 const phase:CognitionState['phase']=step==='chapter'?chapter.phase:['decline','last-report','empty-room'].includes(step)?'DECLINE':['machine','revisit','peak-report','realization','release'].includes(step)?'PEAK':step==='gain'||step==='ascending-report'||step==='classroom'?'ASCENDING':'LOW';
 const cognition:CognitionState={phase,affordances:[],perceivedDetail:phase==='PEAK'?1:phase==='DECLINE'?.3:.4};
 const bakery=['bakery','gain','ascending-report','machine','revisit','peak-report','classroom','decline','last-report'].includes(step);
 useEffect(()=>()=>{clearTimeout(timer.current);voiceRequest.current++;diarySound.current?.stop();void audio.current?.dispose();},[]);
 useEffect(()=>{audio.current?.setPerception(phase==='PEAK'?PERCEPTION_PRESETS.clear:phase==='DECLINE'?PERCEPTION_PRESETS.strained:PERCEPTION_PRESETS.softened);},[phase]);
 const stopVoice=()=>{voiceRequest.current++;diarySound.current?.stop();diarySound.current=null;setSpeaking(false);audio.current?.stopVoice();};
 const say=(line:Pair,person=line===lines.welcome||line===lines.test?'Dr. Strauss':line===lines.bakery?'Gimpy':'Charlie')=>{
   stopVoice(); const request=voiceRequest.current;const mapped=voiceForText(line.en);const voice=mapped?.speaker===person?mapped:undefined;
   setText(line);setSpeaker(voice?.speaker??person);setDialogueOpen(true);setAudioNote('');
   if(!voice||!audio.current||!availableVoice(line.en))return;
   void audio.current.unlock().then(()=>{if(request!==voiceRequest.current)return;return audio.current!.playVoice(voice.assetId);}).then(async handle=>{if(!handle)return;if(request!==voiceRequest.current){handle.stop();return;}setSpeaking(true);await handle.ended;if(request===voiceRequest.current)setSpeaking(false);}).catch(()=>{if(request===voiceRequest.current)setSpeaking(false);});
 };
 const placeFragment=(fragment:{id:string;text:string;english:string},_phase:CognitionState['phase'])=>{
   stopVoice();const request=voiceRequest.current;const manager=audio.current;if(!manager)return;
   void (async()=>{await manager.unlock();if(request!==voiceRequest.current)return;
     try {const handle=await manager.playSound(DIARY_WRITING_ASSET);if(request!==voiceRequest.current){handle.stop();return;}diarySound.current=handle;await handle.ended;}catch{/* Missing pencil audio must not block placement. */}
     if(request!==voiceRequest.current)return;const voice=diaryVoiceForFragment(fragment.id);if(!voice||voice.english!==fragment.english)return;
     const handle=await manager.playVoice(voice.assetId);if(request!==voiceRequest.current){handle.stop();return;}diarySound.current=handle;await handle.ended;if(request===voiceRequest.current)diarySound.current=null;
   })().catch(()=>{});
 };
 const go=(next:Step,line?:Pair)=>{stopVoice();setStoryStage(old=>Math.max(old,next==='bakery'?1:['gain','machine','revisit'].includes(next)?2:next==='chapter'?3:['realization','release','decline','last-report','empty-room'].includes(next)?4:0));setSpeaking(false);setEdges([]);setStep(next);setTaskOpen(false);setTaskView('current');setDialogueOpen(false);if(line)say(line);};
 const bridge=(next:Step,line?:Pair,title='A new page / 新的一页',nextChapter?:string)=>{stopVoice();setTaskOpen(false);setDialogueOpen(false);setPage({next,line,title,chapterId:nextChapter});setTransition(true);};
 const turnPage=()=>{if(!page)return;if(page.chapterId){setChapterId(page.chapterId);setLesson({completed:[]});}go(page.next,page.line);setPage(null);setTransition(false);};
 useEffect(()=>{if(!transition||!page)return;const handle=setTimeout(turnPage,1400);return()=>clearTimeout(handle);},[transition,page]);
 const saveDiary=(draft:ReportDraft)=>{const entry=step==='diary'?'first':step==='ascending-report'?'ascending':step==='peak-report'?'peak':'last';const saved={...diaries,[entry]:draft};setDiaries(saved);const next=entry==='first'?'bakery':entry==='ascending'?'machine':entry==='peak'?'chapter':'empty-room';const nextChapter=entry==='peak'?'algernon-first-failure':chapterId;const data:Checkpoint={version:1,savedAt:new Date().toISOString(),step:next,chapterId:nextChapter,diaries:saved,observed,bread,choice,intent:entry==='peak'?draft.rawText:intent};const ok=saveCheckpoint(data);if(ok)setCheckpoint({checkpoint:data});else {setAudioNote('Local save failed. Keep this page open. / 本地保存失败，请保持页面打开。');throw new Error('Checkpoint save failed');}if(entry==='last'){setReleased(true);go('empty-room');return;}bridge(next,entry==='first'?lines.bakery:undefined,entry==='peak'?'A familiar route / 熟悉的路线':entry==='ascending'?'One thing moves another / 一件事带动另一件事':'Back to the bakery / 回到面包店',nextChapter);};
 const ensureAudio=()=>{if(!audio.current)audio.current=new AudioManager(resolveAudioAsset);audio.current.setMuted(muted);void audio.current.unlock().then(async()=>{if(musicStarted.current)return;musicStarted.current=true;try{await audio.current!.playSound('audio.music.still-room',true);}catch{musicStarted.current=false;}}).catch(()=>{});};
 const resume=()=>{const saved=checkpoint.checkpoint;if(!saved)return;ensureAudio();setStoryStage(saved.step==='bakery'?1:saved.step==='machine'?2:saved.step==='chapter'?3:4);setReleased(saved.step==='empty-room');setDiaries(saved.diaries);setObserved(saved.observed);setBread(saved.bread);setChoice(saved.choice);setIntent(saved.intent);setChapterId(saved.chapterId);setLesson({completed:[]});go(saved.step);};
 const begin=()=>{setStoryStage(0);setReleased(false);setPresented(false);setReversalAsked(false);setConferenceChoice(null);setDiaries({});setLesson({completed:[]});setObserved([]);setBread(0);setChoice('');setIntent('');ensureAudio();go('lab',lines.welcome);setSpeaker('Dr. Strauss');};
 const connect=(id:string)=>{setEdges(previous=>previous.includes(id)?previous:[...previous,id]);void audio.current?.playSound('audio.chime.prototype').catch(()=>{});};
 const lessonAction=(action:ChapterAction)=>{const result=applyChapterAction(chapter,lesson,action);setLesson(result.progress);};
 const lessonReady=chapter.requirements.every(item=>lesson.completed.includes(item.id));
 const chapterReady=chapter.id==='conference'?chapter.requirements.filter(item=>item.action.kind==='inspect').every(item=>lesson.completed.includes(item.id)):lessonReady;
 const conferencePlacement=chapter.requirements.find(item=>item.action.kind==='place');
 const closeUI=()=>{setTaskOpen(false);setDialogueOpen(false);stopVoice();};
 const interact=(rawId:string)=>{
   const id=normalizeHotspot(rawId,bakery?'bakery':'laboratory');
   if(transition||taskOpen||dialogueOpen||mazeOpen)return;
   const diaryPhase=['diary','ascending-report','peak-report','last-report'].includes(step);
   const isBook=rawId==='book'||id==='lab-cabinet';
   if(diaryPhase||step==='test'){
     if(isBook){say(observations.book);return;}
     if(id==='research-notes'){
       if(diaryPhase){setTaskView('current');setTaskOpen(true);}
       else say({en:'I will write after the test.',zhHans:'测试结束后我再写。'});
       return;
     }
     if(id==='test-desk') {setTaskView(diaryPhase?'test-review':'current');setTaskOpen(true);return;}
     if(id==='algernon-maze'){say(observations.mouse);return;}
     if(id==='researcher'||id==='baker')say(diaryPhase?{en:'I want to write this down.',zhHans:'我想把这些记下来。'}:lines.test,diaryPhase?'Charlie':'Dr. Strauss');
     return;
   }
   if(id==='algernon-maze'&&!['chapter','realization','release','empty-room'].includes(step)){setObserved(a=>a.includes('mouse')?a:[...a,'mouse']);say(observations.mouse);return;}
   if(step==='lab') {
     if(!['lab-cabinet','research-notes','test-desk','researcher'].includes(id))return;
     const key=id==='lab-cabinet'?'book':id==='test-desk'?'test':'paper';
     if(id==='researcher'||id==='test-desk'&&observed.length>=2){if(observed.length>=2)go('test',lines.test);else say(lines.welcome);return;}
     setObserved(a=>a.includes(key)?a:[...a,key]);say(key==='test'?{en:'Two dark shapes on a test card. I wonder what they want me to see.',zhHans:'测试卡上有两个深色形状。我不知道他们想让我看见什么。'}:observations[key]);return;
   }
   if(step==='chapter'){if(!['researcher','baker','chair'].includes(id))setTaskOpen(true);return;}
   if(step==='release'){if(id==='algernon-maze')setTaskOpen(true);return;}
   if(['realization','empty-room'].includes(step)){setTaskOpen(true);return;}
   if(step==='classroom'&&['bread-counter','oven','bread-shelf'].includes(id)){setTaskOpen(true);return;}
   if(id==='researcher'||id==='baker'){say(bakery?(bread<3?lines.bakery:lines.success):lines.test);return;}
   if(['test-desk','research-notes','bread-counter','oven','bread-shelf'].includes(id))setTaskOpen(true);
 };
 useEffect(()=>{if(!taskOpen&&!dialogueOpen)return;const before=document.activeElement as HTMLElement|null;const dialog=document.querySelector<HTMLElement>(dialogueOpen?'.dialogue-card':'.task-modal');dialog?.querySelector<HTMLElement>('button,textarea')?.focus();const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();if(dialogueOpen)setDialogueOpen(false);else setTaskOpen(false);stopVoice();}if(e.key==='Tab'){const items=Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled),textarea,a[href]')??[]);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};window.addEventListener('keydown',key);return()=>{window.removeEventListener('keydown',key);before?.focus();};},[taskOpen,dialogueOpen]);
 const objective=step==='chapter'?(chapter.id==='conference'?'Read the slide and your notes. / 查看投影片与笔记。':chapter.objective.en+' / '+chapter.objective.zhHans):step==='empty-room'?'Look at what remains. Leave when you choose. / 看看留下的东西，想离开时再离开。':step==='release'?'Look beside the small cage. / 看看小笼子旁。':step==='realization'?'Return to the records. / 回到记录旁。':step==='classroom'?'Open your lecture notes at the workbench. / 在工作台边打开课堂笔记。':step==='lab'?'Examine two objects, then speak to the researcher. / 观察两件物品后，与研究员交谈。':step==='test'?'Examine the test desk. / 查看测试桌。':['diary','ascending-report','peak-report','last-report'].includes(step)?'Open the diary on the table. / 打开桌上的日记本。':step==='bakery'?'Go to the bread counter. / 走到面包柜台。':'Inspect the workbench or oven. / 查看工作台或烤炉。';
 return <main className={`game game--${phase.toLowerCase()}`}>
  <div className="world"><ExplorableRoom hotspotLabels={{paper:['diary','ascending-report','peak-report','last-report'].includes(step)?'Write diary / 写日记':'Diary / 日记本',test:'Examine test / 查看测试',book:'Inspect book / 看书'}} npcName={bakery?'Gimpy / 金皮':'Dr. Strauss / 施特劳斯医生'} scene={bakery?'bakery':'laboratory'} assets={{...getRoomVisuals(bakery?'bakery':'laboratory'),...(['chapter','realization','release','empty-room','flowers','memory','finish'].includes(step)?{npc:undefined,npcReaction:undefined}:{})}} onInteract={interact} npcReacting={dialogueOpen&&speaker===(bakery?'Gimpy':'Dr. Strauss')} paused={['title','finish','flowers','memory'].includes(step)||transition||taskOpen||dialogueOpen||mazeOpen}/></div>
  <header className="game-header"><a href="#" onClick={e=>{e.preventDefault();clearTimeout(timer.current);setTransition(false);closeUI();setStep('title');audio.current?.stopVoice();}}>ALGERNON<span>A STUDY IN REMEMBERING</span></a><nav><button onClick={()=>{setMuted(v=>!v);audio.current?.setMuted(!muted);}}>{muted?'Unmute':'Sound on'}</button><a href="/project-status.html" target="_blank" rel="noreferrer">Studio ↗</a></nav></header>
  {step==='title'?<section className="title-page"><p className="kicker">AN INTERACTIVE NARRATIVE</p><h1>Flowers<br/>for <em>Algernon.</em></h1><div className="fine-line"/><p className="title-quote">The world hasn't changed.<br/>The way you see it will.</p><button className="primary" onClick={begin}>Open your eyes <span>睁开眼睛 →</span></button>{checkpoint.checkpoint&&<button className="primary" onClick={resume}>Resume saved diary <span>从日记检查点继续</span></button>}{checkpoint.error&&<p role="status">{checkpoint.error}</p>}<p className="build-note">First playable study · 正式插画持续制作中，英语配音待就绪<br/>English · EN / 简中</p></section>:<>
  <div className="chapter-mark"><span>{step==='chapter'?chapter.title.en:step==='empty-room'?'THE ROOM REMAINS':bakery?'D O N N E R ’ S   B A K E R Y':'B E E K M A N   L A B O R A T O R Y'}</span><i>{bakery?'Bread, flour, familiar faces.':'Paper. A clock. Someone waiting.'}</i></div>
  {step!=='finish'&&!taskOpen&&!dialogueOpen&&<p className="objective">{objective}</p>}
  {taskOpen&&<div className="modal-backdrop"><div className={`task-modal ${step==='test'||taskView==='test-review'?'test-task-modal':''}`} inert={dialogueOpen} role="dialog" aria-modal={!dialogueOpen} aria-label="Current task / 当前任务"><button className="close-task" onClick={closeUI}>Return to the room / 返回房间 ×</button>
  {taskView==='test-review'?<section className="interaction-panel test-review"><h2>The same test / 同一张测试图</h2><TestStimulus/></section>:<>
  {step==='test'&&<section className="interaction-panel"><p className="kicker">A LITTLE INK ON PAPER</p><h2>What do you see?</h2><TestStimulus/><CognitionGraph presentation="wandering" ambientThoughts={testAmbientThoughts} model={testGraph} cognition={cognition} connectedEdgeIds={edges} onConnect={connect}/><button className="primary" disabled={!edges.length} onClick={()=>go('diary',{en:'Maybe I did all right. I should write it down.',zhHans:'也许我做得还不错。我应该写下来。'})}>That is what I can see <span>我先说这些 →</span></button></section>}
  {['diary','ascending-report','peak-report','last-report'].includes(step)&&<section className="interaction-panel report-panel"><DiaryCollage key={step} phase={phase} entryId={step==='diary'?'first':step==='ascending-report'?'ascending':step==='peak-report'?'peak':'last'} previousText={diaries.peak?.rawText??intent} onPlaceFragment={placeFragment} onSave={saveDiary}/></section>}
  {step==='chapter'&&<section className="interaction-panel chapter-panel"><p className="kicker">{chapter.sceneId==='classroom'?'LECTURE · 课堂':chapter.sceneId==='conference'?'CONFERENCE · 会议':'RECORDS · 记录'}</p><h2>{chapter.title.en}</h2><p>{chapter.title.zhHans}</p><SubtitleBlock text={chapter.id==='conference'?{en:'Read the public claim and your dated records before deciding how to respond.',zhHans:'先阅读公开结论与带日期的记录，再决定如何回应。'}:chapter.objective}/>
   {chapter.requirements.filter(r=>r.action.kind!=='connect'&&(chapter.id!=='conference'||r.action.kind==='inspect')).map(r=>{const ready=(r.after??[]).every(id=>lesson.completed.includes(id));const done=lesson.completed.includes(r.id);const action=r.action;if(action.kind==='place')return <EvidencePlacement key={r.id} itemLabel={chapterObjectLabel(action.itemId)} targetLabel={chapterObjectLabel(action.targetId)} disabled={!ready||done} onPlace={()=>lessonAction(action)}/>;const label=action.kind==='inspect'?'Inspect / 查看 · '+chapterObjectLabel(action.targetId):action.kind==='choose'?'Choose / 选择 · '+chapterObjectLabel(action.optionId):'';return <button className="primary" key={r.id} disabled={!ready||done} onClick={()=>lessonAction(action)}>{done?'✓ ':''}{label}</button>;})}
   {lesson.completed.length>0&&<SubtitleBlock text={chapter.stimulus.facts}/>}
   {chapter.id!=='conference'&&chapter.requirements.some(r=>r.action.kind==='connect'&&(r.after??[]).every(id=>lesson.completed.includes(id)))&&<CognitionGraph key={chapter.id} model={chapter.graph} cognition={cognition} connectedEdgeIds={chapter.requirements.filter(r=>lesson.completed.includes(r.id)&&r.action.kind==='connect').map(r=>(r.action as {edgeId:string}).edgeId)} onConnect={edgeId=>lessonAction({kind:'connect',edgeId})}/>}
   {chapter.presentation&&lesson.completed.includes(chapter.presentation.holdConclusionUntilRequirementId)&&<SubtitleBlock text={chapter.presentation.conclusion}/>}
   {chapterReady&&<>{chapter.id!=='conference'&&<SubtitleBlock text={chapter.perception[phase]}/>}<button className="primary" onClick={()=>{if(chapter.id==='classroom-c')bridge('peak-report',undefined,'A page of my own / 属于我的一页');else if(chapter.nextStepId)bridge('chapter',undefined,chapterTwoSteps.find(c=>c.id===chapter.nextStepId)!.title.en,chapter.nextStepId);else bridge('realization',undefined,'What do you see? / 你看见了什么？');}}>Keep these findings / 记下发现 →</button></>}
  </section>}
  {step==='realization'&&<section className="interaction-panel"><h2>Before the researchers / 在研究员面前</h2><TestStimulus/>{!selectedConference&&<div className="choices">{conferenceChoices.map(option=><button key={option.id} onClick={()=>{setConferenceChoice(option.id);if(option.playerLine)say(option.playerLine,'Charlie');}}>{option.label.en}<small>{option.label.zhHans}</small></button>)}</div>}
   {selectedConference&&!presented&&<EvidencePlacement key={selectedConference.id} itemLabel="Dated contrary records / 带日期的相反记录" targetLabel="Beside the public claim / 公开结论旁" onPlace={()=>{if(!conferencePlacement)return;const result=applyChapterAction(chapter,lesson,conferencePlacement.action);if(!result.accepted)return;setLesson(result.progress);setPresented(true);say(selectedConference.consequence,'Charlie');}}/>}
   {selectedConference&&presented&&!lessonReady&&<CognitionGraph model={chapter.graph} cognition={cognition} connectedEdgeIds={[]} onConnect={edgeId=>lessonAction({kind:'connect',edgeId})}/>}
   {selectedConference&&presented&&lessonReady&&<><SubtitleBlock text={conferenceConvergence.disclosure}/><button className="primary" onClick={()=>{setReversalAsked(true);say(conferenceConvergence.reversal,'Charlie');}}>What do you see? / 你们看见了什么？</button><button className="primary" disabled={!reversalAsked} onClick={()=>{if(reversalAsked)bridge('release',undefined,'The quiet laboratory / 安静的实验室');}}>Return to the laboratory / 回到实验室 →</button></>}
  </section>}
  {step==='release'&&<section className="interaction-panel"><h2>The small latch / 小小的门闩</h2><button className="primary" disabled={released} onClick={()=>setReleased(true)}>Open the cage / 打开笼子</button>{released&&<button className="primary" onClick={()=>bridge('decline',lines.decline,'A connection slips / 一条联系松开了')}>Return to my work / 回到我的工作</button>}</section>}
  {step==='empty-room'&&<section className="interaction-panel"><h2>The room remains / 房间还在</h2><button className="primary" onClick={()=>say(observations.book)}>Look at the book / 看看书</button>{diaries.last&&<p lang="zh-Hans" style={{whiteSpace:'pre-wrap'}}>{diaries.last.expressedText}</p>}<button className="primary" onClick={()=>bridge('flowers',undefined,'For Algernon / 献给阿尔吉侬')}>Leave? / 离开？</button></section>}
  {step==='bakery'&&<section className="interaction-panel compact"><p className="kicker">THE MORNING SHIFT</p><h2>Something I know.</h2><p>Three loaves. One paper bag.<br/><small>三条面包。一个纸袋。</small></p><button className="bread-action" disabled={bread>=3} onClick={()=>{setBread(b=>b+1);say(bread===2?lines.laughter:lines.bakery);}}><span>{bread<3?'Bag a loaf / 装一条面包':'The bag is ready / 装好了'}</span><b>{bread} / 3</b></button>{bread===3&&<button className="primary" onClick={()=>bridge('gain',lines.gain)}>Another morning <span>又一个清晨 →</span></button>}</section>}
  {step==='gain'&&<section className="interaction-panel compact"><p className="kicker">THE SAME MACHINE</p><h2>Wait. I see it.</h2><p>The lever. The turning wheel.<br/>They aren't separate things.</p><p lang="zh-Hans">拉杆。转动的轮子。它们不是独立的。</p><button className="primary" onClick={()=>go('ascending-report')}>Write what I noticed <span>记下我的发现 →</span></button></section>}
  {['machine','decline'].includes(step)&&<section className="interaction-panel"><p className="kicker">THE DOUGH ROLLER</p><h2>{step==='decline'?'There was a connection.':'One thing moves another.'}</h2><CognitionGraph key={step} model={machineGraph} cognition={cognition} connectedEdgeIds={edges} onConnect={connect}/>{step==='machine'?<button className="primary" disabled={edges.length<3} onClick={()=>go('revisit',lines.success)}>Turn the machine <span>开动机器 →</span></button>:<><p className="remembered">lever — gear — roller — dough</p><p>I used to understand this. / 我以前懂得这个。</p><button className="primary" onClick={()=>go('last-report',lines.decline)}>Find my notebook <span>找我的笔记本 →</span></button></>}</section>}
  {step==='revisit'&&<section className="interaction-panel"><p className="kicker">THE SAME LAUGHTER</p><h2>It was always there.</h2><CognitionGraph model={BAKERY_GRAPH} cognition={cognition} connectedEdgeIds={edges} onConnect={connect}/>{edges.length>0&&<div className="choices">{['I only did what I was asked.','Why are you angry?','Say nothing.'].map((line,i)=><button key={line} onClick={()=>{setChoice(line);say({en:i===0?'He looks away. Nobody asks how I did it.':i===1?'“Nobody is angry,” he says, without looking at me.':'I stay quiet. So does he.',zhHans:i===0?'他移开目光。没有人问我是怎样做到的。':i===1?'“没人生气，”他说，却不看我。':'我沉默。他也是。'});}}>{line}<small>{['我只是做了被要求的事。','你为什么生气？','保持沉默。'][i]}</small></button>)}</div>}{choice&&<button className="primary" onClick={()=>bridge('chapter',undefined,'A university lecture / 大学课堂','classroom-a')}>Follow the question <span>带着问题去上课 →</span></button>}</section>}
  </>}
  </div></div>}
  {step==='finish'&&<section className="interaction-panel compact"><p className="kicker">END OF THE FIRST STUDY</p><h2>You remember.</h2><p>That is where we begin.<br/><small>这是我们的起点。</small></p><p className="build-note">本次切片到此结束；课堂笔记已可交互；完整教室、研究、会议与结局仍在开发计划中。</p><button className="primary" onClick={()=>{setObserved([]);setBread(0);setChoice('');setIntent('');go('lab',lines.welcome);}}>Return to the room <span>回到房间 →</span></button></section>}
  {step!=='finish'&&dialogueOpen&&<footer className={`subtitles dialogue-card ${speaker==='Charlie'?'thought-card':'spoken-card'}`} role="dialog" aria-modal="true" aria-label="Dialogue / 对话"><div className="speaker">{speaker}{speaking?' · speaking':''}</div><SubtitleBlock text={text}/>{availableVoice(text.en)?.speaker===speaker&&<button className="replay" aria-label="Replay English voice" onClick={()=>say(text,speaker)}>↺</button>}<button className="dialogue-dismiss" onClick={()=>{setDialogueOpen(false);stopVoice();}}>Continue / 继续</button></footer>}
  <MazeBox storyStage={storyStage} onInspectChange={setMazeOpen} cognition={cognition} algernonPresent={!released&&!['empty-room','flowers','memory','finish'].includes(step)} suspended={['flowers','memory','finish'].includes(step)}/>
  </>}
  {audioNote&&<div className="audio-note" role="status" onClick={()=>setAudioNote('')}>{audioNote}</div>}
  {['flowers','memory'].includes(step)&&<section className="interaction-panel ending-panel"><h2>{step==='flowers'?'For Algernon / 献给阿尔吉侬':'What do you want to remember? / 你想记住什么？'}</h2>{step==='flowers'?<><button className="primary" onClick={()=>go('memory')}>Place the flowers / 放下花</button></>:<form onSubmit={e=>{e.preventDefault();try{localStorage.setItem('algernon.final-memory.v1',JSON.stringify({version:1,rawText:memory,savedAt:new Date().toISOString()}));setMemorySaved(true);}catch{setAudioNote('Could not save locally / 无法本地保存');}}}><label>My memory / 我的记忆<textarea lang="zh-Hans" value={memory} onChange={e=>{setMemory(e.target.value);setMemorySaved(false);}}/></label><button className="primary">Keep these words / 留下这些话</button>{memorySaved&&<p style={{whiteSpace:'pre-wrap'}}>{memory}</p>}<button type="button" onClick={()=>{setPage(null);setTransition(false);go('title');}}>Return to title / 返回标题</button></form>}</section>}
  {transition&&page&&<div className="ink-transition" role="dialog" aria-modal="true" aria-label="Turning a page"><div className="drifting-page"><p>PROGRESS REPORT · 下一页</p><h2>{page.title}</h2><button onClick={turnPage}>Skip transition / 跳过过场</button></div></div>}

 </main>;
}
