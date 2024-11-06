<script setup lang='ts'>
import type { Resource } from '../types'
import { useFrontmatter } from '../use/frontmatter'
import Tags from './Tags.vue'

const frontmatter = useFrontmatter<Resource>()
</script>

<template>
  <div v-if="frontmatter.tags" class="ShowTags">
    {{ frontmatter.tags }}
    <Tags :tags="frontmatter.tags" />
  </div>
</template>

<style scoped>
.ShowTags {
  display: inline-block;
  margin-top: 0.5rem;
}
</style>
