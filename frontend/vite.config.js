import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    port: 2222, // Vite 默认端口，可修改为你需要的端口
    host: '0.0.0.0', // 允许外部访问
    strictPort: true // 关键配置：如果端口被占用，直接报错退出，而不是自动递增换号
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
