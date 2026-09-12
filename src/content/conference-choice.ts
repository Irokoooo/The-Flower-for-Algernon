export interface ConferenceText { en: string; zhHans: string }
export type ConferenceChoiceId = 'respectful' | 'assertive' | 'silent';
export interface ConferenceChoice {
  id: ConferenceChoiceId;
  label: ConferenceText;
  /** Silence has no voiced player utterance. */
  playerLine: ConferenceText | null;
  consequence: ConferenceText;
  action: { kind: 'present-evidence'; targetId: 'conference-evidence-desk' };
  convergesAt: 'release';
}
/** Original writing. Choices alter the reaction, never suppress public disclosure. */
export const conferenceChoices: readonly ConferenceChoice[] = [
  {
    id: 'respectful',
    label: { en: 'Ask for a moment to show the records', zhHans: '请求一点时间展示记录' },
    playerLine: { en: 'May I put the later records beside that slide? They change what we can claim.', zhHans: '我能把后来的记录放在那张投影片旁吗？它们改变了我们能作出的判断。' },
    consequence: { en: 'The presenter makes room at the desk. A researcher leans forward to read the dates.', zhHans: '报告人让出桌边的位置。一位研究员俯身查看日期。' },
    action: { kind: 'present-evidence', targetId: 'conference-evidence-desk' },
    convergesAt: 'release'
  },
  {
    id: 'assertive',
    label: { en: 'Challenge the claim of lasting improvement', zhHans: '质疑改善能够持续的判断' },
    playerLine: { en: 'That conclusion leaves out the later runs. Put them on the screen too.', zhHans: '那个结论遗漏了后来的试跑。请把它们也放到屏幕上。' },
    consequence: { en: 'The presenter stops mid-sentence. Someone asks to see the records; the room turns toward your desk.', zhHans: '报告人说到一半停住了。有人要求看记录，房间里的目光转向你的桌子。' },
    action: { kind: 'present-evidence', targetId: 'conference-evidence-desk' },
    convergesAt: 'release'
  },
  {
    id: 'silent',
    label: { en: 'Let the sentence finish, then lay out the evidence', zhHans: '等这句话说完，再摆出证据' },
    playerLine: null,
    consequence: { en: 'You wait without answering. When you place the dated records beside the claim, a researcher moves closer to read them.', zhHans: '你没有答话，静静等着。你把带日期的记录摆到结论旁后，一位研究员走近阅读。' },
    action: { kind: 'present-evidence', targetId: 'conference-evidence-desk' },
    convergesAt: 'release'
  }
];
export const conferenceConvergence = {
  id: 'release' as const,
  prerequisite: 'Player has presented the dated contrary evidence publicly, not merely selected a dialogue option.',
  disclosure: { en: 'These later runs do not support a claim of lasting improvement.', zhHans: '这些后来的试跑不足以支持改善能够持续的判断。' },
  reversal: { en: 'What do you see?', zhHans: '你们看见了什么？' },
  staging: 'Charlie stands presenting the records; the researchers sit. Allow the question to land, then return to a quiet lab.',
  interaction: { kind: 'open-cage' as const, targetId: 'algernon-cage-latch' },
  instruction: 'Discover the cage latch in the quiet lab. Choosing a conference response must not open it automatically. After the player opens it, Algernon pauses and leaves; retain the empty maze.'
};
