import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import Collection from './views/Collection.vue'
import Empty from './views/Empty.vue'
import Resource from './views/Resource.vue'
import Tags from './views/Tags.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {}),
  enhanceApp({ app }) {
    app.component('Collection', Collection)
    app.component('Resource', Resource)
    app.component('Empty', Empty)
    app.component('Tags', Tags)
  },
} satisfies Theme
