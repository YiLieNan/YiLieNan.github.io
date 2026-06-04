---
title: 草稿箱
date: 2026-06-04 23:00:00
---

<style>
#admin-login, #admin-editor {
  max-width: 720px; margin: 40px auto;
  background: rgba(255,255,255,0.95);
  border-radius: 12px; padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: none;
}
#admin-login { display: block; text-align: center; }
#admin-login input {
  width: 200px; padding: 10px 16px; font-size: 16px;
  border: 2px solid #e0d4f0; border-radius: 8px;
  outline: none; text-align: center; letter-spacing: 4px;
}
#admin-login input:focus { border-color: #7c3aed; }
#admin-login .tip { color: #999; font-size: 13px; margin-top: 12px; }
#admin-login .error { color: #ef4444; font-size: 13px; margin-top: 8px; display: none; }
#admin-editor textarea, #admin-editor input {
  width: 100%; padding: 10px; border: 1px solid #ddd;
  border-radius: 8px; font-size: 14px; outline: none;
  box-sizing: border-box; margin-bottom: 12px;
}
#admin-editor textarea { min-height: 300px; font-family: monospace; resize: vertical; }
#admin-editor .btn {
  background: #7c3aed; color: #fff; border: none;
  padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 15px;
}
#admin-editor .btn:hover { background: #a78bfa; }
#admin-editor .btn:disabled { background: #ccc; cursor: not-allowed; }
#admin-editor .status { margin-top: 10px; font-size: 13px; color: #666; }
#admin-editor .tag-input { display: inline-block; 
  background: #ede9fe; color: #5b21b6; padding: 2px 10px;
  border-radius: 4px; font-size: 12px; margin: 2px; }
</style>

<div id="admin-login">
  <div style="font-size:40px;margin-bottom:10px">✏️</div>
  <h3 style="margin:0 0 16px;color:#333">验证身份</h3>
  <input type="password" id="admin-pwd" placeholder="输入密钥" 
         onkeydown="if(event.key==='Enter')checkPwd()">
  <div class="error" id="admin-err">密钥错误</div>
  <div class="tip">提示：只有站长知道哦</div>
  <br><br>
  <button class="btn" onclick="checkPwd()" style="background:#7c3aed;color:#fff;border:none;padding:8px 32px;border-radius:8px;cursor:pointer;font-size:15px">确认</button>
</div>

<div id="admin-editor">
  <h3 style="margin:0 0 16px;color:#333">📝 写新文章</h3>
  <input type="text" id="post-title" placeholder="文章标题">
  <input type="text" id="post-tags" placeholder="标签（逗号分隔，如：技术,教程）">
  <textarea id="post-content" placeholder="用 Markdown 写文章..."></textarea>
  <div style="display:flex;gap:8px;align-items:center">
    <button class="btn" id="publish-btn" onclick="publishPost()">发布文章</button>
    <span class="status" id="post-status"></span>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js"></script>
<script>
// ── 密码验证 ──
// 密码用 SHA-256 哈希后对比，不会存明文
// 设置方法：打开浏览器控制台，输入 btoa(sha256('你的密码'))，把结果贴到下面
var PWD_HASH = '+OXCNEBvOo+ddQDoezfK9NJaTTwmU3eGulsXpPJpoHo=';

function checkPwd() {
  var input = document.getElementById('admin-pwd').value;
  var hash = btoa(sha256(input));
  if (hash === PWD_HASH) {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-editor').style.display = 'block';
  } else {
    document.getElementById('admin-err').style.display = 'block';
  }
}

// ── GitHub Token ──
// 需要 https://github.com/settings/tokens 生成一个 token，勾选 repo 权限
// 把 Token 填入下面（建议用后及时清理浏览器控制台历史）
var GH_TOKEN = localStorage.getItem('gh_token') || '';

// 如果没有 Token，弹出提示
function ensureToken() {
  if (!GH_TOKEN) {
    GH_TOKEN = prompt('需要 GitHub Token 才能发布文章。\n请到 https://github.com/settings/tokens\n生成一个 Token（勾选 repo 权限），粘贴到这里：');
    if (GH_TOKEN) {
      localStorage.setItem('gh_token', GH_TOKEN);
    }
  }
  return !!GH_TOKEN;
}

// ── 发布文章 ──
function publishPost() {
  ensureToken();
  if (!GH_TOKEN) return;
  
  var title = document.getElementById('post-title').value.trim();
  var content = document.getElementById('post-content').value.trim();
  var tags = document.getElementById('post-tags').value.trim();
  
  if (!title || !content) {
    document.getElementById('post-status').textContent = '⚠️ 标题和内容不能为空';
    return;
  }
  
  // 生成文件名
  var date = new Date();
  var dateStr = date.getFullYear() + '-' + 
    String(date.getMonth()+1).padStart(2,'0') + '-' + 
    String(date.getDate()).padStart(2,'0');
  var slug = title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  var filename = dateStr + '-' + slug + '.md';
  var path = 'source/_posts/' + filename;
  
  // 生成 front-matter
  var frontMatter = '---\ntitle: ' + title + '\ndate: ' + dateStr + ' ' + 
    String(date.getHours()).padStart(2,'0') + ':' + 
    String(date.getMinutes()).padStart(2,'0') + ':00\n';
  if (tags) {
    frontMatter += 'tags: [' + tags.split(/[,，]/).map(t => t.trim()).filter(Boolean).join(', ') + ']\n';
  }
  frontMatter += '---\n\n' + content;
  
  // Base64 编码
  var encoded = btoa(unescape(encodeURIComponent(frontMatter)));
  
  var btn = document.getElementById('publish-btn');
  btn.disabled = true;
  btn.textContent = '发布中...';
  document.getElementById('post-status').textContent = '正在推送...';
  
  // 通过 GitHub API 创建文件
  var apiUrl = 'https://api.github.com/repos/YiLieNan/YiLieNan.github.io/contents/' + path;
  
  fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer ' + GH_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '📝 通过网页发布：' + title,
      content: encoded,
      branch: 'main'
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.content) {
      document.getElementById('post-status').innerHTML = 
        '✅ 发布成功！等几分钟部署后访问<br>' +
        '→ <a href="/' + dateStr.replace(/-/g, '/') + '/' + slug + '/" target="_blank">查看新文章</a>';
      document.getElementById('post-title').value = '';
      document.getElementById('post-content').value = '';
      document.getElementById('post-tags').value = '';
    } else {
      document.getElementById('post-status').textContent = '❌ 失败：' + (data.message || '未知错误');
      if (data.message === 'Bad credentials') {
        document.getElementById('post-status').textContent = '❌ Token 无效，请重新生成';
        localStorage.removeItem('gh_token');
        GH_TOKEN = '';
      }
    }
  })
  .catch(function(err) {
    document.getElementById('post-status').textContent = '❌ 网络错误：' + err.message;
  })
  .finally(function() {
    btn.disabled = false;
    btn.textContent = '发布文章';
  });
}
</script>
