import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

console.log('⚡ Starting Manhwa Recap Studio Suite...')
console.log('📍 Frontend: http://localhost:3100')
console.log('📍 Backend API: http://localhost:3101')

// Start Express Server
const server = spawn('node', ['server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3101' }
})

// Start Vite Frontend
const vite = spawn('node', ['./node_modules/vite/bin/vite.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
})

const handleExit = () => {
  server.kill()
  vite.kill()
  process.exit()
}

process.on('SIGINT', handleExit)
process.on('SIGTERM', handleExit)
