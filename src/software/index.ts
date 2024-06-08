import { Resource } from '../resource';

const resource: Resource = {
  nav: {
    text: '软件资源',
    items: [
      {
        text: '电脑端',
        link: '/software/pc/required'
      },
      {
        text: '移动端',
        link: '/software/mobile/required'
      },
      {
        text: 'WEB端',
        link: '/software/web/tool/color'
      }
    ]
  },
  sidebar: {
    '/software/pc/': [
      {
        text: '电脑端',
        base: '/software/pc/',
        items: [
          {
            text: '装机必备',
            link: 'required',
          },
          {
            text: '软件开发',
            base: '/software/pc/code/',
            collapsed: true,
            items: [
              {
                text: '开发环境',
                link: 'env'
              },
              {
                text: '编辑器',
                link: 'editor'
              },
              {
                text: '版本控制',
                link: 'version'
              },
              {
                text: '数据库',
                link: 'database'
              },
              {
                text: '托管平台',
                link: 'hosting'
              },
              {
                text: '系统镜像',
                link: 'iso'
              },
              {
                text: '虚拟环境',
                link: 'virtual'
              },
              {
                text: '接口测试',
                link: 'api'
              }
            ]
          },
          {
            text: '系统美化',
            base: '/software/pc/beautification/',
            collapsed: true,
            items: [
              {
                text: '文字字体',
                link: 'font'
              },
              {
                text: '鼠标指针',
                link: 'cursors'
              }
            ]
          },
          {
            text: '下载器',
            link: 'downloader'
          },
          {
            text: '工作办公',
            link: 'office',
          }
        ]
      },
    ],
    '/software/mobile/': [
      {
        text: '移动端',
        base: '/software/mobile/',
        items: [
          {
            text: '必备App',
            link: 'required'
          },
          {
            text: '文件同步',
            link: 'sync',
          },
          {
            text: '文件管理',
            link: 'file',
          },
          {
            text: '邮件管理',
            link: 'email',
          },
          {
            text: '图片管理',
            link: 'picture'
          },
          {
            text: '密码安全',
            link: 'password'
          }
        ]
      },
    ],
    '/software/web/': [
      {
        text: 'WEB端',
        base: '/software/web/',
        items: [
          {
            text: '在线工具',
            base: '/software/web/tool/',
            items: [
              {
                text: '颜色',
                link: 'color'
              },
              {
                text: '图片',
                link: 'image'
              },
              {
                text: '文件',
                link: 'file'
              },
              {
                text: '文字',
                link: 'text'
              },
              {
                text: '绘制',
                link: 'draw'
              },
              {
                text: 'AST',
                link: 'ast'
              },
              {
                text: 'API',
                link: 'api'
              }
            ]
          },
          {
            text: 'Git练习',
            link: 'git-learn'
          }
        ]
      }
    ]
  }
};

export default resource;