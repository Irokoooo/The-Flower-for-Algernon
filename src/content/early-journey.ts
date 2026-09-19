import type { CognitionPhase, DialogueBeat } from '../core/types';
import type { ChapterStep, ChapterText } from '../narrative/chapter-two';

const t = (en: string, zhHans: string): ChapterText => ({ en, zhHans });

/** Original staging and copy, not quotations or claims about canonical events.
 * Core owns surgery consent, time transitions, diary routing and cognition changes.
 * These are scripts only; no recording or accent is claimed by this module.
 */
export const earlyJourneyCopy = {
  surgeryExplanation: t('The operation may help you learn. We do not know how much it will help or how long any change will last. It could hurt you. You can ask us to explain again, take more time, or say no.', '手术也许能帮助你学习。我们不知道能帮多少，也不知道变化能保持多久。手术可能伤害你。你可以让我们再解释一次，可以再想想，也可以说不。'),
  surgeryReady: t('I want to try. I am scared too. Please tell me what happens next.', '我想试试。我也害怕。请告诉我接下来会怎样。'),
  recoveryWelcome: t('The operation is over. You can rest here. Your note is beside you. We can read it together when you want.', '手术结束了。你可以在这里休息。你的便条就在旁边。你想读的时候，我们可以一起读。'),
  preopRoom: t('My room is quiet. I put my notebook on the table. There was bread today, and a word Alice helped me read. I want to put some of today here.', '房间里很安静。我把本子放在桌上。今天有面包，还有 Alice 帮我读的一个词。我想把今天的一点事写在这里。'),
  learningWelcome: t('Welcome back, Charlie. We can use a word from your day at work. There is no hurry. Tell me when you want to hear it again.', '欢迎回来，查理。我们可以用一个你今天工作时见过的词。不用急。想再听一遍，就告诉我。'),
  returnWelcome: t('It is the same counter. The bags are where I left them. I know this work. I want to look around a little before I begin.', '还是那个柜台。袋子还在原来的地方。这活我熟悉。我想先多看一会儿，再开始干。')
};

/** Every inspect/place target and item has a display label; callers need not expose IDs. */
export const earlyJourneyLabels: Record<string, { en: string; zhHans: string }> = {
  'bakery-bread-tray': t('The familiar bread tray', '熟悉的面包盘'),
  'bakery-bread-one': t('The first loaf', '第一只面包'),
  'bakery-bread-two': t('The second loaf', '第二只面包'),
  'bakery-paper-bag': t('The open paper bag', '敞开的纸袋'),
  'bakery-filled-bag': t('The bag with both loaves', '装着两只面包的纸袋'),
  'bakery-delivery-counter': t('The waiting place on the counter', '柜台上放好面包的位置'),
  'learning-word-card': t('Alice’s card: bread', 'Alice 的词卡：bread（面包）'),
  'learning-bag-word': t('The same word on the bread bag', '面包袋上相同的词'),
  'recovery-handwritten-note': t('Your handwritten note from before the operation', '手术前亲手写的便条'),
  'recovery-bedside': t('Within reach beside the bed', '床边伸手可及的地方'),
  'bakery-machine-exterior': t('The outside of the familiar machine', '熟悉机器的外壳'),
  'bakery-lever': t('The lever on the outside', '外侧的拉杆'),
  'bakery-wheel': t('The wheel beside the lever', '拉杆旁的轮子'),
  'learning-earlier-practice': t('The practice line from your earlier lesson', '上一次课留下的练习行')
};

const lessonFacts = t('Alice sits beside Charlie at an adult reading lesson. Her card says “bread”. A bag from the bakery has the same word. Charlie’s practice line remains on the page.', 'Alice 在成人识字课上坐在查理身旁。她的卡片写着“bread”。面包店的纸袋上有同一个词。查理的练习行留在纸页上。');
const phases: CognitionPhase[] = ['LOW', 'ASCENDING', 'PEAK', 'DECLINE'];
const lineIds = (id: string): ChapterStep['perceptionLineIds'] => ({
  LOW: id + '.perception.LOW', ASCENDING: id + '.perception.ASCENDING',
  PEAK: id + '.perception.PEAK', DECLINE: id + '.perception.DECLINE'
});

