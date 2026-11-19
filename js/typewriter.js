/**
 * 首屏打字机问候 v1（2026-11-19）
 * 标题逐字打出 → 副标题淡入。适配 #header-title h1 + #subtitle-wrap h2。
 * reduced-motion 直接显示（不逐字）。
 */
(function () {
  'use strict';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var h1 = document.querySelector('#header-title h1');
  var sub = document.querySelector('#subtitle-wrap');

  if (!h1 || !h1.textContent.trim()) return;

  var fullText = h1.textContent.trim();
  if (reduced) {
    if (sub) sub.style.opacity = '1';
    return;
  }

  // 隐藏原文，逐字写入
  h1.textContent = '';
  h1.style.minHeight = '1.2em'; // 防止逐字时高度跳动
  if (sub) {
    sub.style.opacity = '0';
    sub.style.transition = 'opacity 0.8s ease 0.3s';
  }

  var i = 0;
  var speed = 120; // ms/字

  function type() {
    if (i <= fullText.length) {
      h1.textContent = fullText.slice(0, i);
      i++;
      setTimeout(type, speed);
    } else {
      // 打完 → 副标题淡入
      if (sub) sub.style.opacity = '1';
    }
  }

  // 等页面渲染完再开始（不跟 loader 抢时间）
  setTimeout(type, 400);
})();
