---
# 集合
type: collection

# 该集合已被禁用
disabled: false

# 集合 ID
# 若不指定，则自动生成, 由文档路径生成
# 例如:
#   template/item/index.md -> template-item
#   template/item/other.md -> template-item-other
id: template

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

# 图标(可选)
icon:
  src: /logo.svg

# 标题
title: 工具集合
# 标签(可选)
tags:
  - 标签1
  - 标签2

---

# 工具集合

<!-- 显示标签 -->
<ShowTags />

<!-- 显示面包屑 -->
<ShowBreadcrumb />

<!-- 显示归属当前集合的资源 -->
<ShowResources />
