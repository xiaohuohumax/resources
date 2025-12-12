<script lang="ts" setup>
import type { ResourceView } from '../view'
import VPLink from '@vitepress-components/VPLink.vue'
import { useTheme } from '../composables/theme'
import { useView } from '../composables/view'
import { string2Anchor } from '../util'

const theme = useTheme()
const view = useView<ResourceView>()
const anchor = string2Anchor(theme.value.view.resource.linkLabel)
</script>

<template>
  <div v-if="view.links.length > 0" class="RLinks vp-doc">
    <h2 :id="anchor" tabindex="-1">
      {{ theme.view.resource.linkLabel }}
      <a class="header-anchor" :href="`#${anchor}`">&ZeroWidthSpace;</a>
    </h2>
    <div class="links">
      <VPLink v-for="link in view.links" :key="link.text" :href="link.link" :no-icon="true">
        <RIcon :name="link.icon" /> {{ link.text }}
      </VPLink>
    </div>
  </div>
</template>

<style scoped>
.RLinks .links {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  padding: 16px;
}

.RLinks .links a {
  margin-right: 10px;
}
</style>
