export function useQuery<T extends Record<string, string>>() {
  const route = useRoute()
  const router = useRouter()

  function parseQuery(query: string): T {
    const result = new URLSearchParams(query)
    return Object.fromEntries(result.entries()) as T
  }

  const query = ref<T>(parseQuery(route.query))

  watch(() => query.value, (newValue) => {
    const searchParams = new URLSearchParams(route.query)
    for (const [key, value] of Object.entries(newValue as T)) {
      if (value !== '') {
        searchParams.append(key, value)
      }
    }
    router.go(`${location.pathname}?${searchParams.toString()}`)
  }, { deep: true })

  watch(() => route.query, (newValue) => {
    query.value = parseQuery(newValue)
  })

  return query
}
