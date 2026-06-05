/**
 * 独立音乐播放器 — 左上角浮动 + 圆角 + 可拖动
 * 自行拉取 Meting API，不依赖主题内置播放器
 */
(function() {
  'use strict';

  var PID = '6759056661';
  var API = 'https://api.meting.ouorz.com/api?server=netease&type=playlist&id=' + PID;

  var w, header, cover, title, artist, playBtn, prevBtn, nextBtn, toggleBtn, listBtn;
  var progressBar, progressWrap, plContainer;
  var audio = new Audio();
  var songs = [], shuffled = [], cur = 0, playing = false, minimized = false, listOpen = false;

  // 洗牌
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // 创建 UI
  function create() {
    w = document.createElement('div');
    w.id = 'hm-player';
    w.innerHTML =
      '<div class="hm-hdr">' +
        '<img class="hm-cvr" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect fill=\'%23333\' width=\'100\' height=\'100\'/%3E%3Ctext x=\'50\' y=\'58\' text-anchor=\'middle\' fill=\'%23777\' font-size=\'32\'%3E🎵%3C/text%3E%3C/svg%3E">' +
        '<div class="hm-inf"><div class="hm-t">加载歌单...</div><div class="hm-a">伊蕾娜小电台</div></div>' +
        '<div class="hm-ct"><button class="hm-pr">⏮</button><button class="hm-pl">▶</button><button class="hm-nx">⏭</button><button class="hm-tg">─</button><button class="hm-lb">☰</button></div>' +
      '</div>' +
      '<div class="hm-prg"><div class="hm-prg-b"></div></div>' +
      '<div class="hm-plst"></div>';
    document.body.appendChild(w);

    cover  = w.querySelector('.hm-cvr');
    title  = w.querySelector('.hm-t');
    artist = w.querySelector('.hm-a');
    playBtn = w.querySelector('.hm-pl');
    prevBtn = w.querySelector('.hm-pr');
    nextBtn = w.querySelector('.hm-nx');
    toggleBtn = w.querySelector('.hm-tg');
    listBtn = w.querySelector('.hm-lb');
    progressWrap = w.querySelector('.hm-prg');
    progressBar  = w.querySelector('.hm-prg-b');
    plContainer = w.querySelector('.hm-plst');
  }

  // 播放
  function load(i) {
    if (!shuffled.length || i < 0 || i >= shuffled.length) return;
    cur = i; var s = shuffled[i];
    title.textContent = s.name;
    artist.textContent = s.artist;
    if (s.cover) cover.src = s.cover;
    audio.src = s.url;
    audio.load();
    if (playing) audio.play().catch(function(){ playing = false; playBtn.textContent = '▶'; });
    hlPlst();
    audio.ontimeupdate = function() { if (audio.duration) progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%'; };
    audio.onended = next;
  }

  function togglePlay() {
    if (!shuffled.length) return;
    if (playing) { audio.pause(); playing = false; } else { audio.play().catch(function(){}); playing = true; }
    playBtn.textContent = playing ? '⏸' : '▶';
  }

  function prev() { if (shuffled.length) load((cur - 1 + shuffled.length) % shuffled.length); if (!playing) { playing = true; playBtn.textContent = '⏸'; } }
  function next() { if (shuffled.length) load((cur + 1) % shuffled.length); if (!playing) { playing = true; playBtn.textContent = '⏸'; } }

  function seek(e) {
    if (!audio.duration) return;
    var r = progressWrap.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * audio.duration;
  }

  function toggleMin() { minimized = !minimized; w.classList.toggle('hm-min', minimized); }
  function toggleLst() { listOpen = !listOpen; plContainer.classList.toggle('hm-open', listOpen); }

  function hlPlst() {
    var items = plContainer.querySelectorAll('.hm-it');
    for (var i = 0; i < items.length; i++) { items[i].classList.toggle('hm-act', i === cur); if (i === cur) items[i].scrollIntoView({ block: 'nearest' }); }
  }

  function playFrom(i) { cur = i; load(i); if (!playing) { playing = true; playBtn.textContent = '⏸'; } audio.play().catch(function(){}); }

  // 拉取歌单
  function fetchPl() {
    var x = new XMLHttpRequest();
    x.open('GET', API, true);
    x.onload = function() {
      try {
        var data = JSON.parse(x.responseText);
        if (!data || !data.length) throw 'empty';
        songs = [];
        for (var i = 0; i < data.length; i++) {
          var s = data[i];
          songs.push({ name: s.title || '未知', artist: s.author || '未知', url: s.url, cover: s.cover || s.pic || '' });
        }
        // 去重
        var seen = {}, deduped = [];
        for (var j = 0; j < songs.length; j++) { if (!seen[songs[j].url]) { seen[songs[j].url] = true; deduped.push(songs[j]); } }
        songs = deduped;
        shuffled = shuffle(songs.slice());
        w.classList.remove('hm-load');
        buildLst();
        load(0);
      } catch(e) {
        w.classList.remove('hm-load');
        title.textContent = '🎵 加载失败';
        artist.textContent = '刷新重试';
      }
    };
    x.onerror = function() {
      w.classList.remove('hm-load');
      title.textContent = '🎵 网络错误';
      artist.textContent = '检查网络后刷新';
    };
    x.send();
  }

  function buildLst() {
    if (!plContainer) return;
    plContainer.innerHTML = '';
    for (var i = 0; i < shuffled.length; i++) {
      var d = document.createElement('div');
      d.className = 'hm-it' + (i === cur ? ' hm-act' : '');
      d.innerHTML = '<span class="hm-idx">' + (i+1) + '</span><span class="hm-sn">' + shuffled[i].name + '</span><span class="hm-sa">' + shuffled[i].artist + '</span>';
      d._idx = i;
      d.onclick = function() { playFrom(this._idx); };
      plContainer.appendChild(d);
    }
    hlPlst();
  }

  // 拖拽
  var dx = false, sx, sy, ox, oy;
  function ds(e) { if (e.target.closest('.hm-ct') || e.target.closest('.hm-prg') || e.target.closest('.hm-plst')) return; e.preventDefault(); var ev = e.touches ? e.touches[0] : e; dx = true; sx = ev.clientX; sy = ev.clientY; var r = w.getBoundingClientRect(); ox = r.left; oy = r.top; w.style.transition = 'none'; }
  function dm(e) { if (!dx) return; e.preventDefault(); var ev = e.touches ? e.touches[0] : e; w.style.left = (ox + ev.clientX - sx) + 'px'; w.style.top = (oy + ev.clientY - sy) + 'px'; }
  function de() { if (dx) { dx = false; w.style.transition = ''; } }

  // 样式注入
  function injectCSS() {
    var style = document.createElement('style');
    style.textContent =
      '#hm-player{position:fixed;top:20px;left:20px;z-index:99999;width:340px;background:rgba(30,30,40,0.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:16px;border:1px solid rgba(255,255,255,0.12);box-shadow:0 8px 32px rgba(0,0,0,0.35);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#fff;user-select:none;overflow:hidden;cursor:grab}' +
      '#hm-player:active{cursor:grabbing}' +
      '#hm-player.hm-min{width:auto}' +
      '.hm-hdr{display:flex;align-items:center;padding:10px 14px;gap:10px;cursor:grab;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.06)}' +
      '.hm-hdr:active{cursor:grabbing}' +
      '.hm-cvr{width:38px;height:38px;border-radius:8px;object-fit:cover;flex-shrink:0}' +
      '.hm-inf{flex:1;min-width:0;line-height:1.3}' +
      '.hm-t{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.hm-a{font-size:11px;color:rgba(255,255,255,0.55);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.hm-ct{display:flex;align-items:center;gap:2px;flex-shrink:0}' +
      '.hm-ct button{background:none;border:none;color:rgba(255,255,255,0.75);font-size:15px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:6px;transition:background 0.2s;padding:0;line-height:1}' +
      '.hm-ct button:hover{background:rgba(255,255,255,0.12);color:#fff}' +
      '.hm-ct .hm-pl{font-size:17px;width:32px;height:32px;background:rgba(180,130,255,0.2);color:#c8a8ff}' +
      '.hm-ct .hm-pl:hover{background:rgba(180,130,255,0.35)}' +
      '.hm-ct .hm-tg{font-size:13px;color:rgba(255,255,255,0.4)}' +
      '.hm-ct .hm-lb{font-size:13px;color:rgba(255,255,255,0.4)}' +
      '.hm-prg{height:3px;background:rgba(255,255,255,0.1);cursor:pointer}' +
      '.hm-prg-b{height:100%;width:0%;background:linear-gradient(90deg,#b482ff,#e0b0ff);border-radius:2px;transition:width 0.3s linear}' +
      '.hm-prg:hover{height:5px}' +
      '#hm-player.hm-min .hm-hdr{border-bottom:none;padding:8px 12px}' +
      '#hm-player.hm-min .hm-cvr,#hm-player.hm-min .hm-inf,#hm-player.hm-min .hm-prg,#hm-player.hm-min .hm-pr,#hm-player.hm-min .hm-nx{display:none}' +
      '.hm-plst{display:none;max-height:200px;overflow-y:auto;background:rgba(0,0,0,0.2);border-top:1px solid rgba(255,255,255,0.06)}' +
      '.hm-plst.hm-open{display:block}' +
      '.hm-plst::-webkit-scrollbar{width:4px}' +
      '.hm-plst::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:2px}' +
      '.hm-it{display:flex;align-items:center;padding:7px 14px;gap:10px;cursor:pointer;transition:background 0.15s;font-size:12px}' +
      '.hm-it:hover{background:rgba(255,255,255,0.06)}' +
      '.hm-it.hm-act{background:rgba(180,130,255,0.15);color:#c8a8ff}' +
      '.hm-idx{color:rgba(255,255,255,0.3);width:20px;text-align:right;flex-shrink:0;font-size:11px}' +
      '.hm-sn{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.hm-sa{color:rgba(255,255,255,0.3);font-size:11px;flex-shrink:0}';
    document.head.appendChild(style);
  }

  // 绑定事件
  function bind() {
    playBtn.onclick = togglePlay;
    prevBtn.onclick = prev;
    nextBtn.onclick = next;
    toggleBtn.onclick = toggleMin;
    listBtn.onclick = toggleLst;
    progressWrap.onclick = seek;
    w.addEventListener('mousedown', ds);
    document.addEventListener('mousemove', dm);
    document.addEventListener('mouseup', de);
    w.addEventListener('touchstart', ds, { passive: false });
    document.addEventListener('touchmove', dm, { passive: false });
    document.addEventListener('touchend', de);
    document.addEventListener('keydown', function(e) { if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; if (e.code === 'Space') { e.preventDefault(); togglePlay(); } });
  }

  // 初始化
  function init() {
    if (document.getElementById('hm-player')) return;
    injectCSS();
    create();
    bind();
    fetchPl();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') { init(); }
  else { document.addEventListener('DOMContentLoaded', init); }
})();
