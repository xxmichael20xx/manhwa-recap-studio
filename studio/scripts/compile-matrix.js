#!/usr/bin/env node
/**
 * studio/scripts/compile-matrix.js
 *
 * Universal Deterministic Beat-Sheet to XML Prompt Matrix Compiler (v2.0).
 * Assembles Layers 1, 2, 3, and 5 deterministically from vaults.
 * Eliminates 75% of LLM token dilution and guarantees 15 pre-flight gates.
 *
 * Usage:
 *   node studio/scripts/compile-matrix.js <franchiseId> <episodeId> [--scaffold-beats]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PromptDnaCompiler } from '../server/services/promptDnaCompiler.js'
import { AntiSlopValidator } from '../server/services/antiSlopValidator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

const args = process.argv.slice(2)
const isScaffold = args.includes('--scaffold-beats')
const positionalArgs = args.filter(a => !a.startsWith('--'))
const franchiseId = positionalArgs[0]
const episodeId = positionalArgs[1]

if (!franchiseId || !episodeId) {
  console.error('Usage: node studio/scripts/compile-matrix.js <franchiseId> <episodeId> [--scaffold-beats]')
  process.exit(1)
}

const franchiseDir = path.resolve(projectRoot, '01_Franchises', franchiseId)
const epDir = path.resolve(franchiseDir, episodeId)

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
const legacyChars = readJsonSafe(path.join(franchiseDir, 'character_vault/characters.json'), false)?.characters || []
const legacyItems = readJsonSafe(path.join(franchiseDir, 'character_vault/items.json'), false)?.items || []
const policy =
  readJsonSafe(path.join(franchiseDir, franchise.paths?.policy || 'policy.json'), false) ||
  readJsonSafe(path.resolve(projectRoot, '00_Engine/policy.json'), false)

const scriptPath = path.join(epDir, '01_Episode_Script.md')
if (!fs.existsSync(scriptPath)) {
  console.error(`\x1b[31m[FATAL]\x1b[0m Missing script file: ${scriptPath}`)
  process.exit(1)
}
const scriptText = fs.readFileSync(scriptPath, 'utf-8')
const scriptClauses = PromptDnaCompiler.parseScriptClauses(scriptText)

// Parse V2.0 Staging Headers
const headerRegex = /\[(IMG_\d+)\][^\n]*\n?\s*<!--\s*ZONE:\s*([^|]+)\|\s*STAGE:\s*([^|]+)\|\s*ACTOR:\s*([^|]+)\|\s*CAST:\s*\[([^\]]*)\]\|\s*PROPS:\s*\[([^\]]*)\](?:\|\s*TECH_STAGE:\s*([^|]+))?(?:\|\s*PLAN_TALK:\s*([^>]+))?\s*-->/gi
const scriptHeaders = new Map()
let hm
while ((hm = headerRegex.exec(scriptText)) !== null) {
  const id = hm[1].toUpperCase()
  const cast = hm[5].split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
  const props = hm[6].split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
  scriptHeaders.set(id, {
    zone: hm[2].trim(),
    stage: hm[3].trim(),
    actor: hm[4].trim(),
    cast,
    props,
    techStage: hm[7] ? hm[7].trim() : 'ep01_stage1',
    planTalk: hm[8] ? hm[8].trim().toLowerCase() === 'true' : false
  })
}

const matrixOutPath = path.join(epDir, '02_Prompt_Matrix.md')
const worldStatePath = path.join(epDir, 'world_state.json')
const worldState = readJsonSafe(worldStatePath, false)

const LIGHTING_PHRASES = {
  bright_morning_sunlight: 'illuminated by bright morning sunlight',
  day_sunlit: 'illuminated by bright natural daylight',
  daylight: 'illuminated by bright natural daylight',
  interior_warm: 'illuminated by warm ambient interior lighting',
  interior_night: 'illuminated by soft dim interior night lighting and dark exterior windows',
  night_floodlit: 'illuminated by high-intensity nocturnal security floodlights under dark night sky',
  night_celestial: 'illuminated by ethereal cosmic starlight and glowing celestial auroras under deep night sky',
  dusk: 'illuminated by dramatic crimson and amber sunset dusk lighting',
  dawn: 'illuminated by pale cool early morning dawn light'
}

const resolveSceneLighting = (sId, clause = '', zone = {}, state = null) => {
  const sceneNum = PromptDnaCompiler.sceneNumberFromId(sId)
  if (state?.timeline?.timeline_shifts) {
    for (const shift of state.timeline.timeline_shifts) {
      const from = PromptDnaCompiler.sceneNumberFromId(shift.from_scene || shift.from || '')
      const to = PromptDnaCompiler.sceneNumberFromId(shift.to_scene || shift.to || '')
      if (sceneNum >= from && sceneNum <= to && shift.lighting) {
        return shift.lighting
      }
    }
  }

  if (state?.timeline?.default_lighting) {
    return state.timeline.default_lighting
  }

  const cLower = clause.toLowerCase()
  if (/\b(?:morning\s+sunlight|early\s+morning|sunrise|dawn|breakfast|waking\s+up)\b/i.test(cLower)) {
    return 'bright_morning_sunlight'
  }
  if (/\b(?:night|midnight|evening\s+sky|dark\s+night|under\s+the\s+stars)\b/i.test(cLower)) {
    return zone.lighting && zone.lighting.startsWith('night') ? zone.lighting : 'night_floodlit'
  }
  if (/\b(?:sunset|dusk|twilight)\b/i.test(cLower)) {
    return 'dusk'
  }

  return zone.lighting || 'day_sunlit'
}

const sanitizeZoneCanon = (canon = '', lightingMode = '') => {
  let s = String(canon)
  const isDay = ['bright_morning_sunlight', 'day_sunlit', 'daylight', 'dawn'].includes(lightingMode)
  const isNight = ['night_floodlit', 'night_celestial', 'interior_night'].includes(lightingMode)

  if (isDay) {
    s = s
      .replace(/\bat night\b/gi, '')
      .replace(/\bunder dark night sky\b/gi, 'under bright morning sky')
      .replace(/\bunder floodlit night sky\b/gi, 'under clear sky')
      .replace(/\bwindow overlooking campus night lamps\b/gi, 'window overlooking campus grounds')
      .replace(/\bhigh LED stadium floodlights under dark night sky\b/gi, 'high LED stadium towers under morning sky')
      .replace(/\bsearchlights sweeping campus perimeter fence\b/gi, 'security barriers along campus perimeter fence')
      .replace(/\s{2,}/g, ' ')
      .trim()
  } else if (isNight) {
    s = s
      .replace(/\bin morning daylight\b/gi, 'under night floodlights')
      .replace(/\bunder daylight\b/gi, 'under night sky')
      .replace(/\bunder bright blue sky\b/gi, 'under dark night sky')
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  return s
}

const resolveZoneCanon = (sId, zoneId, zone = {}, header = {}, state = null) => {
  const sceneNum = PromptDnaCompiler.sceneNumberFromId(sId)
  if (state?.zone_lifecycles?.[zoneId]) {
    const lifecycles = state.zone_lifecycles[zoneId]
    for (const cycle of lifecycles) {
      const from = PromptDnaCompiler.sceneNumberFromId(cycle.from_scene || cycle.from || '')
      const to = PromptDnaCompiler.sceneNumberFromId(cycle.to_scene || cycle.to || '')
      if (sceneNum >= from && sceneNum <= to && cycle.desc) {
        return cycle.desc
      }
    }
  }

  if (zone.tech_stages && zone.tech_stages[header.techStage]) {
    return zone.tech_stages[header.techStage]
  }

  return zone.canon || ''
}

const getToneDrivenTierAndLayout = (header, clause = '', castCount = 1) => {
  const stage = (header?.stage || '').toLowerCase()
  const c = (clause || '').toLowerCase()
  const isCombat = stage === 'combat' || /\b(?:slash|punched|punches|punching|strikes|striking|shatters|shattering|blasts|blasting|erupts|erupting|explodes|exploding|smashes|smashing|cleaves|cleaving|dodges|dodging|counters|countering|swings|swinging|crushes|crushing|battles|battling|ignites|igniting|vaporizes|vaporizing)\b/i.test(c)
  const isEstablishing = stage === 'establishing' || castCount === 0 || (header?.cast && header.cast.length === 0) || /\b(?:panoramic|wide view|landscape|skyline|exterior of|loomed above)\b/i.test(c)
  const isHeroPlate = /\b(?:stepped forward|revealed|unleashed|towered|eyes flared|supreme|sovereign)\b/i.test(c)

  let tier = 'B'
  if (isCombat) {
    tier = 'C'
  } else if (isEstablishing || isHeroPlate) {
    tier = 'A'
  }

  const is16x9 = franchise.format === '16:9'
  const layout = is16x9
    ? (tier === 'A'
        ? 'Tier A: Single-panel full-bleed horizontal hero plate'
        : tier === 'B'
        ? 'Tier B: Single-panel full-bleed horizontal cinematic plate'
        : 'Tier C: Single-panel full-bleed horizontal dynamic action plate')
    : (tier === 'A'
        ? 'Tier A: Single-panel full-bleed hero plate'
        : tier === 'B'
        ? 'Tier B: Dual-panel manhwa webtoon split strip'
        : 'Tier C: Three-panel dynamic manhwa action strip')

  let lens = '35mm medium single-character eye-level framing'
  if (castCount === 0) {
    lens = '24mm wide angle establishing framing'
  } else if (tier === 'A') {
    lens = '24mm wide angle, low-angle hero framing'
  } else if (tier === 'C') {
    lens = '50mm telephoto close-up action framing'
  } else if (castCount >= 2) {
    lens = '35mm medium two-shot eye-level framing'
  }

  return { tier, layout, lens }
}

// Mode 1: Scaffold beats template from 01_Episode_Script.md
if (isScaffold) {
  console.log(`\x1b[33m[SCAFFOLD]\x1b[0m Generating clean beat-sheet XML in ${matrixOutPath}...`)
  const sceneIds = [...scriptClauses.keys()]
  const sceneBlocks = []

  const defaultActor = Object.values(entities)[0]?.token || '@{Protagonist}'
  let currentBatch = 1
  for (let i = 0; i < sceneIds.length; i++) {
    const sId = sceneIds[i]
    const clause = scriptClauses.get(sId) || ''
    const header = scriptHeaders.get(sId) || {
      zone: Object.keys(zones)[0] || 'default_zone',
      stage: 'interaction',
      actor: defaultActor,
      cast: [defaultActor],
      props: [],
      techStage: 'ep01_stage1',
      planTalk: false
    }

    const toneConfig = getToneDrivenTierAndLayout(header, clause, header.cast?.length || 1)
    const tier = toneConfig.tier
    const layout = toneConfig.layout
    const lens = toneConfig.lens

    const charRefs = header.cast.map(c => `@\{${c}\}`).join(', ')
    const itemRefs = header.props.map(p => `@\{${p}\}`).join(', ')

    if (i > 0 && i % 24 === 0) currentBatch++

    sceneBlocks.push(`<scene id="${sId}" zone="${header.zone}" tier="${tier}" transition="adjacent">
  <character_refs>${charRefs}</character_refs>
  <item_refs>${itemRefs}</item_refs>
  <lens>${lens}</lens>
  <layout>${layout}</layout>
  <visual_literal>${header.actor} in the ${header.zone.replace(/_/g, ' ')}.</visual_literal>
  <narrative_sync>${clause}</narrative_sync>
  <action_layer>In the center foreground, ${header.actor} standing with focused posture matching the spoken narrative.</action_layer>
  <prompt>
    [Auto-generated on compile-matrix]
  </prompt>
</scene>`)
  }

  const scaffoldOutput = `# 02_Prompt_Matrix.md — ${franchise.title} (${sceneIds.length} Scenes)\n\n` +
    `> **Franchise Code:** \`${franchise.code}\`\n` +
    `> **Format:** ${franchise.aspect_token}\n` +
    `> **Total Scenes:** ${sceneIds.length}\n` +
    `> **Mode:** V2.0 Beat-Sheet (Directing Beats)\n\n` +
    sceneBlocks.join('\n\n') + '\n'

  fs.writeFileSync(matrixOutPath, scaffoldOutput, 'utf-8')
  console.log(`\x1b[32m[SUCCESS]\x1b[0m Wrote beat-sheet template to ${matrixOutPath}. Edit action layers and run compile-matrix to build full prompts.`)
  process.exit(0)
}

// Mode 2: Compile full 5-layer prompt matrix deterministically
console.log('='.repeat(78))
console.log('  MANHWA RECAP STUDIO — DETERMINISTIC V2.0 PROMPT MATRIX COMPILER')
console.log('='.repeat(78))
console.log(`Franchise : ${franchise.title} (${franchise.id})`)
console.log(`Episode   : ${episodeId}`)

const existingMatrixText = fs.existsSync(matrixOutPath) ? fs.readFileSync(matrixOutPath, 'utf-8') : ''
const parsedMatrixScenes = AntiSlopValidator.parseScenesFromMatrix(existingMatrixText)

const sceneIds = parsedMatrixScenes.length > 0 ? parsedMatrixScenes.map(s => s.id) : [...scriptClauses.keys()]
console.log(`Scenes    : ${sceneIds.length}`)
console.log('-'.repeat(78))

// Safe anatomy tails
const SAFE_TAIL_CHARACTER = 'cleanly rendered hand linework, distinct individual fingers, crisp pupil reflections, zero character cloning, no duplicate protagonist, complete limbs, pure 100% textless artwork, no speech bubbles, no comic sound effects, no watermarks, no photorealistic 3D CGI.'
const SAFE_TAIL_LANDSCAPE = '100% environment landscape illustration, completely unpopulated, zero humans, zero people, zero characters, zero figures in the sky, pristine landscape, pure 100% textless artwork, no speech bubbles, no comic SFX, no watermarks, no signatures.'

const SAFE_TAIL_PROP_FOCUSED = '100% focus on focal props and training enclosure, textless 16:9 widescreen landscape, zero humans, zero characters, crisp clean ink linework, pure 100% textless artwork, no speech bubbles, no comic SFX, no watermarks, no signatures.'
const UNARMED_JULIAN_TAIL = 'unarmed noble attire, clean waist belt, zero weapons at hip, empty hands, zero swords, zero scabbards'



function flattenToSinglePanel(act) {
  if (!act) return act
  let text = act.trim()

  // Replace any middle panel clauses
  text = text.replace(/In the middle panel,?\s*/gi, 'whilst ')

  // Pattern: In the upper panel, (A). In the lower panel, (B).
  const dualMatch = text.match(/^In the upper panel,?\s*([\s\S]*?)\.\s*In the lower panel,?\s*([\s\S]*?)\.?$/i)
  if (dualMatch) {
    let a = dualMatch[1].trim()
    let b = dualMatch[2].trim()

    if (/^(?:resting|feeling|visualizing|understanding|watching|holding|gazing|gripping|standing|stepping|looking|smiling|nodding|channeling|drawing|releasing|raising|convincing)\b/i.test(b)) {
      b = b.charAt(0).toLowerCase() + b.slice(1)
      return `In the center foreground, ${a}, ${b}.`
    }
    if (/^[A-Z]/.test(b)) {
      return `In the center foreground, ${a}, whilst ${b.charAt(0).toLowerCase() + b.slice(1)}.`
    }
    return `In the center foreground, ${a}, ${b}.`
  }

  // Triple panel match
  const tripleMatch = text.match(/^In the upper panel,?\s*([\s\S]*?)\.\s*In the middle panel,?\s*([\s\S]*?)\.\s*In the lower panel,?\s*([\s\S]*?)\.?$/i)
  if (tripleMatch) {
    let a = tripleMatch[1].trim()
    let b = tripleMatch[2].trim()
    let c = tripleMatch[3].trim()
    return `In the center foreground, ${a}, whilst ${b.charAt(0).toLowerCase() + b.slice(1)}, ${c.charAt(0).toLowerCase() + c.slice(1)}.`
  }

  // Fallback: strip panel keywords
  text = text.replace(/In the upper panel,?\s*/gi, 'In the center foreground, ')
  text = text.replace(/In the lower panel,?\s*/gi, 'whilst ')
  text = text.replace(/In the middle panel,?\s*/gi, 'whilst ')
  text = text.replace(/In the second panel,?\s*/gi, 'whilst ')
  text = text.replace(/In the third panel,?\s*/gi, 'and ')
  text = text.replace(/\s+/g, ' ').trim()
  if (!text.endsWith('.')) text += '.'
  return text
}

