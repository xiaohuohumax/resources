<script lang="ts" setup>
import type { Collection } from '../../utils/view'
import { collectionChildrenMap } from 'virtual:views'
import REmpty from '../components/REmpty.vue'
import { useFrontmatter } from '../composables/frontmatter'

const frontmatter = useFrontmatter<Collection>()
const views = computed(() => collectionChildrenMap[frontmatter.value.id])
</script>

<template>
  <REmpty>
    <RTitle :disable-anchor="true" />
    <RBreadcrumbs />
    <RViewCards :views="views" />
    <Content />
  </REmpty>
</template>
