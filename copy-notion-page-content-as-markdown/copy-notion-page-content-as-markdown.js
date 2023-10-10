// ==UserScript==
// @name         copy-notion-page-content-as-markdown
// @name:en Copy Notion Page Content AS Markdown
// @name:zh-CN 复制 Notion Page 内容为标准 Markdown 文本
// @description  复制 Notion Page 内容为标准 Markdown 文本。
// @description:zh-CN  复制 Notion Page 内容为标准 Markdown 文本。
// @description:en Copy Notion Page Content AS Markdown.
// @namespace https://github.com/Seven-Steven/tampermonkey-scripts/blob/main/copy-notion-page-content-as-markdown
// @version      0.1.1
// @author       Seven
// @match        *://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        GM_setClipboard
// @supportURL https://github.com/Seven-Steven/tampermonkey-scripts/issues
// @license MIT
// ==/UserScript==

(function () {
  'use strict';

  init();

  /**
   * 初始化动作
   */
  function init() {
    waitFor('#notion-app .notion-page-content').then(([notionContentElement]) => {
      initCopyButton();
    });
  }

  /**
   * 初始化复制按钮
   */
  function initCopyButton() {
    let copyButton = document.createElement('div');

    copyButton.style.position = "fixed";
    copyButton.style.width = "88px";
    copyButton.style.height = "22px";
    copyButton.style.lineHeight = "22px";
    copyButton.style.top = "14%";
    copyButton.style.right = "1%";
    copyButton.style.background = "#0084ff";
    copyButton.style.fontSize = "14px";
    copyButton.style.color = "#fff";
    copyButton.style.textAlign = "center";
    copyButton.style.borderRadius = "6px";
    copyButton.style.zIndex = 10000;
    copyButton.style.cursor = "pointer";
    copyButton.style.opacity = 0.6;
    copyButton.innerHTML = "Copy Content";

    copyButton.addEventListener('click', copyPageContentAsync);
    console.log('initCopyButton');
    document.body.prepend(copyButton);
  }

  /**
   * 复制 Notion Page 内容
   */
  async function copyPageContentAsync() {
    await copyElementAsync('#notion-app .notion-page-content');

    const clipboardContent = await readClipboard();
    if (!clipboardContent) {
      showMessage('复制失败');
      return;
    }

    console.log('clipboardContent', clipboardContent);
    const markdownContent = fixMarkdownFormat(clipboardContent);
    console.log('markdown', markdownContent);

    GM_setClipboard(markdownContent);
    showMessage('复制成功');
  }

  /**
   * 修正 markdown 格式
   */
  function fixMarkdownFormat(markdown) {
    if (!markdown) {
      return;
    }

    // 给没有 Caption 的图片添加 ALT 文字
    return markdown.replaceAll(/\!(http.*\.\w+)/g, (match, group1) => {
      const processedText = decodeURIComponent(group1);
      console.log('regex', processedText);
      return `![picture](${processedText})`;
    });

    // TODO 给有 Caption 的图片去除多余文字
  }

  /**
   * 复制 DOM 元素（在 DOM 元素上执行复制操作）
   */
  async function copyElementAsync(selector) {
    const pageContent = document.querySelector(selector);
    pageContent.focus();

    let range = document.createRange();
    range.selectNodeContents(pageContent);

    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    await sleep(500);
    document.execCommand('copy');
    selection.removeAllRanges();
  }

  /**
   * 在页面显示提示信息
   */
  function showMessage(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.background = 'rgba(0, 0, 0, 0.8)';
    toast.style.color = 'white';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '9999';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 3000);
  }

  /**
   * 读取系统剪切板内容
   */
  async function readClipboard() {
    try {
      const clipText = await navigator.clipboard.readText();
      return clipText;
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  }

  /**
   * 等待指定 DOM 元素加载完成之后再执行方法
   */
  function waitFor(...selectors) {
    return new Promise(resolve => {
      const delay = 500;
      const f = () => {
        const elements = selectors.map(selector => document.querySelector(selector));
        if (elements.every(element => element != null)) {
          resolve(elements);
        } else {
          setTimeout(f, delay);
        }
      }
      f();
    });
  }

  /**
   * 延迟执行
   **/
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();