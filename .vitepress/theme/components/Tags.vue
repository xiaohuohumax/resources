<script setup lang='ts'>
defineProps<{ tags: string[] }>()

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
const colorNames = [
  'default',
  'brand',
  'tip',
  'note',
  'success',
  'important',
  'warning',
  'danger',
  'caution',
]

function formatTagColorStyle(tag: string) {
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash += tag.charCodeAt(i)
  }
  const color = colorNames[Math.abs(hash % colorNames.length)]
  return `background-color: var(--vp-c-${color}-soft);`
}
</script>

<template>
  <div class="Tags">
    <span v-for="tag in tags" :key="tag" :style="formatTagColorStyle(tag)">
      {{ tag }}
    </span>
  </div>
</template>

<style scoped>
.Tags{
  display: inline-flex;
  flex-wrap: wrap;
}

.Tags span {
  border-radius: 4px;
  padding: 3px 6px;
  transition: color 0.25s, background-color 0.5s;
  font-size: .8em !important;
  margin-top: .25em;
  line-height: initial;
  margin-right: .25em;
}
</style>
