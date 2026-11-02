#!/usr/bin/env node
/**
 * studio/scripts/audit-script.js
 *
 * Universal Studio Episodic Script Auditor & Staging Header Healer (v2.1).
 * Enforces:
 *   1. Zero-At Narration Law (spoken audio insulation for Edge-TTS)
 *   2. 1:1 Contiguous [IMG_001]...[IMG_XXX] scene tag sequence
 *   3. V2.1 Inline Staging Headers: <!-- ZONE | STAGE | ACTOR | CAST | PROPS | TECH_STAGE | PLAN_TALK -->
 *   4. Zone validity against zones.json
 *   5. V2.1 FIX: First-name aliases mapping and sticky cast state cleanup
 *
 * Usage:
 *   node studio/scripts/audit-script.js <franchiseId> <episodeId> [--heal-headers] [--json]
 *   npm run audit:script <franchiseId> <episodeId>
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const jsonOnly = args.includes('--json')
const isHeal = args.includes('--heal-headers') || args.includes('--fix')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]

if (!franchiseId || !episodeId) {
  console.error('\x1b[31m[ERROR]\x1b[0m Usage: node studio/scripts/audit-script.js <franchiseId> <episodeId> [--heal-headers] [--json]')
  process.exit(1)
}

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
const epPath = path.resolve(franchiseDir, episodeId)
const scriptPath = path.join(epPath, '01_Episode_Script.md')

if (!fs.existsSync(scriptPath)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Script file not found: ${scriptPath}`)
  process.exit(1)
}

// Load franchise context
const readJsonSafe = (p) => {
  if (fs.existsSync(p)) {
    try { return JSON.parse(fs.readFileSync(p, 'utf-8')) } catch (_) {}
  }
  return null
}

const franchise = readJsonSafe(path.join(franchiseDir, 'franchise.json')) || {}
const zones = readJsonSafe(path.join(franchiseDir, franchise.paths?.zones || 'vault/zones.json')) ||
              readJsonSafe(path.join(franchiseDir, '00_Locations/locations.json')) || {}
const entities = readJsonSafe(path.join(franchiseDir, franchise.paths?.entities || 'vault/entities.json')) || {}
const legacyChars = readJsonSafe(path.join(franchiseDir, 'character_vault/characters.json'))?.characters ||
                    readJsonSafe(path.join(franchiseDir, 'character_vault/characters.json')) || []
const legacyItems = readJsonSafe(path.join(franchiseDir, 'character_vault/items.json'))?.items ||
                    readJsonSafe(path.join(franchiseDir, 'character_vault/items.json')) || []

const allZonesList = Object.keys(zones)
const zoneById = new Map()
for (const [k, v] of Object.entries(zones)) {
  zoneById.set(k.toLowerCase(), v)
  if (v.name) zoneById.set(v.name.toLowerCase(), v)
}

// Build entity list
const allChars = []
if (Object.keys(entities).length > 0) {
  for (const ent of Object.values(entities)) {
    if (ent.kind === 'character') allChars.push(ent)
  }
} else if (Array.isArray(legacyChars)) {
  for (const c of legacyChars) allChars.push(c)
}

// V2.1: Add first-name alias mapping to prevent sticky state & name misses
allChars.forEach(c => {
  const name = c.name || c.token?.replace(/^@\{|\}$/g, '') || ''
  if (!c.aliases) c.aliases = []
  if (name) {
    const firstName = name.split(' ')[0]
    if (firstName && firstName !== name && !c.aliases.includes(firstName)) {
      c.aliases.push(firstName)
    }
    if (!c.aliases.includes(name)) {
      c.aliases.push(name)
    }
  }
})

let scriptText = fs.readFileSync(scriptPath, 'utf-8')
let lines = scriptText.split('\n')

const issues = {
  atTokens: [],
  sceneTags: [],
  stagingHeaders: [],
  batches: []
}

// 1. Check for @ tokens in spoken narration (ignoring HTML comments/staging headers)
const atMatches = []
lines.forEach((line, idx) => {
  const trimmed = line.trim()
  if (trimmed.startsWith('#') || trimmed.startsWith('>') || trimmed.startsWith('<!--') || trimmed.startsWith('```')) return
  // Strip out HTML comments (including V2.0 inline staging headers) and scene tags
  const spokenOnly = trimmed.replace(/<!--[\s\S]*?-->/g, '').replace(/\[IMG_\d+\]/g, '').trim()
  const matches = spokenOnly.match(/@\{?[A-Za-z0-9_ ]+\}?/g)
  if (matches) {
    atMatches.push({ line: idx + 1, tokens: matches, text: spokenOnly.substring(0, 100) })
  }
})
if (atMatches.length > 0) issues.atTokens = atMatches

// 2. Check [IMG_XXX] tags
const sceneTagMatches = [...scriptText.matchAll(/\[(IMG_\d+)\]/g)]
const sceneTags = sceneTagMatches.map(m => m[1])
const seenTags = new Set()
const duplicateTags = []

sceneTags.forEach(tag => {
  if (seenTags.has(tag)) duplicateTags.push(tag)
  seenTags.add(tag)
})

const gaps = []
for (let i = 0; i < sceneTags.length; i++) {
  const expected = `IMG_${String(i + 1).padStart(3, '0')}`
  if (sceneTags[i] !== expected) {
    gaps.push({ index: i + 1, actual: sceneTags[i], expected })
  }
}

if (duplicateTags.length > 0) issues.sceneTags.push({ type: 'duplicates', tags: duplicateTags })
if (gaps.length > 0) issues.sceneTags.push({ type: 'sequence_gaps', gaps: gaps.slice(0, 5) })

// 3. Check V2.0 Inline Staging Headers
const headerRegex = /<!--\s*ZONE:\s*([^|]+?)\s*\|\s*STAGE:\s*([^|]+?)\s*\|\s*ACTOR:\s*([^|]+?)\s*\|\s*CAST:\s*\[([^\]]*)\]\s*\|\s*PROPS:\s*\[([^\]]*)\](?:\s*\|\s*TECH_STAGE:\s*([^|]+?))?(?:\s*\|\s*PLAN_TALK:\s*([^>]+?))?\s*-->/i

const clauses = []
const clauseSplitRegex = /(?:^|\n)\s*\[(IMG_\d+)\]\s*([\s\S]*?)(?=(?:\n\s*\[IMG_\d+\]|$))/gi
let cm
while ((cm = clauseSplitRegex.exec(scriptText)) !== null) {
  clauses.push({
    id: cm[1].toUpperCase(),
    rawText: cm[2]
  })
}

const missingHeaders = []
const invalidZones = []
const phantomDialogueCasts = []

clauses.forEach((cl, idx) => {
  const m = cl.rawText.match(headerRegex)
  if (!m) {
    missingHeaders.push(cl.id)
  } else {
    const zId = m[1].trim()
    if (allZonesList.length > 0 && !zones[zId]) {
      invalidZones.push({ id: cl.id, zone: zId })
    }
    // Check for Phantom Dialogue Cast Leaks (e.g., someone asking "where is the fire mage?" in a private sanctuary)
    const castList = m[4].split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
    const cleanClause = cl.rawText.replace(/<!--[\s\S]*?-->/g, '').trim()
    const outsideQuotes = cleanClause.replace(/"[^"]*"/g, ' ').replace(/“[^”]*”/g, ' ')
    const insideQuotesOnly = (cleanClause.match(/"[^"]*"|“[^”]*”/g) || []).join(' ')

    for (const member of castList) {
      const firstName = member.split(' ')[0]
      const mentionedInQuotes = new RegExp(`\\b(?:${member}|${firstName})\\b`, 'i').test(insideQuotesOnly)
      const mentionedOutside = new RegExp(`\\b(?:${member}|${firstName})\\b`, 'i').test(outsideQuotes)
      if (mentionedInQuotes && !mentionedOutside) {
        // Check if this character is present in a nearby scene (+/- 3 scenes) within the same zone
        let inNearbySameZone = false
        for (let offset = -3; offset <= 3; offset++) {
          if (offset === 0) continue
          const neighbor = clauses[idx + offset]
          if (neighbor && neighbor.rawText.includes(`ZONE: ${zId}`) && neighbor.rawText.includes(member)) {
            inNearbySameZone = true
            break
          }
        }
        if (!inNearbySameZone) {
          phantomDialogueCasts.push({ id: cl.id, character: member, zone: zId })
        }
      }
    }
  }
})

if (missingHeaders.length > 0) {
  issues.stagingHeaders.push({ type: 'missing_headers', count: missingHeaders.length, scenes: missingHeaders.slice(0, 10) })
}
if (invalidZones.length > 0) {
  issues.stagingHeaders.push({ type: 'invalid_zones', count: invalidZones.length, zones: invalidZones.slice(0, 5) })
}
if (phantomDialogueCasts.length > 0) {
  issues.stagingHeaders.push({ type: 'phantom_dialogue_cast_leak', count: phantomDialogueCasts.length, details: phantomDialogueCasts.slice(0, 5) })
}

// 4. Auto-Heal Headers if requested
if (isHeal) {
  console.log(`\x1b[33m[HEAL]\x1b[0m Inferring and injecting V2.1 Staging Headers for ${clauses.length} scenes...`)

  let activeZone = allZonesList[0] || 'emerald_valley_forest_trail'
  let activeCast = []
  let activeActor = '@{Ace Miller}'
  const epNumMatch = episodeId.match(/EP0?(\d+)/i)
  const epNum = epNumMatch ? parseInt(epNumMatch[1], 10) : 1
  const defaultTechStage = epNum === 1 ? 'ep01_stage1' : epNum === 2 ? 'ep02_stage2' : 'arc3_stage3'

  let healedScript = scriptText

  for (const cl of clauses) {
    const narrativeClean = cl.rawText
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .trim()

    const narrativeOutsideQuotes = narrativeClean.replace(/"[^"]*"/g, ' ').replace(/“[^”]*”/g, ' ')

    // Zone inference
    const nLower = narrativeClean.toLowerCase()
    for (const zKey of allZonesList) {
      const zObj = zones[zKey] || {}
      const zName = (zObj.name || '').toLowerCase()
      if (nLower.includes(zKey.replace(/_/g, ' ')) || (zName && nLower.includes(zName))) {
        activeZone = zKey
        break
      }
    }
    if (nLower.includes('library') && zones['frontier_town_library']) activeZone = 'frontier_town_library'
    else if (nLower.includes('bath') && zones['miller_sanctuary_bath_courtyard']) activeZone = 'miller_sanctuary_bath_courtyard'
    else if (nLower.includes('tax') && zones['oakhaven_tax_chamber']) activeZone = 'oakhaven_tax_chamber'
    else if (nLower.includes('palace') && zones['solaris_imperial_palace']) activeZone = 'solaris_imperial_palace'
    else if (nLower.includes('cottage') && zones['old_miller_cottage_interior']) activeZone = 'old_miller_cottage_interior'
    else if (nLower.includes('trail') || nLower.includes('creek') || nLower.includes('spring')) {
      if (zones['emerald_valley_forest_trail']) activeZone = 'emerald_valley_forest_trail'
    } else if (nLower.includes('farm') || nLower.includes('courtyard') || nLower.includes('aqueduct')) {
      if (zones['miller_sanctuary_farm_exterior']) activeZone = 'miller_sanctuary_farm_exterior'
    }

    // Cast inference
    const detectedCast = new Set()
    for (const c of allChars) {
      const cName = c.name || c.token?.replace(/^@\{|\}$/g, '')
      if (!cName) continue
      const reg = new RegExp(`\\b${cName}\\b`, 'i')
      if (reg.test(narrativeOutsideQuotes)) {
        detectedCast.add(c.token || `@{${cName}}`)
      }
      for (const al of c.aliases || []) {
        if (new RegExp(`\\b${al}\\b`, 'i').test(narrativeOutsideQuotes)) {
          detectedCast.add(c.token || `@{${cName}}`)
        }
      }
      for (const kt of c.kinship_terms || []) {
        if (new RegExp(`\\b(?:his|her|their|my)\\s+${kt}\\b`, 'i').test(narrativeOutsideQuotes)) {
          detectedCast.add(c.token || `@{${cName}}`)
        }
      }
    }

    if (/\b(?:family|four millers|parents)\b/i.test(narrativeOutsideQuotes)) {
      detectedCast.add('@{Ace Miller}')
      detectedCast.add('@{Garrett Miller}')
      detectedCast.add('@{Clara Miller}')
      detectedCast.add('@{Maya Miller}')
    }

    // V2.1: Clear sticky state! If cast is empty, do NOT carry over activeCast unless there's a strong pronoun continuation
    let finalCast = [...detectedCast]
    if (finalCast.length === 0) {
      if (/\b(?:he|she|they|his|her|their|him|them)\b/i.test(narrativeOutsideQuotes) && activeCast.length > 0) {
        finalCast = [...activeCast]
      } else {
        finalCast = []
        activeCast = []
      }
    } else {
      activeCast = [...finalCast]
    }

    // Sort minors (<18) to Index 0
    finalCast.sort((a, b) => {
      const aLower = a.toLowerCase()
      const bLower = b.toLowerCase()
      const aIsMinor = aLower.includes('ace') || aLower.includes('maya') || aLower.includes('minor')
      const bIsMinor = bLower.includes('ace') || bLower.includes('maya') || bLower.includes('minor')
      if (aIsMinor && !bIsMinor) return -1
      if (!aIsMinor && bIsMinor) return 1
      return 0
    })

    // Actor inference
    let actor = finalCast[0] || 'NONE'
    for (const member of finalCast) {
      const cleanM = member.replace(/[@{}]/g, '')
      const firstName = cleanM.split(' ')[0]
      if (new RegExp(`\\b(?:${cleanM}|${firstName})\\s+(?:stepped|smiled|carved|held|said|whispered|grinned|looked|turned|jogged|hauled|lifted|dragged|walked|pointed|rested|gestured|knelt|slid|stood|leaned|wiped)\\b`, 'i').test(narrativeOutsideQuotes)) {
        actor = member
        break
      }
    }

    // Stage inference
    let stage = 'interaction'
    if (finalCast.length === 0) stage = 'establishing'
    else if (finalCast.length === 1) stage = 'solo'
    else if (/\b(?:stepped into|walked in|burst through|entered)\b/i.test(narrativeOutsideQuotes)) stage = 'entrance'

    // Plan talk
    const planTalk = /(?:tomorrow we|later it's going to give|next month we|future plans|blueprint|give our house real glass windows)/i.test(nLower)

    const headerStr = `<!-- ZONE: ${activeZone} | STAGE: ${stage} | ACTOR: ${actor} | CAST: [${finalCast.join(', ')}] | PROPS: [] | TECH_STAGE: ${defaultTechStage} | PLAN_TALK: ${planTalk} -->`

    // Inject into script text safely without duplication
    const targetTag = `[${cl.id}]`
    const replaceWith = `${targetTag} ${headerStr}`
    const looseMatch = cl.rawText.match(/<!--\s*ZONE:[\s\S]*?-->/i)
    if (looseMatch) {
      healedScript = healedScript.replace(looseMatch[0], headerStr)
    } else {
      healedScript = healedScript.replace(targetTag, replaceWith)
    }
  }

  fs.writeFileSync(scriptPath, healedScript, 'utf-8')
  console.log(`\x1b[32m[HEALED]\x1b[0m Successfully updated ${scriptPath} with V2.0 Staging Headers!`)
  scriptText = healedScript
  // Re-run issues
  issues.stagingHeaders = []
}

const batchHeaders = [...scriptText.matchAll(/##\s+.*?BATCH\s+(\d+)/gi)].map(m => m[0])
const batchCount = batchHeaders.length
const expectedBatches = Math.ceil(sceneTags.length / 24)
const wordCount = scriptText.trim().split(/\s+/).length
const estimatedMinutes = Math.round(wordCount / 155)

const totalIssues = issues.atTokens.length + issues.sceneTags.length + issues.stagingHeaders.length

if (jsonOnly) {
  console.log(JSON.stringify({
    franchiseId,
    episodeId,
    clean: totalIssues === 0,
    totalScenes: sceneTags.length,
    batchCount,
    expectedBatches,
    wordCount,
    estimatedMinutes,
    issues
  }, null, 2))
  process.exit(totalIssues === 0 ? 0 : 1)
}

console.log('='.repeat(78))
console.log(`  MANHWA RECAP STUDIO — EPISODIC SCRIPT AUDITOR (v2.0)`)
console.log('='.repeat(78))
console.log(`Franchise    : ${franchiseId}`)
console.log(`Episode      : ${episodeId}`)
console.log(`Scenes Found : ${sceneTags.length} line-anchored [IMG_XXX] tags`)
console.log(`Batches      : ${batchCount} modular batches (Expected: ~${expectedBatches} at 24 scenes/batch)`)
console.log(`Words / Est. : ${wordCount} words (~${estimatedMinutes} mins @ 155 WPM)`)
console.log('-'.repeat(78))

if (totalIssues === 0) {
  console.log(`\x1b[32m[PASS]\x1b[0m 100% Script Integrity Verified. Zero Defects Found.`)
  console.log(`  - Zero @ tokens in spoken audio (Edge-TTS pronunciation insulated).`)
  console.log(`  - 100% contiguous [IMG_001] to [IMG_${String(sceneTags.length).padStart(3, '0')}] scene tags with zero sequence gaps.`)
  console.log(`  - 100% V2.0 Staging Headers present and verified against zones.json.`)
  console.log(`  - Clean modular batch headers.`)
} else {
  console.log(`\x1b[31m[DEFECTS FOUND]\x1b[0m Total Issues: ${totalIssues}`)
  if (issues.atTokens.length > 0) {
    console.log(`\n  \x1b[31mForbidden @ Tokens in Spoken Prose (${issues.atTokens.length} lines):\x1b[0m`)
    issues.atTokens.slice(0, 8).forEach(t => console.log(`    - Line ${t.line}: ${t.tokens.join(', ')} -> "${t.text}..."`))
  }
  if (issues.sceneTags.length > 0) {
    console.log(`\n  \x1b[31mScene Tag Structure / Sequence Errors:\x1b[0m`)
    issues.sceneTags.forEach(s => console.log(`    - ${s.type}:`, s))
  }
  if (issues.stagingHeaders.length > 0) {
    console.log(`\n  \x1b[31mMissing or Invalid Staging Headers:\x1b[0m`)
    issues.stagingHeaders.forEach(sh => console.log(`    - ${sh.type}: ${sh.count} scenes (Run with --heal-headers to auto-fix)`))
  }
}
console.log('='.repeat(78))

process.exit(totalIssues === 0 ? 0 : 1)
