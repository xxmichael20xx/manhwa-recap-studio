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
    host: '0.0.0.0',
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
      },
      '/brand': {
        target: 'http://127.0.0.1:3101',
        changeOrigin: true
      }
    }
  }
})
