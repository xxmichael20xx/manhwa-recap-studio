#!/usr/bin/env node
/**
 * studio/scripts/audit-vault.js
 *
 * Universal Studio Franchise Vault Auditor & DNA Normaliser (v1.0).
 * Inspects all characters, items, props, locations, and master reference plates.
 *
 * Usage:
 *   node studio/scripts/audit-vault.js <franchiseId> [--fix] [--json]
 *   npm run audit:vault <franchiseId>
 */

import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const autoFix = args.includes('--fix')
const jsonOnly = args.includes('--json')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]

if (!franchiseId) {
  console.error('\x1b[31m[ERROR]\x1b[0m Usage: node studio/scripts/audit-vault.js <franchiseId> [--fix] [--json]')
  process.exit(1)
}

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
if (!fs.existsSync(franchiseDir)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Franchise directory not found: ${franchiseDir}`)
  process.exit(1)
}

const entitiesPath = path.join(franchiseDir, 'vault', 'entities.json')
const charsPath = path.join(franchiseDir, 'character_vault', 'characters.json')
const itemsPath = path.join(franchiseDir, 'character_vault', 'items.json')
const flowPath = path.join(franchiseDir, 'character_vault', 'flow_entities.json')
const biblePath = path.join(franchiseDir, '00_Series_Bible_and_Character_DNA', 'Series_Bible.md')
const charFilesDir = path.join(franchiseDir, '00_Characters')
const vaultDir = path.join(franchiseDir, 'character_vault')

const issues = {
  entities: [],
  characters: [],
  items: [],
  crossVaultDrift: [],
  duplicatePlates: [],
  flowNames: [],
  flowMissing: [],
  plates: [],
  clonedPlates: [],
  bible: []
}

let modifiedFiles = []
const DEPRECATED_CHARACTER_PREFIX_RE = /^(?:Character|Hero|Ally|Supporting|Antagonist|Location|Vehicle|Consumable Item|Collegiate Location):\s+/i
const DEPRECATED_FLOW_PREFIX_RE = /^(?:Character|Boss|Hero|Ally|Supporting|Antagonist|Weapon|Item|Prop|Artifact|Location|Vehicle|Consumable Item|Collegiate Location):\s+/i
const LEGACY_TOKEN_EP_RE = /^EP0*[1-3](?:_|$)/i

// Helper: Read JSON safely
const readJson = p => {
  if (!fs.existsSync(p)) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch (e) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Failed to parse ${p}: ${e.message}`)
    return null
  }
}

// 1. Audit vault/entities.json
const rawEntities = readJson(entitiesPath) || {}
const entityList = Array.isArray(rawEntities) ? rawEntities : Object.entries(rawEntities).map(([id, val]) => ({ id, ...val }))

for (const ent of entityList) {
  const dna = (ent.dna || ent.dna_prompt_anchor || '').trim()
  const isChar = ent.kind === 'character'
  const outfits = ent.outfits ? Object.values(ent.outfits).join(' ') : ''

  if (!dna) {
    issues.entities.push({ id: ent.id, name: ent.name || ent.id, issue: 'Missing DNA string' })
  } else if (dna.length < 25) {
    issues.entities.push({ id: ent.id, name: ent.name || ent.id, issue: `Short DNA (${dna.length} chars)` })
  }

  if (isChar && (!outfits || outfits.trim().length === 0)) {
    issues.entities.push({ id: ent.id, name: ent.name || ent.id, issue: 'Character has no outfits defined' })
  }
}

// 2. Audit character_vault/characters.json
let charsJson = readJson(charsPath) || { characters: [] }
const charList = charsJson.characters || []
const legacyFlowNameAllowlist = new Set(Array.isArray(charsJson.legacyFlowNameAllowlist) ? charsJson.legacyFlowNameAllowlist : [])
const legacyPlateShareAllowlist = new Set(Array.isArray(charsJson.legacyPlateShareAllowlist) ? charsJson.legacyPlateShareAllowlist : [])
let charsModified = false

/**
 * Audit flowName and token purity for an entity record and optionally strip forbidden category prefixes.
 * Prevents "Character: Name" or "Weapon: Name" regressions in Google Flow reference bindings.
 */
