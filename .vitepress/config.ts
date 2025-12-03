import type { ThemeConfig } from './theme/theme-config'
import path from 'node:path'
import { readPackageSync } from 'read-pkg'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vitepress'
import ClearDist from './plugins/clear-dist'
import CreateBookmark from './plugins/create-bookmark'
import CreateTemplates from './plugins/create-templates'
import VirtualViews from './plugins/virtual-views'
import { readView } from './view'

const pkg = readPackageSync()

function abs(p: string): string {
  return path.resolve(__dirname, p)
}

const title = 'Resources'
const base = '/resources/'
const iconHref = `${base}logo.svg`
const srcDir = abs('../docs')
const outDir = abs('../dist')
const publicDir = abs('../docs')
const templatesDir = abs('../templates')

export default defineConfig<ThemeConfig>({
  title,
  description: 'Resource Repository',
  base,
  outDir,
  srcDir,
  lang: 'zh-CN',
  head: [['link', { rel: 'icon', href: iconHref }], ['meta', { name: 'algolia-site-verification', content: 'A081FC7145F7741F' }]],
  vite: {
    publicDir,
    plugins: [
      VueDevTools(),
      AutoImport({
        imports: ['vue', 'vitepress', '@vueuse/core'],
        dts: abs('types/auto-imports.d.ts'),
      }),
      Components({
        dirs: [abs('./theme/components'), abs('./theme/views')],
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: abs('types/components.d.ts'),
      }),
      VirtualViews(srcDir),
      CreateBookmark({ srcDir, title, publicDir, iconHref }),
      ClearDist(outDir),
      CreateTemplates(templatesDir),
    ],
    resolve: {
      alias: {
        '@vitepress-components': 'vitepress/dist/client/theme-default/components',
        // Overwrite built-in components
        './VPNavBarMenu.vue': abs('./theme/components/overwrite/VPNavBarMenu.vue'),
        './VPNavScreenMenu.vue': abs('./theme/components/overwrite/VPNavScreenMenu.vue'),
      },
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
  },
  lastUpdated: true,
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/xiaohuohumax/resources',
      },
    ],
    view: {
      resource: {
        linkLabel: '资源链接',
        descriptionLabel: '资源描述',
      },
      collection: {
        gotoLabel: '直达',
      },
      nothingHere: '这里什么都没有~',
      favorites: {
        icon: '🌟',
        addLabel: '点击添加到收藏',
        cancelLabel: '点击取消收藏',
      },
    },
    footer: {
      message: '资源仓库',
      copyright: `${pkg.license} Licensed | Copyright © 2024-present ${pkg.author!.name}`,
    },
    lastUpdated: {
      text: '上次更新',
    },
    editLink: {
      pattern: 'https://github.com/xiaohuohumax/resources/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    notFound: {
      title: '网页被外星人劫持了',
      quote: '这里什么都没有',
      linkLabel: '返回首页',
      linkText: '返回首页',
    },
    outline: {
      label: '目录',
    },
    returnToTopLabel: '返回顶部',
    darkModeSwitchTitle: '切换暗黑模式',
    lightModeSwitchTitle: '切换到浅色模式',
  },
  transformPageData(pageData) {
    const filePath = path.join(srcDir, pageData.relativePath)
    const view = readView(filePath, srcDir)
    pageData.frontmatter = view || pageData.frontmatter
  },
})
