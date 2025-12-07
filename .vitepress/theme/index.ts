import type { Theme } from 'vitepress'
import { inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import RRelatedView from './components/RRelatedView.vue'
import { useVisit } from './composables/visit'
import Article from './views/Article.vue'
import Collection from './views/Collection.vue'
import Empty from './views/Empty.vue'
import Favorites from './views/Favorites.vue'
import Resource from './views/Resource.vue'
import Tags from './views/Tags.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('Collection', Collection)
    app.component('Resource', Resource)
    app.component('Empty', Empty)
    app.component('Tags', Tags)
    app.component('Favorites', Favorites)
    app.component('Article', Article)

    app.component('RRelatedView', RRelatedView)

    inBrowser && (router.onAfterPageLoad = useVisit)
  },
} satisfies Theme
