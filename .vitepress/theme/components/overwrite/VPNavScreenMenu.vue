<script lang="ts" setup>
import VPNavScreenMenuGroup from '@vitepress-components/VPNavScreenMenuGroup.vue'
import VPNavScreenMenuLink from '@vitepress-components/VPNavScreenMenuLink.vue'
import { nav } from 'virtual:views'
</script>

<template>
  <nav v-if="nav" class="VPNavScreenMenu">
    <template v-for="item in nav" :key="JSON.stringify(item)">
      <VPNavScreenMenuLink v-if="'link' in item" :item />
      <component :is="item.component" v-else-if="'component' in item" v-bind="item.props" screen-menu />
      <VPNavScreenMenuGroup v-else :text="item.text || ''" :items="item.items" />
    </template>
  </nav>
</template>
