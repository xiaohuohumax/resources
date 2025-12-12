<script setup lang='ts'>
import type { View } from '../view'
import VPLink from '@vitepress-components/VPLink.vue'
import { breadcrumbMap } from 'virtual:views'

const props = withDefaults(defineProps<{ view: View, disabledClick?: boolean }>(), { disabledClick: false })
const views = computed(() => breadcrumbMap[props.view.id])

function isAllowClick(index: number) {
  return props.disabledClick
    ? false
    : index !== views.value.length - 1 && index !== 0
}
</script>

<template>
  <div v-if="views.length > 0" class="RBreadcrumbs">
    <template v-for="(v, index) in views" :key="v.id">
      <span v-if="index !== 0" class="separator">/</span>
      <VPLink v-if="isAllowClick(index)" :href="v.pathname" :no-icon="true">
        {{ v.title }}
      </VPLink>
      <span v-else>{{ v.title }}</span>
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
