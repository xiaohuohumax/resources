<script lang="ts" setup>
import type { Resource } from '../../view'
import { string2Anchor } from '../../utils'
import { useFrontmatter } from '../composables/frontmatter'
import { useTheme } from '../composables/theme'

const theme = useTheme()
const frontmatter = useFrontmatter<Resource>()
const anchor = string2Anchor(theme.value.view.resource.descriptionLabel)
</script>

<template>
  <h2 :id="anchor" tabindex="-1">
    {{ theme.view.resource.descriptionLabel }}
    <a class="header-anchor" :href="`#${anchor}`">&ZeroWidthSpace;</a>
  </h2>
  <p>{{ frontmatter.description }}</p>
</template>
