<script setup lang="ts">
import type { View } from '../../utils/view'
import VPImage from '@vitepress-components/VPImage.vue'
import VPLink from '@vitepress-components/VPLink.vue'
import { useRouter, withBase } from 'vitepress'
import { useThemeConfig } from '../composables/theme-config'

defineProps<{ view: View }>()

const themeConfig = useThemeConfig()
const router = useRouter()

function handleTagClick(tag: string) {
  router.go(withBase(`/tags?tag=${encodeURIComponent(tag)}`))
}
</script>

<template>
  <VPLink
    v-if="view.layout === 'collection' || view.layout === 'resource'" class="RViewCard" :no-icon="true"
    :href="view.pathname" @click.prevent
  >
    <article class="box">
      <VPImage :image="view.icon" style="width: 48px; height: 48px; object-fit: contain;" />
      <h2 class="title" v-html="view.title" />
      <RTags v-if="view.layout === 'resource'" :tags="view.tags" @tag-click="handleTagClick" />
      <p v-if="view.description" class="description" v-html="view.description" />
      <div v-if="view.layout === 'resource' && view.togo" class="togo">
        <VPLink :href="view.togo" :no-icon="true" tag="a" @click.stop>
          {{ themeConfig.view.collection.gotoLabel }}
        </VPLink>
      </div>
    </article>
  </VPLink>
</template>

<style scoped>
.RViewCard {
  display: block;
  border-radius: 8px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  border: 1px solid var(--vp-c-gutter);
  cursor: pointer;
}

.RViewCard:hover {
  border-color: var(--vp-c-brand-3);
}

.RViewCard .box h2 {
  margin: 0 0 8px !important;
  padding: 0 !important;
  border-top: none !important;
}

.RViewCard .box p {
  margin: 0 !important;
  padding-top: 8px;
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
}

.box> :deep(.VPImage) {
  margin-bottom: .45rem;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: .45rem;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  transition: background-color 0.25s;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.description {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.togo {
  padding-top: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  justify-content: end;
  opacity: 0.5;
}

.togo:hover {
  opacity: 1;
}
</style>
