<script setup lang="ts">
import type { ResourceView } from '../view'
import VPDoc from '@vitepress-components/VPDoc.vue'
import RFavorite from '../components/RFavorite.vue'
import { useView } from '../composables/view'

const router = useRouter()
const view = useView<ResourceView>()

function handleTagClick(tag: string) {
  router.go(withBase(`/tags?tag=${encodeURIComponent(tag)}`))
}
</script>

<template>
  <div class="Resource">
    <VPDoc>
      <template #doc-before>
        <div class="vp-doc">
          <div class="header">
            <RLogo />
            <RFavorite :view="view" />
          </div>
          <RTitle />
          <RTags :tags="view.tags" @tag-click="handleTagClick" />
          <RBreadcrumbs :view="view" />
          <RLinks />
          <RDescription />
        </div>
      </template>
      <template #doc-after>
        <RGiscus />
      </template>
    </VPDoc>
  </div>
</template>

<style scoped>
.Resource .header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
