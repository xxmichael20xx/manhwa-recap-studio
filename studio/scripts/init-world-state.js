#!/usr/bin/env node
/**
 * studio/scripts/init-world-state.js
 *
 * Universal Studio Episodic World State Scaffolder & Consistency Lock (v1.0).
 * Generates an immutable world_state.json for an episode, locking:
 *   1. Timeline lighting modes (decoupled from static zone canons)
 *   2. Character wardrobe locks (preventing intra-episode outfit flipping)
 *   3. Prop container & form schemas (preventing prop morphing)
 *   4. Zone destruction lifecycles (preventing spatial amnesia after demolition)
 *
 * Usage:
 *   node studio/scripts/init-world-state.js <franchiseId> <episodeId> [--force] [--json]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PromptDnaCompiler } from '../server/services/promptDnaCompiler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const isForce = args.includes('--force')
const jsonOnly = args.includes('--json')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]

if (!franchiseId || !episodeId) {
  console.error('\x1b[31m[ERROR]\x1b[0m Usage: node studio/scripts/init-world-state.js <franchiseId> <episodeId> [--force] [--json]')
  process.exit(1)
}

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
const epDir = path.resolve(franchiseDir, episodeId)
const scriptPath = path.join(epDir, '01_Episode_Script.md')
const worldStatePath = path.join(epDir, 'world_state.json')

if (!fs.existsSync(scriptPath)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Script file not found: ${scriptPath}`)
  process.exit(1)
}

const readJsonSafe = (filePath, required = true) => {
  if (!fs.existsSync(filePath)) {
    if (required) {
      console.error(`\x1b[31m[FATAL]\x1b[0m Missing required file: ${filePath}`)
      process.exit(1)
    }
    return null
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

const franchise = readJsonSafe(path.join(franchiseDir, 'franchise.json'))
const entities = readJsonSafe(path.join(franchiseDir, franchise.paths?.entities || 'vault/entities.json'))
const zones = readJsonSafe(path.join(franchiseDir, franchise.paths?.zones || 'vault/zones.json'))

const scriptText = fs.readFileSync(scriptPath, 'utf-8')
const scriptClauses = PromptDnaCompiler.parseScriptClauses(scriptText)

// Parse Staging Headers
const headerRegex = /\[(IMG_\d+)\][^\n]*\n?\s*<!--\s*ZONE:\s*([^|]+)\|\s*STAGE:\s*([^|]+)\|\s*ACTOR:\s*([^|]+)\|\s*CAST:\s*\[([^\]]*)\]\|\s*PROPS:\s*\[([^\]]*)\]/gi
const scriptHeaders = new Map()
const activeCharacters = new Set()
const activeProps = new Set()
const activeZones = new Set()

let hm
while ((hm = headerRegex.exec(scriptText)) !== null) {
  const zone = hm[2].trim()
  const cast = hm[5].split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
  const props = hm[6].split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)

  scriptHeaders.set(hm[1].toUpperCase(), {
    zone,
    stage: hm[3].trim(),
    actor: hm[4].trim()
  })

  if (zone) activeZones.add(zone)
  cast.forEach(c => activeCharacters.add(c))
  props.forEach(p => activeProps.add(p))
}

// 1. Detect timeline cues across scenes
const timelineShifts = []
let currentLighting = 'bright_morning_sunlight'
let currentShiftStart = 'IMG_001'

const sceneIds = [...scriptClauses.keys()]
for (let i = 0; i < sceneIds.length; i++) {
  const sId = sceneIds[i]
  const clause = scriptClauses.get(sId) || ''
  const cLower = clause.toLowerCase()

  let detected = null
  if (/\b(?:morning\s+sunlight|early\s+morning|sunrise|dawn|breakfast|waking\s+up)\b/i.test(cLower)) {
    detected = 'bright_morning_sunlight'
  } else if (/\b(?:night|midnight|evening\s+sky|dark\s+night|under\s+the\s+stars)\b/i.test(cLower)) {
    detected = 'night_floodlit'
  } else if (/\b(?:sunset|dusk|twilight)\b/i.test(cLower)) {
    detected = 'dusk'
  }

  if (detected && detected !== currentLighting) {
    timelineShifts.push({
      from_scene: currentShiftStart,
      to_scene: sceneIds[Math.max(0, i - 1)],
      lighting: currentLighting
    })
    currentLighting = detected
    currentShiftStart = sId
  }
}

if (sceneIds.length > 0) {
  timelineShifts.push({
    from_scene: currentShiftStart,
    to_scene: sceneIds[sceneIds.length - 1],
    lighting: currentLighting
  })
}

// 2. Build wardrobe locks from entities
const wardrobeLocks = {}
for (const charName of activeCharacters) {
  const clean = charName.toLowerCase()
  const ent = Object.values(entities).find(e =>
    (e.name && e.name.toLowerCase() === clean) ||
    (e.id && e.id.toLowerCase() === clean) ||
    (e.token && e.token.toLowerCase().includes(clean))
  )

  if (ent) {
    const outfitMatch = (ent.dna || ent.dna_prompt_anchor || '').match(/wearing ([^,.]+)/i)
    wardrobeLocks[ent.id || clean] = outfitMatch ? outfitMatch[1].trim() : 'clean signature standard attire'
  }
}

// 3. Build held props schemas
const heldProps = {}
for (const propName of activeProps) {
  const clean = propName.toLowerCase().replace(/[^a-z0-9_]/g, '_')
  const ent = Object.values(entities).find(e =>
    (e.name && e.name.toLowerCase() === propName.toLowerCase()) ||
    (e.id && e.id.toLowerCase() === clean)
  )

  heldProps[clean] = {
    canonical_name: propName,
    container: 'carved protective case',
    visual_form: ent?.visual_dna || ent?.description || 'canonical prop artifact',
    notes: 'Locked across all episode scenes. Do not substitute with vials or bottles unless explicitly scripted.'
  }
}

// 4. Detect destruction milestones
const zoneLifecycles = {}
const DESTRUCTION_KEYWORDS = /\b(?:turned\s+into\s+fine\s+dust|reduced\s+to\s+fine\s+dust|vaporized|cratered\s+into\s+dust|demolished\s+to\s+dust|collapsed\s+into\s+rubble|flattened\s+into\s+a\s+crater)\b/i

for (let i = 0; i < sceneIds.length; i++) {
  const sId = sceneIds[i]
  const clause = scriptClauses.get(sId) || ''
  if (DESTRUCTION_KEYWORDS.test(clause)) {
    const header = Array.from(scriptHeaders?.entries?.() || []).find(([k]) => k === sId)?.[1]
    const zId = header?.zone || Object.keys(zones)[0]
    zoneLifecycles[zId] = [
      {
        from_scene: 'IMG_001',
        to_scene: sId,
        state: 'intact',
        desc: zones[zId]?.canon || 'intact structure'
      },
      {
        from_scene: sceneIds[Math.min(sceneIds.length - 1, i + 1)],
        to_scene: sceneIds[sceneIds.length - 1],
        state: 'pulverized_crater',
        desc: 'sunken pulverized crater of fine grey ash, exposed fractured foundation bedrock, zero standing columns'
      }
    ]
    break
  }
}

const worldStateData = {
  episodeId,
  franchiseId,
  generatedAt: new Date().toISOString(),
  timeline: {
    default_lighting: timelineShifts[0]?.lighting || 'bright_morning_sunlight',
    timeline_shifts: timelineShifts.length > 1 ? timelineShifts : []
  },
  wardrobe_locks: wardrobeLocks,
  held_props: heldProps,
  zone_lifecycles: zoneLifecycles
}

if (fs.existsSync(worldStatePath) && !isForce) {
  if (jsonOnly) {
    console.log(fs.readFileSync(worldStatePath, 'utf-8'))
  } else {
    console.log(`\x1b[33m[INFO]\x1b[0m ${worldStatePath} already exists. Pass --force to overwrite.`)
  }
  process.exit(0)
}

fs.writeFileSync(worldStatePath, JSON.stringify(worldStateData, null, 2), 'utf-8')
if (jsonOnly) {
  console.log(JSON.stringify(worldStateData))
} else {
  console.log(`\x1b[32m[SUCCESS]\x1b[0m Generated immutable episodic state lock: ${worldStatePath}`)
  console.log(`  - Wardrobe Locks : ${Object.keys(wardrobeLocks).length} characters`)
  console.log(`  - Held Props     : ${Object.keys(heldProps).length} props`)
  console.log(`  - Timeline Shifts: ${timelineShifts.length} segments`)
}
