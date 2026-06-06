#!/usr/bin/env node
/**
 * 导航同步脚本
 * 从 _config.reimu.yml 读取菜单配置，自动生成 mobile-optimize.js 的底部 Tab Bar
 * 确保手机底栏和电脑顶栏完全一致。
 *
 * 用法：node scripts/sync-nav.js
 * 修改 _config.reimu.yml 的 menu 后运行此脚本，然后 git push 部署。
 */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const BLOG_ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(BLOG_ROOT, "_config.reimu.yml");
const MOBILE_JS_PATH = path.join(BLOG_ROOT, "source", "js", "mobile-optimize.js");

// 图标映射（Font Awesome unicode → emoji fallback）
const ICON_MAP = {
  f015: "🏠",  // home
  f002: "🔍",  // search
  f19d: "📚",  // 学习
  f0e7: "📝",  // 日常
  f007: "👤",  // about
  f2b9: "ℹ️",  // intro
  f2b5: "🔗",  // friend
  f02c: "🏷️",  // tags
};

function main() {
  // 读取配置
  const configRaw = fs.readFileSync(CONFIG_PATH, "utf-8");
  const config = yaml.load(configRaw);
  const menu = config.menu;

  if (!menu || !menu.length) {
    console.error("ERROR: No menu found in _config.reimu.yml");
    process.exit(1);
  }

  console.log(`Found ${menu.length} menu items:`);
  menu.forEach((item) => console.log(`  ${item.name} → ${item.url}`));

  // 生成 TAB_ITEMS 数组
  const items = menu.map((item) => {
    const icon = ICON_MAP[item.icon] || "📌";
    return `    { label: '${item.name}', url: '${item.url}', icon: '${icon}' }`;
  });

  const tabItemsCode = `  var TAB_ITEMS = [\n${items.join(",\n")}\n  ];`;

  // 读取 mobile-optimize.js
  let js = fs.readFileSync(MOBILE_JS_PATH, "utf-8");

  // 替换 TAB_ITEMS 定义
  const regex = /var TAB_ITEMS = \[[\s\S]*?\];/;
  if (!regex.test(js)) {
    console.error("ERROR: Cannot find TAB_ITEMS in mobile-optimize.js");
    process.exit(1);
  }
  js = js.replace(regex, tabItemsCode);

  // 写回文件
  fs.writeFileSync(MOBILE_JS_PATH, js, "utf-8");

  console.log(`\n✓ Updated mobile-optimize.js with ${menu.length} tab items`);
  console.log("  Run 'git add -A && git commit' to save changes.");
}

main();
