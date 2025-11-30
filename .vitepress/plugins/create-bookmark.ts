import type { Bookmark } from '@xiaohuohumax/bookmark'
import type { Plugin } from 'vitepress'
import type { View } from '../view'
import fs from 'node:fs'
import path from 'node:path'
import { useDebounceFn } from '@vueuse/core'
import { Builder } from '@xiaohuohumax/bookmark'
import { readViews } from '../view'

function loopViews(collectionId: string, views: View[]): Bookmark[] {
  const bookmarks: Bookmark[] = []
  for (const view of views.filter(view => view.collectionId === collectionId)) {
    if (view.layout === 'collection') {
      const children = loopViews(view.id, views)
      if (children.length > 0) {
        bookmarks.push({
          name: view.title,
          children,
        })
      }
    }
    else if (view.layout === 'resource') {
      bookmarks.push(
        ...view.links.map(link => ({
          name: `${view.title} [${link.text}]`,
          href: link.link,
        })),
      )
    }
  }
  return bookmarks
}

function createBookmark(options: Options) {
  const views = readViews(options.srcDir)
  const homeView = views.find(view => view.layout === 'home')
  const bookmarks = homeView ? loopViews(homeView.id, views) : []
  const builder = new Builder()
  const content = builder.buildHTMLString(bookmarks, ({ bookmark }) => {
    return fs.readFileSync(path.join(__dirname, 'bookmark.html'), 'utf-8')
      .replace(/\{\{\s+bookmark\s+\}\}/gi, () => bookmark)
      .replace(/\{\{\s+icon\s+\}\}/gi, () => options.iconHref)
      .replaceAll(/\{\{\s+title\s+\}\}/gi, () => options.title)
  })
  fs.writeFileSync(path.join(options.publicDir, 'bookmark.html'), content, 'utf-8')
}

export interface Options {
  title: string
  srcDir: string
  publicDir: string
  iconHref: string
}

export default function (options: Options): Plugin {
  return {
    name: 'vitepress:create-bookmark',
    configureServer(server) {
      createBookmark(options)

      const listener = useDebounceFn((file: string) => {
        file.endsWith('.md') && createBookmark(options)
      }, 100)

      server.watcher.on('change', listener)
      server.watcher.on('add', listener)
      server.watcher.on('addDir', listener)
      server.watcher.on('unlink', listener)
      server.watcher.on('unlinkDir', listener)
    },
  }
}
