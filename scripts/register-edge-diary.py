import json
from pathlib import Path
root=Path.cwd(); mp=root/'ASSET_MANIFEST.json'; m=json.loads(mp.read_text(encoding='utf-8'))
fp=root/'assets/audio/diary-production/edge-tts-manifest.json'; assets=json.loads(fp.read_text(encoding='utf-8'))['assets']
for a in assets:
 e=dict(a); e['source']=a['provenance']['source']['provider']; e['license']=a['provenance']['license']['identifier']; e['description']='Pre-generated English Charlie diary fragment; human listening review pending.'
 m['assets']=[x for x in m['assets'] if x.get('id')!=e['id']]; m['assets'].append(e)
mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
dp=root/'assets/audio/diary-voice-jobs.json'; d=json.loads(dp.read_text(encoding='utf-8')); d['generationProvider']={'name':'Microsoft Azure Neural TTS via edge-tts','voice':'en-US-GuyNeural','status':'generated-awaiting-human-listening'}; d['productionRecordingsPresent']=True; dp.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('registered diary',len(assets))
