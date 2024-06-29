import { defineConfig } from 'vitepress';

import pkg from '../package.json';
import { ResourceManager } from './resource';
import * as constant from './constant';
import { createBookmark } from './bookmark';
import localSearchCut from './plugin/local-search-cut';
import virtualResources from './plugin/virtual-resources';
import virtualBreadcrumb from './plugin/virtual-breadcrumb';
import navHmrFix from './plugin/nav-hmr-fix';

import path from 'node:path';

const BASE = '/resources/';
const TITLE = 'Resources';
const LOCALE_ID = 'root';

const resourceManager: ResourceManager = new ResourceManager(constant.SRC_DIR, constant.SRC_EXCLUDE);

const bookmarkFilePath = path.join(constant.SRC_DIR, 'public', 'bookmark.html');
// 创建书签文件
createBookmark(resourceManager, bookmarkFilePath, TITLE + ' Bookmark');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: TITLE,
  description: 'Resource Repository',
  base: BASE,
  srcDir: constant.SRC_DIR,
  cacheDir: 'cache',
  outDir: 'dist',
  head: [
    ['link', { rel: 'icon', href: BASE + 'logo.svg' }]
  ],
  lastUpdated: true,
  vite: {
    plugins: [
      // 本地搜索切词增强插件
      localSearchCut(LOCALE_ID, path.join(__dirname, 'dict.txt')),
      // 导航热更新修复插件
      navHmrFix(resourceManager, __filename),
      // 虚拟资源插件
      virtualResources(resourceManager),
      // 虚拟面包屑插件
      virtualBreadcrumb(resourceManager),
    ]
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: resourceManager.createNav(),
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
    const resource = resourceManager.getResourceByFilePath(filePath);
    if (!resource) {
      return;
    }
    if (resource.type === 'collection') {
      pageData.frontmatter.layout = 'doc';
      pageData.frontmatter.sidebar = false;
      pageData.frontmatter.aside = false;
    } else if (resource.type === 'doc') {
      pageData.frontmatter.layout = 'doc';
    }
    pageData.frontmatter = Object.assign(pageData.frontmatter, resource);
  },
});