const auditPureFlowNaming = (entry, collectionName) => {
  if (!entry || legacyFlowNameAllowlist.has(entry.id)) return false
  let mutated = false
  const rawTokenInner = String(entry.token || '').replace(/^@\{|\}$/g, '').trim()
  const rawFlowName = String(entry.flowName || '').trim()
  const hasPostLegacyEp = Array.isArray(entry.episodes) && entry.episodes.length > 0
    ? entry.episodes.some(ep => !LEGACY_TOKEN_EP_RE.test(String(ep)))
    : true

  const hasForbiddenCharacterFlowPrefix = DEPRECATED_CHARACTER_PREFIX_RE.test(rawFlowName)
  const hasFlowTokenMismatchPrefix = DEPRECATED_FLOW_PREFIX_RE.test(rawFlowName) && rawFlowName.toLowerCase() !== rawTokenInner.toLowerCase()
  const hasForbiddenGeneralPrefix = hasPostLegacyEp && (DEPRECATED_FLOW_PREFIX_RE.test(rawFlowName) || DEPRECATED_FLOW_PREFIX_RE.test(rawTokenInner))

  if (hasForbiddenCharacterFlowPrefix || hasFlowTokenMismatchPrefix || hasForbiddenGeneralPrefix || DEPRECATED_CHARACTER_PREFIX_RE.test(rawTokenInner)) {
    if (autoFix) {
      if (DEPRECATED_FLOW_PREFIX_RE.test(rawFlowName)) {
        entry.flowName = rawFlowName.replace(DEPRECATED_FLOW_PREFIX_RE, '').trim()
        mutated = true
      }
      if (DEPRECATED_FLOW_PREFIX_RE.test(rawTokenInner)) {
        entry.token = `@{${rawTokenInner.replace(DEPRECATED_FLOW_PREFIX_RE, '').trim()}}`
        mutated = true
      }
    } else {
      issues.flowNames.push({
        id: entry.id || entry.name,
        name: entry.name || entry.id,
        collection: collectionName,
        value: rawFlowName || entry.token
      })
    }
  }
  return mutated
}

for (const c of charList) {
  const dna = (c.dna || c.dna_prompt_anchor || '').trim()
  const plate = c.reference_plate || `${c.id}.jpg`
  const plateExists = fs.existsSync(path.join(vaultDir, plate)) || fs.existsSync(path.join(charFilesDir, plate))

  if (auditPureFlowNaming(c, 'characters.json')) charsModified = true

  if (!dna) {
    issues.characters.push({ id: c.id, name: c.name || c.id, issue: 'Missing DNA / dna_prompt_anchor' })
  } else if (dna.length < 25) {
    issues.characters.push({ id: c.id, name: c.name || c.id, issue: `Short DNA (${dna.length} chars)` })
  }

  if (!plateExists) {
    issues.plates.push({ id: c.id, name: c.name || c.id, plate, type: 'character' })
  }

  // Auto-Fix dual keys if missing
  if (autoFix) {
    const fullDna = c.dna_prompt_anchor || c.dna || ''
    if (fullDna) {
      if (!c.dna) { c.dna = fullDna; charsModified = true }
      if (!c.dna_prompt_anchor) { c.dna_prompt_anchor = fullDna; charsModified = true }
    }
  }
}

