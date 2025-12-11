import type { HeadConfig } from 'vitepress'
import type { ThemeConfig } from './theme/theme-config'
import path from 'node:path'
import { readPackageSync } from 'read-pkg'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vitepress'
import { RssPlugin } from 'vitepress-plugin-rss'
import ClearDist from './plugins/clear-dist'
import CreateBookmark from './plugins/create-bookmark'
import CreateTemplates from './plugins/create-templates'
import ImproveViews from './plugins/improve-views'
import VirtualViews from './plugins/virtual-views'
import { readView } from './view'

const pkg = readPackageSync()

function abs(p: string): string {
  return path.resolve(__dirname, p)
}

const lang = 'zh-CN'
const title = 'Resources'
const description = '资源仓库 · 收录各种常用资源地址(软件、配置、文档等)'
const repo = 'https://github.com/xiaohuohumax/resources'
const github = 'https://github.com/xiaohuohumax'
const hostname = 'https://xiaohuohumax.github.io/resources/'

const base = '/resources/'
const iconHref = `${base}logo.svg`
const srcDir = abs('../docs')
const outDir = abs('../dist')
const templatesDir = abs('../templates')

export default defineConfig<ThemeConfig>({
  title,
  description,
  base,
  outDir,
  srcDir,
  lang,
  head: [
    ['link', { rel: 'icon', href: iconHref }],
    ['meta', { name: 'algolia-site-verification', content: 'A081FC7145F7741F' }],
  ],
  vite: {
    publicDir: srcDir,
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
      CreateBookmark({ srcDir, title, publicDir: srcDir, iconHref, hostname }),
      ClearDist(outDir),
      CreateTemplates(templatesDir),
      ImproveViews(srcDir),
      RssPlugin({
        title,
        language: lang,
        description,
        link: hostname,
        author: { name: pkg.author!.name, link: pkg.author!.url },
        baseUrl: 'https://xiaohuohumax.github.io',
        copyright: `${pkg.license} Licensed | Copyright © 2024-present ${pkg.author!.name}`,
        filter(value) {
          const view = readView(value.filepath, srcDir)
          return view ? view.layout === 'resource' : false
        },
      }),
    ],
    resolve: {
      alias: {
        '@vitepress-components': 'vitepress/dist/client/theme-default/components',
        // Overwrite built-in components
        './VPNavBarMenu.vue': abs('./theme/components/overwrite/VPNavBarMenu.vue'),
        './VPNavScreenMenu.vue': abs('./theme/components/overwrite/VPNavScreenMenu.vue'),
        './components/VPFooter.vue': abs('./theme/components/overwrite/VPFooter.vue'),
      },
    },
    build: { chunkSizeWarningLimit: 5000 },
  },
  lastUpdated: true,
  sitemap: { hostname },
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [{ icon: 'github', link: repo }],
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
        addLabel: '点击添加到收藏',
        cancelLabel: '点击取消收藏',
      },
    },
    relatedView: {
      notFound: '没有找到相关内容',
    },
    viewCard: {
      collectionCountLabel: '集合',
      resourceCountLabel: '资源',
      articleCountLabel: '文章',
    },
    footer: {
      message: description,
      copyright: `<a class="link" href="${repo}?tab=MIT-1-ov-file">${pkg.license}</a> Licensed | Copyright © 2024-present <a class="link" href="${github}">${pkg.author!.name}</a>`,
      page_pv: '本页面访问量',
      site_pv: '网站总访问量',
      site_uv: '网站总访客数',
    },
    lastUpdated: {
      text: '上次更新',
    },
    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
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
    search: {
      provider: 'algolia',
      options: {
        appId: '3F33UB94VN',
        apiKey: '4d8e2a08e6724a6f0a64171fcec3a18b',
        indexName: 'resources',
        placeholder: '搜索文档',
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            searchBox: {
              clearButtonTitle: '清除查询条件',
              clearButtonAriaLabel: '清除查询条件',
              closeButtonText: '关闭',
              closeButtonAriaLabel: '关闭',
              placeholderText: '搜索文档',
              placeholderTextAskAi: '向 AI 提问：',
              placeholderTextAskAiStreaming: '回答中...',
              searchInputLabel: '搜索',
              backToKeywordSearchButtonText: '返回关键字搜索',
              backToKeywordSearchButtonAriaLabel: '返回关键字搜索',
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除',
              recentConversationsTitle: '最近的对话',
              removeRecentConversationButtonTitle: '从历史记录中删除对话',
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '请检查网络连接',
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈',
            },
            resultsScreen: { askAiPlaceholder: '向 AI 提问： ' },
            askAiScreen: {
              disclaimerText: '答案由 AI 生成，可能不准确，请自行验证。',
              relatedSourcesText: '相关来源',
              thinkingText: '思考中...',
              copyButtonText: '复制',
              copyButtonCopiedText: '已复制！',
              copyButtonTitle: '复制',
              likeButtonTitle: '赞',
              dislikeButtonTitle: '踩',
              thanksForFeedbackText: '感谢你的反馈！',
              preToolCallText: '搜索中...',
              duringToolCallText: '搜索 ',
              afterToolCallText: '已搜索',
            },
            footer: {
              selectText: '选择',
              submitQuestionText: '提交问题',
              selectKeyAriaLabel: 'Enter 键',
              navigateText: '切换',
              navigateUpKeyAriaLabel: '向上箭头',
              navigateDownKeyAriaLabel: '向下箭头',
              closeText: '关闭',
              backToSearchText: '返回搜索',
              closeKeyAriaLabel: 'Esc 键',
              poweredByText: '搜索提供者',
            },
          },
        },
      },
    },
  },
  transformPageData(pageData) {
    const view = readView(path.join(srcDir, pageData.relativePath), srcDir)
    pageData.frontmatter = view || pageData.frontmatter
  },
  transformHead({ pageData }) {
    const view = readView(path.join(srcDir, pageData.relativePath), srcDir)
    const heads: HeadConfig[] = []
    if (view && (view.layout === 'resource' || view.layout === 'article')) {
      heads.push(['meta', { name: 'keywords', content: view.tags.join(',') }])
    }
    return heads
  },
})
