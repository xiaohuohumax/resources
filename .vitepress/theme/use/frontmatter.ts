import type { Ref } from 'vue'
import { useData } from 'vitepress'

export function useFrontmatter<F = any>() {
  return useData().frontmatter as Ref<F>
}
