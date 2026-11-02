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
