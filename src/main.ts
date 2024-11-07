import App from './App.vue'
import ElementPlus from '@ks-infra/element-plus'
import _elementStyle from '@ks-infra/element-plus/theme-chalk/index.css?inline'
import { createShadowApp } from './shadowDom'

const elementStyle = _elementStyle.replace(/:root/g, ':host')

const app = createShadowApp(
  App,
  {},
  {
    styles: [elementStyle, ...App.styles],
    configureApp(app) {
      app.use(ElementPlus)
    },
  },
)
app.use(ElementPlus).mount('#app')
