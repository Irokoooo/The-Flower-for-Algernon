import type { ChapterStep, ChapterText, ChapterVoiceLine } from '../narrative/chapter-two';
import type { CognitionPhase } from '../core/types';
const t = (en: string, zhHans: string): ChapterText => ({ en, zhHans });
const phases: CognitionPhase[] = ['LOW', 'ASCENDING', 'PEAK', 'DECLINE'];
/** Original fictional staging and dialogue; not quotations or claims of canonical events. */
const specifications = [
  {
    id:'classroom-a', sceneId:'classroom', phase:'ASCENDING',
    title:t('A · I understand the lecture','A · 我听懂这堂课了'),
    objective:t('Examine the memory study. Place the category cue beside the recall results, then connect them.','查看记忆实验，把类别提示放在回忆结果旁，再连接两者。'),
    facts:t('A university lecture compares two word-list trials. In the second, the lecturer supplies category names; more words are recalled. The board says “retrieval cue”.','大学课堂正在比较两次词表实验。第二次提供了类别名称，被回忆起的词更多。黑板写着“提取线索”。'),
    nodes:[t('Category cue: fruit','类别提示：水果'),t('More words recalled','回忆起更多词')],
    meaning:t('The cue helps someone reach words already learned. Remembering is not just putting things away; it is finding a way back.','提示帮助人找到已经学过的词。记忆不只是存进去，还要找到回去的路。'),
    low:t('There are lists of words. Some have circles around them.','这里有几列词。有些被圈了起来。'),
    ascending:t('Retrieval. I know what he means now. The difficult word has something inside it!','提取。我现在明白他在说什么了。这个难词里面有我懂的东西！'),
    peak:t('I can follow the example and the explanation together. I want him to keep going.','我能同时跟上例子和解释。我还想继续听。'),
    decline:t('That word opened a door for me once. I remember how good it felt.','那个词曾为我打开一扇门。我记得那有多快乐。'),
    speaker:'professor', spoken:t('They learned the words in both trials. What changed was the help they had when recalling them.','两次实验中他们都学过那些词。变化在于回忆时得到的帮助。'),
    target:'memory-study', item:'category-cue', slot:'recall-results'
  },
  {
    id:'classroom-b', sceneId:'classroom', phase:'PEAK',
    title:t('B · I am already there','B · 我已经想到了'),
    objective:t('Read the two trial cards. Place “test again with a cue” on the prediction desk and connect it before the professor reveals the conclusion.','阅读两张实验卡，把“加上提示再测一次”放到预测桌上，在教授揭示结论之前连出推论。'),
    facts:t('Both groups learned the same list. One recalls less without category cues. The professor writes “A lower score could mean…” and leaves the conclusion covered.','两组学过同一份词表。没有类别提示的一组回忆得更少。教授写下“分数更低可能意味着……”并遮住结论。'),
    nodes:[t('Lower recall without cues','无提示时回忆较少'),t('Test again with a cue','加上提示再测一次')],
    meaning:t('A low recall score alone cannot tell us whether a word was lost or just hard to retrieve.','仅凭较低的回忆分数，无法区分词被遗忘了，还是难以提取。'),
    low:t('He has not finished writing.','他还没写完。'),
    ascending:t('Could a hint bring the words back?','一个提示能让那些词回来吗？'),
    peak:t('Wait—I can test the difference. I have the next step before his chalk gets there!','等等——我能检验这个区别。他的粉笔还没写到，我已经想到下一步了！'),
    decline:t('Once I could get ahead of the chalk. I remember the little thrill of it.','我曾经能赶在粉笔前面想到答案。我记得那一点兴奋。'),
    speaker:'professor', spoken:t('A lower score could mean the words are gone. But before we conclude that, we could…','分数更低可能意味着那些词被遗忘了。但在下结论之前，我们可以……'),
    target:'trial-cards', item:'cue-retest', slot:'prediction-desk'
  },
  {
    id:'classroom-c', sceneId:'classroom', phase:'PEAK',
    title:t('C · Everything connects','C · 一切都连起来了'),
    objective:t('Open your notebook. Connect the test, bakery and maze observations in any order. See what each memory helps you understand.','打开笔记本，以任意顺序连接测试、面包店和迷宫的观察，看看每段记忆能帮你理解什么。'),
    facts:t('The notebook holds the inkblot sketch, a drawing of the bakery rollers and Algernon’s familiar route. The lecture notes sit beside them.','笔记本里有墨迹图、面包店滚轴草图和阿尔吉侬熟悉的路线。课堂笔记就在旁边。'),
    nodes:[t('Lecture: a useful cue','课堂：有效的线索'),t('Test: the shape becomes wings','测试：形状变成翅膀')],
    meaning:t('Seeing wings gave the test shapes a pattern I could hold in mind.','看出翅膀后，测试中的形状有了能记在心里的规律。'),
    low:t('These are pictures of places I have been.','这些画着我去过的地方。'),
    ascending:t('The lesson reminds me of more than the classroom.','这堂课让我想到的不止这间教室。'),
    peak:t('The wings, the turning rollers, that corner in the maze—I can move between them. There is so much more I want to find!','翅膀、转动的滚轴、迷宫里的转角——我的思路能在它们之间来回。还有好多东西等着我发现！'),
    decline:t('I remember the page filling with connections. For a while, learning felt like play.','我记得连线铺满纸页。有一段时间，学习像玩耍一样快乐。'),
    speaker:'charlie', spoken:t('Give me another page. I am not finished exploring.','再给我一页。我还没探索够呢。'),
    target:'connection-notebook'
  },
  {
    id:'algernon-first-failure', sceneId:'algernon-maze', phase:'PEAK',
    title:t('The familiar turn','熟悉的转角'),
    objective:t('Inspect the old route record and observe Algernon at the unchanged junction. Connect the two observations.','查看旧路线记录，观察阿尔吉侬在未改变的岔路口的行为，再连接两项观察。'),
    facts:t('The route and reward are unchanged. Algernon pauses at the familiar turn, takes a dead end, and returns.','路线与奖励没有改变。阿尔吉侬在熟悉的转角停下，进入死路，又退了回来。'),
    nodes:[t('Earlier successful route','先前成功的路线'),t('Hesitation at the same turn','同一转角的迟疑')],
    meaning:t('The route stayed the same; his behavior changed. One run is a warning, not a diagnosis.','路线未变，行为却变了。一次试跑是警讯，还不能算诊断。'),
    low:t('He went back. I am waiting for him.','它回头了。我在等它。'),
    ascending:t('He used to turn there without stopping.','它以前在那里转弯时不会停。'),
    peak:t('Check the conditions before naming the cause.','先检查条件，再判断原因。'),
    decline:t('I remember waiting at this corner with him.','我记得和它一起等在这个转角。'),
    speaker:'assistant', spoken:t('The gate has not moved. Shall I leave the record here?','门的位置没变。记录放在这里好吗？'),
    target:'prior-route-record', second:'observed-failed-run'
  },
  {
    id:'investigation', sceneId:'investigation', phase:'PEAK',
    title:t('Read the dates','读出日期'),
    objective:t('Inspect the care log and dated run cards. File the repeated hesitation record, then link it to the unchanged conditions.','查看照护日志和带日期的试跑卡，将重复迟疑的记录归档，再连接未变的条件。'),
    facts:t('The care log records the same feeding and route. Two later run cards record hesitation at the same junction.','照护日志记录了相同的喂食和路线。两张较晚的试跑卡都记着同一岔路口的迟疑。'),
    nodes:[t('Conditions recorded unchanged','记录中条件未变'),t('Repeated hesitation','重复迟疑')],
    meaning:t('Repetition warrants investigation; the records do not yet isolate a cause.','重复出现值得调查，但记录还不足以确定原因。'),
    low:t('His name is on all these pages.','这些纸上都有它的名字。'),
    ascending:t('It happened on more than one day.','这不只发生在一天。'),
    peak:t('Keep the anomaly and the uncertainty in the same record.','把异常和不确定性一起保留在记录里。'),
    decline:t('I marked this date. I meant to come back to it.','我标了这个日期。我本来想回来再看。'),
    speaker:'charlie', spoken:t('I will keep the runs that do not fit. Especially those.','不符合预期的试跑记录我要留下，尤其是那些。'),
    target:'care-log', second:'dated-run-cards', item:'repeated-hesitation', slot:'evidence-file'
  },
  {
    id:'shared-procedure', sceneId:'investigation', phase:'PEAK',
    title:t('Two folders','两份档案'),
    objective:t('Open both procedure summaries. Draw the link between Algernon’s record and your own.','打开两份手术摘要，亲手连接阿尔吉侬的记录与你自己的记录。'),
    facts:t('Both summaries name the same experimental procedure. Charlie’s dated reports lie beside Algernon’s run records.','两份摘要写着同一种实验手术。查理带日期的报告就在阿尔吉侬的试跑记录旁。'),
    nodes:[t('Algernon · procedure record','阿尔吉侬 · 手术记录'),t('Charlie · procedure record','查理 · 手术记录')],
    meaning:t('We share an intervention. His change makes my future a question, not a proven result.','我们接受了同一种干预。它的变化让我的未来成为疑问，还不是已证实的结果。'),
    low:t('My name is beside his.','我的名字挨着它的。'),
    ascending:t('They did the same thing for both of us.','他们对我们做了同样的事。'),
    peak:t('The connection was on the page before I was willing to draw it.','在我愿意画出连线之前，联系就已经写在纸上了。'),
    decline:t('There were two folders. I did not want him to be alone.','当时有两份档案。我不想让它独自面对。'),
    speaker:'charlie', spoken:t('Put my folder beside his. I need to read them together.','把我的档案放到它的旁边。我得把两份一起读。'),
    target:'algernon-summary', second:'charlie-summary'
  },
  {
    id:'research', sceneId:'research', phase:'PEAK',
    title:t('Keep the contrary result','留下相反的结果'),
    objective:t('Inspect all results, place the contradictory run in the draft, and connect it to the provisional claim.','查看所有结果，将相反的试跑结果放进草稿，再连接暂定判断。'),
    facts:t('The draft says “The improvement remains stable.” The latest run record contradicts that sentence.','草稿写着“改善保持稳定”。最新的试跑记录与这句话矛盾。'),
    nodes:[t('Claim of stability','稳定性的判断'),t('Contrary run record','相反的试跑记录')],
    meaning:t('Revise the claim to include uncertainty; do not discard the contrary evidence.','修改判断以容纳不确定性，而不是丢掉相反的证据。'),
    low:t('This page does not match the other one.','这一页和另一页对不上。'),
    ascending:t('I cannot make the record fit by leaving it out.','不能靠漏掉这条记录让结果吻合。'),
    peak:t('A careful claim can survive a result that a confident claim cannot.','谨慎的判断能容纳武断判断无法容纳的结果。'),
    decline:t('I left this page here so I would not forget it mattered.','我把这页留在这里，好让我不忘记它很重要。'),
    speaker:'charlie', spoken:t('Change “remains stable” to “has not yet been shown to remain stable.”','把“保持稳定”改成“尚未证实能保持稳定”。'),
    target:'results-stack', item:'contrary-run', slot:'draft-evidence'
  },
  {
    id:'conference', sceneId:'conference', phase:'PEAK',
    title:t('A person at the microphone','麦克风前的人'),
    objective:t('Inspect the slide and your notes. Pin the omitted result to the slide, then connect the claim to its limitation.','查看投影片和你的笔记，将遗漏的结果钉到投影片旁，再连接判断与其局限。'),
    facts:t('The projected slide describes a stable improvement. Charlie’s notes contain the contrary run and the revised wording.','投影片宣称改善稳定。查理的笔记中有相反的试跑结果和修改后的措辞。'),
    nodes:[t('Public claim','公开的判断'),t('Omitted limitation','遗漏的局限')],
    meaning:t('The audience needs the qualification as well as the achievement.','听众既需要知道成果，也需要知道限制条件。'),
    low:t('They put our names on a big screen.','他们把我们的名字放在大屏幕上。'),
    ascending:t('The sentence on the screen leaves something out.','屏幕上的那句话漏了些东西。'),
    peak:t('I can speak as a person whose future is inside that missing sentence.','我可以作为一个未来就藏在那句缺失的话里的人开口。'),
    decline:t('I remember wanting them to listen, not just look.','我记得自己希望他们听，而不只是看。'),
    speaker:'presenter', spoken:t('We will take questions after the summary.','摘要讲完后，我们会接受提问。'),
    target:'projected-slide', second:'research-notes', item:'contrary-run', slot:'slide-annotation'
  }
] as const;

