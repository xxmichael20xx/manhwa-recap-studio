/**
 * studio/server/services/promptDnaCompiler.js
 *
 * 100% Franchise-Agnostic Deterministic Prompt & Ledger Compiler.
 * Compiles Minimal Scene JSON + Franchise Vaults + Event Ledger into
 * Google Flow XML Prompt Matrices and Cryptographic Dispatch Manifests (D-01).
 */

import crypto from 'crypto'

export class PromptDnaCompiler {
  static sha256(input = '', length = 16) {
    return crypto
      .createHash('sha256')
      .update(String(input).trim(), 'utf8')
      .digest('hex')
      .slice(0, length)
  }

  static normalizeClause(text = '') {
    return String(text)
      .replace(/\s+/g, ' ')
      .trim()
  }

  static parseScriptClauses(scriptText = '') {
    const clauses = new Map()
    const matches = [
      ...String(scriptText).matchAll(
        /(?:^|\n)\s*\[(IMG_\d+)\]\s*([\s\S]*?)(?=(?:\n\s*\[IMG_\d+\]|$))/gi
      )
    ]
    for (const m of matches) {
      const id = m[1].toUpperCase()
      const clean = m[2]
        .replace(/^#{1,6}\s+[^\n]+/gm, '')
        .replace(/^>\s+[^\n]+/gm, '')
        .replace(/\*\*(?:Runtime|Word Count|Visual Plates):\*\*.*$/gm, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\[END OF .*?\]/gi, '')
        .replace(/---+/g, '')
        .trim()
      clauses.set(id, this.normalizeClause(clean))
    }
    return clauses
  }

  static parseLedgerEvents(ledgerInput = '') {
    if (Array.isArray(ledgerInput)) {
      return [...ledgerInput].sort((a, b) => Number(a.s) - Number(b.s))
    }
    const events = []
    const lines = String(ledgerInput)
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)

    for (const line of lines) {
      if (line.startsWith('#') || line.startsWith('//')) continue
      const parsed = JSON.parse(line)
      if (typeof parsed.s === 'number' && parsed.e && parsed.set) {
        events.push(parsed)
      }
    }
    return events.sort((a, b) => a.s - b.s)
  }

  static sceneNumberFromId(sceneId = '') {
    const m = String(sceneId).match(/IMG_(\d+)/i)
    return m ? parseInt(m[1], 10) : 0
  }

  static replayLedgerState(
    entities = {},
    zones = {},
    ledgerEvents = [],
    targetSceneNumber = 0,
    inlineSceneEvents = []
  ) {
    const entityStates = {}
    const zoneStates = {}

    for (const [entId, ent] of Object.entries(entities)) {
      entityStates[entId] = {
        outfit: ent.default_outfit || Object.keys(ent.outfits || {})[0] || null,
        lifecycle: ent.default_lifecycle || (ent.lifecycle ? ent.lifecycle[0] : 'equipped'),
        ...(ent.default_state || {})
      }
    }

    for (const [zoneId, zone] of Object.entries(zones)) {
      zoneStates[zoneId] = {
        ...(zone.default_state || {})
      }
    }

    const applyEvent = evt => {
      if (!evt || !evt.e || !evt.set) return
      if (evt.e.startsWith('zone:')) {
        const zId = evt.e.slice(5)
        if (!zoneStates[zId]) zoneStates[zId] = {}
        Object.assign(zoneStates[zId], evt.set)
      } else {
        if (!entityStates[evt.e]) entityStates[evt.e] = {}
        Object.assign(entityStates[evt.e], evt.set)
      }
    }

    for (const evt of ledgerEvents) {
      if (Number(evt.s) <= targetSceneNumber) {
        applyEvent(evt)
      }
    }

    for (const inlineEvt of inlineSceneEvents || []) {
      applyEvent(inlineEvt)
    }

    return { entityStates, zoneStates }
  }

  static compileEntityBlock(entity, replayedState = {}, outfitOverride = null) {
    if (!entity || !entity.token) {
      throw new Error(`Invalid entity passed to compileEntityBlock`)
    }

    const parts = [entity.token, entity.dna]
    const outfitKey = outfitOverride || replayedState.outfit || entity.default_outfit
    if (outfitKey && entity.outfits && entity.outfits[outfitKey]) {
      parts.push(`wearing ${entity.outfits[outfitKey]}`)
    }

    const activeStatePhrases = []
    const forbiddenContradictions = []

    if (entity.state_lexicon && typeof entity.state_lexicon === 'object') {
      for (const [dimension, lexiconMap] of Object.entries(entity.state_lexicon)) {
        const activeVal = replayedState[dimension]
        if (activeVal && lexiconMap[activeVal]) {
          const entry = lexiconMap[activeVal]
          const phrase = typeof entry === 'string' ? entry : entry.phrase
          const contradicts = (typeof entry === 'object' && Array.isArray(entry.contradicts))
            ? entry.contradicts
            : []
          if (phrase && phrase.trim().length > 0) {
            parts.push(phrase.trim())
            activeStatePhrases.push(phrase.trim())
          }
          forbiddenContradictions.push(...contradicts)
        }
      }
    }

    const compiledBlock = parts.filter(Boolean).join(', ')
    const dnaHash = this.sha256(compiledBlock, 12)

    return {
      token: entity.token,
      compiledBlock,
      dnaHash,
      activeStatePhrases,
      forbiddenContradictions
    }
  }

