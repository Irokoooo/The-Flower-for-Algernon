import jobs from '../../assets/audio/voice-jobs.json';

/** Static exact-text lookup only. No credentials, network generation, or speech fallback. */
export function voiceForText(english: string) {
  const job = jobs.jobs.find(entry => entry.text === english);
  if (!job) return undefined;
  return {
    assetId: job.id,
    speaker: job.speaker === 'dr-strauss' ? 'Dr. Strauss' : job.speaker === 'gimpy' ? 'Gimpy' : 'Charlie',
    voiceProfileId: `voice.${job.speaker}.en`,
  };
}
