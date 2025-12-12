import type { Bookmark } from '@xiaohuohumax/bookmark'
import type { Plugin } from 'vitepress'
import type { CollectionChildrenMap } from '../util'
import fs from 'node:fs'
import path from 'node:path'
import { useDebounceFn } from '@vueuse/core'
import { Builder } from '@xiaohuohumax/bookmark'
import { isArticleView, isCollectionView, isHomeView, isResourceView } from '../theme/view'
import { readViews, view2CollectionChildrenMap } from '../util'

export interface Options {
  title: string
  srcDir: string
  publicDir: string
  iconHref: string
  hostname: string
}

export default function (options: Options): Plugin {
  function loopViews(collectionId: string, collectionChildrenMap: CollectionChildrenMap): Bookmark[] {
    const bookmarks: Bookmark[] = []
    const children = collectionChildrenMap[collectionId]
    if (!children) {
      return bookmarks
    }

    for (const view of children) {
      if (isCollectionView(view)) {
        const children = loopViews(view.id, collectionChildrenMap)
        if (children.length > 0) {
          bookmarks.push({
            name: view.title,
            children,
          })
        }
      }
      else if (isResourceView(view)) {
        bookmarks.push(
          ...view.links.map(link => ({
            name: `${view.title} [${link.text}]`,
            href: link.link,
          })),
        )
      }
      else if (isArticleView(view)) {
        bookmarks.push({
          name: view.title,
          href: new URL(view.pathname, options.hostname).href,
        })
      }
    }
    return bookmarks
  }

  function createBookmark() {
    const views = readViews(options.srcDir)
    const homeView = views.find(v => isHomeView(v))
    const collectionChildrenMap = view2CollectionChildrenMap(views)
    const bookmarks = homeView ? loopViews(homeView.id, collectionChildrenMap) : []
    const builder = new Builder()
    const content = builder.buildHTMLString(bookmarks, ({ bookmark }) => {
      return fs.readFileSync(path.join(__dirname, 'bookmark.html'), 'utf-8')
        .replace(/\{\{\s+bookmark\s+\}\}/gi, () => bookmark)
        .replace(/\{\{\s+icon\s+\}\}/gi, () => options.iconHref)
        .replaceAll(/\{\{\s+title\s+\}\}/gi, () => options.title)
    })
    fs.writeFileSync(path.join(options.publicDir, 'bookmark.html'), content, 'utf-8')
  }

  return {
    name: 'vitepress:create-bookmark',
    buildStart() {
      createBookmark()
    },
    configureServer(server) {
      const listener = useDebounceFn((file: string) => {
        file.endsWith('.md') && createBookmark()
      }, 100)

      server.watcher.on('change', listener)
      server.watcher.on('add', listener)
      server.watcher.on('addDir', listener)
      server.watcher.on('unlink', listener)
      server.watcher.on('unlinkDir', listener)
    },
  }
}
