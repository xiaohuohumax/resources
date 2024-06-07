import { defineConfig } from 'vitepress';
import resources from '../src';
import pkg from '../package.json';

import path from 'node:path';

const base = '/resources/';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Resources',
  description: 'Resource Repository',
  base,
  srcDir: 'src',
  cacheDir: 'cache',
  outDir: 'dist',
  head: [
    ['link', { rel: 'icon', href: path.join(base, '/logo.svg') }]
  ],
  lastUpdated: true,
  themeConfig: {
    logo: 'logo.svg',
    nav: resources.map(r => r.nav),
    sidebar: resources.reduce((acc, r) => Object.assign(acc, r.sidebar), {}),
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
    }
  }
});
