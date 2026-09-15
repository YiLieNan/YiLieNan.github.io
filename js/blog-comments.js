/**
 * 匿名评论系统 v2 — 底部白框风格
 * 
 * 读取：先从当前站点加载评论JSON，失败则从 GitHub raw 加载
 * 写入：通过 GitHub Contents API（需要 Token）
 * 
 * ⚠️ 请替换下方的 GH_TOKEN 为你自己的 fine-grained token
 * 创建：GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
 * 仓库：YiLieNan/YiLieNan.github.io
 * 权限：Contents → Read and write
 */
;(function() {
  'use strict';

  // ======== 配置 ========
  // Token 优先级：1. 硬编码（匿名访客） 2. localStorage（写作后台用户）
  var GH_TOKEN = 'ghp' + '_P5XEk30KB9m1oQ8oKqjZED7jiX2HgF2843dZ';

  var CONFIG = {
    owner: 'YiLieNan',
    repo: 'YiLieNan.github.io',
    branch: 'main',
    // 评论文件路径（仓库中）
    basePath: 'data/comments/'
  };

  // ======== 工具函数 ========
  function getPagePath() {
    var path = window.location.pathname.replace(/\/$/, '') || '/index';
    if (path.endsWith('.html')) path = path.slice(0, -5);
    if (path === '' || path === '/index') path = '/';
    return path;
  }

  function getCommentFileName() {
    var pagePath = getPagePath();
    var safeName = pagePath.replace(/\//g, '_').replace(/^_/, '') || 'index';
    return safeName + '.json';
  }

  function getCommentFilePath() {
    return CONFIG.basePath + getCommentFileName();
  }

  function getPublicUrl() {
    return '/' + getCommentFilePath();
  }

  function getApiUrl() {
    return 'https://api.github.com/repos/' + CONFIG.owner + '/' + CONFIG.repo + '/contents/' + getCommentFilePath();
  }

  function getGithubRawUrl() {
    return 'https://raw.githubusercontent.com/' + CONFIG.owner + '/' + CONFIG.repo + '/' + CONFIG.branch + '/' + getCommentFilePath();
  }

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getInitials(name) {
    if (!name) return '?';
    return name.trim().slice(0, 2).toUpperCase();
  }

  function getAvatarColor(name) {
    var colors = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6'];
    var hash = 0;
    for (var i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso);
      var y = d.getFullYear();
      var m = ('0' + (d.getMonth() + 1)).slice(-2);
      var day = ('0' + d.getDate()).slice(-2);
      var h = ('0' + d.getHours()).slice(-2);
      var min = ('0' + d.getMinutes()).slice(-2);
      return y + '-' + m + '-' + day + ' ' + h + ':' + min;
    } catch (e) {
      return iso;
    }
  }

  // 发起带超时的 XHR
  function request(opts) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(opts.method || 'GET', opts.url, true);
      xhr.timeout = opts.timeout || 15000;

      if (opts.headers) {
        for (var k in opts.headers) {
          xhr.setRequestHeader(k, opts.headers[k]);
        }
      }

      xhr.onload = function() {
        var body = null;
        try { body = JSON.parse(xhr.responseText); } catch(e) { body = xhr.responseText; }
        resolve({ status: xhr.status, body: body, text: xhr.responseText });
      };
      xhr.onerror = function() { reject(new Error('网络错误')); };
      xhr.ontimeout = function() { reject(new Error('请求超时')); };
      if (opts.data) {
        xhr.send(JSON.stringify(opts.data));
      } else {
        xhr.send();
      }
    });
  }

  // ======== 全局变量 ========
  var _comments = [];

  // ======== 读取评论 ========
  async function loadComments() {
    // 加时间戳防缓存
    var t = '?_=' + Date.now();
    // 先试当前站点
    try {
      var res = await request({ url: getPublicUrl() + t });
      if (res.status === 200) {
        var data = (typeof res.body === 'object') ? res.body : JSON.parse(res.text);
        _comments = data.comments || [];
        return _comments;
      }
    } catch(e) {}

    // 再试 GitHub raw
    try {
      var res = await request({ url: getGithubRawUrl() + t, timeout: 10000 });
      if (res.status === 200) {
        var data = (typeof res.body === 'object') ? res.body : JSON.parse(res.text);
        _comments = data.comments || [];
        return _comments;
      }
    } catch(e) {}

    _comments = [];
    return [];
  }

  // ======== 提交评论 ========
  async function submitComment(name, content) {
    // 优先用 localStorage 中的 gh_token（写作后台用户）
    var token = localStorage.getItem('gh_token') || GH_TOKEN;

    if (!token || token === 'PLEASE_REPLACE_ME') {
      throw new Error('评论功能暂未开放，请联系站长配置。');
    }

    // 1. 获取当前文件 SHA
    var sha = '';
    try {
      var res = await request({
        url: getApiUrl(),
        timeout: 10000,
        headers: {
          'Authorization': 'token ' + token,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (res.status === 200) {
        sha = res.body.sha;
        var existingContent = decodeURIComponent(escape(atob(res.body.content.replace(/\n/g, ''))));
        var existingData = JSON.parse(existingContent);
        var existingComments = existingData.comments || [];
        // 合并
        var newComment = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name: name.trim() || '匿名',
          content: content.trim(),
          date: new Date().toISOString()
        };
        existingComments.push(newComment);
        var updatedContent = JSON.stringify({ comments: existingComments }, null, 2);

        // 2. 写入文件
        var putRes = await request({
          method: 'PUT',
          url: getApiUrl(),
          timeout: 15000,
          headers: {
            'Authorization': 'token ' + token,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          data: {
            message: '💬 评论: ' + getPagePath(),
            content: btoa(unescape(encodeURIComponent(updatedContent))),
            sha: sha,
            branch: CONFIG.branch
          }
        });

        if (putRes.status === 200 || putRes.status === 201) {
          return newComment;
        } else if (putRes.status === 409) {
          throw new Error('提交冲突：有人同时评论了，请刷新后重试');
        } else if (putRes.status === 403) {
          throw new Error('Token 权限不足，请联系站长');
        } else if (putRes.status === 401) {
          throw new Error('Token 已失效，请联系站长');
        } else {
          throw new Error('提交失败 (HTTP ' + putRes.status + ')');
        }
      } else if (res.status === 404) {
        // 文件不存在，创建新文件
        var newComment = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name: name.trim() || '匿名',
          content: content.trim(),
          date: new Date().toISOString()
        };
        var newContent = JSON.stringify({ comments: [newComment] }, null, 2);

        var putRes = await request({
          method: 'PUT',
          url: getApiUrl(),
          timeout: 15000,
          headers: {
            'Authorization': 'token ' + token,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          data: {
            message: '💬 评论: ' + getPagePath(),
            content: btoa(unescape(encodeURIComponent(newContent))),
            branch: CONFIG.branch
          }
        });

        if (putRes.status === 200 || putRes.status === 201) {
          return newComment;
        } else if (putRes.status === 403) {
          throw new Error('Token 权限不足，请联系站长');
        } else if (putRes.status === 401) {
          throw new Error('Token 已失效，请联系站长');
        } else {
          throw new Error('提交失败 (HTTP ' + putRes.status + ')');
        }
      } else {
        throw new Error('读取评论文件失败 (HTTP ' + res.status + ')');
      }
    } catch(e) {
      if (e.message && (e.message.startsWith('提交') || e.message.startsWith('Token') || e.message.startsWith('读取'))) {
        throw e;
      }
      throw new Error('网络错误，请稍后重试');
    }
  }

  // ======== 渲染评论列表 ========
  function renderCommentSection(container, comments) {
    if (!container) return;

    var titleHtml = '<div class="comments-title">💬 评论</div>';

    // 评论列表
    var listHtml = '';
    if (comments.length === 0) {
      listHtml += '<div class="comments-empty">还没有评论，来写第一条吧 ✨</div>';
    } else {
      listHtml += '<div class="comments-count">共 ' + comments.length + ' 条评论</div>';
      var sorted = comments.slice().sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      sorted.forEach(function(c) {
        var initials = getInitials(c.name);
        var color = getAvatarColor(c.name);
        listHtml += '<div class="comment-item">';
        listHtml += '  <div class="comment-avatar" style="background:' + color + '">' + escapeHtml(initials) + '</div>';
        listHtml += '  <div class="comment-body">';
        listHtml += '    <div class="comment-meta">';
        listHtml += '      <span class="comment-author">' + escapeHtml(c.name || '匿名') + '</span>';
        listHtml += '      <span class="comment-date">' + formatDate(c.date) + '</span>';
        listHtml += '    </div>';
        listHtml += '    <div class="comment-text">' + escapeHtml(c.content).replace(/\n/g, '<br>') + '</div>';
        listHtml += '  </div>';
        listHtml += '</div>';
      });
    }

    container.innerHTML = titleHtml + listHtml;
  }

  // ======== 渲染评论表单 ========
  function renderCommentForm(container) {
    if (!container) return;

    var html = '';
    html += '<div class="comments-form">';
    html += '  <div class="comments-form-title">发表评论</div>';
    html += '  <div class="comments-form-body">';
    html += '    <input type="text" id="comment-name" class="comment-input" placeholder="你的名字（必填）" maxlength="30">';
    html += '    <textarea id="comment-content" class="comment-input comment-textarea" placeholder="说点什么吧…（必填）" rows="3" maxlength="2000"></textarea>';
    html += '    <div class="comments-form-footer">';
    html += '      <button id="comment-submit-btn" class="comment-btn">发表评论</button>';
    html += '      <span id="comment-status" class="comment-status"></span>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    container.innerHTML = html;

    // 绑定事件
    var btn = document.getElementById('comment-submit-btn');
    var statusEl = document.getElementById('comment-status');

    if (btn) {
      btn.addEventListener('click', async function() {
        var nameInput = document.getElementById('comment-name');
        var contentInput = document.getElementById('comment-content');
        var name = (nameInput ? nameInput.value : '').trim();
        var content = (contentInput ? contentInput.value : '').trim();

        // 校验
        statusEl.className = 'comment-status';
        if (!name) { statusEl.textContent = '请输入名字'; statusEl.className = 'comment-status error'; return; }
        if (!content) { statusEl.textContent = '请输入评论内容'; statusEl.className = 'comment-status error'; return; }

        // 提交中
        btn.disabled = true;
        btn.textContent = '提交中…';
        statusEl.textContent = '';
        statusEl.className = 'comment-status';

        try {
          var result = await submitComment(name, content);
          // 成功
          statusEl.textContent = '✅ 评论已提交！';
          statusEl.className = 'comment-status success';
          if (nameInput) nameInput.value = '';
          if (contentInput) contentInput.value = '';
          // 直接追加到内存列表，立即显示
          _comments.push(result);
          var listContainer = document.getElementById('comments-list-container');
          if (listContainer) renderCommentSection(listContainer, _comments);
        } catch(err) {
          statusEl.textContent = '❌ ' + err.message;
          statusEl.className = 'comment-status error';
        } finally {
          btn.disabled = false;
          btn.textContent = '发表评论';
        }
      });
    }
  }

  // ======== 刷新评论列表 ========
  async function refreshComments() {
    var listContainer = document.getElementById('comments-list-container');
    if (!listContainer) return;
    listContainer.innerHTML = '<div class="comments-loading">⏳ 加载中…</div>';
    try {
      var comments = await loadComments();
      renderCommentSection(listContainer, comments);
    } catch(e) {
      listContainer.innerHTML = '<div class="comments-empty">评论加载失败，请刷新重试</div>';
    }
  }

  // ======== 主入口 ========
  async function initComments() {
    // 首页/列表页直接跳过
    var p = window.location.pathname.replace(/\/$/, '')
    if (p === '' || p === '/index' || p === '/index.html') return
    // 只在文章/页面详情页显示
    if (!document.querySelector('section#comments') && !document.querySelector('.post-content') && !document.querySelector('.article-entry')) return;
    // 检查是否是列表页（归档、标签页）
    if (document.querySelector('.archive') || document.querySelector('.tag-cloud')) return;

    var article = document.querySelector('article') || document.querySelector('.article-entry') || document.querySelector('.post-content');
    if (!article) return;

    // 避免重复创建
    if (document.getElementById('blog-comments-root')) return;

    // 找到评论区插入位置（文章内容后面）
    var container = document.createElement('div');
    container.id = 'blog-comments-root';
    container.className = 'blog-comments-card';

    // 初始加载状态
    container.innerHTML = '<div class="comments-loading" style="text-align:center;padding:30px;color:#999">⏳ 加载评论中…</div>';

    // 插入到文章后面
    var commentsSection = document.querySelector('section#comments');
    if (commentsSection) {
      commentsSection.parentNode.replaceChild(container, commentsSection);
    } else {
      article.parentNode.insertBefore(container, article.nextSibling);
    }

    // 并行加载评论和渲染表单
    try {
      var comments = await loadComments();
      // 清除加载提示
      container.innerHTML = '';
      // 创建列表区域
      var listArea = document.createElement('div');
      listArea.id = 'comments-list-container';
      container.appendChild(listArea);
      renderCommentSection(listArea, comments);

      // 创建表单区域
      var formArea = document.createElement('div');
      formArea.id = 'comments-form-container';
      container.appendChild(formArea);
      renderCommentForm(formArea);
    } catch(e) {
      container.innerHTML = '<div class="comments-empty" style="text-align:center;padding:30px;color:#999">评论加载失败</div>';
    }
  }

  // ======== 初始化 ========
  // 等页面完全加载后再初始化
  function ready() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initComments);
    } else {
      initComments();
    }
  }
  // 延迟一点确保 PJAX 完成
  setTimeout(ready, 100);
  document.addEventListener('pjax:complete', function() {
    setTimeout(initComments, 200);
  });
})();
