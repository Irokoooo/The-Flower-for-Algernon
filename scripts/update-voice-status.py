import json
from pathlib import Path
p=Path('status/audio-assets.json'); d=json.loads(p.read_text(encoding='utf-8')); d.update({'status':'review','updatedAt':'2026-09-19T15:30:00+08:00','progress':92,'note':'已切换独立路径：Microsoft Azure Neural TTS via edge-tts。15条主线英文对白与62条Charlie日记词片已保存为MP3并登记ASSET_MANIFEST.json；不同角色使用不同英文声线。等待人类听感验收。OpenDev图片401仍阻塞learning-wall-v1。'}); p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
p=Path('assets/PRODUCTION_BUDGET.json'); d=json.loads(p.read_text(encoding='utf-8')); d['status']='images-partial-voice-generated'; d['voiceRoute']={'provider':'Microsoft Azure Neural TTS via edge-tts','status':'generated-awaiting-human-listening','openDevFailure':'HTTP401 token rejected; no further OpenDev audio calls'}; p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('status updated')
