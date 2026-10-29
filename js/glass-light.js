/* 液态玻璃交互 v2（2026-10-29）
 * ① 3D 朝向倾斜：玻璃卡片随鼠标位置轻微转动（perspective + rotateX/Y）
 * ② 光斑跟随：--gx/--gy 驱动 ::after 径向高光
 * ③ 珠光角度：--angle 驱动 ::before 棱镜描边方向
 * ④ 背景视差：两层壁纸随鼠标反向微移，整站"活"起来
 * 约束：仅桌面鼠标设备（pointer:fine + hover）+ 非 reduced-motion；
 *       document 事件委托，pjax/动态元素天然生效；
 *       倾斜加在外层容器，避开 AOS 在卡片本体上的 transform。
 */
(function () {
  'use strict';

  if (!window.matchMedia) return;
  if (!matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var CARD_SEL = '.post-wrap,.article-inner,.sidebar-wrap,.widget-wrap,.blog-comments-card,.tool-card,#header-nav';
  var MAX_TILT = 3.2;            // 最大倾斜角度(deg)，克制才高级
  var PARALLAX = 7;              // 背景视差最大位移(px)

  var currentCard = null;        // 当前悬停的玻璃卡
  var currentTilt = null;        // 实际应用 transform 的元素（外层容器或自身）
  var lastEvt = null;
  var raf = 0;

  /* 倾斜目标：优先外层容器（内层有 AOS transform，直接改会打架） */
  function tiltTarget(el) {
    if (el.id === 'header-nav') return null; // 导航只做光效，不倾斜
    if (el.matches('.post-wrap')) return el.parentElement || el;
    if (el.matches('.article-inner')) return el.closest('article') || el;
    if (el.matches('.widget-wrap')) return el.closest('.widget-wrapper') || el;
    if (el.matches('.sidebar-wrap')) return el.closest('.sidebar-wrapper') || el;
    return el; // 评论卡 / 工具箱卡片：自身无 AOS，直接倾斜
  }

  function resetTilt(el) {
    if (!el) return;
    el.style.transform = '';
    el.classList.remove('glass-tilting');
    el.classList.add('glass-tilt');
  }

  function apply() {
    raf = 0;
    var ev = lastEvt;
    if (!ev) return;

    /* ---- 背景视差（始终生效） ---- */
    var nx = (ev.x / window.innerWidth) - 0.5;   // -0.5 .. 0.5
    var ny = (ev.y / window.innerHeight) - 0.5;
    var layers = document.querySelectorAll('.elaina-bg-layer');
    for (var i = 0; i < layers.length; i++) {
      layers[i].style.transform = 'translate(' + (nx * -PARALLAX).toFixed(1) + 'px,' + (ny * -PARALLAX).toFixed(1) + 'px)';
    }

    /* ---- 卡片跟随 ---- */
    var card = ev.card;
    if (card !== currentCard) {
      resetTilt(currentTilt);
      currentCard = card;
      currentTilt = card ? tiltTarget(card) : null;
    }
    if (!card) return;

    var r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var px = (ev.x - r.left) / r.width;    // 0..1
    var py = (ev.y - r.top) / r.height;    // 0..1

    /* 光斑坐标 + 珠光角度 */
    card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
    card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    card.style.setProperty('--angle', (100 + py * 80).toFixed(0) + 'deg');

    /* 工具卡进阶跟随：彩光起点跟随鼠标方位 + 内容深度视差 */
    if (card.hasAttribute && card.hasAttribute('data-tc')) {
      var ang = Math.atan2(ev.y - (r.top + r.height / 2), ev.x - (r.left + r.width / 2)) * 180 / Math.PI + 90;
      card.style.setProperty('--tc-angle', ang.toFixed(0) + 'deg');
      card.style.setProperty('--px', (px - 0.5).toFixed(3));
      card.style.setProperty('--py', (py - 0.5).toFixed(3));
    }

    /* 3D 朝向 */
    if (currentTilt) {
      var ry = (px - 0.5) * 2 * MAX_TILT;
      var rx = (0.5 - py) * 2 * MAX_TILT;
      currentTilt.classList.add('glass-tilt', 'glass-tilting');
      currentTilt.style.transform =
        'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    }
  }

  document.addEventListener('mousemove', function (ev) {
    // 事件对象在 rAF 回调里访问不可靠，必须在监听器内同步快照
    var card = ev.target && ev.target.closest ? ev.target.closest(CARD_SEL) : null;
    lastEvt = { x: ev.clientX, y: ev.clientY, card: card };
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  /* 鼠标离开窗口：背景归位、卡片回正 */
  document.addEventListener('mouseleave', function () {
    document.querySelectorAll('.elaina-bg-layer').forEach(function (el) {
      el.style.transform = '';
    });
    resetTilt(currentTilt);
    currentCard = null;
    currentTilt = null;
  });
})();
