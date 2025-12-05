import type { DefaultTheme } from 'vitepress'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { globbySync } from 'globby'
import matter from 'gray-matter'
import yaml from 'js-yaml'

export function normalizePath(p: string): string {
  return path.normalize(p).replaceAll('\\', '/')
}

interface Core {
  disabled?: boolean
  order: number
  id: string
  collectionId: string
  title: string
  description: string
  pathname: string
}

export interface Link {
  text: string
  link: string
}

export interface Links {
  links: Link[]
}

export interface Icon {
  icon: DefaultTheme.ThemeableImage
}

export interface Tags {
  tags: string[]
}

export interface Togo {
  togo?: string
}

export interface CollectionView extends Core, Icon {
  layout: 'collection'
}

export interface ResourceView extends Core, Icon, Links, Tags, Togo {
  layout: 'resource'
}

export interface ArticleView extends Core, Icon, Tags {
  layout: 'article'
}

export interface HomeView extends Core {
  layout: 'home'
}

export interface EmptyView extends Core {
  layout: 'empty'
}

export interface TagsView extends Core {
  layout: 'tags'
}

export interface Favorites extends Core {
  layout: 'favorites'
}

export type View = CollectionView | ResourceView | ArticleView | HomeView | EmptyView | TagsView

export function generateId(pathname: string): string {
  return crypto.createHash('md5').update(pathname).digest('hex')
}

export function filePath2Pathname(filePath: string, rootFolder: string): string {
  return normalizePath(path.relative(rootFolder, filePath).replace(/\.md$/, ''))
}

export function readFolders(rootFolder: string): string[] {
  return globbySync([normalizePath(path.join(rootFolder, '**/*'))], { onlyDirectories: true })
}

export function readMarkdownFiles(rootFolder: string): string[] {
  return globbySync([normalizePath(path.join(rootFolder, '**/*.md'))])
}

function filePath2CollectionPathname(filePath: string, rootFolder: string, isCollection: boolean): string | undefined {
  const pathname = filePath2Pathname(filePath, rootFolder)
  const parts = pathname.split('/')
  if (isCollection) {
    parts.pop()
  }
  while (parts.pop()) {
    const collectionPath = path.join(rootFolder, parts.join('/'), 'index.md')
    if (fs.existsSync(collectionPath)) {
      const frontmatter = readMarkdownFrontmatter(collectionPath)
      if (frontmatter.layout === 'collection' || frontmatter.layout === 'home') {
        return filePath2Pathname(collectionPath, rootFolder)
      }
    }
  }
}

export enum DefaultIcon {
  Collection = '/folder.svg',
  Resource = '/resource.svg',
  Article = '/article.svg',
}

export function formatIcon(icon: any, pathname: string, defaultIcon: DefaultIcon): DefaultTheme.ThemeableImage {
  if (typeof icon === 'undefined') {
    return defaultIcon
  }
  function resolveIcon(i: string): string {
    return i.startsWith('/') ? i : normalizePath(path.join('/', path.dirname(pathname), i))
  }
  if (typeof icon === 'string') {
    return resolveIcon(icon)
  }
  if (icon.src !== undefined) {
    return resolveIcon(icon.src)
  }
  const result: DefaultTheme.ThemeableImage = {
    dark: '',
    light: '',
  }
  if (icon.dark !== undefined) {
    result.dark = resolveIcon(icon.dark)
  }
  if (icon.light !== undefined) {
    result.light = resolveIcon(icon.light)
  }
  return result
}

export function readMarkdownFrontmatter(filePath: string): Record<string, any> {
  return matter(fs.readFileSync(filePath, 'utf-8')).data
}

export function updateMarkdownFrontmatter(filePath: string, data: Record<string, any>): void {
  const oldContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
  const content = matter.stringify(oldContent, data, {
    engines: {
      yaml: {
        // Enable emoji support in YAML (js-yaml version>4.0.0)
        parse: s => yaml.load(s) as object,
        stringify: data => yaml.dump(data),
      },
    },
  })
  fs.writeFileSync(filePath, content.replace(/\n+$/g, '\n'), 'utf-8')
}

