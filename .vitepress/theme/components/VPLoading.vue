<script setup lang='ts'>

defineProps<{
  loading: boolean
}>()

</script>

<template>
  <div class="VPLoading">
    <div class="loading" v-if="loading">
      loading...
    </div>
    <div class="done" v-else>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.VPLoading .loading {
  padding: 6em;
  text-align: center;
}
</style>