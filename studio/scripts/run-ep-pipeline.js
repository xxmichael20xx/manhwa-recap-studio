#!/usr/bin/env node
/**
 * studio/scripts/run-ep-pipeline.js
 *
 * Single-Command Chained Episodic QA & Compilation Pipeline Runner (v1.0).
 * Replaces 7 sequential LLM CLI turns with 1 deterministic execution (<2s).
 *
 * Pipeline Stages:
 *   1. extract-zones.js
 *   2. audit-script.js [--heal-headers]
 *   3. init-world-state.js
 *   4. compile-matrix.js (when --compile is passed)
 *   5. sanitize-matrix.js
 *   6. audit-policy.js --fix
 *   7. audit-matrix.js [--update-manifest] --json
 *
 * Usage:
 *   node studio/scripts/run-ep-pipeline.js <franchiseId> <episodeId> [--compile] [--heal-headers] [--update-manifest] [--json]
 */

import { spawnSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const doCompile = args.includes('--compile')
const doHealHeaders = args.includes('--heal-headers')
const doUpdateManifest = !args.includes('--no-update-manifest')
const jsonOnly = args.includes('--json')
const positional = args.filter(a => !a.startsWith('--'))

const franchiseId = positional[0]
const episodeId = positional[1]

if (!franchiseId || !episodeId) {
  console.error('Usage: node studio/scripts/run-ep-pipeline.js <franchiseId> <episodeId> [--compile] [--heal-headers] [--update-manifest] [--json]')
  process.exit(1)
}

const runStep = (name, scriptName, extraArgs = []) => {
  const scriptPath = path.join(__dirname, scriptName)
  const start = Date.now()
  const res = spawnSync(process.execPath, [scriptPath, franchiseId, episodeId, ...extraArgs], {
    cwd: projectRoot,
    encoding: 'utf-8'
  })
  const elapsedMs = Date.now() - start
  return {
    name,
    script: scriptName,
    exitCode: res.status ?? 1,
    elapsedMs,
    stdout: (res.stdout || '').trim(),
    stderr: (res.stderr || '').trim()
  }
}

const steps = []

// Step 1: Extract Zones
steps.push(runStep('1. Spatial Boundary & Zone Extraction', 'extract-zones.js', ['--json']))

// Step 2: Script Audit (+ optional header & sticky prop healing)
const scriptArgs = ['--json']
if (doHealHeaders) scriptArgs.unshift('--heal-headers')
steps.push(runStep('2. Episodic Script & Sticky Prop Audit', 'audit-script.js', scriptArgs))

// Step 3: World State Scaffolder
steps.push(runStep('3. World State & Prop Continuity Windows', 'init-world-state.js', ['--json']))

// Step 4: Optional Matrix Compilation
if (doCompile) {
  steps.push(runStep('4. Deterministic 5-Layer Matrix Compilation', 'compile-matrix.js', []))
}

// Step 5: Matrix Sanitiser
steps.push(runStep('5. Matrix Sanitiser & Sync Normaliser', 'sanitize-matrix.js', ['--json']))

// Step 6: Google Flow Policy Shield (--fix)
steps.push(runStep('6. Google Flow Policy Shield (--fix)', 'audit-policy.js', ['--fix', '--json']))

// Step 7: 43-Gate Pre-Flight Linter
const matrixArgs = ['--json']
if (doUpdateManifest) matrixArgs.unshift('--update-manifest')
const finalLinterStep = runStep('7. 43-Gate Deterministic Pre-Flight Linter', 'audit-matrix.js', matrixArgs)
steps.push(finalLinterStep)

let linterReport = null
try {
  const jsonStart = finalLinterStep.stdout.indexOf('{')
  if (jsonStart !== -1) {
    linterReport = JSON.parse(finalLinterStep.stdout.slice(jsonStart))
  }
} catch (_) {}

const allPassed = steps.every(s => s.exitCode === 0) && (linterReport ? linterReport.isProductionReady : true)

if (jsonOnly) {
  console.log(JSON.stringify({
    franchiseId,
    episodeId,
    allPassed,
    overallScore: linterReport?.overallScore ?? null,
    gateCount: linterReport?.gateCount ?? 43,
    failingGates: linterReport?.failingGates ?? [],
    steps: steps.map(s => ({
      name: s.name,
      script: s.script,
      exitCode: s.exitCode,
      elapsedMs: s.elapsedMs
    }))
  }, null, 2))
  process.exit(allPassed ? 0 : 1)
}

console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO — UNIFIED EPISODIC QA PIPELINE RUNNER (v1.0)')
console.log('='.repeat(78))
console.log(`Franchise : ${franchiseId}`)
console.log(`Episode   : ${episodeId}`)
console.log('-'.repeat(78))

for (const s of steps) {
  const badge = s.exitCode === 0 ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m'
  console.log(`${badge} ${s.name.padEnd(48)} (${s.elapsedMs}ms)`)
  if (s.exitCode !== 0 && s.stderr) {
    console.log(`    ↳ ${s.stderr.split('\n')[0]}`)
  }
}

console.log('-'.repeat(78))
if (linterReport) {
  console.log(`Linter Score : ${linterReport.overallScore}/100 (${linterReport.gateCount} Gates Audited)`)
  if (linterReport.failingGates?.length > 0) {
    console.log(`\x1b[31mFailing Gates (${linterReport.failingGates.length}):\x1b[0m`)
    for (const fg of linterReport.failingGates) {
      console.log(`  - ${fg.id}: ${fg.failingScenes.slice(0, 6).join(', ')}${fg.failingScenes.length > 6 ? ` (+${fg.failingScenes.length - 6} more)` : ''}`)
    }
  }
}
console.log('='.repeat(78))
process.exit(allPassed ? 0 : 1)
