import { Plugin, ViteDevServer } from 'vite';

import {
  Resource, createResource,
  getResourcesByBelongId, spliceResourceByFilePath
} from '../theme/resource';

/**
 * 更新资源或删除资源
 * @param updateType 更新类型
 * @param file 资源文件路径
 * @param server hmr server
 * @param srcDir 资源根目录
 * @param resources 资源对象数组
 * @returns 
 */
function update(updateType: 'unlink' | 'change' | 'add', file: string, server: ViteDevServer, srcDir: string, resources: Resource[]) {

  if (!file.endsWith('.md')) {
    return;
  }

  // 获取资源所属的集合ID
  let belongId: string | null = null;

  if (updateType === 'unlink') {
    // 删除资源对象
    const resource = spliceResourceByFilePath(resources, srcDir, file);
    if (!resource) {
      return;
    }

    belongId = resource.belong.id;
  } else {
    const resource = createResource(srcDir, file);
    if (!resource) {
      return;
    }
    if (updateType === 'change') {
      // 更新资源对象
      const index = resources.findIndex(r => r.path === resource.path);
      index >= 0 && (resources[index] = resource);
    } else if (updateType === 'add') {
      // 新增资源对象
      resources.push(resource);
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
      items: getResourcesByBelongId(resources, belongId)
    },
  });
}

/**
 * 资源热更新插件
 * @param srcDir 资源根目录
 * @param resources 资源对象数组
 * @returns 
 */
export default function (srcDir: string, resources: Resource[]): Plugin {
  return {
    name: 'vitepress:hmr-resources',
    configureServer(server) {
      server.watcher.on('unlink', (file) => update('unlink', file, server, srcDir, resources));
      server.watcher.on('add', (file) => update('add', file, server, srcDir, resources));
    },
    handleHotUpdate({ file, server }) {
      update('change', file, server, srcDir, resources);
    }
  };
}