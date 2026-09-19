import json
from pathlib import Path
p=Path('ASSET_MANIFEST.json'); m=json.loads(p.read_text(encoding='utf-8'))
for a in m['assets']:
 if a.get('kind')=='voice' and isinstance(a.get('provenance'),dict):
  lic=a['provenance'].get('license')
  if isinstance(lic,dict) and 'reviewed' not in lic: lic['reviewed']=False
p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('voice metadata fixed')
