#!/usr/bin/env node
/**
 * studio/scripts/audit-matrix.js
 *
 * Universal 18-Gate Allow-List CLI Linter Runner (v2.0).
 * Usage: node studio/scripts/audit-matrix.js <franchiseId> <episodeId> [--json]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { AntiSlopValidator } from '../server/services/antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const jsonOnly = args.includes('--json')
const positionalArgs = args.filter(a => !a.startsWith('--'))

const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]

if (!franchiseId || !episodeId) {
  console.error('Usage: node studio/scripts/audit-matrix.js <franchiseId> <episodeId> [--json]')
  process.exit(1)
}

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
const epPath = path.resolve(franchiseDir, episodeId)
const scriptPath = path.join(epPath, '01_Episode_Script.md')
const promptPath = path.join(epPath, '02_Prompt_Matrix.md')

if (!fs.existsSync(scriptPath) || !fs.existsSync(promptPath)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Missing script or prompt matrix in: ${epPath}`)
  process.exit(1)
}

const loadJsonIfExists = filePath => {
  if (!fs.existsSync(filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (e) {
    console.warn(`[WARN] Failed to parse ${filePath}: ${e.message}`)
    return null
  }
}

const scriptText = fs.readFileSync(scriptPath, 'utf-8')
const promptMatrixText = fs.readFileSync(promptPath, 'utf-8')

const franchise = loadJsonIfExists(path.join(franchiseDir, 'franchise.json'))
const entities =
  loadJsonIfExists(path.join(franchiseDir, franchise?.paths?.entities || 'vault/entities.json')) || {}
const zones =
  loadJsonIfExists(path.join(franchiseDir, franchise?.paths?.zones || 'vault/zones.json')) || {}
const policy =
  loadJsonIfExists(path.join(franchiseDir, franchise?.paths?.policy || 'policy.json')) ||
  loadJsonIfExists(path.resolve(projectRoot, '00_Engine/policy.json'))

const legacyChars = loadJsonIfExists(path.join(franchiseDir, 'character_vault/characters.json'))?.characters || []
const legacyItems = loadJsonIfExists(path.join(franchiseDir, 'character_vault/items.json'))?.items || []
const legacyLocations = loadJsonIfExists(path.join(franchiseDir, '00_Locations/locations.json'))?.locations || []

const ledgerPath = path.join(epPath, franchise?.paths?.ledger || 'state_events.jsonl')
const ledgerText = fs.existsSync(ledgerPath) ? fs.readFileSync(ledgerPath, 'utf-8') : ''
const scenesJson = loadJsonIfExists(path.join(epPath, 'scenes.json'))
const audioTelemetry = loadJsonIfExists(path.join(epPath, 'audio_telemetry.json'))
const manifest = loadJsonIfExists(path.join(epPath, 'dispatch_manifest.json'))

const report = AntiSlopValidator.auditPromptMatrix(scriptText, promptMatrixText, {
  franchise,
  franchiseDir,
  epPath,
  episodeId,
  entities,
  zones,
  policy,
  characters: legacyChars,
  items: legacyItems,
  locations: legacyLocations,
  ledgerText,
  scenesJson,
  audioTelemetry,
  manifest
})

// Additional Storyboard Continuity Guards (C01-C03): anonymous role nouns, attire_damage persistence, non-wielder unarmed lock
const worldState = loadJsonIfExists(path.join(epPath, 'world_state.json'))
const sceneBlocks = [...promptMatrixText.matchAll(/<scene id="(IMG_\d+)"[\s\S]*?<character_refs>([\s\S]*?)<\/character_refs>[\s\S]*?<item_refs>([\s\S]*?)<\/item_refs>[\s\S]*?<prompt>([\s\S]*?)<\/prompt>/gi)]

const c01Fails = []
const c02Fails = []
const c03Fails = []
const c04Fails = []
const c05Fails = []

const ledgerEvents = ledgerText
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean)
  .map(l => { try { return JSON.parse(l) } catch (_) { return null } })
  .filter(Boolean)

for (const m of sceneBlocks) {
  const sId = m[1].toUpperCase()
  const sNum = parseInt(sId.replace(/\D/g, ''), 10)
  const charRefs = m[2].split(',').map(s => s.trim()).filter(Boolean)
  const itemRefs = m[3].split(',').map(s => s.trim()).filter(Boolean)
  const promptText = m[4].trim()
  const promptLower = promptText.toLowerCase()
  const actMatch = m[0].match(/<action_layer>([\s\S]*?)<\/action_layer>/i)
  const actLower = (actMatch ? actMatch[1] : '').toLowerCase()

  // C01: Block unattached/anonymous role nouns in action layers and character prompt tails
  if (/\bone actor kneeling\b|\bat the feet of the standing protagonist\b|\bno duplicate protagonist\b/i.test(promptText)) {
    c01Fails.push(sId)
  }
  const charEntitiesInFrame = charRefs
    .map(r => Object.values(entities).find(e => e.kind === 'character' && e.name?.toLowerCase() === r.toLowerCase()))
    .filter(Boolean)
  if (charEntitiesInFrame.length === 1 && /exactly one single protagonist\b/i.test(promptText) && !/julian|protagonist/i.test(charEntitiesInFrame[0].id)) {
    c01Fails.push(`${sId} (wrong "protagonist" label on ${charEntitiesInFrame[0].id})`)
  }
  const rawAct = actMatch ? actMatch[1].trim() : ''
  const actWithoutTokens = rawAct.replace(/@\{[^}]+\}/g, '')
  const unattachedRoleRe = /\b(?:protagonists?|actors?|antagonists?|rivals?|villains?|strangers?|pedestrians?|warriors?|knights?|humans?|people|persons?|npcs?|crowds?|bystanders?|spectators?|initiates?|students?|scholars?|opponents?|duelists?|combatants?|observers?|extras?|somebody|someone|anyone|random npcs)\b/i
  const actRoleMatch = actWithoutTokens.match(unattachedRoleRe)
  if (actRoleMatch) {
    c01Fails.push(`${sId} (unattached noun "${actRoleMatch[0]}" in action_layer)`)
  }
  if (charEntitiesInFrame.length > 0 && rawAct) {
    const actIdx = promptText.lastIndexOf(rawAct)
    const tailSlice = (actIdx >= 0 ? promptText.slice(actIdx + rawAct.length) : '').replace(/@\{[^}]+\}/g, '')
    const tailRoleMatch = tailSlice.match(/\b(?:protagonists?|actors?|strangers?|initiates?|spectators?|npcs?|extra humans|old men|archmages?|knights?)\b/i)
    if (tailRoleMatch) {
      c01Fails.push(`${sId} (unattached noun "${tailRoleMatch[0]}" in prompt tail)`)
    }
  }
  if (charEntitiesInFrame.length > 0 && charEntitiesInFrame.every(e => /\bungloved\b/i.test(`${e.visual_dna || ''} ${e.outfits?.default || ''}`))) {
    if (/\bgloved\b|\bgauntlet\b/i.test(actLower)) {
      c04Fails.push(`${sId} (bare-hand cast has "gloved/gauntlet" in action_layer)`)
    }
  }

  // C02: Enforce active attire_damage from state_events.jsonl (e.g., tattered_cuff)
  const activeDamageByEntity = new Map()
  const activeWeaponByEntity = new Map()
  for (const ev of ledgerEvents) {
    if (typeof ev.s === 'number' && ev.s <= sNum && ev.e && ev.set) {
      if (Object.prototype.hasOwnProperty.call(ev.set, 'attire_damage')) {
        if (ev.set.attire_damage && ev.set.attire_damage !== 'none') activeDamageByEntity.set(ev.e, ev.set.attire_damage)
        else activeDamageByEntity.delete(ev.e)
      }
      if (Object.prototype.hasOwnProperty.call(ev.set, 'held_weapon')) {
        if (ev.set.held_weapon && ev.set.held_weapon !== 'none') activeWeaponByEntity.set(ev.e, ev.set.held_weapon)
        else activeWeaponByEntity.delete(ev.e)
      }
    }
  }
  for (const [entId, dmg] of activeDamageByEntity.entries()) {
    const ent = entities[entId] || Object.values(entities).find(e => e.id === entId)
    const entName = (ent?.name || ent?.token?.replace(/^@\{|\}$/g, '') || '').toLowerCase()
    if (entName && charRefs.some(r => r.toLowerCase() === entName)) {
      if (String(dmg).includes('tattered') && !/torn tattered/i.test(promptText)) {
        c02Fails.push(`${sId} (${entId}:${dmg})`)
      }
    }
  }

  // C03: When a weapon item is present, every non-holder character in frame must have unarmed lock
  const hasWeaponItem = itemRefs.some(r => /\b(?:rapier|sword|greatsword|blade|staff|wand|dagger|spear|bow|axe)\b/i.test(r))
  if (hasWeaponItem && activeWeaponByEntity.size > 0) {
    const windowHolders = new Set(activeWeaponByEntity.keys())
    for (const w of worldState?.prop_continuity_windows || []) {
      const fN = parseInt(String(w.from_scene || '').replace(/\D/g, ''), 10)
      const tN = parseInt(String(w.to_scene || '').replace(/\D/g, ''), 10)
      if (sNum >= fN && sNum <= tN && w.holder_id) windowHolders.add(w.holder_id)
    }
    for (const ref of charRefs) {
      const ent = Object.values(entities).find(e => e.kind === 'character' && e.name?.toLowerCase() === ref.toLowerCase())
      if (!ent) continue
      const tokEsc = (ent.token || `@{${ent.name}}`).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase()
      const blockMatch = promptLower.match(new RegExp(`${tokEsc},\\s*([\\s\\S]*?)(?=,\\s*@\\{|,\\s*featuring @\\{|\\.\\s*spatial enclosure:|$)`))
      if (!windowHolders.has(ent.id)) {
        if (blockMatch && !/\bunarmed\b|\bzero swords\b/i.test(blockMatch[1])) {
          c03Fails.push(`${sId} (${ent.id} missing unarmed lock)`)
        }
      } else {
        if (blockMatch && !/\bgripping\b|\bholding\b/i.test(blockMatch[1])) {
          c03Fails.push(`${sId} (${ent.id} missing wielder hand-grip lock)`)
        }
      }
    }
  }

  // C05: Complete 2D Manhwa Style & Anti-3D CGI Lock (Never Stripped by Token Compactors)
  if (!/manhwa webtoon art style/i.test(promptText) || !/no photorealistic 3d cgi/i.test(promptText)) {
    c05Fails.push(`${sId} (missing ${!/manhwa webtoon art style/i.test(promptText) ? '2D manhwa style' : 'no photorealistic 3D CGI'})`)
  }
}

report.checks.push(
  {
    id: 'C01_no_anonymous_posture_nouns',
    name: 'C01: Entity-Anchored Posture & Subjects (Zero Unattached Role Nouns)',
    passed: c01Fails.length === 0,
    failingScenes: c01Fails,
    details: c01Fails.length === 0 ? 'All action layers and tails bind strictly to scene @{Entity} tokens with zero unattached role nouns.' : `Unattached role nouns detected (${c01Fails.join(', ')})`
  },
  {
    id: 'C02_attire_damage_ledger_parity',
    name: 'C02: Ledger Attire-Damage Persistence (tattered_cuff / Wardrobe State)',
    passed: c02Fails.length === 0,
    failingScenes: c02Fails,
    details: c02Fails.length === 0 ? 'All active attire_damage windows preserved verbatim across scene prompts.' : `Missing active attire_damage DNA (${c02Fails.join(', ')})`
  },
  {
    id: 'C03_non_wielder_unarmed_lock',
    name: 'C03: Weapon Non-Wielder Unarmed Isolation Lock',
    passed: c03Fails.length === 0,
    failingScenes: c03Fails,
    details: c03Fails.length === 0 ? 'All non-wielding characters carry explicit empty-hand / zero-sword locks.' : `Non-wielder missing unarmed lock (${c03Fails.join(', ')})`
  },
  {
    id: 'C04_bare_hand_action_parity',
    name: 'C04: Action-Layer Glove / Bare-Hand Parity Guard',
    passed: c04Fails.length === 0,
    failingScenes: c04Fails,
    details: c04Fails.length === 0 ? 'Zero gloved/gauntlet contradictions on bare-handed characters.' : `Bare-hand vs gloved contradiction (${c04Fails.join(', ')})`
  },
  {
    id: 'C05_2d_style_and_no_3d_lock',
    name: 'C05: Uncompressed 2D Manhwa Art Style & Anti-3D CGI Lock',
    passed: c05Fails.length === 0,
    failingScenes: c05Fails,
    details: c05Fails.length === 0 ? '100% of scenes preserve full Layer 1 2D style and anti-3D CGI locks.' : `Stripped 2D style / anti-3D lock (${c05Fails.join(', ')})`
  }
)
report.isProductionReady = report.checks.every(c => c.passed)
report.overallScore = Math.round((report.checks.filter(c => c.passed).length / report.checks.length) * 100)
for (const s of [...c01Fails, ...c02Fails, ...c03Fails, ...c04Fails, ...c05Fails].map(x => x.split(' ')[0])) {
  if (!report.failingScenes.includes(s)) report.failingScenes.push(s)
}

if (process.argv.includes('--update-manifest') && report.expectedManifest) {
  fs.writeFileSync(path.join(epPath, 'dispatch_manifest.json'), JSON.stringify(report.expectedManifest, null, 2), 'utf-8')
  if (!jsonOnly) {
    console.log(`[MANIFEST] Updated dispatch_manifest.json with signature: ${report.expectedManifest.signature}`)
  }
  const d01Check = report.checks.find(c => c.id === 'D01_dispatch_manifest_lock')
  if (d01Check && !d01Check.passed) {
    d01Check.passed = true
    d01Check.failingScenes = []
    report.isProductionReady = report.checks.every(c => c.passed)
    const passedCount = report.checks.filter(c => c.passed).length
    report.overallScore = Math.round((passedCount / report.checks.length) * 100)
  }
}

if (jsonOnly) {
  console.log(
    JSON.stringify(
      {
        franchiseId,
        episodeId,
        overallScore: report.overallScore,
        isProductionReady: report.isProductionReady,
        gateCount: report.checks.length,
        manifestSignature: manifest?.signature || null,
        failingGates: report.checks
          .filter(c => !c.passed)
          .map(c => ({ id: c.id, failingScenes: c.failingScenes }))
      },
      null,
      2
    )
  )
  process.exit(report.isProductionReady ? 0 : 1)
}

console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO — UNIVERSAL ALLOW-LIST PRE-FLIGHT LINTER (v2.0)')
console.log('='.repeat(78))
console.log(`Franchise : ${franchiseId}`)
console.log(`Episode   : ${episodeId}`)
console.log(`Scenes    : ${report.totalScenes} (Script: ${report.scriptScenesCount})`)
console.log(`Score     : ${report.overallScore}/100 (${report.checks.length} Gates Audited)`)
console.log(`Manifest  : ${manifest?.signature || 'UNSIGNED (Run compile-matrix.js)'}`)
console.log('-'.repeat(78))

report.checks.forEach((chk, idx) => {
  const badge = chk.passed ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m'
  console.log(`${String(idx + 1).padStart(2, '0')}. ${badge} ${chk.name}`)
  if (!chk.passed) {
    console.log(`    ↳ ${chk.details}`)
  }
})

console.log('='.repeat(78))
if (!report.isProductionReady) {
  console.error(
    `\x1b[31m[FIREWALL LOCKED]\x1b[0m Failing Scene IDs: ${report.failingScenes.join(', ')}`
  )
  process.exit(1)
} else {
  console.log(
    `\x1b[32m[APPROVED]\x1b[0m All ${report.checks.length} Pre-Flight Gates Passed. Ready for Google Flow.`
  )
  process.exit(0)
}