export const chapterTwoSteps: ChapterStep[] = specifications.map((s, index) => {
  const edgeId = s.id + '.connection';
  const requirements: ChapterStep['requirements'][number][] = [
    {id:s.id+'.inspect', action:{kind:'inspect',targetId:s.target}}
  ];
  if ('second' in s) requirements.push({id:s.id+'.inspect-second',action:{kind:'inspect',targetId:s.second}});
  if ('item' in s) requirements.push({id:s.id+'.place',action:{kind:'place',targetId:s.slot,itemId:s.item},after:requirements.map(r=>r.id)});
  requirements.push({id:s.id+'.connect',action:{kind:'connect',edgeId},after:requirements.map(r=>r.id)});
  if (s.id === 'classroom-c') {
    // All three links are available after opening the notebook, in any order.
    requirements.splice(1);
    for (const suffix of ['connection', 'bakery', 'maze']) requirements.push({
      id:s.id+'.'+suffix, action:{kind:'connect',edgeId:s.id+'.'+suffix}, after:[s.id+'.inspect']
    });
  }
  return {
    id:s.id, sceneId:s.sceneId, phase:s.phase, title:s.title, objective:s.objective,
    stimulus:{id:s.id+'.stimulus',facts:s.facts},
    perception:{LOW:s.low,ASCENDING:s.ascending,PEAK:s.peak,DECLINE:s.decline},
    graph:s.id === 'classroom-c' ? {
      nodes:[
        {id:'classroom-c.node-0',x:50,y:45,label:s.nodes[0]},
        {id:'classroom-c.node-1',x:18,y:15,label:s.nodes[1]},
        {id:'classroom-c.bakery',x:82,y:15,label:t('Bakery: lever, gear, rollers','面包店：拉杆、齿轮、滚轴')},
        {id:'classroom-c.maze',x:50,y:85,label:t('Maze: the familiar corner','迷宫：熟悉的转角')}
      ],
      edges:[
        {id:edgeId,from:'classroom-c.node-0',to:'classroom-c.node-1',meaning:s.meaning,phases:['PEAK']},
        {id:'classroom-c.bakery',from:'classroom-c.node-0',to:'classroom-c.bakery',meaning:t('The lever reminds me of the whole chain: gear, rollers, dough. I can follow it again.','拉杆让我想起整条关系：齿轮、滚轴、面团。我能重新顺着它想下去。'),phases:['PEAK']},
        {id:'classroom-c.maze',from:'classroom-c.node-0',to:'classroom-c.maze',meaning:t('A familiar corner might cue the next turn. Now I have something new to look for when he runs.','熟悉的转角也许会提示下一次转弯。下次它跑时，我又有新东西可以观察了。'),phases:['PEAK']}
      ]
    } : {
      nodes:s.nodes.map((label,i)=>({id:s.id+'.node-'+i,x:i===0?25:75,y:i===0?30:70,label})),
      edges:[{id:edgeId,from:s.id+'.node-0',to:s.id+'.node-1',meaning:s.meaning,phases:['ASCENDING','PEAK']}]
    },
    requirements,
    ...(s.id === 'classroom-b' ? {presentation:{holdConclusionUntilRequirementId:'classroom-b.connect',conclusion:t('Exactly. Restore the cue and test again. You found the next experiment before I finished the question.','正是这样。恢复提示，再测一次。我还没问完，你就找到了下一步实验。')}} : {}),
    dialogueIds:[s.id+'.spoken'],
    perceptionLineIds:{LOW:s.id+'.perception.LOW',ASCENDING:s.id+'.perception.ASCENDING',PEAK:s.id+'.perception.PEAK',DECLINE:s.id+'.perception.DECLINE'},
    nextStepId:specifications[index+1]?.id
  };
});

/** Fully expanded export: every perceived utterance has its own stable English TTS key.
 * No recordings are claimed available. Never voice Algernon or re-use audio with different words.
 */
export const chapterTwoDialogue: ChapterVoiceLine[] = specifications.flatMap(s => [
  {id:s.id+'.spoken',speaker:s.speaker,voiceAsset:'voice.chapter-two.'+s.id+'.spoken',subtitles:s.spoken,language:'en' as const,productionStatus:'script-only' as const},
  ...phases.map(phase=>({
    id:s.id+'.perception.'+phase,speaker:'charlie',
    voiceAsset:'voice.chapter-two.'+s.id+'.perception.'+phase.toLowerCase(),
    subtitles:chapterTwoSteps.find(step=>step.id===s.id)!.perception[phase],
    language:'en' as const,productionStatus:'script-only' as const
  }))
]);
export const chapterTwoEntryId = 'classroom-a';
