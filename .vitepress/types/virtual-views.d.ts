declare module 'virtual:views' {
  export const views: import('../view').View[]
  export const breadcrumbMap: import('../view').BreadcrumbMap
  export const collectionChildrenMap: import('../view').CollectionChildrenMap
  export const collectionStatMap: import('../view').CollectionStatMap
  export const nav: import('vitepress').DefaultTheme.NavItem[]
}
