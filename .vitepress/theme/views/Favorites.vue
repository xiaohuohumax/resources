<script lang="ts" setup>
import { views } from 'virtual:views'
import REmpty from '../components/REmpty.vue'
import { useFavorites } from '../composables/favorites'

const { ids, removeFavorites } = useFavorites()
removeFavorites(ids.value.filter(id => !views.some(v => v.id === id)))
const favoriteViews = computed(() => views.filter(v => ids.value.includes(v.id)))
</script>

<template>
  <REmpty>
    <RTitle />
    <RViewCards :views="favoriteViews" :in-favorite="true" />
  </REmpty>
</template>
