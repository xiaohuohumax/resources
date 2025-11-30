import type { View } from '../../utils/view'

export function useFrontmatter<T = View>(): Ref<T> {
  return useData().frontmatter as Ref<T>
}
