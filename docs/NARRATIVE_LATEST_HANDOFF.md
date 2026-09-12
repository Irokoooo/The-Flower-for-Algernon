# Lead / Kepler / Carson: current narrative contracts

## Diary content — supersedes earlier 3-entry/43-fragment handoff counts

Import from src/content/diary-collage.ts:
- DiaryEntryKey = 'first' | 'ascending' | 'peak' | 'last'
- DiaryFragmentRole = 'subject' | 'intent' | 'detail' | 'ending'
- DiaryFragment = { id:string; text:string; english:string; role:DiaryFragmentRole }
- DiaryCollageEntry = { title:string; context:string; fragments:DiaryFragment[]; minFragments:number }
- diaryEntries: Record<DiaryEntryKey, DiaryCollageEntry>

Counts: first 9 / ascending 10 / peak 15 / last 10. Every minFragments is 3.
First uses sincere short phrases with intentional 侧试/聪名/在/记主 spelling slips.
english is Charlie's perceived English meaning, never phonetic Chinese typos.
Last has fewer available phrases, a spelling slip and a missing-word phrase; preserve choice and motor ability.
Fragments are freely ordered phrases, not whole sentence cards. Do not enforce one correct composition.
Diary input is the user-requested collage; preserve the selected fragments/order for audit and preserve PEAK composition exactly. No additional free-form diary feature is claimed or requested by this handoff. Final player memory is a separate unrestricted writing screen whose text remains unchanged. The original PRD free-typing diary requirement differs from this later collage direction; do not add another input mode implicitly.
Handwriting presentation is explicitly requested now; do not let older deferred notes disable it.

Placement: first after initial test/maze; ascending after bakery gain BEFORE machine;
peak after university/free exploration BEFORE first Algernon failure;
last before broken transition/empty room. Final player memory stays separate after flowers.

## Existing audio boundary (read, not edited by Narrative)

src/audio/diary-audio.ts:
- DIARY_WRITING_ASSET = 'audio.diary.pencil'
- diaryVoiceForFragment(fragmentId) returns {assetId, english, voiceProfileId} or undefined.
- DIARY_FRAGMENT_AUDIO is currently empty: this is not available recorded voice.

Kepler resolves by fragment.id and compares returned english with current fragment.english.
Some IDs retain identity while wording changed: do not replay stale recordings on an ID-only match.
Missing audio must not block writing. English phrases are optional short murmurs, not a promise that
arbitrary Chinese word order yields a grammatical concatenated English sentence.
No auto-translation of typos or TTS fallback requests from UI.

User-authorized Kepler diagnostic: diary-murmurs-v1 reservation $1 additional, aggregate15.
One short diagnostic, max_retries=0, timeout=90; stop on failure; no batch until success.
Narrative has not invoked the provider or consumed that reservation.

## Conference (Carson)

src/content/conference-choice.ts exports:
ConferenceChoiceId = respectful | assertive | silent
conferenceChoices: readonly ConferenceChoice[]
each { id, label:{en,zhHans}, playerLine:{en,zhHans}|null,
       consequence:{en,zhHans},
       action:{kind:'present-evidence',targetId:'conference-evidence-desk'},
       convergesAt:'release' }
conferenceConvergence: {id:'release', prerequisite, disclosure:{en,zhHans},
 reversal:{en,zhHans}, staging,
 interaction:{kind:'open-cage',targetId:'algernon-cage-latch'}, instruction}

Choices change interpersonal response only. Silent means initially silent, not suppression of evidence.
Player must actually present evidence after choosing; play/display consequence after that action.
All paths disclose the flaw and reach the question reversal with Charlie standing and researchers seated.
Then quiet laboratory: player discovers and opens cage; never auto-release on choice selection.
'convergesAt' is a narrative destination, not an existing registered Core scene or completed interaction.
No recordings are registered for these new lines.

## Mainline guardrails

See CARSON_CHAPTER_TWO_HANDOFF.md for exact chapterTwoSteps action payloads.
classroom-c.nextStepId requires an insertion: free exploration + peak diary before failure.
shared-procedure.nextStepId requires quiet realization + player-initiated research before research.
Research maze-clock/escalation, full investigation metrics, and expanded conference staging remain gaps.
New conference data supplies choices/convergence copy, not a running UI or automatic gap closure.

No App edits, browser use, functional tests, new build, or commit for this handoff.
