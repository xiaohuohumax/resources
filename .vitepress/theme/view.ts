import type { DefaultTheme } from 'vitepress'

export interface ViewCore {
  disabled?: boolean
  order: number
  id: string
  collectionId: string
  title: string
  description: string
  pathname: string

  footer?: boolean
}

export interface Link {
  icon: string
  text: string
  link: string
}

export interface Links {
  links: Link[]
}

export function hasLinks(view: View) {
  return view.layout === 'resource'
}

export interface Icon {
  icon: DefaultTheme.ThemeableImage
}

export function hasIcon(view: View) {
  return view.layout === 'collection'
    || view.layout === 'resource'
    || view.layout === 'article'
}

export interface Tags {
  tags: string[]
}

export function hasTags(view: View) {
  return view.layout === 'resource'
    || view.layout === 'article'
}

export interface Togo {
  togo?: string
}

export function hasTogo(view: View) {
  return view.layout === 'resource'
}

export interface CollectionView extends ViewCore, Icon {
  layout: 'collection'
}

export function isCollectionView(view: View) {
  return view.layout === 'collection'
}

export interface ResourceView extends ViewCore, Icon, Links, Tags, Togo {
  layout: 'resource'
}

export function isResourceView(view: View) {
  return view.layout === 'resource'
}

export interface ArticleView extends ViewCore, Icon, Tags {
  layout: 'article'
}

export function isArticleView(view: View) {
  return view.layout === 'article'
}

export interface HomeView extends ViewCore {
  layout: 'home'
}

export function isHomeView(view: View) {
  return view.layout === 'home'
}

export interface EmptyView extends ViewCore {
  layout: 'empty'
}

export function isEmptyView(view: View) {
  return view.layout === 'empty'
}

export interface TagsView extends ViewCore {
  layout: 'tags'
}

export function isTagsView(view: View) {
  return view.layout === 'tags'
}

export interface FavoritesView extends ViewCore {
  layout: 'favorites'
}

export function isFavoritesView(view: View) {
  return view.layout === 'favorites'
}

// All views
export type View = CollectionView | ResourceView | ArticleView | HomeView | EmptyView | TagsView | FavoritesView

export function isView(view: any): view is View {
  return typeof (view) === 'object'
    && typeof (view.layout) === 'string'
}

// Folder views
export type FolderView = CollectionView | HomeView

export function isFolderView(view: View) {
  return view.layout === 'collection'
    || view.layout === 'home'
}

// File views
export type FileView = ResourceView | ArticleView | EmptyView | TagsView | FavoritesView

export function isFileView(view: View) {
  return view.layout === 'resource'
    || view.layout === 'article'
    || view.layout === 'empty'
}

// Function views
export type FuncView = TagsView | FavoritesView

export function isFuncView(view: View) {
  return view.layout === 'tags'
    || view.layout === 'favorites'
}
