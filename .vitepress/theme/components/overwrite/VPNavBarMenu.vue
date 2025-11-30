<script lang="ts" setup>
import VPNavBarMenuGroup from '@vitepress-components/VPNavBarMenuGroup.vue'
import VPNavBarMenuLink from '@vitepress-components/VPNavBarMenuLink.vue'
import { nav } from 'virtual:views'
</script>

<template>
  <nav v-if="nav" aria-labelledby="main-nav-aria-label" class="VPNavBarMenu">
    <span id="main-nav-aria-label" class="visually-hidden">
      Main Navigation
    </span>
    <template v-for="item in nav" :key="JSON.stringify(item)">
      <VPNavBarMenuLink v-if="'link' in item" :item />
      <component :is="item.component" v-else-if="'component' in item" v-bind="item.props" />
      <VPNavBarMenuGroup v-else :item />
    </template>
  </nav>
</template>

<style scoped>
.VPNavBarMenu {
  display: none;
}

@media (min-width: 768px) {
  .VPNavBarMenu {
    display: flex;
  }
}
</style>