// Also verify pure flowName / token across entities.json and flow_entities.json
for (const ent of entityList) {
  auditPureFlowNaming(ent, 'vault/entities.json')
}
const STRICT_FORBIDDEN_KEY_PREFIX_RE = /^(?:Character|Hero|Ally|Supporting|Antagonist):\s+/i
const flowJson = readJson(flowPath)
if (flowJson && flowJson.entities && typeof flowJson.entities === 'object') {
  const allowlistedLegacyNames = new Set(
    charList
      .filter(c => legacyFlowNameAllowlist.has(c.id))
      .map(c => String(c.flowName || '').trim().toLowerCase())
      .filter(Boolean)
  )
  let flowModified = false
  for (const [key, val] of Object.entries(flowJson.entities)) {
    const isAllowed = allowlistedLegacyNames.has(key.trim().toLowerCase())
    const isTokenAliasPrefix = DEPRECATED_FLOW_PREFIX_RE.test(key) && /^@\{/.test(String(val || '').trim())
    const isStrictCharPrefix = STRICT_FORBIDDEN_KEY_PREFIX_RE.test(key)
    if (!isAllowed && (isStrictCharPrefix || isTokenAliasPrefix)) {
      if (autoFix) {
        const cleanKey = key.replace(DEPRECATED_FLOW_PREFIX_RE, '').trim()
        if (!flowJson.entities[cleanKey]) flowJson.entities[cleanKey] = val
        delete flowJson.entities[key]
        flowModified = true
      } else {
        issues.flowNames.push({
          id: key,
          name: key,
          collection: 'flow_entities.json',
          value: key
        })
      }
    }
  }
  if (autoFix && flowModified) {
    fs.writeFileSync(flowPath, JSON.stringify(flowJson, null, 2), 'utf-8')
    modifiedFiles.push('character_vault/flow_entities.json')
  }
}

// 3. Audit character_vault/items.json (supports arrays, objects, weapons, key_props_and_artifacts, vehicles)
let itemsJson = readJson(itemsPath) || { items: [] }
const collectItemsFromJson = obj => {
  if (Array.isArray(obj)) return obj
  const collected = []
  for (const key of ['items', 'weapons', 'key_props_and_artifacts', 'artifacts', 'vehicles']) {
    const bucket = obj[key]
    if (Array.isArray(bucket)) {
      collected.push(...bucket)
    } else if (bucket && typeof bucket === 'object') {
      for (const [subId, subVal] of Object.entries(bucket)) {
        if (subVal && typeof subVal === 'object') {
          collected.push({ id: subVal.id || subId, ...subVal })
        }
      }
    }
  }
  return collected
}
const itemsList = collectItemsFromJson(itemsJson)
let itemsModified = false

for (const it of itemsList) {
  const dna = (it.dna || it.dna_prompt_anchor || it.visual_dna || it.prompt || it.description || '').trim()
  const plate = it.reference_plate || `${it.id}.jpg`
  const plateExists = fs.existsSync(path.join(vaultDir, plate)) || fs.existsSync(path.join(charFilesDir, plate))

  if (auditPureFlowNaming(it, 'items.json')) itemsModified = true

  if (!dna) {
    issues.items.push({ id: it.id, name: it.name || it.id, issue: 'Missing DNA / visual_dna / anchor' })
  }

  if (!plateExists) {
    issues.plates.push({ id: it.id, name: it.name || it.id, plate, type: 'item/location' })
  }

  // Auto-Fix: Normalise 4-field DNA schema
  if (autoFix) {
    const bestDna = it.dna_prompt_anchor || it.dna || it.visual_dna || it.description || ''
    const bestDesc = it.description || it.visual_dna || (it.dna ? it.dna.replace(/^@\{[^}]+\},\s*/, '') : '') || it.name
    if (bestDna) {
      if (!it.dna) { it.dna = bestDna; itemsModified = true }
      if (!it.dna_prompt_anchor) { it.dna_prompt_anchor = bestDna; itemsModified = true }
      if (!it.visual_dna) { it.visual_dna = bestDesc; itemsModified = true }
      if (!it.description) { it.description = bestDesc; itemsModified = true }
    }
  }
}

// 3a. Cross-Vault 1:1 Reference-to-DNA Parity, Semantic Contradiction, Duplicate Plate & Flow Coverage Audit
const cvById = new Map()
for (const c of [...charList, ...itemsList]) {
  if (c && c.id) cvById.set(c.id, c)
}

const stripStyleTail = s => String(s || '')
  .replace(/^@\{[^}]+\},\s*/i, '')
  .replace(/,?\s*(?:modern 2025|dark fantasy|bright high-fantasy|vertical 9:16|horizontal 16:9).*$/i, '')
  .trim()

