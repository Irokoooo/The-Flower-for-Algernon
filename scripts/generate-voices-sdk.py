"""One authorized SDK diagnostic; continuation requires diagnostic success. No retries."""
import hashlib
import json
import os
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(tempfile.gettempdir()) / 'algernon-audio-sdk-clean'))
sys.path.insert(0, str(Path(tempfile.gettempdir()) / 'algernon-audio-sdk-deps'))
from openai import OpenAI, APIStatusError, DefaultHttpxClient

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/audio/production'


def main():
    plan = json.loads((ROOT / 'assets/audio/voice-jobs.json').read_text(encoding='utf-8-sig'))
    frozen = json.dumps([{k: j[k] for k in ('id', 'speaker', 'text')} for j in plan['jobs']], ensure_ascii=False, separators=(',', ':')).encode()
    assert hashlib.sha256(frozen).hexdigest() == plan['frozenDialogueSha256']
    env = {}
    for line in (ROOT / '.env.local').read_text(encoding='utf-8-sig').splitlines():
        match = re.match(r'^\s*([A-Z_]+)\s*=\s*(.*?)\s*$', line)
        if match: env[match[1]] = match[2].strip('\"\'')
    assert env['OPENAI_BASE_URL'].rstrip('/') in ['https://api.openai-next.com', 'https://api.openai-next.com/v1']
    key = env['OPENAI_API_KEY']
    def sanitize(value):
        text = str(value).replace(key, '[redacted]')
        text = re.sub(r'(?i)(sk-[\w-]+|bearer\s+\S+|https?://\S+|[\w.+-]+@[\w.-]+|\b\d{4,}\b|\b[a-f0-9]{16,}\b)', '[redacted]', text)
        text = re.sub(r'(?i)((?:user|account|token|request|channel)[_ -]?id\s*[:=]?\s*)\S+', r'\1[redacted]', text)
        return text[:500]
    ledger_path = OUT / 'sdk-ledger.json'
    # Exclusive ledger creation is also a persistent single-execution guard.
    ledger = {'reservedUSD': 0, 'attempts': [], 'diagnosticSucceeded': False}
    with ledger_path.open('x', encoding='utf-8') as file: json.dump(ledger, file)
    prior = json.loads((OUT / 'generation-ledger.json').read_text())['reservedUSD']
    def save(): ledger_path.write_text(json.dumps(ledger, indent=2), encoding='utf-8')
    shortest = min(plan['jobs'], key=lambda j: len(j['text']))
    jobs = [shortest] + [j for j in plan['jobs'] if j != shortest]
    with OpenAI(api_key=key, base_url='https://api.openai-next.com/v1', max_retries=0, timeout=60,
                http_client=DefaultHttpxClient(follow_redirects=False, timeout=60)) as client:
        for i, job in enumerate(jobs):
            target = OUT / (job['id'] + '.mp3')
            if target.exists():
                if i == 0: raise RuntimeError('Diagnostic already exists; stop')
                continue
            reserve = .01 if i == 0 else len(job['text']) * 70.5 / 1e6
            assert ledger['reservedUSD'] + prior + reserve <= 3
            record = {'id': job['id'], 'status': 'reserved', 'reservedUSD': reserve,
                      'voice': plan['speakers'][job['speaker']]['voice'], 'at': datetime.now(timezone.utc).isoformat()}
            ledger['attempts'].append(record); ledger['reservedUSD'] += reserve; save()
            try:
                response = client.audio.speech.create(model='tts-1-hd', voice=record['voice'], input=job['text'], response_format='mp3', speed=1)
                audio = response.content
                assert 128 < len(audio) < 20_000_000 and (audio[:3] == b'ID3' or audio[0] == 255 and audio[1] & 224 == 224)
                with target.open('xb') as file: file.write(audio)
                record.update(status='generated-awaiting-listening', bytes=len(audio), sha256=hashlib.sha256(audio).hexdigest())
                if i == 0: ledger['diagnosticSucceeded'] = True
                save(); print('Generated ' + job['id'], flush=True)
            except APIStatusError as error:
                body = error.body if isinstance(error.body, dict) else {}
                detail = body.get('error', body)
                if not isinstance(detail, dict): detail = {}
                record.update(status='failed-no-retry', httpStatus=error.status_code,
                              code=sanitize(detail.get('code', 'unavailable')), message=sanitize(detail.get('message', 'Non-JSON error body withheld')))
                save(); print(json.dumps(record, ensure_ascii=True), flush=True); return
            except Exception as error:
                record.update(status='failed-no-retry', errorType=type(error).__name__)
                save(); print(json.dumps(record), flush=True); return


if __name__ == '__main__':
    try: main()
    except Exception as error: print(json.dumps({'stopped': True, 'errorType': type(error).__name__})); sys.exit(1)
