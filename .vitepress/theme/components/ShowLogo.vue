<script setup lang='ts'>
import type { DefaultTheme } from 'vitepress'
import { useData } from 'vitepress'
import VPImage from 'vitepress/dist/client/theme-default/components/VPImage.vue'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
}>(), {
  width: 86,
  height: 86,
})

const { frontmatter } = useData()

const icon = computed(() => frontmatter.value.icon as DefaultTheme.FeatureIcon)
</script>

<template>
  <div class="ShowLogo" :style="{ '--icon-width': props.width, '--icon-height': props.height }">
    <div v-if="typeof icon === 'object' && icon.wrap" class="icon">
      <VPImage :image="icon" :alt="icon.alt" />
    </div>
    <VPImage v-else-if="typeof icon === 'object'" :image="icon" :alt="icon.alt" />
    <div v-else-if="icon" class="icon" v-html="icon" />
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
