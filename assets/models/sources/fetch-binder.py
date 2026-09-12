"""Fetch CC0 Poly Haven 1k glTF sources; embed unchanged mesh/textures in GLB."""
import json, hashlib, struct, subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen
ROOT = Path(__file__).resolve().parent.parent
meta = json.loads((ROOT/'sources/binder-notebook-files.json').read_text(encoding='utf-8-sig'))['gltf']['1k']['gltf']
def fetch(info):
    cache=ROOT/'sources'/info['url'].split('/')[-1]
    if not cache.exists() or hashlib.md5(cache.read_bytes()).hexdigest()!=info['md5']:
        subprocess.run(['curl.exe','-sS','-L','--max-time','60',info['url'],'-o',str(cache)],check=True)
    data=cache.read_bytes()
    assert len(data) == info['size'] and hashlib.md5(data).hexdigest() == info['md5']
    return data
with ThreadPoolExecutor(max_workers=5) as pool:
    list(pool.map(fetch,[meta,*meta['include'].values()]))
doc = json.loads(fetch(meta))
binary = bytearray()
def append(data):
    while len(binary)%4: binary.append(0)
    start=len(binary);binary.extend(data);return start
assert len(doc['buffers'])==1
offset=append(fetch(meta['include'][doc['buffers'][0]['uri']]))
assert offset==0
for image in doc.get('images',[]):
    uri=image.pop('uri');data=fetch(meta['include'][uri]);offset=append(data)
    image['bufferView']=len(doc['bufferViews']);image['mimeType']='image/jpeg'
    doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(data)})
doc['buffers']=[{'byteLength':len(binary)}]
while len(binary)%4:binary.append(0)
j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4)
glb=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(binary))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(binary),0x004e4942)+binary
(ROOT/'binder-notebook-1k.glb').write_bytes(glb)
info={'filename':'assets/models/binder-notebook-1k.glb','bytes':len(glb),'sha256':hashlib.sha256(glb).hexdigest(),'source':'https://polyhaven.com/a/binder_notebook','author':'DaDrood','license':'CC0-1.0','adaptation':'Embedded original 1k glTF buffer and JPEGs into GLB; no geometry/material changes','nodes':doc.get('nodes'),'meshLocalPositionBounds':[{'min':a.get('min'),'max':a.get('max')} for a in doc['accessors'] if a.get('type')=='VEC3' and 'min' in a],'materials':doc.get('materials'),'visualReview':'Not performed'}
(ROOT/'sources/binder-inspection.json').write_text(json.dumps(info,indent=2),encoding='utf-8')
print(json.dumps({'file':info['filename'],'bytes':len(glb),'nodes':info['nodes'],'bounds':info['meshLocalPositionBounds']}))
