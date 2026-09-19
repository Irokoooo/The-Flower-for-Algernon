import asyncio, hashlib, json, re
from pathlib import Path
import edge_tts
root=Path.cwd(); source=(root/'src/content/diary-collage.ts').read_text(encoding='utf-8')
pat=re.compile(r"\{ id: '([^']+)', text: '([^']*)', english: '([^']*)', role: '[^']+' \}")
jobs=[{'id':'voice.diary.'+m.group(1),'fragmentId':m.group(1),'text':m.group(3),'speaker':'charlie'} for m in pat.finditer(source)]
out=root/'assets/audio/diary-production'; out.mkdir(parents=True,exist_ok=True)
sem=asyncio.Semaphore(5)
async def one(j):
 p=out/(j['id']+'.mp3')
 if not p.exists():
  async with sem: await edge_tts.Communicate(j['text'],'en-US-GuyNeural',rate='-18%',pitch='-3Hz').save(str(p))
async def main():
 await asyncio.gather(*(one(j) for j in jobs))
 data=[]
 for j in jobs:
  p=out/(j['id']+'.mp3'); b=p.read_bytes(); data.append({'id':j['id'],'fragmentId':j['fragmentId'],'english':j['text'],'filename':str(p.relative_to(root)).replace('\\','/'),'kind':'voice','status':'review','language':'en','voiceProfileId':'voice.charlie.en','bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'provenance':{'source':{'kind':'online-tts','provider':'Microsoft Azure Neural TTS via edge-tts','url':'https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=tts','creator':'en-US-GuyNeural'},'license':{'identifier':'Provider terms; review required','evidence':'assets/audio/VOICE_HANDOFF.md','attribution':'Microsoft Azure Neural TTS'},'adaptations':['Saved as MP3 for pre-generated English Charlie murmurs; slowed for low-cognition fragments.']}})
 (root/'assets/audio/diary-production/edge-tts-manifest.json').write_text(json.dumps({'provider':'Microsoft Azure Neural TTS','voice':'en-US-GuyNeural','assets':data},ensure_ascii=False,indent=2),encoding='utf-8')
 print('generated',len(data),'diary files')
asyncio.run(main())
