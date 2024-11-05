<script setup lang='ts'>
import type { Resource } from '../types'
import virtualBreadcrumb from 'virtual:breadcrumb'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { computed } from 'vue'
import { useFrontmatter } from '../use/frontmatter'

const frontmatter = useFrontmatter<Resource>()
const breadcrumbs = computed(() => {
  const parents = frontmatter.value.belong.id
    ? virtualBreadcrumb[frontmatter.value.belong.id]
    : []

  return parents.concat({
    title: frontmatter.value.title,
    path: frontmatter.value.path,
  })
})

function isAllowClick(index: number) {
  return index !== breadcrumbs.value.length - 1 && index !== 0
}
</script>

<template>
  <div v-if="breadcrumbs.length > 0" class="VPBreadcrumb">
    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <span v-if="index !== 0" class="VPBreadcrumb-separator">/</span>
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
