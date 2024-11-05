import type { Plugin, ViteDevServer } from 'vite'
import type { Resource, ResourceManager } from '../resource'

import fs from 'node:fs'

import { VIRTUAL_BREADCRUMB_ID } from './virtual-breadcrumb'
import { VIRTUAL_RESOURCES_ID, VIRTUAL_RESOURCES_ITEM_PATH } from './virtual-resources'

/**
 * HMR 修复插件
 * @param resourceManager 资源管理器
 */
export default function (resourceManager: ResourceManager): Plugin {
  function updateResource(event: 'unlink' | 'update', resourceManager: ResourceManager, server: ViteDevServer, file: string) {
    let resource: Resource | undefined

    if (event === 'unlink') {
      resource = resourceManager.spliceResource(file)
      if (!resource) {
        return
      }
    }
    else {
      resource = resourceManager.createResource(file)
      if (!resource) {
        // 资源不存在, 则尝试删除资源
        updateResource('unlink', resourceManager, server, file)
        return
      }
      resourceManager.updateResource(resource)
    }

    if (!resource) {
      return
    }

    if (!resourceManager.isNav(resource)) {
      server.moduleGraph.onFileChange(VIRTUAL_RESOURCES_ITEM_PATH + resource.belong.id)
      server.moduleGraph.onFileChange(VIRTUAL_RESOURCES_ID)
      server.moduleGraph.onFileChange(VIRTUAL_BREADCRUMB_ID)
      server?.ws.send({ type: 'full-reload' })
    }
    else {
      // 通过修改配置文件触发服务重启，重新加载路由配置 nav
      fs.utimesSync(__filename, new Date(), new Date())
    }
  }

  let enabled = false
  return {
    name: 'vitepress:hmr-fix',
    config(_config, env) {
      enabled = env.command === 'serve'
    },
    configureServer(server) {
      if (!enabled) {
        return
      }
      server.watcher.on('unlink', updateResource.bind(null, 'unlink', resourceManager, server))
      server.watcher.on('add', updateResource.bind(null, 'update', resourceManager, server))
      server.watcher.on('change', updateResource.bind(null, 'update', resourceManager, server))
    },
  }
}
