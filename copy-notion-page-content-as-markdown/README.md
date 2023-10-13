# 复制 Notion Page 内容为标准 Markdown 格式

## 说明

点击页面右上方的 “Copy Content” 按钮，一键复制 Notion Page 内容为标准 Markdown 文本。

感谢 [复制 Notion 页面正文内容](https://greasyfork.org/zh-CN/scripts/398563-copy-notion-page-content/code) 为本脚本提供了诸多参考。

## 实现思路

- 定义一个 [`MutationObserver`](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver) 监听 `#notion-app .notion-app-inner .notion-peek-renderer` 子节点变化：
  - 如果子节点添加 `.notion-page-content`，添加插件动作；
  - 如果子节点移除 `.notion-page-content`，移除插件动作；
- 插件动作：
  - 给 `window` 追加类型为 `copy` 的 `EventListener`，内容为：
    - 获取系统剪切板内容（此时 Notion 已经处理过剪切板，把复制的内容转换成了 Markdown，只是格式不太对）
    - 修正剪切板中的 Markdown 文本内容并写回到剪切板
  - 在页面添加“复制按钮”，用户点击复制按钮时，选中 `.notion-page-content` DOM，并触发复制动作

## 参考资料

- [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver)
  - [MutationRecord](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord)
    - [MutationRecord/addedNodes](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord/addedNodes)
    - [MutationRecord/removedNodes](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord/removedNodes)
- [ClipboardAPI](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [ClipboardEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent)
- [copy_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/copy_event)
- [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)
- [创建和触发事件](https://developer.mozilla.org/zh-CN/docs/Web/Events/Creating_and_triggering_events)
