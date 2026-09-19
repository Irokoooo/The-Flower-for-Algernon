import asyncio, hashlib, json, os, re
from pathlib import Path
import edge_tts
root=Path.cwd()
jobs=json.loads((root/'assets/audio/voice-jobs.json').read_text(encoding='utf-8'))['jobs']
voices={'charlie':'en-US-GuyNeural','dr-strauss':'en-GB-RyanNeural','gimpy':'en-AU-WilliamMultilingualNeural'}
out=root/'assets/audio/production'
out.mkdir(parents=True,exist_ok=True)
manifest=[]
async def one(job):
    dest=out/(job['id']+'.mp3')
    if dest.exists(): return
    communicate=edge_tts.Communicate(job['text'],voices[job['speaker']],rate='-8%' if job['speaker']=='charlie' else '+0%',pitch='-2Hz' if job['speaker']=='charlie' else '+0Hz')
    await communicate.save(str(dest))
async def main():
    await asyncio.gather(*(one(j) for j in jobs))
    for j in jobs:
      p=out/(j['id']+'.mp3'); b=p.read_bytes()
      manifest.append({'id':j['id'],'filename':str(p.relative_to(root)).replace('\\','/'),'kind':'voice','status':'review','language':'en','voiceProfileId':'voice.'+j['speaker']+'.en','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'provenance':{'source':{'kind':'online-tts','provider':'Microsoft Azure Neural TTS via edge-tts','url':'https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=tts','creator':voices[j['speaker']]},'license':{'identifier':'Provider terms; review required','evidence':'assets/audio/VOICE_HANDOFF.md','attribution':'Microsoft Azure Neural TTS'},'adaptations':['Saved as MP3 for pre-generated playback; no browser speech synthesis.']}})
    (root/'assets/audio/production/edge-tts-manifest.json').write_text(json.dumps({'provider':'Microsoft Azure Neural TTS','voices':voices,'assets':manifest},ensure_ascii=False,indent=2),encoding='utf-8')
asyncio.run(main())
print('generated',len(manifest),'files')
