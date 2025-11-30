<script setup lang="ts">
import type { Resource } from '../../utils/view'
import VPDoc from '@vitepress-components/VPDoc.vue'
import { useFrontmatter } from '../composables/frontmatter'

const router = useRouter()
const frontmatter = useFrontmatter<Resource>()

function handleTagClick(tag: string) {
  router.go(withBase(`/tags?tag=${encodeURIComponent(tag)}`))
}
</script>

<template>
  <div class="Resource">
    <VPDoc>
      <template #doc-before>
        <div class="vp-doc">
          <RLogo />
          <RTitle />
          <RTags :tags="frontmatter.tags" @tag-click="handleTagClick" />
          <RBreadcrumbs />
          <RLinks />
          <RDescription />
        </div>
      </template>
    </VPDoc>
  </div>
</template>

<style scoped>
::v-deep(.VPDoc) {
  padding: 32px 24px 0 ;
}

::v-deep(.VPDoc) .container,
::v-deep(.VPDoc) .content,
::v-deep(.VPDoc) .content-container {
  max-width: 1152px !important;
}

::v-deep(.VPDoc)>.container>.content {
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid var(--vp-c-gutter);
  backdrop-filter: blur(10px);
  border-radius: 8px;
}

@media (min-width: 640px) {
  ::v-deep(.VPDoc)>.container>.content {
    padding: 32px;
  }
}

@media (min-width: 768px) {
  ::v-deep(.VPDoc) {
    padding: 48px 32px 0;
  }
}

@media (min-width: 960px) {
  ::v-deep(.VPDoc) {
    padding: 48px 32px 0;
    margin-bottom: 32px;
  }
}
</style>
