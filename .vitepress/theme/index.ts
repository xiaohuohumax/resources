import DefaultTheme from 'vitepress/theme';
import { Theme } from 'vitepress';
import ShowResources from './components/ShowResources.vue';
import ShowBreadcrumb from './components/ShowBreadcrumb.vue';
import ShowLinks from './components/ShowLinks.vue';
import ShowLogo from './components/ShowLogo.vue';

import './custom.css';

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ShowResources', ShowResources);
    app.component('ShowBreadcrumb', ShowBreadcrumb);
    app.component('ShowLinks', ShowLinks);
    app.component('ShowLogo', ShowLogo);
  }
};
export default theme;