import { Plugin, ViteDevServer } from 'vite';

import { ResourceManager } from '../resource';

/**
 * 更新资源或删除资源
 * @param updateType 更新类型
 * @param file 资源文件路径
 * @param server hmr server
 * @param resourceManager 资源管理器
 * @returns 
 */
function update(updateType: 'unlink' | 'change' | 'add', file: string, server: ViteDevServer, resourceManager: ResourceManager) {

  if (!file.endsWith('.md') || !resourceManager.isAllowedPath(file)) {
    return;
  }

  // 获取资源所属的集合ID
  let belongId: string | null = null;

  if (updateType === 'unlink') {
    // 删除资源对象
    const resource = resourceManager.spliceResource(file);
    if (!resource) {
      return;
    }

    belongId = resource.belong.id;
  } else {
    const resource = resourceManager.createResource(file);
    if (!resource) {
      // 无法识别为资源文件, 尝试删除资源对象
      update('unlink', file, server, resourceManager);
      return;
    }
    if (updateType === 'change' || updateType === 'add') {
      // 更新资源对象
      resourceManager.updateResource(resource);
    }
    belongId = resource.belong.id;
  }

  if (!belongId) {
    return;
  }

  // 发送更新消息
  server.ws.send({
    type: 'custom',
    event: 'update-collection-items',
    data: {
      collectionId: belongId,
      items: resourceManager.getResourcesByBelongId(belongId)
    },
  });
}

/**
 * 资源热更新插件
 * @param resourceManager 资源管理器
 * @returns 
 */
export default function (resourceManager: ResourceManager): Plugin {
  return {
    name: 'vitepress:hmr-resources',
    configureServer(server) {
      server.watcher.on('unlink', (file) => update('unlink', file, server, resourceManager));
      server.watcher.on('add', (file) => update('add', file, server, resourceManager));
      server.watcher.on('change', (file) => update('change', file, server, resourceManager));
    },
    // handleHotUpdate({ file, server }) {
    //   update('change', file, server, resourceManager);
    // }
  };
}