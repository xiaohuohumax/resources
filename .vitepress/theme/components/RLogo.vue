<script setup lang='ts'>
import type { Resource } from '../../utils/view'
import VPImage from '@vitepress-components/VPImage.vue'
import { useFrontmatter } from '../composables/frontmatter'

const frontmatter = useFrontmatter<Resource>()
</script>

<template>
  <div class="RLogo">
    <VPImage :image="frontmatter.icon" />
  </div>
</template>

<style scoped>
::v-deep(.VPImage) {
  width: 86px;
  height: 86px;
}

@media (min-width: 640px) {
  ::v-deep(.VPImage) {
    width: 96px;
    height: 96px;
  }
}

@media (min-width: 768px) {
  ::v-deep(.VPImage) {
    width: 106px;
    height: 106px;
  }
}
</style>
