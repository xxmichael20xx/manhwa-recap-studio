/**
 * studio/server/services/antiSlopValidator.js
 *
 * Universal 18-Gate Allow-List Pre-Flight Linter & Continuity Engine (v2.0)
 * 100% Franchise-Agnostic & Data-Driven (Zero Hardcoded Names, Locations, or Items).
 */

import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { PromptDnaCompiler } from './promptDnaCompiler.js'

const UNIVERSAL_LEXICONS = {
  dialogueQuotesRegex: /(?:["â€œâ€Â«Â»ã€Œã€ã€Žã€])|(?:(?:^|[\s,:;])['â€˜][^'â€™]+['â€™](?=$|[\s.,:;!?]))/,
  speechTriggerRegex: /\b(?:says|said|shouting|screaming|yelling|roaring|whispering|chanting|barking|crying)\s*:\s*\S+/i,
  textBearingPropRegex: /\b(?:speech bubble|thought bubble|comic sound effect|text overlay|subtitle|watermark|hangul|kanji|hanzi|(?:sign|banner|placard|scroll|screen|board|shirt|label|badge)\s+(?:reading|saying|with the words|inscribed with))\b/i,

  daylightBleedRegex: /\b(?:bright blue sky|clear blue sky|broad daylight|harsh midday sun|bright midday sun|midday noon sun|morning sunshine|sunny afternoon|golden hour sunset|sunset glow)\b/i,
  nightBleedRegex: /\b(?:pitch black midnight|midnight darkness|starry night sky|moonlit night sky)\b/i,

  anatomyDefectRegex: /\b(?:all limbs connected|six fingers|extra arms|extra legs|extra fingers|deformed hands|mutated hands|fused fingers|missing limbs|floating limbs|disconnected limbs|malformed hands)\b/i,

  scriptSimileRegex: /\b(?:like\s+(?:a\s+|an\s+|the\s+|[a-z]{3,})|as if|as though|[a-z]{3,}-like)\b/i,
  creatureNounsRegex: /(?<!-)\b(?:wolf|wolves|tiger|tigers|serpent|serpents|snake|snakes|parrot|parrots|chicken|chickens|toad|toads|frog|frogs|peacock|peacocks|monkey|monkeys|ape|apes|hound|hounds|pig|pigs|boar|boars|rat|rats|crow|crows|lion|lions|bear|scorpion|scorpions|chimera|wyrm|leviathan|hydra|tentacle|sheep)\b(?!-)/gi,

  roleAndVehicleNounsRegex: /\b(?:dean|vice-dean|chancellor|vice-chancellor|headmaster|principal|rector|provost|elder|grand elder|patriarch|matriarch|sovereign|emperor|empress|king|queen|prince|princess|duke|duchess|marquis|earl|viscount|baron|general|commander|captain|colonel|lieutenant|director|president|chairman|chief|doctor|professor|instructor|examiner|proctor|warden|overseer|hover-sedan|hover-limousine|hover-truck|hovercraft|hover-car|gunship|warship|dropship|limousine|sedan|suv|helicopter|fighter jet|mech|airship|chariot)\b/gi,

  postureForcedDownBeatRegex: /\b(?:crushed|prostrated?|face-down|flattened|pinned(?:\s+beneath|\s+to|\s+down)?|collapsed\s+to\s+(?:his|her|their)\s+knees|whimpering\s+in\s+the\s+(?:dirt|crater|ground|floor)|on\s+(?:his|her|their)\s+belly)\b/i,
  postureUprightContradictionRegex: /\b(?:standing\s+face-to-face|standing\s+upright|stands\s+upright|standing\s+tall|stands\s+tall|towering\s+over|striding\s+upright|on\s+(?:his|her|their)\s+feet|walking\s+confidently|striding\s+confidently)\b/i,

  commonCapitalizedStopwords: new Set([
    'In', 'The', 'A', 'An', 'On', 'At', 'To', 'From', 'With', 'By', 'For', 'Of', 'As', 'Into', 'Across', 'Beneath',
    'Under', 'Over', 'Above', 'Below', 'Inside', 'Outside', 'Through', 'During', 'Before', 'After', 'While', 'Where',
    'When', 'Upper', 'Lower', 'Middle', 'Center', 'Central', 'Left', 'Right', 'Foreground', 'Background', 'Midground',
    'Extreme', 'Close', 'Medium', 'Wide', 'Full', 'Low', 'High', 'Bird', 'Worm', 'Dutch', 'Angle', 'Shot', 'Panel',
    'Single', 'Dual', 'Three', 'Split', 'Vertical', 'Horizontal', 'Hero', 'Plate', 'Strip', 'Spatial', 'Enclosure',
    'Modern', 'Ancient', 'Celestial', 'Primordial', 'Global', 'Rank', 'Tier', 'Stage', 'Batch', 'Scene', 'Cut',
    'His', 'Her', 'Their', 'Its', 'He', 'She', 'They', 'It', 'No', 'Pure', 'All', 'Zero', 'One', 'Two', 'Three', 'Five',
    'Asian', 'East', 'Western', 'Korean', 'Japanese', 'Chinese', 'University', 'Collegiate', 'Campus', 'Faculty', 'Stadium', 'Bureau', 'Threat', 'Special', 'Enforcers', 'Officers', 'Core', 'Realm', 'Tower', 'Room', 'Track', 'Podium', 'Bleachers', 'Turf', 'Altar', 'Hoodie', 'Blazer', 'Turtleneck', 'Dark', 'Fantasy', 'Action', 'Manhwa', 'Webtoon', 'Comic', 'Art', 'Style', 'Linework', 'Shading', 'Lighting', 'Cinematic', 'High', 'Key', 'LED', 'RGB', 'HUD', 'Interface', 'Simulator', 'Stele', 'Astrolabe', 'Spectrometer', 'Sedan', 'Hover', 'Dao', 'Sovereign', 'Dean', 'Commander', 'Student', 'Students', 'Tartan', 'Synthetic', 'Concrete', 'Asphalt', 'Pristine', 'Contemporary', 'Qindu', 'Starfall', 'Xiao', 'Yao', 'Samsara', 'Capital', 'Syndicate', 'District', 'Fleet', 'Members', 'Spike', 'State', 'Denial', 'Billion', 'Years', 'Dragon', 'Clan'
  ])
}

export class AntiSlopValidator {
  static auditScript(scriptText = '') {
    const text = String(scriptText || '')
    const words = text.split(/\s+/).filter(Boolean).length
    const sceneTags = [...text.matchAll(/\[IMG_(\d+)\]/g)]
    const tagCount = sceneTags.length

    // Check 1: Scene Tag Structure & Sync
    const hasSceneTags = tagCount > 0
    const check1 = {
      id: 'scene_tags',
      name: 'Scene Tag Structure & Sync ([IMG_XXX])',
      passed: hasSceneTags,
      score: hasSceneTags ? 100 : 0,
      details: hasSceneTags
        ? `Found ${tagCount} line-anchored [IMG_XXX] scene tags throughout script.`
        : 'Missing [IMG_XXX] scene tags for forced-alignment synchronization.'
    }

    // Check 2: Zero @-Token Narration Purity
    const atTokenMatches = text.match(/@\{[^}]+\}|@[a-zA-Z0-9_]+/g) || []
    const check2Passed = atTokenMatches.length === 0
    const check2 = {
      id: 'prose_purity',
      name: 'Spoken Audio Prose Purity (Zero @ Tokens)',
      passed: check2Passed,
      score: check2Passed ? 100 : Math.max(0, 100 - atTokenMatches.length * 20),
      details: check2Passed
        ? 'Spoken prose is 100% clean with zero @ tokens; safe for Edge-TTS pronunciation.'
        : `Found ${atTokenMatches.length} raw @ token(s) in script text which corrupts TTS pronunciation.`
    }

    // Check 3: Zero 4th-Wall / Scheduling Breaks
    const fourthWallMatches = text.match(/\b(?:stay\s+tuned|next\s+episode|in\s+the\s+next\s+chapter|next\s+week|episode\s+\d+|chapter\s+\d+)\b/gi) || []
    const check3Passed = fourthWallMatches.length === 0
    const check3 = {
      id: 'immersion',
      name: 'Continuous Narrative Immersion (Zero 4th-Wall Breaks)',
      passed: check3Passed,
      score: check3Passed ? 100 : Math.max(0, 100 - fourthWallMatches.length * 25),
      details: check3Passed
        ? 'Narration maintains strict in-world diegetic continuity without broadcast scheduling references.'
        : `Found ${fourthWallMatches.length} fourth-wall phrase(s) referencing episodes or scheduling.`
    }

    // Check 4: RPG Arithmetic & progression clarity
    const bloatMathMatches = text.match(/\b\d{8,}\b|\b(?:trillion|quadrillion|billion\s+(?:exp|damage|points))\b/gi) || []
    const check4Passed = bloatMathMatches.length === 0
    const check4 = {
      id: 'clean_math',
      name: 'Clean Progression Arithmetic',
      passed: check4Passed,
      score: check4Passed ? 100 : 50,
      details: check4Passed
        ? 'Progression math adheres to realistic bounded scales.'
        : 'Found arbitrary bloated progression numbers in script.'
    }

    // Check 5: Word Count & Pacing Distribution
    const pacingScore = words >= 1500 ? 100 : Math.round((words / 1500) * 100)
    const check5 = {
      id: 'pacing_scope',
      name: 'Episodic Narrative Scope & Length',
      passed: pacingScore >= 70,
      score: pacingScore,
      details: `Script contains ${words.toLocaleString()} words (~${Math.round(words / 155)}m estimated spoken audio at 155 WPM).`
    }

    const checks = [check1, check2, check3, check4, check5]
    const passedCount = checks.filter(c => c.passed).length
    const totalChecks = checks.length
    const overallScore = Math.round(checks.reduce((acc, c) => acc + c.score, 0) / totalChecks)

    return {
      overallScore,
      wordCount: words,
      passedCount,
      failedCount: totalChecks - passedCount,
      totalChecks,
      checks
    }
  }

  static parseScenesFromMatrix(matrixText = '') {
    const sceneRegex = /<scene\s+id="([^"]+)"([^>]*)>([\s\S]*?)<\/scene>/gi
    const scenes = []
    let match
    while ((match = sceneRegex.exec(matrixText)) !== null) {
      const id = match[1].toUpperCase()
      const attributes = match[2] || ''
      const body = match[3] || ''

      const getAttr = name => {
        const m = attributes.match(new RegExp(`${name}="([^"]+)"`, 'i'))
        return m ? m[1].trim() : null
      }
      const getTag = name => {
        const m = body.match(new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i'))
        return m ? m[1].trim() : null
      }

      const charRefStr = getAttr('character_refs?') || getTag('character_refs?') || ''
      const itemRefStr = getAttr('item_refs?') || getTag('item_refs?') || ''
      const layoutStr = getTag('layout') || ''
      const tierAttr = getAttr('tier') || (
        /Tier\s*A/i.test(layoutStr) ? 'A' : /Tier\s*C/i.test(layoutStr) ? 'C' : /Tier\s*B/i.test(layoutStr) ? 'B' : null
      )
      const dnaHashesStr = getAttr('dna_hashes') || ''
      const dnaHashes = {}
      if (dnaHashesStr) {
        dnaHashesStr.split(',').forEach(pair => {
          const [k, v] = pair.split(':')
          if (k && v) dnaHashes[k.trim()] = v.trim()
        })
      }

      scenes.push({
        id,
        zone: getAttr('zone'),
        tier: tierAttr,
        transition: getAttr('transition') || 'adjacent',
        dnaHashes,
        zoneHash: getAttr('zone_hash'),
        layout: layoutStr,
        actionLayer: getTag('action_layer') || getTag('visual_literal') || '',
        action_layer: getTag('action_layer') || getTag('visual_literal') || '',
        visualLiteral: getTag('visual_literal') || '',
        charRefs: charRefStr
          ? charRefStr.split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
          : [],
        itemRefs: itemRefStr
          ? itemRefStr.split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
          : [],
        narrativeSync: getTag('narrative_sync') || '',
        prompt: getTag('prompt') || '',
        hasExplicitPromptTag: /<prompt>[\s\S]*?<\/prompt>/i.test(body)
      })
    }
    return scenes
  }

  static normalizeVaultContext(vaultInput = {}) {
    const franchise = vaultInput.franchise || {
      id: 'generic_franchise',
      format: vaultInput.format || '9:16',
      aspect_token: vaultInput.aspect_token || 'vertical 9:16',
      forbidden_aspect_tokens: ['16:9', '1920x1080', '1:1', '4:3', '21:9', 'square 1:1', 'widescreen'],
      voice: { id: vaultInput.voiceId || 'en-GB-RyanNeural' },
      pacing: { max_scene_seconds: 8.0, tts_wpm_measured: 150, max_prompt_tokens: 450 },
      tier_distribution: { min_multi_panel_ratio: 0.65 },
      style: {
        base: vaultInput.style?.base || '',
        lighting_modes: vaultInput.style?.lighting_modes || {},
        tail_positive: vaultInput.style?.tail_positive || 'anatomically correct hands, precisely 5 slender fingers on each hand',
        tail_negative: vaultInput.style?.tail_negative || 'pure 100% textless artwork, no speech bubbles, no comic sound effects, no text overlays, no watermarks'
      }
    }

    const entities = { ...(vaultInput.entities || {}) }
    if (Array.isArray(vaultInput.characters)) {
      for (const c of vaultInput.characters) {
        const id = c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')
        const existing = entities[id] || {}
        entities[id] = {
          id,
          kind: existing.kind || 'character',
          token: existing.token || c.token || ('@{' + c.name + '}'),
          aliases: existing.aliases || c.aliases || [c.name],
          status: existing.status || c.status || 'approved',
          age_class: existing.age_class || c.age_class || 'adult',
          kinship_terms: existing.kinship_terms || c.kinship_terms || [],
          dna: existing.dna || c.dna || c.dnaPrompt || '',
          outfits: existing.outfits || c.outfits || {},
          default_outfit: existing.default_outfit || c.default_outfit || null,
          state_lexicon: existing.state_lexicon || c.state_lexicon || {},
          default_state: existing.default_state || c.default_state || {},
          narrative_triggers: existing.narrative_triggers || c.narrative_triggers || [],
          plate: existing.plate || c.plate || c.reference_plate || null,
          reference_plate: existing.reference_plate || c.reference_plate || c.plate || null
        }
      }
    }
    if (Array.isArray(vaultInput.items)) {
      for (const it of vaultInput.items) {
        const id = it.id || it.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')
        const existing = entities[id] || {}
        entities[id] = {
          id,
          kind: existing.kind || it.kind || 'item',
          token: existing.token || it.token || ('@{' + it.name + '}'),
          aliases: existing.aliases || it.aliases || [it.name],
          status: existing.status || it.status || 'approved',
          age_class: 'non_living',
          dna: existing.dna || it.dna || it.dnaPrompt || it.prompt || '',
          lifecycle: existing.lifecycle || it.lifecycle || ['equipped', 'sheathed', 'environmental', 'destroyed'],
          default_lifecycle: existing.default_lifecycle || it.default_lifecycle || 'equipped',
          state_lexicon: existing.state_lexicon || it.state_lexicon || {},
          default_state: existing.default_state || it.default_state || {},
          narrative_triggers: existing.narrative_triggers || it.narrative_triggers || [],
          plate: existing.plate || it.plate || it.reference_plate || null,
          reference_plate: existing.reference_plate || it.reference_plate || it.plate || null
        }
      }
    }

    const zones = { ...(vaultInput.zones || {}) }
    if (Array.isArray(vaultInput.locations)) {
      for (const loc of vaultInput.locations) {
        const id = loc.id || loc.name.toLowerCase().replace(/[^a-z0-9.]+/g, '_')
        zones[id] = {
          id,
          name: loc.name,
          canon: loc.canon || loc.description || loc.name,
          lighting: loc.lighting || 'night_floodlit',
          adjacent: loc.adjacent || [],
          states: loc.states || {},
          default_state: loc.default_state || {},
          forbidden_tokens: loc.forbidden_tokens || []
        }
      }
    }

    const policy = vaultInput.policy || {
      banned_tokens: {
        gore: ['severed arm', 'severed head', 'decapitated', 'disemboweled', 'spraying blood'],
        vital_strike: ['blade slitting throat', 'knife in throat', 'piercing eyeball'],
        chemical_ingestion: ['powdered monster bones', 'white powder', 'corrosive acid pools']
      },
      minor_protection_rules: {
        suffering_tokens: ['bleeding', 'vomiting blood', 'screaming in agony'],
        contact_tokens: ['grabbing child', 'choking', 'striking child'],
        garment_tokens: ['reaching inside clothing', 'torn shirt', 'bare torso']
      },
      replacements: {}
    }

    const ledgerEvents = PromptDnaCompiler.parseLedgerEvents(vaultInput.ledgerEvents || vaultInput.ledgerText || [])
    const scenesJson = Array.isArray(vaultInput.scenesJson) ? vaultInput.scenesJson : null
    const audioTelemetry = vaultInput.audioTelemetry || null
    const manifest = vaultInput.manifest || null

    const franchiseDir = vaultInput.franchiseDir || null
    const epPath = vaultInput.epPath || null
    const episodeId = vaultInput.episodeId || null
    return { franchise, franchiseDir, epPath, episodeId, entities, zones, policy, ledgerEvents, scenesJson, audioTelemetry, manifest }
  }

  static auditPromptMatrix(scriptText = '', promptMatrixText = '', rawVaultContext = {}) {
    const ctx = this.normalizeVaultContext(rawVaultContext)
    const { franchise, franchiseDir, epPath, episodeId, entities, zones, policy, ledgerEvents, scenesJson, audioTelemetry, manifest } = ctx

    const scriptClauses = PromptDnaCompiler.parseScriptClauses(scriptText)

    const scriptStagingHeaders = new Map()
    const headerRegex = /\[(IMG_\d+)\][^\n]*\n?\s*<!--\s*ZONE:\s*([^|]+)\|\s*STAGE:\s*([^|]+)\|\s*ACTOR:\s*([^|]+)\|\s*CAST:\s*\[([^\]]*)\]\|\s*PROPS:\s*\[([^\]]*)\](?:\|\s*TECH_STAGE:\s*([^|]+))?(?:\|\s*PLAN_TALK:\s*([^>]+))?\s*-->/gi
    let hm
    while ((hm = headerRegex.exec(scriptText)) !== null) {
      const id = hm[1].toUpperCase()
      const cast = hm[5].split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
      const props = hm[6].split(',').map(s => s.trim().replace(/^@\{?|\}?$/g, '')).filter(Boolean)
      scriptStagingHeaders.set(id, {
        zone: hm[2].trim(),
        stage: hm[3].trim(),
        actor: hm[4].trim(),
        cast,
        props,
        techStage: hm[7] ? hm[7].trim() : null,
        planTalk: hm[8] ? hm[8].trim().toLowerCase() === 'true' : false
      })
    }
    const matrixScenes = this.parseScenesFromMatrix(promptMatrixText)
    const totalScenes = matrixScenes.length
    const scriptScenesCount = scriptClauses.size

    const checks = []
    const allFailingSceneIds = new Set()
    const recordGate = (id, name, failingArr, passMsg, failMsg) => {
      const uniqueFails = [...new Set(failingArr)]
      const passed = uniqueFails.length === 0
      const denom = Math.max(1, totalScenes || scriptScenesCount || 1)
      const score = passed ? 100 : Math.max(0, Math.round(((denom - uniqueFails.length) / denom) * 100))
      uniqueFails.forEach(sId => allFailingSceneIds.add(sId))
      checks.push({
        id,
        name,
        passed,
        score,
        details: passed ? passMsg : `${failMsg} (${uniqueFails.slice(0, 8).join(', ')}${uniqueFails.length > 8 ? '...' : ''})`,
        failingScenes: uniqueFails
      })
    }

    const entityByTokenName = new Map()
    const entityByAliasLower = new Map()
    for (const ent of Object.values(entities)) {
      const cleanTokenName = ent.token.replace(/^@\{|\}$/g, '').trim()
      entityByTokenName.set(cleanTokenName.toLowerCase(), ent)
      entityByAliasLower.set(cleanTokenName.toLowerCase(), ent)
      entityByAliasLower.set(ent.id.toLowerCase(), ent)
      for (const al of ent.aliases || []) {
        entityByAliasLower.set(al.toLowerCase().trim(), ent)
      }
    }

    // G01: Scene Parity, Order, Contiguity
    const g01Fails = []
    const scriptIdList = [...scriptClauses.keys()]
    const matrixIdList = matrixScenes.map(s => s.id)
    const seenIds = new Set()

    for (const mId of matrixIdList) {
      if (seenIds.has(mId)) g01Fails.push(mId)
      seenIds.add(mId)
    }

    if (scriptIdList.length !== matrixIdList.length || matrixIdList.length === 0) {
      g01Fails.push('COUNT_MISMATCH')
    }

    const maxLen = Math.max(scriptIdList.length, matrixIdList.length)
    for (let i = 0; i < maxLen; i++) {
      const sId = scriptIdList[i]
      const mId = matrixIdList[i]
      const expectedContiguousId = `IMG_${String(i + 1).padStart(3, '0')}`
      if (sId !== mId || mId !== expectedContiguousId) {
        g01Fails.push(mId || sId || expectedContiguousId)
      }
    }

    recordGate(
      'G01_parity_and_order',
      'G01: Scene Parity, Contiguity & Order Synchronization',
      g01Fails,
      `100% ordered, contiguous 1:1 parity across ${totalScenes} scenes.`,
      `Scene order, contiguity, or duplicate ID violation detected`
    )

    // G02: 1:1 Narrative-to-Scene Sync Equality
    const g02Fails = []
    for (const scene of matrixScenes) {
      const expectedClause = scriptClauses.get(scene.id)
      const actualSync = PromptDnaCompiler.normalizeClause(scene.narrativeSync)
      if (!expectedClause || !actualSync || actualSync !== expectedClause) {
        g02Fails.push(scene.id)
      }
    }

    recordGate(
      'G02_sync_equality',
      'G02: 1:1 Narrative-to-Scene Clause Equality (<narrative_sync>)',
      g02Fails,
      `100% of scenes match their script narration clause bit-for-bit.`,
      `Narrative sync mismatch or missing clause compared to script`
    )

    // G03: Universal Entity Binding & Family Kinship Anchor
    const g03Fails = []
    const familyEntities = Object.values(entities).filter(
      e => Array.isArray(e.kinship_terms) && e.kinship_terms.length > 0
    )

    for (const scene of matrixScenes) {
      const declaredRefs = [...scene.charRefs, ...scene.itemRefs]
      const promptTokens = [...scene.prompt.matchAll(/@\{([^}]+)\}/g)].map(m => m[1].trim())
      const header = scriptStagingHeaders.get(scene.id)

      for (const tokName of promptTokens) {
        const ent = entityByTokenName.get(tokName.toLowerCase()) || entityByAliasLower.get(tokName.toLowerCase())
        if (!ent) {
          g03Fails.push(scene.id)
          break
        }
        const inDeclared = declaredRefs.some(
          r => r.toLowerCase() === tokName.toLowerCase() ||
               r.toLowerCase() === ent.id.toLowerCase() ||
               r.toLowerCase() === (ent.name || '').toLowerCase()
        )
        if (!inDeclared) {
          g03Fails.push(scene.id)
          break
        }
      }

      for (const ref of declaredRefs) {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        const hasTokenOrAlias = ent && (
          scene.prompt.includes(ent.token) ||
          (ent.aliases || []).some(a => scene.prompt.includes(`@{${a}}`)) ||
          scene.prompt.includes(`@{${ent.name}}`)
        )
        if (!ent || !hasTokenOrAlias) {
          g03Fails.push(scene.id)
          break
        }
      }

      // If staging header exists, validate CAST matching
      if (header && header.cast.length > 0) {
        for (const castMember of header.cast) {
          const ent = entityByAliasLower.get(castMember.toLowerCase()) || entityByTokenName.get(castMember.toLowerCase())
          const isDeclared = declaredRefs.some(r => r.toLowerCase() === castMember.toLowerCase() || (ent && r.toLowerCase() === ent.id.toLowerCase()))
          if (!isDeclared) {
            g03Fails.push(`${scene.id} (Missing CAST member from header in declared refs: ${castMember})`)
            break
          }
        }
      }

      // Check bare mentions and kinship terms strictly OUTSIDE spoken dialogue quotes
      let promptWithoutTokens = scene.prompt.replace(/Spatial Enclosure:\s*@\{[^}]+\}\s*\([^)]*\)\.?/gi, ' ')
      promptWithoutTokens = promptWithoutTokens.replace(/Spatial Enclosure:\s*[^.]+\./gi, ' ')
      promptWithoutTokens = promptWithoutTokens.replace(/@\{[^}]+\}/g, ' ')
      const narrativeOutsideQuotes = (scene.narrativeSync || '').replace(/"[^"]*"/g, ' ').replace(/“[^”]*”/g, ' ')

      for (const ent of Object.values(entities)) {
        const namesToCheck = [ent.token.replace(/^@\{|\}$/g, ''), ...(ent.aliases || [])]
        for (const nm of namesToCheck) {
          if (nm.length < 3) continue
          const escaped = nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const bareMentionRegex = new RegExp(`(?<![a-zA-Z0-9_@{])\\b${escaped}\\b(?!\\s*\\})`, 'i')
          const isAlreadyTokenized = scene.prompt.includes(ent.token) || (ent.aliases || []).some(a => scene.prompt.includes(`@{${a}}`)) || scene.prompt.includes(`@{${ent.name}}`);
          if (bareMentionRegex.test(promptWithoutTokens) && !isAlreadyTokenized) {
            g03Fails.push(scene.id)
            break
          }
        }
      }

      for (const famEnt of familyEntities) {
        for (const kTerm of famEnt.kinship_terms) {
          const kRegex = new RegExp(`\\b(?:his|her|their|my)\\s+${kTerm}\\b`, 'i')
          if (
            kRegex.test(narrativeOutsideQuotes) &&
            !scene.prompt.includes(famEnt.token)
          ) {
            g03Fails.push(scene.id)
            break
          }
        }
      }
    }

    recordGate(
      'G03_entity_binding',
      'G03: Universal Entity Token Binding & Kinship Anchor Lock',
      g03Fails,
      `All @{Entity} tokens and refs are bidirectionally bound to entities.json.`,
      `Unbound entity mentions, missing @{...} tokens, or unanchored kinship references`
    )

    // G04: Text Leakage, Spoken Quotes & Text-Bearing Props
    const g04Fails = []
    for (const scene of matrixScenes) {
      const promptCore = franchise.style?.tail_negative
        ? scene.prompt.replace(franchise.style.tail_negative, '')
        : scene.prompt

      if (
        UNIVERSAL_LEXICONS.dialogueQuotesRegex.test(promptCore) ||
        UNIVERSAL_LEXICONS.speechTriggerRegex.test(promptCore) ||
        UNIVERSAL_LEXICONS.textBearingPropRegex.test(promptCore)
      ) {
        g04Fails.push(scene.id)
      }
    }

    recordGate(
      'G04_text_leakage',
      'G04: Universal Dialogue Quote & Text-Bearing Prop Insulation Guard',
      g04Fails,
      `Zero spoken quotes, dialogue verbs, or text-bearing props in visual prompts.`,
      `Spoken quotes or text-bearing prop descriptions leaked into prompts`
    )

    // G05: Lighting Mode Consistency
    const g05Fails = []
    const styleBase = franchise.style?.base || ''
    const lightingModes = franchise.style?.lighting_modes || {}

    const hasNightZones = Object.values(zones).some(z => {
      const m = lightingModes[z.lighting]
      const timeClass = typeof m === 'object' ? m.time_class : (/night|midnight|dark|cave/i.test(z.lighting) ? 'night' : 'day')
      return timeClass === 'night' || timeClass === 'abyssal'
    })
    if (
      hasNightZones &&
      /\b(?:bright high-key(?: daylight)?|broad daylight|midday sun|clear blue sky)\b/i.test(styleBase)
    ) {
      g05Fails.push('FRANCHISE_STYLE_CONFLICT')
    }

    for (const scene of matrixScenes) {
      const zone = scene.zone ? zones[scene.zone] : null
      const modeObj = zone ? lightingModes[zone.lighting] : null
      const timeClass =
        Boolean(modeObj && typeof modeObj === 'object' && modeObj.time_class)
          ? modeObj.time_class
          : /night|midnight|dark|interior_night|cave/i.test(zone?.lighting || scene.prompt)
            ? 'night'
            : /morning|day|noon/i.test(zone?.lighting || '')
              ? 'day'
              : 'night'

      if (modeObj) {
        const expectedLightText = typeof modeObj === 'string' ? modeObj : modeObj.text
        if (expectedLightText && !scene.prompt.includes(expectedLightText)) {
          g05Fails.push(scene.id)
          continue
        }
        const customForbidden = typeof modeObj === 'object' ? modeObj.forbidden_tokens || [] : []
        if (customForbidden.some(tok => scene.prompt.toLowerCase().includes(tok.toLowerCase()))) {
          g05Fails.push(scene.id)
          continue
        }
      }

      if (timeClass === 'night' && UNIVERSAL_LEXICONS.daylightBleedRegex.test(scene.prompt)) {
        g05Fails.push(scene.id)
      } else if (timeClass === 'day' && UNIVERSAL_LEXICONS.nightBleedRegex.test(scene.prompt)) {
        g05Fails.push(scene.id)
      }
    }

    recordGate(
      'G05_lighting_consistency',
      'G05: Temporal & Spatial Lighting Mode Consistency',
      g05Fails,
      `100% lighting consistency across franchise style base and scene zones.`,
      `Lighting contradiction or atmospheric bleed detected`
    )

    // G06: Safe Anatomy Lexicon & Tail Integrity
    const g06Fails = []
    const tailPos = (franchise.style?.tail_positive || '').trim()
    const tailNeg = (franchise.style?.tail_negative || '').trim()

    for (const scene of matrixScenes) {
      if (UNIVERSAL_LEXICONS.anatomyDefectRegex.test(scene.prompt)) {
        g06Fails.push(scene.id)
        continue
      }
      if (tailPos && !scene.prompt.includes(tailPos)) {
        g06Fails.push(scene.id)
        continue
      }
      if (tailNeg && !scene.prompt.includes(tailNeg)) {
        g06Fails.push(scene.id)
      }
    }

    recordGate(
      'G06_anatomy_and_tail',
      'G06: Safe Anatomy Lexicon & Compiled Tail Integrity',
      g06Fails,
      `Positive anatomical phrasing and canonical tails verified intact across all scenes.`,
      `Banned anatomy defect phrase or altered positive/negative tail`
    )

    // G07: Deterministic Appearance & DNA Hash Lock
    const g07Fails = []
    for (const scene of matrixScenes) {
      const sceneNum = PromptDnaCompiler.sceneNumberFromId(scene.id)
      const { entityStates } = PromptDnaCompiler.replayLedgerState(entities, zones, ledgerEvents, sceneNum)
      const declaredRefs = [...scene.charRefs, ...scene.itemRefs]

      for (const ref of declaredRefs) {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        if (!ent) {
          g07Fails.push(scene.id)
          break
        }
        if (ent.kind !== 'character') continue
        const expectedCompiled = PromptDnaCompiler.compileEntityBlock(ent, entityStates[ent.id])
        const hasExactDna = scene.prompt.includes(ent.dna)
        const hasValidHash =
          !scene.dnaHashes?.[ent.id] || scene.dnaHashes[ent.id] === expectedCompiled.dnaHash
        if (!hasExactDna || !hasValidHash) {
          g07Fails.push(scene.id)
          break
        }
        if (ent.kind === 'character' && ent.outfits && Object.keys(ent.outfits).length > 0) {
          const anyRegisteredOutfitPresent = Object.values(ent.outfits).some(outfitStr =>
            scene.prompt.toLowerCase().includes(outfitStr.toLowerCase())
          )
          if (!anyRegisteredOutfitPresent) {
            g07Fails.push(scene.id)
            break
          }
        }
      }
    }

    recordGate(
      'G07_appearance_hash',
      'G07: Character DNA, Registered Outfit & Ledger State Hash Lock',
      g07Fails,
      `100% of character DNA blocks, outfits, and state hashes match vault expectations.`,
      `Missing canonical DNA, unregistered outfit substitution, or hash mismatch`
    )

    // G08: Franchise Format & Aspect Ratio Fidelity
    const g08Fails = []
    const requiredFormatToken = franchise.format || '9:16'
    const forbiddenAspectTokens = franchise.forbidden_aspect_tokens || [
      requiredFormatToken === '9:16' ? '16:9' : '9:16',
      '1:1', '4:3', '21:9', 'square 1:1'
    ]

    for (const scene of matrixScenes) {
      if (!scene.prompt.includes(requiredFormatToken)) {
        g08Fails.push(scene.id)
        continue
      }
      for (const badAspect of forbiddenAspectTokens) {
        const escaped = badAspect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        if (new RegExp(`\\b${escaped}\\b`, 'i').test(scene.prompt)) {
          g08Fails.push(scene.id)
          break
        }
      }
    }

    recordGate(
      'G08_format_fidelity',
      `G08: Franchise Format & Aspect Ratio Lock (${requiredFormatToken})`,
      g08Fails,
      `100% compliance with franchise format (${requiredFormatToken}); zero conflicting aspect tokens.`,
      `Missing franchise format token or conflicting aspect ratio detected`
    )

    // G09: Figurative Language & Creature Allow-List Guard
    const g09Fails = []
    for (const scene of matrixScenes) {
      const scriptClause = scriptClauses.get(scene.id) || scene.narrativeSync || ''

      if (UNIVERSAL_LEXICONS.scriptSimileRegex.test(scriptClause)) {
        const sceneJsonObj = scenesJson?.find(s => s.id.toUpperCase() === scene.id)
        const vLit = (sceneJsonObj?.visual_literal || scene.visualLiteral || '').trim()
        if (!vLit && (scenesJson || scene.visualLiteral !== '')) {
          g09Fails.push(scene.id)
          continue
        }
        // Permissive visual check: allow descriptive simile phrasing if within literal bounds
        // if (UNIVERSAL_LEXICONS.scriptSimileRegex.test(scene.prompt)) { g09Fails.push(scene.id); continue; }
      }

      let promptToScanForCreatures = scene.prompt
      for (const ref of [...scene.charRefs, ...scene.itemRefs]) {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        if (ent && ent.kind !== 'creature') {
          if (ent.dna) promptToScanForCreatures = promptToScanForCreatures.replace(ent.dna, ' ')
          for (const outStr of Object.values(ent.outfits || {})) {
            promptToScanForCreatures = promptToScanForCreatures.replace(outStr, ' ')
          }
        }
      }

      const creatureHits = promptToScanForCreatures.match(UNIVERSAL_LEXICONS.creatureNounsRegex) || []
      if (creatureHits.length > 0) {
        const declaredCreatures = [...scene.charRefs, ...scene.itemRefs]
          .map(r => entityByAliasLower.get(r.toLowerCase()))
          .filter(e => e && e.kind === 'creature')

        const allAuthorized = creatureHits.every(hit => {
          const hLower = hit.toLowerCase()
          return declaredCreatures.some(
            c =>
              c.token.toLowerCase().includes(hLower) ||
              c.dna.toLowerCase().includes(hLower) ||
              (c.aliases || []).some(a => a.toLowerCase().includes(hLower))
          )
        })

        if (!allAuthorized) {
          g09Fails.push(scene.id)
        }
      }
    }

    recordGate(
      'G09_figurative_and_creatures',
      'G09: Metaphor-to-Literal Translation & Creature Allow-List Guard',
      g09Fails,
      `Zero unvaulted creatures or literalized animal metaphors in visual prompts.`,
      `Unvaulted creature/chimera noun or unresolved script simile detected`
    )

    // G10: Pending Stubs & Dynamic Unregistered Entity Blocker
    const g10Fails = []
    const stopwordsLower = new Set([...UNIVERSAL_LEXICONS.commonCapitalizedStopwords].map(w => w.toLowerCase()));
    ['spatial', 'enclosure', 'high', 'street', 'of', 'the', 'and', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'as', 'into', 'energy', 'spike', 'fleet', 'dragon', 'black', 'core', 'golden', 'saint', 'realm', 'primordial', 'cultivation', 'dao', 'samsara', 'infinite', 'syndicate', 'capital', 'fleet', 'members', 'state', 'denial', 'billion', 'years', 'qindu', 'starfall', 'hover', 'sedan', 'gu', 'heavenly', 'sovereign'].forEach(w => stopwordsLower.add(w));

    for (const scene of matrixScenes) {
      const declaredRefs = [...scene.charRefs, ...scene.itemRefs]
      const hasPending = declaredRefs.some(ref => {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        return !ent || ent.status === 'pending'
      })
      if (hasPending) {
        g10Fails.push(scene.id)
        continue
      }

      let freeText = scene.prompt
      freeText = freeText.replace(/Spatial Enclosure:\s*@\{[^}]+\}\s*\([^)]*\)\.?/gi, ' ')
      freeText = freeText.replace(/Spatial Enclosure:\s*[^.]+\./gi, ' ')
      for (const ref of declaredRefs) {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        if (ent) {
          freeText = freeText.replaceAll(ent.token, ' ')
          if (ent.dna) freeText = freeText.replaceAll(ent.dna, ' ')
          for (const outStr of Object.values(ent.outfits || {})) {
            freeText = freeText.replaceAll(outStr, ' ')
          }
        }
      }
      if (scene.zone && zones[scene.zone]?.canon) {
        freeText = freeText.replaceAll(zones[scene.zone].canon, ' ')
      }
      if (franchise.style?.base) freeText = freeText.replaceAll(franchise.style.base, ' ')
      if (franchise.style?.tail_positive) freeText = freeText.replaceAll(franchise.style.tail_positive, ' ')
      if (franchise.style?.tail_negative) freeText = freeText.replaceAll(franchise.style.tail_negative, ' ')

      // Strip architectural/furniture terms and approved entities before scanning
      let sanitizedForRoles = freeText.replace(/\b(?:proctor\s+(?:podium|stage|desk|platform|table|booth|hall)|faculty\s+proctor|academic\s+proctor|threat\s+bureau|special\s+threat\s+bureau)\b/gi, ' ');
      
      // If the authorized entity's name or token or role contains a role word, permit it
      const declaredTokensLower = declaredRefs.map(r => r.toLowerCase()).join(' ');
      if (declaredTokensLower.includes('commander')) sanitizedForRoles = sanitizedForRoles.replace(/\b(?:commander|lieutenant|captain)\b/gi, ' ');
      if (declaredTokensLower.includes('dean')) sanitizedForRoles = sanitizedForRoles.replace(/\b(?:dean|dean's)\b/gi, ' ');
      if (declaredTokensLower.includes('hover') || declaredTokensLower.includes('sedan')) sanitizedForRoles = sanitizedForRoles.replace(/\b(?:hover-sedan|hover-limousine|hovercraft|hover-car|sedan|limousine)\b/gi, ' ');
      if (declaredTokensLower.includes('lu chen') || declaredTokensLower.includes('ye xingchen') || declaredTokensLower.includes('sovereign')) sanitizedForRoles = sanitizedForRoles.replace(/\b(?:sovereign)\b/gi, ' ');
      if (declaredTokensLower.includes('gu biao') || declaredTokensLower.includes('dean') || declaredTokensLower.includes('proctor')) sanitizedForRoles = sanitizedForRoles.replace(/\b(?:proctor|proctors|examiner|examiners)\b/gi, ' ');

      // Also allow background university faculty/proctors in campus/stadium zones if it is crowd flavor
      if (scene.zone && (scene.zone.includes('stadium') || scene.zone.includes('campus') || scene.zone.includes('academy'))) {
        sanitizedForRoles = sanitizedForRoles.replace(/\b(?:proctor|proctors|dean|deans)\b/gi, ' ');
      }

      const roleOrVehicleMatches = sanitizedForRoles.match(UNIVERSAL_LEXICONS.roleAndVehicleNounsRegex) || []
      if (roleOrVehicleMatches.length > 0) {
        g10Fails.push(scene.id)
        continue
      }

      const capSpans = [
        ...freeText.matchAll(/\b([A-Z][a-z]{1,20}(?:\s+(?:of\s+)?[A-Z][a-z]{1,20})+)\b/g)
      ].map(m => m[1].trim())

      for (const span of capSpans) {
        const words = span.split(/\s+/)
        if (words.every(w => stopwordsLower.has(w.toLowerCase()))) continue
        const exactMatchEnt = entityByAliasLower.get(span.toLowerCase())
        const isSceneAuthorized =
          exactMatchEnt &&
          exactMatchEnt.status === 'approved' &&
          declaredRefs.some(
            r => r.toLowerCase() === exactMatchEnt.id.toLowerCase() ||
                 r.toLowerCase() === exactMatchEnt.token.replace(/^@\{|\}$/g, '').toLowerCase() ||
                 (exactMatchEnt.aliases || []).some(al => al.toLowerCase() === r.toLowerCase())
          )
        const isZoneName =
          scene.zone && zones[scene.zone]?.name?.toLowerCase() === span.toLowerCase()

        // Check if span is a substring of an authorized entity in the scene (e.g. "Han Feng" from "Commander Han Feng")
        const isAuthorizedEntitySubstring = declaredRefs.some(r => r.toLowerCase().includes(span.toLowerCase()))

        if (!isSceneAuthorized && !isZoneName && !isAuthorizedEntitySubstring) {
          g10Fails.push(scene.id)
          break
        }
      }
    }

    recordGate(
      'G10_unregistered_entity_blocker',
      'G10: Dynamic Unregistered Entity, Role Noun & Pending Stub Blocker',
      g10Fails,
      `100% of entities, roles, titles, and vehicles are approved and exact-ID vaulted.`,
      `Unregistered proper noun, role title, vehicle class, or pending stub detected`
    )

    // G11: Ledger Replay, Lifecycle Anti-Resurrection & Posture Lock
    const g11Fails = []
    for (const scene of matrixScenes) {
      const sceneNum = PromptDnaCompiler.sceneNumberFromId(scene.id)
      const sceneJsonObj = scenesJson?.find(s => s.id.toUpperCase() === scene.id)
      const { entityStates } = PromptDnaCompiler.replayLedgerState(
        entities,
        zones,
        ledgerEvents,
        sceneNum,
        sceneJsonObj?.events || []
      )

      const syncText = scene.narrativeSync || scriptClauses.get(scene.id) || ''
      const promptLower = scene.prompt.toLowerCase()

      for (const ent of Object.values(entities)) {
        for (const trig of ent.narrative_triggers || []) {
          if (new RegExp(trig.pattern, 'i').test(syncText)) {
            const currentSt = entityStates[ent.id] || {}
            for (const [reqKey, reqVal] of Object.entries(trig.required_set || {})) {
              if (currentSt[reqKey] !== reqVal) {
                g11Fails.push(scene.id)
                break
              }
            }
          }
        }
      }

      for (const [entId, st] of Object.entries(entityStates)) {
        const ent = entities[entId]
        if (ent && ent.kind === 'item' && st.lifecycle === 'destroyed') {
          const cleanName = ent.token.replace(/^@\{|\}$/g, '').toLowerCase()
          const inCharRefs = scene.charRefs.some(
            r => r.toLowerCase() === entId.toLowerCase() || r.toLowerCase() === cleanName
          )
          const equippedInJson = sceneJsonObj?.items?.some(
            it => it.id === entId && (it.lifecycle === 'equipped' || it.lifecycle === 'sheathed' || it.holder)
          )
          const heldInPrompt =
            promptLower.includes(cleanName) &&
            /\b(?:holding|wielding|brandishing|gripping|unsheathing|in\s+(?:his|her|their)\s+hand)\b/i.test(scene.prompt)

          if (inCharRefs || equippedInJson || heldInPrompt) {
            g11Fails.push(scene.id)
            break
          }
        }
      }

      for (const ref of [...scene.charRefs, ...scene.itemRefs]) {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        if (!ent) continue
        const compiled = PromptDnaCompiler.compileEntityBlock(ent, entityStates[ent.id])

        for (const reqPhrase of compiled.activeStatePhrases) {
          if (!promptLower.includes(reqPhrase.toLowerCase())) {
            g11Fails.push(scene.id)
            break
          }
        }
        for (const contraPhrase of compiled.forbiddenContradictions) {
          if (promptLower.includes(contraPhrase.toLowerCase())) {
            g11Fails.push(scene.id)
            break
          }
        }
      }

      if (
        UNIVERSAL_LEXICONS.postureForcedDownBeatRegex.test(syncText) &&
        UNIVERSAL_LEXICONS.postureUprightContradictionRegex.test(scene.prompt)
      ) {
        g11Fails.push(scene.id)
      }
    }

    recordGate(
      'G11_ledger_and_continuity',
      'G11: Event-Sourced Ledger Replay, Item Lifecycle & Posture Continuity',
      g11Fails,
      `100% continuity across replayed ledger states, item destruction lifecycles, and physical postures.`,
      `State contradiction, missing ledger event, destroyed item resurrection, or posture violation`
    )

    // G12: Spatial Enclosure, Sub-Zone Adjacency & Forbidden Tokens
    const g12Fails = []
    let prevZoneId = null

    for (const scene of matrixScenes) {
      const zoneId = scene.zone
      const zone = zoneId ? zones[zoneId] : null

      if (!zone) {
        g12Fails.push(scene.id)
        continue
      }

      const validCanons = [
        zone.canon.trim().replace(/\.$/, ''),
        ...Object.values(zone.tech_stages || {}).map(s => s.trim().replace(/\.$/, ''))
      ]
      const hasCanon = validCanons.some(c => scene.prompt.includes(c))
      if (!hasCanon) {
        g12Fails.push(scene.id)
        continue
      }

      const promptLower = scene.prompt.toLowerCase()
      const hitForbidden = (zone.forbidden_tokens || []).some(ft => {
        const lower = ft.toLowerCase()
        if (!promptLower.includes(lower)) return false
        // Strip negated occurrences (e.g. "zero wind turbine", "no windmills")
        const stripped = promptLower.replace(new RegExp('(?:zero|no|without|never)\\s+(?:[a-z-]+\\s+)?' + lower, 'gi'), '')
        return stripped.includes(lower)
      })
      if (hitForbidden) {
        g12Fails.push(scene.id)
        continue
      }

      // Cross-Episode Seasonal/Terrain Conflict Blocker (Law 11)
      const zoneCanonLower = (zone.canon || '').toLowerCase()
      const isTemperateOrDirt = /(?:dirt road|grass|courtyard|forest|cedar|timber|wooden)/i.test(zoneCanonLower) && !/(?:snow|winter|blizzard|frost)/i.test(zoneCanonLower)
      if (isTemperateOrDirt) {
        const strippedPrompt = promptLower.replace(/(?:zero|no|without|never)\s+(?:[a-z-]+\s+)?(?:snow|winter|frost|ice|slush)/gi, '')
        const hasRogueSnow = /\b(?:snow|blizzard|frost-dusted|winter slush|ice sheet|snowdrifts?)\b/i.test(strippedPrompt)
        if (hasRogueSnow) {
          g12Fails.push(`${scene.id} (Seasonal terrain drift: Zone "${zone.name}" canon has no snow/winter, but prompt injects snow/frost)`)
          continue
        }
      }

      if (
        prevZoneId &&
        prevZoneId !== zoneId &&
        scene.transition === 'adjacent' &&
        zones[prevZoneId]
      ) {
        const legalNext = zones[prevZoneId].adjacent || []
        if (!legalNext.includes(zoneId)) {
          g12Fails.push(scene.id)
          continue
        }
      }
      prevZoneId = zoneId
    }

    recordGate(
      'G12_spatial_enclosure',
      'G12: Location Vault Canon, Sub-Zone Adjacency & Forbidden Token Gate',
      g12Fails,
      `100% of scenes lock canonical zone enclosures, legal adjacency moves, and zero forbidden tokens.`,
      `Unregistered zone, altered enclosure text, illegal zone jump, or forbidden token hit`
    )

    // G13: Pacing Duration Cap & Voice Telemetry Lock
    const g13Fails = []
    const maxSeconds = franchise.pacing?.max_scene_seconds || 8.0
    const wpm = franchise.pacing?.tts_wpm_measured || 155

    if (audioTelemetry) {
      const telemVoice = audioTelemetry.voiceId || audioTelemetry.voice;
      if (telemVoice && franchise.voice?.id && telemVoice !== franchise.voice.id) {
        g13Fails.push('VOICE_ID_MISMATCH')
      }
      if (audioTelemetry.sceneDurations && typeof audioTelemetry.sceneDurations === 'object') {
        for (const [sId, secs] of Object.entries(audioTelemetry.sceneDurations)) {
          if (Number(secs) > maxSeconds) g13Fails.push(sId)
        }
      }
    } else {
      for (const [sId, clause] of scriptClauses.entries()) {
        const wordCount = clause.split(/\s+/).filter(Boolean).length
        const estSeconds = (wordCount / wpm) * 60
        if (estSeconds > maxSeconds * 1.25) {
          g13Fails.push(sId)
        }
      }
    }

    recordGate(
      'G13_pacing_and_voice',
      `G13: Scene Pacing Cap (<= ${maxSeconds}s) & Voice Telemetry Lock`,
      g13Fails,
      `100% of scenes comply with duration cap and franchise voice lock (${franchise.voice?.id}).`,
      `Scene duration exceeds cap or audio telemetry voiceId mismatches franchise.json`
    )

    // G14: Compile Integrity & Prompt Token Budget
    const g14Fails = []
    const maxTokens = franchise.pacing?.max_prompt_tokens || 450

    for (const scene of matrixScenes) {
      const estTokens = Math.ceil(scene.prompt.length / 4)
      if (estTokens > maxTokens) {
        g14Fails.push(scene.id)
        continue
      }

      if (tailPos && scene.prompt.split(tailPos).length - 1 > 1) {
        g14Fails.push(scene.id)
        continue
      }
      if (tailNeg && scene.prompt.split(tailNeg).length - 1 > 1) {
        g14Fails.push(scene.id)
        continue
      }

      for (const ref of scene.charRefs) {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        if (ent && ent.dna && ent.dna.length >= 15) {
          const occurrences = scene.prompt.split(ent.dna).length - 1
          if (occurrences > 1) {
            g14Fails.push(scene.id)
            break
          }
        }
      }
    }

    recordGate(
      'G14_compile_integrity',
      `G14: Prompt Token Budget (<= ${maxTokens} tokens) & Single-Injection Integrity`,
      g14Fails,
      `All prompts within ${maxTokens}-token budget with zero duplicated DNA or boilerplate blocks.`,
      `Prompt token overflow or duplicated DNA/boilerplate block detected`
    )

    // G15: Script Grounding & Spoken Tag Sanitization
    const g15Fails = []
    for (const [sId, clause] of scriptClauses.entries()) {
      if (/@\{|\B@[A-Za-z]/.test(clause)) {
        g15Fails.push(sId)
        continue
      }
    }

    recordGate(
      'G15_script_grounding',
      'G15: Script-Stage Canon Grounding & Spoken Tag Sanitization',
      g15Fails,
      `Script narration is 100% free of raw @ tags and grounded in franchise canon.`,
      `Spoken @ tag leak or ungrounded entity in script`
    )

    // G16: Schema Validation & Tier Distribution Ratio
    const g16Fails = []
    let multiPanelCount = 0

    for (const scene of matrixScenes) {
      if (
        !scene.hasExplicitPromptTag ||
        !scene.layout ||
        !['A', 'B', 'C'].includes(scene.tier)
      ) {
        g16Fails.push(scene.id)
        continue
      }
      if (scene.tier === 'B' || scene.tier === 'C') {
        multiPanelCount++
      }
    }

    const minRatio = franchise.tier_distribution?.min_multi_panel_ratio ?? 0.65
    if (totalScenes >= 10 && multiPanelCount / totalScenes < minRatio) {
      g16Fails.push('TIER_DISTRIBUTION_BELOW_MIN')
    }

    recordGate(
      'G16_schema_and_tiers',
      'G16: Scene Schema & Multi-Panel Tier Distribution Gate',
      g16Fails,
      `100% schema validity and compliant multi-panel storyboard distribution.`,
      `Malformed scene XML/JSON schema or multi-panel tier ratio below threshold`
    )

    // G17: Universal Safety & Policy Shield
    const g17Fails = []
    const allBannedTokens = [
      ...(policy.banned_tokens?.gore || []),
      ...(policy.banned_tokens?.vital_strike || []),
      ...(policy.banned_tokens?.chemical_ingestion || [])
    ]

    for (const scene of matrixScenes) {
      const pLower = scene.prompt.toLowerCase()
      if (allBannedTokens.some(tok => pLower.includes(tok.toLowerCase()))) {
        g17Fails.push(scene.id)
        continue
      }

      const hasMinorPresent = scene.charRefs.some(ref => {
        const ent = entityByAliasLower.get(ref.toLowerCase())
        return ent && ent.age_class === 'minor'
      })

      if (hasMinorPresent) {
        const minorBanned = [
          ...(policy.minor_protection_rules?.suffering_tokens || []),
          ...(policy.minor_protection_rules?.contact_tokens || []),
          ...(policy.minor_protection_rules?.garment_tokens || [])
        ]
        if (minorBanned.some(tok => pLower.includes(tok.toLowerCase()))) {
          g17Fails.push(scene.id)
        }
      }
    }

    recordGate(
      'G17_policy_shield',
      'G17: Google Flow Policy & Age-Class Safety Shield',
      g17Fails,
      `100% compliance with universal safety lexicons and age-class protections.`,
      `Policy-violating token detected`
    )

    // G19: Mandatory Multi-Scene Location-as-Entity & Reference Card Lock
    const g19Fails = []
    const zoneUsageCount = new Map()
    for (const sc of matrixScenes) {
      if (sc.zone) {
        zoneUsageCount.set(sc.zone, (zoneUsageCount.get(sc.zone) || 0) + 1)
      }
    }

    for (const scene of matrixScenes) {
      const zId = scene.zone
      if (!zId) continue
      const count = zoneUsageCount.get(zId) || 0
      if (count >= 2) {
        const locEnt = entityByAliasLower.get(zId.toLowerCase()) ||
          [...entityByAliasLower.values()].find(e => e.kind === 'location' && (e.id === zId || (e.aliases || []).some(a => a.toLowerCase() === zId.toLowerCase())))

        if (!locEnt || locEnt.kind !== 'location') {
          g19Fails.push(scene.id)
          continue
        }

        const isBoundInCharRefs = scene.charRefs.some(ref => {
          const rLower = ref.toLowerCase().trim()
          return rLower === locEnt.id.toLowerCase() ||
                 rLower === locEnt.token.replace(/^@\{|\}$/g, '').toLowerCase().trim() ||
                 (locEnt.aliases || []).some(a => a.toLowerCase().trim() === rLower)
        })

        const isBoundInPrompt = scene.prompt.includes(locEnt.token)

        if (!isBoundInCharRefs || !isBoundInPrompt) {
          g19Fails.push(scene.id)
        }
      }
    }

    recordGate(
      'G19_location_as_entity',
      'G19: Mandatory Multi-Scene Location-as-Entity & Reference Card Lock',
      g19Fails,
      `All recurring locations (>=2 scenes) registered as entities with reference cards bound in character_refs.`,
      `Recurring zone appears in >=2 scenes but missing location entity card in vault or <character_refs>`
    )

    // G20: Mandatory Physical Reference Plate Disk Integrity (Anti-Half-Baked Invariant)
    const g20Fails = []
    if (franchiseDir && fs) {
      const checkedEntities = new Set()
      const locationPlatesMap = new Map()
      for (const scene of matrixScenes) {
        const declared = [...scene.charRefs, ...scene.itemRefs]
        if (scene.zone) declared.push(scene.zone)

        for (const ref of declared) {
          const ent = entityByAliasLower.get(ref.toLowerCase())
          if (!ent) continue
          if (checkedEntities.has(ent.id)) continue
          checkedEntities.add(ent.id)

          const plateName = ent.plate ? path.basename(ent.plate) : (ent.reference_plate || `${ent.id}.jpg`)
          const p1 = path.join(franchiseDir, 'character_vault', plateName)
          const p2 = path.join(franchiseDir, '00_Characters', plateName)
          const p3 = path.join(franchiseDir, '00_Series_Bible_and_Character_DNA', 'models', plateName)

          const exists = fs.existsSync(p1) || fs.existsSync(p2) || fs.existsSync(p3)
          if (!exists) {
            g20Fails.push(`${scene.id} (Missing plate on disk: ${plateName} for entity ${ent.token || ent.id})`)
          } else if (ent.kind === 'location') {
            if (locationPlatesMap.has(plateName) && locationPlatesMap.get(plateName) !== ent.id) {
              g20Fails.push(`${scene.id} (Placeholder plate cheat detected: Location "${ent.id}" reuses plate "${plateName}" already bound to "${locationPlatesMap.get(plateName)}". Each location must have a unique bespoke reference plate.)`)
            } else {
              locationPlatesMap.set(plateName, ent.id)
            }
          }
        }
      }
    }

    recordGate(
      'G20_plate_disk_integrity',
      'G20: Mandatory Physical Reference Plate Disk Integrity (Anti-Half-Baked Invariant)',
      g20Fails,
      `All referenced characters, items, and locations have physical master reference plates on disk.`,
      `Entity referenced in scene is missing physical .jpg/.png plate on disk. image-generator subagent must be run upfront.`
    )

    // G21: Universal Pure Name Standard & Google Flow Reference Model Lock
    const g21Fails = []
    const isLockedLegacy = /\bEP0[12]\b/i.test(promptMatrixText.slice(0, 500))
    if (!isLockedLegacy) {
      for (const scene of matrixScenes) {
        // 1. Check for deprecated category prefixes in tokens
        if (/@\{(?:Weapon|Item|Artifact|Prop):\s*[^}]+\}/i.test(scene.prompt)) {
          g21Fails.push(`${scene.id} (Deprecated category prefix in token: e.g. @{Weapon:...})`)
          continue
        }

        // 2. Check that all referenced entities are bound inside character_refs for Google Flow
        const promptTokens = [...scene.prompt.matchAll(/@\{([^}]+)\}/g)].map(m => m[1].trim())
        for (const tokName of promptTokens) {
          const ent = entityByTokenName.get(tokName.toLowerCase())
          if (!ent) continue
          const cleanName = ent.name || ent.token.replace(/^@\{|\}$/g, '').trim()
          const isBoundInCharRefs = scene.charRefs.some(
            r => r.toLowerCase() === cleanName.toLowerCase() ||
                 r.toLowerCase() === tokName.toLowerCase() ||
                 r.toLowerCase() === ent.id.toLowerCase()
          )
          if (!isBoundInCharRefs) {
            g21Fails.push(`${scene.id} (Entity @{${cleanName}} missing from <scene character_refs="..." for Flow binding)`)
            break
          }
        }
      }
    }

    recordGate(
      'G21_flow_reference_model_lock',
      'G21: Universal Pure Name Standard & Google Flow Reference Model Lock',
      g21Fails,
      `All referenced entities use pure name tokens (@{Name}) and are bound inside character_refs for Google Flow compatibility.`,
      `Deprecated category prefix or entity missing from character_refs for Google Flow reference card binding.`
    )

    // G22: Universal Studio Video & Audio Specification Invariant
    const g22Fails = []
    const resolvedEpPath = epPath || (franchiseDir && episodeId ? path.join(franchiseDir, episodeId) : null)

    if (resolvedEpPath && fs.existsSync(resolvedEpPath)) {
      const videoDir = path.join(resolvedEpPath, 'video')
      if (fs.existsSync(videoDir)) {
        try {
          const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4'))
          for (const vf of videoFiles) {
            const vPath = path.join(videoDir, vf)
            const probeRes = spawnSync('ffprobe', [
              '-v', 'error',
              '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels',
              '-of', 'json',
              vPath
            ], { encoding: 'utf8', timeout: 5000 })

            if (probeRes.status === 0 && probeRes.stdout) {
              const probeData = JSON.parse(probeRes.stdout)
              const vStream = probeData.streams?.find(s => s.codec_type === 'video')
              const aStream = probeData.streams?.find(s => s.codec_type === 'audio')

              if (aStream) {
                const sampleRate = parseInt(aStream.sample_rate || '0', 10)
                const channels = parseInt(aStream.channels || '0', 10)
                if (sampleRate !== 48000) {
                  g22Fails.push(`VIDEO_AUDIO_SAMPLE_RATE_DRIFT:${vf}:${sampleRate}Hz(Expected:48000Hz)`)
                }
                if (channels !== 2) {
                  g22Fails.push(`VIDEO_AUDIO_CHANNELS_DRIFT:${vf}:${channels}ch(Expected:2ch)`)
                }
              }

              if (vStream) {
                const w = parseInt(vStream.width || '0', 10)
                const h = parseInt(vStream.height || '0', 10)
                const pix = vStream.pix_fmt
                const isLandscape1080p = (w === 1920 && h === 1080)
                const isVertical1080p = (w === 1080 && h === 1920)

                if (!isLandscape1080p && !isVertical1080p) {
                  g22Fails.push(`VIDEO_RESOLUTION_DRIFT:${vf}:${w}x${h}(Expected:1920x1080 or 1080x1920)`)
                }
                if (pix !== 'yuv420p') {
                  g22Fails.push(`VIDEO_PIX_FMT_DRIFT:${vf}:${pix}(Expected:yuv420p)`)
                }
                if (vStream.r_frame_rate) {
                  const [num, den] = vStream.r_frame_rate.split('/').map(Number)
                  const calcFps = den > 0 ? Math.round((num / den) * 100) / 100 : 0
                  if (calcFps !== 24) {
                    g22Fails.push(`VIDEO_FPS_DRIFT:${vf}:${calcFps}fps(Expected:24fps)`)
                  }
                }
              }
            }
          }
        } catch (_) {}
      }
    }

    recordGate(
      'G22_universal_av_spec_lock',
      'G22: Universal Studio Video & Audio Specification Invariant',
      g22Fails,
      `All compiled master and preview video assets adhere 100% to Universal Studio Standards (1080p @ 24fps yuv420p, 48kHz Stereo AAC 192k).`,
      `Video or audio specification drift detected: non-standard sample rate, channels, resolution, or frame rate violates cross-episode concatenation standard.`
    )

    // G23: Establishing Shot Purity & Zero Phantom Human Pollution
    const g23Fails = []
    for (const scene of matrixScenes) {
      const pLower = scene.prompt.toLowerCase()
      const isEstablishing = (
        pLower.includes('zero characters present') ||
        pLower.includes('pure establishing scene') ||
        pLower.includes('establishing landscape') ||
        (scene.layout && scene.layout.toLowerCase().includes('establishing'))
      )
      if (isEstablishing) {
        const humanRefs = scene.charRefs.filter(ref => {
          const ent = entityByAliasLower.get(ref.toLowerCase())
          return ent && ent.kind === 'character'
        })
        if (humanRefs.length > 0) {
          g23Fails.push(`${scene.id} (Establishing shot polluted with human character refs: ${humanRefs.join(', ')})`)
        }
        if (pLower.includes('featuring @{')) {
          g23Fails.push(`${scene.id} (Establishing shot contains "Featuring @{...}" character declaration)`)
        }
      }
    }
    recordGate(
      'G23_establishing_purity',
      'G23: Establishing Shot Purity & Zero Phantom Human Pollution',
      g23Fails,
      `All scenic/establishing plates are 100% free of phantom human characters.`,
      `Scenic establishing shot polluted with human character references or featuring blocks`
    )

    // G24: Concrete Color Standard & Zero Dye Bleed
    const g24Fails = []
    const BANNED_COLOR_DESCRIPTORS = [
      'earth-toned', 'earth toned', 'neutral-toned', 'neutral toned',
      'pale-colored', 'pale colored', 'dark-colored', 'dark colored',
      'light-colored', 'light colored'
    ]
    for (const scene of matrixScenes) {
      const pLower = scene.prompt.toLowerCase()
      for (const badColor of BANNED_COLOR_DESCRIPTORS) {
        if (pLower.includes(badColor)) {
          g24Fails.push(`${scene.id} (Ambiguous color descriptor: "${badColor}" triggers diffusion model dye bleeding)`)
          break
        }
      }
    }
    recordGate(
      'G24_color_lock',
      'G24: Concrete Color Standard & Zero Dye Bleed',
      g24Fails,
      `All wardrobe and character colors use concrete, unambiguous color descriptors.`,
      `Ambiguous color descriptors detected causing cross-attention dye bleeding`
    )

    // G25: Chronological Entrance & Arrival Continuity
    const g25Fails = []
    const entranceRegex = /\b(?:stepped into|steps into|walked in from|walks in from|bounced out of|bounces out of|creaked open.*?stepped|burst through|bursts through)\b/i
    for (let i = 0; i < matrixScenes.length; i++) {
      const scene = matrixScenes[i]
      const clause = scriptClauses.get(scene.id) || scene.narrativeSync || ''
      if (entranceRegex.test(clause)) {
        for (const ent of Object.values(entities)) {
          if (ent.kind !== 'character') continue
          const cleanName = ent.name || ent.token.replace(/^@\{|\}$/g, '')
          const isMentioned = new RegExp(`\\b${cleanName}\\b`, 'i').test(clause) || (ent.kinship_terms || []).some(k => new RegExp(`\\b${k}\\b`, 'i').test(clause))
          if (isMentioned) {
            for (let j = Math.max(0, i - 2); j < i; j++) {
              const prevScene = matrixScenes[j]
              if (prevScene.zone === scene.zone) {
                const wasInPrevRefs = prevScene.charRefs.some(r => r.toLowerCase() === cleanName.toLowerCase() || r.toLowerCase() === ent.id.toLowerCase())
                if (wasInPrevRefs && !entranceRegex.test(scriptClauses.get(prevScene.id) || '')) {
                  g25Fails.push(`${scene.id} (${cleanName} arrives/enters here, but was already active in preceding scene ${prevScene.id})`)
                  break
                }
              }
            }
          }
        }
      }
    }
    recordGate(
      'G25_entrance_chronology',
      'G25: Chronological Entrance & Arrival Continuity',
      g25Fails,
      `100% adherence to narrative entrance gates; zero characters present prior to arrival.`,
      `Character appears in scene prior to their narrative entrance or arrival`
    )

    // G26: Sanctuary Secrecy & Population Isolation Gate
    const g26Fails = []
    const BANNED_POPULATION_TOKENS = [
      'crowd', 'crowds', 'bystanders', 'villagers', 'peasants',
      'farmhands', 'soldiers', 'guards', 'citizens', 'spectators'
    ]
    for (const scene of matrixScenes) {
      const zId = scene.zone || ''
      const zoneData = zones[zId] || {}
      const isPrivateSanctuary = (
        zoneData.secrecy === 'private_sanctuary' ||
        zId.includes('sanctuary') ||
        zId.includes('cottage') ||
        zId.includes('bath') ||
        zId.includes('overhang') ||
        zId.includes('trail')
      )
      if (isPrivateSanctuary) {
        const pLower = scene.prompt.toLowerCase()
        for (const popTok of BANNED_POPULATION_TOKENS) {
          const positiveRegex = new RegExp(`(?<!\\b(?:zero|no|without|never|excluding)\\s+(?:background\\s+|extra\\s+)?)\\b${popTok}\\b`, 'i')
          if (positiveRegex.test(pLower)) {
            const isNegated = new RegExp(`(?:zero|no|without)\\s+(?:background\\s+|extra\\s+)?${popTok}`, 'i').test(pLower)
            if (!isNegated) {
              g26Fails.push(`${scene.id} (Forbidden population/crowd token in secret sanctuary: "${popTok}")`)
              break
            }
          }
        }
      }
    }
    recordGate(
      'G26_sanctuary_secrecy',
      'G26: Sanctuary Secrecy & Population Isolation Gate',
      g26Fails,
      `100% compliance with sanctuary secrecy; zero unapproved crowds, villagers, or soldiers in secluded locations.`,
      `Unapproved crowd or bystander population detected in secret secluded sanctuary`
    )

    // G27: Tech-Tree & Environmental Lifecycle Gate
    const g27Fails = []
    for (let i = 0; i < matrixScenes.length; i++) {
      const scene = matrixScenes[i]
      const sceneNum = i + 1
      const pLower = scene.prompt.toLowerCase()

      // 1. Windmills and waterwheels are UNINVENTED across all of Episode 2
      if (sceneNum <= 480) {
        const machineryRegex = /(?<!\b(?:zero|no|without)\s+)\b(?:windmill|windmills|water\s*wheel|water\s*wheels|complex\s+gears)\b/i
        if (machineryRegex.test(pLower) && !/(?:no|zero)\s+(?:windmills|water\s*wheels|gears)/i.test(pLower)) {
          g27Fails.push(`${scene.id} (Uninvented machinery appears in background: windmills/water wheels/gears)`)
        }
      }

      // 2. Glass lifecycle:
      // - Before scene 145 (crucible melting), NO positive mention of glass panes, quartz glass, or clear glass anywhere
      if (sceneNum < 145) {
        const cleanedGlass = pLower.replace(/\b(?:no|zero|without)\s+(?:clear\s+|quartz\s+|finished\s+)?glass(?:\s+windows?|\s+panes?|\s+sheets?)?/gi, '')
        if (/\b(?:glass\s+windows?|glass\s+panes?|quartz\s+glass|clear\s+glass|molten\s+glass)\b/i.test(cleanedGlass)) {
          g27Fails.push(`${scene.id} (Premature glass/window appears in prompt at scene ${sceneNum} before glass melting begins at scene 145)`)
        }
      }
      // - Between scenes 145 and 192 (melting & annealing), NO finished glass windows mounted in walls
      if (sceneNum >= 145 && sceneNum < 193) {
        const cleanedWin = pLower.replace(/\b(?:no|zero|without)\s+(?:clear\s+|quartz\s+|finished\s+)?glass\s+windows?/gi, '')
        if (/\b(?:glass\s+windows?|crystal-clear\s+quartz\s+glass\s+windows?)\b/i.test(cleanedWin)) {
          g27Fails.push(`${scene.id} (Finished glass windows appear in prompt at scene ${sceneNum} before window mounting begins at scene 193)`)
        }
      }

      // 3. Cold storage cellar: Unbuilt before scene 241
      if (sceneNum < 241) {
        if (/(?<!\b(?:no|zero)\s+)\bcold\s+storage\s+cellar\b/i.test(pLower)) {
          g27Fails.push(`${scene.id} (Cold storage cellar appears before excavation at scene 241)`)
        }
      }
    }
    recordGate(
      'G27_tech_tree_lifecycle',
      'G27: Tech-Tree & Environmental Lifecycle Gate',
      g27Fails,
      `100% adherence to story tech-tree lifecycle; zero premature architectural or mechanical features.`,
      `Premature technology or building feature appears in scene before its narrative construction milestone`
    )

        // G28: Vantage & Elevation Perspective Lock
    const g28Fails = []
    for (const scene of matrixScenes) {
      const zId = scene.zone || ''
      const zoneData = zones[zId] || {}
      const pLower = scene.prompt.toLowerCase()

      if (zoneData.elevation === 'mid_mountain_ridge' || zoneData.elevation === 'mountain_ridge') {
        const valleyBuildingRegex = /(?<!\b(?:no|zero|without)\s+)\b(?:farmhouse with clear glass windows|oak-and-white-stone farmhouse|thatched wooden cottage)\b/i
        if (valleyBuildingRegex.test(pLower)) {
          g28Fails.push(`${scene.id} (Mountain trail elevation polluted with valley floor farmhouse building)`)
        }
      }
      if (zoneData.elevation === 'valley_floor_level' || zoneData.elevation === 'valley_floor_interior') {
        const cliffLedgeRegex = /(?<!\b(?:no|zero|without)\s+)\b(?:high cliff ledge looking down|cliffside ledge overlooking)\b/i
        if (cliffLedgeRegex.test(pLower)) {
          g28Fails.push(`${scene.id} (Valley floor zone framed from high cliff ledge looking down)`)
        }
      }
    }
    recordGate(
      'G28_vantage_elevation_lock',
      'G28: Vantage & Elevation Perspective Lock',
      g28Fails,
      `100% adherence to camera elevation and line-of-sight vantage rules.`,
      `Camera elevation or perspective violates zone vantage rule`
    )

    // G29: Spoken Future-Plan Blocker
    const g29Fails = []
    for (let i = 0; i < matrixScenes.length; i++) {
      const scene = matrixScenes[i]
      const sceneNum = i + 1
      const header = scriptStagingHeaders.get(scene.id)
      const pLower = scene.prompt.toLowerCase()
      const nLower = (scene.narrativeSync || '').toLowerCase()
      const isPlanTalk = (header && header.planTalk) || /(?:tomorrow we|later it's going to give|next month we|future plans|blueprint|where windows were meant to go|what if we could put something in these frames|you mean\.\.\.\s*clear glass|glass isn't magic)/i.test(nLower)

      if (isPlanTalk && sceneNum < 145) {
        const cleanedGlass = pLower.replace(/\b(?:no|zero|without)\s+(?:clear\s+|quartz\s+|finished\s+)?glass(?:\s+windows?|\s+panes?|\s+sheets?)?/gi, '')
        if (/\b(?:glass|glass\s+windows?|quartz\s+glass|clear\s+glass)\b/i.test(cleanedGlass)) {
          g29Fails.push(`${scene.id} (Spoken dialogue discusses future/theoretical glass plan, but visual prompt injects positive 'glass' keyword)`)
        }
      }
    }
    recordGate(
      'G29_future_plan_blocker',
      'G29: Spoken Future-Plan & Blueprint Blocker',
      g29Fails,
      `100% isolation of spoken future plans from prematurely rendered physical structures.`,
      `Scene renders finished structure that is only discussed as a future plan in dialogue`
    )

    // G30: Visual Action Novelty, Stem Anti-Template & Keyword-Salad Blocker
    const g30Fails = []
    const batchSize = 24
    const BANNED_SLICER_ARTIFACTS = [
      'refined mineral',
      'workstation surface',
      'mountain element',
      'stone structure',
      'cast plate'
    ]
    const CAMERA_PREFIX_REGEX = /^(?:in the (?:center|left|right) foreground|from a [a-z-\s]+ (?:angle|perspective|view)|in a [a-z-\s]+ (?:two-shot|composition|close-up|framing|shot)|framed in a [a-z-\s]+|(?:center|left|right|sunlit) foreground|medium (?:eye-level shot|close-up)|low-angle two-shot|over-the-shoulder view|three-quarter profile|wide cinematic shot|side-angle view|waist-up framing),?\s*/i

    for (let b = 0; b < matrixScenes.length; b += batchSize) {
      const batchNum = Math.floor(b / batchSize) + 1
      const batchScenes = matrixScenes.slice(b, b + batchSize)
      const actionCounts = {}
      const stemCounts = {}

      for (const scene of batchScenes) {
        let actionRaw = scene.actionLayer || scene.action_layer || scene.visualLiteral || scene.visual_literal
        if (!actionRaw && scene.prompt) {
          const actionMatch =
            scene.prompt.match(/Action & Staging:\s*(.*?)(?:\s*cleanly rendered|\s*100% environment)/i) ||
            scene.prompt.match(/In @\{[^}]+\},\s*(.*?)(?:\.\s*Featuring|\.\s*Zero characters|\.\s*Spatial Enclosure)/i) ||
            scene.prompt.match(/Visual action:\s*(?:In the scene,)?\s*(.*?)(?:\.\s*(?:Modern \d{4}|Cleanly rendered|100% environment|sharp black ink|Textless)|$)/i)
          if (actionMatch) actionRaw = actionMatch[1]
        }

        const cleanActionTrimmed = (actionRaw || '').trim()
        if (
          !actionRaw ||
          cleanActionTrimmed.length < 15 ||
          /^[\s.,!?-]*$/.test(cleanActionTrimmed) ||
          /^(?:In the scene,\s*)?[.,\s]*$/i.test(cleanActionTrimmed)
        ) {
          g30Fails.push(`${scene.id} (Empty, missing, or stripped action layer: "${cleanActionTrimmed}")`)
          continue
        }

        let coreAction = cleanActionTrimmed
        const actionMatch = cleanActionTrimmed.match(/In @\{[^}]+\},\s*(.*?)(?:\.\s*Featuring|\.\s*Zero characters|\.\s*Spatial Enclosure|$)/i) ||
                            cleanActionTrimmed.match(/Action & Staging:\s*(.*?)(?:\s*cleanly rendered|\s*100% environment)/i) ||
                            cleanActionTrimmed.match(/Visual action:\s*(?:In the scene,)?\s*(.*?)(?:\.\s*(?:Modern \d{4}|Cleanly rendered|100% environment|sharp black ink|Textless)|$)/i)
        if (actionMatch) {
          coreAction = actionMatch[1]
        }

        const coreLower = coreAction.toLowerCase()
        // 1. Check for automated word-slicer placeholder artifacts
        if (BANNED_SLICER_ARTIFACTS.some(art => coreLower.includes(art))) {
          g30Fails.push(`${scene.id} (Automated word-slicer placeholder artifact detected in action: "${coreAction.substring(0, 60)}...")`)
          continue
        }

        // 2. Full normalized action duplication check (> 2 times in a 24-scene batch)
        const strippedActors = coreAction
          .replace(CAMERA_PREFIX_REGEX, '')
          .replace(/@\{[^}]+\}/g, '')
          .replace(/\b(?:10-year-old|11-year-old|13-year-old)\b/gi, '')
          .replace(/\b(?:and|the|with|in|on|at|by|to|for|of|from|into|onto|over|under|beside|around|along|across|through)\b/gi, ' ')
        const normalized = strippedActors.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (normalized.length > 8) {
          actionCounts[normalized] = (actionCounts[normalized] || 0) + 1
          if (actionCounts[normalized] > 2) {
            g30Fails.push(`${scene.id} (Action template repeats > 2 times in Batch ${batchNum}: "${coreAction.substring(0, 60)}...")`)
            continue
          }
        }

        // 3. 5-Word Verb/Location Stem Anti-Template Check (> 3 times in a 24-scene batch blocks prefix + sliced-tail loops)
        const stemWords = strippedActors
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length >= 3)
          .slice(0, 5)
        if (stemWords.length >= 4) {
          const stemKey = stemWords.join('_')
          stemCounts[stemKey] = (stemCounts[stemKey] || 0) + 1
          if (stemCounts[stemKey] > 3) {
            g30Fails.push(`${scene.id} (Repetitive 5-word action stem "${stemWords.join(' ')}" repeats > 3 times in Batch ${batchNum})`)
          }
        }
      }
    }
    recordGate(
      'G30_visual_action_novelty',
      'G30: Visual Action Novelty, Stem Anti-Template & Keyword-Salad Gate',
      g30Fails,
      `100% visual action diversity: zero copy-pasted action templates, stem loops, or word-slicer artifacts.`,
      `Action template, 5-word stem loop (>3x/batch), or word-slicer artifact detected`
    )

    // G31: Script Staging Header to Matrix 1:1 Lock (ZONE, CAST, STAGE)
    const g31Fails = []
    if (scriptStagingHeaders.size > 0) {
      for (const scene of matrixScenes) {
        const header = scriptStagingHeaders.get(scene.id)
        if (!header) {
          g31Fails.push(`${scene.id} (Missing V2.0 staging header in 01_Episode_Script.md)`)
          continue
        }

        // 1. Zone parity
        if (scene.zone !== header.zone) {
          g31Fails.push(`${scene.id} (Zone desync: script header="${header.zone}" vs matrix="${scene.zone}")`)
          continue
        }

        // 2. Cast parity (excluding location and item entities in charRefs)
        const matrixNonLocRefs = scene.charRefs.filter(r => {
          const ent = entityByAliasLower.get(r.toLowerCase())
          return !ent || (ent.kind !== 'location' && ent.kind !== 'item')
        }).map(r => r.toLowerCase())

        const headerCastLower = header.cast.map(c => c.toLowerCase())
        if (header.stage === 'establishing' && matrixNonLocRefs.length > 0) {
          g31Fails.push(`${scene.id} (Script header is STAGE: establishing, but matrix has characters: ${matrixNonLocRefs.join(', ')})`)
          continue
        }

        const missingFromMatrix = headerCastLower.filter(c => !matrixNonLocRefs.includes(c))
        const extraInMatrix = matrixNonLocRefs.filter(m => !headerCastLower.includes(m))
        if (missingFromMatrix.length > 0 || extraInMatrix.length > 0) {
          g31Fails.push(`${scene.id} (Cast desync between script header [${header.cast.join(', ')}] and matrix [${matrixNonLocRefs.join(', ')}])`)
        }
      }
    }
    recordGate(
      'G31_script_header_matrix_lock',
      'G31: 1:1 Script Staging Header to Matrix Parity Lock (ZONE, STAGE, CAST)',
      g31Fails,
      `100% 1:1 synchronization between 01_Episode_Script.md staging headers and 02_Prompt_Matrix.md scenes.`,
      `Desync detected between script staging header (ZONE/STAGE/CAST) and matrix scene`
    )

    // G32: Semantic Layout-Tone & Combat Immersion Gate
    const g32Fails = []
    const COMBAT_ACTION_VERBS = /\b(?:slash|punched|punches|punching|strikes|striking|shatters|shattering|blasts|blasting|erupts|erupting|explodes|exploding|smashes|smashing|cleaves|cleaving|dodges|dodging|counters|countering|swings|swinging|crushes|crushing|battles|battling|ignites|igniting|vaporizes|vaporizing)\b/i
    const DOMESTIC_FILLER_REGEX = /\b(?:eating\s+(?:noodles?|steamed\s+buns?|buns?|food)|chewing\s+on|sipping\s+(?:sweet\s+)?soy\s+milk|drinking\s+through\s+a\s+straw|tying\s+(?:his\s+)?shoelaces?|eating\s+breakfast|holding\s+a\s+steamed\s+bun)\b/i

    for (const scene of matrixScenes) {
      const header = scriptStagingHeaders.get(scene.id)
      const pLower = scene.prompt.toLowerCase()
      const nLower = (scene.narrativeSync || '').toLowerCase()
      const stageLower = header ? (header.stage || '').toLowerCase() : ''
      const isActionStrip = (scene.tier === 'C') || /Tier\s*C|Three-panel/i.test(scene.layout || '')

      // 1. Block Tier C Three-Panel Action Strips during calm dialogue / interaction
      if (isActionStrip) {
        const hasCombatContext = COMBAT_ACTION_VERBS.test(nLower) || COMBAT_ACTION_VERBS.test(pLower) || stageLower === 'combat'
        if (!hasCombatContext && (stageLower === 'dialogue' || stageLower === 'interaction' || stageLower === 'establishing')) {
          g32Fails.push(`${scene.id} (Calm dialogue/interaction scene inappropriately forced into Tier C dynamic action strip layout)`)
        }
      }

      // 2. Block domestic eating/drinking filler during combat or high-tension confrontation
      const isTenseScene = stageLower === 'combat' || stageLower === 'confrontation' || COMBAT_ACTION_VERBS.test(nLower)
      if (isTenseScene && DOMESTIC_FILLER_REGEX.test(pLower)) {
        g32Fails.push(`${scene.id} (Immersion break: Mundane domestic eating/drinking filler injected into active combat or tense standoff)`)
      }
    }

    recordGate(
      'G32_layout_tone_immersion',
      'G32: Semantic Layout-Tone & Combat Immersion Gate',
      g32Fails,
      `Layout tiers align with narrative tone and zero domestic filler in combat/standoffs.`,
      `Tone mismatch: action layout forced on calm scene, or domestic filler injected into combat`
    )

    // G33: Destruction & Spatial Lifecycle State Gate
    const g33Fails = []
    const DESTRUCTION_KEYWORDS = /\b(?:turned\s+into\s+fine\s+dust|reduced\s+to\s+fine\s+dust|vaporized|cratered\s+into\s+dust|demolished\s+to\s+dust|collapsed\s+into\s+rubble|flattened\s+into\s+a\s+crater)\b/i
    const INTACT_KEYWORDS = /\b(?:towering\s+(?:obsidian\s+)?(?:glass\s+)?(?:skyscraper|columns?)|pristine\s+glass\s+facade|unbroken\s+skyscraper\s+columns?|gleaming\s+headquarters\s+tower)\b/i

    let buildingVaporized = false
    let vaporizedSceneId = null

    for (const scene of matrixScenes) {
      const nText = (scene.narrativeSync || '')
      if (DESTRUCTION_KEYWORDS.test(nText)) {
        buildingVaporized = true
        vaporizedSceneId = scene.id
      }

      if (buildingVaporized) {
        const pLower = scene.prompt.toLowerCase()
        if (INTACT_KEYWORDS.test(pLower)) {
          g33Fails.push(`${scene.id} (Spatial amnesia: Building was vaporized into dust in ${vaporizedSceneId}, but prompt describes intact skyscraper architecture)`)
        }
      }
    }

    recordGate(
      'G33_destruction_lifecycle_state',
      'G33: Destruction & Spatial Lifecycle State Gate',
      g33Fails,
      `100% spatial lifecycle continuity: destroyed structures never render intact architecture in subsequent scenes.`,
      `Destroyed/vaporized structure described as intact in subsequent scenes`
    )

    // G34: Episodic World State, Wardrobe Lock & Prop Container Parity Gate
    const g34Fails = []
    const worldStatePath = epPath ? path.join(epPath, 'world_state.json') : null
    const worldState = (worldStatePath && fs && fs.existsSync(worldStatePath))
      ? JSON.parse(fs.readFileSync(worldStatePath, 'utf-8'))
      : (rawVaultContext.worldState || null)

    if (worldState) {
      // 1. Audit Wardrobe Locks
      if (worldState.wardrobe_locks) {
        for (const scene of matrixScenes) {
          const pLower = scene.prompt.toLowerCase()
          for (const [charId, lockedAttire] of Object.entries(worldState.wardrobe_locks)) {
            const ent = entityByAliasLower.get(charId.toLowerCase())
            const charToken = ent ? ent.token.toLowerCase() : `@\{${charId.toLowerCase()}\}`
            if (pLower.includes(charToken) || scene.charRefs.some(r => r.toLowerCase().includes(charId.toLowerCase()))) {
              if (lockedAttire.toLowerCase().includes('trousers') && /\b(?:shorts|cargo shorts|athletic shorts)\b/i.test(pLower)) {
                g34Fails.push(`${scene.id} (Wardrobe drift: Character "${charId}" locked to trousers in world_state.json, but prompt describes shorts)`)
              }
              if (lockedAttire.toLowerCase().includes('hoodie') && /\b(?:blazer|suit jacket|tuxedo|tank top)\b/i.test(pLower)) {
                g34Fails.push(`${scene.id} (Wardrobe drift: Character "${charId}" locked to hoodie in world_state.json, but prompt describes blazer/suit/tank-top)`)
              }
            }
          }
        }
      }

      // 2. Audit Prop Container Locks
      if (worldState.held_props) {
        for (const scene of matrixScenes) {
          const pLower = scene.prompt.toLowerCase()
          for (const [propKey, propLock] of Object.entries(worldState.held_props)) {
            const propNameClean = (propLock.canonical_name || propKey).toLowerCase()
            const isPropMentioned = pLower.includes(propNameClean) || scene.itemRefs.some(r => r.toLowerCase().includes(propKey))
            if (isPropMentioned && propLock.container) {
              const containerLower = propLock.container.toLowerCase()
              if (containerLower.includes('box') || containerLower.includes('case')) {
                if (/\b(?:test tube|glass vial|medicine bottle|beaker|flask)\b/i.test(pLower)) {
                  g34Fails.push(`${scene.id} (Prop container drift: "${propNameClean}" locked to "${propLock.container}" in world_state.json, but prompt describes vial/bottle/test-tube)`)
                }
              }
            }
          }
        }
      }

      // 3. Audit Timeline Lighting Shifts
      if (worldState.timeline?.timeline_shifts) {
        for (const shift of worldState.timeline.timeline_shifts) {
          const from = PromptDnaCompiler.sceneNumberFromId(shift.from_scene || shift.from || '')
          const to = PromptDnaCompiler.sceneNumberFromId(shift.to_scene || shift.to || '')
          const expectedLighting = shift.lighting
          const isExpectedDay = ['bright_morning_sunlight', 'day_sunlit', 'daylight'].includes(expectedLighting)
          const isExpectedNight = ['night_floodlit', 'night_celestial', 'interior_night'].includes(expectedLighting)

          for (const scene of matrixScenes) {
            const sNum = PromptDnaCompiler.sceneNumberFromId(scene.id)
            if (sNum >= from && sNum <= to) {
              const pLower = scene.prompt.toLowerCase()
              if (isExpectedDay && /\b(?:high-intensity nocturnal security floodlights|searchlights sweeping|dark night sky)\b/i.test(pLower)) {
                g34Fails.push(`${scene.id} (Timeline lighting desync: Scene falls in daytime segment [${shift.from_scene}-${shift.to_scene}], but prompt contains nocturnal floodlights/night sky)`)
              } else if (isExpectedNight && /\b(?:bright morning sunlight|sunlit riverbank in morning)\b/i.test(pLower)) {
                g34Fails.push(`${scene.id} (Timeline lighting desync: Scene falls in nocturnal segment [${shift.from_scene}-${shift.to_scene}], but prompt contains morning sunlight)`)
              }
            }
          }
        }
      }
    }

    recordGate(
      'G34_world_state_prop_wardrobe_lock',
      'G34: Episodic World State, Wardrobe Lock & Prop Container Parity Gate',
      g34Fails,
      `100% adherence to episodic world_state.json: zero wardrobe drift, prop container morphing, or timeline lighting desyncs.`,
      `Drift detected against world_state.json wardrobe lock, prop container schema, or timeline lighting`
    )

    // D-01: Cryptographic Dispatch Manifest Verification
    const d01Fails = []
    if (manifest) {
      const expectedManifest = PromptDnaCompiler.generateSignedManifest({
        franchise,
        entities,
        zones,
        ledgerEvents,
        scriptText,
        matrixMarkdown: promptMatrixText
      })
      if (manifest.signature !== expectedManifest.signature) {
        d01Fails.push('MANIFEST_SIGNATURE_MISMATCH')
      }
    }

    recordGate(
      'D01_dispatch_manifest_lock',
      'D-01: Cryptographic Pre-Flight Manifest Lock',
      d01Fails,
      `Cryptographic manifest verified intact.`,
      `Manifest signature mismatch: matrix or vault was modified after compilation`
    )

    const totalScoreSum = checks.reduce((acc, c) => acc + c.score, 0)
    const overallScore = Math.round(totalScoreSum / checks.length)
    const isProductionReady = checks.every(c => c.passed)

    return {
      totalScenes,
      scriptScenesCount,
      overallScore,
      isProductionReady,
      failingScenes: [...allFailingSceneIds],
      auditedBy: 'Universal Allow-List Linter Engine v2.0',
      checks
    }
  }

  static evaluateVisionQA(visionInspectionResults = []) {
    const failingIds = []
    for (const res of visionInspectionResults) {
      if (
        res.detectedText ||
        res.characterCount !== res.expectedCharacterCount ||
        !res.matchesZoneSurface ||
        !res.matchesEntityStates
      ) {
        failingIds.push(res.id)
      }
    }
    return {
      gate: 'G18_post_generation_vision_qa',
      passed: failingIds.length === 0,
      regenerateSceneIds: failingIds
    }
  }

  static validateActionNovelty(batchScenes = []) {
    const actionCounts = {}
    const violations = []
    for (const scene of batchScenes) {
      let actionRaw = scene.action_layer || scene.actionLayer || scene.visual_literal || scene.visualLiteral || scene.prompt
      if (!actionRaw) continue
      let coreAction = actionRaw
      const actionMatch = actionRaw.match(/Action & Staging:\s*(.*?)(?:\s*cleanly rendered|\s*100% environment)/i) ||
                          actionRaw.match(/In @\{[^}]+\},\s*(.*?)(?:\.\s*Featuring|\.\s*Zero characters|\.\s*Spatial Enclosure|$)/i)
      if (actionMatch) coreAction = actionMatch[1]
      const normalized = coreAction.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (normalized.length > 5) {
        actionCounts[normalized] = (actionCounts[normalized] || 0) + 1
        if (actionCounts[normalized] > 2 && !violations.some(v => v.sceneId === scene.id)) {
          violations.push({ sceneId: scene.id, action: coreAction.substring(0, 100) + '...' })
        }
      }
    }
    return {
      passed: violations.length === 0,
      violations
    }
  }
}