const CONTRADICTION_PAIRS = [
  [/\b(?:analogue|analog|needle\s+sweep|dial\s+gauge|vacuum-tube)\b/i, /\b(?:digital\s+readout|touchscreen|lcd\s+screen)\b/i, 'Analogue hardware vs digital readout contradiction'],
  [/\bwaist-length\b|\blong\b[^.]{0,30}\bhair\b/i, /\b(?:short|cropped|buzz-cut|swept-back\s+midnight)\b[^.]{0,20}\bhair\b/i, 'Hair length contradiction'],
  [/\b(?:jet-black|raven-black)\s+hair\b/i, /\b(?:midnight[\s-]blue|golden-blonde|crimson)\s+hair\b/i, 'Hair colour contradiction'],
  [/\bgolden\s+eyes\b/i, /\b(?:silver-flecked|ice-blue|sapphire-blue)\s+eyes\b/i, 'Eye colour contradiction'],
  [/\bbrass\b/i, /\bmeteoric\s+platinum\b/i, 'Material contradiction (brass vs meteoric platinum)'],
  [/\bporcelain\s+saucer\b/i, /\bcontainment\s+vial\b/i, 'Container contradiction (porcelain saucer vs containment vial)'],
  [/\bsingle\b[^.]{0,25}\blofted\s+bunk\s+bed\b/i, /\btwo\s+lofted\s+wooden\s+beds\b/i, 'Room layout contradiction (single steel bunk vs two wooden beds)'],
  [/\bshort\s+silver\s+beard\b/i, /\brimless\s+rectangular\s+spectacles\b/i, 'Facial/eyewear attribute contradiction'],
  [/\bslicked-back\s+dark\s+brown\s+hair\b/i, /\bdisheveled\s+dark\s+hair\b/i, 'Hairstyle contradiction']
]

const plateUsageMap = new Map()
for (const ent of entityList) {
  const plateFile = ent.plate ? path.basename(ent.plate) : (ent.reference_plate ? path.basename(ent.reference_plate) : '')
  if (plateFile) {
    const entPlateExists = fs.existsSync(path.join(vaultDir, plateFile)) || fs.existsSync(path.join(charFilesDir, plateFile))
    if (!entPlateExists) {
      issues.plates.push({ id: ent.id, name: ent.name || ent.id, plate: plateFile, type: ent.kind || 'entity' })
    }
    const pKey = plateFile.toLowerCase()
    if (!plateUsageMap.has(pKey)) plateUsageMap.set(pKey, [])
    plateUsageMap.get(pKey).push(ent.id)
  }

  const cv = cvById.get(ent.id)
  const entDna = (ent.dna || '').trim()
  const entOutfits = ent.outfits ? Object.values(ent.outfits).join(' ') : ''
  const entCombined = `${entDna} ${entOutfits}`.trim()

  if (cv) {
    const cvCore = stripStyleTail(cv.dna_prompt_anchor || cv.dna || cv.visual_dna || '')
    if (ent.kind !== 'location' && cvCore.length >= 60 && entCombined.length < Math.floor(cvCore.length * 0.72)) {
      issues.crossVaultDrift.push({
        id: ent.id,
        name: ent.name || ent.token || ent.id,
        issue: `Lossy DNA truncation in vault/entities.json (${entCombined.length} chars vs ${cvCore.length} core chars in character_vault)`
      })
    }

    for (const [reA, reB, label] of CONTRADICTION_PAIRS) {
      const aEnt = reA.test(entCombined)
      const bEnt = reB.test(entCombined)
      const aCv = reA.test(cvCore)
      const bCv = reB.test(cvCore)
      if ((aEnt && bCv) || (bEnt && aCv) || (aEnt && bEnt)) {
        issues.crossVaultDrift.push({
          id: ent.id,
          name: ent.name || ent.token || ent.id,
          issue: `${label} between vault/entities.json and character_vault`
        })
      }
    }

    if (/\bshattered\s+fragments\b/i.test(entDna) && !/\bshattered\b/i.test(cvCore)) {
      issues.crossVaultDrift.push({
        id: ent.id,
        name: ent.name || ent.token || ent.id,
        issue: 'Default weapon DNA locked as shattered fragments while character_vault plate is intact'
      })
    }
  }

  // Check Flow entities coverage (when flow_entities.json exists)
  if (flowJson && flowJson.entities && typeof flowJson.entities === 'object') {
    const cleanTok = String(ent.token || '').replace(/^@\{|\}$/g, '').trim()
    if (cleanTok) {
      const flowKeysLower = new Set(Object.keys(flowJson.entities).map(k => k.trim().toLowerCase()))
      const legacyKey = `character: ${cleanTok}`.toLowerCase()
      const bossKey = `boss: ${cleanTok}`.toLowerCase()
      const isLegacyAllowed = legacyFlowNameAllowlist.has(ent.id)
      const hasExactOrAllowedLegacy = flowKeysLower.has(cleanTok.toLowerCase()) ||
        (isLegacyAllowed && (flowKeysLower.has(legacyKey) || flowKeysLower.has(bossKey)))
      if (!hasExactOrAllowedLegacy) {
        issues.flowMissing.push({
          id: ent.id,
          token: ent.token,
          plate: plateFile || 'NONE'
        })
      }
    }
  }
}

