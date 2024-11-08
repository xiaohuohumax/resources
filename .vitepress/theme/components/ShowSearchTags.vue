<script setup lang='ts'>
import type { Resource } from '../types'
import { computedAsync } from '@vueuse/core'
import virtualResources from 'virtual:resources'
import { computed, ref, watch } from 'vue'
import { useQuery } from '../use/query'
import Loading from './Loading.vue'
import Resources from './Resources.vue'
import Tags from './Tags.vue'

const queryTag = useQuery('tag')
const searchTag = ref(queryTag.value || '')
const search = ref<string>('')
const loading = ref(true)

const resources = computedAsync(async () => {
  const ids = Object.keys(virtualResources)
  const resourcesMap: { [id: string]: Resource } = {}
  for (const id of ids) {
    for (const resource of (await (virtualResources[id]())).default) {
      resourcesMap[resource.path] = resource
    }
  }

  return Object.values(resourcesMap)
})

const tagMap = computed(() => {
  const map = new Map<string, Resource[]>()

  for (const resource of resources.value || []) {
    for (const tag of resource.tags || []) {
      const tagResources = map.get(tag) || []
      tagResources.push(resource)
      map.set(tag, tagResources)
    }
  }

  return map
})

const tags = computed(() => {
  return Array.from(tagMap.value.keys())
    .filter(tag => tag.toLowerCase().includes(search.value.toLocaleLowerCase()))
})

watch(() => queryTag.value, () => searchTag.value = queryTag.value)
watch(() => resources.value, () => loading.value = false, { once: true })
watch(() => tags.value, () => {
  if (!tags.value.includes(searchTag.value)) {
    searchTag.value = ''
  }
})

function handleTagClick(tag: string) {
  searchTag.value = tag
  queryTag.value = tag
}

const searchResources = computed(() => {
  if (searchTag.value === '') {
    return []
  }
  const result: Resource[] = []
  for (const resource of resources.value || []) {
    if (resource.tags?.includes(searchTag.value)) {
      result.push(resource)
    }
  }
  return result
})

function getTagCount(tag: string) {
  return tagMap.value.get(tag)?.length || 0
}
</script>

<template>
  <div class="ShowSearchTags">
    <Loading :loading="loading">
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
    </Loading>
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
