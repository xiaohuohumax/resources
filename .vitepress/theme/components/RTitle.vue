<script lang="ts" setup>
import type { ResourceView } from '../view'
import { useView } from '../composables/view'
import { string2Anchor } from '../util'

withDefaults(defineProps<{ disableAnchor?: boolean }>(), { disableAnchor: false })
const view = useView<ResourceView>()
const anchor = string2Anchor(view.value.title)
</script>

<template>
  <h1 :id="anchor" tabindex="-1">
    {{ view.title }}
    <a v-if="!disableAnchor" class="header-anchor" :href="`#${anchor}`">&ZeroWidthSpace;</a>
  </h1>
</template>

<style scoped>
h1 {
  margin: 8px 0;
}
</style>
