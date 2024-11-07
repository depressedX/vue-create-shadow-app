import { fileURLToPath, URL } from 'node:url'

import { defineConfig, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteVueCESubStyle } from '@unplugin-vue-ce/sub-style'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      features: {
        customElement: true,
      },
    }),
    // https://github.com/vuejs/core/issues/4662
    // viteVueCESubStyle() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
