import type { Bookmark } from '@xiaohuohumax/bookmark'
import type { ResourceManager } from '../resource'

import fs from 'node:fs'

import path from 'node:path'
import { Builder as BookmarkBuilder } from '@xiaohuohumax/bookmark'

/**
 * 依据 belongId 创建书签树
 * @param resourceManager 资源管理器
 * @param belongId 归属 ID
 * @returns 书签树
 */
function createBookmarkByBelongId(resourceManager: ResourceManager, belongId: string | null): Bookmark[] {
  const resources = resourceManager.getSortResourcesByBelongId(belongId)

  return resources.map((r) => {
    if (r.type === 'collection') {
      const children = createBookmarkByBelongId(resourceManager, r.id)
      if (children.length === 0) {
        return undefined
      }
      return { name: r.title, children }
    }
    return r.links.map(l => ({
      name: r.title + (r.links.length > 1 ? `-${l.text}` : ''),
      href: l.link,
    }))
  }).flat().filter(b => b) as Bookmark[]
}

/**
 * 创建书签文件
 * @param resourceManager 资源管理器
 * @param filePath 输出文件路径
 * @param title 书签标题
 */
export function createBookmark(resourceManager: ResourceManager, filePath: string, title: string): void {
  const builder = new BookmarkBuilder({})

  const bms: Bookmark[] = createBookmarkByBelongId(resourceManager, null)

  const bookmarkHtml = builder.buildHTMLString(bms, ({ bookmark }) =>
    fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8')
      .replace(/\{\{\s+bookmark\s+\}\}/gi, () => bookmark)
      .replaceAll(/\{\{\s+title\s+\}\}/gi, () => title))

  fs.writeFileSync(filePath, bookmarkHtml)
}
