<script setup lang='ts'>
import type { RLink } from '../types'
import { useData } from 'vitepress'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { computed } from 'vue'

const { frontmatter } = useData()

const isDoc = computed(() => frontmatter.value.type === 'doc')

const links = computed(() => frontmatter.value.links as RLink[])
</script>

<template>
  <div v-if="isDoc" class="VPResourceLinks custom-block">
    <VPLink v-for="(link, index) in links" :key="index" :href="link.link" :no-icon="true">
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
