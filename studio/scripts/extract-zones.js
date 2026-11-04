#!/usr/bin/env node
/**
 * studio/scripts/extract-zones.js
 *
 * Universal Studio Pre-Script Spatial Boundary & Zone Extractor (v1.0).
 * Detects physical enclosures across narrative scenes and validates:
 *   1. Unvaulted recurring enclosures (>= 2 scenes without dedicated zone)
 *   2. Staging header boundary desyncs (narrative transitions vs static zone headers)
 *   3. Unique reference plate disk integrity (anti-placeholder cheat)
 *
 * Usage:
 *   node studio/scripts/extract-zones.js <franchiseId> <episodeId> [--scaffold] [--json]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PromptDnaCompiler } from '../server/services/promptDnaCompiler.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const isScaffold = args.includes('--scaffold')
const jsonOnly = args.includes('--json')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]

if (!franchiseId || !episodeId) {
  console.error('\x1b[31m[ERROR]\x1b[0m Usage: node studio/scripts/extract-zones.js <franchiseId> <episodeId> [--scaffold] [--json]')
  process.exit(1)
}

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
const epDir = path.resolve(franchiseDir, episodeId)
const scriptPath = path.join(epDir, '01_Episode_Script.md')

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
const zones = readJsonSafe(path.join(franchiseDir, franchise.paths?.zones || 'vault/zones.json')) || {}
const entities = readJsonSafe(path.join(franchiseDir, franchise.paths?.entities || 'vault/entities.json')) || {}

const scriptText = fs.readFileSync(scriptPath, 'utf-8')
const scriptClauses = PromptDnaCompiler.parseScriptClauses(scriptText)

// Parse V2.0 Staging Headers
const headerRegex = /\[(IMG_\d+)\][^\n]*\n?\s*<!--\s*ZONE:\s*([^|]+)\|\s*STAGE:\s*([^|]+)\|\s*ACTOR:\s*([^|]+)\|\s*CAST:\s*\[([^\]]*)\]\|\s*PROPS:\s*\[([^\]]*)\]/gi
const scriptHeaders = new Map()
let hm
while ((hm = headerRegex.exec(scriptText)) !== null) {
  scriptHeaders.set(hm[1].toUpperCase(), {
    zone: hm[2].trim(),
    stage: hm[3].trim(),
    actor: hm[4].trim()
  })
}

// Physical enclosure patterns
const PHYSICAL_ENCLOSURE_PATTERNS = [
  { key: 'breakfast_stall', label: 'Street Breakfast Stall', regex: /\b(?:breakfast stall|steamer baskets?|folding tables?|noodle stall|food cart)\b/i },
  { key: 'appraisal_counter', label: 'Auction Appraisal Counter', regex: /\b(?:appraisal counter|reception desk|appraisal desk|evaluation room|appraiser table)\b/i },
  { key: 'auction_stage', label: 'Auction Main Auditorium / Stage', regex: /\b(?:auction stage|auction pedestal|auction auditorium|center of the auction|bidding hall)\b/i },
  { key: 'vip_suite', label: 'Private VIP Box / Suite', regex: /\b(?:vip suite|vip skybox|private box|tea service table)\b/i },
  { key: 'dorm_stairwell', label: 'Dormitory Corridor / Staircase', regex: /\b(?:staircase|stairwell|going down stairs|climbing the stairs|dormitory hallway|dorm corridor)\b/i },
  { key: 'campus_pathway', label: 'Campus Pathway / Courtyard', regex: /\b(?:campus pathway|willow park|running track|campus grounds|walking on campus)\b/i },
  { key: 'boardroom', label: 'Corporate Executive Boardroom', regex: /\b(?:boardroom|conference table|executive suite|skyscraper office)\b/i },
  { key: 'crater_ruins', label: 'Pulverized Impact Crater / Ruins', regex: /\b(?:fine dust|crater|pulverized stone|collapsed rubble|demolished site)\b/i }
]

const sceneClassifications = []
const unvaultedDetections = new Map()
const headerDesyncs = []

const sceneIds = [...scriptClauses.keys()]
for (const sId of sceneIds) {
  const clause = scriptClauses.get(sId) || ''
  const header = scriptHeaders.get(sId) || { zone: 'unassigned' }

  let detectedEnclosure = null
  for (const pat of PHYSICAL_ENCLOSURE_PATTERNS) {
    if (pat.regex.test(clause)) {
      detectedEnclosure = pat
      break
    }
  }

  if (detectedEnclosure) {
    sceneClassifications.push({
      sId,
      headerZone: header.zone,
      detected: detectedEnclosure.key,
      label: detectedEnclosure.label
    })

    // Check if zone exists in zones.json
    const exactZoneMatch = Object.keys(zones).some(zKey =>
      zKey.toLowerCase().includes(detectedEnclosure.key) ||
      (zones[zKey]?.name && zones[zKey].name.toLowerCase().includes(detectedEnclosure.label.toLowerCase()))
    )

    if (!exactZoneMatch) {
      if (!unvaultedDetections.has(detectedEnclosure.key)) {
        unvaultedDetections.set(detectedEnclosure.key, {
          key: detectedEnclosure.key,
          label: detectedEnclosure.label,
          scenes: []
        })
      }
      unvaultedDetections.get(detectedEnclosure.key).scenes.push(sId)
    }

    // Boundary desync check (e.g. narrative says stairwell/outside, but header says dorm.402)
    if (header.zone.includes('dorm') && (detectedEnclosure.key === 'dorm_stairwell' || detectedEnclosure.key === 'campus_pathway')) {
      headerDesyncs.push({
        sId,
        headerZone: header.zone,
        conflict: `Narrative describes "${detectedEnclosure.label}" but staging header is stuck on "${header.zone}"`
      })
    }
    if (header.zone.includes('courtyard') && detectedEnclosure.key === 'appraisal_counter') {
      headerDesyncs.push({
        sId,
        headerZone: header.zone,
        conflict: `Narrative describes indoor "${detectedEnclosure.label}" but staging header is outdoor "${header.zone}"`
      })
    }
  }
}

// Check for recurring unvaulted locations (>= 2 scenes)
const recurringUnvaulted = Array.from(unvaultedDetections.values()).filter(d => d.scenes.length >= 2)

// Plate sharing violations across location entities
const plateSharingViolations = []
const locationPlates = new Map()
for (const [id, ent] of Object.entries(entities)) {
  if (ent.kind === 'location') {
    const plate = ent.plate ? path.basename(ent.plate) : (ent.reference_plate || `${ent.id}.jpg`)
    if (locationPlates.has(plate)) {
      plateSharingViolations.push({
        plate,
        entity1: locationPlates.get(plate),
        entity2: ent.id
      })
    } else {
      locationPlates.set(plate, ent.id)
    }
  }
}

const auditResult = {
  franchiseId,
  episodeId,
  totalScenesAudited: sceneIds.length,
  recurringUnvaultedLocations: recurringUnvaulted,
  headerBoundaryDesyncs: headerDesyncs,
  plateSharingViolations,
  passed: recurringUnvaulted.length === 0 && headerDesyncs.length === 0 && plateSharingViolations.length === 0
}

if (jsonOnly) {
  console.log(JSON.stringify(auditResult, null, 2))
  process.exit(auditResult.passed ? 0 : 1)
}

console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO — PRE-SCRIPT SPATIAL BOUNDARY AUDITOR')
console.log('='.repeat(78))
console.log(`Franchise : ${franchise.title || franchiseId}`)
console.log(`Episode   : ${episodeId}`)
console.log(`Scenes    : ${sceneIds.length}`)
console.log('-'.repeat(78))

if (recurringUnvaulted.length > 0) {
  console.log(`\x1b[31m[UNVAULTED RECURRING ENCLOSURES DETECTED]\x1b[0m`)
  for (const item of recurringUnvaulted) {
    console.log(`  - ${item.label} (ID: ${item.key}): Appears in ${item.scenes.length} scenes (${item.scenes.slice(0, 5).join(', ')}${item.scenes.length > 5 ? '...' : ''})`)
  }
  console.log(`\n  Run with --scaffold to generate atomic zone templates in vault/zones.json.`)
}

if (headerDesyncs.length > 0) {
  console.log(`\n\x1b[33m[STAGING HEADER BOUNDARY DESYNCS DETECTED]\x1b[0m`)
  for (const desync of headerDesyncs.slice(0, 8)) {
    console.log(`  - Scene ${desync.sId}: ${desync.conflict}`)
  }
  if (headerDesyncs.length > 8) {
    console.log(`  ... and ${headerDesyncs.length - 8} more.`)
  }
}

if (plateSharingViolations.length > 0) {
  console.log(`\n\x1b[31m[PLACEHOLDER PLATE SHARING VIOLATIONS]\x1b[0m`)
  for (const viol of plateSharingViolations) {
    console.log(`  - Plate "${viol.plate}" shared between location "${viol.entity1}" and "${viol.entity2}". Unique plates required.`)
  }
}

if (isScaffold && recurringUnvaulted.length > 0) {
  console.log('\n' + '-'.repeat(78))
  console.log('  SCAFFOLDED ZONE SCHEMAS (Copy to vault/zones.json):')
  console.log('-'.repeat(78))
  const scaffoldZones = {}
  for (const item of recurringUnvaulted) {
    scaffoldZones[item.key] = {
      id: item.key,
      name: item.label,
      canon: `Architectural enclosure of the ${item.label.toLowerCase()}, clean contemporary finishes, unobstructed interior spatial geometry.`,
      lighting: 'day_sunlit',
      forbidden_tokens: ['night lamps', 'searchlights', 'campus floodlights'],
      adjacent: Object.keys(zones).slice(0, 3),
      boundary_tags: `enclosed ${item.label.toLowerCase()}, distinct structural perimeter`,
      vantage_rule: `Eye-level two-shot framing inside ${item.label.toLowerCase()}, zero background outdoor bleeding.`
    }
  }
  console.log(JSON.stringify(scaffoldZones, null, 2))
}

if (auditResult.passed) {
  console.log(`\x1b[32m[PASS]\x1b[0m 100% Spatial Boundary Parity: All enclosures vaulted, headers aligned, zero placeholder cheats.`)
  process.exit(0)
} else {
  console.log(`\n\x1b[31m[FAIL]\x1b[0m Spatial Boundary Audit failed. Please resolve above items before compiling prompt matrix.`)
  process.exit(1)
}
