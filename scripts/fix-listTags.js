/**
 * 修复 Reimu 主题 listTags 在 Node 20+ 的兼容性问题
 *
 * 主题原版：tags.sort(orderby, order) → Node 20+ 的 Array.sort() 不接受非函数参数
 * 导致 page 类型页面（关于、标签等）全部构建失败。
 *
 * 必须在 after_init 中注册，确保主题的 buggy helper 已被 override。
 */
const { escapeHTML } = require("hexo-util");

function fixedListTags() {
  return function (...args) {
    const [tagsParam, options, aosAttr] = args;
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

    // Hexo Model → plain array via forEach
    const arr = [];
    tags.forEach(function (t) { arr.push(t); });

    arr.sort(function (a, b) {
      var aVal = a[orderby] || a.name;
      var bVal = b[orderby] || b.name;
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (aVal < bVal) return -1 * order;
      if (aVal > bVal) return 1 * order;
      return 0;
    });

    var tagList = arr;
    if (opts.amount) tagList = tagList.slice(0, opts.amount);

    var result = "";

    function esc(s) { return escapeHTML(String(s || "")); }
    function url(p) { return this.url_for_lang(p); }

    if (style === "list") {
      result += '<ul class="' + ulClass + '" itemprop="keywords">';
      tagList.forEach(function (tag) {
        if (!tag) return;
        result += '<li class="' + liClass + '">';
        result += '<a class="' + aClass + '" href="' + url.call(this, tag.path) + suffix + '" rel="tag" title="' + esc(tag.name) + '">';
        result += transform ? transform(tag.name) : esc(tag.name);
        result += "</a>";
        if (showCount) result += '<span class="' + countClass + '">' + tag.length + "</span>";
        result += "</li>";
      }.bind(this));
      result += "</ul>";
    } else {
      tagList.forEach(function (tag, i) {
        if (!tag) return;
        if (i) result += separator;
        result += '<a class="' + aClass + '" href="' + url.call(this, tag.path) + suffix + '" rel="tag" title="' + esc(tag.name) + '">';
        if (labelSpan) {
          result += '<span class="' + labelClass + '">' + (transform ? transform(tag.name) : tag.name) + "</span>";
        } else {
          result += transform ? transform(tag.name) : tag.name;
        }
        if (showCount) result += '<span class="' + countClass + '">' + tag.length + "</span>";
        result += "</a>";
      }.bind(this));
    }

    if (aosAttr && style === "list") {
      result = result.replace(/<li class="([^"]+)">/g, '<li class="$1" data-aos="' + aosAttr + '">');
    }
    return result;
  };
}

// 在 after_init 中注册，确保主题的 listTags 已被覆盖
hexo.extend.filter.register("after_init", function () {
  hexo.extend.helper.register("listTags", fixedListTags());
});
