// ==UserScript==
// @name         copy-notion-page-content-as-markdown
// @name:en Copy Notion Page Content AS Markdown
// @name:zh-CN 复制 Notion Page 内容为标准 Markdown 文本
// @description  复制 Notion Page 内容为标准 Markdown 文本。
// @description:zh-CN  复制 Notion Page 内容为标准 Markdown 文本。
// @description:en Copy Notion Page Content AS Markdown.
// @namespace    https://github.com/Seven-Steven/tampermonkey-scripts/tree/main/copy-notion-page-content-as-markdown
// @version      0.2.1
// @license MIT
// @author       Seven
// @match        *://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// ==/UserScript==

(function () {
  'use strict';

  init();

  /**
   * 初始化动作
   */
  function init() {
    window.addEventListener('copy', fixNotionMarkdownInClipboard);
  }

  /**
   * 修正剪切板中 markdown 的格式
   */
  function fixNotionMarkdownInClipboard(event) {
    navigator.clipboard.readText().then(text => {
      const markdown = fixMarkdownFormat(text);
      navigator.clipboard.writeText(markdown).then(() => {
      }, () => {
        console.log('failed.');
      })
    })
  }

  /**
   * 修正 markdown 格式
   */
  function fixMarkdownFormat(markdown) {
    if (!markdown) {
      return;
    }

    // 给没有 Caption 的图片添加默认 ALT 文字
    markdown = markdown.replaceAll(/\!(http.*\.\w+)/g, (match, group1) => {
      const processedText = decodeURIComponent(group1);
      console.log('regex', processedText);
      return `![picture](${processedText})`;
    });
    // 给有 Caption 的图片去除多余文字
    const captionRegex = /(\!\[(?<title>.+?)\]\(.*?\)\s*)\k<title>\s*/g;
    return markdown.replaceAll(captionRegex, '$1');
  }
})();