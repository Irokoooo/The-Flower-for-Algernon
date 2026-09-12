"""Read-only provider check; emits allowlisted billing fields only, never credentials."""
import json
import re
from pathlib import Path
from urllib.request import Request, build_opener
from urllib.error import HTTPError
from importlib.machinery import SourceFileLoader

root = Path(__file__).resolve().parents[1]
module = SourceFileLoader('voice_tool', str(root / 'scripts/generate-voices.py')).load_module()
env = {}
for line in (root / '.env.local').read_text(encoding='utf-8-sig').splitlines():
    m = re.match(r'^\s*([A-Z_]+)\s*=\s*(.*?)\s*$', line)
    if m:
        env[m[1]] = m[2].strip('\"\'')
for path in ['/v1/models']:
    try:
        req = Request('https://api.openai-next.com' + path, headers={'Authorization': 'Bearer ' + env['OPENAI_API_KEY'], 'User-Agent': 'ALGERNON-Audio-Diagnostics/1.0', 'Accept': 'application/json'})
        with build_opener(module.NoRedirect).open(req, timeout=25) as response:
            data = json.load(response)
        # Field names and group/budget scalars only; no names, tokens, or raw response.
        detail = data.get('data', [])
        print(json.dumps({'endpoint': path, 'status': 200,
                          'tts1hdListed': any(item.get('id') == 'tts-1-hd' for item in detail)}))
    except HTTPError as error:
        body = error.read(16000).decode('utf-8', errors='replace')
        # Only fixed diagnostic phrases can be emitted. Never output arbitrary body content.
        phrases = ['cloudflare', 'error code: 1010', 'error code: 1020', 'access denied',
                   'invalid api key', 'insufficient_quota', 'model_not_found', 'permission denied',
                   'just a moment', 'attention required', 'forbidden']
        print(json.dumps({'endpoint': path, 'httpStatus': error.code,
                          'bodyMarkers': [p for p in phrases if p in body.lower()],
                          'format': 'html' if '<html' in body.lower() else 'other',
                          'serverIsCloudflare': 'cloudflare' in error.headers.get('Server', '').lower()}))
    except Exception:
        print(json.dumps({'endpoint': path, 'status': 'unavailable'}))
