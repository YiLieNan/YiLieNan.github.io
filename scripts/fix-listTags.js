/**
 * 修复 Reimu 主题 listTags 在 Node 20+ 的兼容性问题
 *
 * 主题原版 listTags.js 在 tag.ejs/listTags() 中调用 tags.sort(orderby, order)
 * 但 Node 20+ V8 严格化了 Array.sort()，非函数参数导致
 * "The comparison function must be either a function or undefined" 错误，
 * 以及后续 "str must be a string" 错误（tag.name 可能是 undefined）。
 *
 * 此脚本在 hexo 启动时覆盖原 helper，修复排序逻辑。
 */
const { escapeHTML } = require("hexo-util");

hexo.extend.helper.register("listTags", function (...args) {
  const [tagsParam, options, aosAttr] = args;

  // 判断是否只传了 options
  let tags, opts;
  if (
    !options &&
    (!tagsParam || !Object.prototype.hasOwnProperty.call(tagsParam, "length"))
  ) {
    opts = tagsParam;
    tags = this.site.tags;
  } else {
    tags = tagsParam;
    opts = options;
  }

  if (!tags || !tags.length) return "";

  opts = opts || {};
  const { style = "list", transform, separator = ", ", suffix = "" } = opts;
  const showCount = Object.prototype.hasOwnProperty.call(opts, "show_count")
    ? opts.show_count
    : true;
  const classStyle = typeof style === "string" ? `-${style}` : "";
  let className, ulClass, liClass, aClass, labelClass, countClass, labelSpan;

  if (typeof opts.class !== "undefined") {
    if (typeof opts.class === "string") {
      className = opts.class;
    } else {
      className = "tag";
    }
    ulClass = opts.class.ul || `${className}${classStyle}`;
    liClass = opts.class.li || `${className}${classStyle}-item`;
    aClass = opts.class.a || `${className}${classStyle}-link`;
    labelClass = opts.class.label || `${className}${classStyle}-label`;
    countClass = opts.class.count || `${className}${classStyle}-count`;
    labelSpan = Object.prototype.hasOwnProperty.call(opts.class, "label");
  } else {
    className = "tag";
    ulClass = `${className}${classStyle}`;
    liClass = `${className}${classStyle}-item`;
    aClass = `${className}${classStyle}-link`;
    labelClass = `${className}${classStyle}-label`;
    countClass = `${className}${classStyle}-count`;
    labelSpan = false;
  }

  const orderby = opts.orderby || "name";
  const order = opts.order || 1;

  // 将 Hexo Model 转为普通数组（兼容不可迭代的 Schema）
  const arr = [];
  tags.forEach((t) => arr.push(t));

  // 使用标准 sort 比较函数
  arr.sort((a, b) => {
    let aVal = a[orderby] || a.name;
    let bVal = b[orderby] || b.name;
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (aVal < bVal) return -1 * order;
    if (aVal > bVal) return 1 * order;
    return 0;
  });

  // 限制数量
  let tagList = arr;
  if (opts.amount) tagList = tagList.slice(0, opts.amount);

  let result = "";

  if (style === "list") {
    result += `<ul class="${ulClass}" itemprop="keywords">`;
    tagList.forEach((tag) => {
      if (!tag) return;
      result += `<li class="${liClass}">`;
      result += `<a class="${aClass}" href="${this.url_for_lang(tag.path)}${suffix}" rel="tag" title="${escapeHTML(String(tag.name || ""))}">`;
      result += transform ? transform(tag.name) : escapeHTML(String(tag.name || ""));
      result += "</a>";
      if (showCount) {
        result += `<span class="${countClass}">${tag.length}</span>`;
      }
      result += "</li>";
    });
    result += "</ul>";
  } else {
    tagList.forEach((tag, i) => {
      if (!tag) return;
      if (i) result += separator;
      result += `<a class="${aClass}" href="${this.url_for_lang(tag.path)}${suffix}" rel="tag" title="${escapeHTML(String(tag.name || ""))}">`;
      if (labelSpan) {
        result += `<span class="${labelClass}">${
          transform ? transform(tag.name) : tag.name
        }</span>`;
      } else {
        result += transform ? transform(tag.name) : tag.name;
      }
      if (showCount) {
        result += `<span class="${countClass}">${tag.length}</span>`;
      }
      result += "</a>";
    });
  }

  // 添加 data-aos 属性
  if (aosAttr && style === "list") {
    result = result.replace(
      /<li class="([^"]+)">/g,
      `<li class="$1" data-aos="${aosAttr}">`
    );
  }

  return result;
});