export function readView(filePath: string, rootFolder: string): View | undefined {
  try {
    if (!fs.existsSync(filePath) || !filePath.endsWith('.md')) {
      return
    }
    const data = readMarkdownFrontmatter(filePath)
    data.layout ||= 'resource'
    const isCollection = data.layout === 'collection' || data.layout === 'home'
    const collectionPathname = filePath2CollectionPathname(filePath, rootFolder, isCollection)
    const pathname = filePath2Pathname(filePath, rootFolder)
    if (data.disabled === true) {
      return
    }
    const core: Core = {
      order: data.order || 0,
      id: generateId(pathname),
      collectionId: collectionPathname ? generateId(collectionPathname) : '',
      title: data.title || path.basename(pathname),
      description: data.description || '',
      pathname,
    }

    switch (data.layout as View['layout']) {
      case 'resource':
      {
        const links = data.links || []
        const firstLink = links[0]
        return {
          ...data,
          ...core,
          layout: 'resource',
          icon: formatIcon(data.icon, pathname, DefaultIcon.Resource),
          links,
          tags: data.tags || [],
          togo: data.togo || firstLink?.link || '',
        } satisfies ResourceView
      }
      case 'article':
      {
        return {
          ...data,
          ...core,
          layout: 'article',
          icon: formatIcon(data.icon, pathname, DefaultIcon.Article),
          tags: data.tags || [],
        } satisfies ArticleView
      }
      case 'collection':
        return {
          ...data,
          ...core,
          layout: 'collection',
          icon: formatIcon(data.icon, pathname, DefaultIcon.Collection),
        } satisfies CollectionView
    }
    return Object.assign({ layout: data.layout }, data, core) satisfies View
  }
  catch (error) {
    console.error(`Error parsing ${filePath}`, error)
  }
}

export function readViews(rootFolder: string): View[] {
  const markdownFiles = readMarkdownFiles(rootFolder)
  return markdownFiles.map(filePath => readView(filePath, rootFolder))
    .filter((view): view is View => view !== undefined)
}

export interface Breadcrumb extends Pick<View, 'pathname' | 'title' | 'id'> {}

export interface BreadcrumbMap {
  [id: string]: Breadcrumb[]
}

function view2Breadcrumb(view: View): Breadcrumb {
  return {
    pathname: view.pathname,
    title: view.title,
    id: view.id,
  }
}

function findParentBreadcrumbs(views: View[], view: View): Breadcrumb[] {
  const parentCollections: Breadcrumb[] = []
  while (view) {
    const parentView = views.find(v => v.id === view.collectionId)
    if (parentView && parentView.layout === 'collection') {
      parentCollections.push(view2Breadcrumb(parentView))
      view = parentView
    }
    else {
      break
    }
  }
  return parentCollections.reverse()
}

export function view2Breadcrumbs(views: View[]): BreadcrumbMap {
  const map = new Map<string, Breadcrumb[]>()
  for (const view of views) {
    const parentCollections = findParentBreadcrumbs(views, view)
    map.set(view.id, [...parentCollections, view2Breadcrumb(view)])
  }
  return Object.fromEntries(map)
}

export interface CollectionChildrenMap {
  [id: string]: View[]
}

function sortViews(views: View[]): View[] {
  return views.sort((a, b) => {
    return a.layout === 'collection' && b.layout === 'resource'
      ? -1
      : a.layout === 'resource' && b.layout === 'collection'
        ? 1
        : a.order === b.order
          ? 0
          : a.order > b.order
            ? 1
            : -1
  })
}

export function view2CollectionChildrenMap(views: View[]): CollectionChildrenMap {
  const map = new Map<string, View[]>()
  for (const view of views) {
    map.set(view.id, sortViews(views.filter(v => v.collectionId === view.id)))
  }
  return Object.fromEntries(map)
}

function findTopViews(views: View[]): View[] {
  const homeView = views.find(v => v.layout === 'home')
  return homeView ? sortViews(views.filter(v => v.collectionId === homeView.id)) : []
}

export function view2Nav(views: View[]): DefaultTheme.NavItem[] {
  const topViews = findTopViews(views)
  const collectionChildrenMap = view2CollectionChildrenMap(views)
  return topViews.map((view) => {
    const items = sortViews(collectionChildrenMap[view.id]).map((view) => {
      return {
        text: view.title,
        link: view.pathname,
      }
    })
    if (items.length === 0) {
      return {
        text: view.title,
        link: view.pathname,
      }
    }
    return {
      text: view.title,
      items,
    }
  })
}
