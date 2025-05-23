<script setup lang='ts'>
import type { Resource } from '../types'
import { computedAsync } from '@vueuse/core'
import virtualResources from 'virtual:resources'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useQuery } from '../use/query'
import Resources from './Resources.vue'
import Tags from './Tags.vue'

const queryTag = useQuery('tag')
const querySearch = useQuery('search')
const querySearchRef = useTemplateRef<HTMLInputElement>('querySearchRef')
const resources = ref<Resource[]>(Object.values(virtualResources).flat())

onMounted(() => querySearchRef.value?.focus())

const tagMap = computed(() => {
  const tagMap = new Map<string, Resource[]>()
  for (const resource of resources.value) {
    for (const tag of resource.tags || []) {
      const resources = tagMap.get(tag) || []
      resources.push(resource)
      tagMap.set(tag, resources)
    }
  }
  return tagMap
})

const tags = computed(() => {
  return Array.from(tagMap.value.keys())
    .filter((tag) => {
      const tagLower = tag.toLocaleLowerCase()
      const queryLower = querySearch.value.toLocaleLowerCase()
      return tagLower.includes(queryLower)
    })
})

function handleTagClick(tag: string) {
  queryTag.value = tag
  queryTag.value = tag
}

const searchResources = computedAsync(async () => {
  if (!tags.value.includes(queryTag.value)) {
    return []
  }
  return tagMap.value.get(queryTag.value) || []
}, [])

function getTagCount(tag: string) {
  return tagMap.value.get(tag)?.length || 0
}
</script>

<template>
  <div class="ShowSearchTags">
    <input ref="querySearchRef" v-model="querySearch" class="search-input" type="text" placeholder="搜索标签">
    <template v-if="tags.length === 0">
      <p>暂无标签</p>
    </template>
    <template v-else>
      <Tags v-model:tag="queryTag" class="tags" :tags="tags" @tag-click="handleTagClick">
        <template #default="{ value }">
          {{ value }}:{{ getTagCount(value) }}
        </template>
      </Tags>
      <div v-if="queryTag !== ''">
        <p><small>共 {{ searchResources.length }} 个结果</small></p>
        <Resources class="resources" is-collection :resources="searchResources" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.ShowSearchTags .search-input {
  font-size: 1.125em;
  background-color: var(--vp-c-bg-soft);
  padding: .8em;
  text-align: center;
  width: 100%;
  margin: 1em 0;
  border-radius: 0.25em;
}
</style>
