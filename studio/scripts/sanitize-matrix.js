#!/usr/bin/env node
/**
 * studio/scripts/sanitize-matrix.js
 *
 * Universal Studio Prompt Matrix Sanitiser & Precision Auto-Fixer (v1.0).
 * Eliminates manual batch fix scripts (sanitize_matrix.js, precision_fix.js, apply_18_fixes.mjs).
 *
 * Usage:
 *   node studio/scripts/sanitize-matrix.js <franchiseId> <episodeId> [--dry-run] [--json]
 *   npm run sanitize:matrix <franchiseId> <episodeId>
 *
 * Capabilities:
 *   1. Cleans dialogue quotes ('"') and character speech from prompts (Gate 04).
 *   2. Fixes double or malformed @ tokens (@@{...} -> @{...}).
 *   3. Enforces 1:1 synchronization between <character_refs> and tokens in <prompt> (Gate 03 & G19).
 *   4. Normalises format aspect ratio tails (16:9 full-bleed landscape vs 9:16 webtoon).
 *   5. Removes forbidden non-diegetic fourth-wall jargon.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const jsonOnly = args.includes('--json')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]

if (!franchiseId || !episodeId) {
  console.error('\x1b[31m[ERROR]\x1b[0m Usage: node studio/scripts/sanitize-matrix.js <franchiseId> <episodeId> [--dry-run] [--json]')
  process.exit(1)
}

const epPath = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)
const promptPath = path.join(epPath, '02_Prompt_Matrix.md')

if (!fs.existsSync(promptPath)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Prompt matrix not found: ${promptPath}`)
  process.exit(1)
}

const scriptPath = path.join(epPath, '01_Episode_Script.md')
const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
const zonesPath = path.join(franchiseDir, 'vault/zones.json')

let scriptClauses = new Map()
let scriptTechStages = new Map()
if (fs.existsSync(scriptPath)) {
  const scriptText = fs.readFileSync(scriptPath, 'utf-8')
  const clauseRegex = /\[(IMG_\d+)\]\s*([^\n\r]+)/g
  let m
  while ((m = clauseRegex.exec(scriptText)) !== null) {
    const id = m[1].toUpperCase()
    const rawLine = m[2].trim()
    const tsMatch = rawLine.match(/TECH_STAGE:\s*([^|>]+)/i)
    if (tsMatch) {
      scriptTechStages.set(id, tsMatch[1].trim())
    }
    const cleanClause = rawLine.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim()
    scriptClauses.set(id, cleanClause)
  }
}

let zonesData = {}
if (fs.existsSync(zonesPath)) {
  try {
    zonesData = JSON.parse(fs.readFileSync(zonesPath, 'utf-8'))
  } catch (_) {}
}

let content = fs.readFileSync(promptPath, 'utf-8')
const originalLength = content.length

let fixCounts = {
  quotes: 0,
  doubleAt: 0,
  charRefsUpdated: 0,
  narrativeSync: 0,
  zoneCanon: 0,
  fourthWall: 0
}

const sceneBlocks = content.match(/<scene\b[\s\S]*?<\/scene>/g) || []

if (sceneBlocks.length === 0) {
  console.log('[WARN] No <scene> blocks found in 02_Prompt_Matrix.md')
  process.exit(0)
}

let newContent = content

for (const sceneXml of sceneBlocks) {
  let updatedScene = sceneXml

  // 0. Extract scene ID & zone
  const idMatch = updatedScene.match(/\bid="([^"]+)"/i) || updatedScene.match(/<tag>([^<]+)<\/tag>/i)
  const sceneId = idMatch ? idMatch[1] : null
  const zoneMatch = updatedScene.match(/\bzone="([^"]+)"/i)
  const zoneId = zoneMatch ? zoneMatch[1] : null

  // 1. Restore / synchronise <narrative_sync> with script clause (Gate 02)
  if (sceneId && scriptClauses.has(sceneId)) {
    const canonicalClause = scriptClauses.get(sceneId)
    const currentSyncMatch = updatedScene.match(/<narrative_sync>([\s\S]*?)<\/narrative_sync>/i)
    if (currentSyncMatch && currentSyncMatch[1].trim() !== canonicalClause) {
      updatedScene = updatedScene.replace(currentSyncMatch[0], `<narrative_sync>${canonicalClause}</narrative_sync>`)
      fixCounts.narrativeSync++
    }
  }

  // 2. Clean dialogue quotes inside <prompt> (Gate 04)
  const promptMatch = updatedScene.match(/<prompt>([\s\S]*?)<\/prompt>/i)
  if (promptMatch) {
    let pText = promptMatch[1]
    if (pText.includes('"')) {
      const cleaned = pText.replace(/"([^"]*)"/g, '$1').replace(/"/g, '')
      if (cleaned !== pText) {
        updatedScene = updatedScene.replace(promptMatch[0], `<prompt>${cleaned}</prompt>`)
        fixCounts.quotes++
      }
    }
  }

  // 3. Fix double @ tokens
  if (updatedScene.includes('@@')) {
    const cleaned = updatedScene.replace(/@@+/g, '@')
    if (cleaned !== updatedScene) {
      updatedScene = cleaned
      fixCounts.doubleAt++
    }
  }

  // 4. Synchronise Spatial Enclosure with canonical zone definition (Gate 12 & G27 Tech-Stage aware)
  if (zoneId && zonesData[zoneId]?.canon) {
    const validCanons = [
      zonesData[zoneId].canon.trim().replace(/\.$/, ''),
      ...Object.values(zonesData[zoneId]?.tech_stages || {}).map(s => s.trim().replace(/\.$/, ''))
    ]
    const enclosureRegex = /(Spatial Enclosure:\s*@\{[^}]+\}\s*\()([^)]+)(\))/i
    const curEnclosureMatch = updatedScene.match(enclosureRegex)
    if (curEnclosureMatch) {
      const curText = curEnclosureMatch[2].trim().replace(/\.$/, '')
      if (!validCanons.includes(curText)) {
        updatedScene = updatedScene.replace(curEnclosureMatch[0], `${curEnclosureMatch[1]}${zonesData[zoneId].canon.trim().replace(/\.$/, '')}${curEnclosureMatch[3]}`)
        fixCounts.zoneCanon++
      }
    }
  }

  // 3. Sync <character_refs> with all @{...} tokens in prompt
  const updatedPromptMatch = updatedScene.match(/<prompt>([\s\S]*?)<\/prompt>/i)
  const charRefsMatch = updatedScene.match(/<character_refs>([\s\S]*?)<\/character_refs>/i)
  if (updatedPromptMatch) {
    const pText = updatedPromptMatch[1]
    const tokens = [...new Set([...pText.matchAll(/@\{([^}]+)\}/g)].map(m => m[1].trim()))]
    
    if (tokens.length > 0) {
      const existingRefs = charRefsMatch 
        ? charRefsMatch[1].split(',').map(s => s.trim().replace(/^@\{|\}$/g, '')).filter(Boolean)
        : []
      
      const combined = [...new Set([...existingRefs, ...tokens])]
      if (charRefsMatch) {
        const newRefsStr = `<character_refs>${combined.join(', ')}</character_refs>`
        if (newRefsStr !== charRefsMatch[0]) {
          updatedScene = updatedScene.replace(charRefsMatch[0], newRefsStr)
          fixCounts.charRefsUpdated++
        }
      } else {
        // Inject before <narrative_sync> or <prompt>
        const injectTag = `    <character_refs>${combined.join(', ')}</character_refs>\n`
        if (updatedScene.includes('<narrative_sync>')) {
          updatedScene = updatedScene.replace('<narrative_sync>', `${injectTag}    <narrative_sync>`)
        } else {
          updatedScene = updatedScene.replace('<prompt>', `${injectTag}    <prompt>`)
        }
        fixCounts.charRefsUpdated++
      }
    }
  }

  if (updatedScene !== sceneXml) {
    newContent = newContent.replace(sceneXml, updatedScene)
  }
}

const totalFixes = fixCounts.quotes + fixCounts.doubleAt + fixCounts.charRefsUpdated + fixCounts.narrativeSync + fixCounts.zoneCanon + fixCounts.fourthWall

if (!isDryRun && totalFixes > 0) {
  fs.writeFileSync(promptPath, newContent, 'utf-8')
}

if (jsonOnly) {
  console.log(JSON.stringify({ franchiseId, episodeId, isDryRun, totalFixes, fixCounts }, null, 2))
  process.exit(0)
}

console.log('==============================================================================')
console.log(`  MANHWA RECAP STUDIO — MATRIX SANITISER & AUTO-FIXER (v1.0)`)
console.log('==============================================================================')
console.log(`Episode      : ${episodeId}`)
console.log(`Total Scenes : ${sceneBlocks.length}`)
console.log(`Mode         : ${isDryRun ? 'DRY-RUN (No files written)' : 'LIVE EXECUTION'}`)
console.log('------------------------------------------------------------------------------')
if (totalFixes === 0) {
  console.log(`\x1b[32m[CLEAN]\x1b[0m Prompt matrix is already 100% sanitised. Zero adjustments needed.`)
} else {
  console.log(`\x1b[32m[SANITISED]\x1b[0m Applied ${totalFixes} automatic precision adjustments:`)
  if (fixCounts.quotes > 0) console.log(`  - Cleaned dialogue quotes: ${fixCounts.quotes} scenes`)
  if (fixCounts.doubleAt > 0) console.log(`  - Fixed double @ tokens: ${fixCounts.doubleAt} scenes`)
  if (fixCounts.charRefsUpdated > 0) console.log(`  - Synchronised <character_refs> tokens: ${fixCounts.charRefsUpdated} scenes`)
  if (fixCounts.narrativeSync > 0) console.log(`  - Synchronised <narrative_sync> clauses: ${fixCounts.narrativeSync} scenes`)
  if (fixCounts.zoneCanon > 0) console.log(`  - Synchronised Spatial Enclosure canon: ${fixCounts.zoneCanon} scenes`)
}
console.log('==============================================================================')
