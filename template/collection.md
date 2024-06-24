---
# 集合
type: collection
# 集合 ID 
# 若不指定，则自动生成, 由文档路径生成
# 例如: 
#   template/index.md -> template
#   template/other.md -> template-other
id: template

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
<ShowResources />