  static compileZoneEnclosure(zone, replayedZoneState = {}) {
    if (!zone || !zone.canon) {
      throw new Error(`Invalid zone passed to compileZoneEnclosure`)
    }
    const parts = [zone.canon.trim().replace(/\.$/, '')]
    if (zone.window_vantage && typeof zone.window_vantage === 'string' && zone.window_vantage.trim().length > 0) {
      parts.push(zone.window_vantage.trim().replace(/\.$/, ''))
    }
    if (zone.states && typeof zone.states === 'object') {
      for (const [dim, valMap] of Object.entries(zone.states)) {
        const activeVal = replayedZoneState[dim]
        if (activeVal && valMap[activeVal] && valMap[activeVal].trim().length > 0) {
          parts.push(valMap[activeVal].trim().replace(/\.$/, ''))
        }
      }
    }
    const enclosureText = `Spatial Enclosure: ${parts.join(', ')}.`
    const zoneHash = this.sha256(enclosureText, 12)
    return { enclosureText, zoneHash }
  }

  static sanitizeZoneCanon(canon = '', lightingMode = '') {
    let out = String(canon || '').trim().replace(/\.$/, '')
    const isDaytime = ['bright_morning_sunlight', 'overcast_crimson_morning', 'day_sunlit', 'daylight', 'dawn', 'dusk'].includes(lightingMode)
    if (!isDaytime) return out

    out = out.replace(/\s*\bat night\b/gi, '')
    if (lightingMode === 'overcast_crimson_morning') {
      out = out
        .replace(/under\s+(?:dark\s+)?night\s+sky/gi, 'under overcast crimson storm sky')
        .replace(/during\s+bright\s+crisp\s+morning\s+daylight/gi, 'during gloomy overcast morning hours')
        .replace(/under\s+clear\s+high-key\s+sky/gi, 'under overcast crimson storm sky')
        .replace(/high-intensity\s+searchlights\s+sweeping\s+campus\s+perimeter\s+fence/gi, 'reinforced steel campus perimeter fence')
        .replace(/window\s+overlooking\s+campus\s+night\s+lamps/gi, 'closed unbroken glass window overlooking overcast stormy campus buildings')
        .replace(/\bfloodlit\s+night\s+sky\b/gi, 'overcast crimson storm sky')
        .replace(/\bnight\s+lamps\b/gi, 'overcast stormy campus buildings')
    } else {
      out = out
        .replace(/under\s+(?:dark\s+)?night\s+sky/gi, 'under bright sunlit morning sky')
        .replace(/high-intensity\s+searchlights\s+sweeping\s+campus\s+perimeter\s+fence/gi, 'reinforced steel campus perimeter fence')
        .replace(/window\s+overlooking\s+campus\s+night\s+lamps/gi, 'closed unbroken glass window overlooking sunlit campus buildings')
        .replace(/\bfloodlit\s+night\s+sky\b/gi, 'bright sunlit morning sky')
        .replace(/\bnight\s+lamps\b/gi, 'sunlit campus buildings')
    }

    return out
      .replace(/\s*,\s*,+/g, ',')
      .replace(/\s{2,}/g, ' ')
      .replace(/,\s*$/, '')
      .trim()
  }

  static applyPolicyReplacements(text = '', policy = null) {
    let out = String(text)
    if (policy && policy.replacements && typeof policy.replacements === 'object') {
      for (const [unsafePhrase, safeReplacement] of Object.entries(policy.replacements)) {
        const escaped = unsafePhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        out = out.replace(new RegExp(escaped, 'gi'), safeReplacement)
      }
    }
    return out
  }

