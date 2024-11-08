import { onMounted, onUnmounted, ref } from 'vue'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = ref<Theme>('light')

  function updateTheme() {
    theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  }

  onMounted(() => {
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    onUnmounted(() => observer.disconnect())
  })
  return theme
}
