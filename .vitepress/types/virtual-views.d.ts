declare module 'virtual:views' {
  export const views: import('../theme/view').View[]
  export const breadcrumbMap: import('../util').BreadcrumbMap
  export const collectionChildrenMap: import('../util').CollectionChildrenMap
  export const collectionStatMap: import('../util').CollectionStatMap
  export const nav: import('vitepress').DefaultTheme.NavItem[]
}