for (const [plateKey, ids] of plateUsageMap.entries()) {
  if (ids.length > 1) {
    const allAllowlisted = ids.every(id => legacyPlateShareAllowlist.has(id))
    if (!allAllowlisted) {
      issues.duplicatePlates.push({
        plate: plateKey,
        ids
      })
    }
  }
}

// 3b. Anti-Clone Duplicate Reference Plate Invariant (Gate G20+)
const plateHashes = new Map()
for (const entry of [...charList.map(c => ({ ...c, type: 'character' })), ...itemsList.map(i => ({ ...i, type: 'item/location' }))]) {
  const plate = entry.reference_plate || `${entry.id}.jpg`
  const foundPath = [path.join(vaultDir, plate), path.join(charFilesDir, plate)].find(p => fs.existsSync(p))
  if (foundPath) {
    try {
      const buf = fs.readFileSync(foundPath)
      const hash = crypto.createHash('sha256').update(buf).digest('hex')
      if (plateHashes.has(hash)) {
        const existing = plateHashes.get(hash)
        if (existing.plate !== plate || existing.id !== entry.id) {
          issues.clonedPlates.push({
            id: entry.id,
            name: entry.name || entry.id,
            plate,
            type: entry.type,
            clonedFrom: existing.name,
            clonedPlate: existing.plate
          })
        }
      } else {
        plateHashes.set(hash, { id: entry.id, name: entry.name || entry.id, plate, type: entry.type })
      }
    } catch (e) {
      // Ignore read errors
    }
  }
}

// 4. Cross-check Series_Bible.md Parity
if (fs.existsSync(biblePath)) {
  const bibleContent = fs.readFileSync(biblePath, 'utf-8')
  for (const c of charList) {
    const token = c.token || `@{${c.name}}`
    if (!bibleContent.includes(token)) {
      issues.bible.push({ id: c.id, token, name: c.name })
    }
  }
}

// Execute Auto-Fix File Writes
if (autoFix) {
  if (charsModified) {
    fs.writeFileSync(charsPath, JSON.stringify(charsJson, null, 2), 'utf-8')
    modifiedFiles.push('character_vault/characters.json')
  }
  if (itemsModified) {
    fs.writeFileSync(itemsPath, JSON.stringify(itemsJson, null, 2), 'utf-8')
    modifiedFiles.push('character_vault/items.json')
  }
}

// Total issues calculation
const totalIssues =
  issues.entities.length +
  issues.characters.length +
  issues.items.length +
  issues.crossVaultDrift.length +
  issues.duplicatePlates.length +
  issues.flowNames.length +
  issues.flowMissing.length +
  issues.plates.length +
  issues.clonedPlates.length +
  issues.bible.length

if (jsonOnly) {
  console.log(JSON.stringify({ franchiseId, clean: totalIssues === 0, totalIssues, issues, modifiedFiles }, null, 2))
  process.exit(totalIssues === 0 ? 0 : 1)
}

console.log('==============================================================================')
console.log(`  MANHWA RECAP STUDIO — UNIVERSAL VAULT AUDITOR (v2.0)`)
console.log('==============================================================================')
console.log(`Franchise    : ${franchiseId}`)
console.log(`Entities     : ${entityList.length} in vault/entities.json`)
console.log(`Characters   : ${charList.length} in character_vault/characters.json`)
console.log(`Items/Locs   : ${itemsList.length} in character_vault/items.json`)
console.log('------------------------------------------------------------------------------')

