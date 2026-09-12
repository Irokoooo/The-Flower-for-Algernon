// Original composition: Still Room. No samples or external dependencies.
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sr=22050, seconds=20, n=sr*seconds, out=new Float64Array(n);
const hz=m=>440*2**((m-69)/12);
// Four suspended/added-note harmonies; circular synthesis preserves release tails.
const chords=[[48,55,62,64],[45,52,59,60],[41,48,55,57],[43,50,57,60]];
function note(start,midi,level,duration,piano){
 const f=hz(midi);
 for(let i=0;i<duration*sr;i++){
  const t=i/sr;
  const env=piano?(1-Math.exp(-t*65))*Math.exp(-t/1.25)*Math.min(1,(duration-t)/.4):Math.sin(Math.PI*t/duration)**2;
  const wave=Math.sin(2*Math.PI*f*t)+.18*Math.sin(2*Math.PI*f*2*t)*Math.exp(-t*2)+.045*Math.sin(2*Math.PI*f*3*t);
  out[(Math.round(start*sr)+i)%n]+=wave*env*level;
 }
}
chords.forEach((chord,index)=>{
 chord.forEach(m=>note(index*5,m,.0065,8,false));
 note(index*5+.45,chord[2]+12,.023,5,true);
 note(index*5+2.7,chord[3]+12,.017,4.5,true);
});
const wet=new Float64Array(n);
for(let i=0;i<n;i++) wet[i]=out[i]+.17*out[(i-Math.round(sr*.193)+n)%n]+.1*out[(i-Math.round(sr*.337)+n)%n];
const b=Buffer.alloc(44+n*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);
for(let i=0;i<n;i++)b.writeInt16LE(Math.round(wet[i]*32767),44+i*2);
writeFileSync(new URL('still-room.wav',import.meta.url),b);
const record={id:'audio.music.still-room',kind:'ambience',filename:'assets/audio/music/still-room.wav',status:'available',durationSeconds:seconds,loop:true,sha256:createHash('sha256').update(b).digest('hex'),review:'Original composition; final human listening review pending',provenance:{source:{kind:'original',url:null,creator:'ALGERNON / Still Room procedural composition'},license:{identifier:'LicenseRef-ALGERNON-Original-Prototype',evidence:'assets/audio/music/PROVENANCE.md',reviewed:true,attribution:'Still Room — original ALGERNON composition'},adaptations:['Layered original harmony and sparse synthesized piano-like notes; circular release tails and reflections; no external samples']}};
writeFileSync(new URL('manifest-proposal.json',import.meta.url),JSON.stringify({assets:[record]},null,2)+'\n');
console.log(JSON.stringify({seconds,bytes:b.length,peak:Math.max(...Array.from(wet.subarray(0,10000)).map(Math.abs)),boundaryDelta:Math.abs(wet[0]-wet[n-1])}));
