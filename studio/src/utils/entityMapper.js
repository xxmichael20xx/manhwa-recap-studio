import { compilePromptDna } from './promptDnaCompiler.js'

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

      // Register smart manhwa narrative aliases dynamically
      // 1. Strip role/type prefixes like "Character: ", "Boss: ", etc.
      const strippedKey = cleanName.replace(/^(Boss|Character|Commander|Lord|Instructor|Director|Leader|Proctor|Examiner|Master|Captain|High-Ranking Official):\s*/i, '').trim()
      if (strippedKey && strippedKey !== cleanName) {
        entities[strippedKey] = uuid
      }

      // 2. Strip parenthetical role or phase: "Ace Miller (Craftsman)" -> "Ace Miller"
      const noParen = cleanName.replace(/\s*\([^)]*\)/g, '').trim()
      if (noParen && noParen !== cleanName) {
        entities[noParen] = uuid
      }

      // 3. Strip hyphenated variant suffix: "Caelen Vance - Student Archer" -> "Caelen Vance"
      if (cleanName.includes(' - ')) {
        const baseName = cleanName.split(' - ')[0].trim()
        if (baseName && baseName.length >= 3) {
          entities[baseName] = uuid
        }
      }

      // 4. Strip aristocratic or military title prefixes: "Grand Duke Vane Valerius" -> "Grand Duke Vane", "Vane Valerius"
      const titleMatch = cleanName.match(/^(Grand Duke|Duke|Lord|Lady|Prince|Princess|King|Queen|Chief Proctor|Chief|Senior Examiner|Head Examiner|Examiner|Proctor|Instructor|Commander|Director|Master|Captain)\s+([A-Za-z]+)(?:\s+([A-Za-z]+))?/i)
      if (titleMatch) {
        const title = titleMatch[1].trim()
        const first = titleMatch[2].trim()
        const last = (titleMatch[3] || '').trim()
        entities[`${title} ${first}`] = uuid
        if (last) {
          entities[`${first} ${last}`] = uuid
        }
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
    return localStorage.getItem(TAG_MODE_STORAGE_KEY) || localStorage.getItem(LEGACY_TAG_MODE_STORAGE_KEY) || 'token'
  } catch (e) {
    return 'token'
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
        const cleanKey = key.replace(/^(Boss|Character|Commander|Lord|Instructor|Director|Leader|Proctor|Examiner|Master|Captain):\s*/i, '').trim()
        const baseName = cleanKey.split(/\s*[-–—(]\s*/)[0].trim()
        const words = baseName.split(/\s+/).filter(w => w.length >= 3 && !COMMON_STOP_WORDS.has(w.toLowerCase()))
        const checkNames = [cleanKey, baseName, ...words]
        for (const n of checkNames) {
          if (!n || COMMON_STOP_WORDS.has(n.toLowerCase())) continue
          const escaped = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const re = new RegExp(`\\b${escaped}\\b`, 'i')
          if (re.test(text)) {
            hasToken = true
            break
          }
        }
      }
      if (hasToken) {
        // Universal dynamic disambiguation for hyphenated variants (e.g. "Name - Form A" vs "Name - Form B")
        if (key.includes(' - ')) {
          const [baseNamePart, variantPart] = key.split(' - ').map(s => s.trim())
          const escapedBase = baseNamePart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const variantPattern = new RegExp(`${escapedBase}\\s*-\\s*([A-Za-z0-9\\s]+)`, 'i')
          const textMatch = text.match(variantPattern)
          if (textMatch && textMatch[1]) {
            const mentionedVariant = textMatch[1].trim().toLowerCase()
            const thisVariant = variantPart.toLowerCase()
            if (!mentionedVariant.includes(thisVariant) && !thisVariant.includes(mentionedVariant)) {
              continue
            }
          }
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

  let promptBody = text
  if (options && (options.characters || options.models)) {
    promptBody = compilePromptDna(promptBody, options.characters || options.models)
  }
  const cleanBody = promptBody.replace(/^#\s*Filename:[^\n]*\n?/im, '').trim()
  const finalPrompt = transformTokens(cleanBody, entityMap, mode)
  return `${openTag}\n# Filename: ${filename}\n${finalPrompt}\n</scene>`
}
