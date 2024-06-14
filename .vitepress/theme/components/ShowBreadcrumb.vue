<script setup lang='ts'>
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { useData } from 'vitepress';
import { computed } from 'vue';
import { Breadcrumb } from '../types'

const { frontmatter } = useData();

const breadcrumbs = computed(() => frontmatter.value.breadcrumbs as Breadcrumb[]);
</script>

<template>
  <div class="VPBreadcrumb" v-if="breadcrumbs">
    <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <span class="VPBreadcrumb-separator" v-if="index != 0">/</span>
      <VPLink v-if="breadcrumb.allowClick" :href="breadcrumb.path" :no-icon="true">
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