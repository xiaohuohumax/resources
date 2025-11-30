export function useQuery(key: string) {
  const query = ref<string>('')

  function updateQuery() {
    const params = new URLSearchParams(window.location.search)
    query.value = params.get(key) || ''
  }

  onMounted(() => {
    // SSR doesn't have window
    updateQuery()
    const interval = setInterval(() => updateQuery(), 200)
    return () => clearInterval(interval)
  })

  watch(() => query.value, (value, oldValue) => {
    if (value === oldValue) {
      return
    }
    const url = new URL(window.location.href)
    value === ''
      ? url.searchParams.delete(key)
      : url.searchParams.set(key, value)
    window.history.replaceState({}, '', url)
  })

  return query
}
