<script setup lang='ts'>
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { useData } from 'vitepress';
import { RLink } from '../types'
import { computed } from 'vue'

const { frontmatter } = useData();

const links = computed(() => frontmatter.value.links as RLink[])

const isDoc = computed(() => frontmatter.value.type === 'doc')
</script>

<template>
  <div class="VPResourceLinks custom-block" v-if="isDoc">
    <VPLink :href="link.link" :no-icon="true" v-for="(link, index) in links" :key="index">
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