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
const c06Fails = []
const c07Fails = []
const c08Fails = []
const c09Fails = []
const c10Fails = []
const c11Fails = []
const c12Fails = []
let prevCalmWeaponElev = null
let prevCalmZone = null
let prevZoneForPingPong = null
let zoneTransitionCount = 0

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
        if (blockMatch && !/\bgripping\b|\bholding\b|\bwielding\b|\bresting\b/i.test(blockMatch[1])) {
          c03Fails.push(`${sId} (${ent.id} missing wielder hand-grip lock)`)
        }
      }
    }
  }

  // C05: Complete 2D Manhwa Style & Anti-3D CGI Lock (Never Stripped by Token Compactors)
  if (!/manhwa webtoon art style/i.test(promptText) || !/no photorealistic 3d cgi/i.test(promptText)) {
    c05Fails.push(`${sId} (missing ${!/manhwa webtoon art style/i.test(promptText) ? '2D manhwa style' : 'no photorealistic 3D CGI'})`)
  }

  // C06: Common-Sense Weapon Grip & Scale Parity (Prevent 1-handed grip on two-handed/heavy props)
  const twoHandedItemRe = /\b(?:two-handed|two handed|greatsword|greatblade|greataxe|halberd|polearm|scythe|longbow|colossal|massive)\b/i
  const hasTwoHandedProp = itemRefs.some(ref => {
    const ent = Object.values(entities).find(e => e.name?.toLowerCase() === ref.toLowerCase())
    const blob = `${ref} ${ent?.grip_style || ''} ${ent?.dna || ''} ${ent?.visual_dna || ''}`
    return twoHandedItemRe.test(blob)
  })
  if (hasTwoHandedProp && /\b(?:firmly in right hand|one-handed|single-handed)\b/i.test(`${rawAct} ${promptText}`)) {
    c06Fails.push(`${sId} (two-handed/heavy prop paired with one-handed "in right hand" grip)`)
  }

  // C07: Zero Negative-Action Bleed in <action_layer> (Prevents image models drawing negated poses)
  const negBleedMatch = rawAct.match(/\b(?:without\s+(?:raising|drawing|swinging|lifting|attacking|holding|striking|moving)|instead\s+of\s+(?:raising|drawing|swinging|attacking)|never\s+(?:raising|drawing)|not\s+(?:raising|drawing|swinging))\b/i)
  if (negBleedMatch) {
    c07Fails.push(`${sId} (negative-action bleed "${negBleedMatch[0]}" in action_layer)`)
  }

  // C08: Dialogue Posture Continuity & Anti-Ping-Pong Guard
  const narrMatch = m[0].match(/<narrative_sync>([\s\S]*?)<\/narrative_sync>/i)
  const narrText = narrMatch ? narrMatch[1].trim() : ''
  const zoneMatch = m[0].match(/zone="([^"]+)"/i)
  const sceneZone = zoneMatch ? zoneMatch[1].toLowerCase() : ''
  const isCalmNarrative = /\b(?:didn't raise|held (?:his|her) ground|whispered|answered|said quietly|stayed bowed|kneeling|spoke softly|looked down)\b/i.test(narrText)
  const hasUnsolicitedCombatAction = /\b(?:cleaving horizontally|lunging forward|slashing wildly|charging ahead|swinging down)\b/i.test(rawAct)
  if (isCalmNarrative && hasUnsolicitedCombatAction) {
    c08Fails.push(`${sId} (unsolicited combat swing in action_layer during calm dialogue)`)
  }
  if (isCalmNarrative && itemRefs.length > 0 && sceneZone === prevCalmZone) {
    const elev = /\b(?:lifting|raising|raised|pointing upward)\b/i.test(rawAct)
      ? 'high'
      : (/\b(?:resting|lowered|downward|at (?:his|her) side)\b/i.test(rawAct) ? 'low' : null)
    if (elev && prevCalmWeaponElev && elev !== prevCalmWeaponElev) {
      c08Fails.push(`${sId} (weapon posture flip ${prevCalmWeaponElev} -> ${elev} during consecutive dialogue)`)
    }
    prevCalmWeaponElev = elev
  } else {
    prevCalmWeaponElev = null
  }
  prevCalmZone = sceneZone

  // C09: Handheld Non-Weapon Prop Ownership & Mention Lock (Zero leaked/floating/swapped props)
  const handheldItemEnts = itemRefs
    .map(ref => Object.values(entities).find(e =>
      e.kind === 'item' &&
      ((e.name && e.name.toLowerCase() === ref.toLowerCase()) ||
       (e.token && e.token.replace(/^@\{|\}$/g, '').toLowerCase() === ref.toLowerCase()))
    ))
    .filter(e => e && e.placement === 'handheld' && !/\b(?:rapier|sword|greatsword|greatblade|greataxe|blade|staff|wand|dagger|spear|bow|longbow|axe|halberd|polearm|scythe|lance|hammer)\b/i.test(e.name || e.token || ''))
  for (const hEnt of handheldItemEnts) {
    const cleanPropName = (hEnt.name || hEnt.token?.replace(/^@\{|\}$/g, '') || '').trim()
    const terms = [cleanPropName, ...(hEnt.aliases || []), 'meter', 'sensor', 'device', 'sphere', 'astrolabe', 'chip'].filter(Boolean)
    const isMentioned = terms.some(t => {
      const esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`\\b${esc}\\b`, 'i').test(`${narrText} ${rawAct}`)
    })
    if (!isMentioned) {
      c09Fails.push(`${sId} (leaked unmentioned handheld prop "${cleanPropName}")`)
      continue
    }
    const propActiveInMultiChar = charRefs.length >= 2 && /\b(?:holding|gripping|clutching|carrying|raising|raised|lowering|lowered|steadying|lifting|extending|tapping|scanning|examining)\b/i.test(rawAct)
    if (propActiveInMultiChar && !/held exclusively by @\{/i.test(promptText) && !/holding @\{/i.test(promptText)) {
      c09Fails.push(`${sId} (multi-character scene lacks explicit owner lock for "${cleanPropName}")`)
    }
  }

  // C10: Broken/Split Prop State Variant Parity (Ban intact plate reuse on split/broken props)
  const isStructurallyBroken = /\b(?:split open|broken open|shattered in half|snapped in half|gutted|torn apart|smashed casing|parted along seams)\b/i.test(`${narrText} ${rawAct}`)
  if (isStructurallyBroken) {
    for (const ref of itemRefs) {
      const ent = Object.values(entities).find(e =>
        e.kind === 'item' &&
        ((e.name && e.name.toLowerCase() === ref.toLowerCase()) ||
         (e.token && e.token.replace(/^@\{|\}$/g, '').toLowerCase() === ref.toLowerCase()))
      )
      if (ent && ent.placement === 'handheld') {
        const variantText = `${ent.id || ''} ${ent.name || ''} ${ent.dna || ''} ${ent.visual_dna || ''}`
        if (!/\b(?:split|broken|shattered|cracked|damaged|gutted|ruined)\b/i.test(variantText) && /identical unchanging prop geometry/i.test(promptText)) {
          c10Fails.push(`${sId} (split/broken prop "${ref}" still uses intact reference plate)`)
        }
      }
    }
  }

  // C11: Outdoor Night-Plate vs. Daylight Conflict & Zone Ping-Pong Ceiling
  if (prevZoneForPingPong && prevZoneForPingPong !== sceneZone) {
    zoneTransitionCount++
  }
  prevZoneForPingPong = sceneZone
  const zoneObj = zones[sceneZone] || Object.values(zones).find(z => z.id?.toLowerCase() === sceneZone)
  if (zoneObj && /^(?:night_floodlit|night_celestial)$/i.test(zoneObj.lighting || '') && /illuminated by bright morning sunlight/i.test(promptText)) {
    c11Fails.push(`${sId} (outdoor night zone "${sceneZone}" conflicts with daylight prompt)`)
  }

  // C12: Unsolicited Combat Stance Guard (Ban battle stances during calm conversation/transit)
  const hasCombatOrAlert = /\b(?:attack|strike|slash|lunge|brace|braced|combat|battle|fight|clash|defend|defensive|alert|draw|drew|guard|intercept|shockwave|gale|threat|roar|explosion|erupt|pressure|aura|barrier|shield|crouch|ready|hostile|ambush)\b/i.test(`${narrText} ${rawAct}`)
  const hasBattleStanceInPrompt = /\b(?:martial stance|fighting stance|combat stance|fists raised|lunging forward|defensive guard posture|ready to strike)\b/i.test(promptText)
  if (!hasCombatOrAlert && hasBattleStanceInPrompt) {
    c12Fails.push(`${sId} (battle/martial stance injected during calm non-combat scene)`)
  }
}

const maxAllowedZoneTransitions = sceneBlocks.length >= 48 ? Math.max(24, Math.ceil(sceneBlocks.length * 0.20)) : 999
if (zoneTransitionCount > maxAllowedZoneTransitions) {
  c11Fails.push(`EPISODE_PING_PONG (${zoneTransitionCount} zone transitions across ${sceneBlocks.length} scenes exceeds ceiling of ${maxAllowedZoneTransitions})`)
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
  },
  {
    id: 'C06_weapon_grip_scale_parity',
    name: 'C06: Common-Sense Weapon Scale & Hand-Grip Parity',
    passed: c06Fails.length === 0,
    failingScenes: c06Fails,
    details: c06Fails.length === 0 ? 'All two-handed and heavy weapons preserve two-handed or resting grip wording.' : `Grip/scale mismatch (${c06Fails.join(', ')})`
  },
  {
    id: 'C07_no_negative_action_bleed',
    name: 'C07: Zero Negative-Verb Narrative Bleed in <action_layer>',
    passed: c07Fails.length === 0,
    failingScenes: c07Fails,
    details: c07Fails.length === 0 ? 'All action layers describe positive physical poses without negated action verbs.' : `Negative-verb bleed (${c07Fails.join(', ')})`
  },
  {
    id: 'C08_dialogue_posture_continuity',
    name: 'C08: Dialogue Posture Continuity & Anti-Ping-Pong Guard',
    passed: c08Fails.length === 0,
    failingScenes: c08Fails,
    details: c08Fails.length === 0 ? 'Dialogue scenes maintain consistent weapon posture without action-to-standing flips.' : `Posture drift/mismatch (${c08Fails.join(', ')})`
  },
  {
    id: 'C09_handheld_prop_owner_lock',
    name: 'C09: Handheld Prop Mention & Multi-Character Owner Lock',
    passed: c09Fails.length === 0,
    failingScenes: c09Fails,
    details: c09Fails.length === 0 ? 'All handheld props are actively mentioned and locked to a single named owner in multi-character scenes.' : `Unmentioned or unowned handheld prop (${c09Fails.join(', ')})`
  },
  {
    id: 'C10_damaged_prop_plate_purity',
    name: 'C10: Broken/Split Prop Dedicated Variant Plate Purity',
    passed: c10Fails.length === 0,
    failingScenes: c10Fails,
    details: c10Fails.length === 0 ? 'All split/broken props bind dedicated damaged/split variant plates.' : `Broken prop using intact plate (${c10Fails.join(', ')})`
  },
  {
    id: 'C11_zone_lighting_plate_parity',
    name: 'C11: Zone Day/Night Plate Parity & Anti-Ping-Pong Ceiling',
    passed: c11Fails.length === 0,
    failingScenes: c11Fails,
    details: c11Fails.length === 0 ? `Day/night zone plates aligned and zone transitions (${zoneTransitionCount}) within ceiling (${maxAllowedZoneTransitions}).` : `Zone lighting conflict or excessive transitions (${c11Fails.join(', ')})`
  },
  {
    id: 'C12_unsolicited_combat_posture_guard',
    name: 'C12: Unsolicited Combat/Martial Stance Guard on Calm Scenes',
    passed: c12Fails.length === 0,
    failingScenes: c12Fails,
    details: c12Fails.length === 0 ? 'Zero unsolicited battle/martial stances in calm dialogue or transit scenes.' : `Unsolicited battle stance detected (${c12Fails.join(', ')})`
  }
)
report.isProductionReady = report.checks.every(c => c.passed)
report.overallScore = Math.round((report.checks.filter(c => c.passed).length / report.checks.length) * 100)
for (const s of [...c01Fails, ...c02Fails, ...c03Fails, ...c04Fails, ...c05Fails, ...c06Fails, ...c07Fails, ...c08Fails, ...c09Fails, ...c10Fails, ...c11Fails, ...c12Fails].map(x => x.split(' ')[0])) {
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
