export const COMMON_STOP_WORDS = new Set([
  'high', 'grand', 'chief', 'master', 'shadow', 'stone', 'lord', 'director',
  'instructor', 'commander', 'sub', 'unit', 'boss', 'character', 'young',
  'ancient', 'demonic', 'celestial', 'imperial', 'dark', 'void', 'royal',
  'iron', 'gold', 'golden', 'student', 'phantom', 'dwarf', 'masked', 'proxy',
  'archon', 'golem', 'titan', 'chimera', 'wyrm', 'minotaur', 'behemoth',
  'sceptre', 'blade', 'spear', 'bow', 'sword', 'armor', 'plate', 'shield',
  'chancellor', 'proctor', 'vanguard', 'syndicate', 'mercenary', 'official',
  'automaton', 'construct', 'blacksmith'
])

/**
 * Google Flow Entity ID Mapper & Token Transformer Utility
 */

export function normalizeEntityMappingText(rawText) {
  if (!rawText || typeof rawText !== 'string') return ''
  // 1. Strip markdown code fences if wrapped in ```text ... ```
  let text = rawText.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/i, '')

  // 2. Automatically split concatenated single-line outputs into separate lines
  // Whenever a UUID is followed by space/text instead of a newline, insert a newline
  text = text.replace(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\s*/gi, (m, uuid) => uuid + '\n')

  // 3. Clean up leading/trailing empty lines and whitespace
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n')
}

export function parseEntityMappingText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { entities: {}, count: 0, normalizedText: '' }
  }

  // Pre-normalize text to handle single-line outputs seamlessly
  const normalizedText = normalizeEntityMappingText(rawText)
  const entities = {}
  const lines = normalizedText.split(/\r?\n/)
  const uuidRegex = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Search for a valid UUID anywhere on the line (skips headers & conversational intro)
    const uuidMatch = trimmed.match(uuidRegex)
    if (!uuidMatch) continue

    const uuid = uuidMatch[1].toLowerCase()

    // Extract the entity name before the UUID
    let beforeUuid = trimmed.split(uuidMatch[1])[0]

    // Strip trailing UUID indicators like ", UUID: " or "- id:"
    beforeUuid = beforeUuid.replace(/(?:[,\-\s]+)?(?:uuid|id)\s*[:=]?\s*$/i, '')

    // Clean trailing colons, dashes, equal signs and spaces
    let cleanName = beforeUuid.replace(/[:\s\-–—=]+$/, '').trim()

    // Clean markdown bolding, bullets, numbering, and wrapper brackets
    cleanName = cleanName
      .replace(/^[\s\-*•\d.)\]]+/g, '') // strip bullets, numbering, closing bracket
      .replace(/[*\x60_]/g, '')        // strip markdown formatting
      .replace(/^[[(]/, '')            // strip leading [ or (
      .replace(/[\])]$/, '')           // strip trailing ] or )
      .replace(/^(?:character|item|entity|name)\s*[:\-]\s*/i, '') // strip leading label prefix
      .replace(/[:\s\-–—=]+$/, '')     // strip trailing delimiters again
      .trim()

    if (cleanName && uuid) {
      entities[cleanName] = uuid

      // Register smart manhwa narrative aliases
      const strippedKey = cleanName.replace(/^(Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim()
      if (strippedKey && strippedKey !== cleanName) {
        entities[strippedKey] = uuid
      }
      if (cleanName.includes('Grand Duke Vane Valerius')) {
        entities['Grand Duke Vane'] = uuid
      }
      if (cleanName.includes('Sub-Kernel Automaton Proxy')) {
        entities['Unit Vanguard-0'] = uuid
        entities['Automaton Proxy'] = uuid
      }
      if (cleanName.includes('Shadow Assassin Jackal')) {
        entities['Masked Assassin'] = uuid
        entities['Jackal'] = uuid
      }
      if (cleanName.includes('Chief Proctor Gary')) {
        entities['High-Ranking Official'] = uuid
        entities['Proctor Gary'] = uuid
      }
      if (cleanName.includes('Master Smith Corvus')) {
        entities['Dwarf Blacksmith'] = uuid
      }
      if (cleanName.includes('Obsidian Core Golem')) {
        entities['Stone Golem'] = uuid
      }
    }
  }

  return {
    entities,
    count: Object.keys(entities).length,
    normalizedText
  }
}

