import { Plugin, ViteDevServer } from 'vite';

import { ResourceManager } from '../resource';

const VIRTUAL_BREADCRUMB_ID = 'virtual:breadcrumb';

/**
 * 更新面包屑
 * @param event 事件类型
 * @param resourceManager 资源管理器
 * @param file 
 */
function updateBreadcrumb(event: 'unlink' | 'update', resourceManager: ResourceManager, server: ViteDevServer, file: string) {
  const resource = event === 'unlink'
    ? resourceManager.getResourceByFilePath(file)
    : resourceManager.createResource(file);
  if (!resource) {
    return;
  }
  server.moduleGraph.onFileChange(VIRTUAL_BREADCRUMB_ID);
}
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
    configureServer(server) {
      server.watcher.on('unlink', updateBreadcrumb.bind(null, 'unlink', resourceManager, server));
      server.watcher.on('add', updateBreadcrumb.bind(null, 'update', resourceManager, server));
      server.watcher.on('change', updateBreadcrumb.bind(null, 'update', resourceManager, server));
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