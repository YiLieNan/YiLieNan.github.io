#!/usr/bin/env python3
"""
又拍云同步脚本
用法：cd blog && python3 scripts/sync-upyun.py
首次会传全部文件，之后只传变更的（自动跳过未改动的）
"""
from ftplib import FTP
import os, sys, hashlib, json, time

BUCKET = 'yilienan-blog'
OPERATOR = 'yileina'
PASSWORD = 'b4lxhf3VBkpqL3UmguyqkoFc2QpGqDE4'
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

    # 加载缓存
    cache = {}
    if os.path.exists(CACHE):
        with open(CACHE) as f: cache = json.load(f)

    # 扫描需要上传的文件
    to_upload = []
    for root, dirs, files in os.walk(PUBLIC):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in {'.mp3', '.mp4', '.avi', '.mov'}: continue
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

    # 连接 FTP
    ftp = FTP('v0.ftp.upyun.com')
    ftp.login(OPERATOR + '/' + BUCKET, PASSWORD)

    # 上传
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
