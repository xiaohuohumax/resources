---
# 文档
type: doc

belong:
  # 将当前文档添加到 template 集合
  id: template
  # order: 9999

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