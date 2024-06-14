# Resource

这是一个资源仓库，用于存放一些常用的资源地址。

## ♻️ 提交流程

1. 编写文档
2. [可选] 修改版本号 `npm run changeset` `npm run changeset version`
3. 拉取最新 `git pull`
4. 本地提交 `npm run commit`
5. 推送到远程仓库

## 📦 添加新集合

以添加 `工具集合` 为例，步骤如下：

1. 在 `src` 目录下创建以下文件结构

**PS:** **集合类型** 可以包含: [ **文档类型**, **集合类型** ]

```text
tools             // 文档推荐存放在同一目录下
 ├── color.md     // 颜色工具 (文档类型)
 ├── ...          // 其他工具
 └── index.md     // 工具集合 (集合类型)
```

2. 在 `tools/index.md` 中添加文档内容，参考如下：

```markdown
---
# 集合
type: collection
# 集合 ID 
# 若不指定，则自动生成, 由文档路径生成 
# 例如: 
#   tools/index.md -> tools
#   tools/other.md -> tools-other
id: tools

belong:
  # 归属集合 ID (null 则表示不归属任何集合, 为顶级集合)
  id: null
  # 归属集合排序 (越小越靠前, 默认9999)
  # order: 9999
# 图标
icon:
  src: /logo.svg
# 标题

title: 工具集合

---

# 工具集合

<!-- 显示面包屑 -->
<ShowBreadcrumb />

<!-- 显示归属当前集合的资源 -->
<ShowResources/>
```

3. 在 `tools/color.md` 中添加文档内容，参考如下：

```markdown
---
# 文档
type: doc

belong:
  # 将当前文档添加到 tools 集合
  id: tools
  # order: 9999
# 图标
icon:
  src: /logo.svg
# 标题

title: 颜色工具
# 简介
description: 这是一段描述。

# 资源链接
links:
  # 链接名称
  - text: 🎨工具地址
  # 链接地址
    link: &togo https:~~~~

# 链接直达(可选)
togo: *togo
# 链接直达文字描述(可选)
# togoText: 链接直达
---

<!-- 显示 Logo -->
<ShowLogo />

# 颜色工具

<!-- 显示面包屑 -->
<ShowBreadcrumb />

## 资源链接

<!-- 显示资源链接 links -->
<ShowLinks />

## 简介

这是一段描述。
```

## 🗂️ 模板

- [Collection](./src/__collection.md)
- [Doc](./src/__doc.md)

## 📝 更新日志

[CHANGELOG.md](CHANGELOG.md)