import type { DefaultTheme } from 'vitepress'

export interface RLink {
  text: string
  link: string
}

export interface Breadcrumb {
  title: string
  path: string
}

export interface RBelong {
  id: string | null
  order: number
}

export interface RBase {
  title: string
  // 资源唯一标识
  path: string
  belong: RBelong

  togo?: string
  togoText?: string
  description?: string
  icon?: DefaultTheme.FeatureIcon
  tags?: string[]
}

export interface Doc extends RBase {
  type: 'doc'

  links: RLink[]
}

export interface Collection extends RBase {
  type: 'collection'

  id: string
}

export type Resource = Doc | Collection
