import App from './App.vue'
import ElementPlus from '@ks-infra/element-plus'
import _elementStyle from '@ks-infra/element-plus/theme-chalk/index.css?inline'
import { createApp } from 'vue'

const elementStyle = _elementStyle.replace(/:root/g, ':host')

const app = createApp(App, {})
app.use(ElementPlus).mount('#app')
