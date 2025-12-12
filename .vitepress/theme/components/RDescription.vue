<script lang="ts" setup>
import type { ResourceView } from '../view'
import { useTheme } from '../composables/theme'
import { useView } from '../composables/view'
import { string2Anchor } from '../util'

const theme = useTheme()
const view = useView<ResourceView>()
const anchor = string2Anchor(theme.value.view.resource.descriptionLabel)
</script>

<template>
  <h2 :id="anchor" tabindex="-1">
    {{ theme.view.resource.descriptionLabel }}
    <a class="header-anchor" :href="`#${anchor}`">&ZeroWidthSpace;</a>
  </h2>
  <p>{{ view.description }}</p>
</template>
