// Original procedural prototypes. No samples, models, packages, or network calls.
import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const rate = 22050;
let seed = 1709;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const tau = Math.PI * 2;
const assets = [];

function wav(id, filename, seconds, kind, loop, sample) {
  const count = Math.round(seconds * rate);
  const data = Buffer.alloc(44 + count * 2);
  data.write('RIFF'); data.writeUInt32LE(data.length - 8, 4); data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
  data.writeUInt32LE(rate, 24); data.writeUInt32LE(rate * 2, 28);
  data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
  data.write('data', 36); data.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample(i / rate, i))) * 32767), 44 + i * 2);
  writeFileSync(new URL(filename, import.meta.url), data);
  assets.push({ id, filename: `assets/audio/${filename}`, kind, status: 'available',
    productionStatus: 'original-generated-prototype', durationSeconds: seconds, loop,
    sampleRate: rate, channels: 1, bitsPerSample: 16, bytes: data.length,
    sha256: createHash('sha256').update(data).digest('hex'),
    provenance: { source: { kind: 'original', url: null, creator: 'ALGERNON project / procedural generator' },
      license: { identifier: 'LicenseRef-ALGERNON-Original-Prototype', evidence: 'assets/audio/PROVENANCE.md', attribution: 'Original procedural audio for ALGERNON', reviewed: true },
      adaptations: ['Generated from mathematical waveforms and seeded noise with generate-prototypes.mjs; no external samples.'] }
  });
}

// Integer Fourier bins over four seconds make both value and slope periodic.
const partials = Array.from({ length: 96 }, (_, i) => ({
  frequency: (120 + i * 23) / 4, phase: random() * tau, amplitude: 0.005 / Math.sqrt(i + 1),
}));
wav('audio.room-tone.prototype', 'room-tone-prototype.wav', 4, 'ambience', true,
  t => partials.reduce((sum, p) => sum + Math.sin(tau * p.frequency * t + p.phase) * p.amplitude, 0)
    + 0.006 * Math.sin(tau * 60 * t));

let low = 0;
wav('audio.paper.prototype', 'paper-soft-prototype.wav', 0.65, 'sfx', false, (t) => {
  const noise = random() * 2 - 1;
  low += 0.12 * (noise - low);
  const envelope = Math.sin(Math.PI * t / 0.65) ** 2;
  return (noise - low) * envelope * (0.5 + 0.5 * Math.sin(tau * 7 * t) ** 2) * 0.035;
});
wav('audio.chime.prototype', 'chime-soft-prototype.wav', 1.2, 'sfx', false, t => {
  const envelope = (1 - Math.exp(-t * 100)) * Math.exp(-t * 5) * Math.min(1, (1.2 - t) / 0.1);
  return envelope * (0.055 * Math.sin(tau * 660 * t) + 0.012 * Math.sin(tau * 1320 * t));
});

const manifestUrl = new URL('asset-candidates.json', import.meta.url);
const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'));
manifest.assets = assets;
writeFileSync(manifestUrl, JSON.stringify(manifest, null, 2) + '\n');
console.log(assets.map(({ id, bytes }) => ({ id, bytes })));
