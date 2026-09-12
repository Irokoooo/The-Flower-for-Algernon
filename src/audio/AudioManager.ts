import { normalizePerception, PERCEPTION_PRESETS } from './perception';
import type { AudioAsset, AudioPerception, PlaybackHandle, ResolveAudioAsset, SpeechPreviewState, VoiceProfile } from './types';

/** One application-owned instance. Call unlock() from a user gesture. */
export class AudioManager {
  private context?: AudioContext;
  private filter?: BiquadFilterNode;
  private voice?: GainNode;
  private ambience?: GainNode;
  private master?: GainNode;
  private perception: AudioPerception = PERCEPTION_PRESETS.clear;
  private muted = false;
  private disposed = false;
  private voiceGeneration = 0;
  private activeVoice?: PlaybackHandle;
  private active = new Set<PlaybackHandle>();
  private buffers = new Map<string, Promise<AudioBuffer>>();
  private abort = new AbortController();
  private previewUtterance?: SpeechSynthesisUtterance;

  get previewState(): SpeechPreviewState {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return { available: false, reason: 'no-browser-support' };
    const available = window.speechSynthesis.getVoices().some(voice => /^en(?:-|$)/i.test(voice.lang));
    return { available, reason: available ? 'browser-speech-synthesis' : 'english-voice-unavailable' };
  }

  constructor(
    private readonly resolveAsset: ResolveAudioAsset,
    private readonly createContext: () => AudioContext = () => new AudioContext(),
  ) {}

  async unlock(): Promise<void> {
    this.assertAlive();
    if (!this.context) {
      const context = this.createContext();
      this.context = context;
      this.master = context.createGain();
      this.master.gain.value = this.muted ? 0 : 1;
      this.master.connect(context.destination);
      this.filter = context.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.Q.value = 0.7;
      this.filter.connect(this.master);
      this.voice = context.createGain();
      this.voice.connect(this.filter);
      this.ambience = context.createGain();
      this.ambience.connect(this.filter);
      this.setPerception(this.perception);
    }
    await this.context.resume();
    this.assertAlive();
  }

  setPerception(value: AudioPerception): void {
    this.assertAlive();
    const next = normalizePerception(value, this.context?.sampleRate ?? 48000);
    this.perception = next;
    if (!this.context) return;
    const now = this.context.currentTime;
    const smooth = (param: AudioParam, target: number) => {
      param.cancelAndHoldAtTime(now);
      param.linearRampToValueAtTime(target, now + next.transitionSeconds);
    };
    smooth(this.filter!.frequency, next.lowpassHz);
    smooth(this.voice!.gain, next.voiceGain);
    smooth(this.ambience!.gain, next.ambienceGain);
  }

  setMuted(muted: boolean): void {
    this.assertAlive();
    this.muted = muted;
    if (this.context) this.master!.gain.setTargetAtTime(muted ? 0 : 1, this.context.currentTime, 0.02);
  }

  /** Dialogue owns perceived wording and both subtitle languages. No raw-text TTS fallback. */
  async playVoice(assetId: string): Promise<PlaybackHandle> {
    this.assertReady();
    this.stopPreview();
    const generation = ++this.voiceGeneration;
    this.activeVoice?.stop();
    const asset = await this.resolveAsset(assetId);
    this.validateAsset(asset, assetId);
    if (asset.kind !== 'voice' || asset.language !== 'en' || !asset.voiceProfileId) {
      throw new Error(`Expected English voice with a voice profile: ${assetId}`);
    }
    const buffer = await this.load(asset);
    this.assertReady();
    if (generation !== this.voiceGeneration) throw new Error('Voice request superseded');
    const handle = this.start(buffer, this.voice!, false);
    this.activeVoice = handle;
    void handle.ended.then(() => { if (this.activeVoice === handle) this.activeVoice = undefined; });
    return handle;
  }

