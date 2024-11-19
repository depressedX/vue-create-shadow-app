import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      features: {
        customElement: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'createShadowApp',
      // the proper extensions will be added
      fileName: 'create-shadow-app',
      formats: ['es'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: (id) =>
        !id.startsWith('\0') &&
        !id.startsWith('.') &&
        !id.startsWith('/') &&
        !id.includes('plugin-vue2:normalizer'),
    },
  },
})