  static compileScene(sceneJson, context) {
    const {
      franchise,
      entities = {},
      zones = {},
      policy = null,
      scriptClauses = new Map(),
      ledgerEvents = []
    } = context

    const sceneId = String(sceneJson.id || '').toUpperCase()
    const sceneNum = this.sceneNumberFromId(sceneId)

    const zone = zones[sceneJson.zone]
    if (!zone) {
      throw new Error(`[Compiler][${sceneId}] Unregistered zone ID: "${sceneJson.zone}"`)
    }

    const { entityStates, zoneStates } = this.replayLedgerState(
      entities,
      zones,
      ledgerEvents,
      sceneNum,
      sceneJson.events || []
    )

    const compiledEntitiesMap = new Map()
    const charRefNames = []
    const itemRefNames = []

    for (const charSpec of sceneJson.chars || []) {
      const ent = entities[charSpec.id]
      if (!ent) {
        throw new Error(`[Compiler][${sceneId}] Unregistered character ID in chars[]: "${charSpec.id}"`)
      }
      if (ent.status === 'pending') {
        throw new Error(`[Compiler][${sceneId}] Entity "${charSpec.id}" has status "pending"`)
      }
      if (ent.kind === 'item' && entityStates[charSpec.id]?.lifecycle === 'destroyed') {
        throw new Error(`[Compiler][${sceneId}] Destroyed item "${charSpec.id}" cannot appear in chars[]`)
      }

      const compiled = this.compileEntityBlock(ent, entityStates[charSpec.id], charSpec.outfit)
      compiledEntitiesMap.set(charSpec.id, compiled)
      charRefNames.push(ent.token.replace(/^@\{|\}$/g, ''))
    }

    for (const itemSpec of sceneJson.items || []) {
      const ent = entities[itemSpec.id]
      if (!ent) {
        throw new Error(`[Compiler][${sceneId}] Unregistered item ID in items[]: "${itemSpec.id}"`)
      }
      if (ent.status === 'pending') {
        throw new Error(`[Compiler][${sceneId}] Item "${itemSpec.id}" has status "pending"`)
      }

      const replayedLifecycle = entityStates[itemSpec.id]?.lifecycle || ent.default_lifecycle || 'equipped'
      if (
        replayedLifecycle === 'destroyed' &&
        (itemSpec.lifecycle === 'equipped' || itemSpec.lifecycle === 'sheathed' || itemSpec.holder)
      ) {
        throw new Error(
          `[Compiler][${sceneId}] Item "${itemSpec.id}" is marked "destroyed" in ledger and cannot be equipped or held.`
        )
      }

      const compiled = this.compileEntityBlock(ent, entityStates[itemSpec.id], null)
      compiledEntitiesMap.set(itemSpec.id, compiled)
      itemRefNames.push(ent.token.replace(/^@\{|\}$/g, ''))
    }

    const injectedOnce = new Set()
    const compiledPanels = (sceneJson.panels || []).map(rawPanel => {
      let panelText = this.applyPolicyReplacements(rawPanel.trim(), policy)

      for (const [entId, compiled] of compiledEntitiesMap.entries()) {
        const idRegex = new RegExp(`(?<![a-zA-Z0-9_@{])${entId}(?![a-zA-Z0-9_}])`, 'g')
        if (idRegex.test(panelText)) {
          panelText = panelText.replace(idRegex, () => {
            if (!injectedOnce.has(entId)) {
              injectedOnce.add(entId)
              return `(${compiled.compiledBlock})`
            }
            return compiled.token
          })
        }
      }
      return panelText.replace(/\.$/, '') + '.'
    })

    for (const [entId, compiled] of compiledEntitiesMap.entries()) {
      if (!injectedOnce.has(entId)) {
        compiledPanels[0] = `${compiled.compiledBlock}. ${compiledPanels[0]}`
        injectedOnce.add(entId)
      }
    }

    const layoutHeaders = franchise.tier_distribution?.layout_headers || {
      A: 'Single-panel full-bleed hero plate.',
      B: 'Dual-panel manhwa webtoon comic strip.',
      C: 'Three-panel dynamic manhwa action strip.'
    }
    const layoutHeader = layoutHeaders[sceneJson.tier] || layoutHeaders.B
    const layoutLabel =
      sceneJson.tier === 'A'
        ? 'Tier A: Hero Plate'
        : sceneJson.tier === 'C'
          ? 'Tier C: Three-Panel Action Strip'
          : 'Tier B: Dual-Panel Split'

    const { enclosureText, zoneHash } = this.compileZoneEnclosure(zone, zoneStates[sceneJson.zone])
    const lightingModeObj = franchise.style?.lighting_modes?.[zone.lighting]
    if (!lightingModeObj) {
      throw new Error(
        `[Compiler][${sceneId}] Zone "${sceneJson.zone}" references unknown lighting mode "${zone.lighting}"`
      )
    }
    const lightingText =
      typeof lightingModeObj === 'string' ? lightingModeObj : lightingModeObj.text

    const styleAndTail = [
      `${franchise.style.base}, ${lightingText}, ${franchise.aspect_token}`,
      franchise.style.tail_positive,
      franchise.style.tail_negative
    ]
      .map(s => s.trim().replace(/\.$/, ''))
      .join(', ') + '.'

    const fullPrompt = [
      layoutHeader,
      compiledPanels.join(' '),
      enclosureText,
      styleAndTail
    ].join(' ')

    const narrativeSync = scriptClauses.get(sceneId) || ''
    if (!narrativeSync) {
      throw new Error(`[Compiler][${sceneId}] Scene ID not found in 01_Episode_Script.md`)
    }

    const dnaHashes = {}
    for (const [entId, comp] of compiledEntitiesMap.entries()) {
      dnaHashes[entId] = comp.dnaHash
    }

    const xmlBlock = [
      `<scene id="${sceneId}" zone="${sceneJson.zone}" tier="${sceneJson.tier}" transition="${sceneJson.transition || 'adjacent'}" dna_hashes="${Object.entries(dnaHashes).map(([k, v]) => `${k}:${v}`).join(',')}" zone_hash="${zoneHash}">`,
      `  <tag>${sceneId}</tag>`,
      `  <layout>${layoutLabel}</layout>`,
      charRefNames.length > 0 ? `  <character_refs>${charRefNames.join(', ')}</character_refs>` : null,
      itemRefNames.length > 0 ? `  <item_refs>${itemRefNames.join(', ')}</item_refs>` : null,
      `  <visual_literal>${sceneJson.visual_literal}</visual_literal>`,
      `  <narrative_sync>${narrativeSync}</narrative_sync>`,
      `  <prompt>${fullPrompt}</prompt>`,
      `</scene>`
    ]
      .filter(Boolean)
      .join('\n')

    return {
      id: sceneId,
      tier: sceneJson.tier,
      zone: sceneJson.zone,
      narrativeSync,
      prompt: fullPrompt,
      xmlBlock,
      dnaHashes,
      zoneHash,
      tokenEstimate: Math.ceil(fullPrompt.length / 4)
    }
  }

