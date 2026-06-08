#!/usr/bin/env node
/**
 * 构建后验证脚本 - 检查所有页面是否正常生成
 * 用法: node scripts/validate-build.js
 * 在 hexo generate 之后、git push 之前运行
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIN_SIZE = 100; // 页面至少 100 字节，小于此值视为空页

let errors = [];
let warnings = [];

// 递归遍历目录找 index.html
function walkDir(dir, depth = 0) {
  if (depth > 5) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walkDir(full, depth + 1);
      } else if (e.name === 'index.html') {
        const size = fs.statSync(full).size;
        const relPath = path.relative(PUBLIC_DIR, full);
        if (size === 0) {
          errors.push(`空文件(0字节): ${relPath}`);
        } else if (size < MIN_SIZE) {
          warnings.push(`文件过小(${size}B): ${relPath}`);
        }
      }
    }
  } catch (err) {
    errors.push(`无法读取目录: ${dir}`);
  }
}

// 检查关键页面
const KEY_PAGES = [
  'index.html',
  'tags/index.html',
  'categories/日常/index.html',
  'categories/学习/index.html',
  'about/index.html',
];

for (const p of KEY_PAGES) {
  const full = path.join(PUBLIC_DIR, p);
  if (fs.existsSync(full)) {
    const size = fs.statSync(full).size;
    if (size === 0) {
      errors.push(`关键页面为空: ${p}`);
    }
  } else {
    errors.push(`关键页面缺失: ${p}`);
  }
}

// 检查最新文章
const postsDir = path.join(PUBLIC_DIR);
const dateDirs = [];
walkDir(PUBLIC_DIR);

console.log('=== 构建验证报告 ===\n');

if (errors.length > 0) {
  console.log('❌ 错误:');
  errors.forEach(e => console.log(`  ${e}`));
}
if (warnings.length > 0) {
  console.log('⚠️  警告:');
  warnings.forEach(w => console.log(`  ${w}`));
}
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ 所有页面正常');
}

console.log(`\n总共: ${errors.length} 错误, ${warnings.length} 警告`);

process.exit(errors.length > 0 ? 1 : 0);
