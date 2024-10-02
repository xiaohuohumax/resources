<script setup lang='ts'>
defineProps<{
  loading: boolean
}>()
</script>

<template>
  <div class="VPLoading">
    <div v-if="loading" class="loading">
      loading...
    </div>
    <div v-else class="done">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.VPLoading .loading {
  padding: 6em;
  text-align: center;
}
</style>
