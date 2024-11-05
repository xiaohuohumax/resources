<script setup lang='ts'>
import type { Resource } from '../types'
import VPImage from 'vitepress/dist/client/theme-default/components/VPImage.vue'
import { useFrontmatter } from '../use/frontmatter'

const frontmatter = useFrontmatter<Resource>()
</script>

<template>
  <div class="ShowLogo" :style="{ '--icon-width': 86, '--icon-height': 86 }">
    <div v-if="typeof frontmatter.icon === 'object' && frontmatter.icon.wrap" class="icon">
      <VPImage :image="frontmatter.icon" :alt="frontmatter.icon.alt" />
    </div>
    <VPImage v-else-if="typeof frontmatter.icon === 'object'" :image="frontmatter.icon" :alt="frontmatter.icon.alt" />
    <div v-else-if="frontmatter.icon" class="icon" v-html="frontmatter.icon" />
  </div>
</template>

<style scoped>
.ShowLogo {
  display: inline-block;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: background-color 0.25s;
}

::v-deep(.VPImage) {
  width: calc(var(--icon-width) * 1px);
  height: calc(var(--icon-height) * 1px);
}

@media (min-width: 640px) {
  ::v-deep(.VPImage) {
    width: calc(var(--icon-width) * 1.1px);
    height: calc(var(--icon-height) * 1.1px);
  }
}

@media (min-width: 768px) {
  ::v-deep(.VPImage) {
    width: calc(var(--icon-width) * 1.2px);
    height: calc(var(--icon-height) * 1.2px);
  }
}
</style>
