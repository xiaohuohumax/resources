<script lang="ts" setup>
import { GridArrayBg } from 'color4bg'

const { isDark } = useData()

onMounted(() => {
  function colors(isDark: boolean) {
    return isDark
      ? ['#1b1b1f', '#3F3F3F', '#7F7F7F', '#DADADA', '#EAEBE8', '#1E1E1E']
      : ['#FAFAFA', '#E5E5E5', '#D9D9D9', '#C0C0C0', '#A9A9A9', '#808080']
  }
  const background = new GridArrayBg({
    dom: 'background',
    colors: colors(isDark.value),
    loop: true,
  })
  background.update('rotateCanvas', 45)
  background.update('scale', 160)
  background.update('radius', 0.125)
  background.update('borderwidth', 0.04)
  watch(isDark, newVal => background.colors(colors(newVal)))
  return () => background.destroy()
})
</script>

<template>
  <div id="background" />
</template>

<style scoped>
#background {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.35;
}
</style>
