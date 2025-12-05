<script lang="ts" setup>
import type { CollectionView } from '../../view'
import { collectionChildrenMap } from 'virtual:views'
import REmpty from '../components/REmpty.vue'
import { useFrontmatter } from '../composables/frontmatter'

const frontmatter = useFrontmatter<CollectionView>()
const views = computed(() => collectionChildrenMap[frontmatter.value.id])
</script>

<template>
  <REmpty>
    <RTitle :disable-anchor="true" />
    <RBreadcrumbs :view="frontmatter" />
    <RViewCards :views="views" />
    <Content />
  </REmpty>
</template>
