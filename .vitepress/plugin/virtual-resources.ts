import type { Plugin } from 'vite'
import type { ResourceManager } from '../resource'

export const VIRTUAL_RESOURCES_ID = 'virtual:resources'
export const VIRTUAL_RESOURCES_ITEM_PATH = `${VIRTUAL_RESOURCES_ID}:`

/**
 * 虚拟资源插件(加载集合所包含的资源)
 * @param resourceManager 资源管理器
 * @returns 插件
 */
export default function (resourceManager: ResourceManager): Plugin {
  return {
    name: 'vitepress:virtual-resources',
    resolveId(source) {
      if (source.startsWith(VIRTUAL_RESOURCES_ID)) {
        return source
      }
    },
    load(id) {
      if (id === VIRTUAL_RESOURCES_ID) {
        // virtual:resources => { collectionId: ()=> import('virtual:resources:collectionId'), ... }
        const records = resourceManager.getAllCollections()
          .map(({ id }) => id)
          .map((collectionId) => {
            const importPath = VIRTUAL_RESOURCES_ITEM_PATH + collectionId
            return `${JSON.stringify(collectionId)} : ()=> import('${importPath}')`
          })
        return `export default { ${records.join(', ')} }`
      }
      else if (id.startsWith(VIRTUAL_RESOURCES_ITEM_PATH)) {
        // virtual:resources:collectionId => Resource[]
        const collectionId = id.slice(VIRTUAL_RESOURCES_ITEM_PATH.length)
        return `export default ${JSON.stringify(resourceManager.getSortResourcesByBelongId(collectionId))}`
      }
    },
  }
}
