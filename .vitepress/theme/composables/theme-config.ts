import type { ThemeConfig } from '../theme-config'

export function useThemeConfig(): Ref<ThemeConfig> {
  return useData<ThemeConfig>().theme
}
