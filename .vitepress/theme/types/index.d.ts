import { DefaultTheme } from 'vitepress';

export interface RLink {
  text: string
  link: string
}

export interface Breadcrumb {
  title: string
  path: string
  allowClick: boolean
}

export interface RBelong {
  id: string | null
  order: number
}

export interface RBase {
  title: string
  path: string
  belong: RBelong

  breadcrumbs: Breadcrumb[]

  togo?: string
  togoText?: string
  description?: string
  icon?: DefaultTheme.FeatureIcon
}

export interface Doc extends RBase {
  type: 'doc'

  links: RLink[]
}

export interface Collection extends RBase {
  type: 'collection'

  id: string
  items: Resource[]
}

export type Resource = Doc | Collection;