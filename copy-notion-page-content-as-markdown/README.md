# 一键复制 Notion 页面内容为标准 Markdown 格式

## 说明

一键复制 Notion 页面内容为标准 Markdown 格式。

## 功能

- [x] 修复 Notion Page Content 复制为 Markdown 后的格式错乱问题。

  包含以下内容：

  - 为没有 Caption 的图片添加默认的 alt 文本

    - 修复前：`!https://example.com/picture.png`

    - 修复后：`![picture](https://example.com/picture.png)`

  - 删除有 Caption 的图片后面多余的 Caption 文本
    - 修复前：

        ```text
        ![Caption](https://example.com/picture.png)

        Caption
        ```

    - 修复后：

        ```text
        ![Caption](https://example.com/picture.png)

        ```

- [x] 修正复制 Notion Page Content 后的 Markdown 格式错乱问题；
- [x] 添加一键复制功能；
- [x] 修正 Page Content 选区缺失最后一个 DOM 的问题；
- [ ] “复制”按钮定位跟随 Page Content 移动；

## 实现

### 插件装载时机

- 对于 view / database 等页面：Notion Page 可能会显示在 Center Peek / Side Peek 中。需要动态监听最近的祖先元素子节点变动，动态装载/卸载插件。

  页面结构如下：
  - div#notion-app
    - div.notion-app-inner
      - div.notion-cursor-listener 到这里是一定会有，再往下是 Peek，不一定会有
        - div.notion-peek-renderer
          - div.layout.layout-side-peek
            - div.notion-page-content

- 对于正常的 Notion Page 页面，只需要装载插件就好，不需要卸载。

结构如下：

- div#notion-app
  - div.notion-app-inner
    - div.notion-cursor-listener
      - main.notion-frame
        - div.notion-page-content

综上，我们只需要这样做：

- 开局就找 .notion-page-content
  - 如果找得到，装载插件，结束
  - 如果找不到，不做任何事情，结束。
- 同步查找 `#notion-app main.notion-frame .notion-page-content`
  - 如果找得到，代表当前页面是正常的 Notion Page 页面，装载插件
  - 如果找不到，代表当前页面是 view / database 页面， 给 #notion-app 添加 observe，监听其子节点变动，根据子节点变动情况动态装载 / 卸载插件。结束。

### 插件行为

- 先给 `window` 追加一个类型为 `copy` 的 `EventListener`，事件触发时，读取剪切板内容并修正 Markdown 格式；
- 往页面注入一个“复制”按钮，用户点击按钮时，自动选中 Notion 页面内容并触发 `copy` 事件；

## 参考资料

- [Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) | [Events](https://developer.mozilla.org/zh-CN/docs/Web/Events) | [DOM-Level-3-Events](https://www.w3.org/TR/DOM-Level-3-Events/#event-flow) | [JavaScript 事件顺序](https://www.quirksmode.org/js/events_order.html#link4)  JS 中的事件接口、事件类型、以及事件执行顺序。
- [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget)
- [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver)
  - [MutationRecord](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord)
    - [MutationRecord/addedNodes](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord/addedNodes)
    - [MutationRecord/removedNodes](https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord/removedNodes)
- [ClipboardAPI](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [ClipboardEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent)
- [copy_event](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/copy_event)
- [创建和触发事件](https://developer.mozilla.org/zh-CN/docs/Web/Events/Creating_and_triggering_events)
