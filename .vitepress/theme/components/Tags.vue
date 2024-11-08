<script setup lang='ts'>
const props = withDefaults(defineProps<{
  tags: string[]
  checkable?: boolean
}>(), {
  checkable: true,
})
const emit = defineEmits(['tagClick'])
const tag = defineModel('tag')

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

function handleTagClick(tag: string, event: MouseEvent) {
  if (props.checkable) {
    emit('tagClick', tag, event)
  }
}
</script>

<template>
  <div class="Tags">
    <span
      v-for="t in tags" :key="t" :class="{
        checked: tag === t,
        checkable,
      }" :style="formatTagColorStyle(t)" @click="handleTagClick(t, $event)"
    >
      <slot :value="t">{{ t }}</slot>
    </span>
  </div>
</template>

<style scoped>
.Tags {
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
  cursor: pointer;
  border: 1px solid var(--vp-c-bg-soft);
}

.Tags span.checkable:hover,
.Tags span.checkable.checked {
  border: 1px solid var(--vp-c-brand-1);
}
</style>
