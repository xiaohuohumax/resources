<script lang="ts" setup>
import type { Resource } from '../../utils/view'
import { string2Anchor } from '../../utils'
import { useFrontmatter } from '../composables/frontmatter'
import { useThemeConfig } from '../composables/theme-config'

const themeConfig = useThemeConfig()
const frontmatter = useFrontmatter<Resource>()
const anchor = string2Anchor(themeConfig.value.view.resource.descriptionLabel)
</script>

<template>
  <h2 :id="anchor" tabindex="-1">
    {{ themeConfig.view.resource.descriptionLabel }}
    <a class="header-anchor" :href="`#${anchor}`">&ZeroWidthSpace;</a>
  </h2>
  <p>{{ frontmatter.description }}</p>
</template>
