#!/usr/bin/env python3
"""
又拍云同步脚本（HTTP API 版）
用法：cd blog && python3 scripts/sync-upyun.py
密码从环境变量 UPYUN_PASSWORD 读取，或从 .env 文件读取。
"""
import os, sys, hashlib, json, time, base64
from urllib.parse import quote
import urllib.request

BUCKET = 'yilienan-blog'
OPERATOR = 'yileina'
API_HOST = 'v0.api.upyun.com'

PASSWORD = os.environ.get('UPYUN_PASSWORD')
if not PASSWORD:
    env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    if os.path.exists(env_file):
        for line in open(env_file):
            if line.startswith('UPYUN_PASSWORD='):
                PASSWORD = line.strip().split('=', 1)[1]
                break

if not PASSWORD:
    print('❌ 请设置环境变量 UPYUN_PASSWORD')
    sys.exit(1)

PUBLIC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.upyun-cache.json')

def md5(path):
    h = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''): h.update(chunk)
    return h.hexdigest()

def upyun_put(remote_path, local_path):
    """用 HTTP PUT 上传文件到又拍云"""
    url = f'http://{API_HOST}/{BUCKET}{quote(remote_path)}'
    auth = base64.b64encode(f'{OPERATOR}:{PASSWORD}'.encode()).decode()
    
    with open(local_path, 'rb') as f:
        data = f.read()
    
    req = urllib.request.Request(url, data=data, method='PUT')
    req.add_header('Authorization', f'Basic {auth}')
    req.add_header('Content-Length', str(len(data)))
    
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return True
    except urllib.error.HTTPError as e:
        print(f'\n❌ 上传失败 {remote_path}: HTTP {e.code} {e.read()[:100]}')
        return False

def main():
    if not os.path.exists(PUBLIC):
        print('❌ public/ 不存在，先运行 npx hexo generate')
        sys.exit(1)

    cache = {}
    if os.path.exists(CACHE):
        with open(CACHE) as f: cache = json.load(f)

    to_upload = []
    for root, dirs, files in os.walk(PUBLIC):
        for f in files:
            local = os.path.join(root, f)
            rel = os.path.relpath(local, PUBLIC)
            m = md5(local)
            if cache.get(rel) == m: continue
            to_upload.append((local, rel, m))

    if not to_upload:
        print('✅ 无变更，跳过')
        return

    print(f'📤 需上传 {len(to_upload)} 个文件...')
    sys.stdout.flush()

    success = 0
    for i, (local, rel, m) in enumerate(to_upload):
        remote = '/' + rel.replace(os.sep, '/')
        if upyun_put(remote, local):
            cache[rel] = m
            success += 1
        if (i+1) % 20 == 0:
            print(f'  {i+1}/{len(to_upload)} ({success} 成功)')
            sys.stdout.flush()

    with open(CACHE, 'w') as f: json.dump(cache, f)
    print(f'✅ 完成！上传 {success}/{len(to_upload)} 个文件')

if __name__ == '__main__':
    t0 = time.time()
    main()
    print(f'⏱ 耗时 {time.time()-t0:.0f} 秒')
