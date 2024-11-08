<script setup lang='ts'>
import type { Resource } from '../types'
import { useRouter, withBase } from 'vitepress'
import { useFrontmatter } from '../use/frontmatter'
import Tags from './Tags.vue'

const frontmatter = useFrontmatter<Resource>()
const router = useRouter()

function handleTagClick(tag: string) {
  router.go(withBase(`/resource/tags?tag=${encodeURIComponent(tag)}`))
}
</script>

<template>
  <div v-if="frontmatter.tags" class="ShowTags">
    <Tags :tags="frontmatter.tags" @tag-click="handleTagClick" />
  </div>
</template>

<style scoped>
.ShowTags {
  display: inline-block;
  margin-top: 0.5rem;
}
</style>
