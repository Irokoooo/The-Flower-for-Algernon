/** Saved files only; populated after successful server-side generation. */
export const DIARY_WRITING_ASSET = 'audio.diary.pencil';
export const DIARY_FRAGMENT_AUDIO: Readonly<Record<string, { assetId: string; english: string; voiceProfileId: string }>> = {};
export function diaryVoiceForFragment(fragmentId: string) {
  return DIARY_FRAGMENT_AUDIO[fragmentId];
}
