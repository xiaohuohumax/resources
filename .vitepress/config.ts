import { DefaultTheme, defineConfig } from 'vitepress';
import pkg from '../package.json';
import { Collection, ResourceManager } from './resource';
import * as constant from './constant';

import { createBookmark } from './bookmark';
import localSearchCut from './plugin/local-search-cut';
import hmrResources from './plugin/hmr-resources';

import path from 'node:path';

const BASE = '/resources/';
const TITLE = 'Resources';
const LOCALE_ID = 'root';

const resourceManager: ResourceManager = new ResourceManager(constant.SRC_DIR, constant.SRC_EXCLUDE);

// 创建书签文件
createBookmark(resourceManager, path.join(constant.SRC_DIR, 'public', 'bookmark.html'), TITLE + ' Bookmark');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: TITLE,
  description: 'Resource Repository',
  base: BASE,
  srcDir: constant.SRC_DIR,
  cacheDir: 'cache',
  outDir: 'dist',
  head: [
    ['link', { rel: 'icon', href: path.join(BASE, '/logo.svg') }]
  ],
  lastUpdated: true,
  vite: {
    plugins: [
      // 本地搜索切词增强插件
      localSearchCut(LOCALE_ID, path.join(__dirname, 'dict.txt')),
      // 资源热更新插件
      hmrResources(resourceManager)
    ]
  },
  srcExclude: ['**/_*.md'],
  themeConfig: {
    logo: '/logo.svg',
    nav: createNav(resourceManager),
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/xiaohuohumax/resources'
      }
    ],
    footer: {
      message: '资源仓库',
      copyright: `${pkg.license} Licensed | Copyright © 2024-present ${pkg.author.name}`
    },
    lastUpdated: {
      text: '上次更新',
    },
    editLink: {
      pattern: 'https://github.com/xiaohuohumax/resources/edit/main/src/:path',
      text: '在 GitHub 上编辑此页面'
    },
    notFound: {
      title: '网页被外星人劫持了',
      quote: '这里什么都没有',
      linkLabel: '返回首页',
      linkText: '返回首页',
    },
    outline: {
      label: '目录'
    },
    returnToTopLabel: '返回顶部',
    search: {
      provider: 'local',
      options: {
        locales: {
          [LOCALE_ID]: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                displayDetails: '显示详细信息',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  },
  transformPageData(pageData) {
    const filePath = path.join(constant.SRC_DIR, pageData.relativePath);
    const resource = resourceManager.createResource(filePath);
    if (!resource) {
      return;
    }
    resource.breadcrumbs = resourceManager.getBreadcrumbsByResource(resource);
    if (resource.type === 'collection') {
      pageData.frontmatter.layout = 'doc';
      pageData.frontmatter.sidebar = false;
      pageData.frontmatter.aside = false;
      resource.items = resourceManager.getResourcesByBelongId(resource.id);
    } else if (resource.type === 'doc') {
      pageData.frontmatter.layout = 'doc';
    }
    pageData.frontmatter = Object.assign(pageData.frontmatter, resource);
  },
});

/**
 * 创建导航
 * 默认二级导航
 * @param resourceManager 资源管理器
 * @returns 
 */
function createNav(resourceManager: ResourceManager): DefaultTheme.NavItem[] {
  const rootCollections = resourceManager.getResourcesByBelongId(null)
    .filter(r => r.type === 'collection') as Collection[];

  return rootCollections.map(collection => {
    const items = resourceManager.getResourcesByBelongId(collection.id).map(r => ({
      text: r.title,
      link: r.path,
    }));

    if (items.length === 0) {
      return { text: collection.title, link: collection.path };
    }

    return { text: collection.title, items };
  });
}