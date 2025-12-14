import type { DefaultTheme } from 'vitepress'
import type { ArticleView, CollectionView, ResourceView, View, ViewCore } from './theme/view'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { globbySync } from 'globby'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import {
  isArticleView,
  isCollectionView,
  isFolderView,
  isHomeView,
  isResourceView,
  isView,
} from './theme/view'

export function abs(p: string): string {
  return path.resolve(__dirname, p)
}

export function normalizePath(p: string): string {
  return path.normalize(p).replaceAll('\\', '/')
}

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

function filePath2CollectionPathname(filePath: string, rootFolder: string, isFolder: boolean): string | undefined {
  const pathname = filePath2Pathname(filePath, rootFolder)
  const parts = pathname.split('/')
  if (isFolder) {
    parts.pop()
  }
  while (parts.pop()) {
    const collectionPath = path.join(rootFolder, parts.join('/'), 'index.md')
    if (fs.existsSync(collectionPath)) {
      const frontmatter = readMarkdownFrontmatter(collectionPath)
      if (isView(frontmatter) && isFolderView(frontmatter)) {
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

function createMatterOptions(): matter.GrayMatterOption<string, any> {
  return {
    engines: {
      yaml: {
        // Enable emoji support in YAML (js-yaml version>4.0.0)
        parse: s => yaml.load(s) as object,
        stringify: data => yaml.dump(data),
      },
    },
  }
}

export function readMarkdownFrontmatter(filePath: string): Record<string, any> {
  return matter(fs.readFileSync(filePath, 'utf-8'), createMatterOptions()).data
}

export function updateMarkdownFrontmatter(filePath: string, data: Record<string, any>): void {
  const oldContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''
  const content = matter.stringify(oldContent, data, createMatterOptions())
  fs.writeFileSync(filePath, content.replace(/\n+$/g, '\n'), 'utf-8')
}

export function readView(filePath: string, rootFolder: string): View | undefined {
  try {
    if (!fs.existsSync(filePath) || !filePath.endsWith('.md')) {
      return
    }
    const data = readMarkdownFrontmatter(filePath)
    data.layout ||= 'resource'
    const isFolder = isView(data) && isFolderView(data)
    const collectionPathname = filePath2CollectionPathname(filePath, rootFolder, isFolder)
    const pathname = filePath2Pathname(filePath, rootFolder)
    if (data.disabled === true) {
      return
    }
    const core: ViewCore = {
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
    if (parentView && isCollectionView(parentView)) {
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
    return isCollectionView(a) && isResourceView(b)
      ? -1
      : isResourceView(a) && isCollectionView(b)
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
  const homeView = views.find(v => isHomeView(v))
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

export interface CollectionStat {
  collectionCount: number
  resourceCount: number
  articleCount: number
}

export interface CollectionStatMap {
  [id: string]: CollectionStat
}

export function view2CollectionStatMap(views: View[]): CollectionStatMap {
  const map = new Map<string, CollectionStat>()

  views.forEach((collection) => {
    map.set(collection.id, {
      collectionCount: 0,
      resourceCount: 0,
      articleCount: 0,
    })
  })

  function updateParentCollectionStat(view: View, updateStat: CollectionStat) {
    const parentCollection = views.find(v => v.id === view.collectionId)
    if (!parentCollection) {
      return
    }
    const parentStat = map.get(parentCollection.id)!
    parentStat.collectionCount += updateStat.collectionCount
    parentStat.resourceCount += updateStat.resourceCount
    parentStat.articleCount += updateStat.articleCount
    map.set(parentCollection.id, parentStat)
    updateParentCollectionStat(parentCollection, updateStat)
  }

  for (const view of views) {
    const stat: CollectionStat = {
      collectionCount: isCollectionView(view) ? 1 : 0,
      resourceCount: isResourceView(view) ? 1 : 0,
      articleCount: isArticleView(view) ? 1 : 0,
    }
    updateParentCollectionStat(view, stat)
  }

  return Object.fromEntries(map)
}
