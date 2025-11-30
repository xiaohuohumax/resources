<script setup lang='ts'>
import { useTheme } from '../composables/theme'

withDefaults(defineProps<{ tags: string[], checkable?: boolean }>(), { checkable: true })

defineEmits(['tagClick'])
defineModel('tag')
const theme = useTheme()

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
  return `--color: var(--vp-c-${color}-${theme.value === 'dark' ? '2' : '3'});`
}
</script>

<template>
  <div v-if="tags.length > 0" class="RTags">
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
  padding: 3px 6px;
  transition: color 0.25s, background-color 0.5s;
  font-size: .9em !important;
  margin-top: .25em;
  line-height: initial;
  margin-right: .25em;
  cursor: pointer;
  border: 1px solid var(--vp-c-gutter);
  color: var(--color);
}

.RTags a.checkable:hover,
.RTags a.checkable.checked {
  color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-gutter);
  background-color: var(--color);
}
</style>
