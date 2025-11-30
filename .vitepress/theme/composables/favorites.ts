import type { RemovableRef } from '@vueuse/core'

export interface UseFavoritesReturn {
  ids: RemovableRef<string[]>
  toggleFavorite: (id: string) => void
  isFavorited: (id: string) => Ref<boolean>
}

export function useFavorites(): UseFavoritesReturn {
  const ids = useStorage<string[]>('favorite-ids', [])

  function addFavorite(id: string) {
    const oldView = ids.value.find(v => v === id)
    !oldView && ids.value.push(id)
  }

  function removeFavorite(id: string) {
    const index = ids.value.findIndex(v => v === id)
    index !== -1 && ids.value.splice(index, 1)
  }

  function isFavorited(id: string) {
    return computed(() => ids.value.includes(id))
  }

  function toggleFavorite(id: string) {
    isFavorited(id).value ? removeFavorite(id) : addFavorite(id)
  }

  return { ids, toggleFavorite, isFavorited }
}