/** Only local links are authored here. Missing nextStepId is an intentional Core
 * handoff: learning-low -> preop diary/surgery; recovery -> recovery diary and
 * later visits; learning-return -> later ascending content. Never infer a
 * cognition upgrade from an accepted action or from the next array element.
 * Integration requires ChapterStep.sceneId to include 'laboratory' (Core owner).
 */
export const earlyJourneySteps: ChapterStep[] = [
  {
    id: 'bakery-low', sceneId: 'bakery', phase: 'LOW',
    title: t('The work I know', '我熟悉的活'),
    objective: t('Look at the bread tray. Put each of the two loaves into the paper bag, then place the filled bag on the counter for delivery.', '看看面包盘，把两只面包分别放进纸袋，再把装好的袋子放到柜台上，等人取走。'),
    stimulus: {
      id: 'bakery-familiar-work',
      facts: t('Two loaves sit on the usual tray. An open paper bag waits beside them. The familiar machine stands behind the counter; its lever and wheel are visible on the outside.', '两只面包放在平常的盘子上。旁边有一个敞开的纸袋。熟悉的机器在柜台后面，外侧能看见拉杆和轮子。')
    },
    perception: {
      LOW: t('Two loaves. In the bag. Here is where it goes. I know this job.', '两只面包。放进袋子。搁在这里。这活我会。'),
      ASCENDING: t('My hands know the work. I can take a moment to look around too.', '我的手熟悉这活。我也能抽空看看周围。'),
      PEAK: t('This was useful work before I could explain the machine.', '在我能解释机器原理以前，这也是有用的工作。'),
      DECLINE: t('I know where the bread goes. I can do this.', '我知道面包该放哪里。这活我能做。')
    },
    graph: { nodes: [], edges: [] },
    requirements: [
      { id: 'bakery-low.inspect', action: { kind: 'inspect', targetId: 'bakery-bread-tray' } },
      { id: 'bakery-low.bag-one', action: { kind: 'place', targetId: 'bakery-paper-bag', itemId: 'bakery-bread-one' }, after: ['bakery-low.inspect'] },
      { id: 'bakery-low.bag-two', action: { kind: 'place', targetId: 'bakery-paper-bag', itemId: 'bakery-bread-two' }, after: ['bakery-low.inspect'] },
      { id: 'bakery-low.deliver', action: { kind: 'place', targetId: 'bakery-delivery-counter', itemId: 'bakery-filled-bag' }, after: ['bakery-low.bag-one', 'bakery-low.bag-two'] }
    ],
    dialogueIds: [], perceptionLineIds: lineIds('bakery-low'), nextStepId: 'learning-low'
  },
  {
    id: 'learning-low', sceneId: 'classroom', phase: 'LOW',
    title: t('A word from work', '工作中见过的词'),
    objective: t('Look at Alice’s short word, then at the word on the bag. Join the two that look the same.', '看看 Alice 写的短词，再看看袋子上的词。把看起来一样的两个词连起来。'),
    stimulus: { id: 'alice-bread-lesson', facts: lessonFacts },
    perception: {
      LOW: t('Alice says bread. These look the same. I know bread. The other words are still hard.', 'Alice 说，这是面包。两个看起来一样。面包我知道。别的词还是难。'),
      ASCENDING: t('I can find this word on the bag as well as on the card.', '我能在袋子上找到卡片上的这个词。'),
      PEAK: t('Matching a familiar word was a place to begin.', '认出一个熟悉的词，是开始学习的地方。'),
      DECLINE: t('Bread. Alice said it with me. I can look at both again.', '面包。Alice 陪我读过。我可以再看看这两个词。')
    },
    graph: {
      nodes: [
        { id: 'learning-low.card', x: 25, y: 35, label: t('bread · on the card', 'bread · 卡片上') },
        { id: 'learning-low.bag', x: 75, y: 65, label: t('bread · on the bag', 'bread · 袋子上') }
      ],
      edges: [{ id: 'learning-low.connection', from: 'learning-low.card', to: 'learning-low.bag', meaning: t('The same letters. Alice calls this word bread.', '字母一样。Alice 说这个词是面包。'), phases: ['LOW'] }]
    },
    requirements: [
      { id: 'learning-low.inspect', action: { kind: 'inspect', targetId: 'learning-word-card' } },
      { id: 'learning-low.inspect-bag', action: { kind: 'inspect', targetId: 'learning-bag-word' } },
      { id: 'learning-low.connect', action: { kind: 'connect', edgeId: 'learning-low.connection' }, after: ['learning-low.inspect', 'learning-low.inspect-bag'] }
    ],
    dialogueIds: [], perceptionLineIds: lineIds('learning-low')
  },
  {
    // Core's ChapterStep scene union needs the laboratory room added by its owner.
    id: 'recovery', sceneId: 'laboratory' as ChapterStep['sceneId'], phase: 'LOW',
    title: t('My own marks', '我写的字'),
    objective: t('Look at the note you wrote before the operation. Put it within reach beside the bed.', '看看手术前自己写的便条，把它放在床边伸手可及的地方。'),
    stimulus: {
      id: 'recovery-familiar-note',
      facts: t('The handwritten note from before the operation lies beside the bed. Its ink and uneven letters are unchanged. There is room to keep it close.', '手术前亲手写的便条就在床边。墨迹和不齐的字都没有变化。旁边有地方可以把它放近些。')
    },
    perception: {
      LOW: t('I made those marks. Some words are hard. I want the paper near me.', '这些字是我写的。有的词很难。我想把纸放近点。'),
      ASCENDING: t('I recognize my writing. I can leave the note beside me.', '我认得自己的字。我可以把便条留在身边。'),
      PEAK: t('The marks on this page have stayed as I made them.', '纸上的字仍然是我当初写下的样子。'),
      DECLINE: t('My paper. I want to keep it here.', '我的纸。我想把它放这里。')
    },
    graph: { nodes: [], edges: [] },
    requirements: [
      { id: 'recovery.inspect', action: { kind: 'inspect', targetId: 'recovery-handwritten-note' } },
      { id: 'recovery.place', action: { kind: 'place', targetId: 'recovery-bedside', itemId: 'recovery-handwritten-note' }, after: ['recovery.inspect'] }
    ],
    dialogueIds: [], perceptionLineIds: lineIds('recovery')
  },
  {
    id: 'bakery-return', sceneId: 'bakery', phase: 'ASCENDING',
    title: t('Beside the lever', '拉杆旁边'),
    objective: t('Look at the same machine from the outside. Watch the lever and the wheel beside it, then connect just those two observations.', '从外面看看同一台机器，观察拉杆和旁边的轮子，再把这两项观察连起来。'),
    stimulus: {
      id: 'bakery-machine-exterior',
      facts: t('The machine is in its usual place behind the counter. Its outer lever and the wheel beside it are visible. During its usual movement, the lever moves and the adjacent wheel turns. The cover stays closed.', '机器仍在柜台后面原来的位置。能看见外侧的拉杆和旁边的轮子。照常运转时，拉杆移动，旁边的轮子转动。外盖保持关着。')
    },
    perception: {
      LOW: t('It makes the same sound. I know where to stand.', '还是那个声音。我知道该站哪里。'),
      ASCENDING: t('The lever moves, and that wheel turns. I can follow this little part. I do not know what happens inside yet.', '拉杆动，那个轮子就转。这一小段我跟得上。里面怎样，我还不知道。'),
      PEAK: t('These two visible movements gave me a small place to start asking how it worked.', '这两个看得见的动作，让我开始问机器是怎样工作的。'),
      DECLINE: t('The lever and the wheel are still there. I can take another look.', '拉杆和轮子还在那里。我可以再看一眼。')
    },
    graph: {
      nodes: [
        { id: 'bakery-return.lever', x: 25, y: 35, label: t('The lever moves', '拉杆移动') },
        { id: 'bakery-return.wheel', x: 75, y: 65, label: t('The nearby wheel turns', '旁边的轮子转动') }
      ],
      edges: [{ id: 'bakery-return.connection', from: 'bakery-return.lever', to: 'bakery-return.wheel', meaning: t('When this lever moves, the wheel beside it turns. I can follow these two parts.', '这根拉杆动的时候，旁边的轮子就转。这两个部件我能跟上。'), phases: ['ASCENDING'] }]
    },
    requirements: [
      { id: 'bakery-return.inspect', action: { kind: 'inspect', targetId: 'bakery-machine-exterior' } },
      { id: 'bakery-return.inspect-lever', action: { kind: 'inspect', targetId: 'bakery-lever' }, after: ['bakery-return.inspect'] },
      { id: 'bakery-return.inspect-wheel', action: { kind: 'inspect', targetId: 'bakery-wheel' }, after: ['bakery-return.inspect'] },
      { id: 'bakery-return.connect', action: { kind: 'connect', edgeId: 'bakery-return.connection' }, after: ['bakery-return.inspect-lever', 'bakery-return.inspect-wheel'] }
    ],
    dialogueIds: [], perceptionLineIds: lineIds('bakery-return'), nextStepId: 'learning-return'
  },
  {
    id: 'learning-return', sceneId: 'classroom', phase: 'ASCENDING',
    title: t('The word is still there', '那个词还在'),
    objective: t('Look at the same bread card and your earlier practice line. Connect the word Alice showed you with the word you tried to write.', '看看同一张面包词卡和先前的练习行，把 Alice 给你看的词与你试着写的词连起来。'),
    stimulus: { id: 'alice-bread-lesson', facts: lessonFacts },
    perception: {
      LOW: t('This is the card. Those marks are mine.', '这是那张卡。那些字是我写的。'),
      ASCENDING: t('Bread. I remember it before Alice says it this time. My letters are uneven, but I can see what I was trying to write. I still need help with the next word.', '面包。这回 Alice 还没开口，我就记起来了。我的字写得不齐，但我能看出自己想写什么。下一个词，我还需要帮忙。'),
      PEAK: t('My earlier effort is still on the page. I can recognize what I was reaching for.', '先前的努力还留在纸上。我能认出当时想写的词。'),
      DECLINE: t('I tried to write this word. Alice can read it with me again.', '我试着写过这个词。Alice 可以再陪我读。')
    },
    graph: {
      nodes: [
        { id: 'learning-return.card', x: 25, y: 35, label: t('bread · Alice’s card', 'bread · Alice 的词卡') },
        { id: 'learning-return.practice', x: 75, y: 65, label: t('My earlier try at the word', '我先前试写的词') }
      ],
      edges: [{ id: 'learning-return.connection', from: 'learning-return.card', to: 'learning-return.practice', meaning: t('That is the word I was trying to write. I can recognize it a little more easily now.', '那是我当时想写的词。现在认它，比先前容易一点了。'), phases: ['ASCENDING'] }]
    },
    requirements: [
      { id: 'learning-return.inspect', action: { kind: 'inspect', targetId: 'learning-word-card' } },
      { id: 'learning-return.inspect-practice', action: { kind: 'inspect', targetId: 'learning-earlier-practice' } },
      { id: 'learning-return.connect', action: { kind: 'connect', edgeId: 'learning-return.connection' }, after: ['learning-return.inspect', 'learning-return.inspect-practice'] }
    ],
    dialogueIds: [], perceptionLineIds: lineIds('learning-return')
  }
];

/** Resolve every perceptionLineId without inventing available voice assets.
 * Audio/Core can register recordings later, after the wording is accepted.
 */
export const earlyJourneyDialogue: DialogueBeat[] = earlyJourneySteps.flatMap(step => phases.map(phase => ({
  id: step.perceptionLineIds[phase], speaker: 'charlie', subtitles: step.perception[phase]
})));
