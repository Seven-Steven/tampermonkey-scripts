# 修复 Notion Page Content 复制为 Markdown 后的格式错乱问题

修复 Notion Page Content 复制为 Markdown 后的格式错乱问题。

包含以下内容：

- 为没有 Caption 的图片添加默认的 alt 文本
  修复前：`!https://example.com/picture.png`
  修复后：`![picture](https://example.com/picture.png)`
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
