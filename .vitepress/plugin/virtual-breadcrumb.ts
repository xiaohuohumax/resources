import { Plugin } from 'vite';

import { ResourceManager } from '../resource';

const VIRTUAL_BREADCRUMB_ID = 'virtual:breadcrumb';

/**
 * 虚拟面包屑插件(加载全部资源的面包屑)
 * @param resourceManager 资源管理器
 */
export default function (resourceManager: ResourceManager): Plugin {
  return {
    name: 'vitepress:virtual-breadcrumb',
    resolveId(source) {
      if (source === VIRTUAL_BREADCRUMB_ID) {
        return source;
      }
    },
    load(id) {
      if (id === VIRTUAL_BREADCRUMB_ID) {
        // virtual:breadcrumb => { "collectionId" : Breadcrumb[], ... }
        const records = resourceManager.getAllCollections()
          .map(({ id }) => id)
          .map(collectionId => {
            return `${JSON.stringify(collectionId)} : ${JSON.stringify(resourceManager.getResourceParentsByBelongId(collectionId))}`;
          });
        return `export default { ${records.join(', ')} }`;
      }
    }
  };
}