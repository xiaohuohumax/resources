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
    favorites: {
      addLabel: string
      cancelLabel: string
    }
    tags: {
      emptyLabel: string
      countLabel: string
    }
  }
  relatedView: {
    notFound: string
  }
  viewCard: {
    collectionCountLabel: string
    resourceCountLabel: string
    articleCountLabel: string
  }
  viewCards: {
    nothingHere: string
  }
  footer?: DefaultTheme.Footer & {
    page_pv: string
    site_pv: string
    site_uv: string
  }
}
