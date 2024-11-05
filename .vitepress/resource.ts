import type { DefaultTheme } from 'vitepress'
import type { Breadcrumb, Collection, Doc, RBase, Resource } from './theme/types'
import fs from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'

import matter from 'gray-matter'
import micromatch from 'micromatch'
import { normalizePath } from 'vite'

export type * from './theme/types'

/**
 * 资源管理器
 */
export class ResourceManager {
  // 资源对象列表
  private resources: Resource[] = []
  // 集合排序默认值
  static BELONG_ORDER_DEFAULT = 0
  // 资源筛选范围
  private resourceGlobSource: string

  /**
   * @param srcDir 项目文档源目录
   * @param srcExclude 项目文档源目录排除项
   */
  constructor(private srcDir: string, private srcExclude: string[]) {
    this.resourceGlobSource = normalizePath(path.join(srcDir, '**/*.md'))
    for (const pagePath of glob.sync(this.resourceGlobSource, { ignore: this.srcExclude })) {
      const resource = this.createResource(pagePath)
      if (resource) {
        this.resources.push(resource)
      }
    }
  }

  /**
   * 检查路径是否允许
   * @param filePath 文档路径
   * @returns 是否允许
   */
  isAllowedPath(filePath: string): boolean {
    return micromatch.isMatch(filePath, this.resourceGlobSource, {
      ignore: this.srcExclude,
    })
  }

  /**
   * 路径转ID
   *
   * /a/b/c => a-b-c
   * @param filePath 文档路径
   * @returns ID
   */
  private filePathToId(filePath: string): string {
    return filePath.replace(/^\//, '').replaceAll('/', '-')
  }

  /**
   * 创建资源对象
   * @param filePath 文档路径
   * @returns 资源对象
   */
  createResource(filePath: string): Resource | undefined {
    if (!this.isAllowedPath(filePath)) {
      return
    }
    let data: { [key: string]: any } = {}
    try {
      data = matter(fs.readFileSync(filePath, 'utf-8')).data
    }
    catch (error) {
      console.error(`Error reading frontmatter in ${filePath}:\n${(error as Error).message}`)
      return
    }
    if (typeof data.type !== 'string') {
      return
    }
    const resourcePath = this.filePathToResourcePath(filePath)
    // 格式化路径 a/index => a, b => b
    const formatFilePath = resourcePath.replace(/\/index$/g, '')

    const base: RBase = {
      // 标题缺省则取文件名
      title: data.title ?? path.basename(resourcePath),
      path: resourcePath,
      belong: Object.assign({
        // 归属id缺省则取路径
        id: this.filePathToId(formatFilePath.substring(0, formatFilePath.lastIndexOf('/'))),
        // 排序缺省则取默认值
        order: ResourceManager.BELONG_ORDER_DEFAULT,
      }, data.belong),

      togo: data.togo,
      togoText: data.togoText,
      description: data.description,
      icon: data.icon,
    }

    if (data.type === 'collection') {
      // 集合
      return {
        ...base,
        type: 'collection',
        id: data.id ?? this.filePathToId(formatFilePath),
      }
    }
    else if (data.type === 'doc') {
      // 文档
      return {
        ...base,
        type: 'doc',
        links: data.links ?? [],
      }
    }
  }

  /**
   * 检查资源是否为导航
   * @param resource 资源对象
   */
  isNav(resource?: Resource | string): boolean {
    const r = typeof resource === 'string'
      ? this.getResourceByFilePath(resource)
      : resource

    return !r
      ? false
      : this.getResourceParentsByBelongId(r.belong.id).length < 2
  }

  /**
   * 创建导航 默认二级导航
   * @returns 导航列表
   */
  createNav(baseNav: DefaultTheme.NavItem[] = []): DefaultTheme.NavItem[] {
    const rootResources = this.getSortResourcesByBelongId(null)

    const nav = rootResources.map((resource) => {
      if (resource.type === 'doc') {
        return { text: resource.title, link: resource.path }
      }

      const items = this.getSortResourcesByBelongId(resource.id).map(r => ({
        text: r.title,
        link: r.path,
      }))

      if (items.length === 0) {
        return { text: resource.title, link: resource.path }
      }

      return { text: resource.title, items }
    })

    return [...baseNav, ...nav]
  }

  /**
   * 移除指定文件路径的资源对象
   * @param filePath 文档绝对路径
   */
  spliceResource(filePath: string) {
    const index = this.resources.findIndex(r => r.path === this.filePathToResourcePath(filePath))
    if (index === -1) {
      return
    }
    const resource = this.resources.splice(index, 1)[0]
    console.log(`Resource removed: ${resource.path}`)
    return resource
  }

  /**
   * 更新资源对象
   * @param resource 资源对象
   */
  updateResource(resource: Resource) {
    const index = this.resources.findIndex(r => r.path === resource.path)

    if (index === -1) {
      console.log(`Resource added: ${resource.path}`)
      this.resources.push(resource)
    }
    else {
      console.log(`Resource updated: ${resource.path}`)
      this.resources[index] = resource
    }
  }

  /**
   * 路径转资源路径
   * @param filePath 文档路径
   * @returns 资源路径
   */
  filePathToResourcePath(filePath: string): string {
    const relativePath = normalizePath(path.relative(this.srcDir, filePath))
    return `/${relativePath.replace(/\.md$/i, '')}`
  }

  /**
   * 获取指定归属的资源对象排序列表
   *
   * 排序规则:
   * 1. 集合在前, 文档在后
   * 2. 同级集合/文档按照 order 排序, 越小越前
   *
   * @param belongId 归属 ID
   * @returns 排序列表
   */
  getSortResourcesByBelongId(belongId: string | null): Resource[] {
    return this.resources
      .filter(r => r.belong?.id === belongId)
      .sort((a, b) => {
        if (a.type === 'collection' && b.type === 'doc') {
          return -1
        }
        else if (a.type === 'doc' && b.type === 'collection') {
          return 1
        }
        else if (a.belong.order === b.belong.order) {
          return 0
        }
        return a.belong.order > b.belong.order ? 1 : -1
      })
  }

  /**
   * 获取指定归属的资源对象父级集合
   * @param belongId 归属 ID
   * @returns 父级集合列表
   */
  getResourceParentsByBelongId(belongId: string | null): Breadcrumb[] {
    const parents: Breadcrumb[] = []
    const parentPaths: string[] = []

    const collections = this.resources.filter(r => r.type === 'collection') as Collection[]

    for (; ;) {
      // 查找父级集合
      const parent = collections.find(r => r.type === 'collection' && r.id === belongId)
      if (parent) {
        if (parentPaths.includes(parent.path)) {
          // 循环引用
          console.warn(`Circular reference found in collections: ${parentPaths.join(' -> ')}`)
          break
        }

        parentPaths.push(parent.path)

        parents.push({
          title: parent.title,
          path: parent.path,
        })

        belongId = parent.belong.id
        continue
      }
      break
    }
    return parents.reverse()
  }

  /**
   * 获取所有文档
   * @returns 所有文档
   */
  getAllDocs(): Doc[] {
    return this.resources.filter(r => r.type === 'doc') as Doc[]
  }

  /**
   * 获取所有集合
   * @returns 所有集合
   */
  getAllCollections(): Collection[] {
    return this.resources.filter(r => r.type === 'collection') as Collection[]
  }

  /**
   * 获取指定路径的资源对象
   * @param filePath 文档路径
   * @returns 资源对象
   */
  getResourceByFilePath(filePath: string): Resource | undefined {
    const resourcePath = this.filePathToResourcePath(filePath)
    return this.resources.find(r => r.path === resourcePath)
  }
}
