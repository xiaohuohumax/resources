---
# 文档
type: doc

# 该集合已被禁用
disabled: false

belong:
  # 归属集合 ID
  # null 则表示不归属任何集合, 为顶级集合
  # 若不指定，则自动生成, 由文档路径生成
  # 例如:
  #   template/item/index.md  -> template
  #   template/item/other.md  -> template-item
  #   template/other.md       -> template
  id: null
  # 归属集合排序 (越小越靠前, 默认0)
  # order: 0

# 图标
icon:
  src: /logo.svg

# 标题
title: 标题
# 简介
description: 这是一段描述。

# 资源链接(可添加多个)
links:
  # 链接名称
  - text: 🎨工具地址
  # 链接地址
    link: &togo ~~~

# 链接直达(可选)
togo: *togo
# 链接直达文字描述(可选)
# togoText: 链接直达
---

<!-- 显示 Logo -->
<ShowLogo />

# 标题

<!-- 显示面包屑 -->
<ShowBreadcrumb />

## 资源链接

<!-- 显示资源链接 links -->
<ShowLinks />

## 简介

这是一段描述。