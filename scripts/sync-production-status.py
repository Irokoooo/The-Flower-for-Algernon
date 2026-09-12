"""Refresh factual production evidence without promoting human acceptance."""
import json
from pathlib import Path
from datetime import datetime, timezone

root = Path(__file__).resolve().parents[1]
def read(name):
    return json.loads((root / name).read_text(encoding='utf-8-sig'))
def save(name, value):
    (root / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

manifest = read('ASSET_MANIFEST.json')
entries = {a['id']: a for a in manifest['assets']}
for asset_id, filename, description, prompt in [
    ('art.researcher.cutout', 'researcher-cutout.png', '研究员：克制、专注；已接入实验室', 'researcher-v1.txt'),
    ('art.researcher.concerned', 'researcher-concerned-cutout.png', '研究员：担忧表情；近距离互动变体', None),
    ('art.baker.generated', 'baker-cutout.png', '面包师：结实轮廓、赭红衬衫、面粉围裙；已提供运行时素材', 'production-wave2.jsonl'),
    ('art.baker.welcoming', 'baker-welcoming-cutout.png', '面包师：友善表情与伸手示意', 'baker-welcoming.txt'),
    ('art.alice.encouraging', 'alice-encouraging-cutout.png', 'Alice：鼓励表情与邀请尝试的手势', 'alice-encouraging.txt'),
]:
    path = 'assets/characters/' + filename
    if not (root / path).exists():
        continue
    entries[asset_id] = {
        'id': asset_id, 'filename': path, 'kind': 'image', 'status': 'review',
        'description': description, 'source': 'OpenDev / gpt-image-2',
        'license': 'Generated asset; provider terms review pending',
        'adaptation': 'Border-connected white background extracted; original raster retained.',
        **({'prompt': 'assets/prompts/' + prompt} if prompt else {}),
    }
entries['art.researcher.generated.v1']['description'] = '用户认可的研究员画风原图；透明衍生图已接入3D实验室'
manifest['assets'] = list(entries.values())
save('ASSET_MANIFEST.json', manifest)

data = read('project-status.json')
proposal = read('docs/PRD_COVERAGE_PROPOSAL.json')
for item in data['coverage']:
    matches = [r for r in proposal['requirements'] if item['section'] in r.get('prdSections', [])]
    if matches:
        item['status'] = 'in_progress'
        item['evidence'] = '；'.join(' / '.join(r.get('evidence', [])) + '；待补：' + ' / '.join(r.get('gaps', [])) for r in matches)
data['milestone'] = '插画角色与第一人称3D切片整合；课堂推理接入；英语录音服务阻塞'
data['updatedAt'] = datetime.now(timezone.utc).isoformat()
data['production'] = {
    'budgetLimitUSD': 100, 'reservationUSD': read('assets/PRODUCTION_BUDGET.json')['reservedUSD'],
    'actualBilledUSD': None,
    'voice': '尚无正式MP3：speech POST曾返回403，单次SDK诊断超时；无自动批量重试。',
    'music': '20秒原创循环配乐已接入；待人工听感与混音验收。',
    'art': '研究员、Alice、面包师、查理双手及墙面地板已生成；表情与动作变体持续接入。',
}
save('project-status.json', data)
print('Updated manifest and PRD evidence; no human acceptance inferred.')
