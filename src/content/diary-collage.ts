export type DiaryEntryKey = 'first' | 'ascending' | 'peak' | 'last';
export type DiaryFragmentRole = 'subject' | 'intent' | 'detail' | 'ending';
export interface DiaryFragment { id: string; text: string; english: string; role: DiaryFragmentRole }
export interface DiaryCollageEntry {
  title: string;
  context: string;
  fragments: DiaryFragment[];
  minFragments: number;
}
/** Original authored phrase palette. English expresses perceived meaning, never the
 * pronunciation of Chinese spelling slips. These are not replacement templates for
 * arbitrary player writing. Preserve chosen order, raw text and final memory.
 */
export const diaryEntries: Record<DiaryEntryKey, DiaryCollageEntry> = {
  first: {
    title: '今天的事',
    context: '侧试结束了。桌上有纸和笔。小白鼠还在那边。',
    minFragments: 3,
    fragments: [
      { id: 'first-i', text: '我', english: 'I', role: 'subject' },
      { id: 'first-mouse', text: '小白鼠', english: 'the little mouse', role: 'subject' },
      { id: 'first-try', text: '还想', english: 'still want to', role: 'intent' },
      { id: 'first-again', text: '在试一次', english: 'try again', role: 'detail' },
      { id: 'first-test', text: '做好侧试', english: 'do well on the test', role: 'detail' },
      { id: 'first-route', text: '跑得很快', english: 'run fast', role: 'detail' },
      { id: 'first-smart', text: '变聪名', english: 'get smarter', role: 'detail' },
      { id: 'first-remember', text: '把今天记主', english: 'remember today', role: 'detail' },
      { id: 'first-today', text: '今天', english: 'today', role: 'ending' }
    ]
  },
  ascending: {
    title: '我开始看懂了',
    context: '面包店里还是那台机器。你注意到了拉杆和齿轮，想先把发现写下来，再去试一试。',
    minFragments: 3,
    fragments: [
      { id: 'ascending-i', text: '我', english: 'I', role: 'subject' },
      { id: 'ascending-now', text: '现在', english: 'now', role: 'ending' },
      { id: 'ascending-begin', text: '开始看懂', english: 'am starting to understand', role: 'intent' },
      { id: 'ascending-want', text: '想试着弄清', english: 'want to work out', role: 'intent' },
      { id: 'ascending-lever', text: '拉杆怎样带动齿轮', english: 'how the lever turns the gear', role: 'detail' },
      { id: 'ascending-roller', text: '滚轴为什么一起动', english: 'why the rollers move together', role: 'detail' },
      { id: 'ascending-links', text: '这些部件之间的联系', english: 'how these parts fit together', role: 'detail' },
      { id: 'ascending-try', text: '再亲手试一试', english: 'then try it myself', role: 'ending' },
      { id: 'ascending-happy', text: '心里有一点高兴', english: 'feeling a little pleased', role: 'ending' },
      { id: 'ascending-pace', text: '一步一步地', english: 'one step at a time', role: 'ending' }
    ]
  },
  peak: {
    title: '原来还能这样理解',
    context: '离开大学课堂后，你又翻看了旧记录。墨迹图、滚轴草图和迷宫路线摊在同一张桌上。',
    minFragments: 3,
    fragments: [
      { id: 'peak-i', text: '我', english: 'I', role: 'subject' },
      { id: 'peak-understanding', text: '理解一件事的快乐', english: 'the pleasure of understanding something', role: 'subject' },
      { id: 'peak-pages', text: '原本分散的记录', english: 'records that once seemed separate', role: 'subject' },
      { id: 'peak-question', text: '让我想继续追问', english: 'makes me want to keep asking', role: 'intent' },
      { id: 'peak-explore', text: '想沿着这些联系', english: 'want to follow these connections', role: 'intent' },
      { id: 'peak-follow', text: '已经能够', english: 'can already', role: 'intent' },
      { id: 'peak-before', text: '在教授说完之前', english: 'before the professor finishes', role: 'detail' },
      { id: 'peak-experiment', text: '想到下一步实验', english: 'think of the next experiment', role: 'detail' },
      { id: 'peak-cue', text: '提示怎样帮助回忆', english: 'how a cue helps us remember', role: 'detail' },
      { id: 'peak-bakery', text: '从拉杆想到齿轮', english: 'follow the lever to the gear', role: 'detail' },
      { id: 'peak-test', text: '从墨迹认出翅膀', english: 'recognize wings in the ink', role: 'detail' },
      { id: 'peak-maze', text: '把迷宫的转角与线索联系起来', english: 'connect a turn in the maze with a cue', role: 'detail' },
      { id: 'peak-connect', text: '在同一页上彼此连接', english: 'connect with each other on one page', role: 'detail' },
      { id: 'peak-joy', text: '带着发现新东西的快乐', english: 'with the joy of finding something new', role: 'ending' },
      { id: 'peak-more', text: '再往前想一步', english: 'think one step further', role: 'ending' }
    ]
  },
  last: {
    title: '还想留下的话',
    context: '旧本子就在手边。你翻到一页空白，想把重要的事留下。',
    minFragments: 3,
    fragments: [
      { id: 'last-i', text: '我', english: 'I', role: 'subject' },
      { id: 'last-before', text: '以前的我', english: 'the person I was', role: 'subject' },
      { id: 'last-want', text: '还想记主', english: 'still want to remember', role: 'intent' },
      { id: 'last-keep', text: '不想忘掉', english: 'do not want to forget', role: 'intent' },
      { id: 'last-know', text: '懂得', english: 'understood', role: 'intent' },
      { id: 'last-people', text: '对我好的人', english: 'the people who were kind to me', role: 'detail' },
      { id: 'last-mouse', text: '阿尔吉侬', english: 'Algernon', role: 'detail' },
      { id: 'last-word', text: '那个……想不起的词', english: 'that word... the one I cannot find', role: 'detail' },
      { id: 'last-happiness', text: '听懂那堂课的快乐', english: 'the joy of understanding that lesson', role: 'detail' },
      { id: 'last-stay', text: '先留在这页上', english: 'leave it on this page for now', role: 'ending' }
    ]
  }
};
