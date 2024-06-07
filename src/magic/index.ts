import { Resource } from '../resource';

const resource: Resource = {
  nav: {
    text: '魔法屋',
    items: [
      {
        text: '科学上网',
        link: '/magic/science/proxy'
      },
      {
        text: '篡改猴',
        link: '/magic/tampermonkey/install'
      },
    ]
  },
  sidebar: {
    '/magic/science/': [
      {
        text: '科学上网',
        base: '/magic/science/',
        items: [
          {
            text: '代理服务',
            link: 'proxy',
          },
          {
            text: '搭配工具',
            link: 'tool',
          }
        ]
      },
    ],
    '/magic/tampermonkey/': [
      {
        text: '篡改猴',
        base: '/magic/tampermonkey/',
        items: [
          {
            text: '下载安装',
            link: 'install'
          },
          {
            text: '脚本仓库',
            link: 'lib'
          },
        ]
      },
    ],
  }
};

export default resource;