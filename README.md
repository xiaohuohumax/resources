# Resource

这是一个资源仓库，用于存放一些常用的资源地址。

## ♻️ 提交流程

1. 编写文档
2. [可选] 修改版本号 `npm run changeset` `npm run changeset version`
3. 更新版本号 `npm i`
4. 拉取最新 `git pull`
5. 本地提交 `npm run commit`
6. 推送到远程仓库

## 📦 添加新集合

以添加 `工具集合` 为例，步骤如下：

1. 在 `src` 目录下创建以下文件结构

   ```text
   tools             // 文档推荐存放在同一目录下
    ├── color.md     // 颜色工具 (文档类型)
    ├── ...          // 其他    (文档或集合类型)
    └── index.md     // 工具集合 (集合类型)
   ```

2. 在 `tools/index.md` 中配置集合信息，参考: [集合模板 template/collection.md](./template/collection.md)
3. 在 `tools/color.md` 中配置文档信息，参考: [文档模板 template/doc.md](./template/doc.md)

## 🔧 检查链接

```bash
# 检查所有链接是否有效
npm run check

# 检查缓存中失败的链接是否有效
npm run check:cache
```

## 🗂️ 模板

- [集合模板 template/collection.md](./template/collection.md)
- [文档模板 template/doc.md](./template/doc.md)

## 📝 更新日志

[CHANGELOG.md](CHANGELOG.md)