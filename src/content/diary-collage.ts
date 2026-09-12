export type DiaryFragmentRole = 'subject' | 'intent' | 'detail' | 'ending';
export interface DiaryCollageEntry {
  title: string;
  context: string;
  fragments: { id: string; text: string; role: DiaryFragmentRole }[];
  minFragments: number;
}

/** Original Chinese adaptation, not quoted novel text. These are selectable authored
 * fragments, never replacements for arbitrary player input. Early homophones are
 * intentional: 以经/已经, 在/再, 作/做, 记主/记住. Keep the voice earnest.
 * Context describes placement in the story, not a warning about later mechanics.
 */
export const diaryEntries: Record<'first' | 'peak' | 'last', DiaryCollageEntry> = {
  first: {
    title: '今天的事',
    context: '测试结束了。桌上留着纸和笔。隔着笼子，还能看见那只小白鼠。',
    minFragments: 3,
    fragments: [
      { id: 'first-i', text: '我', role: 'subject' },
      { id: 'first-mouse', text: '小白鼠', role: 'subject' },
      { id: 'first-try', text: '还想', role: 'intent' },
      { id: 'first-learn', text: '想要', role: 'intent' },
      { id: 'first-again', text: '在试一次', role: 'detail' },
      { id: 'first-words', text: '学会更多的字', role: 'detail' },
      { id: 'first-test', text: '作好测试', role: 'detail' },
      { id: 'first-route', text: '跑得很快', role: 'detail' },
      { id: 'first-smart', text: '变聪明', role: 'detail' },
      { id: 'first-already', text: '以经', role: 'intent' },
      { id: 'first-arrived', text: '来到这里', role: 'detail' },
      { id: 'first-remember', text: '把今天记主', role: 'detail' },
      { id: 'first-today', text: '今天', role: 'ending' },
      { id: 'first-tomorrow', text: '明天也一样', role: 'ending' }
    ]
  },
  peak: {
    title: '原来还能这样理解',
    context: '离开大学课堂后，你又翻看了旧记录。墨迹图、滚轴草图和迷宫路线摊在同一张桌上。',
    minFragments: 3,
    fragments: [
      { id: 'peak-i', text: '我', role: 'subject' },
      { id: 'peak-understanding', text: '理解一件事的快乐', role: 'subject' },
      { id: 'peak-pages', text: '原本分散的记录', role: 'subject' },
      { id: 'peak-question', text: '让我想继续追问', role: 'intent' },
      { id: 'peak-explore', text: '想沿着这些联系', role: 'intent' },
      { id: 'peak-follow', text: '已经能够', role: 'intent' },
      { id: 'peak-before', text: '在教授说完之前', role: 'detail' },
      { id: 'peak-experiment', text: '想到下一步实验', role: 'detail' },
      { id: 'peak-cue', text: '提示怎样帮助回忆', role: 'detail' },
      { id: 'peak-bakery', text: '从拉杆想到齿轮', role: 'detail' },
      { id: 'peak-test', text: '从墨迹认出翅膀', role: 'detail' },
      { id: 'peak-maze', text: '把迷宫的转角与线索联系起来', role: 'detail' },
      { id: 'peak-connect', text: '在同一页上彼此连接', role: 'detail' },
      { id: 'peak-joy', text: '带着发现新东西的快乐', role: 'ending' },
      { id: 'peak-more', text: '再往前想一步', role: 'ending' }
    ]
  },
  last: {
    title: '还想留下的话',
    context: '旧笔记就在手边。这支笔用过很多次，你又翻到一页空白的地方。',
    minFragments: 3,
    fragments: [
      { id: 'last-i', text: '我', role: 'subject' },
      { id: 'last-before', text: '以前的我', role: 'subject' },
      { id: 'last-want', text: '还想记住', role: 'intent' },
      { id: 'last-keep', text: '不想忘掉', role: 'intent' },
      { id: 'last-know', text: '懂得', role: 'intent' },
      { id: 'last-seek', text: '想找回', role: 'intent' },
      { id: 'last-people', text: '对我好的人', role: 'detail' },
      { id: 'last-mouse', text: '阿尔吉侬', role: 'detail' },
      { id: 'last-connection', text: '这些线为什么相连', role: 'detail' },
      { id: 'last-word', text: '那个更合适的词', role: 'detail' },
      { id: 'last-happiness', text: '听懂那堂课的快乐', role: 'detail' },
      { id: 'last-pages', text: '旧本子里的话', role: 'detail' },
      { id: 'last-stay', text: '先留在这页上', role: 'ending' },
      { id: 'last-important', text: '这些仍然重要', role: 'ending' }
    ]
  }
};
