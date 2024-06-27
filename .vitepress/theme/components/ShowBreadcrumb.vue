<script setup lang='ts'>
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { useData } from 'vitepress';
import { computed } from 'vue'
import virtualBreadcrumb from 'virtual:breadcrumb'
import { Resource } from '../types';

const { frontmatter } = useData();

const isResource = computed(() => ['collection', 'doc'].includes(frontmatter.value.type))

const breadcrumbs = computed(() => {
  if (!isResource.value) {
    return []
  }
  const resource = frontmatter.value as Resource;

  const parents = resource.belong.id ? virtualBreadcrumb[resource.belong.id] : [];
  return parents.concat({
    title: resource.title,
    path: resource.path
  })
})

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