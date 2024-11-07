import { defineCustomElement } from 'vue'
import App from './App.vue'
import ElementPlus from '@ks-infra/element-plus'
import _elementStyle from '@ks-infra/element-plus/theme-chalk/index.css?inline'

const elementStyle = _elementStyle.replace(/:root/g, ':host')

// convert into custom element constructor
const ExampleElement = defineCustomElement(App, {
  styles: [elementStyle, ...App.styles],
  configureApp(app) {
    app.use(ElementPlus)
  },
})

// register
customElements.define('my-app', ExampleElement)

const dom = new ExampleElement()

document.body.appendChild(dom)
