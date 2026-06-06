---
title: 关于我
date: 2026-06-06 18:30:00
---

<div id="intro-app" style="min-height:300px;text-align:center;padding:60px 0;color:#999">加载中...</div>

<script>
// ═══════ 数据 ═══════
var _data = {};
var _editing = false;

// ═══════ 渲染 ═══════
function render() {
  var d = _data;
  var mode = _editing ? 'edit' : 'view';
  var html = '';

  // 编辑按钮
  html += '<div style="text-align:right;padding:10px 20px 0;max-width:600px;margin:0 auto">';
  if (_editing) {
    html += '<button onclick="saveIntro()" style="padding:6px 18px;border:none;border-radius:8px;background:#7c3aed;color:#fff;font-size:13px;cursor:pointer;margin-right:6px">💾 保存</button>';
    html += '<button onclick="toggleEdit()" style="padding:6px 18px;border:1px solid #ddd;border-radius:8px;background:#fff;color:#666;font-size:13px;cursor:pointer">✕ 退出编辑</button>';
  } else {
    html += '<button onclick="toggleEdit()" style="padding:6px 18px;border:1px solid #ddd;border-radius:8px;background:#fff;color:#666;font-size:13px;cursor:pointer">✏️ 编辑</button>';
  }
  html += '<div id="intro-save-status" style="font-size:12px;color:#059669;margin-top:4px"></div>';
  html += '</div>';

  // 头像
  var avatarSrc = d.avatar || '/images/elaina-avatar.webp';
  html += '<div style="position:relative;display:inline-block;margin-top:10px">';
  html += '<img id="intro-avatar-img" src="' + avatarSrc + '" style="width:120px;height:120px;border-radius:50%;object-fit:cover;box-shadow:0 4px 20px rgba(0,0,0,0.1);border:3px solid #fff">';
  if (_editing) {
    html += '<div style="position:absolute;bottom:0;right:0;background:#7c3aed;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.3)" onclick="edits.show()">✏️</div>';
  }
  html += '</div>';

  // 昵称
  var nameText = d.name || '昵称';
  if (_editing) {
    html += '<div style="margin:16px auto 8px;max-width:400px">';
    html += '<input id="edit-name" value="' + esc(nameText) + '" style="width:100%;padding:8px 12px;border:2px solid #7c3aed;border-radius:8px;font-size:22px;text-align:center;outline:none;color:#d63031;font-weight:bold;box-sizing:border-box">';
    html += '</div>';
  } else {
    html += '<h1 style="font-size:26px;color:#d63031;margin:16px 0 8px">' + esc(nameText) + '</h1>';
  }

  // 简介
  if (_editing) {
    html += '<div style="margin:0 auto 8px;max-width:400px">';
    html += '<input id="edit-bio" value="' + esc(d.bio || '') + '" placeholder="一句简介" style="width:100%;padding:8px 12px;border:2px solid #7c3aed;border-radius:8px;font-size:14px;text-align:center;outline:none;color:#555;box-sizing:border-box">';
    html += '</div>';
  } else if (d.bio) {
    html += '<p style="font-size:15px;color:#555;margin:0 20px 20px;line-height:1.6">' + esc(d.bio) + '</p>';
  }

  // 详细介绍
  if (_editing) {
    html += '<div style="margin:0 auto 16px;max-width:400px">';
    html += '<textarea id="edit-desc" rows="3" placeholder="详细介绍自己" style="width:100%;padding:8px 12px;border:2px solid #7c3aed;border-radius:8px;font-size:13px;text-align:center;outline:none;color:#888;box-sizing:border-box;resize:vertical">' + esc(d.description || '') + '</textarea>';
    html += '</div>';
  } else if (d.description) {
    html += '<p style="font-size:14px;color:#888;margin:0 20px 30px;line-height:1.6">' + esc(d.description) + '</p>';
  }

  // 链接
  if (_editing) {
    html += '<div style="max-width:400px;margin:0 auto 10px">';
    html += '<textarea id="edit-links" rows="4" placeholder="GitHub|https://github.com/YiLieNan" style="width:100%;padding:8px 12px;border:2px solid #7c3aed;border-radius:8px;font-size:13px;outline:none;color:#555;box-sizing:border-box;resize:vertical">';
    if (d.links) d.links.forEach(function(l) { html += l.label + '|' + l.url + '\n'; });
    html += '</textarea>';
    html += '<div style="font-size:11px;color:#aaa;text-align:left;margin-top:2px">每行一条：名称|链接</div>';
    html += '</div>';
  } else if (d.links && d.links.length) {
    html += '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;padding:0 20px 30px">';
    d.links.forEach(function(l) {
      html += '<a href="' + l.url + '" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;background:#fce8e8;color:#d63031;text-decoration:none;font-size:14px">' + esc(l.label) + '</a>';
    });
    html += '</div>';
  }

  document.getElementById('intro-app').innerHTML = html;
}

function esc(s) {
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ═══════ 编辑模式 ═══════
function toggleEdit() {
  _editing = !_editing;
  render();
}

// ═══════ 加载 ═══════
function loadIntro() {
  fetch('/intro/data.json')
    .then(function(r) { return r.json(); })
    .then(function(d) { _data = d; render(); })
    .catch(function() {
      document.getElementById('intro-app').innerHTML = '<p style="padding:40px;color:var(--red-1)">加载失败</p>';
    });
}

// ═══════ 保存 ═══════
function saveIntro() {
  var token = prompt('请输入 GitHub Token（仅首次需要，页面刷新后失效）');
  if (!token) return;

  _data.name = document.getElementById('edit-name').value.trim();
  _data.bio = document.getElementById('edit-bio').value.trim();
  _data.description = document.getElementById('edit-desc').value.trim();
  _data.avatar = _data.avatar || '/images/elaina-avatar.webp';

  var links = [];
  var linksRaw = document.getElementById('edit-links').value.trim();
  if (linksRaw) {
    linksRaw.split('\n').forEach(function(line) {
      var parts = line.split('|');
      if (parts.length >= 2) links.push({ label: parts[0].trim(), url: parts[1].trim(), icon: '' });
    });
  }
  _data.links = links;

  var content = btoa(unescape(encodeURIComponent(JSON.stringify(_data, null, 2))));
  document.getElementById('intro-save-status').textContent = '⏳ 保存中...';

  // 先获取 sha
  fetch('https://api.github.com/repos/YiLieNan/YiLieNan.github.io/contents/source/intro/data.json', {
    headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
  })
  .then(function(r) {
    if (r.status === 404) return null;
    return r.json();
  })
  .then(function(existing) {
    var body = { message: 'update intro', content: content, branch: 'main' };
    if (existing && existing.sha) body.sha = existing.sha;

    return fetch('https://api.github.com/repos/YiLieNan/YiLieNan.github.io/contents/source/intro/data.json', {
      method: 'PUT',
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.content) {
      document.getElementById('intro-save-status').textContent = '✅ 已保存！1-2分钟部署后生效';
      _editing = false;
      render();
    } else {
      document.getElementById('intro-save-status').textContent = '❌ 失败: ' + (data.message || '未知错误');
    }
  })
  .catch(function(err) {
    document.getElementById('intro-save-status').textContent = '❌ 失败: ' + err.message;
  });
}

loadIntro();
</script>
