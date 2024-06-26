<script setup lang="ts">
import { computed, ref } from 'vue'
import ShowResource from './ShowResource.vue'
import { useData } from 'vitepress'
import { Collection, Resource } from '../types'

const { frontmatter } = useData()

const collection = computed(() => frontmatter.value as Collection)

const isCollection = computed(() => collection.value.type === 'collection')

const resources = ref<Resource[]>(collection.value.items)

const grid = computed(() => {
  if (!isCollection) {
    return
  }

  const length = frontmatter.value.items.length

  if (!length) {
    return
  } else if (length === 2 || length === 1) {
    return 'grid-2'
  } else if (length === 3) {
    return 'grid-3'
  } else if (length % 3 === 0) {
    return 'grid-6'
  } else if (length > 3) {
    return 'grid-4'
  }
})

interface CollectionItemsUpdateEvent {
  collectionId: string
  items: Resource[]
}

if (import.meta.hot) {
  import.meta.hot.on('update-collection-items', (event: CollectionItemsUpdateEvent) => {
    if (event.collectionId !== collection.value.id) {
      return
    }
    resources.value = event.items;
  });
}
</script>

<template>
  <div v-if="isCollection" class="ShowCollections">
    <div class="container">
      <div class="items">
        <div v-for="resource in resources" :key="resource.title" class="item" :class="[grid]">
          <ShowResource :resource="resource" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ShowCollections {
  position: relative;
}

.container {
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