export function transformTokens(text, entityMap = {}, mode = 'uuid') {
  if (!text || typeof text !== 'string') return text || ''
  if (!entityMap || Object.keys(entityMap).length === 0) return text

  // Build inverse map for uuid -> token reconstruction
  const inverseMap = {}
  for (const [key, uuid] of Object.entries(entityMap)) {
    inverseMap[uuid] = key
  }

  if (mode === 'uuid') {
    // Replace @{Key} -> @UUID
    let transformed = text.replace(/@\{([^}]+)\}/g, (match, key) => {
      const trimmedKey = key.trim()
      if (entityMap[trimmedKey]) {
        return `@${entityMap[trimmedKey]}`
      }
      // Check normalized key (case-insensitive, or with/without "Weapon: " / "Item: " prefixes)
      for (const [k, uuid] of Object.entries(entityMap)) {
        if (k.toLowerCase() === trimmedKey.toLowerCase()) {
          return `@${uuid}`
        }
        const strippedK = k.replace(/^(Weapon|Item|Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim().toLowerCase()
        const strippedKey = trimmedKey.replace(/^(Weapon|Item|Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim().toLowerCase()
        if (strippedK === strippedKey) {
          return `@${uuid}`
        }
      }
      return match
    })

    // Also replace standalone @Key if not inside braces
    for (const [key, uuid] of Object.entries(entityMap)) {
      // Escape special regex characters in key
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`@${escapedKey}(?![a-zA-Z0-9_-])`, 'g')
      transformed = transformed.replace(regex, `@${uuid}`)
      
      // Also match stripped key (e.g. @Void-Strung Heavy Recurve or @Demigod Overseer Prime Unit Alpha)
      const strippedKey = key.replace(/^(Weapon|Item|Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim()
      if (strippedKey !== key) {
        const escapedStripped = strippedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const strippedRegex = new RegExp(`@${escapedStripped}(?![a-zA-Z0-9_-])`, 'g')
        transformed = transformed.replace(strippedRegex, `@${uuid}`)
      }
    }



    // Universal Character Alias Replacement (Anti-Inconsistency Invariant)
    // Automatically transforms unbracketed character names and possessives (e.g. "Bram", "Bram's", "Cassian", "Linnea")
    for (const [key, uuid] of Object.entries(entityMap)) {
      if (/^(Weapon|Item):/i.test(key)) continue
      const aliases = new Set()
      const cleanKey = key.replace(/^(Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '')
                          .replace(/\s*\(.*?\)/g, '')
                          .replace(/\s*-\s*.*$/, '')
                          .trim()
      if (cleanKey && cleanKey.length >= 3) aliases.add(cleanKey)
      const words = cleanKey.split(/\s+/).filter(w => w.length >= 3 && !COMMON_STOP_WORDS.has(w.toLowerCase()))
      words.forEach(w => aliases.add(w))
      if (cleanKey.toLowerCase().includes('bramwell')) aliases.add('Bram')
      if (cleanKey.toLowerCase().includes('minotaur')) aliases.add('Minotaur')
      if (cleanKey.toLowerCase().includes('cassian')) aliases.add('Cassian')
      if (cleanKey.toLowerCase().includes('vance')) aliases.add('Vance')

      const sortedAliases = Array.from(aliases).sort((a, b) => b.length - a.length)
      for (const alias of sortedAliases) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const possessiveRegex = new RegExp(`(?<![@{a-zA-Z0-9_-])\\b${escaped}('s|’s)\\b`, 'g')
        transformed = transformed.replace(possessiveRegex, `@${uuid}'s`)
        const standardRegex = new RegExp(`(?<![@{a-zA-Z0-9_-])\\b${escaped}\\b(?!['’]s)`, 'g')
        transformed = transformed.replace(standardRegex, `@${uuid}`)
      }
    }

    return transformed
  } else {
    // Mode is 'token': Replace @UUID -> @{Key}
    let transformed = text
    for (const [uuid, key] of Object.entries(inverseMap)) {
      const regex = new RegExp(`@${uuid}(?![a-zA-Z0-9_-])`, 'g')
      transformed = transformed.replace(regex, `@{${key}}`)
    }
    return transformed
  }
}

export const ENTITY_STORAGE_KEY_PREFIX = 'manhwa_recap_flow_entity_map_'
export const TAG_MODE_STORAGE_KEY = 'manhwa_recap_prompt_tag_mode'
const LEGACY_ENTITY_STORAGE_KEY_PREFIX = 'luna_flow_entity_map_'
const LEGACY_TAG_MODE_STORAGE_KEY = 'luna_prompt_tag_mode'

export function saveEntityMapToStorage(franchiseId, rawText, entities) {
  try {
    const key = `${ENTITY_STORAGE_KEY_PREFIX}${franchiseId || 'default'}`
    localStorage.setItem(key, JSON.stringify({ rawText, entities, timestamp: Date.now() }))
  } catch (e) {
    console.warn('Failed to save entity map to storage:', e)
  }
}

export function loadEntityMapFromStorage(franchiseId) {
  try {
    const key = `${ENTITY_STORAGE_KEY_PREFIX}${franchiseId || 'default'}`
    let raw = localStorage.getItem(key)
    if (!raw) {
      // Graceful fallback for legacy storage key
      const legacyKey = `${LEGACY_ENTITY_STORAGE_KEY_PREFIX}${franchiseId || 'default'}`
      raw = localStorage.getItem(legacyKey)
    }
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (e) {
    console.warn('Failed to load entity map from storage:', e)
  }
  return null
}

export function getTagModeFromStorage() {
  try {
    return localStorage.getItem(TAG_MODE_STORAGE_KEY) || localStorage.getItem(LEGACY_TAG_MODE_STORAGE_KEY) || 'uuid'
  } catch (e) {
    return 'uuid'
  }
}

export function setTagModeToStorage(mode) {
  try {
    localStorage.setItem(TAG_MODE_STORAGE_KEY, mode)
  } catch (e) {
    console.warn('Failed to save tag mode:', e)
  }
}

// Full-fidelity invariant: Nano Banana 2.1 has zero length limit and thrives on full prompt detail
export function stripBoilerplateTail(text) {
  // Always return full prompt text without truncation to prevent slop and morphing
  return text || ''
}

export function buildSceneXmlNode(tag, filename, promptText, entityMap = {}, mode = 'token', options = {}) {
  const charRefs = []
  const itemRefs = []
  const text = promptText || ''

  // Helper to resolve temporary or placeholder UUIDs against entityMap
  const resolveRealUuid = (rawUuid) => {
    if (!rawUuid || !/^00000000-temp/i.test(rawUuid)) return rawUuid
    if (!entityMap || typeof entityMap !== 'object') return rawUuid
    for (const [k, mappedUuid] of Object.entries(entityMap)) {
      if (!mappedUuid || /^00000000-temp/i.test(mappedUuid)) continue
      const cleanK = k.replace(/^(Weapon|Item|Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim().toLowerCase()
      if (text.toLowerCase().includes(cleanK)) {
        return mappedUuid
      }
    }
    return rawUuid
  }

  // 1. Preserve explicit character references passed in options (from disk parsing)
  if (options.character_ref) {
    String(options.character_ref).split(',').map(s => s.trim()).filter(Boolean).forEach(r => {
      const resolved = resolveRealUuid(r)
      if (!charRefs.includes(resolved)) charRefs.push(resolved)
    })
  }
  if (options.characterRefs || options.character_refs) {
    const refs = String(options.characterRefs || options.character_refs).split(',').map(s => s.trim()).filter(Boolean)
    refs.forEach(r => {
      const resolved = resolveRealUuid(r)
      if (!charRefs.includes(resolved)) charRefs.push(resolved)
    })
  }

  // 2. Preserve explicit item references passed in options
  if (options.item_ref) {
    String(options.item_ref).split(',').map(s => s.trim()).filter(Boolean).forEach(r => {
      if (!itemRefs.includes(r)) itemRefs.push(r)
    })
  }
  if (options.itemRefs || options.item_refs) {
    const refs = String(options.itemRefs || options.item_refs).split(',').map(s => s.trim()).filter(Boolean)
    refs.forEach(r => {
      if (!itemRefs.includes(r)) itemRefs.push(r)
    })
  }

  // 3. Dynamic lookup from entityMap based on tokens or text references ONLY when no explicit character ref was provided
  if (charRefs.length === 0 && entityMap && typeof entityMap === 'object') {
    for (const [key, uuid] of Object.entries(entityMap)) {
      if (!uuid) continue
      const isItem = /^(Weapon|Item|Artifact|Prop):/i.test(key)
      if (isItem) continue
      const tokenPattern = `@{${key}}`
      let hasToken = text.includes(tokenPattern) || text.includes(`@${uuid}`) || text.includes(key)
      if (!hasToken) {
        const cleanKey = key.replace(/^(Boss|Character|Commander|Lord|Instructor|Director):\s*/i, '').trim()
        const words = cleanKey.split(/\s+/).filter(w => w.length >= 3 && !COMMON_STOP_WORDS.has(w.toLowerCase()))
        const checkNames = [cleanKey, ...words]
        if (cleanKey.toLowerCase().includes('bramwell')) checkNames.push('Bram')
        if (cleanKey.toLowerCase().includes('cassian')) checkNames.push('Cassian')
        if (cleanKey.toLowerCase().includes('vance')) checkNames.push('Vance')
        if (cleanKey.toLowerCase().includes('lu chen')) checkNames.push('Lu Chen')
        for (const n of checkNames) {
          if (!n || COMMON_STOP_WORDS.has(n.toLowerCase())) continue
          const re = new RegExp(`\\b${n}\\b`, 'i')
          if (re.test(text)) {
            hasToken = true
            break
          }
        }
      }
      if (hasToken) {
        if (key === 'Caelen Vance - Student Archer' && text.includes('Caelen Vance - Phantom Marksman')) {
          continue
        }
        if (!charRefs.includes(uuid)) charRefs.push(uuid)
      }
    }
  }

  // 4. Dynamic lookup from entityMap for items/weapons (INDEPENDENT of whether charRefs has characters)
  if (itemRefs.length === 0 && entityMap && typeof entityMap === 'object') {
    for (const [key, uuid] of Object.entries(entityMap)) {
      if (!uuid) continue
      const isItem = /^(Weapon|Item|Artifact|Prop):/i.test(key) || /blade|dao|bow|arrow|orb|console|spectrometer|stele/i.test(key)
      if (isItem) {
        const tokenPattern = `@{${key}}`
        const cleanKey = key.replace(/^(Weapon|Item|Artifact|Prop):\s*/i, '').trim()
        if (text.includes(tokenPattern) || text.includes(`@${uuid}`) || text.includes(key) || text.includes(cleanKey)) {
          if (!itemRefs.includes(uuid)) itemRefs.push(uuid)
        }
      }
    }
  }

  // 5. Hardcoded fallbacks for Series 04 & Series 02 if entityMap is missing specific keys
  if (text.includes('Caelen Vance - Phantom Marksman')) {
    const uuid = (entityMap && entityMap['Caelen Vance - Phantom Marksman']) || 'f16555b2-8ae8-40bb-8027-5b8a0c9d859c'
    if (!charRefs.includes(uuid)) charRefs.push(uuid)
    const studentUuid = (entityMap && entityMap['Caelen Vance - Student Archer']) || 'bbf8e245-73fa-42d8-a81c-1bdb468885de'
    const sIdx = charRefs.indexOf(studentUuid)
    if (sIdx !== -1) charRefs.splice(sIdx, 1)
  } else if (text.includes('Caelen Vance - Student Archer') || text.includes('Caelen Vance')) {
    const uuid = (entityMap && entityMap['Caelen Vance - Student Archer']) || 'bbf8e245-73fa-42d8-a81c-1bdb468885de'
    if (!charRefs.includes(uuid)) charRefs.push(uuid)
  }

  if (text.includes('Ignis Sterling')) {
    const uuid = (entityMap && entityMap['Ignis Sterling - Pyromancer Scion']) || 'a60b6666-0190-458f-9307-37ae95241946'
    if (!charRefs.includes(uuid)) charRefs.push(uuid)
  }
  if (text.includes('Lyra Mercer')) {
    const uuid = (entityMap && entityMap['Lyra Mercer - Wind Scout']) || 'fc5502df-6a3c-4837-b36a-d2b69a6df780'
    if (!charRefs.includes(uuid)) charRefs.push(uuid)
  }
  if (text.includes('Boris Vane')) {
    const uuid = (entityMap && entityMap['Instructor Boris Vane']) || '11108672-a1f5-4e55-973c-84be752da3ce'
    if (!charRefs.includes(uuid)) charRefs.push(uuid)
  }
  if (text.includes('Keith Holloway') || text.includes('Director Holloway')) {
    const uuid = (entityMap && entityMap['Director Keith Holloway']) || 'b1c1a7f7-c0bf-4d5d-9c99-24759da75fb7'
    if (!charRefs.includes(uuid)) charRefs.push(uuid)
  }

  // Series 04 Items / Weapons fallbacks
  if (text.includes('Jade Spirit Blade') || text.includes('Jade Dao') || text.includes("Gu Tianyu's Jade Spirit Blade")) {
    const uuid = (entityMap && (entityMap["Gu Tianyu's Jade Spirit Blade"] || entityMap['Weapon: Gu Tianyu\'s Jade Spirit Blade'])) || '80875c1d-weapon-dao0-0001-000000000008'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Tactical Spirit Spectrometer') || text.includes('spirit-spectrometer')) {
    const uuid = (entityMap && (entityMap['Tactical Spirit Spectrometer'] || entityMap['Prop: Tactical Spirit Spectrometer'])) || '3b815452-prop-meter-0002-000000000009'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Heaven-Earth Golden Stele') || text.includes('Heaven-Earth Stele')) {
    const uuid = (entityMap && (entityMap['Heaven-Earth Golden Stele'] || entityMap['Artifact: Heaven-Earth Stele'])) || 'a0000000-artf-stele-0003-000000000010'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }

  // Series 02 Items / Weapons fallbacks
  if (text.includes('Void-Strung Heavy Recurve')) {
    const uuid = (entityMap && entityMap['Weapon: Void-Strung Heavy Recurve']) || 'e4b863c6-f8cf-46f4-b5c8-b9ef69dc0893'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Ashwood Training Bow')) {
    const uuid = (entityMap && entityMap['Weapon: Ashwood Training Bow']) || 'dedb670f-9670-4341-a5eb-6587353d5cd7'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Ethereal Siphon Arrow')) {
    const uuid = (entityMap && entityMap['Item: Ethereal Siphon Arrow']) || 'f6d5a575-29d5-4f37-a49e-eae728456316'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Academy Awakening Orb')) {
    const uuid = (entityMap && entityMap['Item: Academy Awakening Orb']) || 'ceed8950-f216-41f8-ab79-c38f199cf85c'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('VIP Radar Console')) {
    const uuid = (entityMap && entityMap['Item: VIP Radar Console']) || '4a5d1028-8a9a-4cba-8398-b69cd5eb715f'
    if (!itemRefs.includes(uuid) && !charRefs.includes(uuid)) itemRefs.push(uuid)
  }

  const uniqueChars = [...new Set(charRefs.filter(Boolean))]
  const uniqueItems = [...new Set(itemRefs.filter(Boolean))]

  let openTag = `<scene id="${tag}" filename="${filename}"`
  if (uniqueChars.length === 1) {
    openTag += ` character_ref="${uniqueChars[0]}"`
  } else if (uniqueChars.length > 1) {
    openTag += ` character_refs="${uniqueChars.join(', ')}"`
  }

  if (uniqueItems.length === 1) {
    openTag += ` item_ref="${uniqueItems[0]}"`
  } else if (uniqueItems.length > 1) {
    openTag += ` item_refs="${uniqueItems.join(', ')}"`
  }
  openTag += `>`

  const promptBody = text
  const cleanBody = promptBody.replace(/^#\s*Filename:[^\n]*\n?/im, '').trim()
  const finalPrompt = transformTokens(cleanBody, entityMap, mode)
  return `${openTag}\n# Filename: ${filename}\n${finalPrompt}\n</scene>`
}
