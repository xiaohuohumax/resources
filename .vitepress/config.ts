import { defineConfig } from 'vitepress';
import pkg from '../package.json';
import {
  Resource, loadResources, createResource,
  getResourcesByBelongId, getBreadcrumbsByResource,
  createNav
} from './theme/resource';

import { createBookmark } from './bookmark';

import path from 'node:path';

const BASE = '/resources/';
const TITLE = 'Resources';
const SRC_DIR = path.join(__dirname, '../src');
const PUBLIC_DIR = path.join(SRC_DIR, 'public');

const resources: Resource[] = loadResources(SRC_DIR, ['**/__*.md']);

// 创建书签文件
createBookmark(resources, PUBLIC_DIR, path.join(SRC_DIR, 'public', 'bookmark.html'), TITLE + ' Bookmark');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: TITLE,
  description: 'Resource Repository',
  base: BASE,
  srcDir: SRC_DIR,
  cacheDir: 'cache',
  outDir: 'dist',
  head: [
    ['link', { rel: 'icon', href: path.join(BASE, '/logo.svg') }]
  ],
  lastUpdated: true,
  transformPageData(pageData) {
    const resource = createResource(SRC_DIR, path.join(SRC_DIR, pageData.relativePath));
    if (!resource) {
      return;
    }
    resource.breadcrumbs = getBreadcrumbsByResource(resources, resource);
    if (resource.type === 'collection') {
      pageData.frontmatter.layout = 'doc';
      pageData.frontmatter.sidebar = false;
      pageData.frontmatter.aside = false;
      resource.items = getResourcesByBelongId(resources, resource.id);
    } else if (resource.type === 'doc') {
      pageData.frontmatter.layout = 'doc';
    }
    pageData.frontmatter = Object.assign(pageData.frontmatter, resource);
  },
  srcExclude: ['**/_*.md'],
  themeConfig: {
    logo: '/logo.svg',
    nav: createNav(resources),
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
          root: {
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
  }
});
