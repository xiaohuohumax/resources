<script lang="ts" setup>
import type { Icon, View } from '../../view'
import VPImage from '@vitepress-components/VPImage.vue'
import VPLink from '@vitepress-components/VPLink.vue'
import { views } from 'virtual:views'
import { useFrontmatter } from '../composables/frontmatter'
import { useTheme } from '../composables/theme'

const props = defineProps<{ id: string, alt: string }>()
const theme = useTheme()
const view = computed(() => views.find(v => v.id === props.id))
const icon = computed(() => (view.value as Partial<Icon>).icon)

if (import.meta.env.PROD) {
  if (!views.find(v => v.id === props.id)) {
    const frontmatter = useFrontmatter<View>()
    throw new Error(`View "${props.id}"("${props.alt}") not found in "${frontmatter.value.pathname}"`)
  }
}
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
  <div v-else class="RRelatedView">
    <div class="content">
      <p class="title">
        {{ theme.relatedView.notFound }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.RRelatedView {
  align-items: center;
  background-color: var(--vp-c-bg-alt);
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
