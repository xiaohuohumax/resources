<script setup lang='ts'>
import type { Resource } from '../../utils/view'
import VPLink from '@vitepress-components/VPLink.vue'
import { breadcrumbMap } from 'virtual:views'
import { useFrontmatter } from '../composables/frontmatter'

const frontmatter = useFrontmatter<Resource>()
const views = computed(() => breadcrumbMap[frontmatter.value.id])

function isAllowClick(index: number) {
  return index !== views.value.length - 1 && index !== 0
}
</script>

<template>
  <div v-if="views.length > 0" class="RBreadcrumbs">
    <template v-for="(view, index) in views" :key="view.id">
      <span v-if="index !== 0" class="separator">/</span>
      <VPLink v-if="isAllowClick(index)" :href="view.pathname" :no-icon="true">
        {{ view.title }}
      </VPLink>
      <span v-else>{{ view.title }}</span>
    </template>
  </div>
</template>

<style scoped>
.RBreadcrumbs {
  margin: 8px 0;
}

.separator {
  padding: .5em;
}
</style>
