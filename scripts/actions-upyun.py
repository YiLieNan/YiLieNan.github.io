#!/usr/bin/env python3
"""GitHub Actions 用的又拍云同步脚本，密码从环境变量读取"""
from ftplib import FTP
import os, sys

BUCKET = 'yilienan-blog'
OPERATOR = 'yileina'
PASSWORD = os.environ.get('UPYUN_PASSWORD', '')

if not PASSWORD:
    print('UPYUN_PASSWORD not set')
    sys.exit(1)

ftp = FTP('v0.ftp.upyun.com')
ftp.login(f'{OPERATOR}/{BUCKET}', PASSWORD)

for root, dirs, files in os.walk('public'):
    for f in files:
        local = os.path.join(root, f)
        rel = os.path.relpath(local, 'public')
        remote = '/' + rel.replace(os.sep, '/')
        d = os.path.dirname(remote)
        if d and d != '/':
            ftp.cwd('/')
            for part in d.strip('/').split('/'):
                p = '/' + part
                try: ftp.cwd(p)
                except: ftp.mkd(p)
        ftp.cwd('/')
        with open(local, 'rb') as fh:
            ftp.storbinary('STOR ' + remote, fh)
        sys.stdout.write('.'); sys.stdout.flush()

ftp.quit()
print('\n✅ Upyun sync complete')
