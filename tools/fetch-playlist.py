"""
构建时获取网易云歌单数据，生成 JSON 文件供播放器使用
在 hexo generate 前运行: python3 scripts/fetch-playlist.py
"""
import urllib.request, json, os, sys

PLAYLIST_ID = '6759056661'
OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'source', 'js', 'playlist-data.js')

def fetch():
    url = f'https://music.163.com/api/v3/playlist/detail?id={PLAYLIST_ID}'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://music.163.com/',
    }
    req = urllib.request.Request(url, headers=headers)
    resp = urllib.request.urlopen(req, timeout=20)
    data = json.loads(resp.read())
    tracks = data['playlist']['tracks']

    songs = []
    for t in tracks:
        artist = t['ar'][0]['name'] if t.get('ar') and len(t['ar']) > 0 else '未知'
        pic = t.get('al', {}).get('picUrl', '')
        # 转换成 https
        if pic.startswith('http://'):
            pic = 'https://' + pic[7:]
        audio_url = f'https://music.163.com/song/media/outer/url?id={t["id"]}.mp3'

        songs.append({
            'name': t['name'],
            'artist': artist,
            'url': audio_url,
            'cover': pic,
        })

    return songs

if __name__ == '__main__':
    try:
        songs = fetch()
        with open(OUTPUT, 'w', encoding='utf-8') as f:
            f.write('window.__PLAYLIST_DATA__ = ')
            json.dump(songs, f, ensure_ascii=False)
            f.write(';\n')
        print(f'✅ 成功获取 {len(songs)} 首歌，写入 {OUTPUT}')
        # 打印前两首验证
        for s in songs[:2]:
            print(f'   {s["name"]} - {s["artist"]}')
    except Exception as e:
        print(f'❌ 获取歌单失败: {e}')
        with open(OUTPUT, 'w', encoding='utf-8') as f:
            f.write('window.__PLAYLIST_DATA__ = [];\n')
        print('⚠️ 写入空数据')
        sys.exit(1)
