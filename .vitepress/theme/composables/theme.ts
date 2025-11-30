import type { ThemeConfig } from '../theme-config'

export function useTheme(): Ref<ThemeConfig> {
  return useData<ThemeConfig>().theme
}
