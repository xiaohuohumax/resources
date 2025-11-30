<script lang="ts" setup>
import type { Resource } from '../../view'
import { string2Anchor } from '../../utils'
import { useFrontmatter } from '../composables/frontmatter'

withDefaults(defineProps<{ disableAnchor?: boolean }>(), { disableAnchor: false })

const frontmatter = useFrontmatter<Resource>()
const anchor = string2Anchor(frontmatter.value.title)
</script>

<template>
  <h1 :id="anchor" tabindex="-1">
    {{ frontmatter.title }}
    <a v-if="!disableAnchor" class="header-anchor" :href="`#${anchor}`">&ZeroWidthSpace;</a>
  </h1>
</template>

<style scoped>
h1 {
  margin: 8px 0;
}
</style>
