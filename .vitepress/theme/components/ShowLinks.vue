<script setup lang='ts'>
import type { Resource } from '../types'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { useFrontmatter } from '../use/frontmatter'

const frontmatter = useFrontmatter<Resource>()
</script>

<template>
  <div v-if="frontmatter.type === 'doc'" class="VPResourceLinks custom-block">
    <VPLink v-for="(link, index) in frontmatter.links" :key="index" :href="link.link" :no-icon="true">
      {{ link.text }}
    </VPLink>
  </div>
</template>

<style scoped>
.VPResourceLinks {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  padding: 16px;
}

.VPResourceLinks a {
  margin-right: 10px;
}
</style>
