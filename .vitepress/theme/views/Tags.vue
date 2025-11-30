<script lang="ts" setup>
import type { View } from '../../utils/view'
import { useUrlSearchParams } from '@vueuse/core'
import { views } from 'virtual:views'
import REmpty from '../components/REmpty.vue'

const params = useUrlSearchParams<{ tag?: string, search?: string }>('history')

const inputElement = useTemplateRef<HTMLInputElement>('inputElement')
onMounted(() => inputElement.value?.focus())

const tagMap = computed(() => {
  const tagMap = new Map<string, View[]>()
  for (const view of views) {
    if (view.layout === 'resource') {
      for (const tag of view.tags || []) {
        const resources = tagMap.get(tag) || []
        resources.push(view)
        tagMap.set(tag, resources)
      }
    }
  }
  return tagMap
})

const tags = computed(() => {
  return Array.from(tagMap.value.keys())
    .filter(tag => tag.toLocaleLowerCase()
      .includes(params.search?.toLocaleLowerCase() || ''))
})

function handleTagClick(tag: string) {
  params.tag = tag
}

const searchViews = computed(() => {
  if (!tags.value.includes(params.tag || '')) {
    return []
  }
  return tagMap.value.get(params.tag || '') || []
})

function getTagCount(tag: string) {
  return tagMap.value.get(tag)?.length || 0
}
</script>

<template>
  <REmpty>
    <div class="Tags">
      <input ref="inputElement" v-model="params.search" class="search-input" type="text" placeholder="搜索标签">
      <template v-if="tags.length === 0">
        <p>暂无标签</p>
      </template>
      <template v-else>
        <RTags v-model:tag="params.tag" class="tags" :tags="tags" @tag-click="handleTagClick">
          <template #default="{ value }">
            {{ value }}:{{ getTagCount(value) }}
          </template>
        </RTags>
        <div v-if="params.tag !== undefined">
          <p><small>共 {{ searchViews.length }} 个结果</small></p>
          <RViewCards class="resources" is-collection :views="searchViews" />
        </div>
      </template>
    </div>

    <Content />
  </REmpty>
</template>

<style scoped>
.Tags .search-input {
  font-size: 1.125em;
  background-color: var(--vp-c-bg-soft);
  padding: .8em;
  text-align: center;
  width: 100%;
  margin: 1em 0;
  border-radius: 0.25em;
}
</style>
