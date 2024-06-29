import { Plugin } from 'vite';
import { ResourceManager } from '../resource';

import fs from 'node:fs';

/**
 * 更新导航文件
 * @param event 事件类型
 * @param resourceManager 资源管理器
 * @param configFilePath 配置文件路径
 * @param file 文件路径
 * @returns 
 */
function updateNav(event: 'unlink' | 'update', resourceManager: ResourceManager, configFilePath: string, file: string) {
  const resource = event === 'unlink'
    ? file
    : resourceManager.createResource(file);

  if (!resource || !resourceManager.isNav(resource)) {
    return;
  }

  // 通过更新配置文件(config.ts)的修改时间触发服务器刷新
  fs.utimesSync(configFilePath, new Date(), new Date());

  // 命令行刷新
  // process.stdin.emit('data', 'h');
  // process.stdin.emit('data', 'r');
}

/**
 * 导航文件热更新修复插件
 * @param resourceManager 资源管理器
 * @param configFilePath 配置文件路径
 * @returns 
 */
export default function (resourceManager: ResourceManager, configFilePath: string): Plugin {
  return {
    name: 'vitepress:nav-hmr-fix',
    configureServer(server) {
      server.watcher.on('unlink', updateNav.bind(null, 'unlink', resourceManager, configFilePath));
      server.watcher.on('add', updateNav.bind(null, 'update', resourceManager, configFilePath));
      server.watcher.on('change', updateNav.bind(null, 'update', resourceManager, configFilePath));
    }
  };
}