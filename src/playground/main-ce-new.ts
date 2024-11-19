import App from './App.vue'
import ElementPlus from 'element-plus'
import _elementStyle from 'element-plus/theme-chalk/index.css?inline'
import { createShadowApp } from '../shadowDom'

const elementStyle = _elementStyle.replace(/:root/g, ':host')

const app = createShadowApp(
  App,
  {
    someProp: 'someValue',
  },
  {
    styles: [elementStyle, ...App.styles],
  },
)
app.use(ElementPlus)

const instance = app.mount('#app')

console.log(instance)

// @ts-expect-error for debugging
window.instance = instance
