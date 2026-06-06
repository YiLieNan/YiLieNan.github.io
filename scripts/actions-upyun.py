#!/usr/bin/env python3
"""GitHub Actions 用的又拍云同步脚本（HTTP API + 缓存刷新）"""
import os, sys, hashlib, base64, json, time
from urllib.parse import quote
import urllib.request

BUCKET = 'yilienan-blog'
OPERATOR = 'yileina'
API_HOST = 'v0.api.upyun.com'
PASSWORD = os.environ.get('UPYUN_PASSWORD', '')

if not PASSWORD:
    print('UPYUN_PASSWORD not set')
    sys.exit(1)

AUTH = base64.b64encode(f'{OPERATOR}:{PASSWORD}'.encode()).decode()

def md5_file(path):
    h = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''): h.update(chunk)
    return h.hexdigest()

def upyun_request(method, path, data=None):
    url = f'http://{API_HOST}/{BUCKET}{quote(path)}'
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header('Authorization', f'Basic {AUTH}')
    if data is not None:
        req.add_header('Content-Length', str(len(data)))
    try:
        urllib.request.urlopen(req, timeout=60)
        return True
    except:
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
    except:
        pass

# 上传所有文件
uploaded = []
for root, dirs, files in os.walk('public'):
    for f in files:
        local = os.path.join(root, f)
        rel = os.path.relpath(local, 'public')
        remote = '/' + rel.replace(os.sep, '/')
        with open(local, 'rb') as fh:
            data = fh.read()
        if upyun_request('PUT', remote, data):
            uploaded.append(remote)
            sys.stdout.write('.'); sys.stdout.flush()

print(f'\n✅ {len(uploaded)} files uploaded')

# 刷新 CDN 缓存
purge_paths = ['/', '/index.html'] + uploaded[:48]
purge_cache(purge_paths)
print(f'🔄 Cache purged for {len(purge_paths)} paths')