  /** Provisional audition only: browser voices are not production recordings. */
  previewVoice(text: string, profile: VoiceProfile): SpeechPreviewState {
    this.assertAlive();
    if (profile.characterId.toLowerCase() === 'algernon' || profile.language !== 'en') throw new Error('English human voices only');
    if (!this.previewState.available) return this.previewState;
    this.stopVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    const settings = profile.preview ?? { locale: 'en-US', rate: 1, pitch: 1 };
    const voices = window.speechSynthesis.getVoices().filter(candidate => /^en(?:-|$)/i.test(candidate.lang));
    const voice = voices.find(candidate => candidate.name === settings.preferredVoiceName)
      ?? voices.find(candidate => candidate.lang.toLowerCase() === settings.locale.toLowerCase()) ?? voices[0];
    utterance.lang = voice.lang;
    utterance.voice = voice;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = this.muted ? 0 : 1;
    this.previewUtterance = utterance;
    const cleanup = () => { if (this.previewUtterance === utterance) this.previewUtterance = undefined; };
    utterance.onend = cleanup;
    utterance.onerror = cleanup;
    window.speechSynthesis.speak(utterance);
    return { available: true, reason: 'browser-speech-synthesis', voiceName: voice.name };
  }

  private stopPreview(): void {
    if (this.previewUtterance) { window.speechSynthesis.cancel(); this.previewUtterance = undefined; }
  }

  async playSound(assetId: string, loop = false): Promise<PlaybackHandle> {
    this.assertReady();
    const asset = await this.resolveAsset(assetId);
    this.validateAsset(asset, assetId);
    if (asset.kind === 'voice') throw new Error('Voice must use playVoice');
    const buffer = await this.load(asset);
    this.assertReady();
    // UI/SFX remain clear; cognition filtering affects voice and ambience only.
    return this.start(buffer, asset.kind === 'ambience' ? this.ambience! : this.master!, loop);
  }

  stopVoice(): void {
    this.stopPreview();
    ++this.voiceGeneration;
    this.activeVoice?.stop();
  }

  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    this.abort.abort();
    this.stopVoice();
    for (const handle of this.active) handle.stop();
    this.buffers.clear();
    this.voice?.disconnect();
    this.ambience?.disconnect();
    this.filter?.disconnect();
    this.master?.disconnect();
    await this.context?.close();
  }

  private assertAlive(): void {
    if (this.disposed) throw new Error('AudioManager is disposed');
  }

  private assertReady(): void {
    this.assertAlive();
    if (!this.context || this.context.state !== 'running') throw new Error('Unlock audio from a user gesture first');
  }

  private validateAsset(asset: AudioAsset, requestedId: string): void {
    this.assertAlive();
    if (asset.id !== requestedId || !asset.url || !asset.provenance.license.reviewed || !asset.provenance.license.evidence) {
      throw new Error(`Asset missing registry identity or reviewed license evidence: ${requestedId}`);
    }
  }

  private load(asset: AudioAsset): Promise<AudioBuffer> {
    this.assertAlive();
    const cached = this.buffers.get(asset.id);
    if (cached) return cached;
    const context = this.context!;
    const pending = fetch(asset.url, { signal: this.abort.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Audio fetch failed (${response.status}): ${asset.id}`);
        return response.arrayBuffer();
      })
      .then(bytes => context.decodeAudioData(bytes))
      .catch((error: unknown) => { this.buffers.delete(asset.id); throw error; });
    this.buffers.set(asset.id, pending);
    return pending;
  }

  private start(buffer: AudioBuffer, destination: AudioNode, loop: boolean): PlaybackHandle {
    const source = this.context!.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(destination);
    let finish!: () => void;
    const ended = new Promise<void>(resolve => { finish = resolve; });
    let stopped = false;
    const cleanup = () => {
      stopped = true;
      source.disconnect();
      this.active.delete(handle);
      finish();
    };
    const handle: PlaybackHandle = {
      ended,
      stop: () => { if (!stopped) { source.stop(); cleanup(); } },
    };
    source.onended = cleanup;
    this.active.add(handle);
    source.start();
    return handle;
  }
}
