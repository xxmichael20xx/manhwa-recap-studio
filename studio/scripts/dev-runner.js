import { spawn } from 'child_process'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const apiPort = process.env.PORT || '3101'
const vitePort = process.env.VITE_PORT || '3100'
const healthUrl = `http://127.0.0.1:${apiPort}/api/health`

console.log('Starting Manhwa Recap Studio Suite...')
console.log(`Frontend: http://localhost:${vitePort}`)
console.log(`Backend API: http://localhost:${apiPort}`)

/**
 * Poll the local Express health endpoint until it responds HTTP 200
 * so Vite never accepts browser proxy traffic before the API port is bound.
 */
function waitForBackendReady(url, timeoutMs = 20000, intervalMs = 150) {
  const startedAt = Date.now()
  return new Promise((resolve, reject) => {
    const retry = () => {
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`Timed out waiting for Backend API at ${url}`))
        return
      }
      setTimeout(probe, intervalMs)
    }

    const probe = () => {
      const req = http.get(url, (res) => {
        res.resume()
        if (res.statusCode === 200) {
          resolve()
          return
        }
        retry()
      })
      req.setTimeout(1000, () => {
        req.destroy()
      })
      req.on('error', retry)
    }

    probe()
  })
}

let vite = null
let shuttingDown = false

// Start Express Server with native Node.js auto-watch scoped strictly to server/
const server = spawn(process.execPath, ['--watch', '--watch-path=server', 'server/index.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: apiPort }
})

const handleExit = (exitCode = 0) => {
  if (shuttingDown) return
  shuttingDown = true
  if (vite && !vite.killed) vite.kill()
  if (server && !server.killed) server.kill()
  process.exit(exitCode)
}

server.on('exit', (code) => {
  if (!shuttingDown) {
    console.error(`Backend API exited unexpectedly (code ${code ?? 1}).`)
    handleExit(code ?? 1)
  }
})

process.on('SIGINT', () => handleExit(0))
process.on('SIGTERM', () => handleExit(0))

try {
  await waitForBackendReady(healthUrl)
  if (!shuttingDown) {
    // Launch Vite only after Express is bound and healthy to eliminate proxy ECONNREFUSED races
    vite = spawn(process.execPath, ['./node_modules/vite/bin/vite.js', '--port', vitePort], {
      cwd: rootDir,
      stdio: 'inherit',
      env: { ...process.env, VITE_API_TARGET: `http://127.0.0.1:${apiPort}` }
    })
    vite.on('exit', (code) => {
      if (!shuttingDown) {
        handleExit(code ?? 0)
      }
    })
  }
} catch (err) {
  console.error(err.message)
  handleExit(1)
}