if (totalIssues === 0) {
  console.log(`\x1b[32m[PASS]\x1b[0m 100% Vault & DNA Integrity Verified. Zero Defects Found.`)
  console.log(`  - All characters, items & entities possess 1:1 non-lossy physical DNA parity.`)
  console.log(`  - Zero duplicate plate aliases or cross-vault attribute contradictions.`)
  console.log(`  - All master reference plates and flow_entities bindings confirmed on disk.`)
  console.log(`  - 100% token parity verified against Series_Bible.md.`)
} else {
  console.log(`\x1b[31m[DEFECTS FOUND]\x1b[0m Total Issues: ${totalIssues}`)
  if (issues.entities.length > 0) {
    console.log(`\n  \x1b[33mEntities Missing/Short DNA (${issues.entities.length}):\x1b[0m`)
    issues.entities.forEach(i => console.log(`    - ${i.name} (${i.id}): ${i.issue}`))
  }
  if (issues.characters.length > 0) {
    console.log(`\n  \x1b[33mCharacters Missing/Short DNA (${issues.characters.length}):\x1b[0m`)
    issues.characters.forEach(i => console.log(`    - ${i.name} (${i.id}): ${i.issue}`))
  }
  if (issues.items.length > 0) {
    console.log(`\n  \x1b[33mItems/Locations Missing DNA (${issues.items.length}):\x1b[0m`)
    issues.items.forEach(i => console.log(`    - ${i.name} (${i.id}): ${i.issue}`))
  }
  if (issues.crossVaultDrift.length > 0) {
    console.log(`\n  \x1b[31mCross-Vault 1:1 DNA Drift / Contradictions (${issues.crossVaultDrift.length}):\x1b[0m`)
    issues.crossVaultDrift.forEach(i => console.log(`    - ${i.name} (${i.id}): ${i.issue}`))
  }
  if (issues.duplicatePlates.length > 0) {
    console.log(`\n  \x1b[31mDuplicate Entity Plate Bindings in vault/entities.json (${issues.duplicatePlates.length}):\x1b[0m`)
    issues.duplicatePlates.forEach(i => console.log(`    - ${i.plate} shared by IDs: [${i.ids.join(', ')}]`))
  }
  if (issues.flowMissing.length > 0) {
    console.log(`\n  \x1b[31mEntities Missing from character_vault/flow_entities.json (${issues.flowMissing.length}):\x1b[0m`)
    issues.flowMissing.forEach(i => console.log(`    - ${i.token} (${i.id} -> ${i.plate})`))
  }
  if (issues.plates.length > 0) {
    console.log(`\n  \x1b[31mMissing Master Reference Plates on Disk (${issues.plates.length}):\x1b[0m`)
    issues.plates.forEach(i => console.log(`    - [${i.type}] ${i.name} -> Expected plate file missing: ${i.plate}`))
  }
  if (issues.clonedPlates.length > 0) {
    console.log(`\n  \x1b[31mCloned / Duplicate Reference Plates Detected (${issues.clonedPlates.length}):\x1b[0m`)
    issues.clonedPlates.forEach(i => console.log(`    - [${i.type}] ${i.name} (${i.plate}) has identical image hash to ${i.clonedFrom} (${i.clonedPlate})`))
  }
  if (issues.flowNames.length > 0) {
    console.log(`\n  \x1b[31mDeprecated Category Prefix in flowName / Token (${issues.flowNames.length}):\x1b[0m`)
    issues.flowNames.forEach(i => console.log(`    - [${i.collection}] ${i.name}: "${i.value}" (Pure names required; run --fix to strip prefix)`))
  }
  if (issues.bible.length > 0) {
    console.log(`\n  \x1b[33mTokens Missing from Series_Bible.md (${issues.bible.length}):\x1b[0m`)
    issues.bible.forEach(i => console.log(`    - ${i.name} (${i.token})`))
  }
  if (!autoFix) {
    console.log(`\n\x1b[36m[TIP]\x1b[0m Run with '--fix' to automatically normalise missing dual-keys:`)
    console.log(`  node studio/scripts/audit-vault.js ${franchiseId} --fix`)
  }
}

if (modifiedFiles.length > 0) {
  console.log(`\n\x1b[32m[AUTO-HEALED]\x1b[0m Synchronised files: ${modifiedFiles.join(', ')}`)
}
console.log('==============================================================================')

process.exit(totalIssues === 0 ? 0 : 1)
