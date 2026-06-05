---
title: 头图预览
date: 2026-06-05 23:30:00
---

# 🖼️ 头图素材库

选择你喜欢的图片用作文章头图（banner）。右键复制图片地址，在文章 front-matter 中设置 `banner: /images/xxx.webp`。

---

## 封面图（cover）

可用于文章封面 `cover:` 字段。

<div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:16px">
{% for i in range(1, 9) %}
  {% set cover = '/images/covers/cover-' + i + '.webp' %}
  <div style="width:200px;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);background:var(--color-wrap)">
    <img src="{{ cover }}" style="width:100%;height:120px;object-fit:cover;display:block" loading="lazy">
    <div style="padding:8px;font-size:12px;text-align:center">
      <code style="word-break:break-all">cover: /images/covers/cover-{{ i }}.webp</code>
    </div>
  </div>
{% endfor %}
</div>

---

## 头图/背景图（banner）

可用于文章头图 `banner:` 字段。

<div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:16px">
  <div style="width:300px;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);background:var(--color-wrap)">
    <img src="/images/elaina-banner.webp" style="width:100%;height:180px;object-fit:cover;display:block" loading="lazy">
    <div style="padding:8px;font-size:12px;text-align:center">
      <code>banner: /images/elaina-banner.webp</code>
      <div style="color:var(--red-2);margin-top:4px">伊蕾娜横幅（默认头图）</div>
    </div>
  </div>
  <div style="width:300px;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.15);background:var(--color-wrap)">
    <img src="/images/elaina-avatar.webp" style="width:100%;height:180px;object-fit:cover;display:block" loading="lazy">
    <div style="padding:8px;font-size:12px;text-align:center">
      <code>banner: /images/elaina-avatar.webp</code>
      <div style="color:var(--red-2);margin-top:4px">伊蕾娜头像</div>
    </div>
  </div>
</div>

---

> 💡 **使用方式：** 在文章的 front-matter 中加入 `banner: /images/xxx.webp`，页面顶部就会显示对应头图。不设置则使用主题默认头图。
