#!/usr/bin/env node
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const studioAuditScript = path.resolve(__dirname, '../studio/scripts/audit-matrix.js')

const child = spawn(process.execPath, [studioAuditScript, ...process.argv.slice(2)], {
  stdio: 'inherit'
})

child.on('close', (code) => {
  process.exit(code || 0)
})
