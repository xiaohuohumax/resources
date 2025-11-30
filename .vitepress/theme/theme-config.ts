import type { DefaultTheme } from 'vitepress'

export interface ThemeConfig extends Omit<DefaultTheme.Config, 'nav' | 'sidebar'> {
  view: {
    resource: {
      descriptionLabel: string
      linkLabel: string
    }
    collection: {
      gotoLabel: string
    }
    nothingHere: string
    favorites: {
      icon: string
      addLabel: string
      cancelLabel: string
    }
  }
}
