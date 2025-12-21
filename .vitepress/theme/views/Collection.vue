<script lang="ts" setup>
import type { CollectionView } from '../view'
import { collectionChildrenMap } from 'virtual:views'
import REmpty from '../components/REmpty.vue'
import { useView } from '../composables/view'

const view = useView<CollectionView>()
const views = computed(() => collectionChildrenMap[view.value.id])
</script>

<template>
  <REmpty>
    <RTitle :disable-anchor="true" />
    <RBreadcrumbs :view="view" />
    <RViewCards :views="views" />
    <Content />
    <template #doc-after>
      <RCard>
        <RGiscus />
      </RCard>
    </template>
  </REmpty>
</template>
