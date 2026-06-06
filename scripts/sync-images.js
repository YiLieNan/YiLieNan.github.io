#!/usr/bin/env node
/**
 * 图片同步脚本
 * 扫描 source/images/covers/ 和 source/images/backgrounds/ 目录，
 * 自动更新写作后台（source/write/index.html）中的封面和背景选项。
 *
 * 用法：node scripts/sync-images.js
 * 在 git push 之前运行，确保写作后台反映最新的图片资源。
 */

const fs = require("fs");
const path = require("path");

const BLOG_ROOT = path.resolve(__dirname, "..");
const COVERS_DIR = path.join(BLOG_ROOT, "source", "images", "covers");
const BGS_DIR = path.join(BLOG_ROOT, "images", "backgrounds");
const WRITE_FILE = path.join(BLOG_ROOT, "source", "write", "index.html");

// 获取封面列表，按编号排序
function getCovers() {
  if (!fs.existsSync(COVERS_DIR)) return [];
  return fs
    .readdirSync(COVERS_DIR)
    .filter((f) => f.startsWith("cover-") && f.endsWith(".webp"))
    .sort((a, b) => {
      const na = parseInt(a.match(/cover-(\d+)/)[1]);
      const nb = parseInt(b.match(/cover-(\d+)/)[1]);
      return na - nb;
    });
}

// 更新写作后台的封面下拉框
function updateWritePage(covers) {
  let content = fs.readFileSync(WRITE_FILE, "utf-8");

  // 替换封面下拉选项 (cover-1 ~ cover-N)
  const options = covers
    .map((f) => {
      const num = f.match(/cover-(\d+)/)[1];
      return `          <option value="${num}">cover-${num}</option>`;
    })
    .join("\n");

  // 找到旧的 options 区间并替换
  const startMarker = '<select id="cover-select"';
  const endMarker = "</select>";

  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) {
    console.error("ERROR: cover-select not found in write page!");
    return false;
  }
  const selectStart = content.indexOf(">", startIdx) + 1;
  const selectEnd = content.indexOf(endMarker, selectStart);

  const oldBlock = content.slice(selectStart, selectEnd);
  const newBlock = "\n" + options + "\n        ";

  content = content.slice(0, selectStart) + newBlock + content.slice(selectEnd);

  fs.writeFileSync(WRITE_FILE, content, "utf-8");
  console.log(`✓ Updated write page: ${covers.length} covers`);
  return true;
}

// 主函数
function main() {
  console.log("=== Image Sync Script ===\n");

  const covers = getCovers();
  console.log(`Found ${covers.length} covers`);
  console.log(`  First: ${covers[0]}`);
  console.log(`  Last:  ${covers[covers.length - 1]}`);

  if (covers.length === 0) {
    console.error("ERROR: No covers found!");
    process.exit(1);
  }

  const ok = updateWritePage(covers);
  if (ok) {
    console.log("\n✓ Done! Run 'git add -A && git commit' to save changes.");
  } else {
    process.exit(1);
  }
}

main();
