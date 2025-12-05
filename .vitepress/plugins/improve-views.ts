import type { Plugin } from 'vitepress'
import { useDebounceFn } from '@vueuse/core'
import {
  generateId,
  readMarkdownFiles,
  readMarkdownFrontmatter,
  readView,
  updateMarkdownFrontmatter,
} from '../view'

export default function (srcDir: string): Plugin {
  function fixViewIds(file: string) {
    if (!file.endsWith('.md')) {
      return
    }

    const view = readView(file, srcDir)

    if (!view) {
      return
    }

    const frontmatter = readMarkdownFrontmatter(file)
    const id = generateId(view.pathname)
    frontmatter.id !== id && updateMarkdownFrontmatter(file, { id })
  }

  return {
    name: 'vitepress:improve-views',
    configureServer(server) {
      readMarkdownFiles(srcDir).forEach(fixViewIds)

      const listener = useDebounceFn(fixViewIds, 100)

      server.watcher.on('change', listener)
      server.watcher.on('add', listener)
      server.watcher.on('addDir', listener)
      server.watcher.on('unlink', listener)
      server.watcher.on('unlinkDir', listener)
    },
  }
}
