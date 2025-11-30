<script setup lang="ts">
import type { View } from '../../view'
import { useFavorites } from '../composables/favorites'
import { useTheme } from '../composables/theme'

const props = defineProps<{ view: View }>()

const theme = useTheme()
const { isFavorited, toggleFavorite } = useFavorites()

const state = isFavorited(props.view.id)
const title = computed(() => state.value
  ? theme.value.view.favorites.cancelLabel
  : theme.value.view.favorites.addLabel,
)
</script>

<template>
  <button :title="title" class="RFavorite" :class="{ 'is-favorited': state }" @click="toggleFavorite(props.view.id)">
    {{ theme.view.favorites.icon }}
  </button>
</template>

<style scoped>
.RFavorite {
  font-size: 1.25em;
  font-weight: bold;
  filter: grayscale(100%);
}

.RFavorite.is-favorited {
  filter: none;
}
</style>
