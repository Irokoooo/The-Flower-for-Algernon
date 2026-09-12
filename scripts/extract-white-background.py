"""Extract border-connected near-white background from generated raster cutouts."""
from collections import deque
from pathlib import Path
import sys
from PIL import Image

source, destination = map(Path, sys.argv[1:3])
im = Image.open(source).convert('RGBA')
w, h = im.size
px = im.load()
seen = bytearray(w*h)
queue = deque()
def visit(x, y):
    i=y*w+x
    if seen[i]: return
    seen[i]=1
    r,g,b,a=px[x,y]
    if min(r,g,b)>226 and max(r,g,b)-min(r,g,b)<24:
        px[x,y]=(r,g,b,0)
        queue.append((x,y))
for x in range(w): visit(x,0); visit(x,h-1)
for y in range(h): visit(0,y); visit(w-1,y)
while queue:
    x,y=queue.popleft()
    if x: visit(x-1,y)
    if x+1<w: visit(x+1,y)
    if y: visit(x,y-1)
    if y+1<h: visit(x,y+1)
destination.parent.mkdir(parents=True,exist_ok=True)
im.save(destination)
print(f'Saved {destination}; original retained.')
