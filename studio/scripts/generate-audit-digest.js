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

// Load state_events.jsonl to surface active character postures in the digest
const ledgerPath = path.join(epDir, 'state_events.jsonl')
const ledgerEvents = fs.existsSync(ledgerPath)
  ? fs.readFileSync(ledgerPath, 'utf-8').split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => { try { return JSON.parse(l) } catch (_) { return null } }).filter(Boolean)
  : []

const getActivePostures = (sNum) => {
  const poses = new Map()
  for (const ev of ledgerEvents) {
    if (typeof ev.s === 'number' && ev.s <= sNum && ev.e && ev.set?.posture) {
      poses.set(ev.e, ev.set.posture)
    }
  }
  return [...poses.entries()].map(([k, v]) => `${k}:${v}`).join(', ')
}

// Detect Prop Flickering, Zone Ping-Pong & Lighting/Posture Anomalies
const lifecycleAlerts = []
let zoneTransitions = 0
let prevZone = null
for (let i = 0; i < filteredScenes.length; i++) {
  const curr = filteredScenes[i]
  if (prevZone && prevZone !== curr.zone) zoneTransitions++
  prevZone = curr.zone

  const litMatch = (curr.prompt || '').match(/illuminated by ([^.]+)\./i)
  const litTag = litMatch ? litMatch[1].trim() : 'unknown'
  if (/night/i.test(curr.zone || '') && /morning sunlight|daylight/i.test(litTag)) {
    lifecycleAlerts.push(`- [ZONE LIGHTING MISMATCH] ${curr.id} (Zone: ${curr.zone}) renders with "${litTag}".`)
  }
  if (i === 0) continue

  const prev = filteredScenes[i - 1]
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

const avgHold = zoneTransitions > 0 ? (filteredScenes.length / (zoneTransitions + 1)).toFixed(1) : String(filteredScenes.length)
if (filteredScenes.length >= 48 && zoneTransitions > Math.max(24, Math.ceil(filteredScenes.length * 0.20))) {
  lifecycleAlerts.unshift(`- [ZONE PING-PONG ALERT] ${zoneTransitions} zone transitions across ${filteredScenes.length} scenes (avg ${avgHold} scenes/zone). Consolidate into longer location blocks.`)
}

const lines = [
  `# Common-Sense Continuity & Prop Lifecycle Digest — ${franchiseId} / ${episodeId}`,
  `> **Scenes Included:** ${filteredScenes.length} (Total Episode Scenes: ${scenes.length}) | **Zone Transitions:** ${zoneTransitions} (Avg Hold: ${avgHold} scenes/zone)`,
  `> **Lifecycle Alerts Detected:** ${lifecycleAlerts.length}`,
  ``
]

if (lifecycleAlerts.length > 0) {
  lines.push(`## ⚠️ Automated Prop & Continuity Transition Checkpoints`)
  lines.push(...lifecycleAlerts)
  lines.push(``)
}

lines.push(`## 📋 Scene-by-Scene Side-by-Side Digest`)
lines.push(`| Scene | Zone / Lighting / Stage | Cast, Active Postures & Props | Spoken Narrative Clause | Layer 4 Action & Lens |`)
lines.push(`| :--- | :--- | :--- | :--- | :--- |`)

for (const s of filteredScenes) {
  const h = headers.get(s.id) || {}
  const sNum = parseInt(s.id.replace(/\D/g, ''), 10)
  const stage = h.stage || 'scene'
  const litMatch = (s.prompt || '').match(/illuminated by ([^.]+)\./i)
  const litTag = litMatch ? litMatch[1].trim() : 'default'
  const castStr = (h.cast || s.charRefs || []).join(', ') || 'NONE'
  const propsStr = (s.itemRefs || h.props || []).join(', ') || 'NONE'
  const poseStr = getActivePostures(sNum) || 'default'
  const narr = (s.narrativeSync || '').replace(/\|/g, '/').trim()
  const act = `[${s.lens || '35mm'}] ${(s.actionLayer || '').replace(/\|/g, '/').trim()}`
  lines.push(`| **${s.id}** | \`${s.zone}\`<br/>*${litTag} (${stage})* | **Cast:** ${castStr}<br/>**Props:** ${propsStr}<br/>**Poses:** ${poseStr} | ${narr} | ${act} |`)
}

const output = lines.join('\n') + '\n'
if (outFile) {
  fs.writeFileSync(path.resolve(projectRoot, outFile), output, 'utf-8')
  console.log(`[DIGEST] Wrote ${output.length} bytes to ${outFile}`)
} else {
  console.log(output)
}
