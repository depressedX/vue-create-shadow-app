import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import { createApp } from 'vue'

const app = createApp(App, {})
app.use(ElementPlus).mount('#app')
