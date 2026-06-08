#!/usr/bin/env python3
"""GitHub Actions 用的又拍云同步脚本（HTTP API + 缓存刷新）"""
import os, sys, hashlib, base64, json, time
import urllib.request
from urllib.parse import quote

BUCKET = 'yilienan-blog'
OPERATOR = 'yileina'
API_HOST = 'v0.api.upyun.com'
PASSWORD = os.environ.get('UPYUN_PASSWORD', '')

# 安全限制：防止卡死
PER_FILE_TIMEOUT = 15   # 每个文件最多等 15 秒
TOTAL_TIME_LIMIT = 120  # 整个上传阶段最多 120 秒

if not PASSWORD:
    print('UPYUN_PASSWORD not set')
    sys.exit(1)

AUTH = base64.b64encode(f'{OPERATOR}:{PASSWORD}'.encode()).decode()

def upyun_request(method, path, data=None):
    url = f'http://{API_HOST}/{BUCKET}{quote(path)}'
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header('Authorization', f'Basic {AUTH}')
    if data is not None:
        req.add_header('Content-Length', str(len(data)))
    try:
        urllib.request.urlopen(req, timeout=PER_FILE_TIMEOUT)
        return True
    except Exception as e:
        print(f'  ⚠ {path}: {e}')
        return False

def purge_cache(paths):
    if not paths:
        return
    data = json.dumps({'purge': paths[:50]}).encode()
    url = f'http://{API_HOST}/purge/'
    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f'Basic {AUTH}')
    try:
        urllib.request.urlopen(req, timeout=30)
    except Exception as e:
        print(f'  ⚠ Purge failed: {e}')

# 上传所有文件（带总时间保护）
uploaded = []
start_time = time.monotonic()
total_files = sum(len(files) for _, _, files in os.walk('public'))

print(f'📤 Uploading {total_files} files to Upyun...')
time_limit_hit = False
for root, dirs, files in os.walk('public'):
    if time_limit_hit:
        break
    for f in files:
        if time.monotonic() - start_time >= TOTAL_TIME_LIMIT:
            print(f'\n⏰ Time limit ({TOTAL_TIME_LIMIT}s) reached, skipping remaining files')
            time_limit_hit = True
            break
        local = os.path.join(root, f)
        rel = os.path.relpath(local, 'public')
        remote = '/' + rel.replace(os.sep, '/')
        with open(local, 'rb') as fh:
            data = fh.read()
        if upyun_request('PUT', remote, data):
            uploaded.append(remote)
        sys.stdout.write('.'); sys.stdout.flush()

elapsed = time.monotonic() - start_time
print(f'\n✅ {len(uploaded)} / {total_files} files uploaded ({elapsed:.0f}s)')

# 刷新 CDN 缓存
purge_paths = ['/', '/index.html'] + uploaded[:48]
purge_cache(purge_paths)
print(f'🔄 Cache purged for {len(purge_paths)} paths')
