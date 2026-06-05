---
title: ✏️ 写文章
date: 2026-06-05 11:16:00
layout: false
---

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde@2.18.0/dist/easymde.min.css">

<style>
/* ── 全局 ── */
* { box-sizing: border-box; }

body {
  background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%);
  min-height: 100vh;
}

/* ── 登录页 ── */
#login-box {
  max-width: 400px; margin: 120px auto;
  background: #fff; border-radius: 16px; padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(124,58,237,0.12);
  text-align: center;
  display: block;
}
#login-box .icon { font-size: 48px; margin-bottom: 8px; }
#login-box h2 { margin: 0 0 4px; color: #1e1b4b; font-size: 20px; }
#login-box .sub { color: #888; font-size: 13px; margin-bottom: 24px; }
#login-box input {
  width: 100%; padding: 12px 16px; font-size: 16px;
  border: 2px solid #e0d4f0; border-radius: 10px;
  outline: none; text-align: center; letter-spacing: 4px;
  transition: border-color 0.2s;
}
#login-box input:focus { border-color: #7c3aed; }
#login-box .error { color: #ef4444; font-size: 13px; margin-top: 8px; display: none; }
#login-box .btn {
  margin-top: 16px; width: 100%; padding: 10px;
  background: #7c3aed; color: #fff; border: none;
  border-radius: 10px; font-size: 15px; cursor: pointer;
  transition: background 0.2s;
}
#login-box .btn:hover { background: #6d28d9; }

/* ── 编辑器主界面 ── */
#editor-app { display: none; max-width: 960px; margin: 30px auto; }

