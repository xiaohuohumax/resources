import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import RLayout from './components/RLayout.vue'
import RRelatedView from './components/RRelatedView.vue'
import Article from './views/Article.vue'
import Collection from './views/Collection.vue'
import Empty from './views/Empty.vue'
import Favorites from './views/Favorites.vue'
import Resource from './views/Resource.vue'
import Tags from './views/Tags.vue'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: RLayout,
  enhanceApp({ app }) {
    app.component('Collection', Collection)
    app.component('Resource', Resource)
    app.component('Empty', Empty)
    app.component('Tags', Tags)
    app.component('Favorites', Favorites)
    app.component('Article', Article)

    app.component('RRelatedView', RRelatedView)
  },
} satisfies Theme
