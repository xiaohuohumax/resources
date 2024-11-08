<script setup lang="ts" async>
import type { Collection } from '../types'
import { computedAsync } from '@vueuse/core'
import virtualResources from 'virtual:resources'
import { computed, ref, watch } from 'vue'
import { useFrontmatter } from '../use/frontmatter'
import Loading from './Loading.vue'
import Resources from './Resources.vue'

const frontmatter = useFrontmatter<Collection>()
const isCollection = computed(() => frontmatter.value.type === 'collection')
const loading = ref(true)

const resources = computedAsync(async () => {
  return isCollection.value
    ? (await (virtualResources[frontmatter.value.id]())).default
    : []
})

watch(resources, () => loading.value = false, { once: true })
</script>

<template>
  <div v-if="isCollection" class="Resources">
    <Loading :loading="loading">
      <Resources :resources="resources" />
    </Loading>
  </div>
</template>
