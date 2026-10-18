#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { AntiSlopValidator } from '../server/services/antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

// CLI arguments or defaults
const args = process.argv.slice(2)
const franchiseId = args[0] || 'Series_04_The_Billion_Year_Sovereign'
const episodeId = args[1] || 'EP01_The_One_Billion_Year_Awakening_and_The_Broken_Blade'

console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO — DETERMINISTIC PRE-FLIGHT PROMPT MATRIX LINTER')
console.log('='.repeat(78))
console.log(`Franchise : ${franchiseId}`)
console.log(`Episode   : ${episodeId}`)
console.log('-'.repeat(78))

const epPath = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)
const scriptPath = path.join(epPath, '01_Episode_Script.md')
const promptPath = path.join(epPath, '02_Prompt_Matrix.md')

if (!fs.existsSync(scriptPath)) {
  console.error(`\x1b[31m[FATAL ERROR]\x1b[0m Script file not found: ${scriptPath}`)
  process.exit(1)
}
if (!fs.existsSync(promptPath)) {
  console.error(`\x1b[31m[FATAL ERROR]\x1b[0m Prompt matrix file not found: ${promptPath}`)
  process.exit(1)
}

const scriptText = fs.readFileSync(scriptPath, 'utf-8')
const promptMatrixText = fs.readFileSync(promptPath, 'utf-8')

// Load Character Vault
const vaultDir = path.resolve(projectRoot, '01_Franchises', franchiseId, 'character_vault')
let characters = []
let items = []
let flowEntities = {}

const charsPath = path.join(vaultDir, 'characters.json')
if (fs.existsSync(charsPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(charsPath, 'utf-8'))
    characters = data.characters || []
  } catch (e) {
    console.warn(`[WARN] Failed to parse characters.json: ${e.message}`)
  }
}

const itemsPath = path.join(vaultDir, 'items.json')
if (fs.existsSync(itemsPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'))
    items = data.items || []
  } catch (e) {
    console.warn(`[WARN] Failed to parse items.json: ${e.message}`)
  }
}

const flowPath = path.join(vaultDir, 'flow_entities.json')
if (fs.existsSync(flowPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(flowPath, 'utf-8'))
    flowEntities = data.entities || {}
  } catch (e) {
    console.warn(`[WARN] Failed to parse flow_entities.json: ${e.message}`)
  }
}

// Execute deterministic linter
const report = AntiSlopValidator.auditPromptMatrix(scriptText, promptMatrixText, {
  characters,
  items,
  flowEntities
})

console.log(`\nTotal Scenes Audited: ${report.totalScenes} (Script: ${report.scriptScenesCount})`)
console.log(`Overall Health Score : ${report.overallScore}/100`)
console.log(`Production Status    : ${report.isProductionReady ? '\x1b[32m[PASS] 100% PRODUCTION READY\x1b[0m' : '\x1b[31m[FAIL] PRE-FLIGHT BLOCKED\x1b[0m'}\n`)

console.log('Deterministic Checks Record:')
console.log('-'.repeat(78))

report.checks.forEach((chk, idx) => {
  const icon = chk.passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m'
  const scoreStr = `Score: ${chk.score}%`.padEnd(12)
  console.log(`${idx + 1}. ${chk.name}`)
  console.log(`   ${icon} ${scoreStr} — ${chk.details}`)
  if (!chk.passed && chk.failingScenes && chk.failingScenes.length > 0) {
    console.log(`   \x1b[33m↳ Failing Scenes:\x1b[0m ${chk.failingScenes.join(', ')}`)
  }
  console.log('')
})

console.log('='.repeat(78))

if (!report.isProductionReady) {
  console.error(`\x1b[31m[FIREWALL ACTIVATED]\x1b[0m Pre-Flight Audit Failed. Google Flow dispatch is LOCKED until all issues are resolved.`)
  if (report.failingScenes && report.failingScenes.length > 0) {
    console.error(`Failing Scenes: ${report.failingScenes.join(', ')}`)
  }
  process.exit(1)
} else {
  console.log(`\x1b[32m[SUCCESS]\x1b[0m All 7 Pre-Flight Checks Passed Bit-For-Bit. Production dispatch approved for Google Flow.`)
  process.exit(0)
}
