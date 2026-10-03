import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3100,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3101',
        changeOrigin: true
      },
      '/audio-stream': {
        target: 'http://127.0.0.1:3101',
        changeOrigin: true
      }
    }
  }
})
