<script setup lang="ts">
import type { ResourceView } from '../view'
import Giscus from '@giscus/vue'
import { useView } from '../composables/view'

const view = useView<ResourceView>()
const { isDark } = useData()

function getTheme() {
  return isDark.value
    ? new URL(withBase('/static/giscus_dark.css'), location.href).href
    : new URL(withBase('/static/giscus_light.css'), location.href).href
}

const theme = ref('')
onMounted(() => theme.value = getTheme())
watch(isDark, () => theme.value = getTheme())
</script>

<template>
  <div class="RGiscus">
    <Giscus
      :id="view.id" repo="xiaohuohumax/resources" repo-id="R_kgDOMGTfMA" category="Announcements"
      category-id="DIC_kwDOMGTfMM4C0EDY" mapping="pathname" strict="1" reactions-enabled="1" emit-metadata="0"
      input-position="top" :theme="theme" lang="zh-CN" loading="lazy"
      crossorigin="anonymous"
    />
  </div>
</template>
