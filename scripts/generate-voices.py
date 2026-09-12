"""Offline plan by default. Explicit --execute and priced allocation required for paid calls.
Credentials are read only here from ignored .env.local, never logged or bundled.
"""
import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1]
JOBS = ROOT / 'assets/audio/voice-jobs.json'


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None  # Never forward the Authorization header to another endpoint.


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--confirmed-usd-per-million', type=float)
    parser.add_argument('--allocation-usd', type=float, default=0)
    args = parser.parse_args()
    plan = json.loads(JOBS.read_text(encoding='utf-8-sig'))
    jobs = plan['jobs']
    # Freeze only spoken content; App layout edits do not invalidate approved dialogue.
    frozen = json.dumps([{k: j[k] for k in ('id', 'speaker', 'text')} for j in jobs],
                        ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    if hashlib.sha256(frozen).hexdigest() != plan.get('frozenDialogueSha256'):
        raise ValueError('Frozen dialogue changed; review plan before generation.')
    chars = sum(len(job['text']) for job in jobs)
    print(json.dumps({'jobs': len(jobs), 'characters': chars,
                      'referenceEstimateUSD': round(chars * 30 / 1_000_000, 6),
                      'mode': 'execute' if args.execute else 'offline-plan',
                      'providerRateVerified': plan['budget']['providerRateVerified']}))
    if not args.execute:
        return
    rate = args.confirmed_usd_per_million
    if rate is None or not 0 < rate <= 10000 or not 0 < args.allocation_usd <= 100:
        raise ValueError('Execution requires confirmed provider rate and a Lead-reserved allocation within the shared $100 budget.')
    if not plan['budget']['providerRateVerified'] or rate != plan['budget'].get('confirmedUSDPerMillionCharacters'):
        raise ValueError('Provider rate must match reviewed pricing evidence.')
    # Parse dotenv locally; do not echo values, responses, exceptions, or request headers.
    env = {}
    for line in (ROOT / '.env.local').read_text(encoding='utf-8-sig').splitlines():
        match = re.match(r'^\s*(?:export\s+)?([A-Z_][A-Z_0-9]*)\s*=\s*(.*?)\s*$', line)
        if match:
            env[match[1]] = match[2].strip().strip('\"\'')
    base = env.get('OPENAI_BASE_URL', '').rstrip('/')
    if base not in ('https://api.openai-next.com', 'https://api.openai-next.com/v1'):
        raise ValueError('Unexpected provider endpoint; review server configuration.')
    key = env.get('OPENAI_API_KEY')
    if not key:
        raise ValueError('Server API key unavailable.')
    endpoint = base.removesuffix('/v1') + '/v1/audio/speech'
    output = ROOT / 'assets/audio/production'
    output.mkdir(exist_ok=True)
    ledger_path = output / 'generation-ledger.json'
    # Exclusive lock prevents parallel tool instances spending the same allocation.
    lock = output / '.generation.lock'
    with lock.open('x'):
        pass
    try:
        ledger = json.loads(ledger_path.read_text()) if ledger_path.exists() else {'reservedUSD': 0, 'requests': {}}
        pending = [job for job in jobs if job['id'] not in ledger['requests']]
        if ledger['reservedUSD'] + sum(len(j['text']) * rate / 1e6 for j in pending) > args.allocation_usd:
            raise ValueError('Batch exceeds the allocated budget.')
        for job in pending:
            if not re.fullmatch(r'[a-z0-9.-]+', job['id']) or not 0 < len(job['text']) <= 4096:
                raise ValueError('Invalid job identifier or text length.')
            destination = output / (job['id'] + '.mp3')
            if destination.exists():
                raise ValueError('Existing untracked audio file; manual review required.')
            payload = {'model': 'tts-1-hd', 'voice': plan['speakers'][job['speaker']]['voice'],
                       'input': job['text'], 'response_format': 'mp3', 'speed': 1.0}
            # Reserve before transmission. Unknown/failed requests are never retried automatically.
            ledger['reservedUSD'] += len(job['text']) * rate / 1e6
            record = {'status': 'reserved', 'at': datetime.now(timezone.utc).isoformat(),
                      'textSha256': hashlib.sha256(job['text'].encode()).hexdigest(),
                      'voice': payload['voice'], 'model': payload['model']}
            ledger['requests'][job['id']] = record
            ledger_path.write_text(json.dumps(ledger, indent=2), encoding='utf-8')
            request = Request(endpoint, data=json.dumps(payload).encode(),
                              headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'})
            with build_opener(NoRedirect).open(request, timeout=120) as response:
                audio = response.read(20_000_001)
                if len(audio) > 20_000_000 or len(audio) < 128 or not (audio[:3] == b'ID3' or (audio[0] == 255 and audio[1] & 224 == 224)):
                    raise ValueError('Invalid MP3 response; paid request reserved for manual review.')
            destination.write_bytes(audio)
            record.update(status='generated-awaiting-listening', file=str(destination.relative_to(ROOT)),
                          sha256=hashlib.sha256(audio).hexdigest())
            ledger_path.write_text(json.dumps(ledger, indent=2), encoding='utf-8')
            print('Generated: ' + job['id'])
        print('Finished. Ledger reservations include uncertain requests; no automatic retries.')
    finally:
        lock.unlink(missing_ok=True)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Never print exceptions that might contain provider response data or secrets.
        print('Stopped safely. Check plan, source hashes, server configuration and local ledger; no automatic retry.', file=sys.stderr)
        print(json.dumps({'errorType': type(error).__name__, 'httpStatus': getattr(error, 'code', None)}), file=sys.stderr)
        if isinstance(error, HTTPError):
            body = error.read(16000).decode('utf-8', errors='replace').lower()
            markers = ['cloudflare', 'error code: 1010', 'error code: 1020', 'access denied',
                       'invalid api key', 'insufficient_quota', 'model_not_found', 'permission denied',
                       'just a moment', 'attention required', 'forbidden']
            # Fixed markers only: no arbitrary provider text or identifiers leave this script.
            print(json.dumps({'bodyMarkers': [m for m in markers if m in body],
                              'serverIsCloudflare': 'cloudflare' in error.headers.get('Server', '').lower()}), file=sys.stderr)
        sys.exit(1)
