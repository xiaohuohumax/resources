import { Plugin, ViteDevServer } from 'vite';
import { ResourceManager } from '../resource';

const VIRTUAL_RESOURCES_ID = 'virtual:resources';
const VIRTUAL_RESOURCES_ITEM_PATH = VIRTUAL_RESOURCES_ID + ':';

/**
 * 更新资源
 * @param event 事件类型
 * @param resourceManager 资源管理器
 * @param server 服务器
 * @param file 文件路径
 * @returns 
 */
function updateResource(event: 'unlink' | 'update', resourceManager: ResourceManager, server: ViteDevServer, file: string,) {
  if (!resourceManager.isAllowedPath(file)) {
    return;
  }

  // 导航文件不处理
  if (resourceManager.isNav(file)) {
    return;
  }

  // 资源所属的集合ID
  let collectionId: string | null = null;

  if (event === 'unlink') {
    // 删除资源
    const resource = resourceManager.spliceResource(file);
    if (!resource) {
      return;
    }
    collectionId = resource.belong.id;
  } else {
    // 更新资源
    const resource = resourceManager.createResource(file);
    if (!resource) {
      // 资源不存在, 则尝试删除资源
      updateResource('unlink', resourceManager, server, file);
      return;
    }
    collectionId = resource.belong.id;
    resourceManager.updateResource(resource);
  }

  if (!collectionId) {
    return;
  }

  // 更新
  server?.moduleGraph.onFileChange(VIRTUAL_RESOURCES_ITEM_PATH + collectionId);
  server?.moduleGraph.onFileChange(VIRTUAL_RESOURCES_ID);

  // 通知客户端刷新
  server?.ws.send({ type: 'full-reload' });
}

/**
 * 虚拟资源插件(加载集合所包含的资源)
 * @param resourceManager 资源管理器
 * @returns 
 */
export default function (resourceManager: ResourceManager): Plugin {
  return {
    name: 'vitepress:virtual-resources',
    configureServer(server) {
      server.watcher.on('unlink', updateResource.bind(null, 'unlink', resourceManager, server));
      server.watcher.on('add', updateResource.bind(null, 'update', resourceManager, server));
      server.watcher.on('change', updateResource.bind(null, 'update', resourceManager, server));
    },
    resolveId(source) {
      if (source.startsWith(VIRTUAL_RESOURCES_ID)) {
        return source;
      }
    },
    load(id) {
      if (id === VIRTUAL_RESOURCES_ID) {
        // virtual:resources => { collectionId: ()=> import('virtual:resources:collectionId'), ... }
        const records = resourceManager.getAllCollections()
          .map(({ id }) => id)
          .map(collectionId => {
            const importPath = VIRTUAL_RESOURCES_ITEM_PATH + collectionId;
            return `${JSON.stringify(collectionId)} : ()=> import('${importPath}')`;
          });
        return `export default { ${records.join(', ')} }`;
      } else if (id.startsWith(VIRTUAL_RESOURCES_ITEM_PATH)) {
        // virtual:resources:collectionId => Resource[]
        const collectionId = id.slice(VIRTUAL_RESOURCES_ITEM_PATH.length);
        return `export default ${JSON.stringify(resourceManager.getResourcesByBelongId(collectionId))}`;
      }
    }
  };
}