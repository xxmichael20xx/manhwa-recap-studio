#!/usr/bin/env node
/**
 * studio/scripts/generate-audit-digest.js
 *
 * Compact Common-Sense Continuity Digest Generator (v1.0).
 * Strips 180+ KB of repeated negative tail boilerplate from 02_Prompt_Matrix.md
 * and produces a crisp ~12-15 KB side-by-side table of:
 *   [IMG_XXX] | ZONE | STAGE | CAST | PROPS | Spoken Narrative | Layer 4 Action & Lens
 * Plus an automated Prop & Character Lifecycle Transition Alert summary.
 *
 * Usage:
 *   node studio/scripts/generate-audit-digest.js <franchiseId> <episodeId> [--batch <N>] [--out <file>]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { AntiSlopValidator } from '../server/services/antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const batchIdx = args.indexOf('--batch')
const targetBatch = batchIdx !== -1 ? parseInt(args[batchIdx + 1], 10) : null
const outIdx = args.indexOf('--out')
const outFile = outIdx !== -1 ? args[outIdx + 1] : null
const positional = args.filter((a, i) => !a.startsWith('--') && (batchIdx === -1 || i !== batchIdx + 1) && (outIdx === -1 || i !== outIdx + 1))

const franchiseId = positional[0]
const episodeId = positional[1]

if (!franchiseId || !episodeId) {
  console.error('Usage: node studio/scripts/generate-audit-digest.js <franchiseId> <episodeId> [--batch <N>] [--out <file>]')
  process.exit(1)
}

const epDir = path.resolve(projectRoot, '01_Franchises', franchiseId, episodeId)
const scriptPath = path.join(epDir, '01_Episode_Script.md')
const matrixPath = path.join(epDir, '02_Prompt_Matrix.md')

if (!fs.existsSync(scriptPath) || !fs.existsSync(matrixPath)) {
  console.error(`[FATAL] Missing script or matrix in ${epDir}`)
  process.exit(1)
}

const scriptText = fs.readFileSync(scriptPath, 'utf-8')
const matrixText = fs.readFileSync(matrixPath, 'utf-8')
const scenes = AntiSlopValidator.parseScenesFromMatrix(matrixText)

// Parse script staging headers
const headerRegex = /\[(IMG_\d+)\][^\n]*\n?\s*<!--\s*ZONE:\s*([^|]+?)\s*\|\s*STAGE:\s*([^|]+?)\s*\|\s*ACTOR:\s*([^|]+?)\s*\|\s*CAST:\s*\[([^\]]*)\]\s*\|\s*PROPS:\s*\[([^\]]*)\]/gi
const headers = new Map()
let hm
while ((hm = headerRegex.exec(scriptText)) !== null) {
  headers.set(hm[1].toUpperCase(), {
    zone: hm[2].trim(),
    stage: hm[3].trim(),
    actor: hm[4].trim(),
    cast: hm[5].split(',').map(s => s.trim()).filter(Boolean),
    props: hm[6].split(',').map(s => s.trim()).filter(Boolean)
  })
}

const filteredScenes = targetBatch
  ? scenes.slice((targetBatch - 1) * 24, targetBatch * 24)
  : scenes

// Detect Prop Flickering & Sudden Cast Drops across consecutive scenes in the same zone
const lifecycleAlerts = []
for (let i = 1; i < filteredScenes.length; i++) {
  const prev = filteredScenes[i - 1]
  const curr = filteredScenes[i]
  const prevProps = prev.itemRefs || []
  const currProps = curr.itemRefs || []

  if (prev.zone === curr.zone && prevProps.length > 0) {
    for (const p of prevProps) {
      if (!currProps.includes(p)) {
        const sharedCast = (prev.charRefs || []).some(c => (curr.charRefs || []).includes(c))
        if (sharedCast) {
          lifecycleAlerts.push(`- [PROP DROP CHECK] ${prev.id} -> ${curr.id} (Zone: ${curr.zone}): Prop "${p}" was active in ${prev.id} but absent in ${curr.id}. Verify if stowed/dropped in narration.`)
        }
      }
    }
  }
}

const lines = [
  `# Common-Sense Continuity & Prop Lifecycle Digest — ${franchiseId} / ${episodeId}`,
  `> **Scenes Included:** ${filteredScenes.length} (Total Episode Scenes: ${scenes.length})`,
  `> **Lifecycle Alerts Detected:** ${lifecycleAlerts.length}`,
  ``
]

if (lifecycleAlerts.length > 0) {
  lines.push(`## ⚠️ Automated Prop & Continuity Transition Checkpoints`)
  lines.push(...lifecycleAlerts)
  lines.push(``)
}

lines.push(`## 📋 Scene-by-Scene Side-by-Side Digest`)
lines.push(`| Scene | Zone / Stage | Cast & Props | Spoken Narrative Clause | Layer 4 Action & Lens |`)
lines.push(`| :--- | :--- | :--- | :--- | :--- |`)

for (const s of filteredScenes) {
  const h = headers.get(s.id) || {}
  const stage = h.stage || 'scene'
  const castStr = (h.cast || s.charRefs || []).join(', ') || 'NONE'
  const propsStr = (s.itemRefs || h.props || []).join(', ') || 'NONE'
  const narr = (s.narrativeSync || '').replace(/\|/g, '/').trim()
  const act = `[${s.lens || '35mm'}] ${(s.actionLayer || '').replace(/\|/g, '/').trim()}`
  lines.push(`| **${s.id}** | \`${s.zone}\`<br/>*(${stage})* | **Cast:** ${castStr}<br/>**Props:** ${propsStr} | ${narr} | ${act} |`)
}

const output = lines.join('\n') + '\n'
if (outFile) {
  fs.writeFileSync(path.resolve(projectRoot, outFile), output, 'utf-8')
  console.log(`[DIGEST] Wrote ${output.length} bytes to ${outFile}`)
} else {
  console.log(output)
}
