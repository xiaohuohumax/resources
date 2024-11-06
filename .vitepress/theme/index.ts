import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ShowBreadcrumb from './components/ShowBreadcrumb.vue'
import ShowLinks from './components/ShowLinks.vue'
import ShowLogo from './components/ShowLogo.vue'
import ShowResources from './components/ShowResources.vue'
import ShowTags from './components/ShowTags.vue'

import './custom.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ShowResources', ShowResources)
    app.component('ShowBreadcrumb', ShowBreadcrumb)
    app.component('ShowLinks', ShowLinks)
    app.component('ShowLogo', ShowLogo)
    app.component('ShowTags', ShowTags)
  },
}
export default theme
