import json,hashlib
from pathlib import Path
root=Path.cwd(); manifest_path=root/'ASSET_MANIFEST.json'; m=json.loads(manifest_path.read_text(encoding='utf-8'))
all_files=[root/'assets/audio/production/edge-tts-manifest.json',root/'assets/audio/diary-production/edge-tts-manifest.json']
by_id={}
for fp in all_files:
 for a in json.loads(fp.read_text(encoding='utf-8'))['assets']:
  by_id[a['id']]=a
for aid,a in by_id.items():
 entry=dict(a)
 entry['source']=a['provenance']['source']['provider']
 entry['license']=a['provenance']['license']['identifier']
 entry['description']='Pre-generated English production voice; human listening review pending.'
 m['assets']=[x for x in m['assets'] if x.get('id')!=aid]
 m['assets'].append(entry)
manifest_path.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# update the project voice plan to reflect the provider route without removing original OpenDev diagnostic history
vp=root/'assets/audio/voice-jobs.json'; v=json.loads(vp.read_text(encoding='utf-8'))
v['generationProvider']={'name':'Microsoft Azure Neural TTS via edge-tts','voices':{'charlie':'en-US-GuyNeural','dr-strauss':'en-GB-RyanNeural','gimpy':'en-AU-WilliamMultilingualNeural'},'status':'generated-awaiting-human-listening'}
for j in v['jobs']:
 j['status']='generated-awaiting-listening'; j['filename']='assets/audio/production/'+j['id']+'.mp3'
v['productionRecordingsPresent']=True
vp.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# diary plan gains a provider route; leave old OpenDev model as historical attempt field
vp=root/'assets/audio/diary-voice-jobs.json'; v=json.loads(vp.read_text(encoding='utf-8'))
v['generationProvider']={'name':'Microsoft Azure Neural TTS via edge-tts','voice':'en-US-GuyNeural','status':'generated-awaiting-human-listening'}
for j in v['jobs']:
 j['status']='generated-awaiting-listening'; j['filename']='assets/audio/diary-production/'+j['id']+'.mp3'; j['english']=j['text']
v['productionRecordingsPresent']=True
vp.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('registered',len(by_id),'voice assets')
