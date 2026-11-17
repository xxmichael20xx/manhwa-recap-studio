import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const apiTarget = process.env.VITE_API_TARGET || 'http://127.0.0.1:3101'

function createBackendProxy() {
  return {
    target: apiTarget,
    changeOrigin: true,
    configure: (proxy) => {
      proxy.on('error', (err, _req, res) => {
        if (res && !res.headersSent && typeof res.writeHead === 'function') {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            error: 'Backend API is starting or restarting; retry shortly.',
            code: err?.code || 'ECONNREFUSED'
          }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_PORT) || 3100,
    strictPort: true,
    proxy: {
      '/api': createBackendProxy(),
      '/audio-stream': createBackendProxy(),
      '/brand': createBackendProxy()
    }
  }
})

