import { Breadcrumb, Resource, RBase, Collection } from './types';
import { DefaultTheme } from 'vitepress';

import { normalizePath } from 'vite';
import matter from 'gray-matter';
import glob from 'fast-glob';

import path from 'node:path';
import fs from 'node:fs';

export type * from './types';

/**
 * 集合排序默认值
 */
export const BELONG_ORDER_DEFAULT = 9999;

/**
 * 创建资源对象
 * @param srcDir 项目文档源目录
 * @param absFilePath 文档绝对路径
 * @returns 
 */
export function createResource(srcDir: string, absFilePath: string): Resource | undefined {
  const { data } = matter(fs.readFileSync(absFilePath, 'utf-8'));
  if (typeof data.type !== 'string') {
    return;
  }
  const relativePath = normalizePath(path.relative(srcDir, absFilePath));

  if (data.belong === undefined) {
    // 必须有 belong 属性
    throw new Error(`Resource ${relativePath} must have belong property`);
  }
  data.belong.order = data.belong.order ?? BELONG_ORDER_DEFAULT;

  // 标题缺省则取文件名
  const title = data.title ?? path.basename(relativePath, '.md');

  const base: RBase = {
    title,
    path: '/' + relativePath.slice(0, -3),
    belong: data.belong,
    breadcrumbs: [],

    togo: data.togo,
    togoText: data.togoText,
    description: data.description,
    icon: data.icon
  };

  if (data.type === 'collection') {
    // 集合
    const id = data.id
      ?? relativePath
        .replace(/\/index\.md$/g, '.md')
        .replaceAll('/', '-')
        .slice(0, -3);

    return {
      ...base,
      type: 'collection',
      id,
      items: [],
    };
  } else if (data.type === 'doc') {
    // 文档
    return {
      ...base,
      type: 'doc',
      links: data.links ?? [],
    };
  }
}

/**
 * 扫描文档源目录，加载资源对象
 * @param srcDir 项目文档源目录
 * @param srcExclude 排除的文档源目录
 * @returns 
 */
export function loadResources(srcDir: string, srcExclude: string[]): Resource[] {
  const pagePaths = glob.sync(normalizePath(path.join(srcDir, '**/*.md')), {
    ignore: srcExclude
  });
  return pagePaths
    .map(pagePath => createResource(srcDir, pagePath))
    .filter(r => r) as Resource[];
}

/**
 * 获取指定归属的资源对象
 * @param resources 资源对象列表
 * @param belongId 归属 ID
 * @returns 
 */
export function getResourcesByBelongId(resources: Resource[], belongId: string | null): Resource[] {
  return resources
    .filter(r => r.belong?.id === belongId)
    .sort((a, b) => a.belong.order - b.belong.order);
}

/**
 * 获取指定资源的面包屑导航
 * @param resources 资源对象列表
 * @param resource 资源对象
 * @returns 
 */
export function getBreadcrumbsByResource(resources: Resource[], resource: Resource): Breadcrumb[] {
  const parents: Breadcrumb[] = [];
  const collections = resources.filter(r => r.type === 'collection') as Collection[];
  let belongId: string | null = resource.belong.id;
  for (; ;) {
    // 查找父级集合
    const parent = collections.find(r => r.type === 'collection' && r.id === belongId);
    if (parent) {
      parents.push({
        title: parent.title,
        path: parent.path,
        allowClick: parent.belong.id !== null,
      });
      belongId = parent.belong.id;
      continue;
    }
    break;
  }
  // 添加当前资源
  parents.unshift({
    title: resource.title,
    path: resource.path,
    allowClick: false,
  });
  return parents.reverse();
}

/**
 * 创建导航
 * 
 * 默认二级导航
 * @param resources 资源对象列表
 * @returns 
 */
export function createNav(resources: Resource[]): DefaultTheme.NavItem[] {
  const rootCollections = getResourcesByBelongId(resources, null)
    .filter(r => r.type === 'collection') as Collection[];

  return rootCollections.map(collection => {
    const items = getResourcesByBelongId(resources, collection.id).map(r => ({
      text: r.title,
      link: r.path,
    }));

    if (items.length === 0) {
      return { text: collection.title, link: collection.path };
    }

    return { text: collection.title, items };
  });
}