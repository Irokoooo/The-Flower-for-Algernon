# Kepler: Chinese diary collage contract

Import `diaryEntries` from `src/content/diary-collage.ts` (adjust relative import to component).

```ts
Record<'first' | 'peak' | 'last', {
  title: string;
  context: string;
  fragments: { id: string; text: string; role: 'subject' | 'intent' | 'detail' | 'ending' }[];
  minFragments: number;
}>
```

Phrase assembly, not paragraph ordering: first has 14 fragments, peak 15, last 14; minFragments is 3 for ALL entries. Roles are palette hints, not mandatory sentence slots. Fragment IDs remain entry-specific; several old IDs now carry shorter text, so invalidate old draft previews that cached text.

- `first`: after lab/test/initial maze and before diary transition to bakery. Small vocabulary, earnest observation. Intentional homophone errors: 作测试、在试一次、以经、记主. Do not autocorrect or add comic error effects.
- `peak`: after university A/B/C and free exploration, BEFORE first Algernon failure. Articulate curiosity and pleasure. No foreshadowed decline diagnosis. Preserve player expression exactly.
- `last`: late decline, before broken diary transition → empty room. Fewer words, remembered prior understanding, intact caring and intention. Do not impair drag or selection to represent decline.

Original PRD §§23/41 describes free typing at PEAK and last report; the later user direction specifies collage composition instead. This is a documented difference, not an instruction to add a free-form diary mode or a claim that one exists. The last entry is authored reduced-access wording, NOT a save-time transformation algorithm. Retain selected fragments/order for audit.

Final player memory (§45) is a separate screen AFTER flowers. It never uses these fragments or any transformation. Chinese text here is written content, not permission to replace English runtime voice with Chinese speech.

## Revised composition rules for Kepler

- Cards are words or short phrases, with no baked-in sentence punctuation. Never append a period to every card.
- Preserve selected order; offer reorder/removal. Do not auto-sort by role, require all four roles, or grade against one correct sentence.
- Chinese phrases can concatenate directly. Let the player add punctuation or a sentence break; do not invent connecting words. A role named ending can be a time phrase moved to the front.
- Examples (not templates or required answers): 我 / 还想 / 在试一次; 小白鼠 / 想要 / 跑得很快; 今天 / 我 / 以经 / 来到这里; 我 / 已经能够 / 在教授说完之前 / 想到下一步实验; 理解一件事的快乐 / 让我想继续追问 / 提示怎样帮助回忆; 我 / 不想忘掉 / 对我好的人; 以前的我 / 懂得 / 这些线为什么相连.
- Not every arbitrary combination is grammatical. Preserve semantic freedom; let the player revise rather than silently repair, reject meaning, or manufacture a story.
- First-entry homophone errors remain intentional. Peak offers richer clauses and joyful inquiry. Last retains remembered understanding and caring; do not disable input or fabricate motor failure.
- Use collage composition for the diary. Only the separate final-memory screen is designated unrestricted free writing; preserve its text exactly.
