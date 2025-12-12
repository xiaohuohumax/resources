import type { Plugin } from 'vitepress'
import { useDebounceFn } from '@vueuse/core'
import {
  readViews,
  view2Breadcrumbs,
  view2CollectionChildrenMap,
  view2CollectionStatMap,
  view2Nav,
} from '../util'

export default function (srcDir: string): Plugin {
  const virtualModuleId = 'virtual:views'
  const resolvedVirtualModuleId = `\0${virtualModuleId}`
  return {
    name: 'vitepress:virtual-views',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const views = readViews(srcDir)
        const breadcrumbMap = view2Breadcrumbs(views)
        const collectionChildrenMap = view2CollectionChildrenMap(views)
        const collectionStatMap = view2CollectionStatMap(views)
        const nav = view2Nav(views)
        return `
          export const views = Object.freeze(${JSON.stringify(views)});
          export const breadcrumbMap = Object.freeze(${JSON.stringify(breadcrumbMap)});
          export const collectionChildrenMap = Object.freeze(${JSON.stringify(collectionChildrenMap)});
          export const collectionStatMap = Object.freeze(${JSON.stringify(collectionStatMap)});
          export const nav = Object.freeze(${JSON.stringify(nav)});
        `
      }
    },
    configureServer(server) {
      const listener = useDebounceFn((file: string) => {
        if (!file.endsWith('.md')) {
          return
        }
        const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
        if (module) {
          server.moduleGraph.invalidateModule(module)
          server.ws.send({
            type: 'full-reload',
            path: resolvedVirtualModuleId,
          })
        }
      }, 100)

      server.watcher.on('change', listener)
      server.watcher.on('add', listener)
      server.watcher.on('addDir', listener)
      server.watcher.on('unlink', listener)
      server.watcher.on('unlinkDir', listener)
    },
  }
}
