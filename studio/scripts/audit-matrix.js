#!/usr/bin/env node
/**
 * studio/scripts/audit-matrix.js
 *
 * Universal 18-Gate Allow-List CLI Linter Runner (v2.0).
 * Usage: node studio/scripts/audit-matrix.js <franchiseId> <episodeId> [--json]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { AntiSlopValidator } from '../server/services/antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const jsonOnly = args.includes('--json')
const positionalArgs = args.filter(a => !a.startsWith('--'))

const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]

if (!franchiseId || !episodeId) {
  console.error('Usage: node studio/scripts/audit-matrix.js <franchiseId> <episodeId> [--json]')
  process.exit(1)
}

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
const epPath = path.resolve(franchiseDir, episodeId)
const scriptPath = path.join(epPath, '01_Episode_Script.md')
const promptPath = path.join(epPath, '02_Prompt_Matrix.md')

if (!fs.existsSync(scriptPath) || !fs.existsSync(promptPath)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Missing script or prompt matrix in: ${epPath}`)
  process.exit(1)
}

const loadJsonIfExists = filePath => {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (e) {
    console.warn(`[WARN] Failed to parse ${filePath}: ${e.message}`)
    return null
  }
}

const scriptText = fs.readFileSync(scriptPath, 'utf-8')
const promptMatrixText = fs.readFileSync(promptPath, 'utf-8')

const franchise = loadJsonIfExists(path.join(franchiseDir, 'franchise.json'))
const entities =
  loadJsonIfExists(path.join(franchiseDir, franchise?.paths?.entities || 'vault/entities.json')) || {}
const zones =
  loadJsonIfExists(path.join(franchiseDir, franchise?.paths?.zones || 'vault/zones.json')) || {}
const policy =
  loadJsonIfExists(path.join(franchiseDir, franchise?.paths?.policy || 'policy.json')) ||
  loadJsonIfExists(path.resolve(projectRoot, '00_Engine/policy.json'))

const legacyChars = loadJsonIfExists(path.join(franchiseDir, 'character_vault/characters.json'))?.characters || []
const legacyItems = loadJsonIfExists(path.join(franchiseDir, 'character_vault/items.json'))?.items || []
const legacyLocations = loadJsonIfExists(path.join(franchiseDir, '00_Locations/locations.json'))?.locations || []

const ledgerPath = path.join(epPath, franchise?.paths?.ledger || 'state_events.jsonl')
const ledgerText = fs.existsSync(ledgerPath) ? fs.readFileSync(ledgerPath, 'utf-8') : ''
const scenesJson = loadJsonIfExists(path.join(epPath, 'scenes.json'))
const audioTelemetry = loadJsonIfExists(path.join(epPath, 'audio_telemetry.json'))
const manifest = loadJsonIfExists(path.join(epPath, 'dispatch_manifest.json'))

const report = AntiSlopValidator.auditPromptMatrix(scriptText, promptMatrixText, {
  franchise,
  franchiseDir,
  epPath,
  episodeId,
  entities,
  zones,
  policy,
  characters: legacyChars,
  items: legacyItems,
  locations: legacyLocations,
  ledgerText,
  scenesJson,
  audioTelemetry,
  manifest
})

if (process.argv.includes('--update-manifest') && report.expectedManifest) {
  fs.writeFileSync(path.join(epPath, 'dispatch_manifest.json'), JSON.stringify(report.expectedManifest, null, 2), 'utf-8')
  console.log(`[MANIFEST] Updated dispatch_manifest.json with signature: ${report.expectedManifest.signature}`)
}

if (jsonOnly) {
  console.log(
    JSON.stringify(
      {
        franchiseId,
        episodeId,
        overallScore: report.overallScore,
        isProductionReady: report.isProductionReady,
        gateCount: report.checks.length,
        manifestSignature: manifest?.signature || null,
        failingGates: report.checks
          .filter(c => !c.passed)
          .map(c => ({ id: c.id, failingScenes: c.failingScenes }))
      },
      null,
      2
    )
  )
  process.exit(report.isProductionReady ? 0 : 1)
}

console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO — UNIVERSAL ALLOW-LIST PRE-FLIGHT LINTER (v2.0)')
console.log('='.repeat(78))
console.log(`Franchise : ${franchiseId}`)
console.log(`Episode   : ${episodeId}`)
console.log(`Scenes    : ${report.totalScenes} (Script: ${report.scriptScenesCount})`)
console.log(`Score     : ${report.overallScore}/100 (${report.checks.length} Gates Audited)`)
console.log(`Manifest  : ${manifest?.signature || 'UNSIGNED (Run compile-matrix.js)'}`)
console.log('-'.repeat(78))

report.checks.forEach((chk, idx) => {
  const badge = chk.passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m'
  console.log(`${String(idx + 1).padStart(2, '0')}. ${badge} ${chk.name}`)
  if (!chk.passed) {
    console.log(`    ↳ ${chk.details}`)
  }
})

console.log('='.repeat(78))
if (!report.isProductionReady) {
  console.error(
    `\x1b[31m[FIREWALL LOCKED]\x1b[0m Failing Scene IDs: ${report.failingScenes.join(', ')}`
  )
  process.exit(1)
} else {
  console.log(
    `\x1b[32m[APPROVED]\x1b[0m All ${report.checks.length} Pre-Flight Gates Passed. Ready for Google Flow.`
  )
  process.exit(0)
}