/* 顶部栏 */
.app-header {
  background: #fff; border-radius: 16px; padding: 20px 28px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.08);
  margin-bottom: 20px;
  display: flex; align-items: center; justify-content: space-between;
}
.app-header h1 { margin: 0; font-size: 20px; color: #1e1b4b; }
.app-header h1 span { color: #7c3aed; }
.app-header .actions { display: flex; gap: 8px; align-items: center; }

/* 令牌管理器 */
.token-bar {
  background: #fff; border-radius: 12px; padding: 14px 20px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06);
  margin-bottom: 16px;
  display: flex; align-items: center; justify-content: space-between;
}
.token-bar .status-ok { color: #059669; font-size: 13px; display: flex; align-items: center; gap: 4px; }
.token-bar .status-missing { color: #d97706; font-size: 13px; display: flex; align-items: center; gap: 4px; }
.token-bar .btn-sm {
  padding: 6px 14px; font-size: 12px; border: none; border-radius: 6px;
  cursor: pointer; transition: background 0.2s;
}

/* 文章信息面板 */
.post-meta {
  background: #fff; border-radius: 12px; padding: 20px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06);
  margin-bottom: 16px;
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.post-meta input, .post-meta select {
  padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px;
  font-size: 14px; outline: none; transition: border-color 0.2s;
}
.post-meta input:focus, .post-meta select:focus { border-color: #7c3aed; }

/* 编辑器容器 */
.editor-wrap {
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06);
  margin-bottom: 16px;
}
/* 调整 EasyMDE 样式 */
.editor-wrap .EasyMDEContainer { border: none !important; }
.editor-wrap .editor-toolbar {
  border: none !important; border-bottom: 1px solid #eee !important;
  border-radius: 12px 12px 0 0 !important;
  background: #fafafa; padding: 4px 8px !important;
}
.editor-wrap .editor-toolbar button { border-radius: 6px !important; }
.editor-wrap .editor-toolbar button:hover { background: #ede9fe !important; }
.editor-wrap .CodeMirror {
  border: none !important; min-height: 480px !important;
  font-size: 15px; line-height: 1.7; padding: 0 4px;
}
.editor-wrap .editor-preview { padding: 20px !important; }
.editor-wrap .editor-preview h1, .editor-wrap .editor-preview h2 { color: #1e1b4b; }

/* 草稿栏 */
.draft-bar {
  background: #fff; border-radius: 12px; padding: 14px 20px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06);
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.draft-bar .label { font-size: 13px; color: #666; font-weight: 600; }
.draft-bar select {
  padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px;
  font-size: 13px; outline: none; min-width: 200px;
}
.draft-bar select:focus { border-color: #7c3aed; }

/* 底部操作栏 */
.action-bar {
  background: #fff; border-radius: 16px; padding: 20px 28px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.08);
  display: flex; align-items: center; justify-content: space-between;
}
.action-bar .btn-group { display: flex; gap: 8px; }
.action-bar .status { font-size: 13px; color: #666; }
.action-bar .status.success { color: #059669; }
.action-bar .status.error { color: #ef4444; }

/* 按钮样式 */
.btn {
  padding: 8px 20px; border: none; border-radius: 8px;
  font-size: 14px; cursor: pointer; transition: all 0.2s;
  display: inline-flex; align-items: center; gap: 4px;
}
.btn-primary { background: #7c3aed; color: #fff; }
.btn-primary:hover { background: #6d28d9; }
.btn-primary:disabled { background: #ccc; cursor: not-allowed; }
.btn-secondary { background: #f0ecff; color: #5b21b6; }
.btn-secondary:hover { background: #e0d8ff; }
.btn-ghost { background: transparent; color: #666; }
.btn-ghost:hover { background: #f5f5f5; }
.btn-danger { background: #fef2f2; color: #dc2626; }
.btn-danger:hover { background: #fee2e2; }
.btn-success { background: #059669; color: #fff; }
.btn-success:hover { background: #047857; }

/* 模态框 */
.modal-overlay {
  display: none; position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  align-items: center; justify-content: center;
}
.modal-overlay.active { display: flex; }
.modal-box {
  background: #fff; border-radius: 16px; padding: 32px;
  max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: modalIn 0.2s ease;
}
@keyframes modalIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.modal-box h3 { margin: 0 0 8px; color: #1e1b4b; }
.modal-box p { font-size: 14px; color: #666; line-height: 1.6; }
.modal-box input, .modal-box textarea {
  width: 100%; padding: 10px 14px; border: 1px solid #ddd;
  border-radius: 8px; font-size: 14px; outline: none; margin-top: 8px;
}
.modal-box input:focus, .modal-box textarea:focus { border-color: #7c3aed; }
.modal-box .btn-row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }

/* 响应式 */
@media (max-width: 640px) {
  .post-meta { grid-template-columns: 1fr; }
  .app-header { flex-direction: column; gap: 12px; }
  .action-bar { flex-direction: column; gap: 12px; }
  .action-bar .btn-group { width: 100%; justify-content: stretch; }
  .action-bar .btn-group .btn { flex: 1; justify-content: center; }
}

/* 滚动条美化 */
.CodeMirror-scroll::-webkit-scrollbar { width: 6px; }
.CodeMirror-scroll::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
.CodeMirror-scroll::-webkit-scrollbar-thumb:hover { background: #bbb; }

/* 文章列表 */
.post-list { margin-top: 20px; }
.post-list .post-item {
  background: #fff; border-radius: 10px; padding: 14px 18px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04); margin-bottom: 8px;
  display: flex; align-items: center; justify-content: space-between;
}
.post-list .post-item .info { flex: 1; }
.post-list .post-item .title { font-weight: 600; color: #1e1b4b; font-size: 14px; }
.post-list .post-item .date { font-size: 12px; color: #999; margin-top: 2px; }
.post-list .post-item .actions { display: flex; gap: 6px; }
</style>

<!-- ════════════════════════ 登录 ════════════════════════ -->
<div id="login-box">
  <div class="icon">🧹</div>
  <h2>写文章</h2>
  <div class="sub">只有你知道的密钥才能进入</div>
  <input type="password" id="admin-pwd" placeholder="输入密钥"
         onkeydown="if(event.key==='Enter')doLogin()">
  <div class="error" id="login-err">🔒 密钥错误</div>
  <button class="btn" onclick="doLogin()">进入</button>
</div>

<!-- ════════════════════════ 编辑器 ════════════════════════ -->
<div id="editor-app">
  <!-- 顶部 -->
  <div class="app-header">
    <h1>🧹 <span>写文章</span></h1>
    <div class="actions">
      <button class="btn btn-secondary" onclick="togglePreview()">👁️ 预览模式</button>
      <button class="btn btn-ghost" onclick="openTokenModal()">🔑 Token</button>
      <button class="btn btn-ghost" onclick="clearAll()">🗑️ 清空</button>
    </div>
  </div>

  <!-- Token 状态 -->
  <div class="token-bar" id="token-bar">
    <span id="token-status">⏳ 检查 Token...</span>
  </div>

  <!-- 文章信息 -->
  <div class="post-meta">
    <input type="text" id="post-title" placeholder="📄 文章标题" autocomplete="off">
    <input type="text" id="post-tags" placeholder="🏷️ 标签（逗号分隔，如：技术,教程）" autocomplete="off">
  </div>

  <!-- 草稿管理 -->
  <div class="draft-bar">
    <span class="label">📂 草稿</span>
    <select id="draft-select" onchange="loadDraft(this.value)">
      <option value="">— 新建草稿 —</option>
    </select>
    <button class="btn btn-sm btn-secondary" onclick="saveDraft()">💾 保存草稿</button>
    <button class="btn btn-sm btn-danger" onclick="deleteDraft()">🗑️ 删除</button>
    <span id="draft-hint" style="font-size:12px;color:#999"></span>
  </div>

  <!-- 编辑器 -->
  <div class="editor-wrap">
    <textarea id="markdown-editor"></textarea>
  </div>

  <!-- 底部操作 -->
  <div class="action-bar">
    <div class="btn-group">
      <button class="btn btn-primary" id="publish-btn" onclick="publishPost()">
        🚀 发布文章
      </button>
      <button class="btn btn-secondary" onclick="saveDraft()">💾 存草稿</button>
    </div>
    <div class="status" id="action-status">就绪 ✓</div>
  </div>
</div>

<!-- ════════════════════════ Token 配置模态框 ════════════════════════ -->
<div class="modal-overlay" id="token-modal">
  <div class="modal-box">
    <h3>🔑 GitHub Token 配置</h3>
    <p>用于自动发布文章到你的博客仓库。需要 <strong>classic token</strong>（勾选 <code>repo</code> 权限）。</p>
    <ol style="font-size:13px;color:#666;padding-left:20px;line-height:1.8">
      <li>打开 <a href="https://github.com/settings/tokens" target="_blank">github.com/settings/tokens</a></li>
      <li>点击 <strong>Generate new token → Classic</strong></li>
      <li>勾选 <code>repo</code>（全选）</li>
      <li>生成后复制粘贴到这里</li>
    </ol>
    <input type="password" id="token-input" placeholder="粘贴 GitHub Token (ghp_...)"
           style="margin-top:4px">
    <div class="btn-row">
      <button class="btn btn-ghost" onclick="closeModal('token-modal')">取消</button>
      <button class="btn btn-primary" onclick="saveToken()">保存 Token</button>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/easymde@2.18.0/dist/easymde.min.js"></script>
<script>
// ════════════════════════════════════════════════
//  配 置
// ════════════════════════════════════════════════

var CONFIG = {
  // 密码哈希 — SHA-256("elaina123")
  pwdHash: '+OXCNEBvOo+ddQDoezfK9NJaTTwmU3eGulsXpPJpoHo=',
  // 仓库信息
  repo: 'YiLieNan/YiLieNan.github.io',
  branch: 'main',
  // 本地存储键名
  storageKey: {
    token: 'gh_token',
    drafts: 'write_drafts',
    currentDraft: 'current_draft_id'
  }
};

// ════════════════════════════════════════════════
//  登 录
// ════════════════════════════════════════════════

async function sha256Base64(str) {
  var enc = new TextEncoder();
  var data = enc.encode(str);
  var hash = await crypto.subtle.digest('SHA-256', data);
  var bytes = new Uint8Array(hash);
  var bin = '';
  for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

async function doLogin() {
  var input = document.getElementById('admin-pwd').value;
  var hash = await sha256Base64(input);
  if (hash === CONFIG.pwdHash) {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('editor-app').style.display = 'block';
    initEditor();
    checkToken();
    loadDraftList();
    loadCurrentDraft();
  } else {
    document.getElementById('login-err').style.display = 'block';
  }
}

// ════════════════════════════════════════════════
//  EasyMDE 编辑器初始化
// ════════════════════════════════════════════════

var editor = null;

function initEditor() {
  if (editor) return;

  editor = new EasyMDE({
    element: document.getElementById('markdown-editor'),
    autoDownloadFontAwesome: false,
    spellChecker: false,
    nativeSpellcheck: true,
    hideIcons: ['guide', 'side-by-side', 'fullscreen'],
    showIcons: ['code', 'table', 'strikethrough'],
    status: ['lines', 'words', 'cursor'],
    promptURLs: true,
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', 'table', 'code', '|',
      'preview', 'undo', 'redo'
    ],
    placeholder: '开始写文章吧 ✨\n\n支持 Markdown 语法，工具栏可以快速插入格式。',
    renderingConfig: {
      codeSyntaxHighlighting: true
    }
  });

  // 自动保存草稿（每 30 秒）
  setInterval(autoSaveDraft, 30000);
}

// ════════════════════════════════════════════════
//  预 览 切 换
// ════════════════════════════════════════════════

var previewMode = false;
function togglePreview() {
  if (!editor) return;
  previewMode = !previewMode;
  if (previewMode) {
    editor.togglePreview();
  } else {
    // 退出预览
    if (editor.isPreviewActive()) editor.togglePreview();
  }
}

// ════════════════════════════════════════════════
//  Token 管理
// ════════════════════════════════════════════════

function getToken() {
  return localStorage.getItem(CONFIG.storageKey.token) || '';
}

function checkToken() {
  var token = getToken();
  var el = document.getElementById('token-status');
  if (token && token.startsWith('ghp_')) {
    el.innerHTML = '<span class="status-ok">✅ Token 已配置</span>';
  } else if (token) {
    el.innerHTML = '<span class="status-missing">⚠️ Token 格式不对，建议重新生成 classic token（ghp_开头）</span>';
  } else {
    el.innerHTML = '<span class="status-missing">❌ 未配置 Token — 发布需要 GitHub Token</span>';
  }
}

function openTokenModal() {
  document.getElementById('token-input').value = getToken();
  document.getElementById('token-modal').classList.add('active');
}

function saveToken() {
  var val = document.getElementById('token-input').value.trim();
  if (val) {
    localStorage.setItem(CONFIG.storageKey.token, val);
  }
  closeModal('token-modal');
  checkToken();
  setStatus('Token 已保存 ✅', 'success');
}

// ════════════════════════════════════════════════
//  草 稿 管 理
// ════════════════════════════════════════════════

function getDrafts() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG.storageKey.drafts)) || {};
  } catch(e) {
    return {};
  }
}

function saveDrafts(obj) {
  localStorage.setItem(CONFIG.storageKey.drafts, JSON.stringify(obj));
}

function getCurrentDraftId() {
  return localStorage.getItem(CONFIG.storageKey.currentDraft) || '';
}

function setCurrentDraftId(id) {
  if (id) {
    localStorage.setItem(CONFIG.storageKey.currentDraft, id);
  } else {
    localStorage.removeItem(CONFIG.storageKey.currentDraft);
  }
}

function getEditorContent() {
  return {
    title: document.getElementById('post-title').value.trim(),
    tags: document.getElementById('post-tags').value.trim(),
    content: editor ? editor.value() : ''
  };
}

function setEditorContent(data) {
  document.getElementById('post-title').value = data.title || '';
  document.getElementById('post-tags').value = data.tags || '';
  if (editor && data.content) {
    editor.value(data.content);
  }
}

function makeDraftId() {
  return 'draft_' + Date.now();
}

function saveDraft() {
  var data = getEditorContent();
  if (!data.title) {
    setStatus('⚠️ 请先填写标题再保存草稿', 'error');
    return;
  }

  var drafts = getDrafts();
  var id = getCurrentDraftId() || makeDraftId();

  drafts[id] = {
    title: data.title,
    tags: data.tags,
    content: data.content,
    updated: new Date().toLocaleString('zh-CN')
  };

  saveDrafts(drafts);
  setCurrentDraftId(id);
  loadDraftList();
  document.getElementById('draft-select').value = id;
  setStatus('✅ 草稿已保存：「' + data.title + '」', 'success');
  document.getElementById('draft-hint').textContent = '已自动保存 ' + new Date().toLocaleTimeString('zh-CN');
}

function autoSaveDraft() {
  var title = document.getElementById('post-title').value.trim();
  if (!title || !editor) return;
  var data = getEditorContent();
  if (!data.content) return;

  var drafts = getDrafts();
  var id = getCurrentDraftId() || makeDraftId();

  drafts[id] = {
    title: data.title,
    tags: data.tags,
    content: data.content,
    updated: new Date().toLocaleString('zh-CN')
  };

  saveDrafts(drafts);
  setCurrentDraftId(id);
  document.getElementById('draft-hint').textContent = '⏺ 自动保存 ' + new Date().toLocaleTimeString('zh-CN');
}

function loadDraft(id) {
  if (!id) {
    // 新建
    setEditorContent({ title: '', tags: '', content: '' });
    setCurrentDraftId('');
    document.getElementById('draft-hint').textContent = '';
    return;
  }

  var drafts = getDrafts();
  var draft = drafts[id];
  if (!draft) {
    setStatus('⚠️ 草稿不存在', 'error');
    return;
  }

  setEditorContent(draft);
  setCurrentDraftId(id);
  setStatus('📂 已加载草稿：「' + draft.title + '」', 'success');
  document.getElementById('draft-hint').textContent = '最后编辑：' + draft.updated;
}

function loadCurrentDraft() {
  var id = getCurrentDraftId();
  if (id) {
    var drafts = getDrafts();
    if (drafts[id]) {
      setEditorContent(drafts[id]);
      var sel = document.getElementById('draft-select');
      if (sel) sel.value = id;
      document.getElementById('draft-hint').textContent = '恢复上次编辑：' + drafts[id].updated;
    }
  }
}

function loadDraftList() {
  var drafts = getDrafts();
  var sel = document.getElementById('draft-select');
  var current = getCurrentDraftId();
  sel.innerHTML = '<option value="">— 新建草稿 —</option>';
  var keys = Object.keys(drafts).sort(function(a, b) {
    return new Date(drafts[b].updated) - new Date(a.updated);
  });
  keys.forEach(function(id) {
    var opt = document.createElement('option');
    opt.value = id;
    var title = drafts[id].title.length > 30 ? drafts[id].title.slice(0, 30) + '…' : drafts[id].title;
    opt.textContent = title + ' (' + drafts[id].updated + ')';
    if (id === current) opt.selected = true;
    sel.appendChild(opt);
  });
}

function deleteDraft() {
  var id = document.getElementById('draft-select').value;
  if (!id) return;

  if (!confirm('确定删除这篇草稿？')) return;

  var drafts = getDrafts();
  delete drafts[id];
  saveDrafts(drafts);

  if (getCurrentDraftId() === id) {
    setCurrentDraftId('');
    setEditorContent({ title: '', tags: '', content: '' });
  }

  loadDraftList();
  setStatus('🗑️ 草稿已删除', 'success');
}

// ════════════════════════════════════════════════
//  发 布
// ════════════════════════════════════════════════

function publishPost() {
  var token = getToken();
  if (!token) {
    openTokenModal();
    setStatus('❌ 请先配置 GitHub Token', 'error');
    return;
  }

  var title = document.getElementById('post-title').value.trim();
  var tags = document.getElementById('post-tags').value.trim();
  var content = editor ? editor.value().trim() : '';

  if (!title) {
    setStatus('⚠️ 请填写文章标题', 'error');
    return;
  }
  if (!content) {
    setStatus('⚠️ 请填写文章内容', 'error');
    return;
  }

  // 生成文件名
  var now = new Date();
  var dateStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
  var slug = title
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'post';
  var filename = dateStr + '-' + slug + '.md';
  var path = 'source/_posts/' + filename;

  // 生成 front-matter
  var timeStr = String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':00';
  var frontMatter = '---\ntitle: ' + title + '\ndate: ' + dateStr + ' ' + timeStr + '\n';
  if (tags) {
    frontMatter += 'tags: [' + tags.split(/[,，]/).map(function(t) {
      return t.trim();
    }).filter(Boolean).join(', ') + ']\n';
  }
  // 自动选封面图（从伊蕾娜图池）
  var covers = [
    'cover-1.webp', 'cover-2.webp', 'cover-3.webp', 'cover-4.webp',
    'cover-5.webp', 'cover-6.webp', 'cover-7.webp', 'cover-8.webp'
  ];
  var cover = covers[Math.floor(Math.random() * covers.length)];
  frontMatter += 'cover: /images/covers/' + cover + '\n';
  frontMatter += '---\n\n' + content;

  // Base64 编码
  var encoded = btoa(unescape(encodeURIComponent(frontMatter)));

  var btn = document.getElementById('publish-btn');
  btn.disabled = true;
  btn.textContent = '⏳ 发布中...';
  setStatus('正在推送到 GitHub...', '');

  var apiUrl = 'https://api.github.com/repos/' + CONFIG.repo + '/contents/' + path;

  fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '📝 通过网页发布：' + title,
      content: encoded,
      branch: CONFIG.branch
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.content) {
      // 发布成功——删除这篇草稿
      var draftId = getCurrentDraftId();
      if (draftId) {
        var drafts = getDrafts();
        delete drafts[draftId];
        saveDrafts(drafts);
        setCurrentDraftId('');
        loadDraftList();
      }

      setStatus(
        '✅ 发布成功！<a href="/' + dateStr.replace(/-/g, '/') + '/' + slug + '/" target="_blank">查看新文章 →</a>',
        'success'
      );
      document.getElementById('post-title').value = '';
      document.getElementById('post-tags').value = '';
      if (editor) editor.value('');
    } else {
      var msg = data.message || '未知错误';
      if (msg === 'Bad credentials') {
        setStatus('❌ Token 无效，请重新生成', 'error');
        localStorage.removeItem(CONFIG.storageKey.token);
        checkToken();
      } else if (msg.indexOf('already exists') >= 0) {
        setStatus('⚠️ 同名文章已存在，请修改标题', 'error');
      } else {
        setStatus('❌ 发布失败：' + msg, 'error');
      }
    }
  })
  .catch(function(err) {
    setStatus('❌ 网络错误：' + err.message, 'error');
  })
  .finally(function() {
    btn.disabled = false;
    btn.textContent = '🚀 发布文章';
  });
}

// ════════════════════════════════════════════════
//  工 具 函 数
// ════════════════════════════════════════════════

function setStatus(msg, type) {
  var el = document.getElementById('action-status');
  el.innerHTML = msg;
  el.className = 'status' + (type ? ' ' + type : '');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function clearAll() {
  if (!confirm('确定清空所有内容？')) return;
  document.getElementById('post-title').value = '';
  document.getElementById('post-tags').value = '';
  if (editor) editor.value('');
  setCurrentDraftId('');
  document.getElementById('draft-select').value = '';
  document.getElementById('draft-hint').textContent = '';
  setStatus('已清空 ✓', 'success');
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Ctrl+S 保存草稿
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (document.getElementById('editor-app').style.display !== 'none') {
      saveDraft();
    }
  }
});
</script>
