<script lang="ts" setup>
import type { View } from '../../view'
import { views } from 'virtual:views'
import REmpty from '../components/REmpty.vue'
import { useQuery } from '../composables/query'
import { useTheme } from '../composables/theme'

const params = useQuery<{ tag?: string, search?: string }>()
const theme = useTheme()

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
      .includes(params.value.search?.toLocaleLowerCase() || ''))
})

function handleTagClick(tag: string) {
  params.value.tag = tag
}

const searchViews = computed(() => {
  if (!tags.value.includes(params.value.tag || '')) {
    return []
  }
  return tagMap.value.get(params.value.tag || '') || []
})

function getTagCount(tag: string) {
  return tagMap.value.get(tag)?.length || 0
}
</script>

<template>
  <REmpty>
    <RTitle />
    <div class="Tags">
      <input ref="inputElement" v-model="params.search" class="search-input" type="text" placeholder="搜索标签">
      <template v-if="tags.length === 0">
        <p>{{ theme.view.tags }}</p>
      </template>
      <template v-else>
        <RTags v-model:tag="params.tag" class="tags" :tags="tags" :space-between="true" @tag-click="handleTagClick">
          <template #default="{ value }">
            {{ value }}:{{ getTagCount(value) }}
          </template>
        </RTags>
        <div v-if="params.tag !== undefined">
          <p><small>{{ theme.view.tags.countLabel }} {{ searchViews.length }}</small></p>
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
  background-color: var(--vp-c-bg);
  padding: .8em;
  text-align: center;
  width: 100%;
  margin: 1em 0;
  border-radius: 0.25em;
}
</style>
