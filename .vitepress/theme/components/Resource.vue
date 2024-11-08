<script setup lang="ts">
import type { Resource } from '../types'
import { useRouter, withBase } from 'vitepress'
import VPImage from 'vitepress/dist/client/theme-default/components/VPImage.vue'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import Tags from './Tags.vue'

defineProps<{
  resource: Resource
}>()

const router = useRouter()

function handleTagClick(tag: string, event: MouseEvent) {
  event.stopPropagation()
  router.go(withBase(`/resource/tags?tag=${encodeURIComponent(tag)}`))
}
</script>

<template>
  <VPLink class="Resource" :no-icon="true" tag="div" @click="router.go(withBase(resource.path))">
    <article class="box">
      <div v-if="typeof resource.icon === 'object' && resource.icon.wrap" class="icon">
        <VPImage
          :image="resource.icon" :alt="resource.icon.alt" :height="resource.icon.height || 48"
          :width="resource.icon.width || 48"
        />
      </div>
      <VPImage
        v-else-if="typeof resource.icon === 'object'" :image="resource.icon" :alt="resource.icon.alt"
        :height="resource.icon.height || 48" :width="resource.icon.width || 48"
      />
      <div v-else-if="resource.icon" class="icon" v-html="resource.icon" />
      <h2 class="title" v-html="resource.title" />
      <Tags v-if="resource.tags" :tags="resource.tags" @tag-click="handleTagClick" />
      <p v-if="resource.description" class="description" v-html="resource.description" />
      <div v-if="resource.togo" class="togo">
        <VPLink :href="resource.togo" :no-icon="true" :tag="resource.togo ? 'a' : 'div'">
          {{ resource.togoText || '直达' }}
        </VPLink>
      </div>
    </article>
  </VPLink>
</template>

<style scoped>
.Resource {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  cursor: pointer;
}

.Resource:hover {
  border-color: var(--vp-c-brand-1);
}

.Resource .box h2 {
  margin: 0 !important;
  padding: 0 !important;
  border-top: none !important;
}

.Resource .box p {
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
  margin-bottom: 20px;
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
