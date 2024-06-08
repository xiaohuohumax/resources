import { Resource } from '../resource';

const resource: Resource = {
  nav: {
    text: '娱乐影音',
    items: [
      {
        text: '游戏',
        link: '/play/game/tower-defense'
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
      }
    ]
  }
};

export default resource;