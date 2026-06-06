#!/usr/bin/env python3
"""GitHub Actions 用的又拍云同步脚本（HTTP API 版），密码从环境变量读取"""
import os, sys, hashlib, base64
from urllib.parse import quote
import urllib.request

BUCKET = 'yilienan-blog'
OPERATOR = 'yileina'
API_HOST = 'v0.api.upyun.com'
PASSWORD = os.environ.get('UPYUN_PASSWORD', '')

if not PASSWORD:
    print('UPYUN_PASSWORD not set')
    sys.exit(1)

def upyun_put(remote_path, local_path):
    url = f'http://{API_HOST}/{BUCKET}{quote(remote_path)}'
    auth = base64.b64encode(f'{OPERATOR}:{PASSWORD}'.encode()).decode()
    with open(local_path, 'rb') as f:
        data = f.read()
    req = urllib.request.Request(url, data=data, method='PUT')
    req.add_header('Authorization', f'Basic {auth}')
    req.add_header('Content-Length', str(len(data)))
    try:
        urllib.request.urlopen(req, timeout=30)
        return True
    except urllib.error.HTTPError as e:
        print(f'\n❌ {remote_path}: HTTP {e.code}')
        return False

for root, dirs, files in os.walk('public'):
    for f in files:
        local = os.path.join(root, f)
        rel = os.path.relpath(local, 'public')
        remote = '/' + rel.replace(os.sep, '/')
        if upyun_put(remote, local):
            sys.stdout.write('.'); sys.stdout.flush()

print('\n✅ Upyun sync complete')
