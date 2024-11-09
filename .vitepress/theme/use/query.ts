import { onMounted, onUnmounted, ref, watch } from 'vue'

export function useQuery(key: string) {
  const query = ref<string>('')

  function updateQuery() {
    const params = new URLSearchParams(window.location.search)
    query.value = params.get(key) || ''
  }

  onMounted(() => {
    // SSR doesn't have window
    updateQuery()
    const t = setInterval(() => updateQuery(), 200)
    onUnmounted(() => clearInterval(t))
  })

  watch(() => query.value, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      const url = new URL(window.location.href)
      if (newVal === '') {
        url.searchParams.delete(key)
      }
      else {
        url.searchParams.set(key, newVal)
      }
      window.history.replaceState(
        {},
        '',
        url,
      )
    }
  })

  return query
}
