<script setup lang='ts'>
import { useData } from 'vitepress'

withDefaults(defineProps<{
  tags: string[]
  checkable?: boolean
  spaceBetween?: boolean
}>(), { checkable: true, spaceBetween: false })
defineEmits(['tagClick'])
defineModel('tag')

const { isDark } = useData()

const colors = ['brand', 'note', 'success', 'important', 'warning', 'danger', 'caution']

function style(tag: string) {
  /*
  --vp-c-default-soft: var(--vp-c-gray-soft);
  --vp-c-brand-soft: var(--vp-c-indigo-soft);
  --vp-c-tip-soft: var(--vp-c-brand-soft);
  --vp-c-note-soft: var(--vp-c-brand-soft);
  --vp-c-success-soft: var(--vp-c-green-soft);
  --vp-c-important-soft: var(--vp-c-purple-soft);
  --vp-c-warning-soft: var(--vp-c-yellow-soft);
  --vp-c-danger-soft: var(--vp-c-red-soft);
  --vp-c-caution-soft: var(--vp-c-red-soft);
  */
  const code = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const color = colors[Math.abs(code % colors.length)]
  return `--color: var(--vp-c-${color}-${isDark.value ? '2' : '3'});`
}
</script>

<template>
  <div
    v-if="tags.length > 0" class="RTags" :style="{
      'justify-content': spaceBetween ? 'space-between' : 'inherit',
    }"
  >
    <a
      v-for="t in tags" :key="t" :class="{
        checked: tag === t,
        checkable,
      }" :style="style(t)" @click="() => checkable && $emit('tagClick', t)"
    >
      <slot :value="t">{{ t }}</slot>
    </a>
  </div>
</template>

<style scoped>
.RTags {
  display: flex;
  flex-wrap: wrap;
}

.RTags a {
  border-radius: 4px;
  padding: 6px;
  transition: color 0.25s, background-color 0.5s;
  font-size: .9em !important;
  margin-top: .25em;
  line-height: initial;
  margin-right: .25em;
  cursor: pointer;
  /* border: 1px solid var(--vp-c-border); */
  color: var(--color);
  background-color: var(--vp-c-bg-soft);
}

.RTags a:last-child {
  margin-right: auto;
}

.RTags a.checkable:hover,
.RTags a.checkable.checked {
  color: var(--vp-c-bg);
  /* border: 1px solid var(--vp-c-border); */
  background-color: var(--color);
}
</style>
