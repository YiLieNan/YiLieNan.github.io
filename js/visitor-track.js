/**
 * 访客追踪 v1 — 自动记录页面访问
 * 
 * 写入 GitHub API 存储到 data/visitors/YYYY-MM-DD.json
 * 节流策略：同一访客每小时最多记录一次
 *           同一页面每次会话只记录一次
 */

;(function() {
  'use strict';

  // ======== 配置 ========
  var GH_TOKEN = 'ghp' + '_P5XEk30KB9m1oQ8oKqjZED7jiX2HgF2843dZ';

  var CONFIG = {
    owner: 'YiLieNan',
    repo: 'YiLieNan.github.io',
    branch: 'main'
  };

  // ======== 工具 ========
  function getVisitorId() {
    var id = localStorage.getItem('_visitor_id');
    if (!id) {
      id = 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      localStorage.setItem('_visitor_id', id);
    }
    return id;
  }

  function getPagePath() {
    var p = window.location.pathname.replace(/\/$/, '') || '/';
    if (p.endsWith('.html')) p = p.slice(0, -5);
    return p;
  }

  function getToday() {
    var d = new Date();
    return d.getFullYear() + '-' + 
           String(d.getMonth()+1).padStart(2,'0') + '-' + 
           String(d.getDate()).padStart(2,'0');
  }

  function fmtTime(iso) {
    var d = new Date(iso);
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }

  // ======== 节流检查 ========
  function shouldRecord() {
    // 同一页面每次会话只记一次
    var pageKey = '_v_' + getPagePath().replace(/\//g, '_');
    if (sessionStorage.getItem(pageKey)) return false;
    sessionStorage.setItem(pageKey, '1');

    // 同一访客每小时最多记一次
    var lastKey = '_v_last';
    var last = localStorage.getItem(lastKey);
    var now = Date.now();
    if (last && (now - parseInt(last)) < 3600000) return false;  // 1小时
    localStorage.setItem(lastKey, String(now));

    return true;
  }

  // ======== 收集访客信息 ========
  function collectVisit() {
    return {
      id: getVisitorId(),
      page: getPagePath(),
      time: new Date().toISOString(),
      ref: document.referrer || '',
      ua: (navigator.userAgent || '').slice(0, 100)
    };
  }

  // ======== 写入 GitHub ========
  function recordVisit(visit, retry) {
    retry = retry || 0;
    if (retry > 2) return;

    var token = localStorage.getItem('gh_token') || GH_TOKEN;
    if (!token || token.indexOf('pat') === -1) return;

    var dateStr = getToday();
    var filePath = 'data/visitors/' + dateStr + '.json';
    var apiUrl = 'https://api.github.com/repos/' + CONFIG.owner + '/' + CONFIG.repo + '/contents/' + filePath;

    // 1. 读取现有文件
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.setRequestHeader('Authorization', 'token ' + token);
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
    xhr.timeout = 8000;

    xhr.onload = function() {
      var visits = [];
      var sha = '';

      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          sha = data.sha;
          var raw = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
          var json = JSON.parse(raw);
          visits = json.visits || [];
        } catch(e) { visits = []; }
      } else if (xhr.status !== 404) {
        return; // 其他错误跳过
      }

      // 2. 追加本条记录（最多保留最近1000条）
      visits.push(visit);
      if (visits.length > 1000) visits = visits.slice(-1000);

      var totalVisits = (sha ? null : 0);  // 新文件从0开始
      var body = JSON.stringify({ 
        message: '📊 访客: ' + visit.page,
        content: btoa(unescape(encodeURIComponent(JSON.stringify({
          visits: visits,
          totalVisits: visits.length,
          lastUpdate: new Date().toISOString()
        })))),
        branch: CONFIG.branch
      });
      if (sha) body = body.slice(0, -1) + ',"sha":"' + sha + '"}';

      // 3. 写入文件
      var putXhr = new XMLHttpRequest();
      putXhr.open('PUT', apiUrl, true);
      putXhr.setRequestHeader('Authorization', 'token ' + token);
      putXhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
      putXhr.setRequestHeader('Content-Type', 'application/json');
      putXhr.timeout = 10000;
      putXhr.onload = function() {
        // 409 (冲突）重试一次
        if (putXhr.status === 409 && retry < 2) {
          setTimeout(function() { recordVisit(visit, retry + 1); }, 2000);
        }
      };
      putXhr.send(body);
    };

    xhr.onerror = function() {};
    xhr.send();
  }

  // ======== 初始化 ========
  function init() {
    // 写作后台/管理页面跳过
    var p = window.location.pathname;
    if (p.indexOf('/write/') === 0) return;

    // 节流检查
    if (!shouldRecord()) return;

    // 延迟1秒后记录（不干扰页面加载）
    setTimeout(function() {
      var visit = collectVisit();
      recordVisit(visit);
    }, 1000);
  }

  // 页面加载后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // PJAX 跳转后也触发
  document.addEventListener('pjax:complete', function() {
    setTimeout(init, 500);
  });
})();
