<script setup lang="ts" async>
import type { View } from '../view'
import { useTheme } from '../composables/theme'

const props = defineProps<{ views: View[], inFavorite?: boolean }>()
const grid = computed<string>(() => props.views.length < 3 ? 'grid-2' : 'grid-3')
const theme = useTheme()
</script>

<template>
  <div class="RViewCards">
    <div class="items">
      <div v-for="view in views" :key="view.id" class="item" :class="[grid]">
        <RViewCard :view="view" :in-favorite="inFavorite" />
      </div>
    </div>
    <div v-if="views.length === 0" class="empty">
      {{ theme.viewCards.nothingHere }}
    </div>
  </div>
</template>

<style scoped>
.RViewCards {
  margin: 16px auto;
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

.empty {
  text-align: center;
  margin: 48px 0;
}

@media (max-width: 639px) {
  .item {
    width: 100%;
  }
}

@media (min-width: 640px) and (max-width: 959px) {
  .item.grid-2 {
    width: 100%;
  }

  .item.grid-3 {
    width: calc(100% / 2);
  }
}

@media (min-width: 960px) {
  .item.grid-2 {
    width: calc(100% / 2);
  }

  .item.grid-3 {
    width: calc(100% / 3);
  }
}
</style>
