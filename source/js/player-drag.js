/**
 * APlayer 拖拽 — 让固定播放器可自由拖动
 */
(function() {
  'use strict';

  let player = null;        // APlayer 实例
  let body = null;          // .aplayer-body 元素
  let isDragging = false;
  let startX, startY, origX, origY;

  // ========== 拖拽逻辑 ==========
  function onDown(e) {
    // 点在按钮/控制条上不拖拽
    if (e.target.closest('.aplayer-info') || e.target.closest('.aplayer-miniswitcher')) return;
    e.preventDefault();
    const ev = e.touches ? e.touches[0] : e;
    isDragging = true;
    startX = ev.clientX;
    startY = ev.clientY;
    const rect = player.container.getBoundingClientRect();
    origX = rect.left;
    origY = rect.top;
    player.container.style.transition = 'none';
    player.container.style.cursor = 'grabbing';
    // 禁用 APlayer 内部迷你切换器的点击，防止误触
    const sw = player.container.querySelector('.aplayer-miniswitcher');
    if (sw) sw.style.pointerEvents = 'none';
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const ev = e.touches ? e.touches[0] : e;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    player.container.style.left = (origX + dx) + 'px';
    player.container.style.top = (origY + dy) + 'px';
  }

  function onUp() {
    if (!isDragging) return;
    isDragging = false;
    player.container.style.transition = '';
    player.container.style.cursor = '';
    const sw = player.container.querySelector('.aplayer-miniswitcher');
    if (sw) sw.style.pointerEvents = '';
  }

  // ========== 等待 APlayer 初始化完成 ==========
  function tryBind() {
    // 等 meting-js 渲染完成
    const container = document.getElementById('aplayer') || document.querySelector('.aplayer-fixed');
    if (!container || !container.querySelector('.aplayer-body')) {
      return setTimeout(tryBind, 300);
    }
    player = { container };
    body = container.querySelector('.aplayer-body');

    // 挂载事件
    body.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    body.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  }

  // 启动
  if (document.readyState === 'complete') {
    tryBind();
  } else {
    window.addEventListener('load', tryBind);
  }
})();
