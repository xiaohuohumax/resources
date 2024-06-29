# Resource

这是一个资源仓库，用于存放一些常用的资源地址。

## 🔖 书签

[bookmark.html](./dist/bookmark.html) 包含全部资源链接，可直接导入浏览器书签栏。

**注意**: 请勿格式化此文件，否则会导致书签无法正常导入。

## ✨ 附加功能

- 热更新资源集合、顶部菜单等
- 自动生成资源集合、顶部菜单
- 资源链接有效性检查
- 资源打包浏览器书签
- 本地搜索中文优化

## ♻️ 提交流程

1. 编写文档
2. [可选] 检查链接是否有效 `npm run check`
3. [可选] 修改版本号 `npm run changeset` `npm run version`
4. 拉取最新 `git pull`
5. 本地提交 `npm run commit`
6. 推送到远程仓库

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