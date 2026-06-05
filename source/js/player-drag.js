/**
 * APlayer 浮动播放器 — 左上角 + 圆角 + 可拖动
 * 在 MetingJS 渲染完成后接管样式和拖拽
 */
(function() {
  'use strict';

  var container = null;     // .aplayer-fixed 容器
  var body = null;          // .aplayer-body 拖拽手柄
  var isDragging = false;
  var startX, startY, origX, origY;

  // ========== 初始定位和样式 ==========
  function applyStyle() {
    if (!container) return;
    container.style.top = '20px';
    container.style.left = '20px';
    container.style.bottom = 'auto';
    container.style.right = 'auto';
    container.style.zIndex = '99999';
    container.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)';

    var apBody = container.querySelector('.aplayer-body');
    if (apBody) {
      apBody.style.borderRadius = '16px';
      apBody.style.overflow = 'hidden';
      apBody.style.cursor = 'grab';
      apBody.style.userSelect = 'none';
    }

    var sw = container.querySelector('.aplayer-miniswitcher');
    if (sw) {
      sw.style.borderRadius = '10px';
      sw.style.overflow = 'hidden';
    }
  }

  // ========== 拖拽 ==========
  function onDown(e) {
    if (e.target.closest('.aplayer-info')) return;
    if (e.target.closest('.aplayer-miniswitcher')) return;
    e.preventDefault();
    var ev = e.touches ? e.touches[0] : e;
    isDragging = true;
    startX = ev.clientX;
    startY = ev.clientY;
    origX = container.offsetLeft;
    origY = container.offsetTop;
    container.style.transition = 'none';
    if (body) body.style.cursor = 'grabbing';
    var sw = container.querySelector('.aplayer-miniswitcher');
    if (sw) sw.style.pointerEvents = 'none';
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    var ev = e.touches ? e.touches[0] : e;
    container.style.left = (origX + ev.clientX - startX) + 'px';
    container.style.top = (origY + ev.clientY - startY) + 'px';
  }

  function onUp() {
    if (!isDragging) return;
    isDragging = false;
    container.style.transition = '';
    if (body) body.style.cursor = 'grab';
    var sw = container.querySelector('.aplayer-miniswitcher');
    if (sw) sw.style.pointerEvents = '';
  }

  // ========== 挂载事件 ==========
  function bindDrag() {
    if (!body) return;
    body.addEventListener('mousedown', onDown);
    body.addEventListener('touchstart', onDown, { passive: false });
    // document 级别保证拖出元素也能捕捉
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  }

  // ========== 等待 APlayer 渲染 ==========
  function waitForPlayer() {
    container = document.getElementById('aplayer') || document.querySelector('.aplayer-fixed');
    if (!container || !container.querySelector('.aplayer-body') || !container.querySelector('.aplayer-info')) {
      return setTimeout(waitForPlayer, 200);
    }
    body = container.querySelector('.aplayer-body');
    applyStyle();
    bindDrag();
  }

  // Pjax 导航后重新绑定
  document.addEventListener('pjax:complete', function() {
    setTimeout(waitForPlayer, 300);
  });

  // 启动
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    waitForPlayer();
  } else {
    document.addEventListener('DOMContentLoaded', waitForPlayer);
  }
})();
