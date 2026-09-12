import copy, hashlib, json, struct
from pathlib import Path
from PIL import Image, ImageFilter
root=Path(__file__).resolve().parent.parent
# Replace small Poly Haven emblem with adjacent unbranded leather, feathered.
im=Image.open(root/'sources/binder_notebook_diff_1k.jpg').convert('RGB')
patch=im.crop((145,130,265,250));mask=Image.new('L',(120,120),0)
from PIL import ImageDraw
ImageDraw.Draw(mask).rectangle((5,5,115,115),fill=255);mask=mask.filter(ImageFilter.GaussianBlur(6))
im.paste(patch,(174,259),mask)
texture=root/'sources/binder-unbranded.jpg';im.save(texture,quality=94)
original=(root/'binder-notebook-1k.glb').read_bytes();jl=struct.unpack_from('<I',original,12)[0]
base=json.loads(original[20:20+jl]);binary=original[28+jl:]
records=[]
for filename,index,tint in [('diary.glb',0,[1,0.96,0.88,1]),('book.glb',1,[1,0.96,0.88,1])]:
 doc=copy.deepcopy(base);data=bytearray(binary)
 while len(data)%4:data.append(0)
 jpg=texture.read_bytes();offset=len(data);data.extend(jpg)
 view=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(jpg)})
 image=doc['textures'][1]['source'];doc['images'][image]={'bufferView':view,'mimeType':'image/jpeg'}
 node=doc['nodes'][index];mesh=doc['meshes'][node['mesh']]
 a=doc['accessors'][mesh['primitives'][0]['attributes']['POSITION']];lo=a['min'];hi=a['max']
 node['translation']=[-(lo[0]+hi[0])/2,-lo[1],-(lo[2]+hi[2])/2]
 doc['nodes']=[node];doc['scenes']=[{'nodes':[0]}];doc['scene']=0
 pbr=doc['materials'][0]['pbrMetallicRoughness'];pbr.pop('metallicRoughnessTexture',None)
 pbr.update(metallicFactor=0,roughnessFactor=.94,baseColorFactor=tint)
 doc['buffers']=[{'byteLength':len(data)}]
 while len(data)%4:data.append(0)
 text=json.dumps(doc,separators=(',',':')).encode();text+=b' '*((-len(text))%4)
 out=struct.pack('<III',0x46546c67,2,28+len(text)+len(data))+struct.pack('<II',len(text),0x4e4f534a)+text+struct.pack('<II',len(data),0x004e4942)+data
 (root/filename).write_bytes(out)
 records.append({'filename':'assets/models/'+filename,'source':'https://polyhaven.com/a/binder_notebook','author':'DaDrood','license':'CC0-1.0','licenseEvidence':'https://polyhaven.com/license','bytes':len(out),'sha256':hashlib.sha256(out).hexdigest(),'dimensionsXYZ':[hi[i]-lo[i] for i in range(3)],'orientation':'Y-up, flat XZ, minY=0, centered XZ; original source had no rotation','adaptation':'Selected '+node['name']+' from same source; matte nonmetal material, tinted; small emblem patched from adjacent leather; original retained','visualReview':'Diffuse texture inspected; no rendered model or game test performed'})
(root/'MODEL_SOURCES.json').write_text(json.dumps({'models':records},indent=2))
print(json.dumps(records,indent=2))


