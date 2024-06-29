<script setup lang='ts'>
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { useData } from 'vitepress';
import { computed } from 'vue'
import { Resource } from '../types';
import virtualBreadcrumb from 'virtual:breadcrumb'

const { frontmatter } = useData();

const isResource = computed(() => ['collection', 'doc'].includes(frontmatter.value.type))

const breadcrumbs = computed(() => {
  if (!isResource.value) {
    return []
  }
  const resource = frontmatter.value as Resource;

  // 从虚拟模块中获取父级
  const parents = resource.belong.id ? virtualBreadcrumb[resource.belong.id] : [];

  // 添加自身
  return parents.concat({
    title: resource.title,
    path: resource.path
  })
})

/**
 * 判断是否允许点击
 * 第一个和最后一个禁止点击
 * @param index 面包屑索引
 */
function isAllowClick(index: number) {
  return index != breadcrumbs.value.length - 1 && index != 0
}
</script>

<template>
  <div class="VPBreadcrumb" v-if="isResource">
    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <span class="VPBreadcrumb-separator" v-if="index != 0">/</span>
      <VPLink v-if="isAllowClick(index)" :href="breadcrumb.path" :no-icon="true">
        {{ breadcrumb.title }}
      </VPLink>
      <span v-else>{{ breadcrumb.title }}</span>
    </template>
  </div>
</template>

<style scoped>
.VPBreadcrumb {
  margin: 16px 0;
}

.VPBreadcrumb-separator {
  padding: .5em;
}
</style>