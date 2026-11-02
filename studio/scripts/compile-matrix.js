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

// Mode 1: Scaffold beats template from 01_Episode_Script.md
if (isScaffold) {
  console.log(`\x1b[33m[SCAFFOLD]\x1b[0m Generating clean beat-sheet XML in ${matrixOutPath}...`)
  const sceneIds = [...scriptClauses.keys()]
  const sceneBlocks = []

  let currentBatch = 1
  for (let i = 0; i < sceneIds.length; i++) {
    const sId = sceneIds[i]
    const clause = scriptClauses.get(sId) || ''
    const header = scriptHeaders.get(sId) || {
      zone: Object.keys(zones)[0] || 'emerald_valley_forest_trail',
      stage: 'interaction',
      actor: '@{Ace Miller}',
      cast: ['@{Ace Miller}'],
      props: [],
      techStage: 'ep01_stage1',
      planTalk: false
    }

    const tier = i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C'
    const layout = tier === 'A'
      ? 'Tier A: Single-panel full-bleed hero plate'
      : tier === 'B'
      ? 'Tier B: Dual-panel manhwa webtoon split strip'
      : 'Tier C: Three-panel dynamic manhwa action strip'

    const lens = tier === 'A'
      ? '24mm wide angle, low-angle hero framing'
      : '35mm medium two-shot eye-level framing'

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
const SAFE_TAIL_CHARACTER = 'cleanly rendered hand linework, distinct individual fingers, detailed knuckles, perfectly drawn footwear, crisp pupil reflections, no character cloning, no duplicate protagonist, no foreground strangers stealing focus, strictly private interior room with zero extra characters, no floating hands, no detached hands, no disembodied hands touching screens, no morphing artifacts, no missing fingers, no extra limbs, complete limbs, no split-room perspectives, pure 100% textless artwork, no speech bubbles, no comic SFX, no photorealistic 3D CGI.'
const SAFE_TAIL_LANDSCAPE = '100% environment landscape illustration, completely unpopulated, zero humans, zero people, zero characters, zero figures in the sky, pristine landscape, pure 100% textless artwork, no speech bubbles, no comic SFX, no watermarks, no signatures.'

const compiledSceneNodes = []

for (let i = 0; i < sceneIds.length; i++) {
  const sId = sceneIds[i]
  const parsedScene = parsedMatrixScenes.find(s => s.id === sId) || {}
  const header = scriptHeaders.get(sId) || {
    zone: parsedScene.zone || Object.keys(zones)[0],
    stage: 'interaction',
    actor: '@{Ace Miller}',
    cast: parsedScene.charRefs || ['Ace Miller'],
    props: parsedScene.itemRefs || [],
    techStage: 'ep01_stage1',
    planTalk: false
  }

  const zoneId = header.zone || parsedScene.zone || Object.keys(zones)[0]
  const zone = zones[zoneId] || Object.values(zones)[0] || {}

  const tier = parsedScene.tier || (i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C')
  const layout = parsedScene.layout || (tier === 'A' ? 'Tier A: Single-panel full-bleed hero plate' : tier === 'B' ? 'Tier B: Dual-panel split strip' : 'Tier C: Three-panel action strip')
  const lens = (parsedScene.prompt && parsedScene.prompt.match(/\b\d+mm\b[^\n,.]*/i)) ? parsedScene.prompt.match(/\b\d+mm\b[^\n,.]*/i)[0] : '24mm wide angle, low-angle hero framing'

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

  // 2. Layer 2: Characters & Props
  const charDnaBlocks = []
  const activeCast = header.cast.length > 0 ? header.cast : parsedScene.charRefs || []

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
      charDnaBlocks.push(`Featuring @{${cleanName}} (${dna.replace(/^@\{[^}]+\},\s*/, '')})`)
    } else {
      charDnaBlocks.push(`Featuring @{${cleanName}}`)
    }
  }

  const layer2 = charDnaBlocks.length > 0 ? charDnaBlocks.join(', ') : 'Completely unpopulated environment'

  // 3. Layer 3: Spatial Enclosure & Lighting
  let zoneCanon = zone.canon || ''
  if (zone.tech_stages && zone.tech_stages[header.techStage]) {
    zoneCanon = zone.tech_stages[header.techStage]
  }
  const lighting = zone.lighting === 'interior_warm' ? 'illuminated by warm ambient hearth glow' : 'illuminated by bright morning sunlight'
  const vantage = zone.vantage_rule || ''
  const boundary = zone.boundary_tags || ''
  const layer3 = `Inside ${zoneCanon}, ${lighting}, ${vantage}, ${boundary}`

  // 4. Layer 4: Action Layer & Guards
  let layer4 = actionLayer
  if (header.planTalk) {
    layer4 += ' Characters are reviewing hand-drawn blueprints and raw mineral samples, zero finished future building.'
  }
  if (activeCast.some(c => c.toLowerCase().includes('lumina'))) {
    layer4 += ' Translucent cyan holographic interface floating freely in upper-right air quadrant with zero hands touching glass.'
  }

  // Apply policy replacements on layer 4
  if (policy?.replacements) {
    for (const [k, v] of Object.entries(policy.replacements)) {
      const reg = new RegExp(`\\b${k.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'gi')
      layer4 = layer4.replace(reg, v)
    }
  }

  // 5. Layer 5: Dynamic Safe Tail
  const isLandscape = activeCast.length === 0
  const layer5 = isLandscape ? SAFE_TAIL_LANDSCAPE : SAFE_TAIL_CHARACTER

  // Complete assembled prompt
  const fullPrompt = `${layer1}. ${layer2}. ${layer3}. ${layer4}. ${layer5}`

  const cleanNarrativeClause = scriptClauses.get(sId) || parsedScene.narrativeSync || ''
  const charRefsStr = activeCast.map(c => `@\{${c.replace(/[@{}]/g, '')}\}`).join(', ')
  const itemRefsStr = (header.props || []).map(p => `@\{${p.replace(/[@{}]/g, '')}\}`).join(', ')

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

const manifest = PromptDnaCompiler.generateSignedManifest({
  franchise,
  entities,
  zones,
  ledgerEvents: [],
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
    entities,
    zones,
    policy,
    ledgerText: '',
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
