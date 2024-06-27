import { Breadcrumb, Resource, RBase, Collection, Doc } from './theme/types';

import { normalizePath } from 'vite';
import matter from 'gray-matter';
import glob from 'fast-glob';
import micromatch from 'micromatch';

import path from 'node:path';
import fs from 'node:fs';

export type * from './theme/types';

/**
 * 资源管理器
 */
export class ResourceManager {
  // 资源对象列表
  private resources: Resource[];
  // 集合排序默认值
  static BELONG_ORDER_DEFAULT = 9999;

  /**
   * @param srcDir 项目文档源目录
   * @param srcExclude 项目文档源目录排除项
   */
  constructor(private srcDir: string, private srcExclude: string[]) {
    const pagePaths = glob.sync(normalizePath(path.join(this.srcDir, '**/*.md')), {
      ignore: srcExclude
    });
    this.resources = pagePaths
      .map(pagePath => this.createResource(pagePath))
      .filter(r => r) as Resource[];
  }

  /**
   * 检查路径是否允许
   * @param filePath 文档路径
   * @returns 
   */
  isAllowedPath(filePath: string): boolean {
    return micromatch.isMatch(filePath, normalizePath(path.join(this.srcDir, '**/*.md')), {
      ignore: this.srcExclude
    });
  }

  /**
   * 创建资源对象
   * @param filePath 文档路径
   * @returns 
   */
  createResource(filePath: string): Resource | undefined {
    if (!this.isAllowedPath(filePath)) {
      return;
    }

    const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
    if (typeof data.type !== 'string') {
      return;
    }
    const resourcePath = this.filePathToResourcePath(filePath);

    if (data.belong === undefined) {
      // 必须有 belong 属性
      console.warn(`Resource ${resourcePath} must have belong property`);
      return;
    }
    data.belong.order = data.belong.order ?? ResourceManager.BELONG_ORDER_DEFAULT;

    // 标题缺省则取文件名
    const title = data.title ?? path.basename(resourcePath);

    const base: RBase = {
      title,
      path: resourcePath,
      belong: data.belong,

      togo: data.togo,
      togoText: data.togoText,
      description: data.description,
      icon: data.icon
    };

    if (data.type === 'collection') {
      // 集合
      const id = data.id
        ?? resourcePath
          .replace(/\/index$/g, '')
          .replaceAll('/', '-');

      return {
        ...base,
        type: 'collection',
        id,
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
   * 移除指定文件路径的资源对象
   * @param filePath 文档绝对路径
   */
  spliceResource(filePath: string) {
    const index = this.resources.findIndex(r => r.path === this.filePathToResourcePath(filePath));
    return index !== -1 ? this.resources.splice(index, 1)[0] : undefined;
  }

  /**
   * 更新资源对象
   * @param resource 资源对象
   */
  updateResource(resource: Resource) {
    const index = this.resources.findIndex(r => r.path === resource.path);
    if (index !== -1) {
      this.resources[index] = resource;
    } else {
      this.resources.push(resource);
    }
  }

  /**
   * 路径转资源路径
   * @param filePath 文档路径
   * @returns 
   */
  filePathToResourcePath(filePath: string): string {
    const relativePath = normalizePath(path.relative(this.srcDir, filePath));
    return '/' + relativePath.slice(0, -3);
  }

  /**
   * 获取指定归属的资源对象
   * @param belongId 归属 ID
   * @returns 
   */
  getResourcesByBelongId(belongId: string | null): Resource[] {
    return this.resources
      .filter(r => r.belong?.id === belongId)
      .sort((a, b) => a.belong.order - b.belong.order);
  }

  /**
   * 获取指定归属的资源对象父级集合
   * @param belongId 归属 ID
   * @returns 
   */
  getResourceParentsByBelongId(belongId: string | null): Breadcrumb[] {
    const parents: Breadcrumb[] = [];
    const collections = this.resources.filter(r => r.type === 'collection') as Collection[];
    for (; ;) {
      // 查找父级集合
      const parent = collections.find(r => r.type === 'collection' && r.id === belongId);
      if (parent) {
        parents.push({
          title: parent.title,
          path: parent.path
        });
        belongId = parent.belong.id;
        continue;
      }
      break;
    }
    return parents.reverse();
  }

  /**
   * 获取所有集合
   * @returns 
   */
  getAllDocs(): Doc[] {
    return this.resources.filter(r => r.type === 'doc') as Doc[];
  }

  /**
   * 获取所有集合
   * @returns 
   */
  getAllCollections(): Collection[] {
    return this.resources.filter(r => r.type === 'collection') as Collection[];
  }

}