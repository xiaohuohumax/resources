import type { DefaultTheme } from 'vitepress'

export interface ThemeConfig extends Omit<DefaultTheme.Config, 'nav' | 'sidebar' | 'footer'> {
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
    relatedView: {
      notFound: string
    }
  }
  footer?: DefaultTheme.Footer & {
    page_pv: string
    site_pv: string
    site_uv: string
  }
}