  static compileEpisodeMatrix(scenesJsonArray = [], context = {}) {
    const scriptClauses = this.parseScriptClauses(context.scriptText || '')
    const baseLedgerEvents = this.parseLedgerEvents(context.ledgerText || [])

    const mergedEvents = [...baseLedgerEvents]
    for (const sc of scenesJsonArray) {
      const sNum = this.sceneNumberFromId(sc.id)
      for (const inlineEvt of sc.events || []) {
        mergedEvents.push({ s: sNum, e: inlineEvt.e, set: inlineEvt.set })
      }
    }
    mergedEvents.sort((a, b) => a.s - b.s)

    const compiledScenes = scenesJsonArray.map(sceneJson =>
      this.compileScene(sceneJson, {
        ...context,
        scriptClauses,
        ledgerEvents: mergedEvents
      })
    )

    const header = [
      `# 02_Prompt_Matrix.md — ${context.franchise.title} (${compiledScenes.length} Scenes)`,
      ``,
      `> **Franchise Code:** \`${context.franchise.code}\``,
      `> **Format:** ${context.franchise.aspect_token}`,
      `> **Total Scenes:** ${compiledScenes.length}`,
      `> **Compiled By:** Deterministic PromptDnaCompiler v2.0`,
      ``
    ].join('\n')

    const matrixMarkdown =
      header + '\n' + compiledScenes.map(s => s.xmlBlock).join('\n\n') + '\n'

    const manifest = this.generateSignedManifest({
      franchise: context.franchise,
      entities: context.entities,
      zones: context.zones,
      ledgerEvents: mergedEvents,
      scriptText: context.scriptText,
      matrixMarkdown
    })

    return {
      matrixMarkdown,
      compiledScenes,
      manifest
    }
  }

  static generateSignedManifest({
    franchise,
    entities,
    zones,
    ledgerEvents,
    scriptText,
    matrixMarkdown
  }) {
    const hashes = {
      franchiseHash: this.sha256(JSON.stringify(franchise || {}), 32),
      entitiesHash: this.sha256(JSON.stringify(entities || {}), 32),
      zonesHash: this.sha256(JSON.stringify(zones || {}), 32),
      ledgerHash: this.sha256(JSON.stringify(ledgerEvents || []), 32),
      scriptHash: this.sha256(scriptText || '', 32),
      matrixHash: this.sha256(matrixMarkdown || '', 32),
      compilerVersion: '2.0.0-universal'
    }
    const compositeSignature = this.sha256(JSON.stringify(hashes), 64)
    return {
      ...hashes,
      signature: compositeSignature,
      issuedAt: new Date().toISOString()
    }
  }

