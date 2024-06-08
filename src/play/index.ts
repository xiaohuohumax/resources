import { Resource } from '../resource';

const resource: Resource = {
  nav: {
    text: '娱乐影音',
    items: [
      {
        text: '游戏',
        link: '/play/game/tower-defense'
      },
      {
        text: '音乐',
        link: '/play/music/online-instruments'
      }
    ]
  },
  sidebar: {
    '/play/game/': [
      {
        text: '游戏',
        base: '/play/game/',
        items: [
          {
            text: '塔防',
            link: 'tower-defense'
          }
        ]
      },
    ],
    '/play/music': [
      {
        text: '音乐',
        base: '/play/music/',
        items: [
          {
            text: '在线乐器',
            link: 'online-instruments'
          }
        ]
      }
    ]
  }
};

export default resource;