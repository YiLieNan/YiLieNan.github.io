#!/usr/bin/env python3
"""
又拍云同步脚本
用法：cd blog && python3 scripts/sync-upyun.py

密码从环境变量 UPYUN_PASSWORD 读取，或从 .env 文件读取。
"""
from ftplib import FTP
import os, sys, hashlib, json, time

BUCKET = 'yilienan-blog'
OPERATOR = 'yileina'

# 优先从环境变量读，否则从 .env 文件读
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

    ftp = FTP('v0.ftp.upyun.com')
    ftp.login(OPERATOR + '/' + BUCKET, PASSWORD)

    dirs_made = set()
    for i, (local, rel, m) in enumerate(to_upload):
        remote = '/' + rel.replace(os.sep, '/')
        d = os.path.dirname(remote)
        if d and d not in dirs_made:
            ftp.cwd('/')
            for part in d.strip('/').split('/'):
                p = '/' + part
                try: ftp.cwd(p)
                except: ftp.mkd(p)
            dirs_made.add(d)
        ftp.cwd('/')
        with open(local, 'rb') as fh:
            ftp.storbinary('STOR ' + remote, fh)
        cache[rel] = m
        if (i+1) % 20 == 0:
            print(f'  {i+1}/{len(to_upload)}')
            sys.stdout.flush()

    ftp.quit()
    with open(CACHE, 'w') as f: json.dump(cache, f)
    print(f'✅ 完成！上传 {len(to_upload)} 个文件')

if __name__ == '__main__':
    t0 = time.time()
    main()
    print(f'⏱ 耗时 {time.time()-t0:.0f} 秒')
