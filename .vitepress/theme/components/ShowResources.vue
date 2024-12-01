<script setup lang="ts" async>
import type { Collection } from '../types'
import virtualResources from 'virtual:resources'
import { useFrontmatter } from '../use/frontmatter'
import Resources from './Resources.vue'

const frontmatter = useFrontmatter<Collection>()
</script>

<template>
  <div class="Resources">
    <Resources :resources="virtualResources[frontmatter.id]" />
  </div>
</template>
