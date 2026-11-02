#!/usr/bin/env node
/**
 * studio/scripts/find-scene.js
 *
 * Universal Google Flow Scene Synchroniser & Reverse-Lookup CLI.
 * Matches raw text from Google Flow (where @{} tokens have been stripped)
 * back to the exact Scene ID, target filename, batch sequence, and script line.
 *
 * Usage:
 *   node studio/scripts/find-scene.js <franchiseId> <episodeId> "<flowPromptText>"
 *   npm run sync:scene <franchiseId> <episodeId> "<flowPromptText>"
 *
 * If franchiseId and episodeId are omitted, defaults to the latest active franchise & episode.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { findMatchingScenes } from '../src/utils/flowSyncMatcher.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const isJson = args.includes('--json')

// Extract --batch or -b flag
let batchArg = null
const batchIdx = args.findIndex(a => a === '--batch' || a === '-b')
if (batchIdx > -1 && args[batchIdx + 1]) {
  batchArg = parseInt(args[batchIdx + 1], 10)
}

const filteredArgs = args.filter((a, idx) => {
  if (a === '--json') return false
  if (a === '--batch' || a === '-b') return false
  if (batchIdx > -1 && idx === batchIdx + 1) return false
  return true
})

let franchiseId = filteredArgs[0]
let episodeId = filteredArgs[1]
let queryText = filteredArgs[2]

// If only 1 positional argument is provided, treat it as queryText and auto-discover active franchise & episode
if (filteredArgs.length === 1) {
  queryText = filteredArgs[0]
  franchiseId = 'Series_06_The_Archmage_Engineer'
  episodeId = 'EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival'
} else if (filteredArgs.length === 2) {
  // If 2 arguments, could be (franchiseId, query) or (episodeId, query)
  queryText = filteredArgs[1]
  franchiseId = 'Series_06_The_Archmage_Engineer'
  episodeId = filteredArgs[0].startsWith('EP') ? filteredArgs[0] : 'EP02_The_Quartz_Glass_Windows_and_The_Royal_Arrival'
}

if (!queryText) {
  console.log(`
\x1b[35m=== Google Flow Scene Reverse-Lookup CLI ===\x1b[0m
Usage:
  node studio/scripts/find-scene.js <franchiseId> <episodeId> "<promptText>"
  node studio/scripts/find-scene.js "<promptText>" (uses active series/episode)

Options:
  --json    Output results in JSON format
`)
  process.exit(1)
}

const epDir = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)
const promptMatrixPath = path.join(epDir, '02_Prompt_Matrix.md')

if (!fs.existsSync(promptMatrixPath)) {
  console.error(`\x1b[31m[ERROR]\x1b[0m Prompt matrix not found: ${promptMatrixPath}`)
  process.exit(1)
}

const matrixContent = fs.readFileSync(promptMatrixPath, 'utf-8')

// Parse scenes from prompt matrix
const sceneRegex = /<scene\s+([^>]*?)>\s*([\s\S]*?)\s*<\/scene>/gi
const scenes = []
let sMatch

while ((sMatch = sceneRegex.exec(matrixContent)) !== null) {
  const attrs = sMatch[1]
  const inner = sMatch[2]

  const idMatch = attrs.match(/id=["']?(IMG_?\d+)["']?/i) || inner.match(/<tag>([^<]+)<\/tag>/i)
  if (!idMatch) continue
  const cleanTag = idMatch[1].replace(/_/g, '').replace(/[[\]]/g, '')
  const tag = `[${cleanTag.replace(/(\d+)/, '_$1')}]`

  const promptMatch = inner.match(/<prompt>([\s\S]*?)<\/prompt>/i)
  const narrativeMatch = inner.match(/<narrative_sync>([\s\S]*?)<\/narrative_sync>/i)
  const layoutMatch = inner.match(/<layout>([^<]+)<\/layout>/i)

  scenes.push({
    tag,
    prompt: promptMatch ? promptMatch[1].trim() : inner.trim(),
    narrativeSync: narrativeMatch ? narrativeMatch[1].trim() : '',
    description: layoutMatch ? layoutMatch[1].trim() : ''
  })
}

// Find matching scenes
const matches = findMatchingScenes(queryText, scenes, { batchSize: 24, maxResults: 8, batchFilter: batchArg })

if (isJson) {
  console.log(JSON.stringify(matches, null, 2))
  process.exit(0)
}

console.log(`\n\x1b[35m=== Google Flow Scene Synchroniser ===\x1b[0m`)
console.log(`Target: \x1b[36m${franchiseId}\x1b[0m / \x1b[36m${episodeId}\x1b[0m (${scenes.length} Total Scenes)`)
console.log(`Query:  \x1b[90m"${queryText.length > 80 ? queryText.substring(0, 80) + '...' : queryText}"\x1b[0m\n`)

if (matches.length === 0) {
  console.log(`\x1b[33m[NO MATCH]\x1b[0m No scenes matched the provided text (minimum threshold not reached).`)
  process.exit(0)
}

console.log(`Found \x1b[32m${matches.length}\x1b[0m matching candidate(s):\n`)

matches.forEach((m, idx) => {
  const isTop = idx === 0
  const color = isTop ? '\x1b[32m' : '\x1b[36m'
  console.log(`${color}#${idx + 1} — Scene ${m.tag} -> ${m.filename}\x1b[0m (\x1b[1m${m.score}%\x1b[0m Match)`)
  console.log(`   📦 \x1b[1mBatch:\x1b[0m ${m.batchName} — \x1b[33mPrompt #${m.batchPosition}\x1b[0m`)
  console.log(`   📐 \x1b[1mLayout:\x1b[0m ${m.layout}`)
  if (m.narrativeSync) {
    console.log(`   🎙️  \x1b[1mVoiceover:\x1b[0m "${m.narrativeSync}"`)
  }
  if (m.reasons.length > 0) {
    console.log(`   🔍 \x1b[1mSignals:\x1b[0m ${m.reasons.join(' • ')}`)
  }
  console.log('')
})
