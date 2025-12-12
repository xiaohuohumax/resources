import type { View } from '../view'

export function useView<T = View>(): Ref<T> {
  return useData().frontmatter as Ref<T>
}
