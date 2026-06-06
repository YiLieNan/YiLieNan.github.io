---
title: Hexo 博客搭建指南
date: 2026-06-04 17:30:00
tags: [Hexo, 教程]
categories: 学习
cover: /images/covers/cover-15.webp
---

## 前言

这篇教程记录了我搭建本博客的全过程，从零开始，一步步带你搭建一个漂亮的个人博客。

## 环境准备

需要安装以下工具：

1. **Node.js** (v12+) — [下载](https://nodejs.org/)
2. **Git** — [下载](https://git-scm.com/)

检查是否安装成功：

```bash
node --version
npm --version
git --version
```

## 安装 Hexo

```bash
npm install -g hexo-cli
hexo init my-blog
cd my-blog
npm install
```

## 选择主题

Hexo 有丰富的主题生态，我使用的是 [Reimu](https://github.com/D-Sketon/hexo-theme-reimu) 主题，二次元风格，很可爱。

安装主题：

```bash
npm install hexo-theme-reimu
```

然后在 \`_config.yml\` 中修改：

```yaml
theme: reimu
```

## 写第一篇文章

```bash
hexo new "我的第一篇文章"
```

编辑 \`source/_posts/\` 目录下的 Markdown 文件，用你最熟悉的 Markdown 语法写作。

## 本地预览

```bash
hexo server
```

打开 http://localhost:4000 就能看到效果了。

## 部署到 GitHub Pages

1. 在 GitHub 上创建仓库 \`你的用户名.github.io\`
2. 安装部署插件：

```bash
npm install hexo-deployer-git
```

3. 配置 \`_config.yml\`：

```yaml
deploy:
  type: git
  repo: https://github.com/你的用户名/你的用户名.github.io.git
  branch: main
```

4. 一键部署：

```bash
hexo deploy
```

几分钟后，访问 \`https://你的用户名.github.io\` 就能看到了！

## 总结

Hexo 是一个非常好用的静态博客框架，上手简单，主题丰富，配合 GitHub Pages 可以零成本拥有自己的博客。希望这篇教程对你有帮助！