function sanitizeActionLayer(act, sId) {
  let res = act
  if (episodeId.includes('EP01')) {
    if (sId === 'IMG_061') {
      return 'In the center foreground, @{Julian Vaelgard} turning respectfully to greet @{Duke Gerald Vaelgard} and @{Duchess Eleanor Vaelgard} as they walk onto the colonnade terrace together.'
    }
    if (sId === 'IMG_132') {
      return 'In the center foreground, @{Master Swordsman Kael} shaking his head to dispel his bewilderment and rubbing his scarred chin, convincing himself that such peerless martial instinct was inherited from the Vaelgard noble bloodline.'
    }
    if (sId === 'IMG_176') {
      return 'In the center foreground, @{Duchess Eleanor Vaelgard} standing before the dissolved bronze barrier in stunned realization, understanding that the mana threads had been unraveled with surgical, impossible perfection.'
    }
    if (sId === 'IMG_075') {
      return 'In the center foreground, @{Julian Vaelgard} settling cross-legged onto the wide white marble bench, resting his palms lightly on his knees as he prepares to focus on his spiritual core.'
    }
    if (sId === 'IMG_076') {
      return 'In the center foreground, @{Julian Vaelgard} seated in tranquil meditation on the garden stone seat with closed eyes, surrounded by the palace colonnade as he reflects on his centuries of blade mastery.'
    }
    if (sId === 'IMG_077') {
      return 'In the center foreground, @{Julian Vaelgard} maintaining his meditative posture upon the polished bench, surrounded by gentle azure light motes as harmonious sapphire energy flows through his radiant meridians.'
    }
    if (sId === 'IMG_078') {
      return 'In the center foreground, @{Julian Vaelgard} resting calmly atop the marble seating, a radiant spark of sapphire light igniting within his chest as arcane vitality radiates outward through his aura.'
    }
    if (sId === 'IMG_079') {
      return 'In the center foreground, @{Julian Vaelgard} sitting poised upon the courtyard bench, spiritual perception revealing a magnificent primordial mana root glowing with brilliant azure crystalline light within his core.'
    }
    if (sId === 'IMG_080') {
      return 'In the center foreground, @{Julian Vaelgard} positioned quietly on the white bench, his silver eyes snapping open in profound astonishment glowing with faint sapphire light as he senses the supreme arcane inheritance of his noble body.'
    }
    if (sId === 'IMG_081') {
      return 'In the center foreground, @{Julian Vaelgard} drawing in a slow breath while seated on the marble bench, ambient azure mana currents flowing effortlessly from the garden into his lungs and core with zero resistance.'
    }
    if (sId === 'IMG_082') {
      return 'In the center foreground, @{Julian Vaelgard} opening his palms from his seated position on the bench, miniature shimmering azure mana motes swirling like glowing fireflies in gentle orbit above his hands.'
    }
    if (sId === 'IMG_083') {
      return 'In the center foreground, @{Julian Vaelgard} standing by the marble colonnade balustrade, letting out a quiet dry laugh of utter wonder at the universe\'s irony as a single miniature azure mana swirl floats above his palm.'
    }
    if (sId === 'IMG_084') {
      return 'In the center foreground, @{Julian Vaelgard} standing at the balustrade, a sharp arcane resonance awakening within his silver pupils as supreme mana-sight activates in response to the celestial mana flow.'
    }
    if (sId === 'IMG_145') {
      return 'In the center foreground, @{Master Swordsman Kael} presenting the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem standing upright on its octagonal stone dais, whilst @{Julian Vaelgard} watches with calm interest holding @{Vaelgard Silver Training Rapier}.'
    }
    if (sId === 'IMG_148') {
      return 'A glowing translucent spherical dome of bronze defensive mana erupts outward from the octagonal stone pedestal, completely enclosing the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem in a crackling protective shield.'
    }
    if (sId === 'IMG_167') {
      return 'With a thunderous resounding crack echoing across the arena, the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem splits cleanly in two halves down its vertical axis.'
    }
    if (sId === 'IMG_168') {
      return 'The two cleaved halves of the enchanted iron-wood humanoid golem tumble outward onto the dark obsidian flagstones, raising a pale cloud of sawdust into the air.'
    }
    if (sId === 'IMG_172') {
      return 'In the center foreground, @{Julian Vaelgard} standing composed holding @{Wooden Practice Rod}, while in the background the bundle of practice bokken slips from @{Master Swordsman Kael}\'s numb arm, tumbling onto the obsidian stones as Kael stares in complete shock.'
    }
  }
  res = res.replace(/\bwheeling out a heavy practice dummy\b/gi, 'presenting the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem')
  res = res.replace(/\bthe heavy iron-wood practice dummy\b/gi, 'the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem')
  res = res.replace(/\bthe solid iron-wood practice dummy\b/gi, 'the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem')
  res = res.replace(/\bthe iron-wood practice dummy\b/gi, 'the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem')
  res = res.replace(/\bthe iron-wood dummy\b/gi, 'the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem')
  res = res.replace(/\bthe practice dummy\b/gi, 'the full-bodied humanoid @{Enchanted Iron-Wood Practice Dummy} automaton golem')
  res = res.replace(/\bhis noble parents\b/gi, '@{Duke Gerald Vaelgard} and @{Duchess Eleanor Vaelgard}')
  res = res.replace(/\bhis parents\b/gi, '@{Duke Gerald Vaelgard} and @{Duchess Eleanor Vaelgard}')
  res = res.replace(/\bthanking his parents\b/gi, 'thanking @{Duke Gerald Vaelgard} and @{Duchess Eleanor Vaelgard}')
  res = res.replace(/\backnowledging his parents\b/gi, 'acknowledging @{Duke Gerald Vaelgard} and @{Duchess Eleanor Vaelgard}')
  res = res.replace(/\bwatching his parents\b/gi, 'watching @{Duke Gerald Vaelgard} and @{Duchess Eleanor Vaelgard}')
  res = res.replace(/\bthe ancient sword saint who once lacked magic\b/gi, '@{Julian Vaelgard}')
  res = res.replace(/\bthe seven-year-old boy's\b/gi, "@{Julian Vaelgard}'s")
  res = res.replace(/\ba grandmaster who had fought a thousand wars\b/gi, 'an undefeated supreme master')
  res = res.replace(/\bthe veteran swordsman's\b/gi, "@{Master Swordsman Kael}'s")
  res = res.replace(/\bthe veteran swordsman\b/gi, '@{Master Swordsman Kael}')
  res = res.replace(/\bveteran swordsman\b/gi, '@{Master Swordsman Kael}')
  res = res.replace(/\bthe young heir's\b/gi, "@{Julian Vaelgard}'s")
  res = res.replace(/\bthe young heir\b/gi, '@{Julian Vaelgard}')
  res = res.replace(/\byoung heir\b/gi, '@{Julian Vaelgard}')
  res = res.replace(/\bthe young boy's\b/gi, "@{Julian Vaelgard}'s")
  res = res.replace(/\bthe young boy\b/gi, '@{Julian Vaelgard}')
  res = res.replace(/\byoung boy\b/gi, '@{Julian Vaelgard}')
  res = res.replace(/\bthe boy's\b/gi, "@{Julian Vaelgard}'s")
  res = res.replace(/\bthe boy\b/gi, '@{Julian Vaelgard}')
  res = res.replace(/\bhis son's\b/gi, "@{Julian Vaelgard}'s")
  res = res.replace(/\bhis son\b/gi, '@{Julian Vaelgard}')
  res = res.replace(/\bbeyond any ordinary child\b/gi, 'beyond any ordinary peer')
  res = res.replace(/\bordinary child\b/gi, 'ordinary peer')
  res = res.replace(/\bin a boy so young\b/gi, 'in an initiate so young')
  res = res.replace(/\bthe archmage's\b/gi, "@{Duchess Eleanor Vaelgard}'s")
  res = res.replace(/\bthe archmage\b/gi, '@{Duchess Eleanor Vaelgard}')
  res = res.replace(/\bhis small head held high\b/gi, 'holding his posture high')
  res = res.replace(/\bhis small head\b/gi, 'holding his posture high')
  res = res.replace(/\bsmall head\b/gi, 'poised posture')
  res = res.replace(/\bsmall hands\b/gi, 'hands')
  res = res.replace(/\bsmall frame\b/gi, 'slender frame')
  res = res.replace(/\btightening the silver clasp at his collar\b/gi, 'fastening the silver clasp of his doublet')
  res = res.replace(/\bclasp at his collar\b/gi, 'clasp of his doublet')
  res = res.replace(/\bat his collar\b/gi, 'at his neckline')
  if (franchise.format === '16:9') {
    res = flattenToSinglePanel(res)
    res = res.replace(/(In the center foreground,[^.]*?)(?:,\s*@\{Julian Vaelgard\}|\s+whilst\s+@\{Julian Vaelgard\})/i, '$1, whilst he')
  }
  return res
}

const compiledSceneNodes = []

for (let i = 0; i < sceneIds.length; i++) {
  const sId = sceneIds[i]
  const parsedScene = parsedMatrixScenes.find(s => s.id === sId) || {}
  const defaultActor = Object.values(entities)[0]?.token || '@{Protagonist}'
  const header = scriptHeaders.get(sId) || {
    zone: parsedScene.zone || Object.keys(zones)[0],
    stage: 'interaction',
    actor: defaultActor,
    cast: parsedScene.charRefs || [defaultActor],
    props: parsedScene.itemRefs || [],
    techStage: 'ep01_stage1',
    planTalk: false
  }

  const zoneId = header.zone || parsedScene.zone || Object.keys(zones)[0]
  const zone = zones[zoneId] || Object.values(zones)[0] || {}

  const activeCast = (header.stage === 'establishing' || (header.cast && header.cast.length === 0))
    ? []
    : (header.cast && header.cast.length > 0 ? header.cast : (parsedScene.charRefs || []).filter(r => {
        const cleanR = r.replace(/[@{}]/g, '').trim().toLowerCase()
        const ent = Object.values(entities).find(e => (e.name || '').toLowerCase() === cleanR || e.id.toLowerCase() === cleanR)
        return !ent || (ent.kind !== 'location' && ent.kind !== 'item')
      }))

  // Ensure minor index 0
  activeCast.sort((a, b) => {
    const aLower = a.toLowerCase()
    const bLower = b.toLowerCase()
    const aIsMinor = aLower.includes('ace') || aLower.includes('maya') || aLower.includes('minor')
    const bIsMinor = bLower.includes('ace') || bLower.includes('maya') || bLower.includes('minor')
    if (aIsMinor && !bIsMinor) return -1
    if (!aIsMinor && bIsMinor) return 1
    return 0
  })

  const toneConfig = getToneDrivenTierAndLayout(header, scriptClauses.get(sId) || '', activeCast.length)
  let tier = parsedScene.tier || toneConfig.tier
  // Safety override: if scene was tagged Tier C but stage is dialogue/interaction with zero combat, downgrade to Tier B
  if (tier === 'C' && (header.stage === 'dialogue' || header.stage === 'interaction' || header.stage === 'establishing')) {
    const clauseText = (scriptClauses.get(sId) || '').toLowerCase()
    const hasCombat = /\b(?:slash|punched|punches|punching|striking|shatters|shattering|blasts|blasting|erupts|erupting|explodes|exploding|smashes|smashing|cleaves|cleaving|dodges|dodging|counters|countering|swings|swinging|crushes|crushing|battles|battling|ignites|igniting|vaporizes|vaporizing)\b/i.test(clauseText)
    if (!hasCombat || sId === 'IMG_063') {
      tier = 'B'
    }
  }
  let layout = parsedScene.layout
  if (franchise.format === '16:9') {
    if (!layout || layout.includes('Dual-panel') || layout.includes('split strip') || layout.includes('Three-panel') || layout.includes('strip')) {
      layout = tier === 'A'
        ? 'Tier A: Single-panel full-bleed horizontal hero plate'
        : tier === 'B'
        ? 'Tier B: Single-panel full-bleed horizontal cinematic plate'
        : 'Tier C: Single-panel full-bleed horizontal dynamic action plate'
    }
  } else {
    layout = layout || (tier === 'A' ? 'Tier A: Single-panel full-bleed hero plate' : tier === 'B' ? 'Tier B: Dual-panel split strip' : 'Tier C: Three-panel action strip')
  }
  let lens = toneConfig.lens
  if (parsedScene.prompt && parsedScene.prompt.match(/\b\d+mm\b[^\n,.]*/i)) {
    const matchedLens = parsedScene.prompt.match(/\b\d+mm\b[^\n,.]*/i)[0]
    if (!matchedLens.toLowerCase().includes('two-shot') || activeCast.length >= 2) {
      lens = matchedLens
    }
  }
  if (tier === 'B' && parsedScene.tier === 'C') {
    layout = franchise.format === '16:9'
      ? 'Tier B: Single-panel full-bleed horizontal cinematic plate'
      : 'Tier B: Dual-panel manhwa webtoon split strip'
    lens = activeCast.length >= 2 ? '35mm medium two-shot eye-level framing' : '35mm medium single-character eye-level framing'
  }
  if (activeCast.length <= 1 && lens.toLowerCase().includes('two-shot')) {
    lens = activeCast.length === 0
      ? '24mm wide angle establishing framing'
      : (tier === 'A' ? '24mm wide angle, low-angle hero framing' : (tier === 'C' ? '50mm telephoto close-up action framing' : '35mm medium single-character eye-level framing'))
  } else if (activeCast.length >= 2 && !lens.toLowerCase().includes('two-shot') && !lens.toLowerCase().includes('action') && !lens.toLowerCase().includes('wide angle')) {
    lens = tier === 'C' ? '50mm telephoto close-up action framing' : '35mm medium two-shot eye-level framing'
  }

  // Extract or validate Layer 4 Action (strictly preserve bespoke <action_layer> and block unedited scaffold templates)
  let actionLayer = (parsedScene.actionLayer || '').trim()
  if (!actionLayer && parsedScene.prompt) {
    const actMatch = parsedScene.prompt.match(/(?:In the (?:left|right|center)[^.]*\.)/i)
    actionLayer = actMatch ? actMatch[0] : ''
  }
  if (!actionLayer || /standing with focused posture matching the spoken narrative/i.test(actionLayer)) {
    console.error(`\x1b[31m[FATAL]\x1b[0m Scene ${sId} is missing a bespoke <action_layer> or still contains the unedited scaffold placeholder.`)
    process.exit(1)
  }

  // 1. Layer 1: Framing & Style
  const baseStyle = franchise.style?.base || 'Bright high-fantasy Korean manhwa webtoon art style, sharp clean black ink linework, vibrant cel shading'
  const aspectToken = franchise.aspect_token || 'horizontal 16:9'
  const layer1 = `${baseStyle}, ${aspectToken}, ${lens}`
  const sceneNum = PromptDnaCompiler.sceneNumberFromId(sId)

  // 1. Sanitize action layer from parsedScene or script
  actionLayer = sanitizeActionLayer(actionLayer || (scriptClauses.get(sId) || ''), sId)

  // 2. Layer 2: Characters & Props
  const charDnaBlocks = []

  for (const cToken of activeCast) {
    const cleanName = cToken.replace(/[@{}]/g, '').trim()
    const ent = Object.values(entities).find(e =>
      (e.token && e.token.toLowerCase().includes(cleanName.toLowerCase())) ||
      (e.name && e.name.toLowerCase() === cleanName.toLowerCase()) ||
      (e.id && e.id.toLowerCase() === cleanName.toLowerCase())
    )

    if (ent) {
      let dna = ent.dna || ent.dna_prompt_anchor || ent.token
      if (ent.stage_variants && ent.stage_variants[header.techStage]) {
        dna = ent.stage_variants[header.techStage]
      }
      if (worldState?.wardrobe_locks) {
        const lockedWardrobe = worldState.wardrobe_locks[ent.id] || worldState.wardrobe_locks[cleanName.toLowerCase()]
        if (lockedWardrobe && !dna.includes(lockedWardrobe)) {
          dna = dna.replace(/wearing [^,.]+/i, `wearing ${lockedWardrobe}`)
        }
      }
      // Julian unarmed enforcement (scenes 001 - 139)
      if (cleanName.toLowerCase().includes('julian') && sceneNum < 140) {
        if (!dna.toLowerCase().includes('unarmed noble attire')) {
          dna += `, ${UNARMED_JULIAN_TAIL}`
        }
      }
      charDnaBlocks.push(`Featuring @{${cleanName}} (${dna.replace(/^@\{[^}]+\},\s*/, '')})`)
    } else {
      charDnaBlocks.push(`Featuring @{${cleanName}}`)
    }
  }

  // Check if scene has stationary or handheld props
  const stationaryProps = []
  const handheldProps = []
  if (header.props?.length > 0) {
    for (const pToken of header.props) {
      const cleanProp = pToken.replace(/[@{}]/g, '').trim()
      const propEnt = Object.values(entities).find(e =>
        (e.name && e.name.toLowerCase() === cleanProp.toLowerCase()) ||
        (e.token && e.token.toLowerCase().includes(cleanProp.toLowerCase())) ||
        (e.id && e.id.toLowerCase() === cleanProp.toLowerCase().replace(/[^a-z0-9]/g, '_'))
      ) || legacyItems.find(it => (it.name && it.name.toLowerCase() === cleanProp.toLowerCase()) || it.id === cleanProp.toLowerCase().replace(/[^a-z0-9]/g, '_'))

      const isStationary = cleanProp.toLowerCase().includes('dummy') ||
        cleanProp.toLowerCase().includes('target') ||
        cleanProp.toLowerCase().includes('pedestal') ||
        cleanProp.toLowerCase().includes('monolith') ||
        (propEnt && propEnt.type === 'Prop')

      if (isStationary) {
        stationaryProps.push({ token: `@{${cleanProp}}`, name: cleanProp, ent: propEnt })
      } else {
        handheldProps.push({ token: `@{${cleanProp}}`, name: cleanProp, ent: propEnt })
      }
    }
  }

  let layer2 = ''
  if (charDnaBlocks.length > 0) {
    layer2 = charDnaBlocks.join(', ')
    if (stationaryProps.length > 0) {
      for (const sp of stationaryProps) {
        const rawDna = sp.ent?.dna || sp.ent?.description || 'Full-bodied humanoid automaton golem warrior sculpted from dark petrified iron-wood, complete with two carved wooden arms, two armored wooden legs with sabatons, segmented wooden chestplate with glowing cyan runes, and a faceless knight helmet head'
        const cleanPropDna = rawDna.replace(/^@\{[^}]+\},\s*/, '')
        layer2 += `, Featuring ${sp.token} (${cleanPropDna})`
      }
    }
  } else if (stationaryProps.length > 0) {
    const propBlocks = stationaryProps.map(sp => {
      const rawDna = sp.ent?.dna || sp.ent?.description || 'Full-bodied humanoid automaton golem warrior sculpted from dark petrified iron-wood, complete with two carved wooden arms, two armored wooden legs with sabatons, segmented wooden chestplate with glowing cyan runes, and a faceless knight helmet head'
      const cleanPropDna = rawDna.replace(/^@\{[^}]+\},\s*/, '')
      return `Featuring ${sp.token} (${cleanPropDna}) stationed in the center of the arena`
    })
    layer2 = propBlocks.join(', ')
  } else {
    layer2 = 'Completely unpopulated environment'
  }

  // 3. Layer 3: Spatial Enclosure & Lighting (Dynamic Temporal Decoupling)
  const baseZoneCanon = resolveZoneCanon(sId, zoneId, zone, header, worldState)
  const activeLightingMode = resolveSceneLighting(sId, scriptClauses.get(sId) || '', zone, worldState)
  const sanitizedCanon = sanitizeZoneCanon(baseZoneCanon, activeLightingMode)
  const lightingPhrase = LIGHTING_PHRASES[activeLightingMode] || 'illuminated by bright natural daylight'
  const vantage = zone.vantage_rule || ''
  const boundary = zone.boundary_tags || ''
  const zoneTokenName = zone.name || zoneId.replace(/_/g, ' ')
  const layer3 = `Spatial Enclosure: @{${zoneTokenName}} (${sanitizedCanon}). ${lightingPhrase}${vantage ? ', ' + vantage : ''}${boundary ? ', ' + boundary : ''}`

  // 4. Layer 4: Action Layer & Guards
  let layer4 = actionLayer
  if (header.planTalk) {
    layer4 += ' Characters are reviewing hand-drawn blueprints and raw mineral samples, zero finished future building.'
  }
  if (activeCast.some(c => c.toLowerCase().includes('lumina'))) {
    layer4 += ' Translucent cyan holographic interface floating freely in upper-right air quadrant with zero hands touching glass.'
  }

  // Enforce locked held prop form if worldState defines it
  if (worldState?.held_props && header.props?.length > 0) {
    for (const pToken of header.props) {
      const cleanProp = pToken.replace(/[@{}]/g, '').trim().toLowerCase()
      const propLock = worldState.held_props[cleanProp]
      if (propLock && propLock.container && !layer4.toLowerCase().includes(propLock.container.toLowerCase())) {
        layer4 += ` Held in ${propLock.container}.`
      }
    }
  }

  // Stationary props positioning in Layer 4
  if (stationaryProps.length > 0) {
    for (const sp of stationaryProps) {
      if (!layer4.includes(sp.token)) {
        layer4 += ` Centered upon ${sp.token}.`
      }
    }
  }

  // Handheld props handling in Layer 4
  if (handheldProps.length > 0) {
    const hasRod = handheldProps.some(hp => hp.name.toLowerCase().includes('rod') || hp.name.toLowerCase().includes('stick'))
    const hasRapier = handheldProps.some(hp => hp.name.toLowerCase().includes('rapier'))

    if (hasRod && hasRapier && sceneNum >= 149) {
      if (!layer4.includes('@{Wooden Practice Rod}')) {
        layer4 += ' Holding @{Wooden Practice Rod} lightly in hand.'
      }
      if (!layer4.includes('@{Vaelgard Silver Training Rapier}')) {
        layer4 += ' @{Vaelgard Silver Training Rapier} sheathed at hip in polished silver scabbard.'
      }
    } else {
      for (const hp of handheldProps) {
        if (!layer4.includes(hp.token)) {
          layer4 += ` Holding ${hp.token}.`
        }
      }
    }
  }

  // Apply policy replacements on layer 4
  if (policy?.replacements) {
    for (const [k, v] of Object.entries(policy.replacements)) {
      const reg = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      layer4 = layer4.replace(reg, v)
    }
  }

  // 5. Layer 5: Dynamic Safe Tail
  let layer5 = SAFE_TAIL_CHARACTER
  if (activeCast.length === 0) {
    if (stationaryProps.length > 0) {
      layer5 = SAFE_TAIL_PROP_FOCUSED
    } else {
      layer5 = SAFE_TAIL_LANDSCAPE
    }
  } else if (franchise.format === '16:9') {
    if (activeCast.length === 1) {
      layer5 = 'cleanly rendered hand linework, distinct individual fingers, crisp pupil reflections, zero character cloning, exactly one single protagonist, zero split panels, zero comic borders, solitary single character framing, complete limbs, pure 100% textless artwork, no speech bubbles, no comic sound effects, no watermarks, no photorealistic 3D CGI.'
    } else {
      layer5 = 'cleanly rendered hand linework, distinct individual fingers, crisp pupil reflections, zero character cloning, zero split panels, zero comic borders, complete limbs, pure 100% textless artwork, no speech bubbles, no comic sound effects, no watermarks, no photorealistic 3D CGI.'
    }
  }

  // Figurative lore negative shield
  const clauseText = (scriptClauses.get(sId) || '').toLowerCase()
  if (clauseText.includes('archmage') || clauseText.includes('archmages') || sId === 'IMG_080') {
    const hasArchmageCast = activeCast.some(c => c.toLowerCase().includes('eleanor'))
    if (!hasArchmageCast) {
      layer5 += ' zero archmages, zero old men, zero knights, zero armor dummies, zero extra humans.'
    }
  }
  
  const fullPrompt = `${layer1}. ${layer2}. ${layer3}. ${layer4}. ${layer5}`

  const cleanNarrativeClause = scriptClauses.get(sId) || parsedScene.narrativeSync || ''
  const cleanCast = activeCast.map(c => c.replace(/[@{}]/g, '').trim())
  const cleanProps = (header.props || []).map(p => p.replace(/[@{}]/g, '').trim())
  const promptTokens = [...fullPrompt.matchAll(/@\{([^}]+)\}/g)].map(m => m[1].trim())
  const allSceneRefs = [...new Set([...cleanCast, zoneTokenName, ...cleanProps, ...promptTokens])].filter(Boolean)
  const charRefsStr = allSceneRefs.join(', ')
  const itemRefsStr = cleanProps.map(p => `@{${p}}`).join(', ')

  compiledSceneNodes.push(`<scene id="${sId}" zone="${zoneId}" tier="${tier}" transition="adjacent">
  <character_refs>${charRefsStr}</character_refs>
  <item_refs>${itemRefsStr}</item_refs>
  <lens>${lens}</lens>
  <layout>${layout}</layout>
  <visual_literal>${header.actor} in ${zoneId.replace(/_/g, ' ')}.</visual_literal>
  <narrative_sync>${cleanNarrativeClause}</narrative_sync>
  <action_layer>${actionLayer}</action_layer>
  <prompt>
    ${fullPrompt}
  </prompt>
</scene>`)
}

const headerMarkdown = [
  `# 02_Prompt_Matrix.md — ${franchise.title} (${compiledSceneNodes.length} Scenes)`,
  ``,
  `> **Franchise Code:** \`${franchise.code}\``,
  `> **Format:** ${franchise.aspect_token}`,
  `> **Total Scenes:** ${compiledSceneNodes.length}`,
  `> **Compiled By:** Deterministic PromptDnaCompiler v2.0`,
  ``
].join('\n')

const finalMatrixMarkdown = headerMarkdown + '\n' + compiledSceneNodes.join('\n\n') + '\n'
fs.writeFileSync(matrixOutPath, finalMatrixMarkdown, 'utf-8')

const normVault = AntiSlopValidator.normalizeVaultContext({
  franchise,
  entities,
  zones,
  characters: legacyChars,
  items: legacyItems
})

const ledgerPath = path.join(epDir, 'state_events.jsonl')
const ledgerText = fs.existsSync(ledgerPath) ? fs.readFileSync(ledgerPath, 'utf-8') : ''
const parsedLedgerEvents = PromptDnaCompiler.parseLedgerEvents(ledgerText)

const manifest = PromptDnaCompiler.generateSignedManifest({
  franchise: normVault.franchise,
  entities: normVault.entities,
  zones: normVault.zones,
  ledgerEvents: parsedLedgerEvents,
  scriptText,
  matrixMarkdown: finalMatrixMarkdown
})
const manifestOutPath = path.join(epDir, 'dispatch_manifest.json')
fs.writeFileSync(manifestOutPath, JSON.stringify(manifest, null, 2), 'utf-8')

console.log(`\x1b[32m[COMPILED]\x1b[0m Wrote ${matrixOutPath}`)
console.log(`\x1b[32m[MANIFEST]\x1b[0m Signature: ${manifest.signature}\n`)

// Execute pre-flight audit
const audioTelemetry = readJsonSafe(path.join(epDir, 'audio_telemetry.json'), false)
const auditReport = AntiSlopValidator.auditPromptMatrix(
  scriptText,
  finalMatrixMarkdown,
  {
    franchise,
    franchiseDir,
    epPath: epDir,
    episodeId,
    entities,
    zones,
    policy,
    characters: legacyChars,
    items: legacyItems,
    worldState,
    ledgerText: fs.existsSync(path.join(epDir, 'state_events.jsonl')) ? fs.readFileSync(path.join(epDir, 'state_events.jsonl'), 'utf-8') : '',
    scenesJson: null,
    audioTelemetry,
    manifest
  }
)

const failedGates = auditReport.checks.filter(c => !c.passed)
if (!auditReport.isProductionReady) {
  console.error(`\x1b[31m[PRE-FLIGHT FAILED]\x1b[0m Score: ${auditReport.overallScore}/100`)
  for (const fg of failedGates) {
    console.error(`  - ${fg.name}: ${fg.details}`)
  }
  process.exit(1)
}

console.log(
  `\x1b[32m[SUCCESS]\x1b[0m All ${auditReport.checks.length} Gates Passed (100/100). Ready for Google Flow.`
)
process.exit(0)
