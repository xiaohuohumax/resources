export function useTheme() {
  const theme = ref<'light' | 'dark'>('light')

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
    return () => observer.disconnect()
  })

  return theme
}
