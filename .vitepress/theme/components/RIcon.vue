<script lang="ts" setup>
const props = defineProps<{
  name: string
  color?: string
  size?: string
}>()
</script>

<template>
  <i
    class="ti" :class="`ti-${props.name}`" :style="{
      color: props.color,
      fontSize: props.size,
    }"
  />
</template>
