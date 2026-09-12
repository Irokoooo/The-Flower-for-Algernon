// Original pencil-on-paper approximation. No sampled or third-party audio.
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const rate=22050, duration=.95, count=Math.round(rate*duration), b=Buffer.alloc(44+count*2);
b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(count*2,40);
let seed=591,low=0,smoothed=0;
const strokes=[[.02,.15],[.20,.11],[.37,.22],[.66,.09],[.8,.12]];
for(let i=0;i<count;i++){
 const t=i/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;
 const noise=seed/4294967296*2-1;low+=.07*(noise-low);smoothed+=.55*(noise-low-smoothed);
 let envelope=0;for(const [start,length] of strokes){const u=(t-start)/length;if(u>=0&&u<=1)envelope+=Math.sin(Math.PI*u)**1.5;}
 const v=smoothed*envelope*.075*(.8+.2*Math.sin(t*230));b.writeInt16LE(Math.round(v*32767),44+i*2);
}
writeFileSync(new URL('pencil-writing.wav',import.meta.url),b);
const asset={id:'audio.diary.pencil',filename:'assets/audio/pencil-writing.wav',kind:'sfx',status:'available',durationSeconds:count/rate,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),review:'Original procedural writing SFX; human listening pending',provenance:{source:{kind:'original',url:null,creator:'ALGERNON procedural pencil sound'},license:{identifier:'LicenseRef-ALGERNON-Original-Prototype',evidence:'assets/audio/DIARY_AUDIO.md',attribution:'Original ALGERNON pencil-writing synthesis',reviewed:true},adaptations:['Seeded filtered noise with five writing-stroke envelopes, saved as PCM WAV; no external sample']}};
writeFileSync(new URL('diary-manifest-proposal.json',import.meta.url),JSON.stringify({assets:[asset]},null,2)+'\n');
console.log(JSON.stringify({file:asset.filename,bytes:b.length}));
