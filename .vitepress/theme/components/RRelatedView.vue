<script lang="ts" setup>
import type { Icon } from '../../view'
import VPImage from '@vitepress-components/VPImage.vue'
import VPLink from '@vitepress-components/VPLink.vue'
import { views } from 'virtual:views'

const props = defineProps<{ id: string }>()
const view = computed(() => views.find(v => v.id === props.id))
const icon = computed(() => (view.value as Partial<Icon>).icon)
</script>

<template>
  <VPLink v-if="view" :no-icon="true" :href="view.pathname">
    <div class="RRelatedView">
      <VPImage v-if="icon" :image="icon" />
      <div class="content">
        <p class="title">
          {{ view.title }}
        </p>
        <p class="description">
          {{ view.description }}
        </p>
      </div>
    </div>
  </VPLink>
</template>

<style scoped>
.RRelatedView {
  align-items: center;
  border: 1px solid var(--vp-c-gutter);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.content p {
  margin: 0;
}

.title {
  font-weight: bold;
}

.description {
  font-size: 0.8em;
}

::v-deep(.VPImage) {
  width: 40px;
  height:40px;
  flex-shrink: 0;
  margin-right: 10px;
}

@media (min-width: 640px) {
}

@media (min-width: 768px) {
  .RRelatedView{
    display: flex;
  }
  ::v-deep(.VPImage) {
    width: 48px;
    height: 48px;
  }
}
</style>
