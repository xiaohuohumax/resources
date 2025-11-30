declare module 'virtual:views' {
  export const views: import('../utils/view').View[]
  export const breadcrumbMap: import('../utils/view').BreadcrumbMap
  export const collectionChildrenMap: import('../utils/view').CollectionChildrenMap
  export const nav: import('vitepress').DefaultTheme.NavItem[]
}
