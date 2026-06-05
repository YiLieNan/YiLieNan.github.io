---
title: ✏️ 写文章
date: 2026-06-05 11:40:00
layout: false
---

<!-- Quill 富文本编辑器 -->
<link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet">

<style>
/* ── 全局 ── */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: linear-gradient(135deg, #f5f0ff 0%, #ede9fe 100%);
  min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ── 登录页 ── */
#login-box {
  max-width: 400px; margin: 120px auto;
  background: #fff; border-radius: 16px; padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(124,58,237,0.12);
  text-align: center; display: block;
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
#editor-app { display: none; max-width: 960px; margin: 20px auto; padding: 0 16px; }

/* 顶部栏 */
.app-header {
  background: #fff; border-radius: 16px; padding: 16px 24px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.08);
  margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
}
.app-header h1 { margin: 0; font-size: 18px; color: #1e1b4b; }
.app-header h1 span { color: #7c3aed; }
.app-header .actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }

/* Token 状态条 */
.token-bar {
  background: #fff; border-radius: 12px; padding: 12px 20px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06);
  margin-bottom: 12px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
}
.token-bar .status-ok { color: #059669; font-size: 13px; display: flex; align-items: center; gap: 4px; }
.token-bar .status-missing { color: #d97706; font-size: 13px; }
.token-bar .btn-sm { padding: 5px 12px; font-size: 12px; border: none; border-radius: 6px; cursor: pointer; }

/* 文章信息 */
.post-meta {
  background: #fff; border-radius: 12px; padding: 16px 20px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06);
  margin-bottom: 12px; display: flex; gap: 12px; flex-wrap: wrap;
}
.post-meta input {
  padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px;
  font-size: 14px; outline: none; flex: 1; min-width: 200px;
}
.post-meta input:focus { border-color: #7c3aed; }

/* 富文本编辑器容器 */
.editor-wrap {
  background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06); margin-bottom: 12px;
}
#editor-container {
  min-height: 500px; font-size: 16px; line-height: 1.8;
}
/* Quill 工具栏样式 */
.ql-toolbar {
  border: none !important; border-bottom: 1px solid #eee !important;
  background: #fafafa; border-radius: 12px 12px 0 0 !important;
}
.ql-container { border: none !important; font-size: 16px !important; }

/* 草稿管理 */
.draft-bar {
  background: #fff; border-radius: 12px; padding: 12px 20px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.06);
  margin-bottom: 12px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.draft-bar .label { font-size: 13px; color: #666; font-weight: 600; }
.draft-bar select {
  padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px;
  font-size: 13px; outline: none; min-width: 180px;
}
.draft-bar select:focus { border-color: #7c3aed; }
.draft-bar .hint { font-size: 12px; color: #999; }

/* 底部操作栏 */
.action-bar {
  background: #fff; border-radius: 16px; padding: 16px 24px;
  box-shadow: 0 2px 12px rgba(124,58,237,0.08);
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
}
.action-bar .btn-group { display: flex; gap: 8px; flex-wrap: wrap; }
.action-bar .status { font-size: 13px; color: #666; }
.action-bar .status.success { color: #059669; }
.action-bar .status.error { color: #ef4444; }

/* 按钮 */
.btn {
  padding: 8px 18px; border: none; border-radius: 8px;
  font-size: 13px; cursor: pointer; transition: all 0.2s;
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
  background: #fff; border-radius: 16px; padding: 28px;
  max-width: 520px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.modal-box h3 { margin: 0 0 8px; color: #1e1b4b; }
.modal-box p, .modal-box li { font-size: 14px; color: #666; line-height: 1.6; }
.modal-box ol { padding-left: 20px; margin: 8px 0; }
.modal-box input {
  width: 100%; padding: 10px 14px; border: 1px solid #ddd;
  border-radius: 8px; font-size: 14px; outline: none; margin-top: 4px;
}
.modal-box input:focus { border-color: #7c3aed; }
.modal-box .btn-row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }

/* 图片预览 */
#image-preview {
  margin-top: 8px; max-width: 100%; border-radius: 8px; display: none;
}

/* 响应式 */
@media (max-width: 640px) {
  .app-header { flex-direction: column; align-items: stretch; }
  .action-bar { flex-direction: column; }
  .action-bar .btn-group { width: 100%; }
  .action-bar .btn-group .btn { flex: 1; justify-content: center; }
}
</style>

<!-- ══════ 登录 ══════ -->
<div id="login-box">
  <div class="icon">🧹</div>
  <h2>写文章</h2>
  <div class="sub">只有站长知道密码</div>
  <input type="password" id="admin-pwd" placeholder="输入密钥"
         onkeydown="if(event.key==='Enter')doLogin()">
  <div class="error" id="login-err">🔒 密钥错误</div>
  <button class="btn" onclick="doLogin()">进入</button>
</div>

<!-- ══════ 编辑器 ══════ -->
<div id="editor-app">

  <!-- 顶栏 -->
  <div class="app-header">
    <h1>🧹 <span>写文章</span></h1>
    <div class="actions">
      <button class="btn btn-ghost" onclick="openModal('token-modal')">🔑 Token</button>
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
    <input type="text" id="post-tags" placeholder="🏷️ 标签，逗号分隔" autocomplete="off">
  </div>

  <!-- 草稿 -->
  <div class="draft-bar">
    <span class="label">📂 草稿</span>
    <select id="draft-select" onchange="loadDraft(this.value)">
      <option value="">— 新建 —</option>
    </select>
    <button class="btn btn-sm btn-secondary" onclick="saveDraft()">💾 保存</button>
    <button class="btn btn-sm btn-danger" onclick="deleteDraft()">🗑️ 删除</button>
    <span class="hint" id="draft-hint"></span>
  </div>

  <!-- 编辑器 -->
  <div class="editor-wrap">
    <div id="editor-container"></div>
  </div>

  <!-- 底部 -->
  <div class="action-bar">
    <div class="btn-group">
      <button class="btn btn-primary" id="publish-btn" onclick="publishPost()">🚀 发布文章</button>
      <button class="btn btn-secondary" onclick="saveDraft()">💾 存草稿</button>
      <button class="btn btn-secondary" onclick="toggleSource()">📝 源码</button>
    </div>
    <div class="status" id="action-status">就绪 ✓</div>
  </div>
</div>

<!-- ══════ Token 配置 ══════ -->
<div class="modal-overlay" id="token-modal">
  <div class="modal-box">
    <h3>🔑 GitHub Token 配置</h3>
    <p>发布文章需要 GitHub Token（classic 类型，勾选 <code>repo</code> 权限）</p>
    <ol>
      <li>打开 <a href="https://github.com/settings/tokens" target="_blank">github.com/settings/tokens</a></li>
      <li>点 <strong>Generate new token → Classic</strong></li>
      <li>勾选 <code>repo</code>，生成后复制粘贴到下面</li>
    </ol>
    <input type="password" id="token-input" placeholder="粘贴 ghp_...">
    <div class="btn-row">
      <button class="btn btn-ghost" onclick="closeModal('token-modal')">取消</button>
      <button class="btn btn-primary" onclick="saveToken()">保存</button>
    </div>
  </div>
</div>

<!-- ══════ 源码查看模态框 ══════ -->
<div class="modal-overlay" id="source-modal">
  <div class="modal-box" style="max-width:720px">
    <h3>📝 Markdown 源码</h3>
    <p style="margin-bottom:8px">编辑器内容转换后的 Markdown，发布时提交这个到 GitHub。</p>
    <textarea id="source-view" style="width:100%;min-height:350px;font-family:monospace;font-size:13px;padding:12px;border:1px solid #ddd;border-radius:8px;resize:vertical" readonly></textarea>
    <div class="btn-row">
      <button class="btn btn-ghost" onclick="closeModal('source-modal')">关闭</button>
    </div>
  </div>
</div>

<!-- ══════ 脚本 ── Quill + Turndown ══════ -->
<script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/turndown@7.2.0/dist/turndown.min.js"></script>
<script>
// ═══════════════════ 配置 ═══════════════════

var CONFIG = {
  pwdHash: '2WL45h/6VFXeucWncCHdhaSKvRHw7crqQxuRqUHaEg0=',
  repo: 'YiLieNan/YiLieNan.github.io',
  branch: 'main',
  storageKey: { token: 'gh_token', drafts: 'write_drafts', currentDraft: 'current_draft_id' }
};

// ═══════════════════ 登录 ═══════════════════

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
  if ((await sha256Base64(input)) === CONFIG.pwdHash) {
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

// ═══════════════════ Quill 富文本编辑器 ═══════════════════

var quill = null;
var td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '*'
});

function initEditor() {
  if (quill) return;

  quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: '在这里写文章... 可以直接粘贴图片 📷',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  // 图片处理：粘贴/拖拽图片 → 上传到 GitHub
  quill.getModule('toolbar').addHandler('image', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function() {
      var file = input.files[0];
      if (file) uploadImage(file);
    };
    input.click();
  });

  // 监听粘贴事件
  document.getElementById('editor-container').addEventListener('paste', function(e) {
    var items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        uploadImage(items[i].getAsFile());
        return;
      }
    }
  });

  // 自动保存
  setInterval(autoSaveDraft, 30000);
}

// ═══════════════════ 图片上传 ═══════════════════

function uploadImage(file) {
  if (file.size > 5 * 1024 * 1024) {
    setStatus('⚠️ 图片超过 5MB，请压缩后重试', 'error');
    return;
  }

  setStatus('📤 上传图片中...', '');
  var btn = document.getElementById('publish-btn');
  btn.disabled = true;

  // 1. 先转 Base64
  var reader = new FileReader();
  reader.onload = function(e) {
    var base64Data = e.target.result.split(',')[1];
    var ext = file.name.split('.').pop().toLowerCase() || 'png';
    var filename = 'post-' + Date.now() + '.' + ext;
    var path = 'source/images/posts/' + filename;
    var token = getToken();

    if (!token) {
      openModal('token-modal');
      setStatus('❌ 请先配置 Token', 'error');
      btn.disabled = false;
      return;
    }

    // 2. 上传到 GitHub
    var apiUrl = 'https://api.github.com/repos/' + CONFIG.repo + '/contents/' + path;
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '📷 上传图片：' + filename,
        content: base64Data,
        branch: CONFIG.branch
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.content) {
        var imgUrl = '/' + path.replace(/^source\//, '');
        // 获取当前光标位置，插入图片
        var range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', imgUrl);
        quill.setSelection(range.index + 1);
        setStatus('✅ 图片已插入: ' + filename, 'success');
      } else {
        setStatus('❌ 图片上传失败: ' + (data.message || '未知错误'), 'error');
      }
    })
    .catch(function(err) {
      setStatus('❌ 上传出错: ' + err.message, 'error');
    })
    .finally(function() {
      btn.disabled = false;
    });
  };
  reader.readAsDataURL(file);
}

// ═══════════════════ Token ═══════════════════

function getToken() { return localStorage.getItem(CONFIG.storageKey.token) || ''; }

function checkToken() {
  var token = getToken();
  var el = document.getElementById('token-status');
  if (token && token.startsWith('ghp_')) {
    el.innerHTML = '<span class="status-ok">✅ Token 已配置，可以发布</span>';
  } else if (token) {
    el.innerHTML = '<span class="status-missing">⚠️ Token 格式不对，建议用 classic token（ghp_开头）</span>';
  } else {
    el.innerHTML = '<span class="status-missing">❌ 未配置 Token — 发布需要 GitHub Token</span>';
  }
}

function saveToken() {
  var val = document.getElementById('token-input').value.trim();
  if (val) localStorage.setItem(CONFIG.storageKey.token, val);
  closeModal('token-modal');
  checkToken();
  setStatus('Token 已保存 ✅', 'success');
}

// ═══════════════════ 获取/设置编辑器内容 ═══════════════════

function getEditorContent() {
  return {
    title: document.getElementById('post-title').value.trim(),
    tags: document.getElementById('post-tags').value.trim(),
    html: quill ? quill.root.innerHTML : '',
    markdown: quill ? td.turndown(quill.root.innerHTML) : ''
  };
}

function setEditorContent(data) {
  document.getElementById('post-title').value = data.title || '';
  document.getElementById('post-tags').value = data.tags || '';
  if (quill && data.html) {
    quill.root.innerHTML = data.html;
  }
}

// ═══════════════════ 草稿管理 ═══════════════════

function getDrafts() {
  try { return JSON.parse(localStorage.getItem(CONFIG.storageKey.drafts)) || {}; }
  catch(e) { return {}; }
}
function saveDrafts(obj) { localStorage.setItem(CONFIG.storageKey.drafts, JSON.stringify(obj)); }
function getCurrentDraftId() { return localStorage.getItem(CONFIG.storageKey.currentDraft) || ''; }
function setCurrentDraftId(id) {
  if (id) localStorage.setItem(CONFIG.storageKey.currentDraft, id);
  else localStorage.removeItem(CONFIG.storageKey.currentDraft);
}

function saveDraft() {
  var data = getEditorContent();
  if (!data.title) { setStatus('⚠️ 请填写标题再保存', 'error'); return; }
  var drafts = getDrafts();
  var id = getCurrentDraftId() || 'draft_' + Date.now();
  drafts[id] = {
    title: data.title, tags: data.tags,
    html: data.html, markdown: data.markdown,
    updated: new Date().toLocaleString('zh-CN')
  };
  saveDrafts(drafts);
  setCurrentDraftId(id);
  loadDraftList();
  document.getElementById('draft-select').value = id;
  setStatus('✅ 草稿已保存：「' + data.title + '」', 'success');
}

function autoSaveDraft() {
  var title = document.getElementById('post-title').value.trim();
  if (!title || !quill) return;
  var data = getEditorContent();
  if (!data.html || data.html === '<p><br></p>') return;
  var drafts = getDrafts();
  var id = getCurrentDraftId() || 'draft_' + Date.now();
  drafts[id] = {
    title: data.title, tags: data.tags,
    html: data.html, markdown: data.markdown,
    updated: new Date().toLocaleString('zh-CN')
  };
  saveDrafts(drafts);
  setCurrentDraftId(id);
  document.getElementById('draft-hint').textContent = '⏺ 自动保存 ' + new Date().toLocaleTimeString('zh-CN');
}

function loadDraft(id) {
  if (!id) {
    setEditorContent({ title: '', tags: '', html: '' });
    setCurrentDraftId('');
    document.getElementById('draft-hint').textContent = '';
    return;
  }
  var drafts = getDrafts();
  var draft = drafts[id];
  if (!draft) { setStatus('⚠️ 草稿不存在', 'error'); return; }
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
  sel.innerHTML = '<option value="">— 新建 —</option>';
  Object.keys(drafts).sort(function(a, b) {
    return new Date(drafts[b].updated) - new Date(drafts[a].updated);
  }).forEach(function(id) {
    var opt = document.createElement('option');
    opt.value = id;
    var t = (drafts[id].title || '').slice(0, 30);
    opt.textContent = t + ' (' + drafts[id].updated + ')';
    if (id === current) opt.selected = true;
    sel.appendChild(opt);
  });
}

function deleteDraft() {
  var id = document.getElementById('draft-select').value;
  if (!id || !confirm('确定删除这篇草稿？')) return;
  var drafts = getDrafts();
  delete drafts[id];
  saveDrafts(drafts);
  if (getCurrentDraftId() === id) {
    setCurrentDraftId('');
    setEditorContent({ title: '', tags: '', html: '' });
  }
  loadDraftList();
  setStatus('🗑️ 已删除', 'success');
}

// ═══════════════════ 源码查看 ═══════════════════

function toggleSource() {
  var data = getEditorContent();
  document.getElementById('source-view').value = data.markdown || '(空)';
  openModal('source-modal');
}

// ═══════════════════ 发布 ═══════════════════

function publishPost() {
  var token = getToken();
  if (!token) { openModal('token-modal'); setStatus('❌ 请先配置 Token', 'error'); return; }

  var title = document.getElementById('post-title').value.trim();
  var tags = document.getElementById('post-tags').value.trim();
  var html = quill ? quill.root.innerHTML : '';

  if (!title) { setStatus('⚠️ 请填写标题', 'error'); return; }
  if (!html || html === '<p><br></p>') { setStatus('⚠️ 请写点内容', 'error'); return; }

  // HTML → Markdown
  var content = td.turndown(html);

  // 生成文件名
  var now = new Date();
  var dateStr = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
  var slug = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\w]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'post';
  var filename = dateStr + '-' + slug + '.md';
  var path = 'source/_posts/' + filename;

  // Front-matter
  var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':00';
  var fm = '---\ntitle: ' + title + '\ndate: ' + dateStr + ' ' + timeStr + '\n';
  if (tags) {
    fm += 'tags: [' + tags.split(/[,，]/).map(function(t) { return t.trim(); }).filter(Boolean).join(', ') + ']\n';
  }
  // 自动选封面
  fm += 'cover: /images/covers/cover-' + (Math.floor(Math.random() * 8) + 1) + '.webp\n';
  fm += '---\n\n' + content;

  var encoded = btoa(unescape(encodeURIComponent(fm)));

  var btn = document.getElementById('publish-btn');
  btn.disabled = true;
  btn.textContent = '⏳ 发布中...';
  setStatus('正在推送到 GitHub...', '');

  fetch('https://api.github.com/repos/' + CONFIG.repo + '/contents/' + path, {
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
      var draftId = getCurrentDraftId();
      if (draftId) {
        var drafts = getDrafts();
        delete drafts[draftId];
        saveDrafts(drafts);
        setCurrentDraftId('');
        loadDraftList();
      }
      setStatus('✅ 发布成功！<a href="/' + dateStr.replace(/-/g, '/') + '/' + slug + '/" target="_blank">查看 →</a>', 'success');
      document.getElementById('post-title').value = '';
      document.getElementById('post-tags').value = '';
      if (quill) quill.root.innerHTML = '';
    } else {
      var msg = data.message || '未知错误';
      if (msg === 'Bad credentials') {
        setStatus('❌ Token 无效，请重新生成', 'error');
        localStorage.removeItem(CONFIG.storageKey.token);
        checkToken();
      } else if (msg.indexOf('already exists') >= 0) {
        setStatus('⚠️ 同名文章已存在，换个标题', 'error');
      } else {
        setStatus('❌ 失败：' + msg, 'error');
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

// ═══════════════════ 工具 ═══════════════════

function setStatus(msg, type) {
  var el = document.getElementById('action-status');
  el.innerHTML = msg;
  el.className = 'status' + (type ? ' ' + type : '');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function clearAll() {
  if (!confirm('确定清空？')) return;
  document.getElementById('post-title').value = '';
  document.getElementById('post-tags').value = '';
  if (quill) quill.root.innerHTML = '';
  setCurrentDraftId('');
  document.getElementById('draft-select').value = '';
  document.getElementById('draft-hint').textContent = '';
  setStatus('已清空 ✓', 'success');
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    if (document.getElementById('editor-app').style.display !== 'none') saveDraft();
  }
});
</script>
