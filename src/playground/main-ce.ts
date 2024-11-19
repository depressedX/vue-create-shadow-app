import { defineCustomElement } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import _elementStyle from 'element-plus/theme-chalk/index.css?inline'

const elementStyle = _elementStyle.replace(/:root/g, ':host')

const MyApp = defineCustomElement(App, {
  styles: [elementStyle, ...App.styles],
  configureApp(app) {
    app.use(ElementPlus)
  },
})

customElements.define('my-app', MyApp)

const dom = new MyApp()

document.body.appendChild(dom)