  /**
   * Universal 6-Pillar Chronological State-Persistence Extractor.
   * Scans 01_Episode_Script.md clauses, staging headers, and state_events.jsonl to build
   * monotonic timeline_overrides windows (from_scene -> to_scene) across:
   *   1. character_conditions (injuries, torn/scorched clothes, bandages/slings, berserk/eye/vein transformations)
   *   2. posture_locks (collapsed_ground, prostrate, kneeling, cowering across consecutive scenes in a zone)
   *   3. creature_anatomy (severed limbs, 4-arm -> 3-arm dismemberment, dissolved shields, cleaved halves)
   *   4. prop_states (equipped vs sheathed vs stowed/disarmed vs damaged/cracked/fried/destroyed)
   *   5. zone_surfaces (frosted, cratered, rubble, scorched)
   *   6. object_states (sealed/closed vs open/active/triumphant)
   */
  static extractTimelineOverrides({
    scriptClauses = new Map(),
    scriptHeaders = new Map(),
    entities = {},
    zones = {},
    ledgerEvents = []
  } = {}) {
    const sceneIds = [...scriptClauses.keys()]
    const maxSceneNum = sceneIds.length > 0
      ? this.sceneNumberFromId(sceneIds[sceneIds.length - 1])
      : 999

    const overrides = {
      character_conditions: [],
      posture_locks: [],
      creature_anatomy: [],
      prop_states: [],
      zone_surfaces: [],
      object_states: []
    }

    const findEntity = (rawKey = '') => {
      const clean = String(rawKey).replace(/^@\{?|\}?$/g, '').trim().toLowerCase()
      const slug = clean.replace(/[^a-z0-9]+/g, '_')
      if (!clean) return null
      if (entities[clean]) return entities[clean]
      if (entities[slug]) return entities[slug]
      return Object.values(entities).find(e =>
        (e.id && (e.id.toLowerCase() === clean || e.id.toLowerCase() === slug)) ||
        (e.name && e.name.toLowerCase() === clean) ||
        (e.token && e.token.replace(/^@\{|\}$/g, '').toLowerCase() === clean) ||
        (e.aliases || []).some(a => a.toLowerCase() === clean)
      ) || null
    }

    const findCastSubjectInClause = (clause = '', header = {}) => {
      const castList = (header.cast || []).map(c => findEntity(c)).filter(Boolean)
      const cLower = clause.toLowerCase()
      for (const ent of castList) {
        const cleanName = (ent.name || ent.token || '').replace(/^@\{|\}$/g, '').trim().toLowerCase()
        const parts = cleanName.split(/\s+/).filter(w => w.length >= 4 && !/^(?:lord|lady|duke|duchess|elder|master|proctor|commander|general|chairman|princess|prince)$/i.test(w))
        if (cLower.includes(cleanName) || parts.some(p => cLower.includes(p))) {
          return ent
        }
      }
      return castList.find(e => e.kind === 'character') || castList[0] || null
    }

    // 1. Process explicit ledger events first
    const sortedLedger = [...(ledgerEvents || [])].sort((a, b) => Number(a.s) - Number(b.s))
    for (let idx = 0; idx < sortedLedger.length; idx++) {
      const evt = sortedLedger[idx]
      const sNum = Math.max(1, Number(evt.s) || 1)
      const setObj = evt.set || {}

      if (String(evt.e || '').startsWith('zone:')) {
        const zId = evt.e.slice(5).split('.')[0]
        if (setObj.surface === 'frosted') {
          const nextZoneEvt = sortedLedger.slice(idx + 1).find(n => n.e === evt.e && n.set?.surface)
          overrides.zone_surfaces.push({
            zone_id: zId,
            from_scene: sNum,
            to_scene: nextZoneEvt ? Math.max(sNum, Number(nextZoneEvt.s) - 1) : maxSceneNum,
            state: 'frosted',
            dna_append: 'ground surface coated in jagged glacial frost and ice crystals'
          })
        } else if (setObj.surface === 'cratered') {
          overrides.zone_surfaces.push({
            zone_id: zId,
            from_scene: sNum,
            to_scene: maxSceneNum,
            state: 'cratered',
            dna_append: 'ground surface caved into a deep 30-meter crushed impact crater with fractured stone slabs'
          })
        }
        continue
      }

      const ent = findEntity(evt.e)
      const entId = ent?.id || String(evt.e).toLowerCase()

      // Pillar 1: Ledger eye/vein transformations
      if (setObj.eyes === 'crimson_sclera' || setObj.veins === 'black_neck') {
        overrides.character_conditions.push({
          entity_id: entId,
          from_scene: sNum,
          to_scene: maxSceneNum,
          state: 'berserk_mutation',
          dna_append: 'blood-crimson sclera, bulging black corruption veins across neck and jaw',
          strip_patterns: ['calm', 'composed']
        })
      }

      // Pillar 2: Ledger posture locks (collapsed_ground, prostrate, kneeling, cowering)
      if (/^(?:collapsed_ground|prostrate|kneeling|cowering_floor|cowering_prostrated)$/i.test(String(setObj.posture || ''))) {
        const nextRecovery = sortedLedger.slice(idx + 1).find(n =>
          n.e === evt.e && (
            (n.set?.posture && !/^(?:collapsed_ground|prostrate|kneeling|cowering_floor|cowering_prostrated)$/i.test(n.set.posture)) ||
            /^(?:evacuated|routed|departed|dissolving_ash)$/i.test(String(n.set?.lifecycle || '')) ||
            Boolean(n.set?.location)
          )
        )
        const endScene = nextRecovery ? Math.max(sNum, Number(nextRecovery.s) - 1) : maxSceneNum
        overrides.posture_locks.push({
          entity_id: entId,
          from_scene: sNum,
          to_scene: endScene,
          state: setObj.posture,
          dna_append: setObj.posture.includes('kneeling')
            ? 'kneeling directly on the ground floor'
            : 'collapsed low on the ground floor',
          strip_patterns: [
            'proud upright posture with raised chin',
            'proud upright posture',
            'standing tall',
            'standing command',
            'upright posture'
          ],
          force_grounded_camera: true
        })
      }

      // Pillar 3: Creature/Dummy barrier & cleavage states
      if (setObj.barrier === 'dissolved') {
        overrides.creature_anatomy.push({
          entity_id: entId,
          from_scene: sNum,
          to_scene: maxSceneNum,
          state: 'barrier_dissolved',
          replace_map: {},
          dna_append: 'defensive bronze barrier completely dissolved, zero glowing shield dome',
          forbidden_terms: ['crackling protective shield']
        })
      }
      if (setObj.lifecycle === 'cleaved' || setObj.state === 'cleaved_two_halves') {
        const nextIntact = sortedLedger.slice(idx + 1).find(n => n.e === evt.e && n.set?.lifecycle === 'intact')
        overrides.creature_anatomy.push({
          entity_id: entId,
          from_scene: sNum,
          to_scene: nextIntact ? Math.max(sNum, Number(nextIntact.s) - 1) : maxSceneNum,
          state: 'cleaved_two_halves',
          replace_map: {
            'standing upright': 'cleaved cleanly into two fallen halves on the floor'
          },
          dna_append: 'split cleanly down its vertical axis into two fallen wooden halves on the floor',
          forbidden_terms: []
        })
      }

      // Pillar 4: Prop states (damaged/fried/destroyed vs sheathed vs stowed/disarmed)
      const lc = String(setObj.lifecycle || '').toLowerCase()
      if (['damaged', 'destroyed', 'fried', 'overloaded', 'shattered'].includes(lc) && (!ent || ent.kind === 'item')) {
        overrides.prop_states.push({
          entity_id: entId,
          from_scene: sNum,
          to_scene: maxSceneNum,
          state: 'damaged_or_destroyed',
          forbid_holding: true,
          strip_patterns: [
            'a large flawless octagonal-cut star-sapphire mana crystal tip that faintly crackles with azure sparks',
            'flawless octagonal-cut star-sapphire mana crystal tip that faintly crackles with azure sparks',
            'faintly crackles with azure sparks',
            'crackles with azure sparks',
            'flawless',
            'intact',
            'pristine',
            'radiant'
          ],
          dna_append: 'cracked damaged shaft with shattered dark crystal completely devoid of mana, lying broken on the ground, zero sparks, zero glow',
          forbidden_terms: ['flawless octagonal-cut', 'crackles with azure sparks']
        })
      } else if (lc === 'sheathed' || (setObj.hip_weapon && setObj.hip_weapon !== 'none' && setObj.held_weapon !== setObj.hip_weapon)) {
        const targetPropEnt = lc === 'sheathed' ? ent : findEntity(setObj.hip_weapon)
        const targetPropId = targetPropEnt?.id || (lc === 'sheathed' ? entId : String(setObj.hip_weapon).toLowerCase())
        const nextEquip = sortedLedger.slice(idx + 1).find(n =>
          (n.e === targetPropId && n.set?.lifecycle === 'equipped') ||
          (n.e === evt.e && (n.set?.held_weapon === targetPropId || n.set?.hip_weapon === 'none'))
        )
        overrides.prop_states.push({
          entity_id: targetPropId,
          from_scene: sNum,
          to_scene: nextEquip ? Math.max(sNum, Number(nextEquip.s) - 1) : maxSceneNum,
          state: 'sheathed',
          forbid_holding: true,
          strip_patterns: [],
          dna_append: 'sheathed at hip inside scabbard',
          layer4_append: 'sheathed at hip in scabbard'
        })
      } else if (['stowed', 'resting', 'stored', 'disarmed', 'set_down'].includes(lc) && (!ent || ent.kind === 'item')) {
        const nextEquip = sortedLedger.slice(idx + 1).find(n => n.e === evt.e && n.set?.lifecycle === 'equipped')
        overrides.prop_states.push({
          entity_id: entId,
          from_scene: sNum,
          to_scene: nextEquip ? Math.max(sNum, Number(nextEquip.s) - 1) : maxSceneNum,
          state: lc,
          forbid_holding: true,
          strip_patterns: [],
          dna_append: lc === 'disarmed' ? 'knocked away across the floor, unheld' : 'resting unheld',
          forbidden_terms: []
        })
      }

      // Pillar 6: Object / Relic states (sealed vs open_on_pedestal vs triumphant)
      if (setObj.state === 'open_on_pedestal' || lc === 'sealed' || lc === 'triumphant') {
        const nextStateEvt = sortedLedger.slice(idx + 1).find(n => n.e === evt.e && (n.set?.state || n.set?.lifecycle))
        overrides.object_states.push({
          entity_id: entId,
          from_scene: sNum,
          to_scene: nextStateEvt ? Math.max(sNum, Number(nextStateEvt.s) - 1) : maxSceneNum,
          state: setObj.state || lc,
          dna_append: setObj.state === 'open_on_pedestal'
            ? 'resting wide open on the pedestal revealing illuminated pages'
            : lc === 'sealed'
              ? 'resting sealed shut with unbroken clasp'
              : 'erupting with blinding golden sovereign light crowning Floor 50 at the apex'
        })
      }
    }

    // 2. Scan 01_Episode_Script.md clauses for narrative state transitions
    const INJURY_BEAT_REGEX = /\b(?:clutching\s+his\s+(?:injured|shattered|bleeding|broken|wounded)\s+(?:right\s+|left\s+)?(?:shoulder|arm|chest|ribs)|(?:doublet|coat|robes?|tunic|attire)\s+(?:was\s+|were\s+)?(?:torn|shredded|tattered|scorched))\b/i
    const BANDAGE_BEAT_REGEX = /\b(?:stood\s+bandaged|wrapped\s+in\s+(?:white\s+)?(?:linen\s+)?(?:shoulder\s+)?bandages|(?:shoulder|arm)\s+bandages|arm\s+in\s+a\s+(?:cloth\s+)?sling|cloth\s+arm\s+sling|stabilised\s+his\s+(?:injured|shattered|wounded)\s+(?:right\s+|left\s+)?shoulder|stabilized\s+his\s+(?:injured|shattered|wounded)\s+(?:right\s+|left\s+)?shoulder|treated\s+his\s+(?:injured|wounded)\s+(?:right\s+|left\s+)?shoulder)\b/i
    const SEVERED_ARM_REGEX = /\b(?:(?:upper[\s-]left|left|right|massive)\s+(?:stone\s+)?arm\s+was\s+(?:cleanly\s+)?(?:severed|sheared|sliced|shattered)|severed\s+(?:one\s+of\s+its|the\s+titan's|its\s+upper[\s-]left)\s+(?:massive\s+)?(?:stone\s+)?arms?|severed\s+stone\s+arm\s+crashed|remaining\s+three\s+(?:massive\s+)?(?:stone\s+)?arms)\b/i
    const BROKEN_PROP_REGEX = /\b(?:cracked\s+down\s+its\s+gilded\s+shaft|completely\s+devoid\s+of\s+mana|wand\s+shattered|blade\s+snapped\s+in\s+two)\b/i

    for (let i = 0; i < sceneIds.length; i++) {
      const sId = sceneIds[i]
      const sNum = this.sceneNumberFromId(sId)
      const clause = scriptClauses.get(sId) || ''
      const header = scriptHeaders.get(sId) || {}

      // Pillar 1A: Bandage / Sling Beat
      if (BANDAGE_BEAT_REGEX.test(clause)) {
        const targetEnt = findCastSubjectInClause(clause, header)
        if (targetEnt) {
          // Cap any open injured_tattered window for this character at sNum - 1
          for (const cond of overrides.character_conditions) {
            if (cond.entity_id === targetEnt.id && cond.state === 'injured_tattered' && cond.to_scene >= sNum) {
              cond.to_scene = Math.max(cond.from_scene, sNum - 1)
            }
          }
          const alreadyBandaged = overrides.character_conditions.some(
            c => c.entity_id === targetEnt.id && c.state === 'bandaged_sling' && sNum >= c.from_scene && sNum <= c.to_scene
          )
          if (!alreadyBandaged) {
            overrides.character_conditions.push({
              entity_id: targetEnt.id,
              from_scene: sNum,
              to_scene: maxSceneNum,
              state: 'bandaged_sling',
              dna_append: 'wrapped in white linen shoulder bandages and a cloth arm sling, pale humbled expression',
              strip_patterns: [
                'proud upright posture with raised chin',
                'proud upright posture',
                'sneering smirk',
                'arrogant',
                'pristine',
                'flawless'
              ]
            })
          }
        }
      } else if (INJURY_BEAT_REGEX.test(clause)) {
        // Pillar 1B: Injury / Torn Clothes Beat
        const targetEnt = findCastSubjectInClause(clause, header)
        if (targetEnt) {
          const alreadyActive = overrides.character_conditions.some(
            c => c.entity_id === targetEnt.id && sNum >= c.from_scene && sNum <= c.to_scene
          )
          if (!alreadyActive) {
            overrides.character_conditions.push({
              entity_id: targetEnt.id,
              from_scene: sNum,
              to_scene: maxSceneNum,
              state: 'injured_tattered',
              dna_append: 'injured and battered, clutching wounded right shoulder with scorched tattered attire',
              strip_patterns: [
                'proud upright posture with raised chin',
                'proud upright posture',
                'sneering smirk',
                'arrogant',
                'pristine',
                'flawless'
              ]
            })
          }
        }
      }

      // Pillar 3: Boss / Creature Dismemberment Beat (4 arms -> 3 arms)
      if (SEVERED_ARM_REGEX.test(clause)) {
        const castCreatures = (header.cast || []).map(c => findEntity(c)).filter(e => e && e.kind === 'creature')
        const targetCreature = castCreatures[0] || Object.values(entities).find(e => e.kind === 'creature' && /four-armed|four\s+massive\s+stone\s+arms/i.test(`${e.dna || ''} ${JSON.stringify(e.outfits || {})}`))
        if (targetCreature) {
          const alreadySevered = overrides.creature_anatomy.some(
            c => c.entity_id === targetCreature.id && c.state === 'severed_arm'
          )
          if (!alreadySevered) {
            overrides.creature_anatomy.push({
              entity_id: targetCreature.id,
              from_scene: sNum,
              to_scene: maxSceneNum,
              state: 'severed_arm',
              replace_map: {
                'four-armed': 'three-armed',
                'Four massive stone arms': 'Three remaining massive stone arms with shattered upper-left shoulder stump',
                'four massive stone arms': 'three remaining massive stone arms with shattered upper-left shoulder stump'
              },
              dna_append: 'upper-left shoulder reduced to a shattered stone stump, wielding only three remaining stone arms, zero fourth arm',
              forbidden_terms: ['four-armed', 'four massive stone arms']
            })
          }
        }
      }

      // Pillar 4: Broken / Drained Prop Beat in Script
      if (BROKEN_PROP_REGEX.test(clause) && header.props?.length > 0) {
        for (const pRaw of header.props) {
          const pEnt = findEntity(pRaw)
          const pId = pEnt?.id || String(pRaw).replace(/^@\{?|\}?$/g, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')
          const alreadyBroken = overrides.prop_states.some(
            p => p.entity_id === pId && p.state === 'damaged_or_destroyed'
          )
          if (!alreadyBroken) {
            overrides.prop_states.push({
              entity_id: pId,
              from_scene: sNum,
              to_scene: maxSceneNum,
              state: 'damaged_or_destroyed',
              forbid_holding: true,
              strip_patterns: [
                'a large flawless octagonal-cut star-sapphire mana crystal tip that faintly crackles with azure sparks',
                'flawless octagonal-cut star-sapphire mana crystal tip that faintly crackles with azure sparks',
                'faintly crackles with azure sparks',
                'crackles with azure sparks',
                'flawless',
                'intact',
                'pristine',
                'radiant'
              ],
              dna_append: 'cracked damaged shaft with shattered dark crystal completely devoid of mana, lying broken on the ground, zero sparks, zero glow',
              forbidden_terms: ['flawless octagonal-cut', 'crackles with azure sparks']
            })
          }
        }
      }
    }

    return overrides
  }

  /**
   * Applies active timeline_overrides to a compiled entity or prop DNA block at sceneNum.
   */
  static applyEntityTimelineOverride(block = '', entityId = '', sceneNum = 0, timelineOverrides = null) {
    if (!timelineOverrides || !entityId) return { block, forceGrounded: false }
    let out = String(block || '')
    let forceGrounded = false
    const idLower = String(entityId).toLowerCase()

    // 1. Character conditions (injuries, bandages/slings, berserk transformations)
    for (const cond of timelineOverrides.character_conditions || []) {
      if (cond.entity_id?.toLowerCase() === idLower && sceneNum >= cond.from_scene && sceneNum <= cond.to_scene) {
        for (const pat of cond.strip_patterns || []) {
          const reg = new RegExp(`(?:,\\s*)?\\b${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
          out = out.replace(reg, '')
        }
        if (cond.dna_append && !out.toLowerCase().includes(cond.dna_append.toLowerCase())) {
          out = `${out.replace(/,\s*$/, '')}, ${cond.dna_append}`
        }
      }
    }

    // 2. Posture locks (collapsed_ground, prostrate, kneeling)
    for (const pos of timelineOverrides.posture_locks || []) {
      if (pos.entity_id?.toLowerCase() === idLower && sceneNum >= pos.from_scene && sceneNum <= pos.to_scene) {
        for (const pat of pos.strip_patterns || []) {
          const reg = new RegExp(`(?:,\\s*)?\\b${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
          out = out.replace(reg, '')
        }
        if (pos.dna_append && !out.toLowerCase().includes(pos.dna_append.toLowerCase())) {
          out = `${out.replace(/,\s*$/, '')}, ${pos.dna_append}`
        }
        if (pos.force_grounded_camera) forceGrounded = true
      }
    }

    // 3. Creature anatomy overrides (severed arms, dissolved barriers, cleaved halves)
    for (const anat of timelineOverrides.creature_anatomy || []) {
      if (anat.entity_id?.toLowerCase() === idLower && sceneNum >= anat.from_scene && sceneNum <= anat.to_scene) {
        for (const [fromStr, toStr] of Object.entries(anat.replace_map || {})) {
          const reg = new RegExp(fromStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
          out = out.replace(reg, toStr)
        }
        if (anat.dna_append && !out.toLowerCase().includes(anat.dna_append.toLowerCase())) {
          out = `${out.replace(/,\s*$/, '')}, ${anat.dna_append}`
        }
      }
    }

    // 4. Object / Relic states
    for (const objSt of timelineOverrides.object_states || []) {
      if (objSt.entity_id?.toLowerCase() === idLower && sceneNum >= objSt.from_scene && sceneNum <= objSt.to_scene) {
        if (objSt.dna_append && !out.toLowerCase().includes(objSt.dna_append.toLowerCase())) {
          out = `${out.replace(/,\s*$/, '')}, ${objSt.dna_append}`
        }
      }
    }

    out = out.replace(/,\s*,+/g, ',').replace(/\s{2,}/g, ' ').trim()
    return { block: out, forceGrounded }
  }

  /**
   * Applies active prop_states & object_states overrides to a prop DNA string at sceneNum.
   */
  static applyPropTimelineOverride(rawPropDna = '', propId = '', sceneNum = 0, timelineOverrides = null) {
    if (!timelineOverrides || !propId) {
      return { dna: rawPropDna, forbidHolding: false, layer4Append: '', isDamaged: false }
    }
    let out = String(rawPropDna || '')
    let forbidHolding = false
    let layer4Append = ''
    let isDamaged = false
    const idLower = String(propId).toLowerCase()

    for (const pSt of timelineOverrides.prop_states || []) {
      if (pSt.entity_id?.toLowerCase() === idLower && sceneNum >= pSt.from_scene && sceneNum <= pSt.to_scene) {
        if (pSt.forbid_holding) forbidHolding = true
        if (pSt.state === 'damaged_or_destroyed') isDamaged = true
        if (pSt.layer4_append) layer4Append = pSt.layer4_append
        for (const pat of pSt.strip_patterns || []) {
          const reg = new RegExp(`(?:,\\s*)?${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi')
          out = out.replace(reg, '')
        }
        if (pSt.dna_append && !out.toLowerCase().includes(pSt.dna_append.toLowerCase())) {
          out = `${out.replace(/,\s*$/, '')}, ${pSt.dna_append}`
        }
      }
    }

    for (const objSt of timelineOverrides.object_states || []) {
      if (objSt.entity_id?.toLowerCase() === idLower && sceneNum >= objSt.from_scene && sceneNum <= objSt.to_scene) {
        if (objSt.dna_append && !out.toLowerCase().includes(objSt.dna_append.toLowerCase())) {
          out = `${out.replace(/,\s*$/, '')}, ${objSt.dna_append}`
        }
      }
    }

    out = out.replace(/,\s*,+/g, ',').replace(/\s{2,}/g, ' ').trim()
    return { dna: out, forbidHolding, layer4Append, isDamaged }
  }
}

export function extractCharacterDna(charObj) {
  if (!charObj) return null
  const name = (charObj.name || charObj.token || charObj.id || '')
    .replace(/^@\{|\}$/g, '')
    .trim()
  if (!name) return null

  const cleanName = name
    .replace(
      /^(?:Grand Duke|Duke|Lord|Lady|Prince|Princess|King|Queen|Emperor|Empress|Chief Proctor|Chief Enforcer|Senior Examiner|Head Examiner|Examiner|Proctor|Instructor|Commander|Director|Master|Captain|Sir|Goddess|Elder|Chief|Enforcer|Chancellor|Headmaster|Dean)\s+/i,
      ''
    )
    .trim()

  const rawDna = charObj.dna || charObj.dnaPrompt || charObj.description || ''
  const outfitsObj = charObj.outfits || {}
  const wardrobeTokens = Object.values(outfitsObj)
    .map(v => String(v).toLowerCase().trim())
    .filter(Boolean)

  return {
    id: charObj.id || cleanName.toLowerCase().replace(/\s+/g, '_'),
    name,
    cleanName,
    canonicalTraits: rawDna,
    wardrobeTokens,
    physiqueTokens: rawDna
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(s => /\b(year-old|tall|frame|muscular|slender|chubby|athletic|build)\b/i.test(s)),
    facialTokens: rawDna
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(s => /\b(hair|eyes|face|jaw|expression|scar|brow)\b/i.test(s)),
    ageTokens: rawDna
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(s => /\b(\d+-year-old|young|weathered|ancient|student|elder)\b/i.test(s))
  }
}
