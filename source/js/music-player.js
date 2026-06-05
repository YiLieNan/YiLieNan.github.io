/**
 * 可拖动音乐播放器 — 伊蕾娜风格
 * 从网易云歌单拉取，左上角浮动，随机播放
 */
(function() {
  'use strict';

  const PLAYLIST_ID = '6759056661';
  const METING_API = 'https://api.meting.ouorz.com/api?server=netease&type=playlist&id=' + PLAYLIST_ID;

  // 状态管理
  let songs = [];
  let shuffled = [];
  let currentIdx = 0;
  let isPlaying = false;
  let isMinimized = false;
  let isListOpen = false;

  const audio = new Audio();
  let widget, coverEl, nameEl, artistEl, playBtn, progressBar, progressWrap;
  let plContainer;

  // Fisher-Yates 洗牌
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 加载歌单
  async function fetchPlaylist() {
    try {
      const res = await fetch(METING_API);
      const data = await res.json();
      if (!data || !data.length) throw new Error('Empty playlist');
      songs = data.map(s => ({
        name: s.title || '未知歌曲',
        artist: s.author || '未知歌手',
        url: s.url,
        cover: s.cover || s.pic || '',
        lrc: s.lrc || ''
      }));
      // 去重
      const seen = new Set();
      songs = songs.filter(s => {
        if (seen.has(s.url)) return false;
        seen.add(s.url);
        return true;
      });
      if (!songs.length) throw new Error('No valid songs');
      shuffled = shuffle(songs);
      currentIdx = 0;
      widget.classList.remove('loading');
      loadSong(currentIdx);
    } catch (e) {
      console.warn('Music player: playlist fetch failed', e);
      widget.classList.remove('loading');
      nameEl.textContent = '🎵 歌单加载失败';
      artistEl.textContent = '刷新页面重试';
    }
  }

  // 加载某首歌曲
  function loadSong(idx) {
    if (!shuffled.length || idx < 0 || idx >= shuffled.length) return;
    const song = shuffled[idx];
    currentIdx = idx;
    nameEl.textContent = song.name;
    artistEl.textContent = song.artist;
    if (song.cover) coverEl.src = song.cover;
    audio.src = song.url;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => { isPlaying = false; updatePlayBtn(); });
    }
    updatePlaylistHighlight();
    // 时间更新
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextSong);
  }

  // 进度更新
  function updateProgress() {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = pct + '%';
    }
  }

  // 播放/暂停
  function togglePlay() {
    if (!shuffled.length) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    isPlaying = !isPlaying;
    updatePlayBtn();
  }
  function updatePlayBtn() {
    playBtn.textContent = isPlaying ? '⏸' : '▶';
  }

  function prevSong() {
    if (!shuffled.length) return;
    currentIdx = (currentIdx - 1 + shuffled.length) % shuffled.length;
    loadSong(currentIdx);
    if (!isPlaying) { isPlaying = true; updatePlayBtn(); }
  }

  function nextSong() {
    if (!shuffled.length) return;
    // 随机模式下，每次 next 再重新洗一次剩下的一首，或者就顺序在 shuffled 中前进
    // 简单处理：在 shuffled 中前进
    currentIdx = (currentIdx + 1) % shuffled.length;
    loadSong(currentIdx);
    if (!isPlaying) { isPlaying = true; updatePlayBtn(); }
  }

  // 跳转到进度
  function seek(e) {
    if (!audio.duration) return;
    const rect = progressWrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  }

  // 最小化/展开
  function toggleMinimize() {
    isMinimized = !isMinimized;
    widget.classList.toggle('minimized', isMinimized);
  }

  // 歌单列表展开/收起
  function toggleList() {
    isListOpen = !isListOpen;
    plContainer.classList.toggle('open', isListOpen);
  }

  // 高亮当前歌曲
  function updatePlaylistHighlight() {
    if (!plContainer) return;
    const items = plContainer.querySelectorAll('.ep-pl-item');
    items.forEach((item, i) => {
      item.classList.toggle('active', i === currentIdx);
      if (i === currentIdx) {
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  // 点击歌单中的歌曲
  function playFromList(idx) {
    currentIdx = idx;
    loadSong(idx);
    if (!isPlaying) { isPlaying = true; updatePlayBtn(); }
    audio.play().catch(() => {});
  }

  // ====== 拖拽逻辑 ======
  let isDragging = false;
  let dragStartX, dragStartY, startLeft, startTop;

  function onDragStart(e) {
    if (e.target.closest('.ep-ctrl') || e.target.closest('.ep-progress') || e.target.closest('.ep-playlist')) return;
    isDragging = true;
    const ev = e.touches ? e.touches[0] : e;
    dragStartX = ev.clientX;
    dragStartY = ev.clientY;
    startLeft = widget.offsetLeft;
    startTop = widget.offsetTop;
    widget.style.transition = 'none';
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const ev = e.touches ? e.touches[0] : e;
    const dx = ev.clientX - dragStartX;
    const dy = ev.clientY - dragStartY;
    widget.style.left = (startLeft + dx) + 'px';
    widget.style.top = (startTop + dy) + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
  }

  function onDragEnd() {
    if (isDragging) {
      isDragging = false;
      widget.style.transition = '';
    }
  }

  // ====== 创建 UI ======
  function createWidget() {
    widget = document.createElement('div');
    widget.className = 'elaina-player loading';
    widget.innerHTML = `
      <div class="ep-header">
        <img class="ep-cover" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='%23777' font-size='32'%3E🎵%3C/text%3E%3C/svg%3E" alt="cover">
        <div class="ep-info">
          <div class="ep-name">加载歌单中...</div>
          <div class="ep-artist">伊蕾娜小电台</div>
        </div>
        <div class="ep-ctrl">
          <button class="ep-prev-btn" title="上一首">⏮</button>
          <button class="ep-play-btn" title="播放/暂停">▶</button>
          <button class="ep-next-btn" title="下一首">⏭</button>
          <button class="ep-toggle-btn" title="最小化">─</button>
          <button class="ep-list-btn" title="歌单" style="font-size:14px;color:rgba(255,255,255,0.4);">☰</button>
        </div>
      </div>
      <div class="ep-progress"><div class="ep-progress-bar"></div></div>
      <div class="ep-playlist"></div>
    `;
    document.body.appendChild(widget);

    coverEl = widget.querySelector('.ep-cover');
    nameEl = widget.querySelector('.ep-name');
    artistEl = widget.querySelector('.ep-artist');
    playBtn = widget.querySelector('.ep-play-btn');
    progressWrap = widget.querySelector('.ep-progress');
    progressBar = widget.querySelector('.ep-progress-bar');
    plContainer = widget.querySelector('.ep-playlist');

    // 绑定事件
    playBtn.addEventListener('click', togglePlay);
    widget.querySelector('.ep-prev-btn').addEventListener('click', prevSong);
    widget.querySelector('.ep-next-btn').addEventListener('click', nextSong);
    widget.querySelector('.ep-toggle-btn').addEventListener('click', toggleMinimize);
    widget.querySelector('.ep-list-btn').addEventListener('click', toggleList);
    progressWrap.addEventListener('click', seek);

    // 拖拽
    widget.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    widget.addEventListener('touchstart', onDragStart, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: true });
    document.addEventListener('touchend', onDragEnd);

    // 键盘快捷键
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    });
  }

  // 构建歌单列表
  function buildPlaylist() {
    if (!plContainer || !shuffled.length) return;
    plContainer.innerHTML = '';
    shuffled.forEach((s, i) => {
      const item = document.createElement('div');
      item.className = 'ep-pl-item' + (i === currentIdx ? ' active' : '');
      item.innerHTML = `
        <span class="ep-pl-idx">${i + 1}</span>
        <span class="ep-pl-name">${s.name}</span>
        <span style="color:rgba(255,255,255,0.3);font-size:11px;flex-shrink:0;">${s.artist}</span>
      `;
      item.addEventListener('click', () => playFromList(i));
      plContainer.appendChild(item);
    });
    updatePlaylistHighlight();
  }

  // 初始化
  function init() {
    if (document.querySelector('.elaina-player')) return;
    createWidget();
    fetchPlaylist().then(() => {
      buildPlaylist();
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
