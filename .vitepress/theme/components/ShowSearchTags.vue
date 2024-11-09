<script setup lang='ts'>
import type { Resource } from '../types'
import { computedAsync } from '@vueuse/core'
import virtualResources from 'virtual:resources'
import { computed, ref, watch } from 'vue'
import { useQuery } from '../use/query'
import Resources from './Resources.vue'
import Tags from './Tags.vue'

const queryTag = useQuery('tag')
const searchTag = ref(queryTag.value || '')
const search = ref<string>('')
const loading = ref(true)

const resources = ref<Resource[]>([])

async function initTagCaches() {
  async function importResource(id: string) {
    for (const resource of (await (virtualResources[id]())).default) {
      resources.value.push(resource)
    }
  }
  const importJobs = []
  for (const id of Object.keys(virtualResources)) {
    importJobs.push(importResource(id))
  }
  await Promise.all(importJobs)
  loading.value = false
}

initTagCaches()

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
  const tags = Array.from(tagMap.value.keys())
  return tags.filter(tag => tag.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()))
})

watch(() => queryTag.value, () => searchTag.value = queryTag.value)
watch(() => tags.value, () => {
  if (!loading.value && !tags.value.includes(searchTag.value)) {
    searchTag.value = ''
  }
})

function handleTagClick(tag: string) {
  searchTag.value = tag
  queryTag.value = tag
}

const searchResources = computedAsync(async () => {
  return tagMap.value.get(searchTag.value) || []
}, [])

function getTagCount(tag: string) {
  return tagMap.value.get(tag)?.length || 0
}
</script>

<template>
  <div class="ShowSearchTags">
    <input v-model="search" class="search-input" type="text" placeholder="搜索标签">
    <template v-if="tags.length === 0">
      <p>暂无标签</p>
    </template>
    <template v-else>
      <Tags v-model:tag="searchTag" class="tags" :tags="tags" @tag-click="handleTagClick">
        <template #default="{ value }">
          {{ value }}:{{ getTagCount(value) }}
        </template>
      </Tags>
      <div v-if="searchTag !== ''">
        <p><small>共 {{ searchResources.length }} 个结果</small></p>
        <Resources class="resources" is-collection :resources="searchResources" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.ShowSearchTags .search-input{
  font-size: 1.125em;
  background-color: var(--vp-c-bg-soft);
  padding: .8em;
  text-align: center;
  width: 100%;
  margin: 1em 0;
  border-radius: 0.25em;
}
</style>
