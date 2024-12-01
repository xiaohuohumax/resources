<script setup lang="ts" async>
import type types from '../types'
import { computed } from 'vue'
import Resource from './Resource.vue'

const props = defineProps<{
  resources: types.Resource[] | undefined
}>()

const grid = computed<string>(() => {
  if (!props.resources) {
    return ''
  }
  const length = props.resources.length
  if (length === 2 || length === 1) {
    return 'grid-2'
  }
  else if (length === 3) {
    return 'grid-3'
  }
  else if (length % 3 === 0) {
    return 'grid-6'
  }
  else {
    return 'grid-4'
  }
})
</script>

<template>
  <div class="Resources">
    <div class="items">
      <div v-for="resource in resources" :key="resource.path" class="item" :class="[grid]">
        <Resource :resource="resource" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.Resources {
  margin: 0 auto;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {

  .item.grid-2,
  .item.grid-4,
  .item.grid-6 {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {

  .item.grid-2,
  .item.grid-4 {
    width: calc(100% / 2);
  }

  .item.grid-3,
  .item.grid-6 {
    width: calc(100% / 3);
  }
}

@media (min-width: 960px) {
  .item.grid-4 {
    width: calc(100% / 4);
  }
}
</style>
