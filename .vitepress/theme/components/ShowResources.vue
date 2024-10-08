<script setup lang="ts" async>
import { computedAsync } from '@vueuse/core'
import virtualResources from 'virtual:resources'
import { useData } from 'vitepress'
import { computed, ref, watch } from 'vue'
import ShowResource from './ShowResource.vue'
import VPLoading from './VPLoading.vue'

const { frontmatter } = useData()

const isCollection = computed(() => frontmatter.value.type === 'collection')

const loading = ref(true)

const resources = computedAsync(async () => {
  if (isCollection.value) {
    // 从虚拟模块中获取当前集合资源
    const module = await virtualResources[frontmatter.value.id]()
    return module.default
  }
  return []
})

watch(resources, () => loading.value = false, { once: true })

const grid = computed<string>(() => {
  if (isCollection.value) {
    const length = resources.value.length
    if (length === 2 || length === 1) {
      return 'grid-2'
    }
    else if (length === 3) {
      return 'grid-3'
    }
    else if (length % 3 === 0) {
      return 'grid-6'
    }
    else if (length > 3) {
      return 'grid-4'
    }
  }
  return ''
})
</script>

<template>
  <div v-if="isCollection" class="ShowCollections">
    <VPLoading :loading="loading">
      <div class="container">
        <div class="items">
          <div v-for="resource in resources" :key="resource.title" class="item" :class="[grid]">
            <ShowResource :resource="resource" />
          </div>
        </div>
      </div>
    </VPLoading>
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
