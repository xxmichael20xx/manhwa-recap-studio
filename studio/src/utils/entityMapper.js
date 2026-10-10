/**
 * Google Flow Entity ID Mapper & Token Transformer Utility
 */

export function parseEntityMappingText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { entities: {}, count: 0 }
  }

  const entities = {}
  const lines = rawText.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    
    // Ignore category headers
    if (/^(character entities|weapon & item entities|item entities|weapon entities|entities)/i.test(trimmed)) {
      continue
    }

    // Match "Name: UUID" or "Name : UUID" (where Name can contain colons e.g. "Weapon: Ashwood Training Bow")
    const match = trimmed.match(/^(.*?)\s*:\s*([a-f0-9\-]{8,})\s*$/i)
    if (match) {
      const key = match[1].trim()
      const uuid = match[2].trim()
      if (key && uuid) {
        entities[key] = uuid
      }
    }
  }

  return {
    entities,
    count: Object.keys(entities).length
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
        const strippedK = k.replace(/^(Weapon|Item):\s*/i, '').trim().toLowerCase()
        const strippedKey = trimmedKey.replace(/^(Weapon|Item):\s*/i, '').trim().toLowerCase()
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
      
      // Also match stripped key (e.g. @Void-Strung Heavy Recurve)
      const strippedKey = key.replace(/^(Weapon|Item):\s*/i, '').trim()
      if (strippedKey !== key) {
        const escapedStripped = strippedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const strippedRegex = new RegExp(`@${escapedStripped}(?![a-zA-Z0-9_-])`, 'g')
        transformed = transformed.replace(strippedRegex, `@${uuid}`)
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

export const LEAN_MODE_STORAGE_KEY = 'manhwa_recap_lean_prompt_mode'

export function stripBoilerplateTail(text) {
  if (!text || typeof text !== 'string') return ''

  // 1. Common style intro marker: "dark fantasy action manhwa..."
  const styleMatch = text.search(/[,.\s]+dark fantasy action manhwa/i)
  if (styleMatch !== -1) {
    return text.slice(0, styleMatch).trim()
  }

  // 2. Anatomical negative tail marker if style phrase wasn't found
  const anatomyMatch = text.search(/[,.\s]+(?:anatomically correct hands|no character cloning|textless manhwa illustration)/i)
  if (anatomyMatch !== -1) {
    return text.slice(0, anatomyMatch).trim()
  }

  return text.trim()
}

export function buildSceneXmlNode(tag, filename, promptText, entityMap = {}, mode = 'token', options = {}) {
  const isLean = Boolean(options && options.lean)
  const charRefs = []
  const itemRefs = []
  const text = promptText || ''

  // 1. Preserve explicit character references passed in options (from disk parsing)
  if (options.character_ref) {
    String(options.character_ref).split(',').map(s => s.trim()).filter(Boolean).forEach(r => {
      if (!charRefs.includes(r)) charRefs.push(r)
    })
  }
  if (options.characterRefs || options.character_refs) {
    const refs = String(options.characterRefs || options.character_refs).split(',').map(s => s.trim()).filter(Boolean)
    refs.forEach(r => {
      if (!charRefs.includes(r)) charRefs.push(r)
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

  // 3. Dynamic lookup from entityMap based on tokens or text references
  if (entityMap && typeof entityMap === 'object') {
    for (const [key, uuid] of Object.entries(entityMap)) {
      if (!uuid) continue
      const isItem = /^(Weapon|Item):/i.test(key)
      const tokenPattern = `@{${key}}`
      const hasToken = text.includes(tokenPattern) || text.includes(`@${uuid}`) || text.includes(key)
      if (hasToken) {
        if (isItem) {
          if (!itemRefs.includes(uuid)) itemRefs.push(uuid)
        } else {
          if (key === 'Caelen Vance - Student Archer' && text.includes('Caelen Vance - Phantom Marksman')) {
            continue
          }
          if (!charRefs.includes(uuid)) charRefs.push(uuid)
        }
      }
    }
  }

  // 4. Hardcoded fallbacks for Series 02 if entityMap is missing specific keys
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

  // Items fallbacks
  if (text.includes('Void-Strung Heavy Recurve')) {
    const uuid = (entityMap && entityMap['Weapon: Void-Strung Heavy Recurve']) || 'e4b863c6-f8cf-46f4-b5c8-b9ef69dc0893'
    if (!itemRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Ashwood Training Bow')) {
    const uuid = (entityMap && entityMap['Weapon: Ashwood Training Bow']) || 'dedb670f-9670-4341-a5eb-6587353d5cd7'
    if (!itemRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Ethereal Siphon Arrow')) {
    const uuid = (entityMap && entityMap['Item: Ethereal Siphon Arrow']) || 'f6d5a575-29d5-4f37-a49e-eae728456316'
    if (!itemRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('Academy Awakening Orb')) {
    const uuid = (entityMap && entityMap['Item: Academy Awakening Orb']) || 'ceed8950-f216-41f8-ab79-c38f199cf85c'
    if (!itemRefs.includes(uuid)) itemRefs.push(uuid)
  }
  if (text.includes('VIP Radar Console')) {
    const uuid = (entityMap && entityMap['Item: VIP Radar Console']) || '4a5d1028-8a9a-4cba-8398-b69cd5eb715f'
    if (!itemRefs.includes(uuid)) itemRefs.push(uuid)
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

  const promptBody = isLean ? stripBoilerplateTail(text) : text
  const cleanBody = promptBody.replace(/^#\s*Filename:[^\n]*\n?/im, '').trim()
  const finalPrompt = transformTokens(cleanBody, entityMap, mode)
  return `${openTag}\n# Filename: ${filename}\n${finalPrompt}\n</scene>`
}
