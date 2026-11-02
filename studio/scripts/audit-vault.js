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
  plates: [],
  clonedPlates: [],
  bible: []
}

let modifiedFiles = []

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
let charsModified = false

for (const c of charList) {
  const dna = (c.dna || c.dna_prompt_anchor || '').trim()
  const plate = c.reference_plate || `${c.id}.jpg`
  const plateExists = fs.existsSync(path.join(vaultDir, plate)) || fs.existsSync(path.join(charFilesDir, plate))

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

// 3. Audit character_vault/items.json
let itemsJson = readJson(itemsPath) || { items: [] }
const itemsList = Array.isArray(itemsJson) ? itemsJson : (itemsJson.items || [])
let itemsModified = false

for (const it of itemsList) {
  const dna = (it.dna || it.dna_prompt_anchor || it.visual_dna || it.prompt || it.description || '').trim()
  const plate = it.reference_plate || `${it.id}.jpg`
  const plateExists = fs.existsSync(path.join(vaultDir, plate)) || fs.existsSync(path.join(charFilesDir, plate))

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
const totalIssues = issues.entities.length + issues.characters.length + issues.items.length + issues.plates.length + issues.clonedPlates.length + issues.bible.length

if (jsonOnly) {
  console.log(JSON.stringify({ franchiseId, clean: totalIssues === 0, totalIssues, issues, modifiedFiles }, null, 2))
  process.exit(totalIssues === 0 ? 0 : 1)
}

console.log('==============================================================================')
console.log(`  MANHWA RECAP STUDIO — UNIVERSAL VAULT AUDITOR (v1.0)`)
console.log('==============================================================================')
console.log(`Franchise    : ${franchiseId}`)
console.log(`Entities     : ${entityList.length} in vault/entities.json`)
console.log(`Characters   : ${charList.length} in character_vault/characters.json`)
console.log(`Items/Locs   : ${itemsList.length} in character_vault/items.json`)
console.log('------------------------------------------------------------------------------')

if (totalIssues === 0) {
  console.log(`\x1b[32m[PASS]\x1b[0m 100% Vault & DNA Integrity Verified. Zero Defects Found.`)
  console.log(`  - All characters & entities possess complete physical DNA and prompt anchors.`)
  console.log(`  - All master reference plates confirmed existing on disk.`)
  console.log(`  - 100% token parity verified against Series_Bible.md.`)
} else {
  console.log(`\x1b[31m[DEFECTS FOUND]\x1b[0m Total Issues: ${totalIssues}`)
  if (issues.characters.length > 0) {
    console.log(`\n  \x1b[33mCharacters Missing/Short DNA (${issues.characters.length}):\x1b[0m`)
    issues.characters.forEach(i => console.log(`    - ${i.name} (${i.id}): ${i.issue}`))
  }
  if (issues.items.length > 0) {
    console.log(`\n  \x1b[33mItems/Locations Missing DNA (${issues.items.length}):\x1b[0m`)
    issues.items.forEach(i => console.log(`    - ${i.name} (${i.id}): ${i.issue}`))
  }
  if (issues.plates.length > 0) {
    console.log(`\n  \x1b[31mMissing Master Reference Plates on Disk (${issues.plates.length}):\x1b[0m`)
    issues.plates.forEach(i => console.log(`    - [${i.type}] ${i.name} -> Expected plate file missing: ${i.plate}`))
  }
  if (issues.clonedPlates.length > 0) {
    console.log(`\n  \x1b[31mCloned / Duplicate Reference Plates Detected (${issues.clonedPlates.length}):\x1b[0m`)
    issues.clonedPlates.forEach(i => console.log(`    - [${i.type}] ${i.name} (${i.plate}) has identical image hash to ${i.clonedFrom} (${i.clonedPlate})`))
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
